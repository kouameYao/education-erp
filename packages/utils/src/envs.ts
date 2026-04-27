export function getAppUrl() {
  if (process.env.DASHBOARD_URL) {
    return process.env.DASHBOARD_URL;
  }

  if (process.env.NODE_ENV === "production") {
    return process.env.PUBLIC_APP_URL ?? "http://localhost:3001";
  }

  return "http://localhost:3001";
}

export function getApiUrl() {
  if (process.env.API_URL) {
    return process.env.API_URL;
  }

  return "http://localhost:3002";
}
