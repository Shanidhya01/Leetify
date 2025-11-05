import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProblemList from './pages/ProblemList';
import ProblemDetail from './pages/ProblemDetail';
import { auth } from './firebase';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => setUser(u));
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/problems" element={<ProblemList />} />
          <Route path="/problems/:slug" element={<ProblemDetail user={user} />} />
        </Routes>
      </div>
    </div>
  );
}
