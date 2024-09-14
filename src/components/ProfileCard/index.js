import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase/firebase';
import './index.css';

const ProfileCard = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
        fetchProfileData(user.uid);
      } else {
        setError('User is not logged in');
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const fetchProfileData = async (userId) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfileData(docSnap.data());
      } else {
        setError('Profile not found');
      }
    } catch (error) {
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!profileData) {
    return <p>No profile data found</p>;
  }

  return (
    <div className="profile-card">
      <div className="profile_header" style={{ backgroundImage: `url(${profileData.coverImage || '/default-cover.jpg'})` }}>
        <img src={profileData.profileImage || '/default-avatar.png'} alt="Profile" className="profile_image" />
      </div>
      <div className="profile-details">
        <h2>{profileData.username || "Unknown User"}</h2>
        <p>{profileData.role || "No role provided"}</p>
        <p>{profileData.education || "No education details provided"}</p>
        <div className="profile-stats">
          <div className="stat">
            <span>2k</span>
            <p>Likes</p>
          </div>
          <div className="stat">
            <span>10k</span>
            <p>Followers</p>
          </div>
          <div className="stat">
            <span>15</span>
            <p>Projects</p>
          </div>
        </div>
        <button className="follow-btn">Follow</button>
      </div>
    </div>
  );
};

export default ProfileCard;
