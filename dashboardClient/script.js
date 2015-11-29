var hour = moment().hour() + 8;
var hoursArray = [];
var lineDiagramData = {real: [], future: []};

var socket = io('http://10.0.1.47:8641');

socket.on('newDrink', function (drink) {
  newReport("A new revolutionary drink, " + drink.name + ", has been devised. It contains " + drink.ethanolGrams + ' grams of good old ethanol per portion.');
});

socket.on('newDrunkard', function (drunkard) {
  var roll = Math.random();
  if (roll < 0.3) {
    newReport('New challenger ' + drunkard.name + ' has appeared!');
  } else if (roll < 0.5) {
    newReport(drunkard.name + ' is going to get drunk tonight!');
  } else if (roll < 0.8) {
    newReport(drunkard.name + ', a born drunkard, has joined the fun.');
  } else {
    newReport(drunkard.name + ' has joined the booze race. KMikkos minions grow stronger!');
  }
});

socket.on('newDrank', function (drank) {
  var timeToNext = 10 + Math.random() * 30;
  var whenNextDrank = moment(drank.dateTime).add(timeToNext, 'minutes').format("HH:mm");
  var roll = Math.random();
  if (roll < 0.3) {
    newReport(drank.drunkard.name + ' finished another ' + drank.drink.name +
      ' and added ' + drank.drink.ethanolGrams + 'g of alcohol to his bodily fluids. At this rate of consumption he will pass out approximately ' +
      whenNextDrank + ' today.');
  } else if (roll < 0.5) {
    newReport(drank.drunkard.name + ' drank a ' + drank.drink.name +
      '. It is likely that he will finish his next drink at ' + whenNextDrank);
  } else {
    newReport(drank.drunkard.name + ' got even drunker by emptying a ' + drank.drink.name);
  }
});

socket.emit('floodMe');

function newReport(text) {
  $('#liveReportItems').prepend("<li>" + text + "</li>");
}


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
