Meteor.methods({
  resetLoginConfig: function() {
    Accounts.loginServiceConfiguration.remove({
      service: "facebook"
    });
  }
});