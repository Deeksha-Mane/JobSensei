# 🔒 Security Setup Guide

## ⚠️ IMPORTANT: API Keys Configuration

This project uses sensitive API keys that should NOT be committed to GitHub.

## 📋 Setup Instructions

### Step 1: Copy the Config Template
```bash
cp js/config.example.js js/config.js
```

### Step 2: Add Your API Keys
Open `js/config.js` and replace the placeholder values with your actual keys:

- **Firebase API Key**: Get from Firebase Console
- **YouTube API Key**: Get from Google Cloud Console
- **EmailJS Keys**: Get from EmailJS Dashboard

### Step 3: Verify .gitignore
Make sure `js/config.js` is listed in `.gitignore` (already done)

## 🔑 Where to Get API Keys

### Firebase
1. Go to https://console.firebase.google.com/
2. Select your project: `jobsensei-84540`
3. Go to Project Settings > General
4. Scroll to "Your apps" section
5. Copy the config object

### YouTube API
1. Go to https://console.cloud.google.com/
2. Enable YouTube Data API v3
3. Create credentials > API Key
4. Restrict the key to your domain

### EmailJS
1. Go to https://dashboard.emailjs.com/
2. Account > API Keys
3. Copy your Public Key
4. Get Service ID from Email Services
5. Get Template ID from Email Templates

## 🛡️ Security Best Practices

### Firebase Security
1. **Enable Domain Restrictions**:
   - Go to Firebase Console
   - Project Settings > General
   - Add your domain to authorized domains

2. **Set Firestore Rules**:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

### YouTube API Security
1. **Restrict API Key**:
   - Go to Google Cloud Console
   - Credentials > Edit API Key
   - Add HTTP referrers (your domain)
   - Set API restrictions to YouTube Data API v3

2. **Set Quota Limits**:
   - Monitor usage in Google Cloud Console
   - Set daily quota limits

### EmailJS Security
1. **Enable reCAPTCHA** (optional):
   - Go to EmailJS Dashboard
   - Enable reCAPTCHA for your template

2. **Limit Origins**:
   - Add allowed domains in EmailJS settings

## 📝 Files Structure

```
js/
├── config.js              # Your actual keys (NEVER COMMIT)
├── config.example.js      # Template (safe to commit)
└── [other js files]       # Import from config.js

.gitignore                 # Includes js/config.js
```

## ⚠️ If Keys Are Already Exposed

If you accidentally pushed keys to GitHub:

1. **Regenerate All Keys Immediately**:
   - Firebase: Create new web app
   - YouTube: Delete and create new API key
   - EmailJS: Regenerate public key

2. **Remove from Git History**:
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch js/config.js" \
   --prune-empty --tag-name-filter cat -- --all
   ```

3. **Force Push**:
   ```bash
   git push origin --force --all
   ```

## ✅ Checklist Before Pushing

- [ ] `js/config.js` is in `.gitignore`
- [ ] No API keys in any committed files
- [ ] `config.example.js` has placeholder values only
- [ ] Firebase domain restrictions enabled
- [ ] YouTube API key restricted to your domain

## 🚀 For Deployment

When deploying to production:

1. **Use Environment Variables**:
   - Vercel: Add in Project Settings > Environment Variables
   - Netlify: Add in Site Settings > Build & Deploy > Environment
   - GitHub Pages: Use GitHub Secrets

2. **Build Process**:
   - Environment variables are injected during build
   - Never expose keys in client-side code if possible

---

**Remember**: API keys in client-side code are always visible. Use backend for sensitive operations!
