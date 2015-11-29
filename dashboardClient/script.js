/*var hour = moment().hour() + 8;
var hoursArray = [];
var lineDiagramData = {real: [], future: []};
*/

var serverAddress = 'http://ec2-54-194-210-241.eu-west-1.compute.amazonaws.com:8641';

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

m.factory('dranks', function ($rootScope, events) {
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

/*
for (var i = 0; i < 24; ++i) {
  hoursArray.push((hour + i) % 24 + ":00");
  var alcoholLevel = Math.floor((Math.random() * 400) + 1) / 100;
  lineDiagramData.future.push(alcoholLevel);
  if (i < 16) {
    lineDiagramData.real.push(alcoholLevel);
  }
  else {
    lineDiagramData.real.push(null);
  }
}
var myNewChart;
function init() {
  lineChart();
  drinkPie();
}
function drinkPie() {
  var ctx = $("#drinkPie").get(0).getContext("2d");
  var data = [
    {
      value: 300,
      color: "#F7464A",
      highlight: "#FF5A5E",
      label: "Red"
    },
    {
      value: 50,
      color: "#46BFBD",
      highlight: "#5AD3D1",
      label: "Green"
    },
    {
      value: 100,
      color: "#FDB45C",
      highlight: "#FFC870",
      label: "Yellow"
    }
  ]
  var myDoughnutChart = new Chart(ctx).Doughnut(data);
}
function lineChart() {
  var ctx = $("#alcoholLevel").get(0).getContext("2d");
  var data = {
    labels: hoursArray,
    datasets: [
      {
        fillColor: "transparent",
        strokeColor: "rgba(0,187,205,1)",
        pointColor: "rgba(0,187,205,1)",
        pointStrokeColor: "#fff",
        data: lineDiagramData.future
      },
      {
        fillColor: "transparent",
        strokeColor: "rgba(243,135,7,1)",
        pointColor: "rgba(243,135,7,1)",
        pointStrokeColor: "#fff",
        data: lineDiagramData.real
      }
    ]
  }
  myNewChart = new Chart(ctx).Line(data, {bezierCurve: false});
}

function newLDValue(name, levels) {
  document.getElementById('alcoholLevelName').innerHTML = name;
  lineChart();
}
function upSize(id) {
  document.getElementById(id).style.width = "600px";
  document.getElementById(id).style.height = "400px";
}
function flip(id) {

}
//setTimeout(function() {newLDValue('Olli', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);}, 5000);
//setTimeout(function() {upSize('promilleBox');}, 5000);
*/
