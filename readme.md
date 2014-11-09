`crystallize()` turns a flat data object into a nested, tree-like object. Keys get automatically grouped together if they share common prefixes.

This library is a work in progress, and as such is missing some features.

## Not Yet Implemented

- Type checking, in case not given an object.
- The reverse operation to `crystallize()` (probably `crystallize.smash()`)
- camelCase delimiters.
- Phrase-based excludes
- Upload it to the npms

Strikethroughed lines below describe features that are planned but not yet written.

## Usage

```js
var crystallize = require('crystallize');

// The data to crystallize.
var flatBob = {
  id: 1,
  name: 'bob',
  content_description: 'bob is a traveling salesman',
  content_tagline: 'the handsomest salesman in the world',
  vehicles_air: 'diy quadrocopter',
  vehicles_land_bike: 'fixie',
  vehicles_land_car: 'jalopy'
};

var nestedBob = crystallize(flatBob);

/*
nestedBob:
{
  id: 1,
  name: 'bob',
  content: {
    description: 'bob is a traveling salesman',
    tagline: 'the handsomest salesman in the world'
  },
  vehicles: {
    air: 'diy quadrocopter',
    land: {
      bike: 'fixie',
      car: 'jalopy' 
    }
  }
}
 */
```

## API

### crystallize(flatObject, [opts])

Returns the nested version of `flatObject`. Pass in an optional options object.

*Note:* Object key order will not be preserved. If anything keys will now be ordered lexicographically. File an issue describing your use case if you need object key order preserved.

**Options**

- **delimiter**  
String value that specifies the delimiter between words. `'_'` and `'.'` are common. ~~Multi-character delimiters like `'__'` (double underscore) are allowed as well. Finally, the following string shortcut values also work: `'camelCase'`, `'snake_case'`. (default: `'_'`)~~

- **excludes**  
Array of prefix words excluded from factorization. One common example is 'is'. See example below. ~~For excluded *phrases*, either supply the phrase in the appropriate delimitation standard (e.g. `'stateOf'` when delimiter is `'camelCase'`), or supply the phrase an array of words (e.g. `['state', 'of']`, has the advantage of being delimiter-agnostic).~~ Excludes only apply if they are the first word of keys of the tree / one of its subtrees.

### Example of Exclusion

```js
var data = {
  id: 1,
  name: 'bob',
  content_description: 'bob is a traveling salesman',
  content_tagline: 'the handsomest salesman in the world',
  is_live: true,
  is_public: true,
  hair_is_black: true,
  hair_is_silky: true
}

// Exclusion example.
var result = factorize(data, {excludes: ['is']})

/*
Result:
{
  id: 1,
  name: 'bob',
  content: {
    description: 'bob is a traveling salesman',
    tagline: 'the handsomest salesman in the world'
  },
  is_live: true, // Excluded, starts with 'is'.
  is_public: true,
  hair_is: { // Not excluded, 'is' isn't first word.
    black: true,
    silky: true
  }
}
*/

/* This section not implemented yet.
// Exclusion of phrases.
factorize(data, {exclude: ['is', 'has', 'state_of']}); // Assuming '_' delimiter.
factorize(data, {exclude: ['is', 'has', 'stateOf']}); // Assuming camelCase delimiter.
factorize(data, {exclude: ['is', 'has', ['state', 'of']]});
*/
```

## Example Use Cases

- Build your own Object Relational Mapper: Turn flat data from relational database tables into a nested form more appropriate for JS use. (caveat: likely to conflict if some of your relational table fields are JSON)
