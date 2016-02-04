Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {
  name: 'home'
});

Router.route('/config', {
  name: 'loginConfig'
});

Router.route('/hello', {
  name: 'hello'
});

Router.route('/new', {
  name: 'newGame'
});

Router.route('/options', {
  name: 'options'
});

Router.route('/record', {
  name: 'record',
  waitOn: function () {
    return Meteor.subscribe('games');
  },
  yieldRegions: {
    'recordnav': {to: 'sidenav'}
  }
});