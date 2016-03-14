Template.finishModal.helpers({
  score: function () {
    var activeGame = Games.findOne({_id: Session.get('gameId')});
    if (activeGame) {
      var p1Hits = activeGame.records[activeGame.roster[0]].hits;
      var p2Hits = activeGame.records[activeGame.roster[1]].hits;
      var p3Hits = activeGame.records[activeGame.roster[2]].hits;
      var p4Hits = activeGame.records[activeGame.roster[3]].hits;
      var p1Rebuts = activeGame.records[activeGame.roster[0]].rebuthits;
      var p2Rebuts = activeGame.records[activeGame.roster[1]].rebuthits;
      var p3Rebuts = activeGame.records[activeGame.roster[2]].rebuthits;
      var p4Rebuts = activeGame.records[activeGame.roster[3]].rebuthits;
      return {
        p1: p1Hits,
        p2: p2Hits, 
        p3: p3Hits,
        p4: p4Hits,
        home: p1Hits + p2Hits - p1Rebuts - p2Rebuts - p3Rebuts - p4Rebuts,
        away: p3Hits + p4Hits - p1Rebuts - p2Rebuts - p3Rebuts - p4Rebuts,
        p1Name: activeGame.rosterNames[0],
        p2Name: activeGame.rosterNames[1],
        p3Name: activeGame.rosterNames[2], 
        p4Name: activeGame.rosterNames[3]
      }
    }
  }
});

Template.finishModal.events({
  'click .btn-finish': function () {
    var gameId = Session.get('gameId');
    if (gameId) {
      Games.update(gameId, {
        $set: {active: false}
      });
      var roster = Games.findOne({_id: gameId}).roster;
      _.map(roster, function(playerId) {
        if (playerId.indexOf('Player') === -1) {
          Meteor.call('updateStats', playerId);
        }
      });
      Session.keys = {};
      Router.go('/');
    }
    else {
      alert("There was a problem saving your game. Ryan probably broke something... idiot.")
    }
  }
});