module.exports = PeerStar

const webrtcSwarm = require('webrtc-swarm')
const signalhub = require('signalhub')
const cuid = require('cuid')
const MAIN = 'MAIN'
const ALL = 'ALL'
const TYPES = {
  CONTACTS: 'contacts',
  EXTERNAL: 'external',
  NEWCID: 'newCID',
  DENYCID: 'denyCID',
  ACCEPTCID: 'acceptCID',
  REQUESTLIST: 'requestList'
}

function PeerStar (opts) {
  if (!opts) {
    throw new Error('Please pass an opts object with GID and hubURL!')
  }
  enableLog = opts.log
  if (!opts.GID) {
    throw new Error('group ID required!')
  }
  if (!opts.hubURL) {
    throw new Error('hubURL required!')
  }

  var self = this

  var hubURL, GID, CID, Contacts, Swarms, enableLog

  GID = opts.GID
  hubURL = opts.hubURL
  Contacts = []
  if (opts.isMain) {
    CID = MAIN
    Contacts.push(CID)
  }

  Swarms = {
    all: null,
    self: null,
    out: null
  }

  function startUp () {
    Swarms.all = createSwarmForCID(ALL)
    Swarms.all.on('peer', (peer, id) => {
      debug('connected', id, ALL)
      addListenersToPeer(peer, id, ALL)
    })
    Swarms.out = createSwarmForCID(MAIN)
    Swarms.out.on('peer', (peer, id) => {
      debug('connected', id, MAIN)
      addListenersToPeer(peer, id, MAIN)
      if (!opts.isMain) {
        debug('requesting contacts', id, MAIN)
        peer.send(createPacket(TYPES.REQUESTLIST, {}))
      }
    })
  }

  function finishStartUp () {
    Swarms.self = createSwarmForCID(CID)
    Swarms.out.close()
  }

  function addListenersToPeer (peer, peerID, swarmID) {
    peer.on('data', dataRouting)
    peer.on('stream', (stream) => {
      debug('Stream received - no support!: ' + stream, peerID, swarmID)
    })
    peer.on('close', () => {
      debug('peer closed', peerID, swarmID)
    })
    peer.on('error', (err) => {
      debug('ERROR ' + err, peerID, swarmID)
    })

    function dataRouting (data) {
      try {
        var stuff = JSON.parse(String(data))
      } catch (err) {
        debug('ERROR parsing data...', peerID, swarmID, true)
      }
      if (!stuff.hasOwnProperty('Type')) {
        debug('data event without type: ' + JSON.stringify(stuff), peerID, swarmID)
        return
      }
      if (stuff.Type === TYPES.EXTERNAL) {
        debug('data event for user: ' + JSON.stringify(stuff), peerID, swarmID)
        return
      }
      if (stuff.Type === TYPES.REQUESTLIST) {
        debug('Contacts were requested', peerID, swarmID)
        peer.send(createPacket(TYPES.CONTACTS, Contacts))
        return
      }
      if (stuff.Type === TYPES.CONTACTS) {
        processAsContactData(stuff, peer)
        return
      }
      if (stuff.Type === TYPES.NEWCID) {
        processAsNewCID(stuff, peer)
        return
      }
      if (stuff.Type === TYPES.DENYCID) {
        CID = 0
        debug('CID was rejected', peerID, swarmID)
        processAsContactData(stuff, peer)
        return
      }
      if (stuff.Type === TYPES.ACCEPTCID) {
        debug('CID was accepted', peerID, swarmID)
        finishStartUp()
        return
      }
      debug('data Type unknown: ' + stuff.Type, peerID, swarmID)
    }

    function processAsNewCID (data, peer) {
      var newcid = data.Data
      debug('received CID: ' + JSON.stringify(newcid), peerID, swarmID)
      if (Contacts.indexOf(newcid) >= 0) {
        debug('denying CID: ' + JSON.stringify(newcid), peerID, swarmID)
        peer.send(createPacket(TYPES.DENYCID, Contacts))
      }
      debug('accepting CID: ' + JSON.stringify(newcid), peerID, swarmID)
      Contacts.push(newcid)
      peer.send(createPacket(TYPES.ACCEPTCID))
      broadcastOnAll(createPacket(TYPES.CONTACTS, Contacts))
    }

    function processAsContactData (data, peer) {
      if (data.Origin !== MAIN) {
        return
      }
      debug('received contacts: ' + JSON.stringify(data.Data), peerID, swarmID)
      Contacts = data.Data
      if (!CID) {
        CID = setupAnOwnCID(Contacts, peer)
      }
    }
  }

  function setupAnOwnCID (existingCIDs, mainPeer) {
    var lCID = generateCID(existingCIDs)
    mainPeer.send(createPacket(TYPES.NEWCID, lCID))

    return lCID

    function generateCID (existingCIDs) {
      var id = cuid()
      if (existingCIDs.indexOf(id) < 0) {
        console.log('generated new ID: ' + id)
        return id
      }
      return generateCID(existingCIDs)
    }
  }

  function createSwarmForCID (targetCID) {
    var swarmID, hub
    swarmID = GID + targetCID
    debug('created', '', swarmID)
    hub = signalhub(swarmID, hubURL)
    return webrtcSwarm(hub)
  }

  function broadcastOnAll (packet) {
    debug('broadcasting ' + JSON.stringify(packet), 'all peers', ALL)
    var i, peer
    for (i in Swarms.all.peers) {
      peer = Swarms.all.peers[i]
      peer.send(packet)
    }
  }

  function createPacket (Type, Data) {
    if (!Type) {
      Type = 'none'
    }
    return JSON.stringify({
      Origin: CID,
      Type: Type,
      Data: Data
    })
  }

  // m = message, p = peer, s = swarm
  function debug (m, p, s, force) {
    if (!enableLog && !force) {
      return
    }
    if (s) {
      console.log(s + ' > ' + p + ': ' + m)
      return
    }
    if (p) {
      console.log(p + ': ' + m)
      return
    }
    console.log(m)
  }

  startUp()

  return self
}
