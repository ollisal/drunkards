/*var hour = moment().hour() + 8;
var hoursArray = [];
var lineDiagramData = {real: [], future: []};
*/

var serverAddress = 'http://ec2-54-194-210-241.eu-west-1.compute.amazonaws.com';

var socket = io(serverAddress);

/**
 * Application main module.
 */
var m = angular.module('wastedland', [
  'ui.bootstrap',
  'ui.router'
]);

m.config(function ($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('front', {
    url: '/',
    templateUrl: 'front.html',
    controller: 'ReportController',
    controllerAs: 'report'
  });

  $stateProvider.state('editDrunkard', {
    url: '/drunkard/{id}',
    controller: function ($http, $state, $stateParams, drunkards) {
      var id = parseInt($stateParams.id, 10);

      var drunkard = this;
      this.model = _.find(drunkards.items, 'id', id) || {
        name: '',
        bodyWeightKilograms: 80,
        sex: 'penis',
        idealDrunkennessLow: 10,
        idealDrunkennessHigh: 15
      };

      this.model.$idlPromilles = this.model.idealDrunkennessLow / 10;
      this.model.$idhPromilles = this.model.idealDrunkennessHigh / 10;

      this.save = function () {
        drunkard.model.idealDrunkennessLow = drunkard.model.$idlPromilles * 10;
        drunkard.model.idealDrunkennessHigh = drunkard.model.$idhPromilles * 10;

        if (drunkard.model.id) {
          $http.put(serverAddress + '/drunkards/' + drunkard.model.id, drunkard.model)
            .then(function success() {
              $state.go('front');
            });
        } else {
          $http.post(serverAddress + '/drunkards', drunkard.model)
            .then(function success() {
              $state.go('front');
            });
        }
      }
    },
    controllerAs: 'drunkard',
    templateUrl: 'drunkard.html'
  });

  $stateProvider.state('editDrink', {
    url: '/drink/{id}',
    controller: function ($http, $state, $stateParams, drinks) {
      var id = parseInt($stateParams.id, 10);

      var drink = this;
      this.model = _.find(drinks.items, 'id', id) || {
          name: '',
          ethanolGrams: 16
        };

      this.save = function () {
        if (drink.model.id) {
          $http.put(serverAddress + '/drinks/' + drink.model.id, drink.model)
            .then(function success() {
              $state.go('front');
            });
        } else {
          $http.post(serverAddress + '/drinks', drink.model)
            .then(function success() {
              $state.go('front');
            });
        }
      }
    },
    controllerAs: 'drink',
    templateUrl: 'drink.html'
  });
});

m.value('events', []);

m.factory('drinks', function ($rootScope, dranks, events) {
  var drinks = {
    items: []
  };

  socket.on('newDrink', function (drink) {
    $rootScope.$apply(function () {
      _.remove(drinks.items, 'id', drink.id);
      _(dranks)
        .filter('drink.id', drink.id)
        .each(function updateDrank(drank) {
          drank.drink = drink;
        })
        .commit();
      drinks.items.push(drink);
      events.push("A new revolutionary drink, " + drink.name +
        ", has been devised. It contains " + drink.ethanolGrams +
        ' grams of good old ethanol per portion.');
    });
  });

  return drinks;
});

m.factory('drunkards', function ($rootScope, dranks, events) {
  var drunkards = {
    items: []
  };

  socket.on('newDrunkard', function (drunkard) {
    $rootScope.$apply(function () {
      _.remove(drunkards.items, 'id', drunkard.id);
      _(dranks)
        .filter('drunkard.id', drunkard.id)
        .each(function updateDrank(drunkard) {
          drank.drunkard = drunkard;
        })
        .commit();
      drunkards.items.push(drunkard);
      var roll = Math.random();
      if (roll < 0.3) {
        events.push('New challenger ' + drunkard.name + ' has appeared!');
      } else if (roll < 0.5) {
        events.push(drunkard.name + ' is going to get drunk tonight!');
      } else if (roll < 0.8) {
        events.push(drunkard.name + ', a born drunkard, has joined the fun.');
      } else {
        events.push(drunkard.name + ' has joined the booze race. KMikkos minions grow stronger!');
      }
    });
  });

  return drunkards;
});

m.factory('highlightedDrunkard', function () {
  return {
    stats: {},
    highestEbacEva: null
  };
});

m.controller('HighlightedDrunkardController', function (highlightedDrunkard) {
  this.stats = highlightedDrunkard.stats;
});

m.controller('TotalsController', function ($rootScope, highlightedDrunkard, dranks) {
  var totals = this;

  $rootScope.$watch(_.constant(dranks.items), function () {
    totals.numberDrank = dranks.items.length;
    totals.totalAlcoholGrams = _.sum(dranks.items, 'drink.ethanolGrams');
  }, true);
  $rootScope.$watch(function () {
    totals.highestEbacEva = highlightedDrunkard.highestEbacEva;
  });
});

