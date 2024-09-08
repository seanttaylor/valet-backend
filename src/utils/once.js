/**
 * Returns a function that can only be called once
 * @param {Function} fn
 * @returns {Function}
 */
export const once = (fn) => {
    let called = false; // Tracks whether the function has been called
  
    return function (...args) {
      if (!called) {
        called = true;
        return fn.apply(this, args); 
      }
    };
  };