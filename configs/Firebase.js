import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyC8p9avT5OfHlqnrZ_nEgBGe8ybojf7h4M',
    authDomain: 'travelapp-bf915.firebaseapp.com',
    projectId: 'travelapp-bf915',
    storageBucket: 'travelapp-bf915.appspot.com',
    messagingSenderId: '158335522328',
    appId: '1:158335522328:web:3fd23c879131ccb64e156d',
};

const app = initializeApp(firebaseConfig);

export const database = getFirestore();
