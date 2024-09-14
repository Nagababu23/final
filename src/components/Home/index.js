import React, { Component } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import PostPopup from '../Popup';
import ProfileCard from '../ProfileCard';
import './index.css';
import { getAuth } from 'firebase/auth';

class Home extends Component {
  state = {
    posts: [],
    showPopup: false,
    currentUser: null,
    view: 'publicPosts', // Default view
    following: {}, // To store follow state for each user
    savedPosts: {}, // To track saved posts
  };

  async componentDidMount() {
    await this.fetchPosts();
    this.getCurrentUser();
  }

  fetchPosts = async () => {
    const { view, currentUser } = this.state;
    let collectionRef;

    if (view === 'publicPosts') {
      collectionRef = collection(db, 'publicPosts');
    } else if (view === 'savedPosts' && currentUser) {
      collectionRef = collection(db, 'users', currentUser.uid, 'savedPosts');
    } else if (view === 'projects' && currentUser) {
      collectionRef = collection(db, 'users', currentUser.uid, 'posts');
    } else {
      return;
    }

    const postSnapshot = await getDocs(collectionRef);
    const posts = postSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    this.setState({ posts }, this.fetchFollowStatus);
  };

  getCurrentUser = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    this.setState({ currentUser });
  };

  fetchFollowStatus = async () => {
    const { currentUser } = this.state;
    if (!currentUser) return;

    const followingStatus = {};
    const followingCollectionRef = collection(db, 'users', currentUser.uid, 'following');
    const followingSnapshot = await getDocs(followingCollectionRef);

    followingSnapshot.forEach((doc) => {
      followingStatus[doc.id] = true;
    });

    this.setState({ following: followingStatus });
  };

  toggleFollow = async (post) => {
    const { currentUser, following } = this.state;

    if (!currentUser) {
      console.log('User not logged in');
      return;
    }

    const userToFollow = post.email;
    const userDocRef = doc(db, 'users', currentUser.uid, 'following', userToFollow);

    if (following[userToFollow]) {
      // Unfollow
      await updateDoc(userDocRef, {
        followed: false,
      });
      console.log(`Unfollowed ${userToFollow}`);
      this.setState((prevState) => ({
        following: { ...prevState.following, [userToFollow]: false }
      }));
    } else {
      // Follow
      await setDoc(userDocRef, {
        email: userToFollow,
        followed: true,
        followedAt: new Date()
      });
      console.log(`Followed ${userToFollow}`);
      this.setState((prevState) => ({
        following: { ...prevState.following, [userToFollow]: true }
      }));
    }
  };

  savePost = async (post) => {
    const { currentUser } = this.state;
    if (currentUser) {
      const userPostsCollection = collection(db, 'users', currentUser.uid, 'savedPosts');
      await addDoc(userPostsCollection, {
        ...post, 
        username: post.username || currentUser.displayName,
        email: post.email || currentUser.email
      });
      console.log('Post saved successfully');
      
      // Update saved posts state to reflect saved status
      this.setState((prevState) => ({
        savedPosts: { ...prevState.savedPosts, [post.id]: true }
      }));
    } else {
      console.log('No user is currently logged in');
    }
  };

  addPost = (newPost) => {
    this.setState((prevState) => ({
      posts: [newPost, ...prevState.posts],
    }));
  };

  togglePopup = () => {
    this.setState((prevState) => ({ showPopup: !prevState.showPopup }));
  };

  handleNavigation = (view) => {
    this.setState({ view }, this.fetchPosts); // Update view and fetch posts accordingly
  };

  render() {
    const { posts, showPopup, following, savedPosts } = this.state;
    return (
      <div className='home-container'>
        <Navbar />
        <Sidebar onNavigate={this.handleNavigation} />
        <div className='content-area'>
          <div className='feed-container'>
            {showPopup && <PostPopup closePopup={this.togglePopup} addPost={this.addPost} />}
            {posts.length > 0 ? posts.map((post, index) => (
              <div key={index} className="post-card">
                <div className="post-header">
                  <img src={post.profileImage || 'default-profile.png'} alt="Profile" className="profile-image"/>
                  <div className="post-user-info">
                    <h4>{post.username || 'Unknown User'}</h4>
                    <p>{post.email}</p>
                  </div>
                  <button
                    onClick={() => this.toggleFollow(post)}
                    className="follow-button"
                  >
                    {following[post.email] ? 'Unfollow' : 'Follow'}
                  </button>
                </div>
                <div className="post-content">
                  <p>{post.content}</p>
                </div>
                <div className="post-footer">
                  <p>Posted on: {new Date(post.createdAt.seconds * 1000).toLocaleDateString()}</p>
                  <button 
                    onClick={() => this.savePost(post)} 
                    className="save-button"
                  >
                    {savedPosts[post.id] ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            )) : <p>No posts available</p>}
          </div>
          <ProfileCard />
        </div>
      </div>
    );
  }
}

export default Home;
