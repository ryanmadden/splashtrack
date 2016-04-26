Meteor.methods({
  aggregateStats: function() {
    var users = Meteor.users.find().fetch();
    for (var x = 0; x < users.length; x++) {
      Meteor.call('updateStats', users[x]._id);
    }
  },
  cleanGameSchema: function() {
    Games.update({}, {$unset: {
      awayNames: "",
      homeNames: "",
      awayScore: "",
      homeScore: "",
      profile: "",
    }}, {multi: true});
  },
  deleteGame: function(gameId) {
    Games.remove({_id: gameId});
  },
  processAllRatedGames: function() {
    var ratedGames = Games.find({rated: true}, {sort: {startDate: 1}}).fetch();
    for (var x = 0; x < ratedGames.length; x++) {
      Meteor.call('updateRatings', ratedGames[x]._id);
    }
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
  resetAllRatings: function() {
    var users = Meteor.users.find().fetch();
    for (var x = 0; x < users.length; x++) {
      Meteor.call('resetRating', users[x]._id);
    }
  },
  resetRating: function(playerId) {
    console.log("Setting rating: " + playerId + " to null");
    Meteor.users.update({_id: playerId}, {$set: {'profile.rating': null, 'profile.ratingHistory': []}});
  },
  setRating: function(playerId, rating) {
    console.log("Setting rating: " + playerId + " to " + rating);
    Meteor.users.update({_id: playerId}, {$set: {'profile.rating': rating}, $push: {'profile.ratingHistory': rating}});
  },
  setAllRatings: function(rating) {
    var users = Meteor.users.find().fetch();
    for (var x = 0; x < users.length; x++) {
      Meteor.call('setRating', users[x]._id, rating);
    }
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
  swapPlayer: function(gameId, playerIn, playerOut) {
    var currGame = Games.findOne({_id: gameId});
    var playerInName = Meteor.users.findOne({_id: playerIn}).profile.name;
    if (currGame.rated === true) {
      console.log("Warning: Swapping rated game");
    }
    for (var i = 0; i < 4; i++) {
      if (currGame.roster[i] === playerOut) {
        currGame.roster[i] = playerIn;
        currGame.rosterNames[i] = playerInName;
        Games.update({_id: gameId}, {
          $set: {
            roster: currGame.roster, 
            rosterNames: currGame.rosterNames,
            ['records.' + playerIn]: currGame.records[playerOut]
          },
          $unset: {
            ['records.' + playerOut]: ""
          }
        });
      }
    }
  },
  updateRatings: function(gameId) {
    // TODO refactor
    var activeGame = Games.findOne({_id: gameId});
    var p1Hits = activeGame.records[activeGame.roster[0]].hits;
    var p2Hits = activeGame.records[activeGame.roster[1]].hits;
    var p3Hits = activeGame.records[activeGame.roster[2]].hits;
    var p4Hits = activeGame.records[activeGame.roster[3]].hits;
    var oldRatings = [null, null, null, null];
    var ratingDeltas = [0, 0, 0, 0];
    var newRatings = [null, null, null, null];
    var kValue = 20;
    for (var i = 0; i < 4; i++) {
      oldRatings[i] = Meteor.users.findOne({_id: activeGame.roster[i]}).profile.rating;
    }

    var tempDelta = 0;
    // p1 vs. p2
    tempDelta = calculateDelta(p1Hits, oldRatings[0], p2Hits, oldRatings[1], kValue);
    ratingDeltas[0] = ratingDeltas[0] + tempDelta;
    ratingDeltas[1] = ratingDeltas[1] - tempDelta;
    // p3 vs. p4
    tempDelta = calculateDelta(p3Hits, oldRatings[2], p4Hits, oldRatings[3], kValue);
    ratingDeltas[2] = ratingDeltas[2] + tempDelta;
    ratingDeltas[3] = ratingDeltas[3] - tempDelta;
    // p1 vs. p3
    tempDelta = calculateDelta(p1Hits, oldRatings[0], p3Hits, oldRatings[2], kValue);
    ratingDeltas[0] = ratingDeltas[0] + tempDelta;
    ratingDeltas[2] = ratingDeltas[2] - tempDelta;
    // p2 vs. p4
    tempDelta = calculateDelta(p2Hits, oldRatings[1], p4Hits, oldRatings[3], kValue);
    ratingDeltas[1] = ratingDeltas[1] + tempDelta;
    ratingDeltas[3] = ratingDeltas[3] - tempDelta;
    // p1 vs. p4
    tempDelta = calculateDelta(p1Hits, oldRatings[0], p4Hits, oldRatings[3], kValue);
    ratingDeltas[0] = ratingDeltas[0] + tempDelta;
    ratingDeltas[3] = ratingDeltas[3] - tempDelta;
    // p2 vs. p3
    tempDelta = calculateDelta(p2Hits, oldRatings[1], p3Hits, oldRatings[2], kValue);
    ratingDeltas[1] = ratingDeltas[1] + tempDelta;
    ratingDeltas[2] = ratingDeltas[2] - tempDelta;

    for (var i = 0; i < 4; i++) {
      newRatings[i] = Math.round(oldRatings[i] + ratingDeltas[i]);
      Meteor.call('setRating', activeGame.roster[i], newRatings[i]);
    }
  },
  updateStats: function(playerId) {
    var games = Games.find({roster: playerId}, {sort: {startDate: -1}}).fetch();
    var ratedGames = 0;
    var numGames = games.length;
    var rank;
    if (numGames < 1) { rank = "Nobody"; }
    else if (numGames < 5) { rank = "Lightweight"; }
    else if (numGames < 10) { rank = "Amateur"; }
    else if (numGames < 20) { rank = "Booler"; }
    else if (numGames < 35) { rank = "Caps Fiend"; }
    else if (numGames < 50) { rank = "Stein Lord"; }
    else if (numGames < 75) { rank = "Veteran"; }
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
      if (activeGame.rated === true) { ratedGames++; }
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
      ratedGames: ratedGames,
      winratio: Math.round(wins/games.length*100) || 0,
      lossratio: Math.round(losses/games.length*100) || 0,
      tieratio: Math.round(ties/games.length*100) || 0,
      allhits: allhits,
      hits: hits,
      misses: misses,
      glass: glass,
      hitratio: Math.round(hits/total*100) || 0,
      missratio: Math.round(misses/total*100) || 0,
      glassratio: Math.round(glass/total*100) || 0,
      allrebuttals: allrebuttals,
      rebuthits: rHits,
      rebutmisses: rMisses,
      rebutglass: rGlass,
      rebuthitratio: Math.round(rHits/rTotal*100) || 0,
      rebutmissratio: Math.round(rMisses/rTotal*100) || 0,
      rebutglassratio: Math.round(rGlass/rTotal*100) || 0,
    };
    Meteor.users.update({_id: playerId}, {$set: {'profile.stats': stats, 'profile.rank': rank}});
  }
});

var calculateDelta = function(hitsA, ratingA, hitsB, ratingB, kValue) {
  // p1 vs. p2
  var expectedResult = 1/(1 + Math.pow(10, ((ratingB - ratingA)/400)));
  var actualResult;
  if (hitsA > hitsB) { actualResult = 1; }
  else if (hitsA < hitsB) { actualResult = 0; }
  else { actualResult = 0.5; }
  var movm = Math.log(Math.abs(hitsA - hitsB) + 1) * (2.2/((hitsA > hitsB ? ratingA - ratingB : ratingB - ratingA) * 0.001 + 2.2));
  var delta = (actualResult - expectedResult) * kValue * movm;
  return delta;
}