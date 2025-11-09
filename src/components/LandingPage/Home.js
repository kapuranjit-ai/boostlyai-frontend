import React from 'react';
import './Hero.css';
import { useNavigate } from 'react-router-dom';
import { trialApi } from '../../services/api';

const Home = ({ onSignupClick }) => {
  const navigate = useNavigate();

  const handleStartTrial = async () => {
    const isLoggedIn = localStorage.getItem('token');
    
    if (isLoggedIn) {
      try {
        // User is logged in, start trial directly
        const response = await trialApi.startTrial();
        console.log('Trial started successfully:', response.data);
        navigate('/app'); // Redirect to main app
      } catch (error) {
        console.error('Failed to start trial:', error);
        // Optionally show error message to user
        alert('Failed to start trial. Please try again.');
      }
    } else {
      // User not logged in, use the prop passed from parent
      if (onSignupClick) {
        onSignupClick();
      } else {
        navigate('/register');
      }
    }
  };

  const handleWatchDemo = () => {
    // You can implement demo video functionality here
    console.log('Watch demo clicked');
    // Optionally navigate to demo page or open modal
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Smarter SEO. <span>Stronger Social.</span> Powered by AI.</h1>
        <p>Boostly AI is the all-in-one platform that helps you optimize content, analyze competitors, and grow your social media presence — powered by AI.</p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={handleStartTrial}>
            Start Free Trial
          </button>
          <button className="btn btn-secondary" onClick={handleWatchDemo}>
            Watch Demo
          </button>
        </div>
      </div>
      <div className="hero-image">
        <img 
          src="https://images.unsplash.com/photo-1533750349088-cd871a92f312?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
          alt="AI Analytics Dashboard" 
        />
      </div>
    </section>
  );
};

export default Home;