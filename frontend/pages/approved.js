
import { useState, useEffect } from 'react';
import axios from 'axios';

const Approved = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchApprovedImages();
  }, []);

  const fetchApprovedImages = async () => {
    try {
      const response = await axios.get('http://localhost:3001/images');
      const approvedImages = response.data.filter(image => image.status === 'Approved');
      setImages(approvedImages);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  return (
    <div>
      <h1>Approved Images</h1>
      <div>
        {images.map((image) => (
          <div key={image.id}>
            <img src={image.url} alt="Uploaded" width="200" />
            <p>URL: {image.url}</p>
            <p>JSON: {JSON.stringify(image.json)}</p>
            <p>Status: {image.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Approved;
