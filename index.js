var Ps = require('./lib/index.js')
var hub = 'http://localhost:8042'
// var hub = 'signalhub.perguth.de'

window.startMain = function () {
  console.log('starting a main')
  Ps({isMain: true, GID: 'Group', hubURL: hub, log: true})
}

window.startClient = function () {
  console.log('starting a client')
  Ps({isMain: false, GID: 'Group', hubURL: hub, log: true})
}
