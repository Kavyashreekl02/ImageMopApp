
import{ useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [images, setImages] = useState([]);
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');
  const [json, setJson] = useState('');
  const [showImages, setShowImages] = useState(false);

  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:3001/images');
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:3001/images', { url, status, json: JSON.parse(json) });
      
      setUrl('');
      setStatus('');
      setJson('');
    } catch (error) {
      console.error('Error creating image:', error);
    }
  };

  const handleFetchImages = async (event) => {
    event.preventDefault();
    await fetchImages();
  };

  return (
    <div>
      <h1>Image Manager</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>URL:</label><br></br>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          /><br></br>
        </div>
        <div>
          <label>Status:</label><br></br>
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          />
        </div>
        <div>
          <label>JSON:</label><br></br>
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">Post </button>
      </form>

      <h2>Image List</h2>
      <form onSubmit={handleFetchImages}>
        <button type="submit">Get</button>
      </form>
      <ul>
        {images.map((image) => (
          <li key={image.id}>
            <img src={image.url} alt="Uploaded" width="200" />
            <p>URL: {image.url}</p>
            <p>Status: {image.status}</p>
            <p>JSON: {JSON.stringify(image.json)}</p>
          </li>
        ))}
      </ul>
    </div>
    
  );
}
