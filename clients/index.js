const choo = require('choo')
const app = choo()

var globalConfig = {
  signalhubUrl: 'http://localhost:8042',
  appName: 'presenter'
}

app.model(require('./choo/P2PConnection')(globalConfig))

// creates routing, default route = /404
app.router('/404', require('./choo/routing')(globalConfig))

const appTree = app.start({hash: true})

document.body.appendChild(appTree)
