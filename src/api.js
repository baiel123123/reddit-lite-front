// Используйте .env файл: REACT_APP_API_URL=https://api.yourdomain.com
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const originalFetch = window.fetch;

function isFullUrl(url) {
  return url.startsWith("http://") || url.startsWith("https://");
}

async function fetchWithRefresh(url, options = {}, retry = true) {
  const finalUrl = isFullUrl(url) ? url : BASE_URL + url;

  const response = await originalFetch(finalUrl, {
    ...options,
    credentials: "include", 
  });

  if (response.status === 401 && retry) {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      throw new Error("Нет refresh_token для обновления");
    }

    const refreshResponse = await originalFetch(BASE_URL + "/users/refresh-token/", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();

      localStorage.setItem("refresh_token", refreshData.refresh_token);
      return fetchWithRefresh(url, options, false);
    } else {
      throw new Error("Unauthorized, and refresh failed");
    }
  }

  return response;
}


window.fetch = fetchWithRefresh;

export default fetchWithRefresh;
