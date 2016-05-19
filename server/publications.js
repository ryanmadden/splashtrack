Meteor.publish('games', function(userId, limit) {
  if (userId === 'all') {
    return Games.find({}, {limit: limit, sort: {startDate: -1}});
  }
  else {
    return Games.find({roster: userId}, {limit: limit, sort: {startDate: -1}});
  }
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