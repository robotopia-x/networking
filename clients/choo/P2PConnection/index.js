module.exports = globalConfig => ({
  namespace: 'connection',
  effects: require('./effects')(globalConfig),
  reducers: require('./reducers')(globalConfig),
  state: {
    connectionId: null,
    ownId: null,
    hub: null,
    swarm: null
  }
})
