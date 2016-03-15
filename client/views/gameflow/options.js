Template.options.onRendered(function(){
  var p1 = Session.get('player1');
  var p2 = Session.get('player2');
  var p3 = Session.get('player3');
  var p4 = Session.get('player4');
  var rstr = [p1, p2, p3, p4];
  if (!(p1 != "Player 1" && p2 != "Player 2" && p3 != "Player 3" && p4 != "Player 4")) {
    console.log("You need 4 playrs for a rated game.");
    $('#ratedSwitch').attr('disabled', 'disabled');
  }
  if (!_.contains(rstr, Meteor.userId())) {
    console.log('You are not in the game.');
    $('.btn-next').addClass('disabled');
    $('#hmg').attr('disabled', 'disabled');
    $('#score-only').attr('disabled', 'disabled');
    // $('#score-only').attr('checked', 'checked');
  }
});

Template.options.events({
  'click .btn-next:not(.disabled)': function () {
    var rt = $('.record-type-form input[type=radio]:checked').attr('recordType');
    var p1 = Session.get('player1');
    var p2 = Session.get('player2');
    var p3 = Session.get('player3');
    var p4 = Session.get('player4');
    var rstr = [p1, p2, p3, p4];
    Games.insert({
      active: true,
      startDate: Date.parse(new Date()),
      endDate: null,
      rated: $('#ratedSwitch').prop('checked'),
      roster: rstr,
      rosterNames: [Session.get('player1Name'), Session.get('player2Name'), Session.get('player3Name'), Session.get('player4Name')],
      homeNames: [Session.get('player1Name'), Session.get('player2Name')],
      awayNames: [Session.get('player3Name'), Session.get('player4Name')],
      records: {
        [p1]: {robust: false, hits: 0, misses: 0, glass: 0, rebuthits: 0, rebutmisses: 0, rebutglass: 0},
        [p2]: {robust: false, hits: 0, misses: 0, glass: 0, rebuthits: 0, rebutmisses: 0, rebutglass: 0},
        [p3]: {robust: false, hits: 0, misses: 0, glass: 0, rebuthits: 0, rebutmisses: 0, rebutglass: 0},
        [p4]: {robust: false, hits: 0, misses: 0, glass: 0, rebuthits: 0, rebutmisses: 0, rebutglass: 0}
      },
      homeScore: 0,
      awayScore: 0,
      createdBy: Meteor.userId(),
    }, function(error, id) {
      Session.set('gameId', id);
      Session.set('recordMode', rt);
      Router.go('/record');
    });
},
'click .btn-back': function () {
  Router.go('/new');
}
});