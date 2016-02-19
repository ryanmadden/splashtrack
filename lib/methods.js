Meteor.methods({
  recordHit: function(gameId, playerId, recordType, rebuttalMode) {
    Games.update(gameId, {
      $inc: {['records.' + playerId + '.' + recordType]: 1}
    });
    if (rebuttalMode) {
      Games.update(gameId, {
        $inc: {['records.' + playerId + '.rebut' + recordType]: 1}
      });
    }
  },
  resetLoginConfig: function() {
    Accounts.loginServiceConfiguration.remove({
      service: "facebook"
    });
  },
  deleteGame: function(gameId) {
    Games.remove({_id: gameId});
  },
  subtractHit: function(gameId, playerId, recordType, rebuttalMode) {
    // TODO Refactor subtract hit logic
    var currGame = Games.findOne({_id: gameId});
    if (currGame !== null) {
      if (rebuttalMode) {
        if (currGame.records[playerId]['rebut' + recordType] !== null && currGame.records[playerId]['rebut' + recordType] > 0) {
          Games.update(gameId, {
            $inc: {['records.' + playerId + '.' + recordType]: -1}
          });
          Games.update(gameId, {
            $inc: {['records.' + playerId + '.rebut' + recordType]: -1}
          });
        }
        else {
          // do nothing
        }
      }
      else {
        if (currGame.records[playerId][recordType] !== null && currGame.records[playerId][recordType] > 0) {
          Games.update(gameId, {
            $inc: {['records.' + playerId + '.' + recordType]: -1}
          });
        }
        else {
          // do nothing
        }
      }
    }
    else {
    }
  },
});