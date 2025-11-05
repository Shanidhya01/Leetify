import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import SplitLayout from '../components/SplitLayout';
import { getProblem, submitSolution } from '../api';

export default function ProblemDetail({ user }) {
  const { slug } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(`// Type your solution for ${slug} here\n`);
  const [language, setLanguage] = useState('cpp');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const resultsRef = useRef();

  useEffect(() => {
    getProblem(slug).then(r => setProblem(r.data)).catch(e => setErrorMsg(e.message));
  }, [slug]);

  async function handleSubmit() {
    setErrorMsg(null);
    if (!user) {
      setErrorMsg('You must be logged in to submit solutions.');
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      const res = await submitSolution(slug, language, code);
      // backend returns { submissionId, status, results }
      setResult(res.data);
      setTimeout(() => { if (resultsRef.current) resultsRef.current.scrollIntoView({ behavior: 'smooth' }); }, 200);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const left = (
    <>
      {!problem ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>
          <div className="text-sm text-slate-300 mb-4">Difficulty: <span className="font-semibold">{problem.difficulty}</span></div>
          <div className="prose prose-slate text-slate-100 mb-4" dangerouslySetInnerHTML={{ __html: (problem.description || '').replace(/\n/g,'<br/>') }} />
          <div>
            <h3 className="font-semibold mb-2">Examples</h3>
            {problem.examples && problem.examples.length ? problem.examples.map((ex, idx) => (
              <div key={idx} className="mb-3 p-3 bg-slate-700 rounded">
                <div className="text-xs text-slate-300">Input</div>
                <pre className="bg-slate-800 p-2 rounded mt-1">{ex.input}</pre>
                <div className="text-xs text-slate-300 mt-2">Output</div>
                <pre className="bg-slate-800 p-2 rounded mt-1">{ex.output}</pre>
                {ex.explanation && <div className="text-sm text-slate-300 mt-2">{ex.explanation}</div>}
              </div>
            )) : <div className="text-slate-400">No examples provided.</div>}
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Testcases (visible inputs only)</h3>
            {problem.testcases?.map((tc, i) => (
              <div key={i} className="mb-2 p-2 bg-slate-700 rounded">
                <div className="text-xs text-slate-300">Input</div>
                <pre className="bg-slate-800 p-2 rounded mt-1">{tc.input}</pre>
                <div className="text-xs text-slate-300 mt-2">Output</div>
                <pre className="bg-slate-800 p-2 rounded mt-1">{tc.hidden ? 'Hidden' : tc.output}</pre>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );

  const right = (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-slate-900 text-white p-2 rounded">
            <option value="cpp">C++</option>
            <option value="python3">Python 3</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
          </select>
          <button onClick={handleSubmit} disabled={submitting} className="bg-blue-600 px-4 py-2 rounded">
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
        <div className="text-sm text-slate-300">Status: {result?.status || 'Idle'}</div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Editor
          height="60vh"
          defaultLanguage={language}
          language={language === 'python3' ? 'python' : (language === 'cpp' ? 'cpp' : language)}
          theme="vs-dark"
          value={code}
          onChange={(v) => setCode(v)}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            automaticLayout: true
          }}
        />
      </div>

      <div className="p-4 border-t border-slate-700 bg-slate-900 overflow-auto" ref={resultsRef}>
        {errorMsg && <div className="text-red-400 mb-3">{errorMsg}</div>}

        {!result ? (
          <div className="text-slate-400">Submit a solution to see results here.</div>
        ) : (
          <div>
            <div className="mb-2">Submission ID: <span className="font-mono">{result.submissionId}</span></div>
            <div className="mb-2">Overall status: <strong>{result.status}</strong></div>

            <details className="bg-slate-800 p-3 rounded">
              <summary className="cursor-pointer">Judge Responses (raw)</summary>
              <pre className="mt-2 text-xs whitespace-pre-wrap">{JSON.stringify(result.results, null, 2)}</pre>
            </details>

            <div className="mt-3">
              <h4 className="font-semibold mb-2">Per-testcase results</h4>
              {Array.isArray(result.results) ? result.results.map((r, i) => (
                <div key={i} className="mb-2 p-2 bg-slate-800 rounded">
                  <div className="text-sm">Testcase #{i + 1} — {r.status?.description || r.error || 'Unknown'}</div>
                  {r.stdout && <div className="text-xs mt-1"><strong>Stdout:</strong><pre className="bg-slate-900 p-2 rounded mt-1">{r.stdout}</pre></div>}
                  {r.stderr && <div className="text-xs mt-1 text-red-300"><strong>Stderr:</strong><pre className="bg-slate-900 p-2 rounded mt-1">{r.stderr}</pre></div>}
                  {r.compile_output && <div className="text-xs mt-1 text-red-300"><strong>Compile:</strong><pre className="bg-slate-900 p-2 rounded mt-1">{r.compile_output}</pre></div>}
                </div>
              )) : <div className="text-slate-400">No judge responses returned.</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return <SplitLayout left={left} right={right} />;
}
