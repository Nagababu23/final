import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import './index.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (email === '' || password === '') {
      alert('Please fill out all fields');
      return;
    }

    try {
      const userRef = doc(db, 'users', email);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        // If the user exists, sign in
        await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in:', email);
        navigate('/'); // Redirect to home on success
      } else {
        // If the user does not exist, create a new account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Add user details to Firestore users collection
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          createdAt: new Date(),
          // Additional fields can be added here
        });

        console.log('User created and stored:', user.uid);
        navigate('/profile-creation', { state: { userId: user.uid } }); // Redirect to profile creation page
      }
    } catch (error) {
      setError(error.message);
      console.error('Authentication error:', error);
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Login;