
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  projectId: "white-wolf-style-advisor",
  appId: "1:564592626382:web:47d6ba0d87a0088c3a1e9f",
  storageBucket: "white-wolf-style-advisor.appspot.com",
  apiKey: "AIzaSyBxzZ8xNDTBLi5pD0dap05yYeESskysmB0",
  authDomain: "white-wolf-style-advisor.firebaseapp.com",
  messagingSenderId: "564592626382",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const storage = getStorage(app);

// New function to upload files to Firebase Storage
const uploadFile = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
};

export { app, auth, storage, uploadFile };
