Template.login.events({
  'click .btn-login': function () {
    Meteor.loginWithFacebook({ requestPermissions: ['email']},
      function (error) {
        if (error) {
          Materialize.toast('Login error', 4000);
          return console.log(error);
        }
      });
  }
});
