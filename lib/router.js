Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function() {
  if (Meteor.userId()) {
    this.render('home'); 
  }
  else {
    this.render('login');
  }
});

Router.route('/config', {
  name: 'loginConfig'
});

Router.route('/gamelog', {
  name: 'gameLog'
});

Router.route('/hello', {
  name: 'hello'
});

Router.route('/mystats', {
  name: 'mystats',
  loadingTemplate: 'loading',
  waitOn: function () {
    return Meteor.subscribe('games');
  },
});

Router.route('/new', {
  name: 'newGame'
});

Router.route('/options', {
  name: 'options'
});

Router.route('/record', {
  name: 'record',
  loadingTemplate: 'loading',
  waitOn: function () {
    return Meteor.subscribe('games');
  },
  yieldRegions: {
    'recordnav': {to: 'sidenav'}
  }
});

Router.route('/scoreboard', {
  name: 'scoreboard'
});