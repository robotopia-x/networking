var Ps = require('./lib/index.js')
var hub = 'http://localhost:8042'
// var hub = 'signalhub.perguth.de'

window.startMain = function () {
  console.log('starting a main')
  var logger = createHTMLAppender('log')
  Ps({isMain: true, GID: 'Group', hubURL: hub, logger: logger})
}

window.startClient = function () {
  console.log('starting a client')
  var logger = createHTMLAppender('log')
  Ps({isMain: false, GID: 'Group', hubURL: hub, logger: logger})
}

function createHTMLAppender(id) {
  const max = 20
  var appender, list
  try {
    document.getElementById(id).innerHTML = 'will log here'
  } catch (err) {
    throw 'Error creating Appender'
  }

  list = []
  appender = function (m) {
    console.log(m)
    var log, i
    list.push(m)
    if (list.length > max) {
      list = list.slice( list.length - max )
    }
    log = ''
    for (i in list) {
      log += list[i] + '<br>'
    }
    try {
      document.getElementById(id).innerHTML = log
    } catch (err) {
      throw 'Error appending'
    }
  }

  return appender

}