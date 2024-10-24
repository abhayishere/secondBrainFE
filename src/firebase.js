import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCVPtuOhIvh8YYVQAZjz-3h1k8C_o7dtVU",
    authDomain: "secondbrain-6ba99.firebaseapp.com",
    projectId: "secondbrain-6ba99",
    storageBucket: "secondbrain-6ba99.appspot.com",
    messagingSenderId: "1028353712124",
    appId: "1:1028353712124:web:343126ca15feaf1b12dc79",
    measurementId: "G-XWV9FW3LWD"
  };

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export default firebaseApp;
