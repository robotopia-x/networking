const webrtcSwarm = require('webrtc-swarm')
const signalhub = require('signalhub')
const cuid = require('cuid')

module.exports = globalConfig => ({
  awaitPeer: (_, state, send, done) => {
    state.hub = signalhub(globalConfig.appName , globalConfig.signalhubUrl)
    state.swarm = webrtcSwarm(state.hub)

    state.swarm.on('peer', (peer, id) => {
      console.log('connected to a new peer:', id)
      send('connection:setOwnId', id, err => err && done(err))
      console.log('total peers:', state.swarm.peers.length)
    })
    state.swarm.on('disconnect', (peer, id) => {
      console.log('disconnected from a peer:', id)
      send('connection:setOwnId', null, err => err && done(err))
      console.log('total peers:', state.swarm.peers.length)
    })
  },
  getOwnId: (_, state, __, done) => {
    done(state.ownId)
  }
})
