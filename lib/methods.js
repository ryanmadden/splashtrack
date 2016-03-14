Meteor.methods({
  aggregateStats: function() {
    var users = Meteor.users.find().fetch();
    for (var x = 0; x < users.length; x++) {
      Meteor.call('updateStats', users[x]._id);
    }
  },
  deleteGame: function(gameId) {
    Games.remove({_id: gameId});
  },
  recordHit: function(gameId, playerId, recordType, rebuttalMode) {

    if (rebuttalMode) {
      var currGame = Games.findOne({_id: gameId});
      var roster = currGame.roster;
      var opposingScore;
      var onHomeTeam = playerId === roster[0] || playerId === roster[1];
      var p1Hits = currGame.records[currGame.roster[0]].hits;
      var p2Hits = currGame.records[currGame.roster[1]].hits;
      var p3Hits = currGame.records[currGame.roster[2]].hits;
      var p4Hits = currGame.records[currGame.roster[3]].hits;
      var p1Rebuts = currGame.records[currGame.roster[0]].rebuthits;
      var p2Rebuts = currGame.records[currGame.roster[1]].rebuthits;
      var p3Rebuts = currGame.records[currGame.roster[2]].rebuthits;
      var p4Rebuts = currGame.records[currGame.roster[3]].rebuthits;
      if (onHomeTeam) {
        opposingScore = p3Hits + p4Hits - p1Rebuts - p2Rebuts - p3Rebuts - p4Rebuts;
      }
      else {
        opposingScore = p1Hits + p2Hits - p1Rebuts - p2Rebuts - p3Rebuts - p4Rebuts;
      }
      if (opposingScore > 0) {
        Games.update(gameId, {
          $inc: {['records.' + playerId + '.' + recordType]: 1}
        });
        Games.update(gameId, {
          $inc: {['records.' + playerId + '.rebut' + recordType]: 1}
        });
      }
      else {
        return "You can't hit a rebuttal unless the other team has points.";
      }
    }
    else {
      Games.update(gameId, {
        $inc: {['records.' + playerId + '.' + recordType]: 1}
      });
    }
  },
  resetLoginConfig: function() {
    Accounts.loginServiceConfiguration.remove({
      service: "facebook"
    });
  },
  setRobust: function(gameId, playerId, bool) {
    Games.update(gameId, {
      $set: {['records.' + playerId + '.robust']: bool}
    });
    console.log(Games.findOne({_id: gameId}));
  },
  subtractHit: function(gameId, playerId, recordType, rebuttalMode) {
    // TODO Refactor subtract hit logic
    var currGame = Games.findOne({_id: gameId});
    if (currGame !== null) {
      if (rebuttalMode) {
        if (currGame.records[playerId]['rebut' + recordType] !== null && currGame.records[playerId]['rebut' + recordType] > 0) {
          Games.update(gameId, {
            $inc: {['records.' + playerId + '.' + recordType]: -1}
          });
          Games.update(gameId, {
            $inc: {['records.' + playerId + '.rebut' + recordType]: -1}
          });
        }
        else {
          return "Sorry, you can't subtract rebuttal " + recordType + " if the player doesn't have any.";
        }
      }
      else {
        if (currGame.records[playerId][recordType] !== null && currGame.records[playerId][recordType] > currGame.records[playerId]['rebut' + recordType]) {
          Games.update(gameId, {
            $inc: {['records.' + playerId + '.' + recordType]: -1}
          });
        }
        else {
          return "Sorry, you can't subtract " + recordType + " if the player doesn't have any (or they only have rebuttals).";
        }
      }
    }
    else {
    }
  },
  updateStats: function(playerId) {
    var games = Games.find({roster: playerId}, {sort: {startDate: -1}}).fetch();
    var numGames = games.length;
    var rank;
    if (numGames < 5) { rank = "Lightweight"; }
    else if (numGames < 10) { rank = "Amateur"; }
    else if (numGames < 20) { rank = "Booler"; }
    else if (numGames < 50) { rank = "Caps Fiend"; }
    else if (numGames < 100) { rank = "Stein Lord"; }
    else { rank = "Splash King"; }
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
      var onHomeTeam = playerId === activeGame.roster[0] || playerId === activeGame.roster[1];
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
      allhits += activeGame.records[playerId].hits;
      allrebuttals += activeGame.records[playerId].rebuthits;
      if (activeGame.records[playerId].robust === true) {
        hits += activeGame.records[playerId].hits;
        misses += activeGame.records[playerId].misses;
        glass += activeGame.records[playerId].glass;
        rHits += activeGame.records[playerId].rebuthits;
        rMisses += activeGame.records[playerId].rebutmisses;
        rGlass += activeGame.records[playerId].rebutglass;
      }

    }
    var total = hits + misses + glass;
    var rTotal = rHits + rMisses + rGlass;
    var stats = {
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
    Stats.upsert({playerId: playerId}, {$set: {playerId: playerId, rank: rank, stats: stats}});
  }
});