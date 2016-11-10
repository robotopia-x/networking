'use strict'
var restartLocal
var restartRemote

(function () {
  var game_Local = new CreateGameUI()
  var game_Remote = new CreateGameUI()

  game_Local.registerCanvas(document.querySelector('#localCanvas'))
  game_Local.registerTaskArea(document.querySelector('#localTaskSpan'))

  //TODO: replace ....loadGame with call to WebRTC
  game_Local.onFinish(game_Remote.loadGame)

  game_Remote.registerCanvas(document.querySelector('#remoteCanvas'))
  game_Remote.registerTaskArea(document.querySelector('#remoteTaskSpan'))

  //TODO: replace ....loadGame with call to WebRTC
  game_Remote.onFinish(game_Local.loadGame)

  restartLocal = function () {
    game_Local.createNewGame()
  }

  restartRemote = function () {
    game_Remote.createNewGame()
  }

})();
