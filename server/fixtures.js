Meteor.startup(function () {
  // code to run on server at startup
});

Accounts.onCreateUser(function(options, user) {
  console.log('FUCK');
  console.log(options);
  console.log(user);
  if (!options.profile) { options.profile = {}; }
  if (user.services.facebook) {
    options.profile.picture = "https://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
  }
  else {
    options.profile.picture =  "https://www.gvsu.edu/cms4/asset/25867353-94CC-EA07-36E3D4DCA04D10A3/blank-person-web[1380554988000].jpg";
  }
  options.profile.rating = 800;
  options.profile.rank = "Newbie";
  options.profile.ratingHistory = [];
  if (!options.profile.name) { options.profile.name = options.username; }
  user.profile = options.profile;
  return user;
});