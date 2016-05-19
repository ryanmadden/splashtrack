Template.players.onCreated(function() {

});

Template.players.onRendered(function() {
  $('ul.tabs').tabs();
});

Template.players.helpers({
  playersAZ: function () {
    return Meteor.users.find({}, {sort: {'profile.name': 1}}).fetch();
  },
  playersRating: function () {
    return Meteor.users.find({'profile.stats.ratedGames': {$gte: 2}}, {sort: {'profile.rating': -1, 'profile.name': 1}}).fetch();
  },
  playersGames: function () {
    return Meteor.users.find({}, {sort: {'profile.stats.games': -1, 'profile.name': 1}}).fetch();
  },
  playersWinPct: function() {
    return Meteor.users.find({'profile.stats.games': {$gte: 3}}, {sort: {'profile.stats.winratio': -1, 'profile.name': 1}}).fetch();
  }
});

Template.players.events({
  'click .collection-item': function () {
    Router.go('/stats/' + this._id);
  }
});