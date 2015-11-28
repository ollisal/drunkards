var Model = require('objection').Model;

var _ = require('lodash');

/**
 * @private
 * @enum {String}
 */
var Sex = {
  Male: 'penis',
  Female: 'vagina'
};

/**
 * @extends Model
 * @constructor
 */
function Drunkard() {
  Model.apply(this, arguments);
}

Model.extend(Drunkard);
module.exports = Drunkard;

Drunkard.Sex = Sex;

// Table name is the only required property.
Drunkard.tableName = 'Drunkard';

// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
Drunkard.jsonSchema = {
  type: 'object',
  required: ['name', 'sex', 'bodyWeightKilograms'],

  properties: {
    id: {type: 'integer'},
    name: {type: 'string', minLength: 1, maxLength: 32},
    sex: {type: 'string', enum: _.values(Sex)},
    bodyWeightKilograms: {type: 'integer', min: 0, max: 1000},
    idealDrunkennessLow: {type: ['integer', 'null'], min: 0, max: 50, default: 10},
    idealDrunkennessHigh: {type: ['integer', 'null'], min: 0, max: 50, default: 15}
  }
};

// This object defines the relations to other models.
Drunkard.relationMappings = {
  dranks: {
    relation: Model.OneToManyRelation,
    modelClass: __dirname + '/Drank',
    join: {
      from: 'Drunkard.id',
      to: 'Drank.drunkardId'
    }
  }
};
