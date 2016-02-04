Template.newGame.onRendered(function() {
  $('select').material_select();
});

Template.newGame.helpers({
  settings: function() {
    return {
      position: "bottom",
      limit: 5,
      rules: [
      {
        token: '',
        collection: Meteor.users,
        field: "profile.name",
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
    //TODO validate plater input
    //TODO set roster session variable and create game

    Router.go('/options');
  },
  'click .btn-back': function () {
    Router.go('/');
  },
  'click option': function () {
    console.log('fuck');
  }
});

Template.userPill.helpers({
  checkMe: function() {
    if (this._id === Meteor.userId()) {
      return "(me)";
    }
  }
});