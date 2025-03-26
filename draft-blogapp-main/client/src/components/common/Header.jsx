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
  const [scrolled, setScrolled] = useState(false);

  // Toggle navbar collapse state
  const handleNavCollapse = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  // Track scroll position for animation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  // Yellow accent color variables
  const primaryYellow = '#FFD54F';
  const brightYellow = '#FFEB3B';
  const darkYellow = '#FFC107';

  return (
    <nav 
      className={`navbar navbar-expand-lg navbar-dark ${scrolled ? 'scrolled' : ''}`} 
      style={{ 
        backgroundColor: scrolled ? '#121212' : 'rgba(18, 18, 18, 0.85)', 
        backdropFilter: 'blur(8px)',
        transition: 'all 0.4s ease-in-out',
        boxShadow: scrolled ? `0 4px 20px rgba(255, 213, 79, 0.15)` : 'none'
      }}
    >
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <FaLeaf className="nav-logo me-2 logo-shine" style={{ 
            color: primaryYellow, 
          }} />
          <span className="brand-text" style={{ 
            color: primaryYellow, 
            letterSpacing: '0.8px', 
            fontWeight: 600,
            transition: 'all 0.3s ease',
            transform: scrolled ? 'scale(0.95)' : 'scale(1)'
          }}>BlogShore</span>
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

          {/* Mobile dropdown menu with animation */}
          <div 
            ref={menuRef}
            className={`mobile-menu ${isNavCollapsed ? 'collapsed' : 'expanded'}`}
            style={{ 
              backgroundColor: '#151515', 
              borderRadius: '8px', 
              boxShadow: `0 4px 20px rgba(255, 213, 79, 0.2)`,
              minWidth: '200px', 
              zIndex: 1000,
              transform: isNavCollapsed ? 'translateY(-10px)' : 'translateY(0)',
              opacity: isNavCollapsed ? 0 : 1,
              visibility: isNavCollapsed ? 'hidden' : 'visible',
              transition: 'all 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67)'
            }}
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
                        <span className="user-role badge" style={{ 
                          backgroundColor: 'rgba(255, 213, 79, 0.2)', 
                          color: primaryYellow, 
                          fontWeight: 500 
                        }}>
                          {currentUser?.role}
                        </span>
                        <span className="user-name ms-2 text-light">{user?.firstName}</span>
                      </div>
                    </div>
                  </li>
                  <li className="nav-item py-2">
                    <button 
                      onClick={handleSignOut} 
                      className="sign-out-btn btn btn-sm" 
                      style={{ 
                        backgroundColor: 'transparent', 
                        color: primaryYellow, 
                        border: `1px solid ${primaryYellow}`, 
                        borderRadius: '4px',
                        transition: 'all 0.3s ease'
                      }}
                    >
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
                  <NavLink to="/signin" className="nav-link text-light hover-shine">
                    Sign In
                  </NavLink>
                </li>
                <li className="nav-item ms-4">
                  <NavLink 
                    to="/signup" 
                    className="nav-link btn btn-sm px-4 py-2 text-dark fw-medium golden-btn"
                    style={{ 
                      background: `linear-gradient(135deg, ${brightYellow}, ${darkYellow})`, 
                      borderRadius: '4px', 
                      transition: 'all 0.3s ease'
                    }}
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
                      <span className="user-role badge" style={{ 
                        backgroundColor: 'rgba(255, 213, 79, 0.2)', 
                        color: primaryYellow, 
                        fontWeight: 500,
                        transition: 'all 0.3s ease'
                      }}>
                        {currentUser?.role}
                      </span>
                      <span className="user-name ms-2 text-light">{user?.firstName}</span>
                    </div>
                  </div>
                </li>
                <li className="nav-item">
                  <button 
                    onClick={handleSignOut} 
                    className="sign-out-btn btn btn-sm px-3 py-1 gold-outline-btn"
                    style={{ 
                      backgroundColor: 'transparent', 
                      color: primaryYellow, 
                      border: `1px solid ${primaryYellow}`, 
                      borderRadius: '4px', 
                      transition: 'all 0.3s ease'
                    }}
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