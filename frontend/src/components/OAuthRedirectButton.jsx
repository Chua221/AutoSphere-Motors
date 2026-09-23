import { useCallback } from "react";

// Only Client IDs (public by design) live here. Client Secrets stay in
// server/.env and are used exclusively by server/oauth-server.js.
const OAUTH_SERVER_URL = process.env.REACT_APP_OAUTH_SERVER_URL || "http://localhost:5000";

const STATE_KEY = "oauth_state";

// Small inline SVG marks — no image files to ship, no external requests,
// and they scale/recolor cleanly. Used only as the standard "sign in with
// this provider" identifier on the button, as GitHub/Facebook's own OAuth
// integration guidelines expect.
function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        fill="#181717"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
           0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
           -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
           .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
           -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0
           1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82
           1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01
           1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        fill="#1877F2"
        d="M16 8.05C16 3.6 12.42 0 8 0S0 3.6 0 8.05c0 4.02 2.93 7.35 6.75 7.95v-5.63H4.72V8.05h2.03V6.28
           c0-2.02 1.2-3.14 3.02-3.14.87 0 1.79.16 1.79.16v1.97h-1.01c-1 0-1.31.62-1.31 1.26v1.52h2.23l-.36 2.32H9.24V16
           C13.07 15.4 16 12.07 16 8.05Z"
      />
    </svg>
  );
}

const PROVIDERS = {
  github: {
    label: "Continue with GitHub",
    Icon: GitHubIcon,
    envVarName: "REACT_APP_GITHUB_CLIENT_ID",
    clientId: process.env.REACT_APP_GITHUB_CLIENT_ID,
    redirectUri: `${OAUTH_SERVER_URL}/auth/github/callback`,
    scope: "read:user user:email",
    buildAuthorizeUrl({ clientId, redirectUri, scope, state }) {
      const params = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, scope, state });
      return `https://github.com/login/oauth/authorize?${params.toString()}`;
    },
  },
  facebook: {
    label: "Continue with Facebook",
    Icon: FacebookIcon,
    envVarName: "REACT_APP_FACEBOOK_APP_ID",
    clientId: process.env.REACT_APP_FACEBOOK_APP_ID,
    redirectUri: `${OAUTH_SERVER_URL}/auth/facebook/callback`,
    scope: "email,public_profile",
    buildAuthorizeUrl({ clientId, redirectUri, scope, state }) {
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope,
        state,
        response_type: "code",
      });
      return `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;
    },
  },
};

export default function OAuthRedirectButton({ provider, onError }) {
  const config = PROVIDERS[provider];

  const handleClick = useCallback(() => {
    if (!config) return;

    if (!config.clientId) {
      onError?.(
        `${config.label.replace("Continue with ", "")} sign-in is not configured. ` +
          `Set ${config.envVarName} in .env and make sure the OAuth server (npm run oauth-server) is running.`
      );
      return;
    }

    // Round-trip a random "state" through the provider and back to
    // /oauth/callback so we can detect a tampered/replayed redirect
    // (basic CSRF protection for the redirect flow).
    const state = window.crypto?.randomUUID?.() || String(Date.now());
    sessionStorage.setItem(STATE_KEY, state);

    window.location.href = config.buildAuthorizeUrl({ ...config, state });
  }, [config, onError]);

  if (!config) return null;

  const { Icon } = config;

  return (
    <button type="button" className="btn btn--oauth" onClick={handleClick}>
      <span aria-hidden="true" className="btn--oauth__icon">
        <Icon />
      </span>
      {config.label}
    </button>
  );
}
