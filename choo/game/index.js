module.exports = function (globalConfig) {
  return {
    namespace: 'game',
    state: {
      game: null
    },
    effects: require('./effects')(globalConfig),
    reducers: require('./reducers')(globalConfig)
  }
}