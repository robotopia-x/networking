const game = require('../lib/game')

module.exports = function (prefix) {
  var cachedCallback;

  return {
    newGame: newGame,
    guessTile: guessTile,
    onFinish: onFinish
  }

  function newGame(onFinish, __, send, done) {
    var nextGame = game.createNewChallenge(2,2);
    nextGame.onFinish(onFinish);
    cachedCallback = onFinish;
    send(prefix+'game:setGame', nextGame, done)
  }

  function guessTile(data, state, send, done) {
    if (state.game.handleInput(data)) {
      newGame(cachedCallback, null, send, done)
    }
  }

  function onFinish(callback) {
    state.game.onFinish = callback;
  }

}