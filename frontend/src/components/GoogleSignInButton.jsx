import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Only the Client ID is needed in frontend code — it is public by design
// (Google shows it in every sign-in request). The Client Secret must never
// be used here; it belongs only to server-side OAuth flows.
// NOTE: this project is built with Create React App (react-scripts), so env
// vars must be prefixed with REACT_APP_ and read from process.env (NOT
// import.meta.env, which is Vite-only and unavailable under webpack/CRA).
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

let scriptLoadingPromise = null;

function loadGoogleScript() {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client?hl=en";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Identity Services script."));
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

// Fully custom-styled button: instead of Google's own <renderButton> widget
// (which lives inside an iframe and can't be restyled with our CSS), this
// button drives Google's OAuth 2.0 popup flow directly
// (google.accounts.oauth2.initTokenClient) so it can look identical to the
// GitHub/Facebook buttons (see .btn--oauth in App.css). Clicking it opens
// Google's real consent popup — same security guarantees, just our own look.
export default function GoogleSignInButton({ redirectTo = "/cars", onError }) {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const tokenClientRef = useRef(null);

  const ensureTokenClient = useCallback(async () => {
    if (tokenClientRef.current) return tokenClientRef.current;

    await loadGoogleScript();

    tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "openid email profile",
      callback: async (response) => {
        setLoading(false);

        if (response.error) {
          // e.g. "access_denied" when the user closes/cancels the popup.
          onError?.(
            response.error === "access_denied"
              ? "You cancelled the Google sign-in."
              : "Google sign-in could not be completed. Please try again."
          );
          return;
        }

        try {
          // Hand the raw access token to our own backend instead of fetching
          // the profile here — the Spring Boot API verifies it directly with
          // Google and builds the profile itself, so nothing the browser
          // could tamper with is ever trusted for who the user is.
          await loginWithGoogle(response.access_token);
          navigate(redirectTo, { replace: true });
        } catch (err) {
          console.error("Google sign-in failed:", err);
          onError?.(err.message || "Google sign-in failed.");
        }
      },
      // Fires for popup-level failures (e.g. blocked pop-up, closed before
      // completing) on Google Identity Services builds that support it.
      error_callback: (err) => {
        setLoading(false);
        console.warn("Google sign-in error:", err);
        onError?.("Google sign-in could not be completed. Please try again.");
      },
    });

    return tokenClientRef.current;
  }, [loginWithGoogle, navigate, redirectTo, onError]);

  const handleClick = useCallback(async () => {
    if (!GOOGLE_CLIENT_ID) {
      onError?.(
        "Google sign-in is not configured. Copy .env.example to .env, add your " +
          "REACT_APP_GOOGLE_CLIENT_ID, then restart the dev server."
      );
      return;
    }

    setLoading(true);
    try {
      const tokenClient = await ensureTokenClient();
      tokenClient.requestAccessToken(); // opens Google's popup
    } catch (err) {
      setLoading(false);
      console.error(err);
      onError?.("Could not load Google sign-in. Check your connection.");
    }
  }, [ensureTokenClient, onError]);

  return (
    <button type="button" className="btn btn--oauth" onClick={handleClick} disabled={loading}>
      <span><img src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000" alt="" style={{ height: "18px", width: "auto" }} /></span>
      {/* <span aria-hidden="true" className="btn--oauth__icon btn--oauth__icon--google">G</span> */}
      {loading ? "Opening Google…" : "Continue with Google"}
    </button>
  );
}
