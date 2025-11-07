import React, { useEffect, useState } from 'react';
import { getUserSubmissions } from '../api';
import { Link } from 'react-router-dom';

export default function Submissions() {
  const [subs, setSubs] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchSubs();
  }, []);

  async function fetchSubs() {
    try {
      const res = await getUserSubmissions();
      setSubs(res.data);
    } catch (e) { console.error(e); }
  }

  const filtered = subs.filter(s => filter === 'All' || s.status === filter);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Submissions</h1>
        <select className="bg-slate-800 p-2 rounded" value={filter} onChange={e => setFilter(e.target.value)}>
          <option>All</option>
          <option>Accepted</option>
          <option>Failed</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-gray-200">
            <tr>
              <th className="p-2 text-left">Problem</th>
              <th className="p-2 text-left">Language</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s._id} className="border-b border-slate-700 hover:bg-slate-800">
                <td className="p-2">
                  <Link to={`/problems/${s.problem?.slug}`} className="text-accent">{s.problem?.title || 'Unknown'}</Link>
                </td>
                <td className="p-2">{s.language}</td>
                <td className={`p-2 font-semibold ${s.status === 'Accepted' ? 'text-green-400' : 'text-red-400'}`}>{s.status}</td>
                <td className="p-2 text-gray-400">{new Date(s.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
