var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
function Drink() {
  Model.apply(this, arguments);
}

Model.extend(Drink);
module.exports = Drink;

// Table name is the only required property.
Drink.tableName = 'Drink';

// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
Drink.jsonSchema = {
  type: 'object',
  required: ['name', 'ethanolGrams'],

  properties: {
    id: {type: 'integer'},
    name: {type: 'string', minLength: 1, maxLength: 32},
    ethanolGrams: {type: 'integer', min: 0, max: 1000 /* kills 200kg male instantly so probably big enough */}
  }
};

// This object defines the relations to other models.
Drink.relationMappings = {
  dranks: {
    relation: Model.OneToManyRelation,
    // The related model. This can be either a Model subclass constructor or an
    // absolute file path to a module that exports one. We use the file path version
    // here to prevent require loops.
    modelClass: __dirname + '/Drank',
    join: {
      from: 'Drink.id',
      to: 'Drank.drinkId'
    }
  }
};
