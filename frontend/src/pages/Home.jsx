import React from "react";
import Split from "react-split";
import Navbar from "../components/Navbar";
import ProblemDesc from "../components/ProblemDesc";
import CodeSpace from "../components/CodeSpace";
import TestSpace from "../components/TestSpace";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      {/* Main Content Area */}
      <div className="h-[calc(100vh-80px)]">
        <Split 
          className="flex h-full"
          sizes={[35, 65]}
          minSize={300}
          expandToMin={true}
          gutterSize={8}
          gutterAlign="center"
          snapOffset={30}
          dragInterval={1}
          direction="horizontal"
          cursor="col-resize"
        >
          {/* Left Panel - Problem Description */}
          <div className="flex flex-col min-w-[300px] h-full overflow-hidden bg-white shadow-sm border border-gray-200">
            <div className="bg-gradient-to-r from-slate-900 to-purple-900 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                Problem
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <ProblemDesc />
            </div>
          </div>

          {/* Right Panel - Code & Tests */}
          <div className="flex flex-col h-full">
            <Split 
              direction="vertical" 
              className="flex flex-col h-full"
              sizes={[60, 40]}
              minSize={150}
              expandToMin={true}
              gutterSize={8}
              dragInterval={1}
              cursor="row-resize"
            >
              {/* Top - Code Editor */}
              <div className="flex flex-col min-h-[150px] bg-white shadow-sm border border-gray-200 rounded-lg m-2 ml-0">
                <div className="bg-gradient-to-r from-slate-900 to-purple-900 px-6 py-4 border-b border-gray-200 rounded-t-lg flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9.4 16.6L4.8 12l4.6-4.6M14.6 16.6l4.6-4.6-4.6-4.6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Code Editor
                  </h2>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded transition-colors">
                      Run
                    </button>
                    <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded transition-colors">
                      Submit
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  <CodeSpace />
                </div>
              </div>

              {/* Bottom - Test Results */}
              <div className="flex flex-col min-h-[150px] bg-white shadow-sm border border-gray-200 rounded-lg m-2 mr-0 ml-0">
                <div className="bg-gradient-to-r from-slate-900 to-purple-900 px-6 py-4 border-b border-gray-200 rounded-t-lg">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                    </svg>
                    Test Results
                  </h2>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  <TestSpace />
                </div>
              </div>
            </Split>
          </div>
        </Split>
      </div>

      <style>{`
        .split {
          display: flex;
        }
        .gutter {
          background: linear-gradient(to right, #f3f4f6, #e5e7eb, #f3f4f6);
          cursor: col-resize;
        }
        .gutter.gutter-vertical {
          background: linear-gradient(to bottom, #f3f4f6, #e5e7eb, #f3f4f6);
          cursor: row-resize;
        }
      `}</style>
    </div>
  );
};

export default Home;