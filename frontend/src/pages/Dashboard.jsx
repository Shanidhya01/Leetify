import React, { useEffect, useState } from 'react';
import { getUserStats } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await getUserStats();
      setStats(res.data);
    } catch (e) { console.error(e); }
  }

  if (!stats) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{stats.name}'s Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-green-700 p-4 rounded text-center">
          <div className="text-2xl font-bold">{stats.easy}</div>
          <div className="text-sm">Easy</div>
        </div>
        <div className="bg-yellow-600 p-4 rounded text-center">
          <div className="text-2xl font-bold">{stats.medium}</div>
          <div className="text-sm">Medium</div>
        </div>
        <div className="bg-red-700 p-4 rounded text-center">
          <div className="text-2xl font-bold">{stats.hard}</div>
          <div className="text-sm">Hard</div>
        </div>
      </div>
      <div className="text-center text-gray-300">Total solved: {stats.totalSolved}</div>
    </div>
  );
}
