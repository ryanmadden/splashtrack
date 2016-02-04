Meteor.methods({
  recordHit: function(gameId, playerId) {
    var hits = Games.findOne({_id: gameId}).records[playerId].hits;
    if (hits === null) {
      Games.update(gameId, {
        $set: {['records.' + playerId + '.hits']: 0}
      });
    }
    else {
      Games.update(gameId, {
        $inc: {['records.' + playerId + '.hits']: 1}
      });
    }
  },
  resetLoginConfig: function() {
    Accounts.loginServiceConfiguration.remove({
      service: "facebook"
    });
  }
});