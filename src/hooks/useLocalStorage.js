import { useEffect, useState } from "react";

/**
 * React hook that mirrors a piece of state into window.localStorage.
 *
 * It reads the initial value from localStorage (if present and valid JSON)
 * and writes any subsequent updates back under the provided key.
 * This is used across the app to persist logged media items by tab.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore write errors
    }
  }, [key, value]);

  return [value, setValue];
}
