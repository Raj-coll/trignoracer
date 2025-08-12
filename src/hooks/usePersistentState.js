// src/hooks/usePersistentState.js

import { useState, useEffect } from 'react';

/**
 * A custom hook that behaves like `useState` but persists the state
 * to the browser's localStorage.
 *
 * @param {string} key The key to use for localStorage.
 * @param {*} defaultValue The default value to use if nothing is in localStorage.
 * @returns A stateful value, and a function to update it.
 */
function usePersistentState(key, defaultValue) {
  // Use the lazy initializer version of useState to read from localStorage only once.
  const [state, setState] = useState(() => {
    const storedValue = localStorage.getItem(key);
    // If a value is found in localStorage, parse it. Otherwise, use the default.
    return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
  });

  // Use useEffect to save the state to localStorage whenever it changes.
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export default usePersistentState;