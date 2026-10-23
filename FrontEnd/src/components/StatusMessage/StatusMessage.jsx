import "./StatusMessage.css";

export default function StatusMessage({ message, error }) {
  if (!message) return null;
  return (
    <div
      className={`statusMessage ${error ? "statusError" : "statusSuccess"}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
