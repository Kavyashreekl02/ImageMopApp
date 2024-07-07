import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCopy, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState('all');
  const [rejectedProducts, setRejectedProducts] = useState([]);
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [reviewLaterProducts, setReviewLaterProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageAttributes, setImageAttributes] = useState(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [currentPageApproved, setCurrentPageApproved] = useState(0);
  const [currentPageRejected, setCurrentPageRejected] = useState(0);
  const [currentPageReviewLater, setCurrentPageReviewLater] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const previousProductRef = useRef(null);

  useEffect(() => {
    fetchProductsDetails();
  }, []);

  useEffect(() => {
    if (selectedProduct && selectedProduct.product_images && selectedProduct.product_images.length > 0) {
      const imageUrlParts = selectedProduct.product_images[0].image_url.split('/');
      const productSku = imageUrlParts[4];
      const variationSku = imageUrlParts[5];
      if (productSku && variationSku) {
        fetchImageAttributes(productSku, variationSku).then(attributes => {
          setImageAttributes(attributes);
        });
      } else {
        console.error('Product SKU or Variation SKU is undefined');
      }
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (view === 'approved') {
      fetchApprovedProducts();
    } else if (view === 'rejected') {
      fetchRejectedProducts();
    } else if (view === 'reviewLater') {
      fetchReviewLaterProducts();
    } else if (view === 'all' && previousProductRef.current) {
      setSelectedProduct(previousProductRef.current);
      previousProductRef.current = null;
    }
  }, [view]);

  const fetchProductsDetails = async () => {
    try {
      const response = await axios.get('http://localhost:3001/product/details');
      if (response.data && response.data.length > 0) {
        const productsWithImages = response.data.map((product, index) => ({
          ...product,
          id: index,
          product_images: product.image_url ? [{ image_url: product.image_url }] : [],
        }));

        console.log("Fetched Products: ", productsWithImages);
        setProducts(productsWithImages);
        setSelectedProduct(productsWithImages[0]);
        setCurrentIndex(0);
        filterProducts(productsWithImages);
      } else {
        console.error('No products found in the response.');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchProductsByStatus = async (status) => {
    try {
      const response = await axios.get(`http://localhost:3001/product/status/${status}`);
      if (response.data && response.data.length > 0) {
        const productsWithImages = response.data.map((productImage, index) => ({
          ...productImage.product,
          id: index,
          product_images: [{ image_url: `https://d12kqwzvfrkt5o.cloudfront.net/products/${productImage.product.sku}/${productImage.skuVariation.sku}/${productImage.image_name}` }],
        }));

        return productsWithImages;
      } else {
        console.error(`No ${status} products found in the response.`);
        return [];
      }
    } catch (error) {
      console.error(`Error fetching ${status} products:`, error);
      return [];
    }
  };

  const fetchApprovedProducts = async () => {
    const products = await fetchProductsByStatus('Approved');
    setApprovedProducts(products);
  };

  const fetchRejectedProducts = async () => {
    const products = await fetchProductsByStatus('Rejected');
    setRejectedProducts(products);
  };

  const fetchReviewLaterProducts = async () => {
    const products = await fetchProductsByStatus('ReviewLater');
    setReviewLaterProducts(products);
  };

  const fetchImageAttributes = async (productSku, variationSku) => {
    try {
      const response = await axios.get(`http://localhost:3001/product/image-attributes/${productSku}/${variationSku}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching image attributes:', error);
      return null;
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

  const handleStatusUpdate = async (productSku, variationSku, sgid, newStatus) => {
    try {
      if (!productSku || !variationSku) {
        throw new Error('Invalid product SKU or variation SKU');
      }

      console.log('Updating status:', { productSku, variationSku, newStatus });

      await axios.put(`http://localhost:3001/product/image-attributes/${productSku}/${variationSku}`, { status: newStatus });

      const updatedProducts = products.map(product =>
        product.product_id === productSku && product.variation_sku === variationSku ? { ...product, status: newStatus } : product
      );

      setProducts(updatedProducts);

      // Re-filter the products to update the view
      filterProducts(updatedProducts);

      const updatedSelectedProduct = updatedProducts.find(product => product.sgid === selectedProduct.sgid);
      setSelectedProduct(updatedSelectedProduct || null);

      // Update image attributes to reflect the status change
      if (imageAttributes && imageAttributes.product_id === productSku && imageAttributes.sku_variation_id === variationSku) {
        setImageAttributes({ ...imageAttributes, status: newStatus });
      }

    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  const handleApprove = async () => {
    if (selectedProduct && selectedProduct.product_images && selectedProduct.product_images.length > 0) {
      const imageUrlParts = selectedProduct.product_images[0].image_url.split('/');
      const productSku = imageUrlParts[4];
      const variationSku = imageUrlParts[5];

      if (!productSku || !variationSku) {
        console.error('Invalid SKU values');
        return;
      }

      await handleStatusUpdate(productSku, variationSku, selectedProduct.sgid, 'Approved');
      fetchApprovedProducts();
    }
  };

  const handleReject = async () => {
    if (selectedProduct && selectedProduct.product_images && selectedProduct.product_images.length > 0) {
      const imageUrlParts = selectedProduct.product_images[0].image_url.split('/');
      const productSku = imageUrlParts[4];
      const variationSku = imageUrlParts[5];

      if (!productSku || !variationSku) {
        console.error('Invalid SKU values');
        return;
      }

      const confirmReject = window.confirm('Are you sure you want to reject this product?');
      if (confirmReject) {
        try {
          await handleStatusUpdate(productSku, variationSku, selectedProduct.sgid, 'Rejected');
          fetchRejectedProducts();
        } catch (error) {
          console.error('Error rejecting product:', error);
        }
      }
    }
  };

  const handleReviewLater = async () => {
    if (selectedProduct && selectedProduct.product_images && selectedProduct.product_images.length > 0) {
      const imageUrlParts = selectedProduct.product_images[0].image_url.split('/');
      const productSku = imageUrlParts[4];
      const variationSku = imageUrlParts[5];

      if (!productSku || !variationSku) {
        console.error('Invalid SKU values');
        return;
      }

      await handleStatusUpdate(productSku, variationSku, selectedProduct.sgid, 'ReviewLater');
      fetchReviewLaterProducts();
    }
  };

  const handleReviewAgain = async (product) => {
    previousProductRef.current = product; // Save the current product to ref
    const imageUrlParts = product.product_images[0].image_url.split('/');
    const productSku = imageUrlParts[4];
    const variationSku = imageUrlParts[5];
    try {
      await handleStatusUpdate(productSku, variationSku, product.sgid, 'Pending');
      setSelectedProduct(product);
      setView('all'); // Switch back to the "Analyze" tab
      setReviewMode(true);
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
              <th style={{ padding: '10px', textAlign: 'left' }}>{view === 'approved' ? 'Approved On' : view === 'rejected' ? 'Rejected On' : 'Review On'}</th>
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
                      style={{ width: '100%', maxHeight: '100px', objectFit: 'contain' }} // Adjusted height
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                  <span style={{ fontWeight: 'bold' }}>{currentPage + 1}</span> of {totalPages}
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
          onClick={() => { setView('all'); }}
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
          Analyze 
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

      {view === 'approved' && renderProductList(approvedProducts, currentPageApproved, handleNextPageApproved, handlePreviousPageApproved)}
      {view === 'rejected' && renderProductList(rejectedProducts, currentPageRejected, handleNextPageRejected, handlePreviousPageRejected)}
      {view === 'reviewLater' && renderProductList(reviewLaterProducts, currentPageReviewLater, handleNextPageReviewLater, handlePreviousPageReviewLater)}

      {products.length > 0 && view === 'all' && (
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
                <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: '10', display: 'flex', alignItems: 'center' }}>
                  <button
                    onClick={() => handleDelete(selectedProduct.sgid)}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      padding: '20px',
                      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                      position: 'relative',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      overflow: 'hidden',
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} style={{ color: 'black', fontSize: '20px' }} />
                  </button>
                </div>
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
                    onClick={handleReviewLater}
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
                    onClick={handleReject}
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
                    onClick={handleApprove}
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
                            onClick={() => handleCopy()} 
                        />
                        <FontAwesomeIcon 
                            icon={faEdit} 
                            style={{ cursor: 'pointer', color: 'black'}} 
                            onClick={() => handleEdit()} 
                        />
                    </span>
                </h3>

                <div style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>
                  {imageAttributes ? (
                    <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                      {`{
  "Product SKU": "${imageAttributes.product_id}",
  "Variation SKU": "${imageAttributes.sku_variation_id}",
  "Image Name": "${imageAttributes.image_name}",
  "Alt_text": "${imageAttributes.alt_text}",
  "Created_at": "${imageAttributes.created_at}",
  "Updated_at": "${imageAttributes.updated_at}",
  "Status": "${imageAttributes.status}"
}`}
                    </pre>
                  ) : (
                    <span>Loading image attributes...</span>
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
