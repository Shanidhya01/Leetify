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
    <nav className="bg-slate-900 text-white p-4 flex items-center justify-between shadow">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-2xl font-semibold tracking-tight">LeetClone</Link>
        <Link to="/problems" className="text-sm px-2 py-1 rounded hover:bg-slate-800">Problems</Link>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="text-sm">{user.displayName || user.email}</div>
            <button onClick={logout} className="bg-red-600 px-3 py-1 rounded text-sm">Logout</button>
          </>
        ) : (
          <button onClick={login} className="bg-green-600 px-3 py-1 rounded text-sm">Login with Google</button>
        )}
      </div>
    </nav>
  );
}
