module.exports = function (prefix) {
  return {
    namespace: prefix + 'game',
    state: {
      game: null,
      start: 0,
      timeTaken: 0
    },
    effects: require('./effects')(prefix),
    reducers: require('./reducers')(prefix)
  }
}
