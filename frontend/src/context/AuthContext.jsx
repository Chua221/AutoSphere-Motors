import { createContext, useContext, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

const TOKEN_KEY = "asm_token";
const USER_KEY = "asm_user";

function readStoredUser() {
  try {
    const storedUser = localStorage.getItem(USER_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);
    return storedUser && storedToken ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // Restore session from localStorage synchronously on first render.
  const [user, setUser] = useState(readStoredUser);
  const initializing = false;

  function persistSession(nextUser, token) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }

  async function login(credentials) {
    const { user: loggedInUser, token } = await authService.login(credentials);
    persistSession(loggedInUser, token);
    return loggedInUser;
  }

  async function register(formData) {
    const { user: newUser, token } = await authService.register(formData);
    persistSession(newUser, token);
    return newUser;
  }

  // Used by GoogleSignInButton after Google returns a verified ID token.
  async function loginWithGoogle(googleProfile) {
    const { user: loggedInUser, token } = await authService.loginWithGoogle(googleProfile);
    persistSession(loggedInUser, token);
    return loggedInUser;
  }

  // Used by OAuthCallback after the backend server has already exchanged the
  // GitHub/Facebook authorization code and resolved the user record — this
  // just adopts that finished session client-side.
  function completeOAuthSession(oauthUser, token) {
    persistSession(oauthUser, token);
    return oauthUser;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  // Keep localStorage in sync when profile fields are updated elsewhere (e.g. Profile page).
  function updateSessionUser(nextUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }

  const value = {
    user,
    isAuthenticated: !!user,
    initializing,
    login,
    register,
    loginWithGoogle,
    completeOAuthSession,
    logout,
    updateSessionUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
