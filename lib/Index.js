module.exports = PeerStar

const SimplePeer = require('simple-peer')
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
  ACCEPTCID: 'acceptCID'
}

function PeerStar (opts) {
  if (!opts) {
    throw new Error('Please pass an opts object with GID and hubURL!')
  }
  if (!opts.GID) {
    throw new Error('group ID required!')
  }
  if (!opts.hubURL) {
    throw new Error('hubURL required!')
  }

  var self = this
  
  var hubURL, GID, CID, Contacts, Swarms
  
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

  function startUp() {
    Swarms.all = createSwarmForCID(ALL)
    Swarms.all.on('peer', (peer, id) => {
      console.log('connected to another peer, ALL:', id)
      addListenersToPeer(peer)
    })
    Swarms.out = createSwarmForCID(MAIN)
    Swarms.out.on('peer', (peer, id) => {
      console.log('connected to MAIN:', id)
      addListenersToPeer(peer)
      if (opts.isMain) {
        publishContacts(peer)
      }
    })
    //send I am new
    //listen for message with CID list
    //generate CID
    //Channels.self = createSwarmForCID(CID)
    //Send CID to MAIN
    //wait for confirmation
    //Close out channel, null it in Channels
    //Listen for the new CID list in ALL - check for own CID in list

  }

  function publishContacts(peer) {
    peer.send(createPacket(TYPES.CONTACTS, Contacts))
  }

  function addListenersToPeer(peer) {
    peer.on('data', dataRouting)
    peer.on('stream', (stream) => {
      console.log('peerstream:')
      console.log(stream)
    })
    peer.on('close', () => {
      console.log('peer closed')
    })
    peer.on('error', (err) => {
      console.log('fatality:')
      console.log(err)
    })

    function dataRouting(data) {
      try {
        var stuff = JSON.parse(String(data))
      } catch (err) {
        console.log(err)
      }
      if (!stuff.hasOwnProperty('Type')) {
        console.log('data event without type: ' + JSON.stringify(stuff))
        return
      }
      if (stuff.Type === TYPES.EXTERNAL) {
        console.log('data event for user: ' + JSON.stringify(stuff))
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
        console.log('CID was rejected')
        processAsContactData(stuff, peer)
        return
      }
      if (stuff.Type === TYPES.ACCEPTCID) {
        console.log('CID was accepted')
        Swarms.self = createSwarmForCID(CID)
        return
      }
      console.log('data Type unknown: ' + stuff.Type)
    }

  }

  function processAsNewCID(data, peer) {
    console.log('received new CID: ' + JSON.stringify(data.Data))
    if (Contacts.indexOf(data.Data) >= 0) {
      peer.send(createPacket(TYPES.DENYCID, Contacts))
    }
    peer.send(createPacket(TYPES.ACCEPTCID))
  }

  function processAsContactData(data, peer) {
    if (data.Origin !== MAIN) {
      return
    }
    console.log('received contacts from Main: ' + JSON.stringify(data.Data))
    Contacts = data.Data
    if (!CID) {
      CID = setupAnOwnCID(Contacts, peer)
    }
  }

  function setupAnOwnCID(existingCIDs, mainPeer) {
    var l_cid = generateCID(existingCIDs)
    mainPeer.send(createPacket(TYPES.NEWCID, l_cid))

    return l_cid

    function generateCID(existingCIDs) {
      var id = cuid()
      if (existingCIDs.indexOf(id) < 0) {
        console.log('generated new ID: ' + id)
        return id
      }
      return generateCID(existingCIDs)
    }
  }

  function createSwarmForCID(targetCID) {
    console.log('Creating Swarm for: ' + GID + targetCID)
    var hub = signalhub(GID + targetCID, hubURL)
    var swarm = webrtcSwarm(hub)
    return swarm
  }

  function createPacket(Type, Data) {
    if (!Type) {
      Type = 'none'
    }
    return JSON.stringify({
      Origin: CID,
      Type: Type,
      Data: Data
    })
  }

  startUp()

  return self
}