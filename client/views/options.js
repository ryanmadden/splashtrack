Template.options.events({
  'click .btn-next': function () {
    var p1 = Session.get('player1');
    var p2 = Session.get('player2');
    var p3 = Session.get('player3');
    var p4 = Session.get('player4');
    var rt = $('.record-type-form input[type=radio]:checked').attr('recordType');
    var rp = $('.record-players-form input[type=radio]:checked').attr('recordPlayers');
    Games.insert({
      date: new Date(),
      roster: [p1, p2, p3, p4],
      records: {
        p1: {hits: null, misses: null, glass: null},
        p2: {hits: null, misses: null, glass: null},
        p3: {hits: null, misses: null, glass: null},
        p4: {hits: null, misses: null, glass: null}
      },
      recordType: rt,
      recordPlayers: rp
    }, function(error, id) {
      Session.set('gameId', id);
      console.log("The game ID is: " + id);
    });
    Router.go('/record');
  },
  'click .btn-back': function () {
    Router.go('/new');
  }
});