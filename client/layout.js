Template.layout.onRendered(function() {
  $('.button-collapse').sideNav({
    menuWidth: 240, // Default is 240
    edge: 'left', // Choose the horizontal origin
    closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
  });
})

Template.layout.events({
  'click .btn-home': function () {
    Router.go('/');
  },
  'click .btn-demo': function () {
    Router.go('demo');
  }
});