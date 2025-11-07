import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SplitLayout from '../components/SplitLayout';
import CodeEditor from '../components/CodeEditor';
import { getProblem, submitSolution, runCode, toggleFavorite } from '../api';

export default function ProblemDetail({ user }) {
  const { slug } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('// write code here\n');
  const [result, setResult] = useState(null);
  const [fav, setFav] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetchProblem();
  }, [slug]);

  async function fetchProblem() {
    try {
      const res = await getProblem(slug);
      setProblem(res.data);
    } catch (e) { console.error(e); }
  }

  async function handleSubmit() {
    if (!user) return alert('Login to submit');
    try {
      const res = await submitSolution(slug, language, code);
      setResult(res.data);
    } catch (e) { console.error(e); alert(e.response?.data?.error || e.message); }
  }

  async function handleRun() {
    if (!user) return alert('Login to run');
    try {
      const res = await runCode(language, code, input);
      setResult({ status: 'Run', results: [res.data] });
    } catch (e) { console.error(e); alert(e.response?.data?.error || e.message); }
  }

  async function handleToggle() {
    if (!user) return alert('Login to favorite');
    try {
      const res = await toggleFavorite(slug);
      setFav(res.data.favorited);
    } catch (e) { console.error(e); }
  }

  const left = !problem ? <div>Loading...</div> : (
    <>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{problem.title}</h1>
          <div className="text-sm text-gray-400">{problem.difficulty}</div>
        </div>
        <button onClick={handleToggle} className="text-yellow-300 text-2xl">{fav ? '★' : '☆'}</button>
      </div>
      <div className="mt-4 text-gray-200" dangerouslySetInnerHTML={{ __html: (problem.description || '').replace(/\n/g,'<br/>') }} />
      <div className="mt-6">
        <h3 className="font-semibold">Examples</h3>
        {problem.examples?.map((ex, i) => (
          <div key={i} className="bg-slate-700 p-3 rounded mt-2">
            <div className="text-xs text-gray-300">Input</div><pre className="mt-1 bg-slate-800 p-2 rounded">{ex.input}</pre>
            <div className="text-xs text-gray-300 mt-2">Output</div><pre className="mt-1 bg-slate-800 p-2 rounded">{ex.output}</pre>
          </div>
        ))}
      </div>
    </>
  );

  const right = (
    <div className="flex flex-col h-full">
      <div className="p-3 flex gap-3 items-center border-b border-slate-700">
        <select value={language} onChange={e => setLanguage(e.target.value)} className="bg-slate-800 p-2 rounded">
          <option value="cpp">C++</option>
          <option value="python3">Python</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
        </select>
        <button onClick={handleRun} className="bg-yellow-600 px-3 py-1 rounded">Run</button>
        <button onClick={handleSubmit} className="bg-accent px-3 py-1 rounded">Submit</button>
        <input placeholder="stdin (optional)" value={input} onChange={e => setInput(e.target.value)} className="ml-auto bg-slate-800 p-2 rounded w-48" />
      </div>

      <div className="flex-1 overflow-hidden">
        <CodeEditor language={language} code={code} onChange={setCode} />
      </div>

      <div className="p-4 border-t border-slate-700 h-44 overflow-auto bg-slate-900 text-sm">
        {!result ? <div className="text-gray-400">Output will appear here</div> : (
          <>
            <div className="mb-2">Status: <strong>{result.status}</strong></div>
            <details className="bg-slate-800 p-2 rounded">
              <summary>Judge responses</summary>
              <pre className="mt-2 text-xs whitespace-pre-wrap">{JSON.stringify(result.results, null, 2)}</pre>
            </details>
          </>
        )}
      </div>
    </div>
  );

  return <SplitLayout left={left} right={right} />;
}
