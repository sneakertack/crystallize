var crystallize = require('./index.js');

var tests = [];

tests.push({
  id: 1,
  name: 'bob',
  content_description: 'bob is a traveling salesman',
  content_tagline: 'the handsomest salesman in the world',
  content_appeal: 'please vote me for president',
  multi_word_prefix_sam: 123,
  multi_word_prefix_bob: 456,
  nesty_mesty_lolitron_mcnugget: true,
  nesty_mesty_megatron: false,
  nesty_mcnest: 0,
  is_live: true,
  is_public: true
});

tests.forEach(function (test) {
  var result = crystallize(test);
  console.log(result);
})