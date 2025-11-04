import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";

const UserStat = () => {
  const [loading, setLoading] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);
  const [AllCount, setAllCount] = useState(0);
  const [solvedCountsByDifficulty, setSolvedCountsByDifficulty] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });

  // Get the current user from AuthContext
  const { Authuser } = useAuthContext();

  // Derived stats
  const [totalProblems, setTotalProblems] = useState(0);
  const solvePercentage = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

  // Derived user display fields with safe fallbacks
  const displayName = Authuser?.username || Authuser?.displayName || "User";
  const email = Authuser?.email || "";
  const gender = Authuser?.gender || "N/A";
  const avatarUrl =
    Authuser?.profilePic ||
    Authuser?.photoURL ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`;

  const handleGoBack = () => {
    window.history.back();
  };

  // Fetch problems and user submissions to compute correct stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // If no user, nothing to fetch
        if (!Authuser) {
          setSolvedCount(0);
          setAllCount(0);
          setSolvedCountsByDifficulty({ easy: 0, medium: 0, hard: 0 });
          setTotalProblems(0);
          setLoading(false);
          return;
        }

        const userId = Authuser?._id || Authuser?.uid; // prefer backend _id; fallback to uid if backend supports it

        // 1) Fetch all problems to know categories and total
        const problemsRes = await fetch('http://localhost:5000/api/problems/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const problems = await problemsRes.json();
        setTotalProblems(Array.isArray(problems) ? problems.length : 0);

        // Build a map problemId -> category
        const categoryById = new Map(
          (Array.isArray(problems) ? problems : []).map(p => [p._id, p.category])
        );

        // 2) Fetch all submissions for this user
        const subsUrl = `http://localhost:5000/api/submit/${userId}`;
        const subsRes = await fetch(subsUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const submissions = await subsRes.json();
        const subs = Array.isArray(submissions) ? submissions : [];

        // Total submissions
        setAllCount(subs.length);

        // Determine which problems are solved (any submission with result.status === 'success')
        const solvedSet = new Set();
        subs.forEach(s => {
          if (s?.result?.status === 'success' && s?.problemId) {
            solvedSet.add(s.problemId);
          }
        });

        setSolvedCount(solvedSet.size);

        // Difficulty breakdown for solved problems
        const counts = { easy: 0, medium: 0, hard: 0 };
        solvedSet.forEach(pid => {
          const cat = categoryById.get(pid);
          if (cat && counts.hasOwnProperty(cat)) counts[cat] += 1;
        });
        setSolvedCountsByDifficulty(counts);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [Authuser]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{animationDelay: '2s'}}></div>

      {/* Header with back button */}
      <div className="relative z-10 pt-6 px-6">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50 text-white font-semibold rounded-lg transition-all duration-300 backdrop-blur-md shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-6">
        <div className="w-full max-w-2xl">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-2">User Profile</h1>
            <p className="text-gray-300">Track your coding progress</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 border border-white/20 mb-8">
            {/* Profile Picture and Basic Info */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-full p-1 mb-6 shadow-lg bg-gradient-to-r from-purple-500 to-blue-500">
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover bg-gradient-to-br from-purple-400 to-blue-400"
                />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">{displayName}</h2>
              {email && <p className="text-gray-300">{email}</p>}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-8"></div>

            {/* User Details */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm font-medium mb-1">Gender</p>
                <p className="text-white text-lg font-semibold">{gender}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm font-medium mb-1">Total Submissions</p>
                <p className="text-white text-lg font-semibold">{AllCount}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-8"></div>

            {/* Stats Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white text-center mb-6">Your Progress</h3>

              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {/* Overall Progress */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-300 font-medium">Problems Solved</span>
                      <span className="text-2xl font-bold text-white">{solvedCount}/{totalProblems}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-500"
                        style={{width: `${solvePercentage}%`}}
                      ></div>
                    </div>
                    <p className="text-gray-400 text-sm mt-3">{solvePercentage}% Complete</p>
                  </div>

                  {/* Difficulty Breakdown */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Easy */}
                    <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 rounded-lg p-4 text-center hover:border-green-500/60 transition-all">
                      <svg className="w-8 h-8 text-green-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      <p className="text-gray-400 text-xs font-medium mb-1">Easy</p>
                      <p className="text-2xl font-bold text-green-400">{solvedCountsByDifficulty.easy}</p>
                    </div>

                    {/* Medium */}
                    <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30 rounded-lg p-4 text-center hover:border-yellow-500/60 transition-all">
                      <svg className="w-8 h-8 text-yellow-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                      </svg>
                      <p className="text-gray-400 text-xs font-medium mb-1">Medium</p>
                      <p className="text-2xl font-bold text-yellow-400">{solvedCountsByDifficulty.medium}</p>
                    </div>

                    {/* Hard */}
                    <div className="bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/30 rounded-lg p-4 text-center hover:border-red-500/60 transition-all">
                      <svg className="w-8 h-8 text-red-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                      </svg>
                      <p className="text-gray-400 text-xs font-medium mb-1">Hard</p>
                      <p className="text-2xl font-bold text-red-400">{solvedCountsByDifficulty.hard}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Motivational Message */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-white/20 rounded-lg p-6 backdrop-blur-md">
              <p className="text-xl font-bold text-white">
                🚀 Keep Coding! Keep Progressing!
              </p>
              <p className="text-gray-300 mt-2 text-sm">
                Every problem solved makes you a better developer
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStat;