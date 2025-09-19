# Firebase Authentication Setup Instructions

## 🔥 Your Firebase Project is Ready!

**Project ID**: `bsoad-reviewer-480539400`  
**Project Name**: BSOAD Civil Service Reviewer  
**Console URL**: https://console.firebase.google.com/project/bsoad-reviewer-480539400/overview

---

## 📋 Step-by-Step Setup:

### 1. **Add Web App to Firebase Project**
1. Open [Firebase Console](https://console.firebase.google.com/project/bsoad-reviewer-480539400/overview)
2. Click "Add app" button → Select Web icon (`</>`)
3. **App nickname**: `BSOAD Civil Service Reviewer`
4. ✅ Check "Also set up Firebase Hosting for this app"
5. Click **"Register app"**

### 2. **Copy Your Firebase Configuration**
After registering, you'll see your config. Copy these values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "bsoad-reviewer-480539400.firebaseapp.com",
  projectId: "bsoad-reviewer-480539400",
  storageBucket: "bsoad-reviewer-480539400.appspot.com",
  messagingSenderId: "YOUR_ACTUAL_SENDER_ID", 
  appId: "YOUR_ACTUAL_APP_ID"
};
```

### 3. **Update Environment Variables**
Edit your `.env.local` file and replace with your actual values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bsoad-reviewer-480539400.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bsoad-reviewer-480539400
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bsoad-reviewer-480539400.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_app_id
```

### 4. **Enable Authentication**
1. In Firebase Console, go to **"Authentication"**
2. Click **"Get started"** 
3. Go to **"Sign-in method"** tab
4. **Enable Google Provider**:
   - Click on "Google"
   - Toggle "Enable" 
   - Add your email address
   - Click "Save"

### 5. **Configure Authorized Domains**
In the Authentication settings:
- **Production**: `bsoad-reviewer-480539400.web.app`
- **Development**: `localhost` (should already be there)

### 6. **Enable Firestore Database** (Optional but recommended)
1. Go to **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"**
4. Choose your preferred location

---

## 🚀 **After Setup**:

1. **Restart your development server**: `npm run dev`
2. **Test Google Sign-in** on your local app
3. **Deploy to production**: `npm run build && firebase deploy`

---

## ✅ **Verification Checklist**:
- [ ] Firebase project created
- [ ] Web app registered  
- [ ] Environment variables updated with real values
- [ ] Google authentication enabled
- [ ] Authorized domains configured
- [ ] Local development server restarted
- [ ] Google sign-in tested and working

---

## 🆘 **Troubleshooting**:

**"Auth domain not authorized"**: Make sure your domain is in the authorized domains list

**"Invalid API key"**: Double-check you copied the correct API key from Firebase Console

**"Google sign-in failed"**: Ensure the Google provider is enabled in Authentication settings

---

## 📞 **Next Steps**:
Once you've completed the setup, the Google authentication will work perfectly in your BSOAD Civil Service Exam Reviewer platform!