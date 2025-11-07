import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProblems, getFavorites, toggleFavorite } from '../api';

export default function ProblemList({ user }) {
  const [problems, setProblems] = useState([]);
  const [q, setQ] = useState('');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch();
    if (user) fetchFavs();
  }, [user]);

  async function fetch() {
    try {
      const res = await getProblems();
      setProblems(res.data);
    } catch (e) { console.error(e); }
  }

  async function fetchFavs() {
    try {
      const res = await getFavorites();
      setFavorites(res.data.map(p => p.slug));
    } catch (e) { console.error(e); }
  }

  async function doSearch(e) {
    e.preventDefault();
    try {
      const res = await getProblems(q);
      setProblems(res.data);
    } catch (err) { console.error(err); }
  }

  async function handleToggle(slug) {
    if (!user) return alert('Login to favorite');
    try {
      const res = await toggleFavorite(slug);
      if (res.data.favorited) setFavorites(prev => [...prev, slug]);
      else setFavorites(prev => prev.filter(s => s !== slug));
    } catch (e) { console.error(e); }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Problems</h2>
        <form onSubmit={doSearch} className="flex gap-2">
          <input value={q} onChange={e => setQ(e.target.value)} className="bg-slate-800 p-2 rounded" placeholder="search title or tag" />
          <button className="bg-accent px-3 py-1 rounded">Search</button>
        </form>
      </div>

      <div className="space-y-3">
        {problems.map(p => (
          <div key={p.slug} className="flex justify-between items-center p-4 rounded bg-slate-800">
            <div>
              <Link to={`/problems/${p.slug}`} className="font-semibold text-lg">{p.title}</Link>
              <div className="text-sm text-gray-400">{p.tags?.join(', ')}</div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-2 py-1 rounded text-sm ${p.difficulty === 'Easy' ? 'bg-green-600' : p.difficulty === 'Hard' ? 'bg-red-600' : 'bg-yellow-600'}`}>{p.difficulty}</span>
              <button onClick={() => handleToggle(p.slug)} className="text-yellow-300 text-xl">{favorites.includes(p.slug) ? '★' : '☆'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
