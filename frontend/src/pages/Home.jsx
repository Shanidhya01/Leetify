import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="p-12 text-center">
      <h1 className="text-4xl font-bold mb-4 text-accent">Welcome to LeetClone</h1>
      <p className="text-gray-300 mb-6">Practice problems, run code, track progress, and compete on the leaderboard.</p>
      <div className="flex justify-center gap-4">
        <Link to="/problems" className="bg-accent px-6 py-3 rounded">Browse Problems</Link>
        <Link to="/leaderboard" className="bg-slate-700 px-6 py-3 rounded">Leaderboard</Link>
      </div>
    </div>
  );
}
