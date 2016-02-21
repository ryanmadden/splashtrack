Template.mystats.helpers({
  games: function () {
    var games = Games.find().fetch().reverse();
    return games;
  },
  profile: function () {
    return Meteor.users.findOne({_id: Meteor.userId()}).profile;
  },
  stats: function () {
    var games = Games.find().fetch().reverse();
    var wins = 0;
    var losses = 0;
    var ties = 0;
    var allhits = 0;
    var hits = 0;
    var misses = 0;
    var glass = 0;
    for (var i = 0; i < games.length; i++) {
      var activeGame = games[i];
      var p1Hits = activeGame.records[activeGame.roster[0]].hits;
      var p2Hits = activeGame.records[activeGame.roster[1]].hits;
      var p3Hits = activeGame.records[activeGame.roster[2]].hits;
      var p4Hits = activeGame.records[activeGame.roster[3]].hits;
      var p1Rebuts = activeGame.records[activeGame.roster[0]].rebuthits;
      var p2Rebuts = activeGame.records[activeGame.roster[1]].rebuthits;
      var p3Rebuts = activeGame.records[activeGame.roster[2]].rebuthits;
      var p4Rebuts = activeGame.records[activeGame.roster[3]].rebuthits;
      var home = p1Hits + p2Hits - p1Rebuts - p2Rebuts - p3Rebuts - p4Rebuts;
      var away = p3Hits + p4Hits - p1Rebuts - p2Rebuts - p3Rebuts - p4Rebuts;
      var onHomeTeam = Meteor.userId() === activeGame.roster[0] || Meteor.userId() === activeGame.roster[1];
      if (home > away ) {
        if (onHomeTeam) { wins++; }
        else { losses++; }
      }
      else if (home < away) {
        if (onHomeTeam) { losses++; }
        else { wins++; }
      }
      else if (home === away) {
        ties++;
      }
      else {
        // shouldn't happen
        console.log("Score compute error");
      }
      allhits += activeGame.records[Meteor.userId()].hits;
      if (activeGame.records[Meteor.userId()].robust === true) {
        hits += activeGame.records[Meteor.userId()].hits;
        misses += activeGame.records[Meteor.userId()].misses;
        glass += activeGame.records[Meteor.userId()].glass;
      }

    }
    var total = hits + misses + glass;
    var obj = {
      wins: wins,
      losses: losses,
      ties: ties,
      winratio: Math.round(wins/games.length*100),
      lossratio: Math.round(losses/games.length*100),
      tieratio: Math.round(ties/games.length*100),
      hpg: Math.round(allhits/games.length*100)/100,
      hits: hits,
      misses: misses,
      glass: glass,
      hitratio: Math.round(hits/total*100),
      missratio: Math.round(misses/total*100),
      glassratio: Math.round(glass/total*100),
    };
    return obj;
  }
});