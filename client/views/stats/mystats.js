Template.mystats.helpers({
  games: function () {
    var games = Games.find({roster: Meteor.userId()}, {sort: {startDate: -1}}).fetch();
    return games;
  },
  profile: function () {
    return Meteor.users.findOne({_id: Meteor.userId()}).profile;
  },
  rankname: function () {
    var numGames = Games.find({roster: Meteor.userId()}).fetch().length;
    if (numGames < 5) { return "(Lightweight)"; }
    else if (numGames < 10) { return "(Amateur)"; }
    else if (numGames < 20) { return "(Booler)"; }
    else if (numGames < 50) { return "(Caps Fiend)"; }
    else if (numGames < 100) { return "(Stein Lord)"; }
    else { return "(Splash King)"; }
  },
  stats: function () {
    var games = Games.find({roster: Meteor.userId()}).fetch().reverse();
    var wins = 0;
    var losses = 0;
    var ties = 0;
    var allhits = 0;
    var hits = 0;
    var misses = 0;
    var glass = 0;
    var rHits = 0;
    var rMisses = 0;
    var rGlass = 0;
    var allrebuttals = 0;
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
      allrebuttals += activeGame.records[Meteor.userId()].rebuthits;
      if (activeGame.records[Meteor.userId()].robust === true) {
        hits += activeGame.records[Meteor.userId()].hits;
        misses += activeGame.records[Meteor.userId()].misses;
        glass += activeGame.records[Meteor.userId()].glass;
        rHits += activeGame.records[Meteor.userId()].rebuthits;
        rMisses += activeGame.records[Meteor.userId()].rebutmisses;
        rGlass += activeGame.records[Meteor.userId()].rebutglass;
      }

    }
    var total = hits + misses + glass;
    var rTotal = rHits + rMisses + rGlass;
    var obj = {
      wins: wins,
      losses: losses,
      ties: ties,
      games: games.length,
      winratio: Math.round(wins/games.length*100),
      lossratio: Math.round(losses/games.length*100),
      tieratio: Math.round(ties/games.length*100),
      cpg: Math.round(allhits/games.length*100)/100,
      hits: hits,
      misses: misses,
      glass: glass,
      hitratio: Math.round(hits/total*100),
      missratio: Math.round(misses/total*100),
      glassratio: Math.round(glass/total*100),
      rpg: Math.round(allrebuttals/games.length*100)/100,
      rebuthits: rHits,
      rebutmisses: rMisses,
      rebutglass: rGlass,
      rebuthitratio: Math.round(rHits/rTotal*100),
      rebutmissratio: Math.round(rMisses/rTotal*100),
      rebutglassratio: Math.round(rGlass/rTotal*100),
    };
    return obj;
  }
});