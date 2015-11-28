var Drank = require('./models/Drank');
var Drink = require('./models/Drink');
var Drunkard = require('./models/Drunkard');

module.exports = function (app) {

  // Get all Drunkards. Relations can be fetched eagerly
  // by giving a relation expression as the `eager` query parameter.
  app.get('/drunkards', function (req, res, next) {
    // We don't need to check for the existence of the query parameters.
    // The query builder methods do nothing if one of the values is undefined.
    Drunkard
      .query()
      .eager(req.query.eager)
      .then(function (drunkards) { res.send(drunkards); })
      .catch(next);
  });

  // Get one Drunkard. Relations can be fetched eagerly
  // by giving a relation expression as the `eager` query parameter.
  app.get('/drunkards/:id', function (req, res, next) {
    // We don't need to check for the existence of the query parameters.
    // The query builder methods do nothing if one of the values is undefined.
    Drunkard
      .query()
      .where('id', req.params.id)
      .eager(req.query.eager)
      .then(function (drunkard) {
        if (!drunkard[0]) {
          return throwNotFound();
        }
        res.send(drunkard[0]);
      })
      .catch(next);
  });

  // Create a new Drunkard.
  app.post('/drunkards', function (req, res, next) {
    Drunkard
      .query()
      .insert(req.body)
      .then(function (drunkard) { res.send(201, drunkard); })
      .catch(next);
  });

  // Patch a Drunkard.
  app.put('/drunkards/:id', function (req, res, next) {
    Drunkard
      .query()
      .updateAndFetchById(req.params.id, req.body)
      .then(function (drunkard) {
        if (!drunkard) {
          return throwNotFound();
        }
        res.send(drunkard);
      })
      .catch(next);
  });

  // Delete a Drink.
  app.delete('/drunkards/:id', function (req, res, next) {
    Drunkard
      .query()
      .delete()
      .where('id', req.params.id)
      .then(function (numDeleted) {
        if (numDeleted === 0) {
          return throwNotFound();
        }
        res.send({id: req.params.id});
      })
      .catch(next);
  });

  // Get all Drinks. Relations can be fetched eagerly
  // by giving a relation expression as the `eager` query parameter.
  app.get('/drinks', function (req, res, next) {
    // We don't need to check for the existence of the query parameters.
    // The query builder methods do nothing if one of the values is undefined.
    Drink
      .query()
      .eager(req.query.eager)
      .then(function (drinks) { res.send(drinks); })
      .catch(next);
  });

  // Get one Drink. Relations can be fetched eagerly
  // by giving a relation expression as the `eager` query parameter.
  app.get('/drinks/:id', function (req, res, next) {
    // We don't need to check for the existence of the query parameters.
    // The query builder methods do nothing if one of the values is undefined.
    Drink
      .query()
      .where('id', req.params.id)
      .eager(req.query.eager)
      .then(function (drink) {
        if (!drink[0]) {
          return throwNotFound();
        }
        res.send(drink[0]);
      })
      .catch(next);
  });

  // Create a new Drink.
  app.post('/drinks', function (req, res, next) {
    Drink
      .query()
      .insert(req.body)
      .then(function (drink) { res.send(201, drink); })
      .catch(next);
  });

  // Patch a Drink.
  app.put('/drinks/:id', function (req, res, next) {
    Drink
      .query()
      .updateAndFetchById(req.params.id, req.body)
      .then(function (drink) {
        if (!drink) {
          return throwNotFound();
        }
        res.send(drink);
      })
      .catch(next);
  });

  // Delete a Drink.
  app.delete('/drinks/:id', function (req, res, next) {
    Drink
      .query()
      .delete()
      .where('id', req.params.id)
      .then(function (numDeleted) {
        if (numDeleted === 0) {
          return throwNotFound();
        }
        res.send({id: req.params.id});
      })
      .catch(next);
  });

  // Get all Dranks. Relations can be fetched eagerly
  // by giving a relation expression as the `eager` query parameter.
  app.get('/dranks', function (req, res, next) {
    // We don't need to check for the existence of the query parameters.
    // The query builder methods do nothing if one of the values is undefined.
    Drank
      .query()
      .eager(req.query.eager)
      .then(function (dranks) { res.send(dranks); })
      .catch(next);
  });

  // Get one Drank. Relations can be fetched eagerly
  // by giving a relation expression as the `eager` query parameter.
  app.get('/dranks/:id', function (req, res, next) {
    // We don't need to check for the existence of the query parameters.
    // The query builder methods do nothing if one of the values is undefined.
    Drank
      .query()
      .where('id', req.params.id)
      .eager(req.query.eager)
      .then(function (drank) {
        if (!drank[0]) {
          return throwNotFound();
        }
        res.send(drank[0]);
      })
      .catch(next);
  });

  // Create a new Drank.
  app.post('/dranks', function (req, res, next) {
    req.body.dateTime = (new Date()).toISOString();
    Drank
      .query()
      .insert(req.body)
      .then(function (drank) { res.send(201, drank); })
      .catch(next);
  });

};

function throwNotFound() {
  var error = new Error();
  error.statusCode = 404;
  error.message = 'not found';
  throw error;
}
