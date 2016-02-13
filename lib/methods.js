Meteor.methods({
  recordHit: function(gameId, playerId, recordType) {
    var record = Games.findOne({_id: gameId}).records[playerId][recordType];
    if (record === null) {
      Games.update(gameId, {
        $set: {['records.' + playerId + '.' + recordType]: 1}
      });
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
  deleteGame: function(gameId) {
    Games.remove({_id: gameId});
  }
});