import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api/client';

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const isAdmin = useMemo(() => isAuthenticated && user?.role === 'admin', [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isAdmin) {
      navigate('/home');
      return;
    }

    const load = async () => {
      setError('');
      setLoading(true);
      try {
        const [u, p] = await Promise.all([api.get('/api/admin/users'), api.get('/api/admin/posts')]);
        setUsers(Array.isArray(u) ? u : []);
        setPosts(Array.isArray(p) ? p : []);
      } catch (e) {
        setError(e?.message || 'Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isAuthenticated, isAdmin, navigate]);

  const updateUserStatus = async (id, status) => {
    setError('');
    try {
      const updated = await api.patch(`/api/admin/users/${id}/status`, { status });
      setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
    } catch (e) {
      setError(e?.message || 'Failed to update user');
    }
  };

  const updatePostStatus = async (id, status) => {
    setError('');
    try {
      const updated = await api.patch(`/api/admin/posts/${id}/status`, { status });
      setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    } catch (e) {
      setError(e?.message || 'Failed to update post');
    }
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Admin Dashboard</h2>
        <p style={{ textAlign: 'center', opacity: 0.8, marginTop: 0 }}>Manage members and moderate posts</p>

        {error ? (
          <div style={{ margin: '1rem auto', maxWidth: 900, color: '#e74c3c', fontWeight: 600, textAlign: 'center' }}>
            {error}
          </div>
        ) : null}

        {loading ? (
          <div style={{ maxWidth: 900, margin: '1.5rem auto 0 auto' }}>Loading...</div>
        ) : (
          <div style={{ maxWidth: 900, margin: '1.5rem auto 0 auto', display: 'grid', gap: '1.5rem' }}>
            <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '1rem' }}>
              <h3>Members</h3>
              {users.length === 0 ? <p style={{ opacity: 0.8 }}>No users found.</p> : null}

              <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
                {users.map((u) => (
                  <div
                    key={u._id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                      flexWrap: 'wrap',
                      border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: 10,
                      padding: '0.75rem 1rem'
                    }}
                  >
                    <div>
                      <p style={{ margin: 0 }}>
                        <strong>{u.name}</strong> ({u.email})
                      </p>
                      <p style={{ margin: '0.25rem 0 0', opacity: 0.8 }}>
                        Role: <strong>{u.role}</strong> • Status: <strong>{u.status}</strong>
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {u.status !== 'active' ? (
                        <button type="button" onClick={() => updateUserStatus(u._id, 'active')}>
                          Activate
                        </button>
                      ) : (
                        <button type="button" onClick={() => updateUserStatus(u._id, 'inactive')}>
                          Deactivate
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '1rem' }}>
              <h3>Posts moderation</h3>
              {posts.length === 0 ? <p style={{ opacity: 0.8 }}>No posts found.</p> : null}

              <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
                {posts.map((p) => (
                  <div
                    key={p._id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      flexWrap: 'wrap',
                      border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: 10,
                      padding: '0.75rem 1rem'
                    }}
                  >
                    <div style={{ minWidth: 260, flex: 1 }}>
                      <p style={{ margin: 0 }}>
                        <strong>{p.title}</strong>
                      </p>
                      <p style={{ margin: '0.25rem 0 0', opacity: 0.8 }}>
                        By <strong>{p.author?.name || 'Unknown'}</strong> • Status: <strong>{p.status}</strong>
                      </p>
                      <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{p.body}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {p.status !== 'removed' ? (
                        <button type="button" onClick={() => updatePostStatus(p._id, 'removed')}>
                          Remove
                        </button>
                      ) : (
                        <button type="button" onClick={() => updatePostStatus(p._id, 'published')}>
                          Restore
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
