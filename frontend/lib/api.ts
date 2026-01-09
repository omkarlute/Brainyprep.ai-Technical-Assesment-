import axios from "axios";

/* ------------------------------------------------------------------
   BASE URL
------------------------------------------------------------------- */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

const api = axios.create({
  baseURL: BASE_URL.replace(/\/$/, ""),
  headers: {
    "Content-Type": "application/json",
  },
});

/* ------------------------------------------------------------------
   TRANSACTIONS API
------------------------------------------------------------------- */
export const transactionsAPI = {
  getAll: () => api.get("/api/transactions"),
  getById: (id: string) => api.get(`/api/transactions/${id}`),
  create: (data: any) => api.post("/api/transactions", data),
};

/* ------------------------------------------------------------------
   STATS API  ✅ FIXED
------------------------------------------------------------------- */
export const statsAPI = {
  getStats: () => api.get("/api/stats"),
};

/* ------------------------------------------------------------------
   INIT API  ✅ FIXED
------------------------------------------------------------------- */
export const initAPI = {
  seed: () => api.post("/api/init"),
};
