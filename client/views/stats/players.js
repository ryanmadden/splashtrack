Template.players.helpers({
  players: function () {
    return Meteor.users.find({}, {sort: {'profile.name': 1}}).fetch();
  }
});