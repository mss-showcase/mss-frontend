// Shared Cognito/JWT helpers

/**
 * Checks if a Cognito JWT token contains the admin group.
 * @param token JWT string
 * @returns true if user is in admin group
 */
export function isAdminFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Prefer explicit isAdmin boolean claim if present
    if (typeof payload.isAdmin === 'boolean') {
      return payload.isAdmin;
    }
    // Fallback to Cognito group membership
    const groups = payload["cognito:groups"] || [];
    return Array.isArray(groups) ? groups.includes("admin") : false;
  } catch {
    return false;
  }
}
