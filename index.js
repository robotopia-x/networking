var ps = require('./lib/index.js')
var vis = require('vis')
var hub = 'http://localhost:8042'
var stars = {}

localStorage.debug = 'peer-star' // eslint-disable-line

window.buttonMain = function () {
  if (!stars.main) {
    document.getElementById('main').innerHTML = 'Stop Main'
    console.log('starting a main')
    nodes.add([{id: 'ME', label: 'ME'}])
    var p = stars.main = ps({isMain: true, GID: 'Group', hubURL: hub})
    p.on('connect', function (peer, id) {
      nodes.add([{id: id, label: id}])
      edges.add([{from: id, to: 'ME'}])
    })
    p.on('disconnect', function (peer, id) {
      nodes.remove(id)
      edges.remove(id)
    })
  } else {
    stars.main.close(function () {
      delete stars.main
      edges.clear()
      nodes.clear()
      document.getElementById('main').innerHTML = 'Start Main'
    })
  }
}

window.buttonClient = function () {
  if (!stars.client) {
    document.getElementById('client').innerHTML = 'Stop Client'
    console.log('starting a client')
    nodes.add([{id: 'ME', label: 'ME'}])
    var p = stars.client = ps({isMain: false, GID: 'Group', hubURL: hub})
    p.on('connect', function (peer, id) {
      nodes.add([{id: id, label: id}])
      edges.add([{from: id, to: 'ME'}])
    })
    p.on('disconnect', function (peer, id) {
      nodes.remove(id)
      edges.remove(id)
    })
  } else {
    stars.client.close(function () {
      delete stars.client
      edges.clear()
      nodes.clear()
      document.getElementById('client').innerHTML = 'Start Client'
    })
  }
}

var nodes = new vis.DataSet({}) // eslint-disable-line no-new-object
var edges = new vis.DataSet({}) // eslint-disable-line no-new-object
var container = document.getElementById('visualization')
var data = {
  nodes: nodes,
  edges: edges
}
var options = {}
var network = new vis.Network(container, data, options) // eslint-disable-line
