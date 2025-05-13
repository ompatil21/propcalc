// src/lib/auth.ts
export function getAuthToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

export function getUserRole() {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        return JSON.parse(user).role;
      } catch {
        return null;
      }
    }
  }
  return null;
}
