Template.record.onCreated(function() {
  var currGame = Games.findOne({active: true, roster: Meteor.userId()});
  if (!Session.get('gameId')) {
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
  if (currGame.records[Meteor.userId()]) {
    if (Session.get('recordMode')) {
      Games.update({_id: Session.get('gameId')}, {$set: {['profile' + Meteor.userId() + '.robust']: (Session.get('recordMode') === 'all')}});
    }
    else {
      var mode = Games.findOne({_id: Session.get('gameId')}).fetch().records[Meteor.userId()].robust ? 'all' : 'hits';
      Session.set('recordMode', mode);
    }

    if(Session.get('recordMode') === 'all') {
      Meteor.call('setRobust', Session.get('gameId'), Meteor.userId(), true);
    }
    else {
      Meteor.call('setRobust', Session.get('gameId'), Meteor.userId(), false);
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
  gameData: function() {
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
        playerOne: activeGame.records[activeGame.roster[0]],
        playerTwo: activeGame.records[activeGame.roster[1]],
        playerThree: activeGame.records[activeGame.roster[2]],
        playerFour: activeGame.records[activeGame.roster[3]],
        home: p1Hits + p2Hits - p1Rebuts - p2Rebuts - p3Rebuts - p4Rebuts,
        away: p3Hits + p4Hits - p1Rebuts - p2Rebuts - p3Rebuts - p4Rebuts,
        playerOneName: activeGame.rosterNames[0],
        playerTwoName: activeGame.rosterNames[1],
        playerThreeName: activeGame.rosterNames[2], 
        playerFourName: activeGame.rosterNames[3],
      };
    }
    else {
      return {
        playerOne: {hits: 0, misses: 0, glass: 0, rebuthits: 0, rebutmisses: 0, glassmisses: 0, robust: false},
        playerTwo: {hits: 0, misses: 0, glass: 0, rebuthits: 0, rebutmisses: 0, glassmisses: 0, robust: false},
        playerThree: {hits: 0, misses: 0, glass: 0, rebuthits: 0, rebutmisses: 0, glassmisses: 0, robust: false},
        playerFour: {hits: 0, misses: 0, glass: 0, rebuthits: 0, rebutmisses: 0, glassmisses: 0, robust: false},
        home: 0,
        away: 0,
        playerOneName: "Guest",
        playerOneName: "Guest",
        playerOneName: "Guest",
        playerOneName: "Guest",
      }
    }
  },
  rebuttalMode: function() {
    return Session.get('rebuttalMode');
  },
  recordMode: function () {
    return Session.get('recordMode') === 'all';
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
  },
  'click .btn-switch-mode': function() {
    if (Session.get('recordMode') === 'all') {
      Session.set('recordMode', 'hits');
      Meteor.call('setRobust', Session.get('gameId'), Meteor.userId(), false);
    }
    else {
      Session.set('recordMode', 'all');
      Meteor.call('setRobust', Session.get('gameId'), Meteor.userId(), true);
    }
  }
});

Template.recordnav.helpers({
  rebuttalMode: function () {
    return Session.get('rebuttalMode');
  },
  recordMode: function () {
    return Session.get('recordMode') === 'all';
  }
});