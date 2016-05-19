Template.stats.onCreated(function() {
  var userId = Router.current().params._id;
  Meteor.call('updateStats', userId);

  const handle = Meteor.subscribeWithPagination('games', userId, 10);

  $(window).scroll(function() {
    if(($(window).scrollTop() + $(window).height() > $(document).height() - 10) && handle.ready()) {
      handle.loadNextPage();
    }
  });
});

Template.stats.helpers({
  games: function () {
    var games = Games.find({roster: this._id}, {sort: {startDate: -1}}).fetch();
    return games;
  },
  profile: function () {
    return Meteor.users.findOne({_id: this._id}).profile;
  },
  stats: function () {
    return Meteor.users.findOne({_id: this._id}).profile.stats;
  }
});

Template.gameLog.onCreated(function() {

});