import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashPage.css';

const SplashScreen = () => {
  const [dotCount, setDotCount] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDotCount(prev => (prev + 1) % 4);
    }, 500);

    const timeout = setTimeout(() => {
      clearInterval(dotInterval);
      setFadeOut(true);
      
      setTimeout(() => {
        navigate('/home');
      }, 500);
    }, 3000);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="loading-page">
      <div className="art-elements">
        <div className="art-element">🎨</div>
        <div className="art-element">🖌️</div>
        <div className="art-element">🎭</div>
        <div className="art-element">🖼️</div>
      </div>

      <div className={`loader-container ${fadeOut ? 'fade-out' : ''}`}>
        <div className="logo">🎨</div>
        <h1>Welcome to ArtVision</h1>
        <p className="subtitle">Discover the World of Visual Art through painting, sculpture, digital media, and creative expression</p>
        <div className="spinner"></div>
        <div className="loading-text">
          Preparing your artistic journey<span className="dots">{`.`.repeat(dotCount)}</span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
