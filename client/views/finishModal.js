Template.finishModal.helpers({
  roster: function () {
    var activeGame = Games.findOne({_id: Session.get('gameId')});
    if (activeGame) {
      return activeGame.roster;
    }
    return ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
  },
  p1: function() {
    var user = Meteor.users.findOne({_id: Session.get('player1')});
    return user;
  },
  p2: function() {
    var user = Meteor.users.findOne({_id: Session.get('player2')});
    return user || {profile: {name: 'Player 2'}};
  },
  p3: function() {
    var user = Meteor.users.findOne({_id: Session.get('player3')});
    return user || {profile: {name:'Player 3'}};
  },
  p4: function() {
    var user = Meteor.users.findOne({_id: Session.get('player4')});
    return user || {profile: {name: 'Player 4'}};
  }
});