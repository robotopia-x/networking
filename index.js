var ps = require('./lib/index.js')
var hub = 'http://localhost:8042'
//var hub = 'signalhub.perguth.de'

window.startMain = function () {
  console.log('starting a main')
  var peerMain = new ps({isMain: true, GID: 'Group', hubURL: hub})
}

window.startClient = function () {
  console.log('starting a client')
  var peerClient = new ps({isMain: false, GID: 'Group', hubURL: hub})
}