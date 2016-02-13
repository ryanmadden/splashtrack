Template.gameLog.helpers({
  games: function () {
    console.log(Games.find({}).fetch().reverse());
    return Games.find({}).fetch().reverse();
  }
});

Template.gameCard.helpers({
  playerData: function () {
    var playerData = {};
    for (var i = 0; i < 4; i++) {
      var accessor = "player" + (1 + i);
      playerData[accessor] = {
        name: this.rosterNames[i],
        hits: this.records[this.roster[i]].hits,
        misses: this.records[this.roster[i]].misses,
        glass: this.records[this.roster[i]].glass,
        goodData: false,
        hitRatio: null,
        missRatio: null,
        glassRatio: null
      };
      if (playerData[accessor].hits !== null && playerData[accessor].misses !== null && playerData[accessor].glass !== null) {
        playerData[accessor].goodData = true;
        var total = playerData[accessor].hits + playerData[accessor].misses + playerData[accessor].glass;
        playerData[accessor].hitRatio = Math.round(playerData[accessor].hits/total*100);
        playerData[accessor].missRatio = Math.round(playerData[accessor].misses/total*100);
        playerData[accessor].glassRatio = Math.round(playerData[accessor].glass/total*100);
      }
    }
    console.log(playerData);
    return playerData;
  },
  superUser: function() {
    if (Meteor.user()) {
      return Meteor.user().profile.name === "Ryan Madden";
    }
    else {
      return false;
    }
  }
});

Template.gameCard.events({
  'click .btn-delete': function () {
    Meteor.call('deleteGame', this._id);
  }
});

Template.gameCard.onRendered(function() {
  $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
})
