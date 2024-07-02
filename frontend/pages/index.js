import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.css';
import { faCopy, faEdit } from '@fortawesome/free-solid-svg-icons';



export default function Home() {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState('all');
  const [rejectedProducts, setRejectedProducts] = useState([]);
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [reviewLaterProducts, setReviewLaterProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [currentPageApproved, setCurrentPageApproved] = useState(0);
  const [currentPageRejected, setCurrentPageRejected] = useState(0);
  const [currentPageReviewLater, setCurrentPageReviewLater] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  useEffect(() => {
    fetchProductsDetails();
  }, []);

  const fetchProductsDetails = async () => {
    try {
      const response = await axios.get('http://localhost:3001/product/details');
      if (response.data && response.data.length > 0) {
        const productsWithImages = response.data.map((product, index) => ({
          id: index,
          sgid: product.sgid,
          sku: product.product_sku,
          name: product.name,
          description: product.description,
          product_dimensions: product.product_dimensions,
          created_at: product.created_at,
          updated_at: product.updated_at,
          status: product.status,
          product_images: [{
            sgid: product.sgid,
            product_id: product.product_sku,
            sku_variation_id: product.variation_sku,
            image_name: product.image_name,
            alt_text: product.alt_text,
            is_default: product.is_default,
            sort_order: product.sort_order,
            created_at: product.created_at,
            updated_at: product.updated_at,
            image_url: product.image_url,
          }],
        }));
        setProducts(productsWithImages);
        setSelectedProduct(productsWithImages[0]);
        setCurrentIndex(0);
        console.log('Fetched product details:', productsWithImages);
      } else {
        console.error('No products found in the response.');
      }
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

  const handleStatusUpdate = async (sgid, newStatus) => {
    try {
      await axios.put(`http://localhost:3001/product/${sgid}`, { status: newStatus });

      const updatedProducts = products.map(product =>
        product.sgid === sgid ? { ...product, status: newStatus } : product
      );

      setProducts(updatedProducts);
      filterProducts(updatedProducts);

      const updatedSelectedProduct = updatedProducts.find(product => product.sgid === selectedProduct.sgid);
      setSelectedProduct(updatedSelectedProduct || null);
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  const handleReject = async (sgid) => {
    const confirmReject = window.confirm('Are you sure you want to reject this product?');
    if (confirmReject) {
      try {
        await handleStatusUpdate(sgid, 'Rejected');
      } catch (error) {
        console.error('Error rejecting product:', error);
      }
    }
  };

  const handleApprove = async (sgid) => {
    await handleStatusUpdate(sgid, 'Approved');
  };

  const handleReviewLater = async (sgid) => {
    await handleStatusUpdate(sgid, 'ReviewLater');
  };

  const handleReviewAgain = async (product) => {
    try {
      await handleStatusUpdate(product.sgid, 'Pending');
      setSelectedProduct(product);
      setReviewMode(true);
      console.log('Product status reset to Pending:', product);
    } catch (error) {
      console.error('Error resetting product status:', error);
    }
  };

  const handleNextPageApproved = () => {
    setCurrentPageApproved(currentPageApproved + 1);
  };

  const handlePreviousPageApproved = () => {
    setCurrentPageApproved(currentPageApproved - 1);
  };

  const handleNextPageRejected = () => {
    setCurrentPageRejected(currentPageRejected + 1);
  };

  const handlePreviousPageRejected = () => {
    setCurrentPageRejected(currentPageRejected - 1);
  };

  const handleNextPageReviewLater = () => {
    setCurrentPageReviewLater(currentPageReviewLater + 1);
  };

  const handlePreviousPageReviewLater = () => {
    setCurrentPageReviewLater(currentPageReviewLater - 1);
  };

  const handleNext = () => {
    if (products.length > 0) {
      const nextIndex = (currentIndex + 1) % products.length;
      setCurrentIndex(nextIndex);
      setSelectedProduct(products[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (products.length > 0) {
      const previousIndex = (currentIndex - 1 + products.length) % products.length;
      setCurrentIndex(previousIndex);
      setSelectedProduct(products[previousIndex]);
    }
  };

  const renderProductList = (productList, currentPage, handleNextPage, handlePreviousPage) => {
    const totalPages = Math.ceil(productList.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = productList.slice(startIndex, endIndex);

    return (
      <div style={{ marginTop: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#BEE4F4', borderBottom: '1px solid #ddd' }}>
              <th style={{ padding: '5px', textAlign: 'center' }}>Images</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Approved On</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px', verticalAlign: 'top', textAlign: 'center' }}>
                  {product.product_images && product.product_images.length > 0 ? (
                    <img
                      src={product.product_images[0].image_url} // Assuming first image URL is used
                      alt="Product Image"
                      style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span>No image available</span>
                    </div>
                  )}
                </td>
                <td style={{ padding: '10px', verticalAlign: 'middle' }}>
                  {formatDate(product.updated_at)} {/* Display the formatted date */}
                </td>
                <td style={{ padding: '10px', verticalAlign: 'middle', textAlign: 'center' }}>
                  <button onClick={() => handleReviewAgain(product)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}>
                    Analyze again
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" style={{ position: 'relative', textAlign: 'center' }}>
                <button
                  onClick={handlePreviousPage}
                  style={{
                    position: 'absolute',
                    left: 0,
                    padding: '10px 20px',
                    backgroundColor: 'white',
                    color: 'black',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  disabled={currentPage === 0}
                >
                  <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '5px' }} />
                  Previous
                </button>
                <span style={{ margin: '0 20px' }}>
                  <span style={{ fontWeight: 'bold' }}> {currentPage + 1}</span> {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  style={{
                    position: 'absolute',
                    right: 0,
                    padding: '10px 20px',
                    backgroundColor: 'white',
                    color: 'black',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: endIndex >= productList.length ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '10px',
                  }}
                  disabled={endIndex >= productList.length}
                >
                  Next
                  <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '5px' }} />
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-GB', options);
    return formattedDate;
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp') {
        console.log('Saving updated metadata...');
      } else if (event.key === 'ArrowDown') {
        console.log('Deleting current image...');
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
          }}
        >
          Analyse
        </button>
        <button
          type="button"
          onClick={() => { fetchProductsDetails() }}
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
          Product details
        </button>
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
          }}
        >
          Approved
        </button>
        <button
          type="button"
          onClick={() => setView('rejected')}
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
          Rejected
        </button>
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
          }}
        >
          Review Later
        </button>
      </div>

      {!reviewMode && view === 'approved' && (
        renderProductList(approvedProducts, currentPageApproved, handleNextPageApproved, handlePreviousPageApproved)
      )}
      {!reviewMode && view === 'rejected' && (
        renderProductList(rejectedProducts, currentPageRejected, handleNextPageRejected, handlePreviousPageRejected)
      )}
      {!reviewMode && view === 'reviewLater' && (
        renderProductList(reviewLaterProducts, currentPageReviewLater, handleNextPageReviewLater, handlePreviousPageReviewLater)
      )}

      {products.length > 0 && (view === 'all' || reviewMode) && (
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px', position: 'relative' }}>
          <div style={{ width: '60%', minWidth: '300px', overflow: 'hidden' }}>
            {selectedProduct && (
              <div style={{ border: '1px solid #ddd', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', minHeight: '400px', position: 'relative' }}>
                {selectedProduct.product_images && selectedProduct.product_images.length > 0 ? (
                  <img src={selectedProduct.product_images[0].image_url} alt="Product" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }} />
                ) : (
                  <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span>No image available</span>
                  </div>
                )}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    display: 'flex',
                    gap: '10px',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <button
                    onClick={() => handleReviewLater(selectedProduct.sgid)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: 'white',
                      color: 'black',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    Review Later
                  </button>

                  <button
                    onClick={() => handleReject(selectedProduct.sgid)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: 'white',
                      color: 'black',
                      border: '1px solid #1E90FF',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => handleApprove(selectedProduct.sgid)}
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
                    }}
                  >
                    Approve
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
                <h3 style={{ 
    border: '1px solid #ddd', 
    padding: '10px 20px', 
    margin: 0, 
    boxShadow: '0 0 10px rgba(0,0,0,0.1)', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
}}>
    <span>Image Attributes</span>
    <span>
        <FontAwesomeIcon 
            icon={faCopy} 
            style={{ marginRight: '10px', cursor: 'pointer', color: 'black'}} 
            onClick={() => handleCopy(/* Add the relevant text to copy here */)} 
        />
        <FontAwesomeIcon 
            icon={faEdit} 
            style={{ cursor: 'pointer', color: 'black'}} 
            onClick={() => handleEdit(/* Add the relevant function or URL here */)} 
        />
    </span>
</h3>

                <div style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>
                  {selectedProduct.product_images && selectedProduct.product_images.length > 0 && (
                    <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                      {`{
  "ID": "${selectedProduct.product_images[0].sgid}",
  "Product ID": "${selectedProduct.product_images[0].product_id}",
  "SKU Variation ID": "${selectedProduct.product_images[0].sku_variation_id}",
  "Image Name": "${selectedProduct.product_images[0].image_name}",
  "Alt Text": "${selectedProduct.product_images[0].alt_text || ''}",
  "Is Default": "${selectedProduct.product_images[0].is_default || ''}",
  "Sort Order": "${selectedProduct.product_images[0].sort_order || ''}",
  "Created At": "${selectedProduct.product_images[0].created_at || ''}",
  "Updated At": "${selectedProduct.product_images[0].updated_at || ''}"
}`}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
