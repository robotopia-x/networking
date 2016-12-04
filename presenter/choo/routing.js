module.exports = function (globalConfig) {
  return function (route) {
    return [
      route('/', require('../views/index')(globalConfig)),
      route('/404', require('../views/error')(globalConfig))
    ]
  }
}
