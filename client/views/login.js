Template.login.events({
  'click .btn-login': function () {
    Meteor.loginWithFacebook({ requestPermissions: ['email']},
      function (error) {
        if (error) {
          return console.log(error);
        }
      });
  }
});
