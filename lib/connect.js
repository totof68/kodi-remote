const kodi = require('node-kodi'); 
var shared = require('./shared');
const Promise = require('bluebird');


module.exports = function(identifier){

  // Already connected
  if(typeof(shared.device[identifier]) !== 'undefined')
    return true;

  //var host, port;
  var identifiers = identifier.split(':');
  var host = identifiers[0];
  var port = identifiers[1];

  sails.log.info(`Kodi module : Try connecting to ${host}:${port}`);

  shared.device[identifier] = new kodi({
    url: host + ':' + port,
    user: 'kodi',
    password: 'kodi',
    debug: false
  });

  var newDevice = {
      device: {
          name: `Kodi ${host}`,
          protocol: 'kodi',
          service: 'kodi',
          identifier: identifier
      },
      types: [
        {
          name:'Connected',
          type: 'binary',
          //tag: '',
          sensor: false,
          //unit: '',
          min: 0,
          max:1,
          display: false,
          identifier: `${identifier}-connected`
        },
        {
          name:'status',
          type: 'status',
          //tag: '',
          sensor: false,
          //unit: '',
          min: 0,
          max:2,
          display: false,
          identifier: `${identifier}-status`
        }
      ]
    };

    // Create the device
    gladys.device.create(newDevice)
      // Then set connected value
      .then(() => gladys.deviceState.createByDeviceTypeIdentifier(`${identifier}-connected`, 'kodi', {value: 1}))
      .catch((err) => sails.log.error(`Kodi module : Error while creating device : ${err}`));

  return true;

};
