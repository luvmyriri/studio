// Demo Firebase configuration that doesn't require actual Firebase setup
// This allows the app to run without Firebase credentials

export const isDemoMode = true;

// Mock Firebase objects for demo mode
export const auth = {
  currentUser: null,
  onAuthStateChanged: () => () => {},
  signInWithEmailAndPassword: () => Promise.reject(new Error('Demo mode: Firebase not connected')),
  createUserWithEmailAndPassword: () => Promise.reject(new Error('Demo mode: Firebase not connected')),
  signInWithPopup: () => Promise.reject(new Error('Demo mode: Firebase not connected')),
  signOut: () => Promise.resolve(),
  sendPasswordResetEmail: () => Promise.reject(new Error('Demo mode: Firebase not connected')),
  updateProfile: () => Promise.resolve(),
};

export const db = {
  collection: () => ({
    doc: () => ({
      get: () => Promise.resolve({ exists: false, data: () => null }),
      set: () => Promise.resolve(),
      update: () => Promise.resolve(),
    })
  }),
  doc: () => ({
    get: () => Promise.resolve({ exists: false, data: () => null }),
    set: () => Promise.resolve(),
    update: () => Promise.resolve(),
  })
};

export const storage = {};

export const googleProvider = {};

const app = {};
export default app;