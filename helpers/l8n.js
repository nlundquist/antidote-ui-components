// - consider reimplementing this as proxy on the copy object rather than as an object wrapper?
// - see if there is a way to memoize lookups / evaluations with haunted hooks?
// - consider a build step that hashes localization keys to save additional space in the bundle
// - consider using deep objects rather than '.'-separated keys...?

function reader(key, context) {
  if (!(key in this)) {
    console.warn('No value found in copy for key: ', key);
    return undefined;
  } if (typeof this[key] === 'function') {
    return this[key](context || {});
  } else {
    return this[key];
  }
}

// return a function that returns the value of a localization key from the localization string set in
// either from the element's `l8n` property or the global `antidoteLocalization` property
export default function getL8nReader(element) {
  // copy is either a property on the component or available globally
  const l8n = element.l8n || window.antidoteLocalization;

  if (!l8n) {
    throw Error('No localization found for Antidote component! Components are expected to pass a ' +
      'map of localization strings as their `l8n` property, or it can be set globally on ' +
      '`widow.antidoteLocalization`.');
  }

  return reader.bind(l8n)
}
