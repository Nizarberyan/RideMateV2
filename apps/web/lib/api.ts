import { createClient } from "@repo/api-client";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const client = createClient({
  baseUrl: API_URL,
  getToken: () => typeof window !== "undefined" ? localStorage.getItem("token") : null,
});

// For backward compatibility while refactoring
export const fetchApi = client.fetchApi;
