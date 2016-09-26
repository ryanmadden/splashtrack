Meteor.publish('games', function(userId, limit) {
  if (userId === 'all') {
    return Games.find({}, {limit: limit, sort: {startDate: -1}});
  }
  else {
    return Games.find({roster: userId}, {limit: limit, sort: {startDate: -1}});
  }
});

Meteor.publish('weekGames', function() {
  var oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  oneWeekAgo = Date.parse(oneWeekAgo);
  return Games.find({startDate: {$gt: oneWeekAgo}});
});

Meteor.publish('oneGame', function(gameId) {
  return Games.find({_id: gameId});
});

Meteor.publish('activeUser', function() {
  return Meteor.users.find({_id: this.userId});
});

Meteor.publish('allUsers', function() {
  return Meteor.users.find({});
});

Meteor.publish('oneUser', function(userId) {
  console.log(userId);
  return Meteor.users.find({_id: userId})
});