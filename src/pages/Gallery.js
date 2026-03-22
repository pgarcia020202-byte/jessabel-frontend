import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useApp } from '../contexts/AppContext';
import './Gallery.css';

const Gallery = () => {
  const { category } = useParams();
  const { setLoading, setError } = useApp();
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Mock gallery data - in a real app, this would come from an API
  const galleryData = {
    paintings: [
      { id: 1, title: 'Sunset Dreams', artist: 'Jane Doe', year: 2023, image: '/assets/hero-art.jpg' },
      { id: 2, title: 'Ocean Waves', artist: 'John Smith', year: 2022, image: '/assets/hero-art.jpg' },
      { id: 3, title: 'Mountain Vista', artist: 'Sarah Johnson', year: 2023, image: '/assets/hero-art.jpg' }
    ],
    sculptures: [
      { id: 4, title: 'Modern Form', artist: 'Mike Wilson', year: 2023, image: '/assets/hero-art.jpg' },
      { id: 5, title: 'Abstract Shape', artist: 'Emily Brown', year: 2022, image: '/assets/hero-art.jpg' }
    ],
    digital: [
      { id: 6, title: 'Digital Dreams', artist: 'Alex Chen', year: 2023, image: '/assets/hero-art.jpg' },
      { id: 7, title: 'Cyber Art', artist: 'Lisa Wang', year: 2023, image: '/assets/hero-art.jpg' }
    ]
  };

  const categories = [
    { id: 'paintings', name: 'Paintings', count: galleryData.paintings.length },
    { id: 'sculptures', name: 'Sculptures', count: galleryData.sculptures.length },
    { id: 'digital', name: 'Digital Art', count: galleryData.digital.length }
  ];

  // Get current category items
  const currentCategory = category || 'paintings';
  const items = galleryData[currentCategory] || [];
  const categoryInfo = categories.find(cat => cat.id === currentCategory);

  // Simulate loading effect
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentCategory, setLoading]);

  // Handle image selection
  const handleImageClick = (item) => {
    setSelectedImage(item);
  };

  // Close modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="gallery-page">
      <div className="container">
        <h1>Art Gallery</h1>
        
        {/* Category Navigation */}
        <nav className="category-nav">
          <h2>Browse by Category</h2>
          <div className="category-tabs">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/gallery/${cat.id}`}
                className={`category-tab ${currentCategory === cat.id ? 'active' : ''}`}
              >
                {cat.name}
                <span className="count">({cat.count})</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Current Category Info */}
        <section className="category-info">
          <h2>{categoryInfo?.name || 'Gallery'}</h2>
          <p>Explore our collection of {items.length} beautiful {categoryInfo?.name?.toLowerCase() || 'artworks'}</p>
        </section>

        {/* Gallery Grid */}
        <section className="gallery-grid">
          {items.map(item => (
            <div
              key={item.id}
              className="gallery-item"
              onClick={() => handleImageClick(item)}
            >
              <div className="image-container">
                <img src={item.image} alt={item.title} />
                <div className="overlay">
                  <h3>{item.title}</h3>
                  <p>{item.artist}</p>
                  <span className="year">{item.year}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="empty-state">
            <h3>No artworks found</h3>
            <p>This category is currently empty. Check back soon for new additions!</p>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={closeModal}>×</button>
              <div className="modal-image">
                <img src={selectedImage.image} alt={selectedImage.title} />
              </div>
              <div className="modal-info">
                <h2>{selectedImage.title}</h2>
                <p className="artist">by {selectedImage.artist}</p>
                <p className="year">{selectedImage.year}</p>
                <div className="modal-actions">
                  <button className="btn-primary">View Details</button>
                  <button className="btn-secondary">Add to Favorites</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
