Template.home.onCreated(function () {
  const handle = Meteor.subscribeWithPagination('games', Meteor.userId(), 10);
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
  'click .btn-continue-game': function () {
    Router.go('/record');
  },
  'click .btn-new-game': function () {
    Router.go('/new');
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
      // Session.set('gameId', activeGame._id);
      return true;
    }
    else {
      // Session.set('gameId', null);
      return false;
    }
  }
});
