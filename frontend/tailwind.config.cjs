module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0f172a',
        'dark-surface': '#1e293b',
        'accent': '#3b82f6'
      },
      boxShadow: {
        'glow': '0 0 10px rgba(59,130,246,0.4)'
      }
    }
  },
  plugins: []
};
