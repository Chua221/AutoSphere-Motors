import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleSignInButton from "../components/GoogleSignInButton";
import OAuthRedirectButton from "../components/OAuthRedirectButton";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/cars";

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-shell__panel">
        <h2>Welcome back.</h2>
        <p style={{ color: "#c7cfc9" }}>
          Log in to manage your listings, update your profile, and pick up your search
          where you left off.
        </p>
        <p style={{ color: "#9aa19a", fontSize: "0.85rem", marginTop: 24 }}>
          Demo account: farah@autosphere.my / password123
        </p>
      </div>
      <div className="auth-shell__form-side">
        <div className="auth-card">
          <h1>Log in</h1>
          <p>Enter your credentials to continue.</p>

          {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}

          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" required value={form.password} onChange={handleChange} placeholder="••••••••" />
            </div>

            <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
              {submitting ? "Logging in…" : "Log in"}
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>

          <div className="oauth-stack">
            <GoogleSignInButton redirectTo={redirectTo} onError={setError} />
            <OAuthRedirectButton provider="github" onError={setError} />
            <OAuthRedirectButton provider="facebook" onError={setError} />
          </div>

          <p className="auth-switch">
            New to AutoSphere? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
