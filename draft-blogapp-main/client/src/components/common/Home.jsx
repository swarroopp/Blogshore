import { useContext, useEffect, useState } from "react";
import { userAuthorContextObj } from "../../contexts/UserAuthorContext";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { Palette, Layout, Mouse } from "lucide-react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { SiClerk } from "react-icons/si";
import { FaGithub } from "react-icons/fa";
import { Shield, PenSquare, User, Users } from "lucide-react";
import {
  FaUserAstronaut,
  FaUserEdit,
  FaReact,
  FaNodeJs,
  FaChartLine,
  FaPen,
  FaBook,
  FaUsers,
  FaShieldAlt,
} from "react-icons/fa";
import { SiMongodb, SiExpress, SiTailwindcss } from "react-icons/si";
import "../css/Home.css";

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { isSignedIn, user, isLoaded } = useUser();
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [processingRole, setProcessingRole] = useState(false);
  const navigate = useNavigate();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("swaroopmallidi7777@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  async function onSelectRole(e) {
    setError("");
    setProcessingRole(true);
    const selectedRole = e.target.value;
    let tempUser = { ...currentUser, role: selectedRole };
    console.log("Selected role:", selectedRole);
    
    try {
      if (selectedRole === "admin") {
        const res = await axios.post(
          `http://localhost:3000/admin-api/users-authors`,
          tempUser
        );
        const { message, payload } = res.data;
        
        if (message === "admin") {
          setCurrentUser({ ...tempUser, ...payload });
          localStorage.setItem("currentuser", JSON.stringify(payload));
        } else {
          setError("Invalid role. You don't have admin privileges.");
          resetRadioSelection();
        }
      }
      else if (selectedRole === "author") {
        const res = await axios.post(
          "http://localhost:3000/author-api/author",
          tempUser
        );
        const { message, payload } = res.data;
        
        if (message === "author") {
          if (!payload.isActive) {
            setError("Your author account is blocked. Please contact admin for assistance.");
            resetRadioSelection();
          } else {
            setCurrentUser({ ...tempUser, ...payload });
            localStorage.setItem("currentuser", JSON.stringify(payload));
          }
        } else {
          setError("Invalid role. You don't have author privileges.");
          resetRadioSelection();
        }
      }
      else if (selectedRole === "user") {
        const res = await axios.post(
          `http://localhost:3000/user-api/user`,
          tempUser
        );
        const { message, payload } = res.data;
        
        if (message === "user") {
          if (!payload.isActive) {
            setError("Your account is blocked. Please contact admin for assistance.");
            resetRadioSelection();
          } else {
            setCurrentUser({ ...tempUser, ...payload });
            localStorage.setItem("currentuser", JSON.stringify(payload));
          }
        } else {
          setError("Invalid role. You don't have user privileges.");
          resetRadioSelection();
        }
      }
    } catch (err) {
      console.error("Role selection error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || "An error occurred. Please try again.");
      }
      resetRadioSelection();
    } finally {
      setProcessingRole(false);
    }
  }

  const resetRadioSelection = () => {
    const radios = document.querySelectorAll('input[name="role"]');
    radios.forEach(radio => {
      radio.checked = false;
    });
  };

  useEffect(() => {
    if (isSignedIn === true) {
      setCurrentUser({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        profileImageUrl: user.imageUrl,
      });
      
      setError("");
      resetRadioSelection();
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    if (!processingRole && error === "" && currentUser?.role) {
      if (currentUser.role === "user") {
        navigate(`/user-profile/${currentUser.email}`);
      }
      else if (currentUser.role === "author") {
        navigate(`/author-profile/${currentUser.email}`);
      }
      else if (currentUser.role === "admin") {
        navigate(`/admin-profile/${currentUser.email}`);
      }
    }
  }, [currentUser, processingRole, error, navigate]);

  return (
    <div className="home-container">
      {isSignedIn === false && (
        <div className="wave-homepage">
          <div className="wave-header">
            <h1>
              Craft Your <span className="gradient-text">Digital Wave</span>
            </h1>
            <p>
              Ride the currents of creativity, where every blog post 
              is a wave of inspiration crashing onto the digital shore.
            </p>
            <NavLink to="/signup" className="wave-cta">
              Start Your Journey
            </NavLink>
          </div>

          <div className="wave-stats">
            <div className="wave-stat-grid">
              <div className="wave-stat-card">
                <Shield className="wave-stat-icon" />
                <h3>Admin</h3>
                <p>Navigating the Entire Sea</p>
              </div>

              <div className="wave-stat-card">
                <PenSquare className="wave-stat-icon" />
                <h3>Author</h3>
                <p>Crafting Waves of Content</p>
              </div>

              <div className="wave-stat-card">
                <User className="wave-stat-icon" />
                <h3>Reader</h3>
                <p>Surfing Knowledge Currents</p>
              </div>
            </div>
          </div>

          <div className="wave-features">
            <h2>
              Features that <span className="gradient-text">Ride the Tide</span>
            </h2>
            <div className="wave-feature-grid">
              <div className="wave-feature-card">
                <div className="wave-icon-wrapper">
                  <Palette className="wave-feature-icon" />
                </div>
                <h3>Fluid Design</h3>
                <p>
                  Responsive interfaces that flow seamlessly across 
                  devices like waves across the ocean.
                </p>
              </div>

              <div className="wave-feature-card">
                <div className="wave-icon-wrapper">
                  <Layout className="wave-feature-icon" />
                </div>
                <h3>Dynamic Layouts</h3>
                <p>
                  Adaptive designs that shift and move with 
                  the rhythms of your content.
                </p>
              </div>

              <div className="wave-feature-card">
                <div className="wave-icon-wrapper">
                  <Mouse className="wave-feature-icon" />
                </div>
                <h3>Interactive Currents</h3>
                <p>
                  Engaging interactions that make navigating 
                  content feel like riding a perfect wave.
                </p>
              </div>
            </div>
          </div>

          <div className="wave-tech-stack">
            <h2>Technologies Powering Our Digital Tide</h2>
            <div className="wave-tech-grid">
              {[
                { Icon: FaReact, name: "React" },
                { Icon: SiMongodb, name: "MongoDB" },
                { Icon: FaNodeJs, name: "Node.js" },
                { Icon: SiExpress, name: "Express" },
                { Icon: SiClerk, name: "Clerk" },
                { Icon: FaGithub, name: "GitHub" }
              ].map(({ Icon, name }, index) => (
                <div key={index} className="wave-tech-item">
                  <Icon className="wave-tech-icon" />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="wave-contact">
            <button
              className={`wave-contact-button ${copied ? "copied" : ""}`}
              onClick={handleCopyEmail}
            >
              swaroopmallidi7777@gmail.com
              {copied && <span className="copied-badge">Copied!</span>}
            </button>
          </div>
        </div>
      )}

      {isSignedIn === true && (
        <div className="user-section">
          <div className="profile-card">
            <div className="profile-header">
              <img
                src={user.imageUrl}
                className="profile-image"
                alt="Profile"
              />
              <div className="profile-info">
                <h2 className="display-6">{user.firstName}</h2>
                <p className="email">{user.emailAddresses[0].emailAddress}</p>
              </div>
            </div>

            <div className="role-selection">
              <h3 className="text-center mb-4">Select Your Role</h3>
              {error.length !== 0 && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {processingRole && (
                <div className="text-center mb-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              <div className="role-options">
                <div className="role-card">
                  <input
                    type="radio"
                    name="role"
                    id="admin"
                    value="admin"
                    className="role-input"
                    onChange={onSelectRole}
                    disabled={processingRole}
                  />
                  <label htmlFor="admin" className="role-label">
                    <FaShieldAlt className="role-icon" />
                    <span>Admin</span>
                  </label>
                </div>
                
                <div className="role-card">
                  <input
                    type="radio"
                    name="role"
                    id="author"
                    value="author"
                    className="role-input"
                    onChange={onSelectRole}
                    disabled={processingRole}
                  />
                  <label htmlFor="author" className="role-label">
                    <FaUserEdit className="role-icon" />
                    <span>Author</span>
                  </label>
                </div>

                <div className="role-card">
                  <input
                    type="radio"
                    name="role"
                    id="user"
                    value="user"
                    className="role-input"
                    onChange={onSelectRole}
                    disabled={processingRole}
                  />
                  <label htmlFor="user" className="role-label">
                    <FaUserAstronaut className="role-icon" />
                    <span>Reader</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;