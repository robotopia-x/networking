module.exports = function (prefix) {
  return {
    namespace: prefix + 'game',
    state: {
      game: null
    },
    effects: require('./effects')(prefix),
    reducers: require('./reducers')(prefix)
  }
}
