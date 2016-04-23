Template.deleteModal.helpers({

});

Template.deleteModal.events({
  'click .btn-delete': function () {
    var gameId = Session.get('deleteGame') || Session.get('gameId');
    if (gameId) {
      Meteor.call('deleteGame', gameId);
      Session.keys = {};
      Router.go('/');
    }
    else {
      alert("There was a problem deleting your game.")
    }
  }
});