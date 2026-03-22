import React, { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostsContext';
import './Posts.css';

const formatDateTime = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch (_) {
    return '';
  }
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath;
  // Otherwise, prepend the server URL
  return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imagePath}`;
};

const Posts = () => {
  const { user, isAuthenticated } = useAuth();
  const { posts, createPost, deletePost, addComment, deleteComment } = usePosts();

  const [postForm, setPostForm] = useState({
    title: '',
    tag: 'General',
    content: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [commentDrafts, setCommentDrafts] = useState({});
  const [error, setError] = useState('');

  const canCreate = isAuthenticated;

  const sortedPosts = useMemo(() => {
    const copy = [...posts];
    copy.sort((a, b) => {
      const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bd - ad;
    });
    return copy;
  }, [posts]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostForm((p) => ({ ...p, image: file }));
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPostForm((p) => ({ ...p, image: null }));
      setImagePreview('');
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setError('');
    if (!canCreate) return;

    const title = postForm.title.trim();
    const content = postForm.content.trim();
    const tag = postForm.tag.trim();

    if (!title || !content) return;

    try {
      await createPost({ title, content, tag, image: postForm.image });
      setPostForm({ title: '', tag: 'General', content: '', image: null });
      setImagePreview('');
      // Reset file input
      const fileInput = document.getElementById('post-image');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err?.message || 'Failed to create post');
    }
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    setError('');
    if (!isAuthenticated) return;

    const text = (commentDrafts[postId] || '').trim();
    if (!text) return;

    try {
      await addComment({ postId, text });
      setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));
    } catch (err) {
      setError(err?.message || 'Failed to add comment');
    }
  };

  const isAdmin = isAuthenticated && user?.role === 'admin';
  const canDeletePost = (post) => isAuthenticated && (post.authorId === user?._id || isAdmin);
  const canDeleteComment = (comment) => isAuthenticated && (comment.authorId === user?._id || isAdmin);

  return (
    <div className="posts-page">
      <div className="container">
        <section className="posts-hero">
          <h2>Posts</h2>
          <p>Create posts, comment, and manage your content</p>
        </section>

        <section className="posts-layout">
          <aside className="posts-card">
            <h3 className="posts-card-title">Create a Post</h3>
            {!isAuthenticated ? (
              <p className="posts-secondary-text">Please login to create posts and comments.</p>
            ) : null}

            <form className="posts-form" onSubmit={handleCreatePost}>
              <label htmlFor="post-title">Title</label>
              <input
                id="post-title"
                type="text"
                value={postForm.title}
                onChange={(e) => setPostForm((p) => ({ ...p, title: e.target.value }))}
                disabled={!canCreate}
              />

              <label htmlFor="post-tag">Tag</label>
              <select
                id="post-tag"
                value={postForm.tag}
                onChange={(e) => setPostForm((p) => ({ ...p, tag: e.target.value }))}
                disabled={!canCreate}
              >
                <option value="General">General</option>
                <option value="Training">Training</option>
                <option value="Match">Match</option>
                <option value="Tips">Tips</option>
              </select>

              <label htmlFor="post-content">Content</label>
              <textarea
                id="post-content"
                rows={5}
                value={postForm.content}
                onChange={(e) => setPostForm((p) => ({ ...p, content: e.target.value }))}
                disabled={!canCreate}
              />

              <label htmlFor="post-image">Image (Optional)</label>
              <input
                id="post-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={!canCreate}
              />
              {imagePreview && (
                <div style={{ marginTop: '1rem' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }}
                  />
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                    Selected: {postForm.image?.name}
                  </div>
                </div>
              )}
              {!imagePreview && postForm.image && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                  Selected: {postForm.image.name}
                </div>
              )}

              <div className="posts-actions">
                <button type="submit" className="posts-primary-btn" disabled={!canCreate}>
                  Post
                </button>
              </div>
            </form>

            {error ? <div className="posts-error">{error}</div> : null}
          </aside>

          <div className="posts-feed">
            {sortedPosts.length === 0 ? <p style={{ textAlign: 'center', opacity: 0.8 }}>No posts yet.</p> : null}

            {sortedPosts.map((post) => (
              <article key={post.id} className="post-item">
                <div className="post-item-header">
                  <div>
                    <div className="post-meta">
                      <span className="post-tag">{post.tag || 'General'}</span>
                      <span>{post.createdAt ? formatDateTime(post.createdAt) : ''}</span>
                    </div>
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-body">{post.content}</p>
                    
                    {post.image && (
                      <div className="post-image" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                        <img 
                          src={getImageUrl(post.image)} 
                          alt={post.title} 
                          style={{ 
                            maxWidth: '100%', 
                            height: 'auto', 
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0'
                          }} 
                        />
                      </div>
                    )}
                    
                    <p className="post-byline">
                      By <strong>{post.authorName || 'Unknown'}</strong>
                    </p>
                  </div>

                  {canDeletePost(post) ? (
                    <button type="button" className="post-danger-btn" onClick={() => deletePost({ postId: post.id })}>
                      Delete
                    </button>
                  ) : null}
                </div>

                <div className="post-comments">
                  <h4 style={{ margin: 0 }}>Comments ({(post.comments || []).length})</h4>

                  {(post.comments || []).length > 0 ? (
                    <div style={{ display: 'grid', gap: '0.65rem', marginTop: '0.85rem' }}>
                      {(post.comments || []).map((c) => (
                        <div key={c.id} className="comment-item">
                          <div className="comment-row">
                            <div>
                              <p className="comment-text">{c.text}</p>
                              <p className="comment-byline">
                                By <strong>{c.authorName || 'Unknown'}</strong>
                                {c.createdAt ? ` • ${formatDateTime(c.createdAt)}` : ''}
                              </p>
                            </div>

                            {canDeleteComment(c) ? (
                              <button
                                type="button"
                                className="post-plain-btn"
                                onClick={() => deleteComment({ postId: post.id, commentId: c.id })}
                              >
                                Delete
                              </button>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ opacity: 0.8, marginTop: '0.85rem' }}>No comments yet.</p>
                  )}

                  <form className="comment-form" onSubmit={(e) => handleAddComment(e, post.id)}>
                    <label htmlFor={`comment-${post.id}`} style={{ display: 'block', fontWeight: 800, marginBottom: '0.35rem' }}>
                      Add a comment
                    </label>
                    <textarea
                      id={`comment-${post.id}`}
                      rows={3}
                      value={commentDrafts[post.id] || ''}
                      onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                      disabled={!isAuthenticated}
                    />
                    <div className="posts-actions">
                      <button type="submit" className="posts-primary-btn" disabled={!isAuthenticated}>
                        Comment
                      </button>
                    </div>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Posts;
