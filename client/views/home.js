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
      Router.go('/record');
    }
    else {
      Router.go('/new');
    }
  }
});

Template.home.helpers({
  hasActiveGame: function () {
    var currGame = Games.findOne({active: true, roster: Meteor.userId()});
    if (currGame) { 
      Session.set('gameId', currGame._id);
      return true; 
    }
    else {
      return false; 
    }
  }
});
