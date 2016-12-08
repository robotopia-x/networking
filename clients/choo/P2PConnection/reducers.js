module.exports = globalConfig => ({
  setConnectionId: (id, state) => {
    state.connectionId = id
    return state
  },
  setOwnId: (id, state) => {
    state.ownId = id
    return state
  }
})
