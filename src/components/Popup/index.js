import React, { Component } from 'react';
import { db, auth } from '../../firebase/firebase'; // Import Firestore and Auth instance
import { doc, collection, addDoc, getDoc } from 'firebase/firestore'; // Firestore methods
import './index.css';

class PostPopup extends Component {
  state = {
    content: ''
  };

  handleChange = (event) => {
    this.setState({ content: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('User not logged in');
        return;
      }

      // Fetch additional user details from Firestore (username, profileImage)
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.log('User details not found in Firestore');
        return;
      }

      const { username, profileImage } = userDoc.data();

      const postData = {
        content: this.state.content,
        email: user.email,
        username: username || 'Unknown User',
        profileImage: profileImage || '', // Handle missing profile image case
        createdAt: new Date()
      };

      // Save post in the user's personal 'posts' collection
      await addDoc(collection(db, 'users', user.uid, 'posts'), postData);

      // Save the post in the 'publicPosts' collection with user details
      await addDoc(collection(db, 'publicPosts'), postData);

      console.log('Post added to publicPosts and user-specific posts collections');
      this.props.closePopup(); // Close the popup after submission
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  render() {
    return (
      <div className="overlay">
        <div className="post-popup">
          <form onSubmit={this.handleSubmit}>
            <textarea
              value={this.state.content}
              onChange={this.handleChange}
              placeholder="Write something..."
            />
            <button type="submit">Post</button>
            <button type="button" onClick={this.props.closePopup}>Cancel</button>
          </form>
        </div>
      </div>
    );
  }
}

export default PostPopup;
