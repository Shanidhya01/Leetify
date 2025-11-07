import React from 'react';

export default function SplitLayout({ left, right }) {
  return (
    <div className="h-[calc(100vh-64px)] flex">
      <div className="w-1/2 border-r border-slate-700 overflow-auto p-6 bg-slate-800">{left}</div>
      <div className="w-1/2 overflow-hidden bg-slate-900">{right}</div>
    </div>
  );
}
