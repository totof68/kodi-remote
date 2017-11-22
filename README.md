# Gladys Kodi remote
Require Gladys >= 3.3.2

## Features

- Give you ability to control kodi by voice
- You juste need to add your own sentences with following commands:

play-movie
play-pause-movie
stop-movie
scan-library
get-movie-detail

## Installation
- Install the module in Gladys
- Reboot Gladys
- In Kodi, go to Settings => Services => Remote Control then enabled the option "Allow programs on other systems to control XBMC"
- In Gladys, go to "Parameters" => "Parameters" => "Parameters" in the dashboard, and create parameters:
 - `kodi_http_devices` host:port separated by comma. (raspbmc.local:80,192.168.0.1:80)
- In Gladys, go to "Modules" => "Installed modules", and click on the configure button.
- Your device(s) should be available(s) in devices page, you can update the room of device(s).

