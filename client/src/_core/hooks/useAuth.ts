// Auth has been removed — this is a public-facing audit tool.
// This stub is kept so any residual imports don't break the build.

export function useAuth() {
  return {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    logout: async () => {},
  };
}
