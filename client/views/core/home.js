Template.home.onCreated(function () {
  var currGame = Games.findOne({active: true, roster: Meteor.userId()});
  if (currGame) { 
    Session.set('gameId', currGame._id);
    return true; 
  }
  else {
    Session.set('gameId', null);
  }
});

Template.home.onRendered(function () {
 $('.collapsible').collapsible();
});

Template.home.events({
  'click .btn-new-game': function () {
    if (Session.get('gameId')) {
      var currGame = Games.findOne({_id: Session.get('gameId')});
      if (currGame.recordType === "hits") {
        Router.go('/scoreboard');
      }
      else {
        Router.go('/record');
      }
    }
    else {
      Router.go('/new');
    }
  },
  'click .btn-gamelog': function () {
    Router.go('/gamelog');
  },
  'click .btn-stats': function () {
    Router.go('/stats/' + Meteor.userId());
  },
  'click .btn-players': function () {
    Router.go('/players');
  }
});

Template.home.helpers({
  hasActiveGame: function () {
    var activeGame = Games.findOne({active: true, roster: Meteor.userId()});
    if (activeGame) {
      return true;
    }
    else {
      return false;
    }
  }
});
