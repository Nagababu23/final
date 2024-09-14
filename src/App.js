import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home'
import ProfileCreation from './components/Profile'
import ProfileCard from './components/ProfileCard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile-creation" element={<ProfileCreation />} />
        <Route path="/profile" element={<ProfileCard />} />
      </Routes>
    </Router>
  );
}

export default App;
