import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000000,
  headers: {
    "Content-Type": "application/json",
  },
});
