# ✅ GitHub Push Checklist

## Before Pushing to GitHub

### 1. Check .gitignore is Working
```bash
git status
```
Make sure `js/config.js` is NOT listed in changes.

### 2. Verify Sensitive Files
These files should be in `.gitignore`:
- ✅ `js/config.js` (contains actual keys)
- ✅ `.env` files
- ✅ `node_modules/`

### 3. Files Safe to Push
These files are SAFE to commit:
- ✅ `js/config.example.js` (template only)
- ✅ `.gitignore`
- ✅ All HTML, CSS files
- ✅ Other JS files (they import from config.js)

### 4. Test Locally First
```bash
# Make sure everything works
# Open your site locally and test all features
```

### 5. Add Files to Git
```bash
git add .
```

### 6. Check What Will Be Committed
```bash
git status
```
**STOP if you see `js/config.js` in the list!**

### 7. Commit
```bash
git commit -m "Updated homepage design and contact form"
```

### 8. Push to GitHub
```bash
git push origin main
```

## 🚨 Emergency: If You Accidentally Pushed Keys

### Immediate Actions:

1. **Regenerate ALL API Keys**:
   - Firebase: Create new web app
   - YouTube: Delete and create new key
   - EmailJS: Regenerate public key

2. **Remove from Git History**:
   ```bash
   # Remove config.js from all commits
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch js/config.js" \
   --prune-empty --tag-name-filter cat -- --all
   
   # Force push
   git push origin --force --all
   ```

3. **Update Local Config**:
   - Update `js/config.js` with new keys
   - Test everything works

## 📝 Current Status

### Files Created:
- ✅ `.gitignore` - Protects sensitive files
- ✅ `js/config.js` - Your actual keys (NOT in git)
- ✅ `js/config.example.js` - Template (safe to push)
- ✅ `SECURITY_SETUP.md` - Setup instructions
- ✅ `GITHUB_PUSH_CHECKLIST.md` - This file

### What's Protected:
- ✅ Firebase API Key
- ✅ YouTube API Key  
- ✅ EmailJS Keys
- ✅ All sensitive configuration

### What's Public:
- ✅ HTML/CSS files
- ✅ JavaScript files (they import from config.js)
- ✅ Template files
- ✅ Documentation

## 🎯 Quick Commands

```bash
# Check if config.js is ignored
git check-ignore js/config.js
# Should output: js/config.js

# See what will be committed
git status

# Add all files (config.js will be ignored)
git add .

# Commit
git commit -m "Your message"

# Push
git push origin main
```

## ✅ You're Ready to Push!

Your sensitive keys are now protected. Safe to push to GitHub! 🚀

---

**Note**: The `.gitignore` file will prevent `js/config.js` from being committed, but other developers will need to create their own `config.js` from the template.
