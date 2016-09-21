Template.gameLog.onCreated(function() {
  const handle = Meteor.subscribeWithPagination('games', 'all', 10);

  $(window).scroll(function() {
    if(($(window).scrollTop() + $(window).height() > $(document).height() - 10) && handle.ready()) {
      handle.loadNextPage();
    }
  });
});


Template.gameLog.helpers({
  games: function () {
    return Games.find({}, {sort: {startDate: -1}}).fetch();
  }
});

Template.gameCard.helpers({
  playerData: function () {
    var playerData = {};
    for (var i = 0; i < 4; i++) {
      var accessor = "player" + (1 + i);
      playerData[accessor] = this.records[this.roster[i]];
      playerData[accessor].name = this.rosterNames[i];
      playerData[accessor].hitRatio = null;
      playerData[accessor].missRatio = null;
      playerData[accessor].glassRatio = null;
      if (playerData[accessor].robust) {
        var total = playerData[accessor].hits + playerData[accessor].misses + playerData[accessor].glass;
        playerData[accessor].hitRatio = Math.round(playerData[accessor].hits/total*100) || 0;
        playerData[accessor].missRatio = Math.round(playerData[accessor].misses/total*100) || 0;
        playerData[accessor].glassRatio = Math.round(playerData[accessor].glass/total*100) || 0;
      }
    }
    return playerData;
  },
  score: function () {
    var activeGame = this;
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
    return {
      p1: p1Hits,
      p2: p2Hits, 
      p3: p3Hits,
      p4: p4Hits,
      home: home,
      away: away,
      homeWinner: home > away,
      awayWinner: away > home,
      p1Name: activeGame.rosterNames[0],
      p2Name: activeGame.rosterNames[1],
      p3Name: activeGame.rosterNames[2],
      p4Name: activeGame.rosterNames[3]
    }
  },
  superUser: function() {
    if (Meteor.user()) {
      return Meteor.user().profile.name === "Ryan Madden";
    }
    else {
      return false;
    }
  },
  date: function() {
    var date = new Date(this.startDate);
    return [date.getMonth()+1, date.getDate(), date.getFullYear()].join('/');
  },
  elapsed: function() {
    if (this.startDate && this.endDate) {
      var diff = Math.abs(new Date(this.endDate) - new Date(this.startDate));
      return Math.floor((diff/1000)/60);
    }
    else {
      return false;
    }
  },
  isActive: function() {
    return this.active;
  },
  isRated: function() {
    return this.rated;
  }
});

Template.gameCard.events({
  'click .btn-delete': function () {
    var roster = this.roster;
    _.map(roster, function(playerId) {
      if (playerId.indexOf('Player') === -1) {
        Meteor.call('updateStats', playerId);
      }
    });
    Meteor.call('deleteGame', this._id);
  },
  'click .btn-edit': function() {
    Router.go('/edit/' + this._id);
  }
});

Template.gameCard.onRendered(function() {
  $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
});
