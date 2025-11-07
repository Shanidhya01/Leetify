import React from 'react';
import { Link } from 'react-router-dom';
import { auth, provider, signInWithPopup, signOut } from '../firebase';

export default function Navbar({ user }) {
  async function login() {
    try { await signInWithPopup(auth, provider); } catch (e) { console.error(e); }
  }
  async function logout() {
    try { await signOut(auth); } catch (e) { console.error(e); }
  }

  return (
    <nav className="bg-slate-900 text-white p-4 flex justify-between items-center shadow">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-bold text-accent">LeetClone</Link>
        <Link to="/problems" className="hover:underline">Problems</Link>
        <Link to="/leaderboard" className="hover:underline">Leaderboard</Link>
        {user && <Link to="/dashboard" className="hover:underline">Dashboard</Link>}
      </div>

      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm">{user.displayName || user.email}</span>
            <button onClick={logout} className="bg-red-600 px-3 py-1 rounded">Logout</button>
          </div>
        ) : (
          <button onClick={login} className="bg-green-600 px-3 py-1 rounded">Login</button>
        )}
      </div>
    </nav>
  );
}
