import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Profile.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Profile = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, setUserData } = useAuth();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setName(user?.name || '');
    setBio(user?.bio || '');
  }, [isAuthenticated, navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Name is required');
      return;
    }

    setIsSaving(true);

    try {
      const form = new FormData();
      form.append('name', trimmedName);
      form.append('bio', bio);
      if (profilePic) form.append('profilePic', profilePic);

      const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form
      });

      const text = await res.text();
      const data = text
        ? (() => {
            try {
              return JSON.parse(text);
            } catch (_) {
              return null;
            }
          })()
        : null;

      if (!res.ok) {
        const message = data?.message || 'Failed to update profile';
        throw new Error(message);
      }

      setUserData(data);
      setProfilePic(null);
    } catch (err) {
      setError(err?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const profilePicUrl = user?.profilePic ? `${API_BASE_URL}/uploads/${user.profilePic}` : '';
  const fallbackAvatar = '/assets/hero-art.jpg';

  return (
    <div className="profile-page">
      <div className="container">
        <section className="profile-hero">
          <h2>My Profile</h2>
          <p>Update your name, bio, and profile picture</p>
        </section>

        <section className="profile-card">
          <div className="profile-header">
            <div className="profile-ident">
              <img
                className="profile-avatar"
                src={profilePicUrl || user?.avatar || fallbackAvatar}
                alt="Profile"
              />
              <div>
                <p className="profile-name"><strong>{user?.name || 'Member'}</strong></p>
                <p className="profile-meta">{user?.email || ''}</p>
                <p className="profile-hint">Role: <strong>{user?.role || 'member'}</strong></p>
              </div>
            </div>
          </div>

          <form className="profile-form" onSubmit={handleSubmit}>
            <label htmlFor="profile-name">Name</label>
            <input id="profile-name" type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={isSaving} />

            <label htmlFor="profile-bio">Bio</label>
            <textarea id="profile-bio" rows={5} value={bio} onChange={(e) => setBio(e.target.value)} disabled={isSaving} />

            <label htmlFor="profile-pic">Profile Picture</label>
            <input
              id="profile-pic"
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
              disabled={isSaving}
            />

            {error ? <div className="profile-error">{error}</div> : null}

            <div className="profile-actions">
              <button type="submit" className="profile-primary-btn" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Profile;
