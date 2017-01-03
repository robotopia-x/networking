# Simple Star Topography for WebRtc
Basically a modified version of [WebRTCSwarm](https://github.com/mafintosh/webrtc-swarm) for the different topography

## Usage

Include Repo in your package.json eg.:  
`"peer-star": "git://github.com/hdm-project/networking.git/#9b708f0e3ad998215342fc381ecef166c87dff7d"`  
(you can leave out the '#' and the following characters. That part defines the commit of the repo to be used in your application.  
```js
const ps = require('peer-star')
var opts = {}
opts.GID = 'myStarGroup' //required, all ps instances with this name will form a star
opts.hubURL = 'localhost:8042' //required. point to your Signalling Hub
var star = ps(opts)
```

## Other Options
* wrap is a function that gets a 'data' JSON Object and is required to return one as well. Can be used to modify packets for the signalling process
* unwrap works the same way 'wrap' works, just the other way round
