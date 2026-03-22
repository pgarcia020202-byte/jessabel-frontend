import React, { useRef, useEffect } from 'react';
import { useFormValidation, createValidationSchema } from '../hooks/useFormValidation';
import { useApp } from '../contexts/AppContext';
import './Contact.css';

const Contact = () => {
  const { setLoading, setError, clearError } = useApp();
  const firstInputRef = useRef(null);

  // Validation schema
  const validationSchema = createValidationSchema({
    name: ['required', { type: 'minLength', params: [2] }],
    email: ['required', 'email'],
    message: ['required', { type: 'minLength', params: [10] }]
  });

  // Initial form values
  const initialValues = {
    name: '',
    email: '',
    message: ''
  };

  // Use custom form validation hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm
  } = useFormValidation(initialValues, validationSchema);

  // Auto-focus first input when component mounts
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  // Handle form submission
  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      clearError();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Form submitted:', formData);
      alert('Thank you for your message! I will get back to you soon.');
      resetForm();
      
      // Re-focus first input after reset
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }
    } catch (error) {
      setError('Failed to send message. Please try again.');
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page">
      <div className="container">
        <h2>Get In Touch</h2>
        
        {/* Contact Form Section */}
        <section className="contact-form-section">
          <h3>Send Me a Message</h3>
          <p>Have questions about art techniques, collaboration opportunities, or just want to connect? Fill out the form below and I'll get back to you soon!</p>
          
          <form className="contact-form" onSubmit={(e) => handleSubmit(e, onSubmit)}>
            <div className="form-group">
              <label htmlFor="name">Your Name:</label>
              <input 
                ref={firstInputRef}
                type="text" 
                id="name" 
                name="name" 
                placeholder="Enter your full name" 
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.name && errors.name ? 'error' : ''}
                disabled={isSubmitting}
              />
              {touched.name && errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address:</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="your.email@example.com" 
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.email && errors.email ? 'error' : ''}
                disabled={isSubmitting}
              />
              {touched.email && errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Your Message:</label>
              <textarea 
                id="message" 
                name="message" 
                rows="6" 
                placeholder="Share your thoughts, questions, or ideas..." 
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.message && errors.message ? 'error' : ''}
                disabled={isSubmitting}
              />
              {touched.message && errors.message && (
                <span className="error-message">{errors.message}</span>
              )}
            </div>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting || Object.keys(errors).length > 0}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </section>

        {/* Resources Table Section */}
        <section className="resources-section">
          <h3>Recommended Art Resources</h3>
          <p>Explore these valuable resources to enhance your artistic journey and knowledge.</p>
          
          <table className="resources-table">
            <thead>
              <tr>
                <th>Resource Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><a href="https://www.metmuseum.org" target="_blank" rel="noopener noreferrer">The Metropolitan Museum of Art</a></td>
                <td>World-class museum with extensive online collection and virtual tours of art from ancient to contemporary periods</td>
              </tr>
              <tr>
                <td><a href="https://www.khanacademy.org/humanities/art-history" target="_blank" rel="noopener noreferrer">Khan Academy Art History</a></td>
                <td>Free comprehensive courses covering art history, techniques, and analysis from prehistoric to modern art</td>
              </tr>
              <tr>
                <td><a href="https://www.artstation.com" target="_blank" rel="noopener noreferrer">ArtStation</a></td>
                <td>Professional platform for digital artists to showcase portfolios, learn from tutorials, and connect with industry professionals</td>
              </tr>
              <tr>
                <td><a href="https://www.drawingacademy.com" target="_blank" rel="noopener noreferrer">Drawing Academy</a></td>
                <td>Structured online courses teaching fundamental drawing skills, anatomy, perspective, and composition techniques</td>
              </tr>
              <tr>
                <td><a href="https://www.nga.gov" target="_blank" rel="noopener noreferrer">National Gallery of Art</a></td>
                <td>Free access to masterworks, educational resources, and virtual exhibitions featuring Western art from the Middle Ages to present</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* External Links Section */}
        <section className="external-links-section">
          <h3>Explore More</h3>
          <div className="link-cards">
            <div className="link-card">
              <h4>Museum of Modern Art</h4>
              <p>Discover contemporary and modern art collections, exhibitions, and educational programs.</p>
              <a href="https://www.moma.org" target="_blank" rel="noopener noreferrer" className="external-link">Visit MoMA →</a>
            </div>
            
            <div className="link-card">
              <h4>Skillshare Art Classes</h4>
              <p>Learn new techniques through thousands of online art classes taught by professional artists.</p>
              <a href="https://www.skillshare.com/browse/art" target="_blank" rel="noopener noreferrer" className="external-link">Explore Classes →</a>
            </div>
            
            <div className="link-card">
              <h4>Behance Creative Network</h4>
              <p>Connect with creative professionals, showcase your work, and find inspiration from global artists.</p>
              <a href="https://www.behance.net" target="_blank" rel="noopener noreferrer" className="external-link">Join Behance →</a>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="map-section">
          <h3>Visit Our Studio</h3>
          <p>Located in the heart of the creative district. Drop by for inspiration and collaboration!</p>
          <div className="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9476519598093!2d-73.99185368459395!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus" 
              width="100%" 
              height="400" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Studio location map">
            </iframe>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Contact;
