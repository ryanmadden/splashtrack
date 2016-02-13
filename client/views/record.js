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
    Meteor.call('recordHit', Session.get('gameId'), Meteor.userId(), 'glass');
    // var currGame = Games.findOne({_id: Session.get('gameId')});
    // recordHit(Session.get('gameId'), currGame.activePlayer, 'glass');
  },
  'click .btn-hit': function() {
    Meteor.call('recordHit', Session.get('gameId'), Meteor.userId(), 'hits');
    // var currGame = Games.findOne({_id: Session.get('gameId')});
    // recordHit(Session.get('gameId'), currGame.activePlayer, 'hits');
  },
  'click .btn-miss': function() {
    Meteor.call('recordHit', Session.get('gameId'), Meteor.userId(), 'misses');
    // var currGame = Games.findOne({_id: Session.get('gameId')});
    // recordHit(Session.get('gameId'), currGame.activePlayer, 'misses');
  },
  'click .btn-close-modal': function() {
    $('#modal1').closeModal();
  }
});

Template.record.helpers({
  activeRecord: function() {
    var activeGame = Games.findOne({_id: Session.get('gameId')});
    if (activeGame) {
      var activeRecord = activeGame.records[Meteor.userId()];
      // activeRecord = _.object(_.map(activeRecord, function (num, key) {
      //   return [key, num || 0];
      // }));
      var total = _.reduce(_.values(activeRecord), function(memo, num){return memo+num; }, 0);
      activeRecord.total = total;
      activeRecord.hitsRatio = Math.round(activeRecord.hits/total*100);
      activeRecord.missesRatio = Math.round(activeRecord.misses/total*100);
      activeRecord.glassRatio = Math.round(activeRecord.glass/total*100);
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
  }
});