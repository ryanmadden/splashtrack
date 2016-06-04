Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function() {
  if (Meteor.userId()) {
    this.wait(Meteor.subscribe('activeUser'));
    if (this.ready()) {
      this.render('home'); 
    }
    else {
      this.render('loading');
    }
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
  waitOn: function () {
    return Meteor.subscribe('games', 'all', 10);
  },
});

Router.route('/new', {
  name: 'newGame',
  loadingTemplate: 'loading',
  waitOn: function () {
    return Meteor.subscribe('allUsers');
  },
});

Router.route('/options', {
  name: 'options',
  loadingTemplate: 'loading',
  waitOn: function () {
    return Meteor.subscribe('allUsers');
  },
});

Router.route('/players', {
  name: 'players',
  loadingTemplate: 'loading',
  waitOn: function () {
    return Meteor.subscribe('allUsers');
  },
});

Router.route('/record', {
  name: 'record',
  loadingTemplate: 'loading',
  waitOn: function () {
    return [Meteor.subscribe('games', Meteor.userId(), 10), Meteor.subscribe('allUsers')];
  },
  yieldRegions: {
    'recordnav': {to: 'sidenav'}
  }
});

Router.route('/stats/:_id', {
  name: 'stats',
  loadingTemplate: 'loading',
  waitOn: function () {
    return Meteor.subscribe('games', this.params._id, 10);
  },
  data: function () {
    return {_id: this.params._id};
  }
});

Router.route('/edit/:_id', {
  name: 'edit',
  loadingTemplate: 'loading',
  waitOn: function () {
    return Meteor.subscribe('oneGame', this.params._id);
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