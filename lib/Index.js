module.exports = PeerStar

const SimplePeer = require('simple-peer')
const signalhub = require('signalhub')
const inherits = require('inherits')
const events = require('events')
const through = require('through2')
const once = require('once')
const cuid = require('cuid')
const debug = require('debug')('peer-star')
const MAIN = 'MAIN'
const ALL = 'ALL'

function PeerStar (opts) {
  if (!(this instanceof PeerStar)) return new PeerStar(opts)
  if (!opts) {
    throw new Error('Please pass an opts object with GID and hubURL!')
  }
  if (!opts.GID) {
    throw new Error('group ID required!')
  }
  if (!opts.hubURL) {
    throw new Error('hubURL required!')
  }

  var hubURL, GID

  var self = this
  self.wrap = opts.wrap || function (data) { return data }
  self.unwrap = opts.unwrap || function (data) { return data }
  self.hub = null
  self.wrtc = opts.wrtc
  self.channelConfig = opts.channelConfig
  self.config = opts.config
  self.stream = opts.stream
  self.offerConstraints = opts.offerConstraints || {}
  self.maxPeers = opts.maxPeers || Infinity
  self.closed = false
  self.contacts = {}
  self.peers = []
  self.CID = null

  GID = opts.GID
  hubURL = opts.hubURL
  if (opts.isMain) {
    self.CID = MAIN
  } else {
    self.CID = cuid()
  }
  self.contacts[self.CID] = self

  function startUp () {
    self.hub = signalhub(GID, hubURL)
    self.hub.subscribe(ALL).pipe(through.obj(function (data, enc, cb) {
      data = self.unwrap(data, ALL)
      if (self.closed || !data) return cb()

      if (data.from === self.CID) {
        debug('skipping self', data.from)
        return cb()
      }

      if (!self.contacts[data.from] && data.type === 'connect' && data.from === MAIN) {
        debug('connecting to MAIN (as initiator)', data.from)
        var peer = new SimplePeer({
          wrtc: self.wrtc,
          initiator: true,
          channelConfig: self.channelConfig,
          config: self.config,
          stream: self.stream,
          offerConstraints: self.offerConstraints
        })

        setup(self, peer, MAIN)
        self.contacts[data.from] = peer
      }

      cb()
    }))
    self.hub.subscribe(self.CID).once('open', connect.bind(null, self)).pipe(through.obj(function (data, enc, cb) {
      data = self.unwrap(data, self.CID)
      if (self.closed || !data) return cb()

      var peer = self.contacts[data.from]
      if (!peer) {
        if (!data.signal || data.signal.type !== 'offer') {
          debug('skipping non-offer', self.CID)
          return cb()
        }

        debug('connecting to new peer: ' + data.from, self.CID)
        peer = self.contacts[data.from] = new SimplePeer({
          wrtc: self.wrtc,
          channelConfig: self.channelConfig,
          config: self.config,
          stream: self.stream,
          offerConstraints: self.offerConstraints
        })

        setup(self, peer, data.from)
      }

      debug('signalling to ' + data.from + ': ', data.signal, self.CID)
      peer.signal(data.signal)
      cb()
    }))
  }

  function setup (star, peer, id) {
    peer.on('connect', function () {
      debug('connected to peer ' + id)
      star.peers.push(peer)
      star.emit('peer', peer, id)
      star.emit('connect', peer, id)
    })

    var onclose = once(function (err) {
      debug('disconnected from peer: ' + id + (err ? ', ' + err : ''))
      if (star.contacts[id] === peer) delete star.contacts[id]
      var i = star.peers.indexOf(peer)
      if (i > -1) star.peers.splice(i, 1)
      star.emit('disconnect', peer, id)
    })

    var signals = []
    var sending = false

    function kick () {
      if (star.closed || sending || !signals.length) return
      sending = true
      var data = {from: star.CID, signal: signals.shift()}
      data = star.wrap(data, id)
      debug('returndata: ', data, id)
      star.hub.broadcast(id, data, function () {
        sending = false
        kick()
      })
    }

    peer.on('signal', function (sig) {
      debug('signal incoming: ', id, sig)
      signals.push(sig)
      kick()
    })

    peer.on('error', onclose)
    peer.once('close', onclose)
  }

  function connect (star) {
    if (star.closed || !opts.isMain) return
    var data = {type: 'connect', from: self.CID}
    data = star.wrap(data, ALL)
    star.hub.broadcast(ALL, data, function () {
      setTimeout(connect.bind(null, star), Math.floor(Math.random() * 2000) + 6000)
    })
  }

  startUp()

  return self
}

inherits(PeerStar, events.EventEmitter)

PeerStar.WEBRTC_SUPPORT = SimplePeer.WEBRTC_SUPPORT

PeerStar.prototype.close = function (cb) {
  if (this.closed) return
  this.closed = true

  if (cb) this.once('close', cb)

  var self = this
  this.hub.close(function () {
    var len = self.peers.length
    if (len > 0) {
      var closed = 0
      self.peers.forEach(function (peer) {
        peer.once('close', function () {
          if (++closed === len) {
            self.emit('close')
          }
        })
        process.nextTick(function () {
          peer.destroy()
        })
      })
    } else {
      self.emit('close')
    }
  })
}
