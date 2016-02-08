Template.gameLog.helpers({
  games: function () {
    return Games.find({}).fetch().reverse();
  }
});

Template.gameCard.helpers({
  playerOne: function () {
    var name = this.homeNames[0];
    var hits = this.records[this.roster[0]].hits;
    var misses = this.records[this.roster[0]].misses;
    var glass = this.records[this.roster[0]].glass;
    if (hits && misses && glass) {
      var total = hits + misses + glass;
      var hitRatio = Math.round(hits/total*100);
      var missRatio =  Math.round(misses/total*100);
      var glassRatio =  Math.round(glass/total*100);
      var goodData = true;
    }
    if (goodData) {
      return {
        name: name,
        hits: hits,
        misses: this.records[this.roster[0]].misses || 'No Data',
        glass: this.records[this.roster[0]].glass || 'No Data',
        goodData: goodData,
        hitRatio: hitRatio,
        missRatio: missRatio,
        glassRatio: glassRatio
      };
    }
    else {
      return {
        name: name,
        hits: hits
      };
    }
  },
  playerTwo: function () {
    var name = this.homeNames[1];
    var hits = this.records[this.roster[1]].hits;
    var misses = this.records[this.roster[1]].misses;
    var glass = this.records[this.roster[1]].glass;
    if (hits && misses && glass) {
      var total = hits + misses + glass;
      var hitRatio = Math.round(hits/total*100);
      var missRatio =  Math.round(misses/total*100);
      var glassRatio =  Math.round(glass/total*100);
      var goodData = true;
    }
    if (goodData) {
      return {
        name: name,
        hits: hits,
        misses: this.records[this.roster[1]].misses || 'No Data',
        glass: this.records[this.roster[1]].glass || 'No Data',
        goodData: goodData,
        hitRatio: hitRatio,
        missRatio: missRatio,
        glassRatio: glassRatio
      };
    }
    else {
      return {
        name: name,
        hits: hits
      };
    }
  },
  playerThree: function () {
    var name = this.awayNames[0];
    var hits = this.records[this.roster[2]].hits;
    var misses = this.records[this.roster[2]].misses;
    var glass = this.records[this.roster[2]].glass;
    if (hits && misses && glass) {
      var total = hits + misses + glass;
      var hitRatio = Math.round(hits/total*100);
      var missRatio =  Math.round(misses/total*100);
      var glassRatio =  Math.round(glass/total*100);
      var goodData = true;
    }
    if (goodData) {
      return {
        name: name,
        hits: hits,
        misses: this.records[this.roster[2]].misses || 'No Data',
        glass: this.records[this.roster[2]].glass || 'No Data',
        goodData: goodData,
        hitRatio: hitRatio,
        missRatio: missRatio,
        glassRatio: glassRatio
      };
    }
    else {
      return {
        name: name,
        hits: hits
      };
    }
  },
  playerFour: function () {
    var name = this.awayNames[1];
    var hits = this.records[this.roster[3]].hits;
    var misses = this.records[this.roster[3]].misses;
    var glass = this.records[this.roster[3]].glass;
    if (hits && misses && glass) {
      var total = hits + misses + glass;
      var hitRatio = Math.round(hits/total*100);
      var missRatio =  Math.round(misses/total*100);
      var glassRatio =  Math.round(glass/total*100);
      var goodData = true;
    }
    if (goodData) {
      return {
        name: name,
        hits: hits,
        misses: this.records[this.roster[3]].misses || 'No Data',
        glass: this.records[this.roster[3]].glass || 'No Data',
        goodData: goodData,
        hitRatio: hitRatio,
        missRatio: missRatio,
        glassRatio: glassRatio
      };
    }
    else {
      return {
        name: name,
        hits: hits
      };
    }
  }
});

Template.gameCard.onRendered(function() {
  $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
})
