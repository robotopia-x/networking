var ps = require('./lib/index.js')
var hub = 'http://localhost:8042'
// var hub = 'signalhub.perguth.de'

localStorage.debug = "peer-star"

window.startMain = function () {
  console.log('starting a main')
  nodes.add([{id: 'ME', label: 'ME'}])
  var p = ps({isMain: true, GID: 'Group', hubURL: hub})
  p.on('connect', function (peer, id) {
    nodes.add([{id: id, label: id}])
    edges.add([{from: id, to: 'ME'}])
  })
  p.on('disconnect', function (peer, id) {
    nodes.remove(id)
    edges.remove(id)
  })
}

window.startClient = function () {
  console.log('starting a client')
  nodes.add([{id: 'ME', label: 'ME'}])
  var p = ps({isMain: false, GID: 'Group', hubURL: hub})
  p.on('connect', function (peer, id) {
    nodes.add([{id: id, label: id}])
    edges.add([{from: id, to: 'ME'}])
  })
  p.on('disconnect', function (peer, id) {
    nodes.remove(id)
    edges.remove(id)
  })
}

var nodes = new vis.DataSet({});

// create an array with edges
var edges = new vis.DataSet({});

// create a network
var container = document.getElementById('visualization');
var data = {
  nodes: nodes,
  edges: edges
};
var options = {};
var network = new vis.Network(container, data, options);
