Template.gameLog.helpers({
  games: function () {
    return Games.find({}).fetch().reverse();
  }
});

Template.gameCard.helpers({
  playerOne: function () {
    var name = this.homeNames[0];
    var hits = this.records[this.roster[0]].hits;
    return {
      name: name,
      hits: hits
    };
  },
  playerTwo: function () {
    var name = this.homeNames[1];
    var hits = this.records[this.roster[1]].hits;
    return {
      name: name,
      hits: hits
    };
  },
  playerThree: function () {
    var name = this.awayNames[0];
    var hits = this.records[this.roster[2]].hits;
    return {
      name: name,
      hits: hits
    };
  },
  playerFour: function () {
    var name = this.awayNames[1];
    var hits = this.records[this.roster[3]].hits;
    return {
      name: name,
      hits: hits
    };
  }
});