'use strict';

module.exports = crystallize;

function crystallize(source, options) {
  // Basic type checking.
  if (source === null || !['object', 'function'].some(function (type) {return typeof source === type;})) throw new TypeError('Expected an object but got type '+(source === null ? 'null' : typeof source)+' instead.');

  // Config defaulting.
  options = options || {};
  options.delimiter = options.delimiter || '_';
  var camelPascalMode = ['camelcase', 'pascalcase'].some(function (x) {return options.delimiter.toLowerCase() === x;});
  options.excludes = (options.excludes || []).map(function (exclude) {
    if (Object.prototype.toString.call(exclude) === '[object Array]') return exclude; // Excludes must be in array form, in order to support phrase excludes.
    return split(exclude);
  });

  // Extract keys into a format for manipulation.
  var keys = Object.keys(source).sort(); // Lexicographic sorting arranges the keys, ensures that commonly prefixed keys will be next to each other.
  var keyArray = keys.map(function (key) {return split(key)}); // 2D array. 1st D: keys; 2nd D: key component words.
  var result = {}; // Final output object.

  var i;
  for (i = 0; i < keyArray.length; i++) {

    // Go wide. Find as many keys where the first word match.
    (function () { // scoped IIFE.

      var j = i; // Treat j as the last index of a common match.
      while (keyArray[i][0] === (keyArray[j + 1] || [])[0]) j++;

      // Non-factorizable case.
      if (i === j) return result[join(keyArray[i])] = source[join(keyArray[i])];

      // Factorizable case.
      // Go deep. Check whether the matched first words also match on the second word, and so on.
      (function () { // scoped IIFE.
        var set = keyArray.slice(i, j+1);
        var depth = 1; // We have 1 level of words that match.
        while (set.every(function (wordArray) {
          return wordArray[depth] === set[0][depth];
        })) depth++;

        var prefixArray = set[0].slice(0, depth);
        var prefix = join(prefixArray);
        var uncommonFragments = set.map(function (wordArray) {return join(wordArray.slice(depth));});

        // Exclude keys specifically asked to be excluded.
        var isExcluded = options.excludes.some(function (excludePhrase) {
          return excludePhrase.length === prefixArray.length && excludePhrase.every(function (excludeWord, index) {
            return keyArray[i][index].toLowerCase() === excludeWord.toLowerCase();
          });
        });

        // Edge case in which a key has been fully consumed in the prefix. 
        var containsFullyConsumed = !uncommonFragments.every(function (fragment) {return fragment.length > 0;});

        if (isExcluded || containsFullyConsumed) { 
          // Do not crystallize. Abort and provide a fragged version.
          set.forEach(function (wordArray) {
            result[join(wordArray)] = source[join(wordArray)];
          });
        } else { // All okay, proceed to crystallize.
          var nestedResult = {};
          uncommonFragments.forEach(function (fragment) {
            nestedResult[saneCase(fragment)] = source[join([prefix, fragment])];
          });

          result[prefix] = crystallize(nestedResult, options); // Recursive time. Nest until impossible.
        }

        i = j; // End, advance i to the next part.
      })();
    })();
  }

  return result;

  /**
   * HELPER FUNCTIONS
   */

   // Customized split and join functions, based on delimiter.
  function split(string) {
    return string.split(camelPascalMode ? (/(?=[A-Z])/) : options.delimiter);
  }
  function join(array) {
    return array.join(camelPascalMode ? '' : options.delimiter);
  }

  // Capitalise or decapitalise new keys in camel/pascal mode.
  function saneCase(str) {
    if (!camelPascalMode) return str;
    if (options.delimiter.toLowerCase() === 'camelcase') return str.substring(0, 1).toLowerCase() + str.substring(1);
    if (options.delimiter.toLowerCase() === 'pascalcase') return str.substring(0, 1).toUpperCase() + str.substring(1);
    throw new Error('Strange edge case with saneCase().');
  }
}
