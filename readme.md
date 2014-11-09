## Not Yet Implemented

- Type checking, in case not an object.
- Write this readme
- camelCase delimiters
- prefix excludes
- reverse operation (frag / smash / shatter)
- note that does not preserve object order

## Options

- **delimiter**  
String value that specifies the delimiter between words. `'_'` and `'.'` are common. Multi-character delimiters like `'__'` (double underscore) are allowed as well. Finally, the following string shortcut values also work: `'camelCase'`, `'snake_case'`. (default: `'_'`)

- **exclude**  
Array of prefix words excluded from factorization. One common example is 'is'. See example below. For excluded *phrases*, either supply the phrase in the appropriate delimitation standard (e.g. `'stateOf'` when delimiter is `'camelCase'`), or supply the phrase an array of words (e.g. `['state', 'of']`, has the advantage of being delimiter-agnostic).

### Example of Exclusion

```js
var data = {
  id: 1,
  name: 'bob',
  content_description: 'bob is a traveling salesman',
  content_tagline: 'the handsomest salesman in the world',
  is_live: true,
  is_public: true
}

// Exclusion example.
var result = factorize(data, {exclude: ['is']})

/*
Result:
{
  id: 1,
  name: 'bob',
  content: {
    description: 'bob is a traveling salesman',
    tagline: 'the handsomest salesman in the world'
  },
  is_live: true,
  is_public: true
}
*/

// Exclusion of phrases.
factorize(data, {exclude: ['is', 'has', 'state_of']}); // Assuming '_' delimiter.
factorize(data, {exclude: ['is', 'has', 'stateOf']}); // Assuming camelCase delimiter.
factorize(data, {exclude: ['is', 'has', ['state', 'of']]});
```

## Example Use Cases

- Turning flat data from relational database tables into a more object-ey form.
