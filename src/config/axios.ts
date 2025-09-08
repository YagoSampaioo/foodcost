import axios from "axios";
import { config } from "./env";

export const apiClient = axios.create({
  baseURL: config.app.apiUrl,
  withCredentials: true,
});
