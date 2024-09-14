import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faProjectDiagram, faBookmark, faBell } from '@fortawesome/free-solid-svg-icons';
import './index.css';

class Sidebar extends Component {
  state = {
    activeView: 'publicPosts' // Default active view, set to 'Home'
  };

  handleNavigation = (view) => {
    this.setState({ activeView: view }); // Set the clicked view as active
    if (this.props.onNavigate) {
      this.props.onNavigate(view);
    }
  };

  render() {
    const { activeView } = this.state;

    return (
      <div className="sidebar">
        <h2 className="sidebar-title">Linker</h2>
        <ul className="sidebar-menu">
          <li className={`sidebar-item ${activeView === 'publicPosts' ? 'active' : ''}`}>
            <a href="#" onClick={() => this.handleNavigation('publicPosts')} className="sidebar-link">
              <FontAwesomeIcon icon={faHome} className="sidebar-icon" /> Home
            </a>
          </li>
          <li className={`sidebar-item ${activeView === 'projects' ? 'active' : ''}`}>
            <a href="#" onClick={() => this.handleNavigation('projects')} className="sidebar-link">
              <FontAwesomeIcon icon={faProjectDiagram} className="sidebar-icon" /> Projects
            </a>
          </li>
          <li className={`sidebar-item ${activeView === 'savedPosts' ? 'active' : ''}`}>
            <a href="#" onClick={() => this.handleNavigation('savedPosts')} className="sidebar-link">
              <FontAwesomeIcon icon={faBookmark} className="sidebar-icon" /> Saved Posts
            </a>
          </li>
          <li className={`sidebar-item ${activeView === 'notifications' ? 'active' : ''}`}>
            <a href="#" onClick={() => this.handleNavigation('notifications')} className="sidebar-link">
              <FontAwesomeIcon icon={faBell} className="sidebar-icon" /> Notifications
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

export default Sidebar;
