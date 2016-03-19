Meteor.startup(function () {
  // code to run on server at startup
});

Accounts.onCreateUser(function(options, user) {
    if (options.profile) {
        options.profile.picture = "https://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
        options.profile.rating = 800;
        options.profile.rank = "Newbie";
        options.profile.ratingHistory = [];
        user.profile = options.profile;
    }
    return user;
});