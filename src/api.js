const BASE_URL = "http://localhost:8000";

const originalFetch = window.fetch;

function isFullUrl(url) {
  return url.startsWith("http://") || url.startsWith("https://");
}

async function fetchWithRefresh(url, options = {}, retry = true) {
  const finalUrl = isFullUrl(url) ? url : BASE_URL + url;

  const response = await originalFetch(finalUrl, {
    ...options,
    credentials: "include", // чтобы куки шли
  });

  if (response.status === 401 && retry) {
    // берем refresh_token из localStorage
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      throw new Error("Нет refresh_token для обновления");
    }

    const refreshResponse = await originalFetch(BASE_URL + "/users/refresh-token", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();

      // обновляем refresh_token в localStorage
      localStorage.setItem("refresh_token", refreshData.refresh_token);

      // при необходимости можешь также обновить access_token в куках, если сервер так делает

      // повторяем исходный запрос, но без повторного обновления (retry=false)
      return fetchWithRefresh(url, options, false);
    } else {
      throw new Error("Unauthorized, and refresh failed");
    }
  }

  return response;
}

// сразу заменяем глобальный fetch
window.fetch = fetchWithRefresh;

export default fetchWithRefresh;
