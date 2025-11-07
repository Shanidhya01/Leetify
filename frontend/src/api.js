import axios from 'axios';
import { auth } from './firebase';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export async function getProblems(q) {
  const url = q ? `${API_BASE}/problems/search?q=${encodeURIComponent(q)}` : `${API_BASE}/problems`;
  return axios.get(url);
}

export async function getProblem(slug) {
  return axios.get(`${API_BASE}/problems/${slug}`);
}

async function getAuthHeader() {
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

export async function submitSolution(problemSlug, language, sourceCode) {
  const headers = await getAuthHeader();
  return axios.post(`${API_BASE}/submissions`, { problemSlug, language, sourceCode }, { headers });
}

export async function runCode(language, sourceCode, input = '') {
  const headers = await getAuthHeader();
  return axios.post(`${API_BASE}/submissions/run`, { language, sourceCode, input }, { headers });
}

export async function getUserSubmissions() {
  const headers = await getAuthHeader();
  return axios.get(`${API_BASE}/submissions`, { headers });
}

export async function toggleFavorite(slug) {
  const headers = await getAuthHeader();
  return axios.post(`${API_BASE}/problems/${slug}/favorite`, {}, { headers });
}

export async function getFavorites() {
  const headers = await getAuthHeader();
  return axios.get(`${API_BASE}/problems/favorites/list`, { headers });
}

export async function getLeaderboard() {
  return axios.get(`${API_BASE}/leaderboard`);
}

export async function getUserStats() {
  const headers = await getAuthHeader();
  return axios.get(`${API_BASE}/user/stats`, { headers });
}
