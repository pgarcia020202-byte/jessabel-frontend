import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

const PostsContext = createContext();

export const usePosts = () => useContext(PostsContext);

const mapPost = (p, comments) => ({
  id: p._id,
  title: p.title,
  content: p.body,
  tag: p.tag,
  createdAt: p.createdAt,
  authorId: p.author?._id,
  authorName: p.author?.name,
  image: p.image,
  comments
});

const mapComment = (c) => ({
  id: c._id,
  text: c.body,
  createdAt: c.createdAt,
  authorId: c.author?._id,
  authorName: c.author?.name
});

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const rawPosts = await api.get('/api/posts');
        const postsWithComments = await Promise.all(
          rawPosts.map(async (p) => {
            const rawComments = await api.get(`/api/comments/${p._id}`);
            const comments = Array.isArray(rawComments) ? rawComments.map(mapComment) : [];
            return mapPost(p, comments);
          })
        );

        setPosts(postsWithComments);
      } catch (_) {
        setPosts([]);
      }
    };

    load();
  }, []);

  const createPost = async ({ title, content, tag, image }) => {
    let response;
  
    if (image) {
      // Create post with image using FormData
      const formData = new FormData();
      formData.append('title', title);
      formData.append('body', content);
      formData.append('tag', tag || 'General');
      formData.append('image', image);
      
      response = await api.post('/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } else {
      // Create post without image
      response = await api.post('/api/posts', { title, body: content, tag });
    }
  
    const mapped = mapPost(response, []);
    setPosts((prev) => [mapped, ...prev]);
    return mapped;
  };

  const deletePost = async ({ postId }) => {
    await api.del(`/api/posts/${postId}`);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const addComment = async ({ postId, text }) => {
    const created = await api.post(`/api/comments/${postId}`, { body: text });
    const comment = mapComment(created);

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [...(p.comments || []), comment] } : p))
    );

    return comment;
  };

  const deleteComment = async ({ postId, commentId }) => {
    await api.del(`/api/comments/${commentId}`);

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: (p.comments || []).filter((c) => c.id !== commentId) } : p
      )
    );
  };

  const value = useMemo(
    () => ({
      posts,
      createPost,
      deletePost,
      addComment,
      deleteComment
    }),
    [posts]
  );

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
};
