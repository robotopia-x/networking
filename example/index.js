var ps = require('../index.js')
var hub = 'http://localhost:8042'

var peerOne = new ps({main: true, GID: 'Group', hubURL: hub})