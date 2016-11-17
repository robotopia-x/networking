module.exports = function (globalConfig) {
  return {
    namespace: 'game',
    effects: require('./effects')(globalConfig),
    reducers: require('./reducers')(globalConfig)
  }
}