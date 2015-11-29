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

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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

server.listen(8641, function () {
  console.log('Listening for drunkards at port %s', server.address().port);
});
