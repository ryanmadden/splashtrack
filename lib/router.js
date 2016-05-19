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
  name: 'gameLog',
  loadingTemplate: 'loading',
  // waitOn: function () {
  //   return Meteor.subscribe('games');
  // },
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

Router.route('/logn', function () {
  this.redirect('/');
});

Router.route('/register', function () {
  this.redirect('/');
});