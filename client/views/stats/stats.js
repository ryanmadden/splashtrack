Template.stats.helpers({
  games: function () {
    var games = Games.find({roster: this._id}, {sort: {startDate: -1}}).fetch();
    return games;
  },
  profile: function () {
    return Meteor.users.findOne({_id: this._id}).profile;
  },
  playerData: function () {
    return Stats.findOne({playerId: this._id});
  }
});