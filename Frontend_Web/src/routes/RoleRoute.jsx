export function RoleRoute({ role, allowedRoles, fallback = null, children }) {
  return allowedRoles.includes(role) ? children : fallback
}
