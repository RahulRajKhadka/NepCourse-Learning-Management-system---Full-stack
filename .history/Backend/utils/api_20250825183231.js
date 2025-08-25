// src/utils/api.js
const API_BASE = "http://localhost:8000/api";

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const defaultOptions = {
    credentials: "include",
    headers: {},
  };

  // Merge options
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Add Content-Type header only if not FormData (FormData sets its own content-type)
  if (!(mergedOptions.body instanceof FormData)) {
    mergedOptions.headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(url, mergedOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Check if response has content before parsing JSON
    const contentLength = response.headers.get("content-length");
    if (contentLength === "0" || response.status === 204) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Specific API functions
export const updateProfile = (formData) => {
  return apiRequest("/user/profile", {
    method: "PUT",
    body: formData,
    // Don't set Content-Type header for FormData - browser will set it automatically
  });
};

export const getCurrentUser = () => {
  return apiRequest("/user/getcurrentuser", {
    method: "GET",
  });
};