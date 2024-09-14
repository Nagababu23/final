import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa'; // Importing the icon for adding posts
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of withRouter
import PostPopup from '../Popup';
import './index.css';

const Navbar = () => {
  const [showPostPopup, setShowPostPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('User logged out');
    // Perform any other logout operations (like Firebase auth sign out if needed)

    // Navigate to the login page after logout
    navigate('/login');
  };

  const togglePostPopup = () => {
    setShowPostPopup(!showPostPopup);
  };

  return (
    <nav className="navbar">
      <div className="navbar-right">
        <button className="icon-button" onClick={togglePostPopup}>
          <FaPlus /> {/* Icon for adding new posts */}
        </button>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
        {showPostPopup && <PostPopup closePopup={togglePostPopup} />}
      </div>
    </nav>
  );
};

export default Navbar;
