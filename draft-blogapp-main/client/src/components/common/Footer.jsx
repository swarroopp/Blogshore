import React from 'react';
import { BsInstagram, BsLinkedin } from 'react-icons/bs';
import { FaGithub, FaAnchor } from "react-icons/fa";
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row justify-content-between align-items-center">
          {/* Left Column */}
          <div className="col-md-6 footer-left">
            <h2 className="brand-name"><FaAnchor className="footer-logo" /> BlogShore</h2>
            <p className="tagline">Where ideas wash ashore, one wave at a time</p>
            <div className="copyright">
              © 2025 BlogShore. All Rights Reserved.
            </div>
          </div>

          {/* Right Column */}
          <div className="col-md-6 footer-right">
            <div className="social-links">
              <a href="https://instagram.com/swaarroop" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <BsInstagram />
              </a>
              <a href="https://www.linkedin.com/in/swaroop-mallidi/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <BsLinkedin />
              </a>
              <a href="https://github.com/swarroopp" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FaGithub />
              </a>
            </div>
            
            <div className="project-links">
              <a href="/privacy-policy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/contact">Contact Us</a>
            </div>
            
            
          </div>
        </div>
      </div>
      
      {/* Wave decoration */}
      {/* <div className="footer-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="currentColor" fillOpacity="0.2" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,128C672,128,768,160,864,170.7C960,181,1056,171,1152,149.3C1248,128,1344,96,1392,80L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div> */}
    </footer>
  );
};

export default Footer;