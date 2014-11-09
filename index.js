// 'use strict';

module.exports = crystallize;

function crystallize(source, options) {
  options = options || {};
  options.delimiter = options.delimiter || '_';
  options.exclude = options.exclude || [];

  // Massage keys into loopable format.
  var keys = Object.keys(source).sort();
  var keyArray = keys.map(function (key) {return split(key)}); // 2D array. 1st D: keys; 2nd D: key component words.
  var result = {}; // Final output object.

  var i;
  for (i = 0; i < keyArray.length; i++) {
    // Single word, forget it, no crystallization possible.
    if (keyArray[i].length === 1) {
      result[keyArray[i][0]] = source[keyArray[i][0]];
    } else {
      // Go wide.
      (function () { // scoped IIFE.
        var j = i; // Treat j as the last index of a common match.
        while (keyArray[i][0] === (keyArray[j + 1] || [])[0]) j++;
        debugger;


        if (i === j) { // Non-factorizable case.
          result[join(keyArray[i])] = source[join(keyArray[i])];
        } else { // Factorizable case.
          // Go deep.
          (function () { // scoped IIFE.
            var set = keyArray.slice(i, j+1); // At this point we have a group of keys that match on at least the first key word. Now we need to check whether they match on the second key word (and so on).
            var depth = 1;
            while (set.every(function (wordArray) {
              return wordArray[depth] === set[0][depth];
            })) depth++;

            // TODO: Handle multiword-nosuffix case.
             
            var prefix = join(set[0].slice(0, depth));
            var uncommonFragments = set.map(function (wordArray) {return join(wordArray.slice(depth));});

            var nestedResult = {};
            uncommonFragments.forEach(function (fragment) {
              nestedResult[fragment] = source[join([prefix, fragment])];
            });


            result[prefix] = crystallize(nestedResult); // Recursive time. Nest until impossible.

            i = j; // End, advance i to the next part.
          })();
        }
      })();
    }

    
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
