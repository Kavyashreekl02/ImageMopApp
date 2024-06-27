import { useState, useEffect } from 'react';
import axios from 'axios';

const Rejected = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchRejectedImages();
  }, []);

  const fetchRejectedImages = async () => {
    try {
      const response = await axios.get('http://localhost:3001/product');
      const rejectedImages = response.data.filter(image => image.status === 'Rejected');
      setImages(rejectedImages);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  return (
    <div>
      <h1>Rejected Images</h1>
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

export default Rejected;
