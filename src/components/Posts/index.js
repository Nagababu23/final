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

      // Save post in the 'posts' collection (user-specific)
      await addDoc(collection(db, 'posts'), {
        content: this.state.content,
        email: user.email,
        createdAt: new Date()
      });

      // Fetch additional user details from Firestore (username, profileImage)
      const userDocRef = doc(db, 'userProfiles', user.uid); // Use 'userProfiles' collection
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const { username, profileImage } = userDoc.data();

        // Save the post in the 'publicPosts' collection with user details
        await addDoc(collection(db, 'publicPosts'), {
          content: this.state.content,
          email: user.email,
          username: username || 'Unknown User',
          profileImage: profileImage || '', // Handle missing profile image case
          createdAt: new Date()
        });

        console.log('Post added to publicPosts and posts collections');
      } else {
        console.log('User details not found in Firestore');
      }

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
