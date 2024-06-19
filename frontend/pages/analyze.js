import { useState, useEffect } from 'react';
import axios from 'axios';

const Analyze = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:3001/images');
      setImages(response.data);
      if (response.data.length > 0) {
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const updateImageStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:3001/images/${id}`, { status: newStatus });
      fetchImages();
    } catch (error) {
      console.error('Error updating image status:', error);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return <div>Loading images...</div>;
  }

  const currentImage = images[currentIndex];

  return (
    <div>
      <h1>Analyze Images</h1>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={currentImage.url} alt="Uploaded" width="200" />
        <div style={{ marginLeft: '20px' }}>
          <p>URL: {currentImage.url}</p>
          <p>JSON: {JSON.stringify(currentImage.json)}</p>
          <p>Status: {currentImage.status}</p>
          <button onClick={() => updateImageStatus(currentImage.id, 'Approved')}>Approve</button>
          <button onClick={() => {
            if (window.confirm('Are you sure you want to reject this image?')) {
              updateImageStatus(currentImage.id, 'Rejected');
            }
          }}>Reject</button>
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <button onClick={handlePrevious}>Previous</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default Analyze;
