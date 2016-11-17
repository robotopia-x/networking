module.exports = globalConfig => route => [
  route('/', require('../views/index')(globalConfig)),
  route('/2', require('../views/test')(globalConfig)),
  route('/404', require('../views/error')(globalConfig))
]
