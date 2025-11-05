module.exports = function mapLangToJudge0Id(lang) {
  // Check your Judge0 instance for exact ids. These are common examples.
  const map = {
    python3: 71,
    cpp: 54,
    java: 62,
    c: 50,
    javascript: 63
  };
  return map[lang] || 71;
};
