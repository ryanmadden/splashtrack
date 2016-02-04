Template.options.events({
  'click .btn-next': function () {
    Router.go('/record');
  },
  'click .btn-back': function () {
    Router.go('/new');
  }
});