Template.newGame.onCreated(function() {
  Session.set('player1', null);
  Session.set('player2', null);
  Session.set('player3', null)
  Session.set('player4', null);
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
    console.log(Meteor.users.find().fetch());
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
  },
  'autocompleteselect #p2-wrapper input': function(event, template, doc) {
    Session.set('player2', doc._id);
  },
  'autocompleteselect #p3-wrapper input': function(event, template, doc) {
    Session.set('player3', doc._id);
  },
  'autocompleteselect #p4-wrapper input': function(event, template, doc) {
    Session.set('player4', doc._id);
  },
});

Template.userPill.helpers({
  checkMe: function() {
    if (this._id === Meteor.userId()) {
      return "(me)";
    }
  }
});