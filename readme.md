`crystallize()` turns a flat data object into a nested, tree-like object. Keys get automatically grouped together if they share matching prefixes.

`crystallize()` provides 1 way to store JSON-like data in a flat memory structure (e.g. relational tables, CSV). Upon reading from memory, `crystallize()` deserializes your flat record into a structured object. 

## Status

This library is approximately 90% complete. The following features remain on the roadmap:

- The reverse (serializing) operation to `crystallize()` (probably `crystallize.smash()`)
- How to not over-reverse when reversing, for values that are objects.

However, a good serializing substitute for now is [flat](https://github.com/hughsk/flat).

Strikethroughed lines below describe features that are planned but not yet implemented. Everything else works.

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

*Note:* Object key order will not be preserved. Rather, keys will end up being lexicographically ordered. File an issue describing your use case if you need object key order preserved.

**Options**

- **delimiter**  
String value that specifies the delimiter between words. `'_'` and `'.'` are common. ~~Multi-character delimiters like `'__'` (double underscore) are allowed as well.~~ To delimit by PascalCase/camelCase, supply either `'pascalcase'` or `'camelcase'`. (default: `'_'`)

- **excludes**  
Array of prefix words excluded from crystallizing. One common example is 'is'. See example below. For excluded *phrases*, either supply the phrase in the appropriate delimitation standard (e.g. `'stateOf'` when delimiter is `'camelCase'`), or supply the phrase an array of words (e.g. `['state', 'of']`, has the advantage of being delimiter-agnostic). (default: `[]`)

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
var result = crystallize(data, {excludes: ['is']})

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

// Exclusion of phrases.
crystallize(data, {exclude: ['is', 'has', 'state_of']}); // Assuming '_' delimiter.
crystallize(data, {exclude: ['is', 'has', 'stateOf']}); // Assuming camelCase delimiter.
crystallize(data, {exclude: ['is', 'has', ['state', 'of']]});
```

## Library Edge Cases

These situations usually shouldn't be happening. But for the sake of completeness...

- **When I use the camelCase or PascalCase delimiter, what happens if my source object has a mix of both PascalCase (capitalized first character) and camelCase (uncapitalized first character) keys?**  
First characters remain unmodified, so the first level of the resulting object will still contain a mix of PascalCase and camelCase keys. However, the keys of any nested branches will be capitalized (or uncapitalized) to follow the style you dictated for your delimiter (this is already happening in a normal situation).
