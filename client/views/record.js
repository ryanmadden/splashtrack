Template.record.onCreated(function() {

});

Template.record.events({
  'click .btn-hit': function() {
    Meteor.call('recordHit', Session.get('gameId'), Session.get('activeGame').activePlayer);
    console.log('click');
  }
})

Template.record.helpers({
  activeGame: function() {
     var currGame = Games.findOne({_id: Session.get('gameId')});
     Session.set('activeGame', currGame);
     return currGame;
  },
  hitsRaw: function() {
    var hits = Session.get('activeGame');
    if (hits) {
      var h = hits.records[Meteor.userId()].hits;
      if (!h) {
        return 0;
      }
      else {
        return h;
      }
    }
    else {
      return "error";
    }
  }
});