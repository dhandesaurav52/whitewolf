

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, FirebaseStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;
let storage: FirebaseStorage | null = null;
let db: any;

if (firebaseConfig.apiKey && !getApps().length) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        storage = getStorage(app);
        db = getFirestore(app);
    } catch (error) {
        console.error("Firebase initialization error:", error);
    }
} else if (getApps().length > 0) {
    app = getApp();
    auth = getAuth(app);
    storage = getStorage(app);
    db = getFirestore(app);
} else {
    console.warn("Firebase API key is not defined. Firebase services will be disabled.");
}


// New function to upload files to Firebase Storage
const uploadFile = async (file: File, path: string): Promise<string> => {
    if (!storage) {
        throw new Error("Firebase Storage is not initialized. Please check your environment variables.");
    }
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
};

export { app, auth, storage, db, uploadFile };
