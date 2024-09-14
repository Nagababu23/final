import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { db, storage } from '../../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './index.css';

const ProfileCreation = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser; // Get current authenticated user

  useEffect(() => {
    if (!currentUser) {
      navigate('/login'); // Redirect to login if no user is logged in
    }
  }, [currentUser, navigate]);

  const handleProfileImageChange = (event) => {
    setProfileImage(event.target.files[0]); // Get the selected file
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !role || !education || !skills || !profileImage) {
      alert('Please fill out all fields');
      return;
    }

    try {
      if (!currentUser) {
        throw new Error('User is not logged in');
      }

      const userId = currentUser.uid; // Use currentUser's UID

      // Upload the profile image to Firebase Storage
      const imageRef = ref(storage, `profileImages/${userId}/${profileImage.name}`);
      await uploadBytes(imageRef, profileImage);
      const profileImageUrl = await getDownloadURL(imageRef);

      // Store user profile details in the same Firestore document
      await setDoc(doc(db, 'users', userId), {
        username,
        role,
        education,
        skills: skills.split(',').map(skill => skill.trim()),
        profileImage: profileImageUrl,
        updatedAt: new Date()
      }, { merge: true }); // Use merge: true to update existing document

      console.log('Profile created and stored:', userId);
      navigate('/'); // Redirect to home page
    } catch (error) {
      setError(error.message);
      console.error('Profile creation error:', error);
    }
  };

  return (
    <div className="profile-creation-container">
      <div className="profile-creation-box">
        <h1 className="profile-creation-header">Create Your Profile</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="profile-creation-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <input
              type="text"
              id="role"
              placeholder="Role (e.g., Software Engineer)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="education">Education</label>
            <input
              type="text"
              id="education"
              placeholder="Education (e.g., Bachelor's in CS)"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="skills">Skills</label>
            <input
              type="text"
              id="skills"
              placeholder="Skills (comma-separated)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="profileImage">Profile Image</label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleProfileImageChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">Create Profile</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileCreation;
