// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC-5Zoy13_vXKdusQnwNR8uSRz7VJP3dco",
  authDomain: "kimochiapp-a890e.firebaseapp.com",
  projectId: "kimochiapp-a890e",
  storageBucket: "kimochiapp-a890e.appspot.com",
  messagingSenderId: "811460673972",
  appId: "1:811460673972:web:f0c561a8a55b738af7b2e1",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
