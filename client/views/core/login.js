Template.login.events({
  'click .btn-login': function () {
    Meteor.loginWithFacebook({ requestPermissions: ['email']},
      function (error) {
        if (error) {
          Materialize.toast('Login error', 4000);
          console.log(error);
          return false;
        }
      });
  },
  'click .btn-logn': function () {
    Router.go('logn');
  },
  'click .btn-register': function () {
    Router.go('register');
  }
});

Template.register.events({
  'submit form': function(event) {
    event.preventDefault();
    console.log('hi');
    var username = event.target.registerUsername.value;
    var passwordVar = event.target.registerPassword.value;
    Accounts.createUser({
      username: username,
      password: passwordVar,
    }, function(error) {
      if (error) {
        Materialize.toast('Registration error', 4000);
        console.log(error);
        return false;
      }
      else {
        Router.go('/');
      }
    });
  },
});

Template.logn.events({
  'submit form': function(event){
    event.preventDefault();
    var username = event.target.loginUsername.value;
    var passwordVar = event.target.loginPassword.value;
    Meteor.loginWithPassword(username, passwordVar, function(error) {
      if (error) {
        Materialize.toast('Username or password is incorrect', 4000);
        console.log(error);
        return false;
      }
      else {
        Router.go('/');
      }
    });
  }
});