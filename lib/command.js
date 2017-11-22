var shared = require('./shared');

module.exports = function command(params) {

    return gladys.deviceType.getInRoom(params.rooms[0])
    .then((deviceTypes) => {
        for(var i = 0; i < deviceTypes.length; i++) {
            if(deviceTypes[i].service === 'kodi') {
                var id = deviceTypes[i].identifier;

                params.kodi = shared.device[id];
                switch(params.label) {
                    case 'play-movie':
                        return playMovie(params);
                        break;
                    case 'play-pause-movie':
                        return params.kodi.player.playPause();
                        break;
                    case 'stop-movie':
                        return params.kodi.player.stop()
                        break;
                    case 'scan-library':
                        return params.kodi.videolibrary.scan();
                        break;
                    case 'get-movie-detail':
                        return getMovieDetail(params.kodi);
                        break;
                    default:
                        return
                }
            }
        }
    });
}

getMovieDetail = function(kodi) {
    params = {"properties": ["title", "genre", "country", "year", "director"]};
    return kodi.player.getCurrentlyPlayingVideo(params)
    .then((details) => {
        return {
            "scope": {
                "%MOVIE_TITLE%": details.item.title,
                "%MOVIE_YEAR%": details.item.year,
                "%MOVIE_COUNTRY": details.item.country
            },
            "label": "movie-details"
        }
    });
}

playMovie = function(params) {
    var movie = {"title": "", "file": ""};

    return listMovies(params.kodi)
    .then((result) => {
        for(var i = 0; i < result.movies.length; i++) {
             var file = result.movies[i].file.split('/'); // We split per /
             file = file[file.length-1].split('.'); // we get only last element which should be file name (maybe kodi api could provide)
             file.pop()
             file = file.join(' '); // we remove extension, such as .avi
             if(present(params.replacedText, file) || present(params.replacedText, result.movies[i].label)){
                   if(movie.title.length < result.movies[i].title.length) {
                       // it means title match better than old one, it should be this movie we want
                       movie = {"title": result.movies[i].title, "file": result.movies[i].file};
                   }
             }
        }

        sails.log.info('Kodi :: Start playing ' +  movie.title);
        return params.kodi.player.open({"item": {"file": movie.file}});
        params.kodi.input.left(); //just to disabled screensaver
        params.kodi.input.left();
    })
    .then(() => {
        return Promise.resolve({
            label: "movie-started"
        });
    })
    .catch(() => {
        return Promise.resolve({
            label: "movie-not-found"
        });
   });
};

listMovies = function(api) {
   return  api.videolibrary.getMovies({
      properties: ['title', 'file']
   });

}

present = function(text, movie){
    return (text.toLowerCase().indexOf(movie.toLowerCase()) > -1);
}
