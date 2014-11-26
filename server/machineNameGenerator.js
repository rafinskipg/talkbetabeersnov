'use strict';

var _ = require('lodash');


var surnames = [
  'De la machina',
  'Ristretto',
  'Bit bot bit',
  'CPU',
  'RAM',
  'Script',
  'Bote',
  'Exception',
  'Nullified',
  'Browserified'
];

var names = [
  'Bot',
  'Machina',
  'Androide',
  '9000',
  'Ciborg',
  'Java',
  'R2',
  'C3',
  'Siri',
  'Bender'
];

var titles = [
  'Dr.',
  'Dra.',
  'Miss',
  'Mr',
  'Señor',
  '',
  'Don',
  'Doña'
]

module.exports.generate = function (){
  var indexTitle = _.random(0, titles.length -1);
  var indexName = _.random(0, names.length -1);
  var indexSurName = _.random(0, surnames.length -1);

  return titles[indexTitle] + ' ' + names[indexName] + ' ' + surnames[indexSurName];
}