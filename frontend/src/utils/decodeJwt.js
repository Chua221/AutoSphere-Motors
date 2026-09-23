// Decodes the payload of a JWT (base64url) without verifying the signature.
// This is safe here because the token came directly from Google's own
// accounts.google.com script running in the browser — we're just reading
// the claims (email, name, picture, sub) to display/store locally.
export function decodeJwtPayload(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );
  return JSON.parse(jsonPayload);
}
