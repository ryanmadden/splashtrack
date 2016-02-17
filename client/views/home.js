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

Template.home.events({
  'click .btn-login': function () {
    Meteor.loginWithFacebook({ requestPermissions: ['email']},
      function (error) {
        if (error) {
          return console.log(error);
        }
        console.log("login success");
      });
  },
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
  }
});

Template.home.helpers({
  hasActiveGame: function () {
    if (Session.get('gameId')) {
      return true;
    }
    else {
      return false;
    }
  }
});
