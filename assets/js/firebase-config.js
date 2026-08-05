// ============================================================
//   FIREBASE CONFIGURATION — Pal Grocery
//  ============================================================
//  SETUP GUIDE (Sirf ek baar karna hai):
//  
//  Step 1: https://console.firebase.google.com/ pe jao
//  Step 2: "Add project" click karo → Name: "pal-grocery" → Continue
//  Step 3: Google Analytics: disable karo → "Create project" click karo
//  Step 4: Project ready hone ke baad left sidebar me:
//          "Build" → "Realtime Database" click karo
//  Step 5: "Create Database" click karo
//          → Location: asia-southeast1 (Singapore — India ke paas)
//          → Start in TEST MODE (for now) → Enable
//  Step 6: Wapas Project Overview pe jao (gear icon ke paas ghar ka icon)
//  Step 7: "</>" (Web) icon click karo app register karne ke liye
//          → App nickname: "pal-grocery-web" → Register app
//  Step 8: Yahan dikhne wala firebaseConfig copy karo
//          aur neeche REPLACE karo
//  ============================================================

const firebaseConfig = {
  apiKey: "APNI_API_KEY_YAHAN_PASTE_KARO",
  authDomain: "APNA_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://APNA_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "APNA_PROJECT_ID",
  storageBucket: "APNA_PROJECT_ID.appspot.com",
  messagingSenderId: "APNA_MESSAGING_SENDER_ID",
  appId: "APNA_APP_ID"
};

// Firebase ko initialize karo
window.FIREBASE_CONFIG = firebaseConfig;
window.FIREBASE_READY = false;

// Check karo ki config set hui hai ya nahi
window.isFirebaseConfigured = function() {
  return !firebaseConfig.apiKey.includes("APNI_API_KEY");
};
