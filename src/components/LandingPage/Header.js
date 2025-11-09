import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ onLoginClick, onSignupClick }) => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleAboutClick = () => {
    // Navigate to separate About Us page
    navigate('/about');
  };

  return (
    <header className="header">
      <div className="logo">
        <div className="logo-text">
          <span>boostly</span><span>AI</span>
        </div>
      </div>
      
      <nav className="nav">
        <ul>
          <li>
            <a href="#features" onClick={(e) => { 
              e.preventDefault(); 
              scrollToSection('features'); 
            }}>
              Features
            </a>
          </li>
          <li>
            <a href="#pricing" onClick={(e) => { 
              e.preventDefault(); 
              scrollToSection('pricing'); 
            }}>
              Pricing
            </a>
          </li>
          <li>
            <a href="#about" onClick={(e) => { 
              e.preventDefault(); 
              handleAboutClick(); 
            }}>
              About
            </a>
          </li>
          <li>
            <a href="#contact" onClick={(e) => { 
              e.preventDefault(); 
              scrollToSection('contact'); 
            }}>
              Contact
            </a>
          </li>
        </ul>
      </nav>
      
      <div className="header-buttons">
        <button className="btn btn-outline" onClick={onLoginClick}>Login</button>
        <button className="btn btn-primary" onClick={handleGetStarted}>Get Started</button>
      </div>
    </header>
  );
};

export default Header;