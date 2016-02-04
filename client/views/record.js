Template.record.onCreated(function() {
  if (!Session.get('gameId')) {
    var currGame = Games.findOne({active: true, roster: Meteor.userId()});
    console.log('hi');
    console.log(currGame);
    if (currGame) {
      Session.set('gameId', currGame._id);
    }
    else {
      Router.go('/');
    }
  }
});

Template.record.events({
  'click .btn-glass': function() {
    var currGame = Games.findOne({_id: Session.get('gameId')});
    Meteor.call('recordHit', Session.get('gameId'), currGame.activePlayer, 'glass');
  },
  'click .btn-hit': function() {
    var currGame = Games.findOne({_id: Session.get('gameId')});
    Meteor.call('recordHit', Session.get('gameId'), currGame.activePlayer, 'hits');
  },
  'click .btn-miss': function() {
    var currGame = Games.findOne({_id: Session.get('gameId')});
    Meteor.call('recordHit', Session.get('gameId'), currGame.activePlayer, 'misses');
  }
})

Template.record.helpers({
  activeRecord: function() {
    var activeGame = Games.findOne({_id: Session.get('gameId')});
    if (activeGame) {
      var activeRecord = activeGame.records[Meteor.userId()];
      activeRecord = _.object(_.map(activeRecord, function (num, key) {
        return [key, num || 0];
      }));
      var total = _.keys(activeRecord);
      console.log(total);
      return activeRecord;
    }
    else {
      return {
        hits: 0,
        misses: 0,
        glass: 0
      }
    }
  },
});