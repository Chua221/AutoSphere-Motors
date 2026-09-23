/**
 * Minimal OAuth "authorization code" backend for GitHub and Facebook.
 *
 * WHY THIS EXISTS:
 * Google's Identity Services button lets the browser get a signed ID token
 * directly — no secret involved. GitHub and Facebook do NOT support that for
 * this kind of login: after the user approves access, the provider gives the
 * browser a one-time "code", and exchanging that code for real profile
 * access requires sending the app's Client Secret. That exchange must never
 * happen in frontend JavaScript (anyone could read the secret out of the
 * bundle), so this tiny server does that one step, keeps the secret in its
 * own .env file, and hands the React app back a simple session (a token +
 * the user record) via a redirect.
 *
 * Flow for GitHub (Facebook is the same shape):
 *   1. React button sends the browser to github.com/login/oauth/authorize
 *   2. User logs in / approves on GitHub's own page
 *   3. GitHub redirects the browser to THIS server's /auth/github/callback?code=...
 *   4. This server exchanges the code + client secret for an access token
 *   5. This server calls GitHub's API for the user's profile
 *   6. This server finds-or-creates that user in db.json (via json-server)
 *   7. This server redirects the browser back to the React app with a token
 */
require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const API_URL = process.env.JSON_SERVER_URL || "http://localhost:4000";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_REDIRECT_URI =
  process.env.GITHUB_REDIRECT_URI || `http://localhost:${PORT}/auth/github/callback`;

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const FACEBOOK_REDIRECT_URI =
  process.env.FACEBOOK_REDIRECT_URI || `http://localhost:${PORT}/auth/facebook/callback`;

// Same lightweight "opaque token" style used by the frontend's authService,
// just generated on the server this time (Buffer instead of btoa).
function createToken(userId) {
  return Buffer.from(`${userId}.${Date.now()}`).toString("base64");
}

// Look the user up by email in the mock database (json-server); create a
// new record on first login. Mirrors authService.loginWithGoogle's logic so
// all three providers behave identically from the app's point of view.
async function findOrCreateUser({ email, name, picture, provider, providerId }) {
  if (!email) {
    throw new Error(`Your ${provider} account did not share an email address.`);
  }

  const { data: matches } = await axios.get(`${API_URL}/users`, { params: { email } });
  let user = matches[0];

  if (!user) {
    const { data: newUser } = await axios.post(`${API_URL}/users`, {
      name: name || email.split("@")[0],
      email,
      password: null, // OAuth-only account
      phone: "",
      location: "",
      picture: picture || null,
      provider,
      providerId: providerId != null ? String(providerId) : null,
      joined: new Date().toISOString().slice(0, 10),
    });
    user = newUser;
  }

  return user;
}

function redirectWithSession(res, { user, token, state }) {
  const params = new URLSearchParams({
    token,
    user: Buffer.from(JSON.stringify(user)).toString("base64"),
  });
  if (state) params.set("state", state);
  res.redirect(`${CLIENT_URL}/oauth/callback?${params.toString()}`);
}

function redirectWithError(res, provider, message) {
  const params = new URLSearchParams({ error: message, provider });
  res.redirect(`${CLIENT_URL}/oauth/callback?${params.toString()}`);
}

// ---------------------------------------------------------------- GitHub ---
app.get("/auth/github/callback", async (req, res) => {
  const { code, state, error, error_description: errorDescription } = req.query;

  // User clicked "Cancel" / "Deny" on GitHub's consent screen.
  if (error) {
    return redirectWithError(
      res,
      "github",
      errorDescription || "You cancelled the GitHub sign-in."
    );
  }
  if (!code) {
    return redirectWithError(res, "github", "GitHub did not return an authorization code.");
  }

  try {
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      new URLSearchParams({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET, // never leaves this server
        code,
        redirect_uri: GITHUB_REDIRECT_URI,
      }).toString(),
      { headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) {
      throw new Error(tokenRes.data.error_description || "GitHub did not return an access token.");
    }

    const { data: profile } = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // GitHub only includes email in /user if the user made it public.
    let email = profile.email;
    if (!email) {
      const { data: emails } = await axios.get("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const primary = emails.find((e) => e.primary) || emails[0];
      email = primary?.email;
    }

    const user = await findOrCreateUser({
      email,
      name: profile.name || profile.login,
      picture: profile.avatar_url,
      provider: "github",
      providerId: profile.id,
    });

    redirectWithSession(res, { user, token: createToken(user.id), state });
  } catch (err) {
    console.error("GitHub OAuth error:", err.response?.data || err.message);
    redirectWithError(res, "github", "GitHub sign-in failed. Please try again.");
  }
});

// -------------------------------------------------------------- Facebook ---
app.get("/auth/facebook/callback", async (req, res) => {
  const { code, state, error, error_reason: errorReason } = req.query;

  // User clicked "Cancel" on Facebook's dialog.
  if (error || errorReason) {
    return redirectWithError(res, "facebook", "You cancelled the Facebook sign-in.");
  }
  if (!code) {
    return redirectWithError(res, "facebook", "Facebook did not return an authorization code.");
  }

  try {
    const tokenRes = await axios.get("https://graph.facebook.com/v19.0/oauth/access_token", {
      params: {
        client_id: FACEBOOK_APP_ID,
        client_secret: FACEBOOK_APP_SECRET, // never leaves this server
        redirect_uri: FACEBOOK_REDIRECT_URI,
        code,
      },
    });

    const accessToken = tokenRes.data.access_token;

    const { data: profile } = await axios.get("https://graph.facebook.com/me", {
      params: { fields: "id,name,email,picture", access_token: accessToken },
    });

    const user = await findOrCreateUser({
      email: profile.email,
      name: profile.name,
      picture: profile.picture?.data?.url,
      provider: "facebook",
      providerId: profile.id,
    });

    redirectWithSession(res, { user, token: createToken(user.id), state });
  } catch (err) {
    console.error("Facebook OAuth error:", err.response?.data || err.message);
    redirectWithError(res, "facebook", "Facebook sign-in failed. Please try again.");
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

// Fail loudly and immediately if any secret is missing, instead of letting
// every login attempt fail with a vague "sign-in failed" message.
const missing = [];
if (!GITHUB_CLIENT_ID) missing.push("GITHUB_CLIENT_ID");
if (!GITHUB_CLIENT_SECRET) missing.push("GITHUB_CLIENT_SECRET");
if (!FACEBOOK_APP_ID) missing.push("FACEBOOK_APP_ID");
if (!FACEBOOK_APP_SECRET) missing.push("FACEBOOK_APP_SECRET");
if (missing.length) {
  console.warn(
    `⚠️  server/.env is missing: ${missing.join(", ")}\n` +
      "   Copy server/.env.example to server/.env and fill these in, then restart."
  );
}

app.listen(PORT, () => {
  console.log(`OAuth server listening on http://localhost:${PORT}`);
});
