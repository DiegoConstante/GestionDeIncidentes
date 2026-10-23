import { useCallback, useEffect, useState } from "react";

const EMPTY = { message: "", error: false };

/**
 * Maneja un mensaje de estado (éxito o error).
 * @param {number} autoDismissMs - Si es > 0, los mensajes de éxito se ocultan solos.
 */
export function useFeedback(autoDismissMs = 0) {
  const [feedback, setFeedback] = useState(EMPTY);

  useEffect(() => {
    if (!autoDismissMs || !feedback.message || feedback.error) return;
    const timer = setTimeout(() => setFeedback(EMPTY), autoDismissMs);
    return () => clearTimeout(timer);
  }, [feedback, autoDismissMs]);

  const showSuccess = useCallback(
    (message) => setFeedback({ message, error: false }),
    [],
  );
  const showError = useCallback(
    (message) => setFeedback({ message, error: true }),
    [],
  );
  const clear = useCallback(() => setFeedback(EMPTY), []);

  return { feedback, showSuccess, showError, clear };
}
