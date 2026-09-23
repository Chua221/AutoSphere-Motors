import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page container section state-block">
      <h1>404</h1>
      <h3>Page not found</h3>
      <p>The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/" className="btn btn--primary">Back to home</Link>
    </div>
  );
}
