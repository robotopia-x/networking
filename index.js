var ps = require('./lib/index.js')
var hub = 'http://localhost:8042'
// var hub = 'signalhub.perguth.de'

localStorage.debug = "peer-star"

window.startMain = function () {
  console.log('starting a main')
  ps({isMain: true, GID: 'Group', hubURL: hub})
}

window.startClient = function () {
  console.log('starting a client')
  ps({isMain: false, GID: 'Group', hubURL: hub})
}