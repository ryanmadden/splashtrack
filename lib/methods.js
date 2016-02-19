Meteor.methods({
  deleteGame: function(gameId) {
    Games.remove({_id: gameId});
  },
  recordHit: function(gameId, playerId, recordType, rebuttalMode) {

    if (rebuttalMode) {
      var currGame = Games.findOne({_id: gameId});
      var roster = currGame.roster;
      var opposingScore;
      var onHomeTeam = playerId === roster[0] || playerId === roster[1];
      var p1Hits = currGame.records[currGame.roster[0]].hits;
      var p2Hits = currGame.records[currGame.roster[1]].hits;
      var p3Hits = currGame.records[currGame.roster[2]].hits;
      var p4Hits = currGame.records[currGame.roster[3]].hits;
      var p1Rebuts = currGame.records[currGame.roster[0]].rebuthits;
      var p2Rebuts = currGame.records[currGame.roster[1]].rebuthits;
      var p3Rebuts = currGame.records[currGame.roster[2]].rebuthits;
      var p4Rebuts = currGame.records[currGame.roster[3]].rebuthits;
      if (onHomeTeam) {
        opposingScore = p3Hits + p4Hits - p1Rebuts - p2Rebuts - p3Rebuts - p4Rebuts;
      }
      else {
        opposingScore = p1Hits + p2Hits - p1Rebuts - p2Rebuts - p3Rebuts - p4Rebuts;
      }
      if (opposingScore > 0) {
        Games.update(gameId, {
          $inc: {['records.' + playerId + '.' + recordType]: 1}
        });
        Games.update(gameId, {
          $inc: {['records.' + playerId + '.rebut' + recordType]: 1}
        });
      }
      else {
        return "You can't hit a rebuttal unless the other team has points.";
      }
    }
    else {
      Games.update(gameId, {
        $inc: {['records.' + playerId + '.' + recordType]: 1}
      });
    }
  },
  resetLoginConfig: function() {
    Accounts.loginServiceConfiguration.remove({
      service: "facebook"
    });
  },
  setRobust: function(gameId, playerId, bool) {
    Games.update(gameId, {
      $set: {['records.' + playerId + '.robust']: bool}
    });
    console.log(Games.findOne({_id: gameId}));
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
          return "Sorry, you can't subtract rebuttal " + recordType + " if the player doesn't have any.";
        }
      }
      else {
        if (currGame.records[playerId][recordType] !== null && currGame.records[playerId][recordType] > currGame.records[playerId]['rebut' + recordType]) {
          Games.update(gameId, {
            $inc: {['records.' + playerId + '.' + recordType]: -1}
          });
        }
        else {
          return "Sorry, you can't subtract " + recordType + " if the player doesn't have any (or they only have rebuttals).";
        }
      }
    }
    else {
    }
  },
});