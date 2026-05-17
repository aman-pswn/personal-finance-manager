export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

function buildFriendlyError(error) {
  if (error instanceof TypeError) {
    return new Error(
      `Cannot reach backend at ${API_BASE_URL}. Spring Boot may be stopped, blocked by CORS, or running on a different port.`
    );
  }

  return error;
}

async function parseError(response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const data = await response.json();
    return data.message ?? "Request failed";
  }

  const message = await response.text();
  return message || "Request failed";
}

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {})
      },
      ...options
    });
  } catch (error) {
    throw buildFriendlyError(error);
  }

  if (!response.ok) {
    const message = await parseError(response);
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getTransactions() {
  return request("/transactions");
}

export function createTransaction(payload) {
  return request("/transactions", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function deleteTransaction(id) {
  return request(`/transactions/${id}`, {
    method: "DELETE"
  });
}
