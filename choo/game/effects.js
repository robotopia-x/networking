const game = require('../lib/game')

module.exports = function (prefix) {
  return {
    newGame: newGame,
    guessTile: guessTile
  }

  function newGame (_, state, send, done) {
    var nextGame = game.createNewChallenge(2, 2)
    send(prefix + 'game:setGame', nextGame, done)
  }

  function guessTile (data, state, send, done) {
    var now = Date.now()
    const result = state.game.handleInput(data)
    if (result.done) {
      state.timeTaken = ( now - state.start )+ result.punishmentPerMistakeInMS * result.mistakes
      console.log('Correct after: ' + state.timeTaken + 'ms including ' + result.mistakes + ' mistakes punished by ' + result.punishmentPerMistakeInMS + 'ms each')
      const resultPackage = {game: state.game, mistakes: result.mistakes, punishmentPerMistakeInMS: result.punishmentPerMistakeInMS}
      if (prefix === 'local') {
        send('remotegame:setGame', resultPackage.game, done)
      } else {
        send('localgame:setGame', resultPackage.game, done)
      }
      newGame(null, null, send, done)
    } else {
      done()
    }
  }
}
