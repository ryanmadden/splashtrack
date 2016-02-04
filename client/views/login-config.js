Template.loginConfig.events({
  'click .btn-config': function () {
    Meteor.call('resetLoginConfig');
  }
});
