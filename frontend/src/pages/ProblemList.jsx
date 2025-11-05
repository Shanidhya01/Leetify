import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProblems } from '../api';

export default function ProblemList() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    getProblems().then(r => setProblems(r.data)).catch(e => console.error(e));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">All Problems</h2>
      <div className="grid grid-cols-1 gap-2">
        {problems.map(p => (
          <Link key={p.slug} to={`/problems/${p.slug}`} className="flex justify-between items-center p-4 bg-slate-800 rounded hover:bg-slate-700">
            <div>
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-slate-300">{p.tags?.join(', ')}</div>
            </div>
            <div className={`text-sm px-2 py-1 rounded ${p.difficulty === 'Easy' ? 'bg-green-600' : p.difficulty === 'Hard' ? 'bg-red-600' : 'bg-yellow-500'}`}>
              {p.difficulty}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
