Template.record.onCreated(function() {
  if (!Session.get('gameId')) {
    var currGame = Games.findOne({active: true, roster: Meteor.userId()});
    if (currGame) {
      Session.set('gameId', currGame._id);
      Session.set('player1', currGame.roster[0]);
      Session.set('player2', currGame.roster[1]);
      Session.set('player3', currGame.roster[2]);
      Session.set('player4', currGame.roster[3]);
    }
    else {
      Router.go('/');
    }
  }
});

Template.record.onRendered(function() {
  $('.modal-trigger').leanModal();
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
  },
  'click .btn-close-modal': function() {
    $('#modal1').closeModal();
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
      console.log(activeRecord);
      var total = _.reduce(_.values(activeRecord), function(memo, num){return memo+num; }, 0);
      console.log(total);
      activeRecord.total = total;
      activeRecord.hitsRatio = Math.round(activeRecord.hits/total*100);
      activeRecord.missesRatio = Math.round(activeRecord.misses/total*100);
      activeRecord.glassRatio = Math.round(activeRecord.glass/total*100);
      console.log(activeRecord.hitsRatio);
      return activeRecord;
    }
    else {
      return {
        hits: 0,
        misses: 0,
        glass: 0,
        total: 0,
        hitsRatio: 0,
        missesRatio: 0,
        glassRatio: 0
      }
    }
  },
});