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
opts.isMain = true //Set this flag for the center of your star. Make sure to only have one MAIN!
var star = ps(opts)

star.on('peer', (peer, id) => {
    console.log('connected to a new peer:', id)
    console.log('total peers:', star.peers.length)
  })
  star.on('disconnect', (peer, id) => {
    console.log('disconnected from a peer:', id)
    console.log('total peers:', star.peers.length)
  })
```

## API

* .on('connect', function (peer, id) {}) - function to handle a new peer (same as 'peer')
* .on('peer', function (peer, id) {}) - function to handle a new peer (same as 'connect')
* .on('disconnect', function (peer, id) {}) - function to handle a disconnect
* .peers - a list of peers connected. Note that the MAIN will have quite some while the clients should only have the MAIN
* .contacts - similar to .peers, but already holds the peers while they have not been fully connected
* .CID - the own ID, for the MAIN this will be 'MAIN'
* .closed - true when the star is closed or in the process of doing so


## Other Options
* wrap is a function that gets a 'data' JSON Object and is required to return one as well. Can be used to modify packets for the signalling process
* unwrap works the same way 'wrap' works, just the other way round
