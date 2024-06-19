<<<<<<< HEAD
import { useState, useEffect } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> 4b6bc45b348f99905d891a5f4d4833e101b8231f
import axios from 'axios';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
<<<<<<< HEAD
  const [showImages, setShowImages] = useState(false);
  const [rejectedImages, setRejectedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);
=======
  const [view, setView] = useState('all'); // 'all', 'approved', 'rejected', 'reviewLater'
  const [rejectedProducts, setRejectedProducts] = useState([]);
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [reviewLaterProducts, setReviewLaterProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewMode, setReviewMode] = useState(false); // New state for review mode
>>>>>>> 4b6bc45b348f99905d891a5f4d4833e101b8231f

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
<<<<<<< HEAD
      const response = await axios.get('http://localhost:3001/images');
      setImages(response.data);
      setSelectedImage(response.data[0]); // Select the first image by default
=======
      const response = await axios.get('http://localhost:3001/products');
      setProducts(response.data);
      setSelectedProduct(response.data[0]); // Select the first product by default
      filterProducts(response.data);
>>>>>>> 4b6bc45b348f99905d891a5f4d4833e101b8231f
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
<<<<<<< HEAD
        const rejectedImage = images.find(image => image.id === id);
        setRejectedImages([...rejectedImages, { ...rejectedImage, date: new Date().toLocaleString() }]);
      } catch (error) {
        console.error('Error rejecting image:', error);
=======
      } catch (error) {
        console.error('Error rejecting product:', error);
>>>>>>> 4b6bc45b348f99905d891a5f4d4833e101b8231f
      }
    }
  };

<<<<<<< HEAD
  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
    setCurrentIndex(nextIndex);
  };

  const handlePrevious = () => {
    const previousIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[previousIndex]);
    setCurrentIndex(previousIndex);
  };

  const handleAnalyse = async () => {
    await fetchImages();
    setShowImages(true);
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
          <p style={{ fontSize: '14px', marginRight: '20px' }}>↑ Key Saves the Updated Image Metadata</p>
          <p style={{ fontSize: '14px' }}>↓ Key Deletes Current Image</p>
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
=======
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

  const handleReviewAgain = (product) => {
    setSelectedProduct(product);
    setReviewMode(true); // Set review mode to true
  };

  const renderProductList = (productList) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
      {productList.map((product) => (
        <div key={product.id} style={{ width: '300px', border: '1px solid #ddd', padding: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <img src={product.product_image_uri} alt="Product" style={{ width: '100%', height: '150px', objectFit: 'contain' }} />
          <p><strong>Approved Date:</strong> {product.approved_date}</p>
          <div>
            <button onClick={() => handleReviewAgain(product)}>Review Again</button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: 'white', minHeight: '100vh' }}>
      <h1 style={{ color: '#f5c500', fontWeight: 'bold', marginTop: 0 }}>INHABITR</h1>
      <hr style={{ borderColor: '#ddd', width: '100%', marginBottom: '20px' }} />

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <p style={{ fontSize: '14px' }}>KEYBOARD SHORTCUT</p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ fontSize: '14px', marginRight: '20px' }}>↑ Key Saves the Updated Image Metadata</p>
          <p style={{ fontSize: '14px' }}>↓ Key Deletes the Current Image</p>
        </div>
      </div>

      <hr style={{ borderColor: '#ddd', width: '100%', marginBottom: '20px' }} />

      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '10px' }}>
        <button
          type="button"
          onClick={() => { setView('all'); setReviewMode(false); }}
          style={{
            padding: '10px 20px',
            backgroundColor: 'white',
            color: 'black',
            border: '1px solid white',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
>>>>>>> 4b6bc45b348f99905d891a5f4d4833e101b8231f
          }}
        >
          Analyse
        </button>
<<<<<<< HEAD
        <button 
          type="button" 
          onClick={() => setShowImages(true)} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: 'white', 
            color: 'black', 
            border: '1px solid white', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            marginRight: '10px' 
=======
        <button
          type="button"
          onClick={() => setView('approved')}
          style={{
            padding: '10px 20px',
            backgroundColor: 'white',
            color: 'black',
            border: '1px solid white',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
>>>>>>> 4b6bc45b348f99905d891a5f4d4833e101b8231f
          }}
        >
          Approved
        </button>
<<<<<<< HEAD
        <button 
          type="button" 
          onClick={() => setShowImages(false)} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: 'white', 
            color: 'black', 
            border: '1px solid white', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            marginRight: '10px' 
