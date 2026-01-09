import axios from "axios";

const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!RAW_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

// Force absolute origin (prevents Next.js interception)
const API_BASE_URL = RAW_BASE_URL.replace(/\/$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Transactions API — FULL PATH
export const transactionsAPI = {
  getAll: () =>
    axios.get(`${API_BASE_URL}/api/transactions`),

  getById: (id: string) =>
    axios.get(`${API_BASE_URL}/api/transactions/${id}`),

  create: (data: any) =>
    axios.post(`${API_BASE_URL}/api/transactions`, data),
};

// Stats API — FULL PATH
export const statsAPI = {
  getStats: () =>
    axios.get(`${API_BASE_URL}/stats`),
};

// Init API — FULL PATH
export const initAPI = {
  seed: () =>
    axios.post(`${API_BASE_URL}/init`),
};
