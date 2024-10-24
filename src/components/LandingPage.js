// src/components/LandingPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import firebaseApp from '../firebase';
import './LandingPage.css'

const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

const LandingPage = () => {
  const navigate = useNavigate();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        window.postMessage({ action: "storeToken", message: idToken },"*");
        try {
          navigate('/home'); // Redirect to home after sign-in
        } catch (error) {
          setError('Error fetching user token');
          console.error('Error during token retrieval:', error);
        }
      } else {
        setIsSignedIn(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        const idToken = await user.getIdToken();
        console.log("User is logged in, whose details are", user)
        console.log("User's token is ", idToken)
        localStorage.setItem('firebaseToken', idToken)
        window.postMessage({ type: 'FIREBASE_TOKEN', token: idToken }, '*');
        navigate('/home');
      }
    } catch (error) {
      console.error('Error during sign-in/sign-up:', error);
    }
  };

  return (
    <div className="landing-container">
      <h1>Unlock your digital brain with SecondBrain</h1>
      <p>SecondBrain: Your ultimate knowledge hub! Organize, search, and unleash the power of your saved info with a smart search engine, writing assistant, and dynamic canvas. Elevate your productivity today!</p>
      {!isSignedIn && (
        <button onClick={handleSignInWithGoogle}>Continue with Google</button>
      )}
    </div>
  );
};

export default LandingPage;
