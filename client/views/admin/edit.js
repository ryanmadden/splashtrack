Template.edit.events({
  'click .btn-delete': function () {
    var gameId = this._id;
    if (gameId) {
      Meteor.call('deleteGame', gameId);
      Router.go('/');
    }
    else {
      alert("There was a problem deleting your game.")
    }
  },
  'click .btn-cancel': function() {
    history.back();
  }
});