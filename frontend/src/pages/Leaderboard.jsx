import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../api';

export default function Leaderboard() {
  const [list, setList] = useState([]);

  useEffect(() => {
    getLeaderboard().then(r => setList(r.data)).catch(console.error);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
      <div className="bg-slate-800 rounded p-4">
        {list.map((u, idx) => (
          <div key={idx} className="flex justify-between p-3 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="text-xl font-bold">{idx + 1}.</div>
              <div>{u.name}</div>
            </div>
            <div className="font-semibold text-accent">{u.solved}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
