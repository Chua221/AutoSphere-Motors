import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleSignInButton from "../components/GoogleSignInButton";
import OAuthRedirectButton from "../components/OAuthRedirectButton";

const initialForm = { name: "", email: "", password: "", confirmPassword: "", phone: "", address: "" };

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        address: form.address,
      });
      navigate("/cars");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-shell__panel">
        <h2>Join AutoSphere Motors</h2>
        <p style={{ color: "#c7cfc9" }}>
          Create a free account to save searches, contact sellers and list your own car
          for sale in minutes.
        </p>
      </div>
      <div className="auth-shell__form-side">
        <div className="auth-card">
          <h1>Create your account</h1>
          <p>It only takes a minute.</p>

          {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}

          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input id="name" name="name" required value={form.name} onChange={handleChange} placeholder="Ahmad Zulkifli" />
            </div>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="phone">Phone number</label>
                <input id="phone" name="phone" required value={form.phone} onChange={handleChange} placeholder="012-3456789" />
              </div>
              <div className="field">
                <label htmlFor="address">Address</label>
                <input id="address" name="address" required value={form.address} onChange={handleChange} placeholder="Penang" />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" required value={form.password} onChange={handleChange} placeholder="At least 6 characters" />
              </div>
              <div className="field">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input id="confirmPassword" name="confirmPassword" type="password" required value={form.confirmPassword} onChange={handleChange} />
              </div>
            </div>

            <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>

          <div className="oauth-stack">
            <GoogleSignInButton redirectTo="/cars" onError={setError} />
            <OAuthRedirectButton provider="github" onError={setError} />
            <OAuthRedirectButton provider="facebook" onError={setError} />
          </div>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
