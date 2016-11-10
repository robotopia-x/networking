'use strict'
var restartLocal
var restartRemote

(function () {
  var game_Local = new CreateGameUI()

  game_Local.registerCanvas(document.querySelector('#localCanvas'))
  game_Local.registerTaskArea(document.querySelector('#localTaskSpan'))

  restartLocal = function () {
    game_Local.createNewGame()
  }
})();
