import { useEffect } from 'react';

/**
 * Custom hook that detects clicks outside of specified element(s)
 * @param {React.RefObject|React.RefObject[]} ref - Single ref or array of refs to check against
 * @param {Function} callback - Function to call when click is detected outside
 * @param {boolean} [enabled=true] - Whether the hook is active (useful for conditional listening)
 */
export function useClickOutside(ref, callback, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event) => {
      // Handle both single ref and array of refs
      const refs = Array.isArray(ref) ? ref : [ref];

      // Check if click is inside any of the refs
      const isClickInside = refs.some(r => {
        return r.current && r.current.contains(event.target);
      });

      // If click is outside all refs, call the callback
      if (!isClickInside) {
        callback(event);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback, enabled]);
}
