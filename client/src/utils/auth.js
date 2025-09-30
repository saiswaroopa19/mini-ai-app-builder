export function saveUserId(id) {
  localStorage.setItem("user_id", id);
}

export function getUserId() {
  return localStorage.getItem("user_id");
}

export function clearAuth() {
  localStorage.removeItem("user_id");
}
