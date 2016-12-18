var ps = require('../index.js')
var hub = 'http://localhost:8042'
//var hub = 'signalhub.perguth.de'

window.startMain = function () {
  console.log('starting a main')
  var peerMain = new ps({main: true, GID: 'Group', hubURL: hub})
}

window.startClient = function () {
  console.log('starting a client')
  var peerClient = new ps({main: false, GID: 'Group', hubURL: hub})
}