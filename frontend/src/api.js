
import axios from "axios";
const API = "http://localhost:5000/api";
export const generateSpec = (data) => axios.post(`${API}/generate`, data);
export const getHistory = () => axios.get(`${API}/history`);
export const getStatus = () => axios.get(`${API}/status`);
