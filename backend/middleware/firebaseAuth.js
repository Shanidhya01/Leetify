const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// initialize firebase admin once using env path
const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './firebaseServiceAccount.json';
if (!admin.apps.length) {
  if (!fs.existsSync(saPath)) {
    console.error('Firebase service account not found at', saPath);
    // we don't exit here to allow public endpoints to still run — but protected routes will fail
  } else {
    const serviceAccount = require(path.resolve(saPath));
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  }
}

module.exports = async function firebaseAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/^Bearer (.*)$/);
  if (!match) return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  const idToken = match[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = { uid: decoded.uid, email: decoded.email, name: decoded.name || decoded.email };
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
