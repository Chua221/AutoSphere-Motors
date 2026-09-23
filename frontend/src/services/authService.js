import axiosClient from "../api/axiosClient";

// POST /api/auth/register — the Spring Boot backend checks the email is
// unique, hashes the password with BCrypt, and returns a signed JWT.
export async function register({ name, email, password, phone, address }) {
  const { data } = await axiosClient.post("/auth/register", {
    name,
    email,
    password,
    phone,
    address,
  });
  return data; // { user, token }
}

// POST /api/auth/login — the backend verifies the password hash itself.
export async function login({ email, password }) {
  const { data } = await axiosClient.post("/auth/login", { email, password });
  return data; // { user, token }
}

// OAuth (Google) sign-up/login. `accessToken` is the access token handed to
// the browser by Google Identity Services — the backend uses it to fetch
// the verified profile straight from Google itself (never trusting anything
// the browser claims to have decoded), then finds or creates that account.
// This covers both "Sign up with Google" and "Log in with Google" with a
// single button, as required by the assignment brief.
export async function loginWithGoogle(accessToken) {
  if (!accessToken) {
    throw new Error("Google did not return an access token.");
  }
  const { data } = await axiosClient.post("/auth/oauth/google", { accessToken });
  return data; // { user, token }
}
