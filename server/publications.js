Meteor.publish('games', function(limit) {
  return Games.find({}, {limit: limit});
});

Meteor.publish('users', function() {
  return Meteor.users.find({});
});