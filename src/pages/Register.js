import React from 'react';
import { useFormValidation, createValidationSchema } from '../hooks/useFormValidation';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = React.useState('');
  const validationSchema = createValidationSchema({
    fullname: ['required', { type: 'minLength', params: [2] }],
    email: ['required', 'email'],
    password: ['required', { type: 'minLength', params: [8] }],
    confirmPassword: ['required'],
    gender: ['required'],
    accountType: ['required'],
    username: ['required', { type: 'minLength', params: [3] }],
    dob: ['required'],
    level: ['required'],
    terms: [(value) => value === true || 'You must agree to the terms and conditions']
  });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldError
  } = useFormValidation({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    accountType: '',
    username: '',
    dob: '',
    level: '',
    terms: false
  }, validationSchema);

  const onSubmit = async (formData) => {
    setSubmitError('');
    if (formData.password !== formData.confirmPassword) {
      setFieldError('confirmPassword', 'Passwords do not match');
      throw new Error('Passwords do not match');
    }

    try {
      await api.post('/api/auth/register', {
        name: formData.fullname,
        email: formData.email,
        password: formData.password
      });

      resetForm();
      navigate('/login');
    } catch (err) {
      setSubmitError(err?.message || 'Registration failed. Please try again.');
      throw err;
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched to show errors
    const allFields = Object.keys(values);
    allFields.forEach(field => {
      if (!touched[field]) {
        // Simulate blur event to trigger validation
        const fakeEvent = { target: { name: field } };
        handleBlur(fakeEvent);
      }
    });

    // Then submit with validation
    handleSubmit(onSubmit);
  };

  return (
    <main className="register-page">
      <div className="container">
        <div className="register-content">
          {/* Registration Info Section */}
          <section className="register-info">
            <h2>Join the ArtVision Community</h2>
            <img src="/assets/community-art.jpg" alt="Diverse group of artists collaborating on a colorful mural project" className="register-image" />
            
            <h3>What You'll Receive</h3>
            <p>By signing up for ArtVision updates, you'll gain exclusive access to a vibrant community of art enthusiasts and creators. Our members enjoy a variety of benefits designed to inspire and support your artistic journey.</p>
            
            <ul className="benefits-list">
              <li><strong>Monthly Newsletter:</strong> Curated art inspiration, featured artist spotlights, and upcoming exhibition announcements</li>
              <li><strong>Workshop Invitations:</strong> Early access to online and in-person creative workshops, masterclasses, and technique demonstrations</li>
              <li><strong>Resource Library:</strong> Downloadable guides, color palettes, composition templates, and reference materials</li>
              <li><strong>Community Forum Access:</strong> Connect with fellow artists, share your work, receive constructive feedback, and collaborate on projects</li>
              <li><strong>Special Discounts:</strong> Exclusive offers on art supplies, online courses, and gallery exhibition opportunities</li>
            </ul>
            
            <p className="info-note">Whether you're just beginning to explore your creative side or you're an experienced artist looking to connect with like-minded individuals, our community welcomes all skill levels. Join us today and become part of a supportive network dedicated to artistic growth and expression.</p>
          </section>

          {/* Registration Form Section */}
          <section className="register-form-section">
            <h3>Create Your Account</h3>

            {submitError ? (
              <div className="error-message">{submitError}</div>
            ) : null}
            
            <form className="registration-form" onSubmit={handleFormSubmit}>
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="fullname">Full Name:</label>
                <input 
                  type="text" 
                  id="fullname" 
                  name="fullname" 
                  placeholder="Enter your full name" 
                  value={values.fullname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.fullname && touched.fullname ? 'error' : ''}
                />
                {errors.fullname && touched.fullname && (
                  <span className="error-message">{errors.fullname}</span>
                )}
              </div>
              
              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">Email Address:</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="Enter your email address" 
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.email && touched.email ? 'error' : ''}
                />
                {errors.email && touched.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>
              
              {/* Password */}
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="Create a strong password" 
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.password && touched.password ? 'error' : ''}
                />
                {errors.password && touched.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>
              
              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  placeholder="Re-enter your password" 
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.confirmPassword && touched.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <span className="error-message">{errors.confirmPassword}</span>
                )}
              </div>
              
              {/* Gender */}
              <div className="form-group">
                <label>Gender:</label>
                <div className="radio-group">
                  <div className="radio-option">
                    <input 
                      type="radio" 
                      id="male" 
                      name="gender" 
                      value="male" 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      checked={values.gender === 'male'}
                      className={errors.gender && touched.gender ? 'error' : ''}
                    />
                    <label htmlFor="male">Male</label>
                  </div>
                  <div className="radio-option">
                    <input 
                      type="radio" 
                      id="female" 
                      name="gender" 
                      value="female" 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      checked={values.gender === 'female'}
                    />
                    <label htmlFor="female">Female</label>
                  </div>
                  <div className="radio-option">
                    <input 
                      type="radio" 
                      id="other" 
                      name="gender" 
                      value="other" 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      checked={values.gender === 'other'}
                    />
                    <label htmlFor="other">Other</label>
                  </div>
                  <div className="radio-option">
                    <input 
                      type="radio" 
                      id="prefer-not-to-say" 
                      name="gender" 
                      value="prefer-not-to-say" 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      checked={values.gender === 'prefer-not-to-say'}
                    />
                    <label htmlFor="prefer-not-to-say">Prefer not to say</label>
                  </div>
                </div>
                {errors.gender && touched.gender && (
                  <span className="error-message">{errors.gender}</span>
                )}
              </div>
              
              {/* Account Type */}
              <div className="form-group">
                <label htmlFor="accountType">Account Type:</label>
                <select 
                  id="accountType" 
                  name="accountType" 
                  value={values.accountType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.accountType && touched.accountType ? 'error' : ''}
                >
                  <option value="">Select account type</option>
                  <option value="artist">Artist</option>
                  <option value="art-enthusiast">Art Enthusiast</option>
                  <option value="collector">Art Collector</option>
                  <option value="student">Art Student</option>
                  <option value="professional">Art Professional</option>
                </select>
                {errors.accountType && touched.accountType && (
                  <span className="error-message">{errors.accountType}</span>
                )}
              </div>
              
              {/* Username */}
              <div className="form-group">
                <label htmlFor="username">Preferred Username:</label>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  placeholder="Choose a unique username" 
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.username && touched.username ? 'error' : ''}
                />
                {errors.username && touched.username && (
                  <span className="error-message">{errors.username}</span>
                )}
              </div>
              
              {/* Date of Birth */}
              <div className="form-group">
                <label htmlFor="dob">Date of Birth:</label>
                <input 
                  type="date" 
                  id="dob" 
                  name="dob" 
                  value={values.dob}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.dob && touched.dob ? 'error' : ''}
                />
                {errors.dob && touched.dob && (
                  <span className="error-message">{errors.dob}</span>
                )}
              </div>
              
              {/* Interest Level Radio Buttons */}
              <div className="form-group">
                <label>Interest Category:</label>
                <div className="radio-group">
                  <div className="radio-option">
                    <input 
                      type="radio" 
                      id="beginner" 
                      name="level" 
                      value="beginner" 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      checked={values.level === 'beginner'}
                      className={errors.level && touched.level ? 'error' : ''}
                    />
                    <label htmlFor="beginner">Beginner - Just starting my art journey</label>
                  </div>
                  <div className="radio-option">
                    <input 
                      type="radio" 
                      id="intermediate" 
                      name="level" 
                      value="intermediate" 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      checked={values.level === 'intermediate'}
                    />
                    <label htmlFor="intermediate">Intermediate - Have some experience with art</label>
                  </div>
                  <div className="radio-option">
                    <input 
                      type="radio" 
                      id="expert" 
                      name="level" 
                      value="expert" 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      checked={values.level === 'expert'}
                    />
                    <label htmlFor="expert">Expert - Experienced artist or professional</label>
                  </div>
                </div>
                {errors.level && touched.level && (
                  <span className="error-message">{errors.level}</span>
                )}
              </div>
              
              {/* Terms Agreement Checkbox */}
              <div className="form-group checkbox-group">
                <input 
                  type="checkbox" 
                  id="terms" 
                  name="terms" 
                  checked={values.terms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.terms && touched.terms ? 'error' : ''}
                />
                <label htmlFor="terms">I agree to the Terms of Service and Privacy Policy</label>
                {errors.terms && touched.terms && (
                  <span className="error-message">{errors.terms}</span>
                )}
              </div>
              
              {/* Submit Button */}
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Complete Registration'}
              </button>
            </form>
            
            <p className="form-note">* All information will be kept confidential and used solely for community communications. We respect your privacy and will never share your data with third parties.</p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Register;
