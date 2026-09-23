export function LoadingBlock({ label = "Loading…" }) {
  return (
    <div className="state-block">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorBlock({ message, onRetry }) {
  return (
    <div className="state-block">
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn--secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyBlock({ title, description }) {
  return (
    <div className="state-block">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
