var Model = require('objection').Model;


/**
 * @extends Model
 * @constructor
 */
function Drank() {
  Model.apply(this, arguments);
}

Model.extend(Drank);
module.exports = Drank;

// Table name is the only required property.
Drank.tableName = 'Drank';

// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
Drank.jsonSchema = {
  type: 'object',
  required: ['drinkId', 'drunkardId'],

  properties: {
    id: {type: 'integer'},
    drinkId: {type: 'integer'},
    drunkardId: {type: 'integer'},
    dateTime: {type: ['string', 'null'], format: 'date-time'}
  }
};

// This object defines the relations to other models.
Drank.relationMappings = {
  drunkard: {
    relation: Model.OneToOneRelation,
    // The related model. This can be either a Model subclass constructor or an
    // absolute file path to a module that exports one. We use the file path version
    // here to prevent require loops.
    modelClass: __dirname + '/Drunkard',
    join: {
      from: 'Drank.drunkardId',
      to: 'Drunkard.id'
    }
  },
  drink: {
    relation: Model.OneToOneRelation,
    // The related model. This can be either a Model subclass constructor or an
    // absolute file path to a module that exports one. We use the file path version
    // here to prevent require loops.
    modelClass: __dirname + '/Drink',
    join: {
      from: 'Drank.drinkId',
      to: 'Drink.id'
    }
  }
};
