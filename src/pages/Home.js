import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="floating-elements">
            <div className="floating-element element-1">🎨</div>
            <div className="floating-element element-2">🖌️</div>
            <div className="floating-element element-3">🎭</div>
            <div className="floating-element element-4">🖼️</div>
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">Welcome to ArtVision</div>
            <h1>Discover the World of <span className="gradient-text">Visual Art</span></h1>
            <p>Exploring creativity through painting, sculpture, digital media, and more. Join me on a journey through artistic expression and inspiration.</p>
            <div className="hero-actions">
              <Link to="/about" className="btn btn-primary">Explore My Journey</Link>
              <Link to="/contact" className="btn btn-secondary">Get Resources</Link>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="image-frame">
              <img src="/assets/hero-art.jpg" alt="Colorful abstract painting showcasing vibrant artistic expression" className="hero-image" />
              <div className="image-overlay"></div>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">10+</div>
                <div className="stat-label">Years of Experience</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Artworks Created</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Creative Passion</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <div className="scroll-text">Scroll to explore</div>
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Key Highlights Section */}
      <section className="highlights">
        <div className="container">
          <h2>Why Art Matters</h2>
          <ul className="highlights-list">
            <li>Art enables emotional expression and communication beyond words</li>
            <li>Creative processes enhance problem-solving and critical thinking skills</li>
            <li>Visual arts preserve cultural heritage and historical narratives</li>
            <li>Artistic practice promotes mindfulness and mental well-being</li>
            <li>Art challenges perspectives and inspires social change</li>
          </ul>
        </div>
      </section>

      {/* Preview Sections */}
      <section className="preview-sections">
        <div className="container">
          <div className="preview-card">
            <h3>My Artistic Journey</h3>
            <p>Learn about my personal connection to art, from childhood sketches to contemporary digital creations. Discover how art has shaped my perspective and creative development.</p>
            <a href="/about" className="btn">Read More</a>
          </div>
          
          <div className="preview-card">
            <h3>Resources & Inspiration</h3>
            <p>Access curated resources including art museums, online galleries, and educational platforms. Connect with a community of fellow art enthusiasts and creators.</p>
            <a href="/contact" className="btn">Get Resources</a>
          </div>
          
          <div className="preview-card">
            <h3>Join Our Community</h3>
            <p>Sign up to receive updates about art exhibitions, creative workshops, and inspiration delivered to your inbox. Whether you're a beginner or expert, there's something for everyone.</p>
            <a href="/register" className="btn">Sign Up</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
