import React from 'react';

export default function SplitLayout({ left, right }) {
  return (
    <div className="h-[calc(100vh-64px)] flex">
      <div className="w-1/3 border-r border-slate-700 overflow-auto bg-slate-800 p-6">
        {left}
      </div>
      <div className="w-2/3 flex flex-col overflow-hidden">
        {right}
      </div>
    </div>
  );
}
