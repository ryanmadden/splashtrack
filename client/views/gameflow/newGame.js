Template.newGame.onCreated(function() {
  Session.set('player1', 'Player 1');
  Session.set('player2', 'Player 2');
  Session.set('player3', 'Player 3');
  Session.set('player4', 'Player 4');
  Session.set('player1Name', 'Player 1');
  Session.set('player2Name', 'Player 2');
  Session.set('player3Name', 'Player 3');
  Session.set('player4Name', 'Player 4');
});

Template.newGame.onRendered(function() {
  $('select').material_select();
});

Template.newGame.helpers({
  settings: function() {
    return {
      position: 'bottom',
      limit: 5,
      rules: [
      {
        token: '',
        collection: Meteor.users,
        field: 'profile.name',
        template: Template.userPill,
        noMatchTemplate: Template.noUserPill
      }
      ]
    };
  },
  users: function() {
    $('select').material_select();
    return Meteor.users.find().fetch();
  }
});

Template.newGame.events({
  'click .btn-next': function () {
    Router.go('/options');
  },
  'click .btn-back': function () {
    Router.go('/');
  },
  'autocompleteselect #p1-wrapper input': function(event, template, doc) {
    Session.set('player1', doc._id);
    Session.set('player1Name', doc.profile.name);
  },
  'autocompleteselect #p2-wrapper input': function(event, template, doc) {
    Session.set('player2', doc._id);
    Session.set('player2Name', doc.profile.name);
  },
  'autocompleteselect #p3-wrapper input': function(event, template, doc) {
    Session.set('player3', doc._id);
    Session.set('player3Name', doc.profile.name);
  },
  'autocompleteselect #p4-wrapper input': function(event, template, doc) {
    Session.set('player4', doc._id);
    Session.set('player4Name', doc.profile.name);
  },
});

Template.userPill.helpers({
  checkMe: function() {
    if (this._id === Meteor.userId()) {
      return "(me)";
    }
  }
});