export function ProtectedRoute({ isAllowed, fallback = null, children }) {
  return isAllowed ? children : fallback
}
