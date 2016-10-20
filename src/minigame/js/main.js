'use strict';
var restartLocal;
var currentGame;
var localCanvas = document.querySelector('#localCanvas');
game_ui.registerCanvasForGame(localCanvas);

restartLocal = function () {
  game_ui.restartGame();
};