import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const STATE_KEY = "oauth_state";

// Landing page for the GitHub / Facebook redirect flow. The OAuth server
// (server/oauth-server.js) sends the browser here with either
// ?token=...&user=<base64 JSON>&state=...   (success)
// ?error=...&provider=...                    (cancelled / failed)
export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { completeOAuthSession } = useAuth();
  const [error, setError] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return; // guard against React 18 StrictMode double-invoke
    ran.current = true;

    const provider = searchParams.get("provider");
    const providerLabel = provider ? provider[0].toUpperCase() + provider.slice(1) : "Sign-in";

    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(`${providerLabel}: ${errorParam}`);
      return;
    }

    const token = searchParams.get("token");
    const encodedUser = searchParams.get("user");
    const returnedState = searchParams.get("state");
    const expectedState = sessionStorage.getItem(STATE_KEY);
    sessionStorage.removeItem(STATE_KEY);

    if (!token || !encodedUser) {
      setError("The provider did not return the expected sign-in details.");
      return;
    }
    if (expectedState && returnedState && expectedState !== returnedState) {
      setError("Sign-in could not be verified (state mismatch). Please try again.");
      return;
    }

    try {
      const user = JSON.parse(atob(encodedUser));
      completeOAuthSession(user, token);
      navigate("/cars", { replace: true });
    } catch (err) {
      console.error("OAuth callback error:", err);
      setError("Something went wrong finishing sign-in.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="auth-shell">
      <div className="auth-shell__form-side">
        <div className="auth-card">
          {error ? (
            <>
              <h1>Sign-in didn't complete</h1>
              <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>
              <button className="btn btn--primary btn--block" onClick={() => navigate("/login")}>
                Back to login
              </button>
            </>
          ) : (
            <>
              <h1>Signing you in…</h1>
              <p>Please wait a moment.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