m.factory('dranks', function ($rootScope, events, highlightedDrunkard) {
  var dranks = {
    items: []
  };

  socket.on('newDrank', function (drank) {
    $rootScope.$apply(function () {
      dranks.items.push(drank);
      var timeToNext = 10 + Math.random() * 30;
      var whenNextDrank = moment(drank.dateTime).add(timeToNext, 'minutes').format("HH:mm");
      var roll = Math.random();
      if (roll < 0.3) {
        events.push(drank.drunkard.name + ' finished another ' + drank.drink.name +
          ' and added ' + drank.drink.ethanolGrams + 'g of alcohol to his bodily fluids. At this rate of consumption he will pass out approximately ' +
          whenNextDrank + ' today.');
      } else if (roll < 0.5) {
        events.push(drank.drunkard.name + ' drank a ' + drank.drink.name +
          '. It is likely that he will finish his next drink at ' + whenNextDrank);
      } else {
        events.push(drank.drunkard.name + ' got even drunker by emptying a ' + drank.drink.name);
      }
    });
  });

  setInterval(function() {
    var drunkards       = {};
    var drunkardDetails = {};
    var lineDiagramData = {};
    function newDrunkard(drunkard) {
      drunkards[drunkard.name] = [];
      drunkardDetails[drunkard.name] = drunkard;
    }
    function newDrank(drank) {
      drunkards[drank.drunkard.name].push( { name: drank.drink.name, ethanolGrams: drank.drink.ethanolGrams, dateTime: drank.dateTime } );
    }
    _.each(dranks.items, function (drank) {
      newDrunkard(drank.drunkard);
    });
    _.each(dranks.items, newDrank);

    var names = Object.keys(drunkards);
    var name = names[Math.floor(Math.random()*names.length)];
    var drinkAmount = drunkards[name].length;
    var plotter = plotDrunkenness(name, drunkards, drunkardDetails);

    var ctx = $("#alcoholLevel").get(0).getContext("2d");
    var data = {
      labels: plotter[0],
      datasets: [
        {
          fillColor: "transparent",
          strokeColor: "rgba(0,187,205,1)",
          pointColor: "rgba(0,187,205,1)",
          pointStrokeColor: "#fff",
          data: plotter[1]
        },
        {
          fillColor: "transparent",
          strokeColor: "rgba(243,135,7,1)",
          pointColor: "rgba(243,135,7,1)",
          pointStrokeColor: "#fff",
          data: plotter[2]
        }
      ]
    };
    var drunkChart = new Chart(ctx).Line(data, {
      bezierCurve: true,
      responsive: false,
      maintainAspectRatio: false,
      showTooltips: false,
      scaleIntegersOnly: false,
      scaleLabel: "<%= ' ' + value%>"
    });

    $rootScope.$apply(function () {
      _.assign(highlightedDrunkard.stats, {
        name: name,
        sex: drunkardDetails[name].sex,
        weight: drunkardDetails[name].bodyWeightKilograms,
        ebac: plotter[3],
        drinkAmount: drinkAmount
      });
      highlightedDrunkard.highestEbacEva = _.max(plotter[2].concat(highlightedDrunkard.highestEbacEva));
    });
  }, 3000);

  return dranks;
});

m.factory('flood', function (drinks, drunkards, dranks) {
  socket.emit('floodMe');
  return {};
});

m.controller('EventsController', function (flood, events) {
  this.items = events;
});

m.controller('ReportController', function ($http, drinks, drunkards) {
  var report = this;

  this.drunkards = drunkards.items;
  this.drinks = drinks.items;

  this.selectedDrunkardId = null;
  this.selectedDrinkId = null;

  this.submit = function () {
    $http.post(serverAddress + '/dranks', {
      drunkardId: parseInt(report.selectedDrunkardId, 10),
      drinkId: parseInt(report.selectedDrinkId, 10)
    }).then(function () {
      report.selectedDrinkId = report.selectedDrunkardId = null;
    });
  };
});


function plotDrunkenness(name, drunkards, drunkardDetails) {
  var hoursArray = [];
  var real = [];
  var future = [];
  var sortedDranks = _.sortBy(drunkards[name], 'dateTime');
  var weight = drunkardDetails[name].bodyWeightKilograms;
  var sex = drunkardDetails[name].sex;
  var drunkenness = 0;
  var lastDrink = moment().add(-17, "hours");
  var drunkennessNow = 0;
  for (h = -15; h <= 8; ++h) {
    var ethanolAmount = 0;
    var currentHour = moment().add(h, "hours");
    var startedDrinking = false;
    hoursArray.push(moment().add(h, "hours").format("HH") + ":00");

    $.each(sortedDranks, function( index, value ) {
      if (!startedDrinking) startedDrinking = moment(value.dateTime);
      if (moment(value.dateTime).isBefore( currentHour ) && moment(value.dateTime).isAfter( lastDrink )) {
        ethanolAmount += value.ethanolGrams;
        lastDrink = value.dateTime;
        console.log("juotu " + moment(lastDrink).format("HH:mm"));
      }
    });

    var drinkingTime = currentHour.diff(startedDrinking);
    if (drinkingTime < 0) drinkingTime = 0;
    drunkenness = calculateDrunkenness(weight, sex, ethanolAmount, 1, drunkenness);
    console.log("Känniys: " + currentHour.format("HH:mm") + " - " + drunkenness);
    future.push(drunkenness*10);
    h <= 0 ? real.push(drunkenness*10) : real.push(null);
    if (h == 0) drunkennessNow = drunkenness*10;
  }
  return [hoursArray, future, real, drunkennessNow];
}


function calculateDrunkenness(wt, sex, ethanolAmount, dp, present) {
    console.log("lasketaan; paino: " + wt + ", sukupuoli: " + sex + ", etanolimäärä: " + ethanolAmount + ", aika: " + dp);
    var sd = ethanolAmount/17;
    var bw = 0.58;
    var mr = 0.015;
    if (sex === "vagina") {
      bw = 0.49;
      mr = 0.017;
    }
    var ebac = Math.max( present + ((0.806 * 1.2 * sd) / (bw * wt) ) - (mr * dp), 0);
    console.log("promillet: " + ebac);
    return ebac;
}
