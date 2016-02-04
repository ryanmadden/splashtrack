Template.record.onCreated(function() {
  Games.insert({});
  var initial = { 
    hits: 0,
    misses: 0,
    glass: 0
  };
  Session.set('activeGame', { 
    hits: 0,
    misses: 0,
    glass: 0
  });
});

Template.record.events({
  'click .btn-hit': function() {
    Games.insert()
  }
})
