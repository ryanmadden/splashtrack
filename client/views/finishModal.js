Template.finishModal.onCreated(function() {
  Session.set('playerOneScore', 0);
  Session.set('playerTwoScore', 0);
  Session.set('playerThreeScore', 0);
  Session.set('playerFourScore', 0);
})

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
  },
  t1Score: function () {
    return Session.get('playerOneScore') + Session.get('playerTwoScore');
  },
  t2Score: function () {
    return Session.get('playerThreeScore') + Session.get('playerFourScore');
  },
});

Template.finishModal.events({
  'change #playerOneScore': function () {
    console.log(event);
    console.log(parseInt(event.target.value) || 0);
    Session.set('playerOneScore', parseInt(event.target.value) || 0);
  },
  'change #playerTwoScore': function () {
    Session.set('playerTwoScore', parseInt(event.target.value) || 0);
  },
  'change #playerThreeScore': function () {
    Session.set('playerThreeScore', parseInt(event.target.value) || 0);
  },
  'change #playerFourScore': function () {
    Session.set('playerFourScore', parseInt(event.target.value) || 0);
  },
  'click .btn-finish': function () {
    var gameId = Session.get('gameId');
    if (gameId) {
      Games.update(gameId, {
        $set: {['records.' + Session.get('player1') + '.hits']: Session.get('playerOneScore')}
      });
      Games.update(gameId, {
        $set: {['records.' + Session.get('player2') + '.hits']: Session.get('playerTwoScore')}
      });
      Games.update(gameId, {
        $set: {['records.' + Session.get('player3') + '.hits']: Session.get('playerThreeScore')}
      });
      Games.update(gameId, {
        $set: {['records.' + Session.get('player4') + '.hits']: Session.get('playerFourScore')}
      });
      Games.update(gameId, {
        $set: {homeScore: Session.get('playerOneScore') + Session.get('playerTwoScore')}
      });
      Games.update(gameId, {
        $set: {awayScore: Session.get('playerThreeScore') + Session.get('playerFourScore')}
      });
      Games.update(gameId, {
        $set: {active: false}
      });
      Session.keys = {};
      Router.go('/');
    }
    else {
      alert("There was a problem saving your game. Ryan probably broke something... idiot.")
    }
  }
});