# Firebase Integration Guide for AI Tender Guardian

## Current Status
✅ **MVP is fully functional** using FastAPI + MongoDB + Gemini AI

## Optional Firebase Integration

While the current MVP uses FastAPI backend with MongoDB, here's how to integrate Firebase if desired:

### 1. Create Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: `ai-tender-guardian`
4. Disable Google Analytics (optional for MVP)
5. Click "Create project"

### 2. Enable Required Services

#### a) Firestore Database
- In Firebase Console, go to **Build → Firestore Database**
- Click "Create database"
- Choose "Start in test mode" (for development)
- Select location closest to your users
- Click "Enable"

#### b) Firebase Storage
- Go to **Build → Storage**
- Click "Get started"
- Choose "Start in test mode"
- Click "Done"

### 3. Get Firebase Configuration

1. Go to **Project settings** (gear icon)
2. Scroll to "Your apps"
3. Click the web icon `</>`
4. Register app with nickname: `tender-guardian-web`
5. Copy the `firebaseConfig` object

### 4. Install Firebase SDK

```bash
cd /app/frontend
yarn add firebase
```

### 5. Create Firebase Config File

**File:** `/app/frontend/src/firebase-config.js`

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// ⚠️ PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
```

### 6. Firebase Cloud Functions Setup (Optional)

If you want to use Firebase Cloud Functions instead of FastAPI:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Functions
cd /app
firebase init functions
# Choose JavaScript or TypeScript
# Install dependencies: Yes
```

**File:** `/app/functions/index.js`

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');

admin.initializeApp();
const db = admin.firestore();

// Seal Bid Function
exports.sealBid = functions.https.onRequest(async (req, res) => {
  try {
    const { fileContent, tenderId } = req.body;
    
    // Encrypt with AES-256
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    
    let encrypted = cipher.update(fileContent, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Generate SHA-3-512 hash
    const hash = crypto.createHash('sha3-512');
    hash.update(encrypted);
    const bidHash = hash.digest('hex');
    
    // Generate bidder ID
    const bidderId = crypto.randomUUID();
    
    // Store in Firestore
    await db.collection('bids').add({
      tenderId,
      bidHash,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      bidderId,
      status: 'SEALED',
      encryptedData: encrypted,
      iv: iv.toString('hex')
    });
    
    res.json({
      success: true,
      bidHash,
      bidderId,
      message: 'Bid sealed successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deploy with: firebase deploy --only functions
```

### 7. Vertex AI Setup (for Gemini)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your Firebase project
3. Enable **Vertex AI API**:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Vertex AI API"
   - Click "Enable"

4. Create Service Account:
   - Go to "IAM & Admin" → "Service Accounts"
   - Click "Create Service Account"
   - Name: `vertex-ai-service`
   - Grant role: "Vertex AI User"
   - Click "Done"
   - Create and download JSON key

5. Add to Firebase Functions environment:
```bash
firebase functions:config:set vertex.key="$(cat service-account-key.json)"
```

### 8. Current Implementation (What's Already Working)

The current MVP already provides all the functionality you need:

✅ **Bid Sealing Engine**
- AES-256 encryption
- SHA-3-512 hashing
- Metadata storage in MongoDB

✅ **AI Compliance Checker**
- Google Gemini 3 Flash integration
- Using Emergent LLM Key
- Real-time compliance analysis

✅ **Immutable Audit Log**
- Complete bid history
- Tamper-proof records
- Timestamp ordered

✅ **n8n Webhook Endpoint**
- `/api/tender-update`
- SHA-256 hash generation
- Ready for workflow integration

### 9. Migration Path (If Needed)

To migrate from current MongoDB to Firestore:

1. Export existing data:
```bash
mongoexport --db test_database --collection bids --out bids.json
```

2. Import to Firestore using Firebase Admin SDK
3. Update backend API endpoints to use Firestore
4. Update CORS and environment variables

### 10. Recommended Approach

**For Hackathon/MVP:** ✅ Keep current FastAPI + MongoDB setup
- Faster development
- Easier debugging
- Full Python ecosystem
- Gemini integration already working

**For Production:** Consider Firebase
- Serverless scaling
- Built-in authentication
- Integrated analytics
- Managed infrastructure

## Environment Variables Reference

### Current Backend (.env)
```
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
CORS_ORIGINS="*"
EMERGENT_LLM_KEY=sk-emergent-1A8F55f96Fd501e86F
ENCRYPTION_KEY=dev_aes_256_key_32_bytes_long_12345678901234567890
```

### For Firebase (if migrating)
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
VERTEX_AI_PROJECT=your-gcp-project
VERTEX_AI_LOCATION=us-central1
```

## Testing Firebase Integration

```bash
# Test Firestore connection
curl -X POST https://your-region-your-project.cloudfunctions.net/sealBid \
  -H "Content-Type: application/json" \
  -d '{"fileContent":"test","tenderId":"TEST-001"}'

# Check Firestore in Console
# Go to Firestore Database in Firebase Console
# Verify 'bids' collection has the new entry
```

## Support

For Firebase issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guides](https://firebase.google.com/docs/firestore)
- [Cloud Functions Docs](https://firebase.google.com/docs/functions)

For Vertex AI:
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Generative AI on Vertex AI](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/overview)
