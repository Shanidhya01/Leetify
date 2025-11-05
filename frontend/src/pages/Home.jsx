import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to LeetClone</h1>
      <p className="mb-6">Practice coding problems with an editor, submit to Judge0 via backend, and view results.</p>
      <Link to="/problems" className="bg-blue-600 px-4 py-2 rounded">Browse Problems</Link>
    </div>
  );
}
