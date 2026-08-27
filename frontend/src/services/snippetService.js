const BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const API_URL = `${BASE_URL}/api/snippets`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("codenest_token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const fetchSnippets = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch snippets");
  }

  return data;
};

const createSnippet = async (snippetData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(snippetData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create snippet");
  }

  return data;
};

const updateSnippet = async (id, snippetData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(snippetData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update snippet");
  }

  return data;
};

const deleteSnippet = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete snippet");
  }

  return data;
};

const snippetService = {
  fetchSnippets,
  createSnippet,
  updateSnippet,
  deleteSnippet,
};

export default snippetService;
