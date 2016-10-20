'use strict';
var restartLocal;
game_ui.registerCanvas(document.querySelector('#localCanvas'));
game_ui.registerTaskArea(document.querySelector('#localTaskSpan'));

restartLocal = function () {
  game_ui.restartGame();
};