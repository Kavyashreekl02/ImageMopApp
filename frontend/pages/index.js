import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showProducts, setShowProducts] = useState(false);
  const [rejectedProducts, setRejectedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/products');
      setProducts(response.data);
      setSelectedProduct(response.data[0]); // Select the first product by default
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filterProducts = (products) => {
    const approved = products.filter(product => product.status === 'Approved');
    const rejected = products.filter(product => product.status === 'Rejected');
    const reviewLater = products.filter(product => product.status === 'ReviewLater');
    
    setApprovedProducts(approved);
    setRejectedProducts(rejected);
    setReviewLaterProducts(reviewLater);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:3001/products/${id}`, { status: newStatus });
      fetchProducts();
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  const handleReject = async (id) => {
    const confirmReject = window.confirm('Are you sure you want to reject this product?');
    if (confirmReject) {
      try {
        await handleStatusUpdate(id, 'Rejected');
        const rejectedProduct = products.find(product => product.id === id);
        setRejectedProducts([...rejectedProducts, { ...rejectedProduct, date: new Date().toLocaleString() }]);
      } catch (error) {
        console.error('Error rejecting product:', error);
      }
    }
  };

  const handleApprove = async (id) => {
    await handleStatusUpdate(id, 'Approved');
  };

  const handleReviewLater = async (id) => {
    await handleStatusUpdate(id, 'ReviewLater');
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % products.length;
    setSelectedProduct(products[nextIndex]);
    setCurrentIndex(nextIndex);
  };

  const handlePrevious = () => {
    const previousIndex = (currentIndex - 1 + products.length) % products.length;
    setSelectedProduct(products[previousIndex]);
    setCurrentIndex(previousIndex);
  };

  const handleAnalyse = async () => {
    await fetchProducts();
    setShowProducts(true);
  };

  const handleApprove = async (id) => {
    await handleStatusUpdate(id, 'Approved');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: 'white', minHeight: '100vh' }}>
      <h1 style={{ color: 'yellow', fontWeight: 'bold', marginTop: 0 }}>INHABITR</h1>
      <hr style={{ borderColor: '#ddd', width: '100%', marginBottom: '20px' }} />
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <p style={{ fontSize: '14px' }}>CREATE SHORTCUT</p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ fontSize: '14px', marginRight: '20px' }}>↑ Key Saves the Updated Product Metadata</p>
          <p style={{ fontSize: '14px' }}>↓ Key Deletes Current Product</p>
        </div>
      </div>
      
      <hr style={{ borderColor: '#ddd', width: '100%', marginBottom: '20px' }} />

      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '10px' }}>
        <button 
          type="button" 
          onClick={handleAnalyse} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: 'white', 
            color: 'black', 
            border: '1px solid white', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            marginRight: '10px' 
          }}
        >
          Analyse
        </button>
        <button 
          type="button" 
          onClick={() => setShowProducts(true)} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: 'white', 
            color: 'black', 
            border: '1px solid white', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            marginRight: '10px' 
          }}
        >
          Approved
        </button>
        <button 
          type="button" 
          onClick={() => setShowProducts(false)} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: 'white', 
            color: 'black', 
            border: '1px solid white', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            marginRight: '10px' 
          }}
        >
          Review Later
        </button>
        <button 
          type="button" 
          onClick={() => setShowProducts(false)} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: 'white', 
            color: 'black', 
            border: '1px solid white', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Rejected
        </button>
      </div>

      {showProducts && (
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px', position: 'relative' }}>
          <div style={{ width: '60%', minWidth: '300px', overflow: 'hidden' }}>
            {selectedProduct && (
              <div style={{ border: '1px solid #ddd', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', minHeight: '400px', position: 'relative' }}>
                <img src={selectedProduct.product_image_uri} alt="Product" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }} />
                <div 
                  style={{ 
                    position: 'absolute', 
                    bottom: '10px', 
                    right: '10px', 
                    display: 'flex', 
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <button
                    onClick={() => handleApprove(selectedProduct.id)}
                    style={{ 
                      padding: '10px 20px', 
                      backgroundColor: '#32cd32', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer', 
                      marginRight: '10px',
                      transition: 'background-color 0.3s ease',
                      ':hover': {
                        backgroundColor: 'white',
                        color: '#32cd32',
                      }
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedProduct.id)}
                    style={{ 
                      padding: '10px 20px', 
                      backgroundColor: '#ff4500', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease',
                      ':hover': {
                        backgroundColor: 'white',
                        color: '#ff4500',
                      }
                    }}
                  >
                    Reject
                  </button>
                </div>
                <div style={{ position: 'absolute', bottom: '10px', left: '10px', display: 'flex', alignItems: 'flex-end' }}>
                  <button 
                    type="button" 
                    onClick={handlePrevious}
                    style={{ 
                      padding: '10px 20px', 
                      backgroundColor: '#1e90ff', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer', 
                      marginRight: '10px',
                      display: showProducts ? 'block' : 'none' // Only display when showProducts is true
                    }}
                  >
                    Previous
                  </button>
                  <button 
                    type="button" 
                    onClick={handleNext}
                    style={{ 
                      padding: '10px 20px', 
                      backgroundColor: '#1e90ff', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer', 
                      display: showProducts ? 'block' : 'none' // Only display when showProducts is true
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
          <div style={{ width: '40%', minHeight: '400px', overflow: 'hidden' }}>
            {selectedProduct && (
              <div style={{ border: '1px solid #ddd', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', minHeight: '400px' }}>
                <h3>Product Details</h3>
                <div style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>
                  <p><strong>ID:</strong> {selectedProduct.id}</p>
                  <p><strong>Product ID:</strong> {selectedProduct.fdc_product_id}</p>
                  <p><strong>Name:</strong> {selectedProduct.name}</p>
                  <p><strong>Product Image URI:</strong> {selectedProduct.product_image_uri} </p>
                  <p><strong>Description:</strong> {selectedProduct.product_description}</p>
                  <p><strong>Dimensions:</strong> {selectedProduct.product_dimensions}</p>
                  <p><strong>Created At:</strong> {selectedProduct.created_at}</p>
                  <p><strong>Updated At:</strong> {selectedProduct.updated_at}</p>
                  <p><strong>Price:</strong> ${selectedProduct.price}</p>
                  <p><strong>Quantity:</strong> {selectedProduct.quantity}</p>
                  <p><strong>Status:</strong> {selectedProduct.status}</p>
                </div>
              </div>
            )}
          </div>
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