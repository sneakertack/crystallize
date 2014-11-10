var crystallize = require('./index.js');

var tests = [];

tests.push({
  id: 1,
  name: 'bob',
  contentDescription: 'bob is a traveling salesman',
  contentTagline: 'the handsomest salesman in the world',
  contentAppeal: 'please vote me for president',
  multiWordPrefixSam: 123,
  multiWordPrefixBob: 456,
  nestyMestyLolitronMcnugget: true,
  nestyMestyMegatron: false,
  nestyCardboard: 'yes',
  fullyConsumed: 0,
  fullyConsumedSidekick: 1,
  fullyConsumedButler: 2,
  isLive: true,
  isPublic: true
});

tests.forEach(function (test) {
  var result = crystallize(test, {excludes: ['is'], delimiter: 'camelCase'}); // delimiter can be 'camelcase' or 'camelCase'. It's case-insensitive.
  console.log(result);
});
