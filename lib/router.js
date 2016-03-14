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

Router.route('/new', {
  name: 'newGame'
});

Router.route('/options', {
  name: 'options'
});

Router.route('/players', {
  name: 'players'
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

Router.route('/stats/:_id', {
  name: 'stats',
  loadingTemplate: 'loading',
  waitOn: function () {
    return Meteor.subscribe('games');
  },
  data: function () {
    return {_id: this.params._id};
  }
});