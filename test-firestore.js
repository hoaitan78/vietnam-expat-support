import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyByIY7VBlZk_e3VlrWsNI795yxbxBVXH18",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "vietnam-expat-support.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "vietnam-expat-support",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "vietnam-expat-support.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "117408462279",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:117408462279:web:3de94e5ca606c6ebe815e2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkAccess() {
    try {
        console.log("Fetching topics...");
        const topicsSnap = await getDocs(collection(db, 'topics'));
        console.log("Topics fetch success: " + topicsSnap.docs.length + " docs found.");

        console.log("Fetching replies for topic 1...");
        const repliesSnap = await getDocs(collection(db, 'topics', '1', 'replies'));
        console.log("Replies fetch success: " + repliesSnap.docs.length + " docs found.");
    } catch (e) {
        console.error("PERMISSION ERROR:", e.code || e.message);
    }
}

checkAccess();
