// 'use strict';

module.exports = crystallize;

function crystallize(source, options) {
  options = options || {};
  options.delimiter = options.delimiter || '_';
  options.excludes = options.excludes || [];

  // Extract keys into a format for manipulation.
  var keys = Object.keys(source).sort(); // Lexicographic sorting arranges the keys, ensures that commonly prefixed keys will be next to each other.
  var keyArray = keys.map(function (key) {return split(key)}); // 2D array. 1st D: keys; 2nd D: key component words.
  var result = {}; // Final output object.

  var i;
  for (i = 0; i < keyArray.length; i++) {

    // Go wide. Find as many keys where the first word match.
    (function () { // scoped IIFE.

      // Excluded case.
      if (options.excludes.some(function (exclude) {return keyArray[i][0] === exclude;})) return result[join(keyArray[i])] = source[join(keyArray[i])];

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

        var prefix = join(set[0].slice(0, depth));
        var uncommonFragments = set.map(function (wordArray) {return join(wordArray.slice(depth));});

        if (!uncommonFragments.every(function (fragment) {return fragment.length > 0;})) { // If there is a case where a key has been fully consumed in the prefix, do not crystallize. Abort and provide a fragged version.
          set.forEach(function (wordArray) {
            result[join(wordArray)] = source[join(wordArray)];
          });
        } else { // No fully consumed keys, proceed to crystallize.
          var nestedResult = {};
          uncommonFragments.forEach(function (fragment) {
            nestedResult[fragment] = source[join([prefix, fragment])];
          });

          result[prefix] = crystallize(nestedResult, options); // Recursive time. Nest until impossible.
        }

        i = j; // End, advance i to the next part.
      })();
    })();
  }

  return result;

  /**
   * Customized helper split and join functions, based on delimiter.
   */

  function split(string) {
    return string.split(options.delimiter);
  }

  function join(array) {
    return array.join(options.delimiter);
  }
}
