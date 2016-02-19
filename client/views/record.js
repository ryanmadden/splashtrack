Template.record.onCreated(function() {
  if (!Session.get('gameId')) {
    var currGame = Games.findOne({active: true, roster: Meteor.userId()});
    if (currGame) {
      Session.set('gameId', currGame._id);
      Session.set('player1', currGame.roster[0]);
      Session.set('player2', currGame.roster[1]);
      Session.set('player3', currGame.roster[2]);
      Session.set('player4', currGame.roster[3]);
      Session.set('rebuttalMode', false);
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
    Meteor.call('recordHit', Session.get('gameId'), Meteor.userId(), 'glass', Session.get('rebuttalMode'), function(err, msg) {
      if(msg) { alert(msg); }
    });
    Session.set('rebuttalMode', false);
  },
  'click .btn-hit': function() {
    Meteor.call('recordHit', Session.get('gameId'), Meteor.userId(), 'hits', Session.get('rebuttalMode'), function(err, msg) {
      if(msg) { alert(msg); }
    });
    Session.set('rebuttalMode', false);
  },
  'click .btn-miss': function() {
    Meteor.call('recordHit', Session.get('gameId'), Meteor.userId(), 'misses', Session.get('rebuttalMode'), function(err, msg) {
      if(msg) { alert(msg); }
    });
    Session.set('rebuttalMode', false);
  },
  'click .btn-close-modal': function() {
    $('#modal1').closeModal();
  },
  'click .btn-rebuttal': function() {
    if (Session.get('rebuttalMode')) {
      Session.set('rebuttalMode', false);
    }
    else {
      Session.set('rebuttalMode', true);
    }
  },
  'click .btn-plus-score': function() {
    var activeGame = Games.findOne({_id: Session.get('gameId')});
    var target = $(event.target).attr('roster');
    if (activeGame) {
      Meteor.call('recordHit', Session.get('gameId'), activeGame.roster[target], 'hits', Session.get('rebuttalMode'), function(err, msg) {
        if(msg) { alert(msg); }
      });
      Session.set('rebuttalMode', false);
    }
    else {
      alert("NoActiveGameException");
    }
  },
  'click .btn-minus-score': function() {
    var activeGame = Games.findOne({_id: Session.get('gameId')});
    var target = $(event.target).attr('roster');
    if (activeGame) {
      Meteor.call('subtractHit', Session.get('gameId'), activeGame.roster[target], 'hits', Session.get('rebuttalMode'), function(err, msg) {
        if(msg) { alert(msg); }
      });
      Session.set('rebuttalMode', false);
    }
    else {
      alert("NoActiveGameException");
    }
  }
});

Template.record.helpers({
  activeRecord: function() {
    var activeGame = Games.findOne({_id: Session.get('gameId')});
    if (activeGame) {
      var activeRecord = activeGame.records[Meteor.userId()];
      var total = activeRecord.hits + activeRecord.misses + activeRecord.glass;
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
  },
  hits: function() {
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
        p1r: p1Rebuts,
        p2r: p2Rebuts,
        p3r: p3Rebuts,
        p4r: p4Rebuts,
        home: p1Hits + p2Hits - p1Rebuts - p2Rebuts - p3Rebuts - p4Rebuts,
        away: p3Hits + p4Hits - p1Rebuts - p2Rebuts - p3Rebuts - p4Rebuts,
        p1Name: activeGame.rosterNames[0],
        p2Name: activeGame.rosterNames[1],
        p3Name: activeGame.rosterNames[2], 
        p4Name: activeGame.rosterNames[3]
      }
    }
    else {
      return {
        p1: 0,
        p2: 0, 
        p3: 0,
        p4: 0,
        home: 0,
        away: 0
      };
    }
  },
  rebuttalMode: function() {
    return Session.get('rebuttalMode');
  }
});

Template.recordnav.events({
  'click .btn-subtract-glass': function() {
    Meteor.call('subtractHit', Session.get('gameId'), Meteor.userId(), 'glass', Session.get('rebuttalMode'), function(err, msg) {
      if(msg) { alert(msg); }
    });
  },
  'click .btn-subtract-hit': function() {
    Meteor.call('subtractHit', Session.get('gameId'), Meteor.userId(), 'hits', Session.get('rebuttalMode'), function(err, msg) {
      if(msg) { alert(msg); }
    });
  },
  'click .btn-subtract-miss': function() {
    Meteor.call('subtractHit', Session.get('gameId'), Meteor.userId(), 'misses', Session.get('rebuttalMode'), function(err, msg) {
      if(msg) { alert(msg); }
    });
  }
});

Template.recordnav.helpers({
  rebuttalMode: function () {
    return Session.get('rebuttalMode');
  }
});