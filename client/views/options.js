Template.options.onRendered(function(){
  var p1 = Session.get('player1');
  var p2 = Session.get('player2');
  var p3 = Session.get('player3');
  var p4 = Session.get('player4');
  var rstr = [p1, p2, p3, p4];
  if (!_.contains(rstr, Meteor.userId())) {
    console.log('You are not in the game.');
    $('#hmg').attr('disabled', 'disabled');
    $('#hmg').removeAttr('checked');
    $('#score-only').attr('checked', 'checked');
  }
});

Template.options.events({
  'click .btn-next:not(.disabled)': function () {
    var rt = $('.record-type-form input[type=radio]:checked').attr('recordType');
    // var rp = $('.record-players-form input[type=radio]:checked').attr('recordPlayers');
    var p1 = Session.get('player1');
    var p2 = Session.get('player2');
    var p3 = Session.get('player3');
    var p4 = Session.get('player4');
    var rstr = [p1, p2, p3, p4];
    var active = _.contains(rstr, Meteor.userId()) ? Meteor.userId() : Session.get('player1');
    Games.insert({
      active: true,
      startDate: new Date(),
      endDate: null,
      roster: rstr,
      rosterNames: [Session.get('player1Name'), Session.get('player2Name'), Session.get('player3Name'), Session.get('player4Name')],
      homeNames: [Session.get('player1Name'), Session.get('player2Name')],
      awayNames: [Session.get('player3Name'), Session.get('player4Name')],
      activePlayer: active,
      records: {
        [p1]: {hits: null, misses: null, glass: null},
        [p2]: {hits: null, misses: null, glass: null},
        [p3]: {hits: null, misses: null, glass: null},
        [p4]: {hits: null, misses: null, glass: null}
      },
      homeScore: 0,
      awayScore: 0,
      recordType: rt,
    }, function(error, id) {
      Session.set('gameId', id);
      console.log("The game ID is: " + id);
      if (rt === 'all') {
        Router.go('/record');
      }
      else {
        Router.go('/scoreboard');
      }

    });
  },
  'click .btn-back': function () {
    Router.go('/new');
  }
});