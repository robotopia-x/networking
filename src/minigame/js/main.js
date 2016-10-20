'use strict';
var restartLocal;
var currentGame;
var localCanvas = document.querySelector('#localCanvas');

restartLocal = function () {
  var cv = localCanvas.getContext('2d');
  currentGame = m_game.createNewChallenge(2,2);
  drawGrid(cv, currentGame.grid);
};