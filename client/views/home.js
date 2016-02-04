Template.home.events({
  'click .btn-login': function () {
    Meteor.loginWithFacebook({ requestPermissions: ['email']},
      function (error) {
        if (error) {
          return console.log(error);
        }
        console.log("login success");
        Router.go('/hello');
      });
  }
});
