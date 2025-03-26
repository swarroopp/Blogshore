import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { GiWaveSurfer } from "react-icons/gi";
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/SignIn.css';

const SignInPage = () => {
  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="logo-container">
            <GiWaveSurfer className="logo-icon" />
          </div>
          <h1 className="welcome-title">Blogshore</h1>
          <p className="welcome-subtitle">Ride the Waves of Your Thoughts</p>
          <div className="custom-card-container">
            <SignIn
              appearance={{
                baseTheme: 'dark',
                variables: {
                  colorPrimary: '#FFD700',
                  colorBackground: '#0A0A0E',
                  colorInputBackground: '#1E1E28',
                  colorText: '#E6E6E6',
                  colorTextSecondary: 'rgba(230, 230, 230, 0.7)',
                  colorDanger: '#FFC300',
                  borderRadius: '8px',
                },
                elements: {
                  formButtonPrimary: 'auth-button',
                  card: 'auth-card',
                  headerTitle: 'auth-title',
                  headerSubtitle: 'auth-subtitle',
                  socialButtonsBlockButton: 'social-button',
                  formFieldInput: 'auth-input',
                  footerActionLink: 'auth-link',
                  rootBox: 'cl-rootBox',
                  footer: 'hidden-footer'
                }
              }}
            />
            <div className="custom-footer">
              <p>Don't have an account? <Link to="/signup" className="custom-link">Set Sail</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;