=======
        <button
          type="button"
          onClick={() => setView('reviewLater')}
          style={{
            padding: '10px 20px',
            backgroundColor: 'white',
            color: 'black',
            border: '1px solid white',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
>>>>>>> 4b6bc45b348f99905d891a5f4d4833e101b8231f
          }}
        >
          Review Later
        </button>
<<<<<<< HEAD
        <button 
          type="button" 
          onClick={() => setShowImages(false)} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: 'white', 
            color: 'black', 
            border: '1px solid white', 
            borderRadius: '4px', 
            cursor: 'pointer' 
=======
        <button
          type="button"
          onClick={() => setView('rejected')}
          style={{
            padding: '10px 20px',
            backgroundColor: 'white',
            color: 'black',
            border: '1px solid white',
            borderRadius: '4px',
            cursor: 'pointer'
>>>>>>> 4b6bc45b348f99905d891a5f4d4833e101b8231f
          }}
        >
          Rejected
        </button>
      </div>

<<<<<<< HEAD
      {showImages && (
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px', position: 'relative' }}>
          <div style={{ width: '60%', minWidth: '300px', overflow: 'hidden' }}>
            {selectedImage && (
              <div style={{ border: '1px solid #ddd', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', minHeight: '400px', position: 'relative' }}>
                <img src={selectedImage.url} alt="Uploaded" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }} />
                <div 
                  style={{ 
                    position: 'absolute', 
                    bottom: '10px', 
                    right: '10px', 
                    display: 'flex', 
=======
      {!reviewMode && view === 'approved' && renderProductList(approvedProducts)}
      {!reviewMode && view === 'rejected' && renderProductList(rejectedProducts)}

      {products.length > 0 && (view === 'all' || reviewMode) && (
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
                    gap: '10px',
>>>>>>> 4b6bc45b348f99905d891a5f4d4833e101b8231f
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <button
<<<<<<< HEAD
                    onClick={() => handleApprove(selectedImage.id)}
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
=======
                    onClick={() => handleApprove(selectedProduct.id)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#1E90FF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
>>>>>>> 4b6bc45b348f99905d891a5f4d4833e101b8231f
                    }}
                  >
                    Approve
                  </button>
                  <button
<<<<<<< HEAD
                    onClick={() => handleReject(selectedImage.id)}
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
=======
                    onClick={() => handleReject(selectedProduct.id)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: 'white',
                      color: 'black',
                      border: '1px solid white',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
>>>>>>> 4b6bc45b348f99905d891a5f4d4833e101b8231f
                    }}
                  >
                    Reject
                  </button>
<<<<<<< HEAD
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
                      display: showImages ? 'block' : 'none' // Only display when showImages is true
=======
                  <button
                    onClick={() => handleReviewLater(selectedProduct.id)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: 'white',
                      color: 'black',
                      border: '1px solid white',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    Review Later
                  </button>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    display: 'flex',
                    gap: '10px',
                  }}
                >
                  <button
                    type="button"
                    onClick={handlePrevious}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#1e90ff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
>>>>>>> 4b6bc45b348f99905d891a5f4d4833e101b8231f
                    }}
                  >
                    Previous
                  </button>
<<<<<<< HEAD
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
                      display: showImages ? 'block' : 'none' // Only display when showImages is true
=======
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
>>>>>>> 4b6bc45b348f99905d891a5f4d4833e101b8231f
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
          <div style={{ width: '40%', minHeight: '400px', overflow: 'hidden' }}>
<<<<<<< HEAD
            {selectedImage && (
              <div style={{ border: '1px solid #ddd', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', minHeight: '400px' }}>
                <h3>Image Attribute</h3>
                <div style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>
                  <p><strong>ID:</strong> {selectedImage.id}</p>
                  <p><strong>Product ID:</strong> {selectedImage.product_id}</p>
                  <p><strong>Name:</strong> {selectedImage.name}</p>
                  <p><strong>Product Image URI:</strong> {selectedImage.product_image_uri}</p>
                  <p><strong>Description:</strong> {selectedImage.product_description}</p>
                  <p><strong>Dimensions:</strong> {selectedImage.product_dimensions}</p>
                  <p><strong>Price:</strong> ${selectedImage.price}</p>
                  <p><strong>Quantity:</strong> {selectedImage.quantity}</p>
                  <p><strong>Status:</strong> {selectedImage.status}</p>
=======
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
                  <p><strong>Approved Date:</strong> {selectedProduct.approved_date}</p>
>>>>>>> 4b6bc45b348f99905d891a5f4d4833e101b8231f
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}