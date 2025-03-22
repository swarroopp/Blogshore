import React, { useContext, useState, useRef, useEffect } from 'react';
import { FaLeaf } from "react-icons/fa";
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import { userAuthorContextObj } from '../../contexts/UserAuthorContext';
import '../css/Header.css';

const Header = () => {
  const { signOut } = useClerk();
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const navigate = useNavigate();
  const { isSignedIn, user, isLoaded } = useUser();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);

  // Toggle navbar collapse state
  const handleNavCollapse = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          toggleRef.current && !toggleRef.current.contains(event.target)) {
        setIsNavCollapsed(true);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, toggleRef]);

  const handleSignOut = async () => {
    console.log("signout called");
    try {
      await signOut();
      setCurrentUser(null);
      localStorage.clear();
      navigate('/');
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#1A1E22', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <FaLeaf className="nav-logo me-2" style={{ color: '#4ADE80' }} />
          <span className="brand-text" style={{ color: '#4ADE80', letterSpacing: '0.8px', fontWeight: 600 }}>BlogShore</span>
        </Link>

        <div className="d-flex position-relative">
          <button 
            className="navbar-toggler border-0" 
            type="button" 
            onClick={handleNavCollapse}
            aria-controls="navbarNav"
            aria-expanded={!isNavCollapsed}
            aria-label="Toggle navigation"
            ref={toggleRef}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Mobile dropdown menu */}
          <div 
            ref={menuRef}
            className={`mobile-menu ${isNavCollapsed ? 'collapsed' : 'expanded'}`}
            style={{ backgroundColor: '#222930', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', minWidth: '200px', zIndex: 1000 }}
          >
            <ul className="navbar-nav">
              {!isSignedIn ? (
                <>
                  <li className="nav-item py-2">
                    <NavLink to="/signin" className="nav-link text-light" onClick={() => setIsNavCollapsed(true)}>
                      Sign In
                    </NavLink>
                  </li>
                  <li className="nav-item py-2">
                    <NavLink to="/signup" className="nav-link text-light" onClick={() => setIsNavCollapsed(true)}>
                      Sign Up
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item py-2">
                    <div className="user-info">
                      <div className="d-flex align-items-center">
                        <span className="user-role badge" style={{ backgroundColor: 'rgba(74, 222, 128, 0.2)', color: '#4ADE80', fontWeight: 500 }}>
                          {currentUser?.role}
                        </span>
                        <span className="user-name ms-2 text-light">{user?.firstName}</span>
                      </div>
                    </div>
                  </li>
                  <li className="nav-item py-2">
                    <button onClick={handleSignOut} className="sign-out-btn btn btn-sm" 
                      style={{ backgroundColor: 'transparent', color: '#4ADE80', border: '1px solid #4ADE80', borderRadius: '4px' }}>
                      Sign Out
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Desktop menu */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">
            {!isSignedIn ? (
              <>
                <li className="nav-item ms-4">
                  <NavLink to="/signin" className="nav-link text-light hover-green">
                    Sign In
                  </NavLink>
                </li>
                <li className="nav-item ms-4">
                  <NavLink 
                    to="/signup" 
                    className="nav-link btn btn-sm px-4 py-2 text-dark fw-medium"
                    style={{ backgroundColor: '#4ADE80', borderRadius: '4px', transition: 'all 0.3s ease' }}
                  >
                    Sign Up
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-3">
                  <div className="user-info">
                    <div className="d-flex align-items-center">
                      <span className="user-role badge" style={{ backgroundColor: 'rgba(74, 222, 128, 0.2)', color: '#4ADE80', fontWeight: 500 }}>
                        {currentUser?.role}
                      </span>
                      <span className="user-name ms-2 text-light">{user?.firstName}</span>
                    </div>
                  </div>
                </li>
                <li className="nav-item">
                  <button 
                    onClick={handleSignOut} 
                    className="sign-out-btn btn btn-sm px-3 py-1"
                    style={{ backgroundColor: 'transparent', color: '#4ADE80', border: '1px solid #4ADE80', borderRadius: '4px', transition: 'all 0.3s ease' }}
                  >
                    Sign Out
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
