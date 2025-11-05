import axios from 'axios';
import { auth } from './firebase';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export async function getProblems() {
  return axios.get(`${API_BASE}/problems`);
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

export async function getSubmission(id) {
  const headers = await getAuthHeader();
  return axios.get(`${API_BASE}/submissions/${id}`, { headers });
}
