var Knex = require('knex');
var morgan = require('morgan');
var express = require('express');
var bodyParser = require('body-parser');
var knexConfig = require('./knexfile');
var registerApi = require('./api');
var Model = require('objection').Model;

// Initialize knex.
var knex = Knex(knexConfig.development);

// Bind all Models to a knex instance. If you only have one database in
// your server this is all you have to do. For multi database systems, see
// the Model.bindKnex method.
Model.knex(knex);

var app = express()
  .use(bodyParser.json())
  .use(morgan('dev'))
  .set('json spaces', 2);

app.use('/', express.static('dashboardClient'));
app.use('/node_modules', express.static('node_modules'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});

// Register our REST API.
registerApi(app);

// Error handling.
app.use(function (err, req, res, next) {
  if (err) {
    var statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).send(err.data || err.message || 'haista vittu');
    if (statusCode === 500) {
      console.log(err.stack);
    }
  } else {
    next();
  }
});

var server = require('http').createServer(app);
var io = require('socket.io')(server);
registerApi.socketStuff(io);

server.listen(80, function () {
  console.log('Listening for drunkards at port %s', server.address().port);
});
