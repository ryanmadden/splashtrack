Meteor.publish('games', function(userId, limit) {
  if (userId === 'all') {
    return Games.find({}, {limit: limit, sort: {startDate: -1}});
  }
  else {
    return Games.find({roster: userId}, {limit: limit, sort: {startDate: -1}});
  }
});

Meteor.publish('users', function() {
  return Meteor.users.find({});
});