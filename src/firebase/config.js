// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: 'AIzaSyDbqnY2tWh0uA5AVR1bAHYJTiY8m_LqHgI',
   authDomain: 'miniblog-5295f.firebaseapp.com',
   projectId: 'miniblog-5295f',
   storageBucket: 'miniblog-5295f.firebasestorage.app',
   messagingSenderId: '612001623900',
   appId: '1:612001623900:web:97b4fb47957d8554dbdb99'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export { db, auth };
