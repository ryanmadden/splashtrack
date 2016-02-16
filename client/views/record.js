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
  },
  'click .btn-hit': function() {
    Meteor.call('recordHit', Session.get('gameId'), Meteor.userId(), 'hits');
  },
  'click .btn-miss': function() {
    Meteor.call('recordHit', Session.get('gameId'), Meteor.userId(), 'misses');
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

Template.recordnav.events({
  'click .btn-subtract-glass': function() {
    Meteor.call('subtractHit', Session.get('gameId'), Meteor.userId(), 'glass');
  },
    'click .btn-subtract-hit': function() {
    Meteor.call('subtractHit', Session.get('gameId'), Meteor.userId(), 'hits');
  },
    'click .btn-subtract-miss': function() {
    Meteor.call('subtractHit', Session.get('gameId'), Meteor.userId(), 'misses');
  }
});