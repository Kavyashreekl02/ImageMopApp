/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faArrowRight,
    faCopy,
    faEdit,
} from '@fortawesome/free-solid-svg-icons';
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
    const [currentPage, setCurrentPage] = useState(0);
    const [totalImages, setTotalImages] = useState(0);
    const itemsPerPage = 500;
    const itemsPerStatusPage = 8;
    const [currentPageApproved, setCurrentPageApproved] = useState(0);
    const [totalApprovedImages, setTotalApprovedImages] = useState(0);
    const [currentPageRejected, setCurrentPageRejected] = useState(0);
    const [totalRejectedImages, setTotalRejectedImages] = useState(0);
    const [currentPageReviewLater, setCurrentPageReviewLater] = useState(0);
    const [totalReviewLaterImages, setTotalReviewLaterImages] = useState(0);
    const [editing, setEditing] = useState(false);
    const [editedAttributes, setEditedAttributes] = useState(null);

    const previousProductRef = useRef(null);
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL; // Change this value for production

    useEffect(() => {
        fetchTotalImages();
        fetchProductsDetails();
    }, [currentPage]);

    useEffect(() => {
        if (selectedProduct) {
            setImageAttributes(selectedProduct);
        }
    }, [selectedProduct]);

    useEffect(() => {
        if (view === 'approved') {
            fetchApprovedProducts();
        } else if (view === 'rejected') {
            fetchRejectedProducts();
        } else if (view === 'reviewLater') {
            fetchReviewLaterProducts();
        } else if (view === "all" && previousProductRef.current) {
          const product = previousProductRef.current;
          setSelectedProduct(product);
          setCurrentIndex(products.findIndex((p) => p.id === product.id)); // Set the currentIndex to the product's index
          previousProductRef.current = null;
        }
    
    }, [view, products, currentPageApproved, currentPageRejected, currentPageReviewLater]);

    const fetchTotalImages = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/product/total-images`);
            setTotalImages(response.data);
        } catch (error) {
            console.error('Error fetching total images:', error);
        }
    };

    const fetchProductsDetails = async () => {
        const offset = currentPage * itemsPerPage;
        console.log(`Fetching product details from: ${BASE_URL}/product/image-attributes?limit=${itemsPerPage}&offset=${offset}`);

        try {
            const response = await axios.get(`${BASE_URL}/product/image-attributes`, {
                params: {
                    limit: itemsPerPage,
                    offset,
                },
            });
            if (response.data && response.data.length > 0) {
                const productsWithImages = response.data.map((productData, index) => ({
                    ...productData,
                    id: index + offset, // Ensure unique IDs across pages
                    product_sku: productData.product_sku,
                    product_images: productData.image_url
                        ? [{ image_url: productData.image_url }]
                        : [],
                }));

                console.log('Fetched Products: ', productsWithImages);
                setProducts(productsWithImages);

                if (!previousProductRef.current) {
                  setSelectedProduct(productsWithImages[0]);
                  setCurrentIndex(0);
                } else {
                  const product = previousProductRef.current;
                  setSelectedProduct(product);
                  setCurrentIndex(productsWithImages.findIndex((p) => p.id === product.id));
                }
        
                setSelectedProduct(productsWithImages[0]);
                setCurrentIndex(0);
            } else {
                console.error('No products found in the response.');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchProductsByStatus = async (status) => {
        const offset = getCurrentPageForStatus(status) * itemsPerStatusPage;
        try {
            const response = await axios.get(`${BASE_URL}/product/status/${status}`, {
                params: {
                    limit: itemsPerStatusPage,
                    offset,
                },
            });
            if (response.data && response.data.length > 0) {
                return response.data.map((product, index) => ({
                    ...product,
                    id: index + offset,
                }));
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
        setTotalApprovedImages(products.length);
    };

    const fetchRejectedProducts = async () => {
        const products = await fetchProductsByStatus('Rejected');
        setRejectedProducts(products);
        setTotalRejectedImages(products.length);
    };

    const fetchReviewLaterProducts = async () => {
        const products = await fetchProductsByStatus('ReviewLater');
        setReviewLaterProducts(products);
        setTotalReviewLaterImages(products.length);
    };

    const getCurrentPageForStatus = (status) => {
        switch (status) {
            case 'Approved':
                return currentPageApproved;
            case 'Rejected':
                return currentPageRejected;
            case 'ReviewLater':
                return currentPageReviewLater;
            default:
                return 0;
        }
    };

    const setCurrentPageForStatus = (status, page) => {
        switch (status) {
            case 'Approved':
                setCurrentPageApproved(page);
                break;
            case 'Rejected':
                setCurrentPageRejected(page);
                break;
            case 'ReviewLater':
                setCurrentPageReviewLater(page);
                break;
            default:
                break;
        }
    };

    const filterProducts = (products) => {
      const approved = products.filter(
        (product) => product.status === "Approved"
      );
      const rejected = products.filter(
        (product) => product.status === "Rejected"
      );
      const reviewLater = products.filter(
        (product) => product.status === "ReviewLater"
      );
  
      setApprovedProducts(approved);
      setRejectedProducts(rejected);
      setReviewLaterProducts(reviewLater);
    };
  

    const handleStatusUpdate = async (id, newStatus) => {
      try {
        const product = products.find((p) => p.id === id);
        if (!product) {
          throw new Error("Product not found");
        }
    
        const imageUrlParts = product.product_images[0].image_url.split("/");
        const productSku = imageUrlParts[4];
        const variationSku = imageUrlParts[5];
    
        if (!productSku || !variationSku) {
          throw new Error("Invalid product SKU or variation SKU");
        }
    
        console.log("Updating status:", { productSku, variationSku, newStatus });
    
        const updated_at = new Date().toISOString();
    
        const payload = {
          status: newStatus,
          updated_at,
          ...product.product_images[0], // Include other fields from updateImageDto if necessary
        };
    
        console.log("Payload:", payload);
    
        const response = await axios.put(
          `${BASE_URL}/product/image-attributes/${productSku}/${variationSku}`,
          payload
        );
    
        console.log("Response from server:", response.data);
    
        const updatedProducts = products.map((product) =>
          product.id === id
            ? { ...product, status: newStatus, updated_at }
            : product
        );
    
        setProducts(updatedProducts);
    
        filterProducts(updatedProducts);
    
        const updatedSelectedProduct = updatedProducts.find(
          (product) => product.id === id
        );
        setSelectedProduct(updatedSelectedProduct || null);
    
        if (
          imageAttributes &&
          imageAttributes.product_sku === productSku &&
          imageAttributes.product_variation_sku === variationSku
        ) {
          setImageAttributes({
            ...imageAttributes,
            status: newStatus,
            updated_at,
          });
        }
      } catch (error) {
        console.error("Error updating product status:", error.message);
      }
    };
    
    const handleReject = async (id, event) => {
      const product = products.find((product) => product.id === id);
      if (product && product.status === "Rejected") {
        showPopup("This product is already in the rejected state.", event.target);
      } else {
        const confirmReject = window.confirm(
          "Are you sure you want to reject this product?"
        );
        if (confirmReject) {
          try {
            await handleStatusUpdate(id, "Rejected");
          } catch (error) {
            console.error("Error rejecting product:", error);
          }
        }
      }
    };
    
    const handleApprove = async (id, event) => {
      const product = products.find((product) => product.id === id);
      if (product && product.status === "Approved") {
        showPopup("This product is already in the approved state.", event.target);
      } else {
        try {
          await handleStatusUpdate(id, "Approved");
        } catch (error) {
          console.error("Error approving product:", error);
        }
      }
    };
    
    const handleReviewLater = async (id, event) => {
      const product = products.find((product) => product.id === id);
      if (product && product.status === "ReviewLater") {
        showPopup(
          "This product is already in the review later state.",
          event.target
        );
      } else {
        try {
          await handleStatusUpdate(id, "ReviewLater");
        } catch (error) {
          console.error("Error marking product for review later:", error);
        }
      }
    };
    
    const handleReviewAgain = async (product) => {
      previousProductRef.current = product;

    
      try {
        // Assuming handleStatusUpdate takes product ID and new status
        await handleStatusUpdate(product.id, "Pending");
        setSelectedProduct(product);
        setCurrentIndex(products.findIndex((p) => p.id === product.id)); // Set the currentIndex to the product's index
      setView("all"); // Assuming this sets the current view or state in the UI

      } catch (error) {
        console.error("Error resetting product status:", error);
      }
    };
    

    const handleNext = () => {
        if (products.length > 0) {
            const nextIndex = currentIndex + 1;
            if (nextIndex >= products.length && products.length === itemsPerPage) {
                setCurrentPage(currentPage + 1);
            } else {
                setCurrentIndex(nextIndex);
                setSelectedProduct(products[nextIndex % itemsPerPage]);
            }
        }
    };

    const handlePrevious = () => {
        if (products.length > 0) {
            const previousIndex = currentIndex - 1;
            if (previousIndex < 0 && currentPage > 0) {
                setCurrentPage(currentPage - 1);
            } else {
                setCurrentIndex(previousIndex >= 0 ? previousIndex : itemsPerPage - 1);
                setSelectedProduct(products[previousIndex >= 0 ? previousIndex : itemsPerPage - 1]);
            }
        }
    };

    const handleCopy = (event) => {
        if (imageAttributes) {
            const textToCopy = `
        Product SKU: ${imageAttributes.product_sku}
        Variation SKU: ${imageAttributes.product_variation_sku}
        Image Name: ${imageAttributes.product_image}
        Alt Text: ${imageAttributes.alt_text}
        Created At: ${new Date(imageAttributes.created_at).toLocaleString()}
        Updated At: ${new Date(imageAttributes.updated_at).toLocaleString()}
        Status: ${imageAttributes.status}
        Meta Title: ${imageAttributes.meta_title}
        Meta Description: ${imageAttributes.meta_description}
        Meta Keywords: ${imageAttributes.meta_keywords}
        Product Description: ${imageAttributes.product_description}
        Product Dimension: ${imageAttributes.product_dimension}
        Product Name: ${imageAttributes.product_name}
        Product Weight: ${imageAttributes.product_weight}
        SGID: ${imageAttributes.sgid}
      `;
            navigator.clipboard
                .writeText(textToCopy)
                .then(() => {
                    showPopup('Text copied to clipboard!', event.target);
                })
                .catch((err) => {
                    console.error('Error copying text: ', err);
                });
        } else {
            console.error('No product selected');
        }
    };

    const handleEdit = () => {
        setEditing(true);
        setEditedAttributes(imageAttributes);
    };

    const handleSaveEdit = async () => {
        console.log('handleSaveEdit called');
        try {
            if (!selectedProduct || !Object.keys(editedAttributes).length) {
                console.error('No product selected or no attributes to edit');
                return;
            }

            const response = await axios.put(`${BASE_URL}/product/image-attributes`, {
                sgid: selectedProduct.sgid,
                attributes: editedAttributes,
                status: 'updated',
            });
            console.log('Server response:', response.data);

            if (response.status === 200) {
                const updatedAttributes = { ...imageAttributes, ...editedAttributes };

                const updatedProducts = products.map((p) =>
                    p.product_id === selectedProduct.product_id
                        ? {
                              ...p,
                              product_images: p.product_images.map((img) =>
                                  img.image_url === selectedProduct.product_images[0].image_url
                                      ? { ...img, ...updatedAttributes }
                                      : img
                              ),
                          }
                        : p
                );
                console.log('Updated products:', updatedProducts);

                setProducts(updatedProducts);
                setSelectedProduct({
                    ...selectedProduct,
                    imageAttributes: updatedAttributes,
                });
                setImageAttributes(updatedAttributes);

                setEditing(false);
                setEditedAttributes({});
                showPopup('Attributes updated successfully!');
            } else {
                console.error('Failed to save edited attributes');
                showPopup('Failed to save edited attributes');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            showPopup('Error updating product');
        }
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setEditedAttributes(null);
    };

    const showPopup = (message) => {
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.textContent = message;

        // Center the popup on the screen
        popup.style.position = 'fixed';
        popup.style.left = '50%';
        popup.style.top = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.padding = '10px';
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        popup.style.color = 'white';
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '9999';

        document.body.appendChild(popup);

        setTimeout(() => {
            popup.remove();
        }, 3000);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowLeft') {
                handlePrevious();
            } else if (event.key === 'ArrowRight') {
                handleNext();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handlePrevious, handleNext]);

    const handleNextPageForStatus = (status) => {
        const currentPage = getCurrentPageForStatus(status);
        setCurrentPageForStatus(status, currentPage + 1);
    };

    const handlePreviousPageForStatus = (status) => {
        const currentPage = getCurrentPageForStatus(status);
        setCurrentPageForStatus(status, currentPage - 1);
    };

    const renderProductList = (
        productList,
        currentPage,
        handleNextPage,
        handlePreviousPage,
        itemsPerPage,
        totalItems
    ) => {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentProducts = productList.slice(startIndex, endIndex);

        return (
            <div style={{ marginTop: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr
                            style={{
                                backgroundColor: '#BEE4F4',
                                borderBottom: '1px solid #ddd',
                            }}>
                            <th style={{ padding: '5px', textAlign: 'center' }}>Images</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>
                                {view === 'approved'
                                    ? 'Approved On'
                                    : view === 'rejected'
                                    ? 'Rejected On'
                                    : 'Review On'}
                            </th>
                            <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((product) => (
                            <tr key={product.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td
                                    style={{
                                        padding: '10px',
                                        verticalAlign: 'top',
                                        textAlign: 'center',
                                    }}>
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.alt_text || 'Product Image'}
                                            style={{
                                                width: '35px',
                                                maxHeight: '35px',
                                                objectFit: 'contain',
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: '100%',
                                                height: '100px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                            <span>No image available</span>
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '10px', verticalAlign: 'middle' }}>
                                    {product.updated_at || 'N/A'}
                                </td>
                                <td
                                    style={{
                                        padding: '10px',
                                        verticalAlign: 'middle',
                                        textAlign: 'center',
                                    }}>
                                    <button
                                        onClick={() => handleReviewAgain(product)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#007bff',
                                            textDecoration: 'underline',
                                        }}>
                                        Analyze again
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td
                                colSpan='3'
                                style={{ position: 'relative', textAlign: 'center' }}>
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
                                    disabled={currentPage === 0}>
                                    <FontAwesomeIcon
                                        icon={faArrowLeft}
                                        style={{ marginRight: '5px' }}
                                    />
                                    Previous
                                </button>
                                <span style={{ margin: '0 20px' }}>
                                    <span style={{ fontWeight: 'bold' }}>{currentPage + 1}</span>{' '}
                                    of {totalPages}
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
                                        cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginLeft: '10px',
                                    }}
                                    disabled={currentPage >= totalPages - 1}>
                                    Next
                                    <FontAwesomeIcon
                                        icon={faArrowRight}
                                        style={{ marginLeft: '5px' }}
                                    />
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
        <div
            style={{
                padding: '20px',
                fontFamily: 'Arial, sans-serif',
                backgroundColor: 'white',
                minHeight: '100vh',
            }}>
            <h1 style={{ color: '#f5c500', fontWeight: 'bold', marginTop: 0 }}>INHABITR</h1>
            <hr style={{ borderColor: '#ddd', width: '100%', marginBottom: '20px' }} />

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <p style={{ fontSize: '14px' }}>KEYBOARD SHORTCUT</p>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <p style={{ fontSize: '14px', marginRight: '20px' }}>
                        ↑ Key Saves the Updated Image Metadata
                    </p>
                    <p style={{ fontSize: '14px' }}>↓ Key Deletes the Current Image</p>
                </div>
            </div>

            <hr style={{ borderColor: '#ddd', width: '100%', marginBottom: '20px' }} />

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginBottom: '10px',
                }}>
                <button
                    type='button'
                    onClick={() => {
                        setView('all');
                        fetchProductsDetails();
                    }}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: 'white',
                        color: 'black',
                        border: '1px solid white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '10px',
                    }}>
                    Analyze
                </button>
                <button
                    type='button'
                    onClick={() => setView('approved')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: 'white',
                        color: 'black',
                        border: '1px solid white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '10px',
                    }}>
                    Approved
                </button>
                <button
                    type='button'
                    onClick={() => setView('rejected')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: 'white',
                        color: 'black',
                        border: '1px solid white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '10px',
                    }}>
                    Rejected
                </button>
                <button
                    type='button'
                    onClick={() => setView('reviewLater')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: 'white',
                        color: 'black',
                        border: '1px solid white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '10px',
                    }}>
                    Review Later
                </button>
            </div>

            {view === 'approved' &&
                renderProductList(
                    approvedProducts,
                    currentPageApproved,
                    () => handleNextPageForStatus('Approved'),
                    () => handlePreviousPageForStatus('Approved'),
                    itemsPerStatusPage,
                    totalApprovedImages
                )}
            {view === 'rejected' &&
                renderProductList(
                    rejectedProducts,
                    currentPageRejected,
                    () => handleNextPageForStatus('Rejected'),
                    () => handlePreviousPageForStatus('Rejected'),
                    itemsPerStatusPage,
                    totalRejectedImages
                )}
            {view === 'reviewLater' &&
                renderProductList(
                    reviewLaterProducts,
                    currentPageReviewLater,
                    () => handleNextPageForStatus('ReviewLater'),
                    () => handlePreviousPageForStatus('ReviewLater'),
                    itemsPerStatusPage,
                    totalReviewLaterImages
                )}

{products.length > 0 && view === 'all' && (
                <div
                    style={{
                        display: 'flex',
                        gap: '20px',
                        marginTop: '20px',
                        position: 'relative',
                    }}>
                    <div style={{ width: '60%', minWidth: '300px', overflow: 'hidden' }}>
                        {selectedProduct && (
                            <div
                                style={{
                                    border: '1px solid #ddd',
                                    padding: '20px',
                                    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                                    minHeight: '400px',
                                    position: 'relative',
                                }}>
                                 {selectedProduct.image_url ? (
                  <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.alt_text || "Product Image"}
                    onError={(e) => { e.target.onerror = null; e.target.src = "/fallback_image_url"; }}
                    style={{
                      width: "100%",
                      maxHeight: "300px",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '300px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                        <span>No image available</span>
                                    </div>
                                )}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        zIndex: '10',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}></div>
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
                                    }}>
                                    <button
                                        onClick={(event) =>
                                            handleReviewLater(selectedProduct.id, event)
                                        }
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: 'white',
                                            color: 'black',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                        Review Later
                                    </button>

                                    <button
                                        onClick={(event) => handleReject(selectedProduct.id, event)}
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: 'white',
                                            color: 'black',
                                            border: '1px solid #1E90FF',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                        Reject
                                    </button>

                                    <button
                                        onClick={(event) =>
                                            handleApprove(selectedProduct.id, event)
                                        }
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: '#1E90FF',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
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
                                    }}>
                                    <button
                                        type='button'
                                        onClick={handlePrevious}
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: '#1e90ff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}>
                                        Previous
                                    </button>
                                    <button
                                        type='button'
                                        onClick={handleNext}
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: '#1e90ff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}>
                                        Next
                                    </button>
                                </div>
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: '10px', // Adjusted to move the pagination to the bottom center
                                        right: '50%',
                                        transform: 'translateX(50%)',
                                        textAlign: 'center',
                                    }}>
                                    <span>
                                        {currentIndex + currentPage * itemsPerPage + 1} / {totalImages}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div style={{ width: '40%', minHeight: '400px', overflow: 'hidden' }}>
                        {selectedProduct && !editing && (
                            <div
                                style={{
                                    border: '1px solid #ddd',
                                    padding: '20px',
                                    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                                    minHeight: '400px',
                                }}>
                                <h3
                                    style={{
                                        border: '1px solid #ddd',
                                        padding: '10px 20px',
                                        margin: 0,
                                        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                    <span>Image Attributes</span>
                                    <span>
                                        <FontAwesomeIcon
                                            icon={faCopy}
                                            style={{
                                                marginRight: '10px',
                                                cursor: 'pointer',
                                                color: 'black',
                                            }}
                                            onClick={(event) => handleCopy(event)}
                                        />
                                        <FontAwesomeIcon
                                            icon={faEdit}
                                            style={{ cursor: 'pointer', color: 'black' }}
                                            onClick={handleEdit}
                                        />
                                    </span>
                                </h3>
                                <div
                                    style={{
                                        backgroundColor: '#f4f4f4',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        overflowX: 'auto',
                                    }}>
                                    {imageAttributes ? (
                                        <>
                                            <p>
                                                <strong>Product SKU:</strong> {imageAttributes.product_sku}
                                            </p>
                                            <p>
                                                <strong>Variation SKU:</strong>{' '}
                                                {imageAttributes.product_variation_sku}
                                            </p>
                                            <p>
                                                <strong>Image Name:</strong>{' '}
                                                {imageAttributes.product_image}
                                            </p>
                                            <p>
                                                <strong>Alt Text:</strong> {imageAttributes.alt_text}
                                            </p>
                                            <p>
                                                <strong>Created At:</strong>{' '}
                                                {new Date(imageAttributes.created_at).toLocaleString()}
                                            </p>
                                            <p>
                                                <strong>Updated At:</strong>{' '}
                                                {new Date(imageAttributes.updated_at).toLocaleString()}
                                            </p>
                                            <p>
                                                <strong>Status:</strong> {imageAttributes.status}
                                            </p>
                                            <p>
                                                <strong>Meta Title:</strong>{' '}
                                                {imageAttributes.meta_title}
                                            </p>
                                            <p>
                                                <strong>Meta Description:</strong>{' '}
                                                {imageAttributes.meta_description}
                                            </p>
                                            <p>
                                                <strong>Meta Keywords:</strong>{' '}
                                                {imageAttributes.meta_keywords}
                                            </p>
                                            <p>
                                                <strong>Product Description:</strong>{' '}
                                                {imageAttributes.product_description}
                                            </p>
                                            <p>
                                                <strong>Product Dimension:</strong>{' '}
                                                {imageAttributes.product_dimension}
                                            </p>
                                            <p>
                                                <strong>Product Name:</strong>{' '}
                                                {imageAttributes.product_name}
                                            </p>
                                            <p>
                                                <strong>Product Weight:</strong>{' '}
                                                {imageAttributes.product_weight}
                                            </p>
                                            <p>
                                                <strong>SGID:</strong> {imageAttributes.sgid}
                                            </p>
                                        </>
                                    ) : (
                                        <p>No attributes to display</p>
                                    )}
                                </div>
                            </div>
                        )}
                        {editing && (
                            <div
                                style={{
                                    border: '1px solid #ddd',
                                    padding: '20px',
                                    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                                    minHeight: '400px',
                                }}>
                                <h3>Edit Product</h3>
                                <div
                                    style={{
                                        backgroundColor: '#f4f4f4',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        overflowX: 'auto',
                                    }}>
                                    <p>
                                        <strong>Product SKU:</strong>
                                        <input
                                            type='text'
                                            value={editedAttributes?.product_sku || ''}
                                            onChange={(e) =>
                                                setEditedAttributes({
                                                    ...editedAttributes,
                                                    product_sku: e.target.value,
                                                })
                                            }
                                        />
                                    </p>
                                    <p>
                                        <strong>Variation SKU:</strong>
                                        <input
                                            type='text'
                                            value={editedAttributes?.product_variation_sku || ''}
                                            onChange={(e) =>
                                                setEditedAttributes({
                                                    ...editedAttributes,
                                                    product_variation_sku: e.target.value,
                                                })
                                            }
                                        />
                                    </p>
                                    <p>
                                        <strong>Image Name:</strong>
                                        <input
                                            type='text'
                                            value={editedAttributes?.product_image || ''}
                                            onChange={(e) =>
                                                setEditedAttributes({
                                                    ...editedAttributes,
                                                    product_image: e.target.value,
                                                })
                                            }
                                        />
                                    </p>
                                    <p>
                                        <strong>Alt Text:</strong>
                                        <input
                                            type='text'
                                            value={editedAttributes?.alt_text || ''}
                                            onChange={(e) =>
                                                setEditedAttributes({
                                                    ...editedAttributes,
                                                    alt_text: e.target.value,
                                                })
                                            }
                                        />
                                    </p>
                                    <p>
                                        <strong>Created At:</strong>
                                        <input
                                            type='text'
                                            value={editedAttributes?.created_at || ''}
                                            onChange={(e) =>
                                                setEditedAttributes({
                                                    ...editedAttributes,
                                                    created_at: e.target.value,
                                                })
                                            }
                                        />
                                    </p>
                                    <p>
                                        <strong>Updated At:</strong>
                                        <input
                                            type='text'
                                            value={editedAttributes?.updated_at || ''}
                                            onChange={(e) =>
                                                setEditedAttributes({
                                                    ...editedAttributes,
                                                    updated_at: e.target.value,
                                                })
                                            }
                                        />
                                    </p>
                                    <p>
                                        <strong>Status:</strong>
                                        <select
                                            value={editedAttributes?.status || ''}
                                            onChange={(e) =>
                                                setEditedAttributes({
                                                    ...editedAttributes,
                                                    status: e.target.value,
                                                })
                                            }>
                                            <option value=''>Select status</option>
                                            <option value='Approved'>Approved</option>
                                            <option value='Rejected'>Rejected</option>
                                            <option value='ReviewLater'>ReviewLater</option>
                                        </select>
                                    </p>

                                    <p>
                                        <strong>Meta Title:</strong>
                                        <input
                                            type='text'
                                            value={editedAttributes?.meta_title || ''}
                                            onChange={(e) =>
                                                setEditedAttributes({
                                                    ...editedAttributes,
                                                    meta_title: e.target.value,
                                                })
                                            }
                                        />
                                    </p>
                                    <p>
                                        <strong>Meta Description:</strong>
                                        <input
                                            type='text'
                                            value={editedAttributes?.meta_description || ''}
                                            onChange={(e) =>
                                                setEditedAttributes({
                                                    ...editedAttributes,
                                                    meta_description: e.target.value,
                                                })
                                            }
                                        />
                                    </p>
                                    <p>
                                        <strong>Meta Keywords:</strong>
                                        <input
                                            type='text'
                                            value={editedAttributes?.meta_keywords || ''}
                                            onChange={(e) =>
                                                setEditedAttributes({
                                                    ...editedAttributes,
                                                    meta_keywords: e.target.value,
                                                })
                                            }
                                        />
                                    </p>
                                    <p>
                                        <strong>Product Description:</strong>
                                        <input
                                            type='text'
                                            value={editedAttributes?.product_description || ''}
                                            onChange={(e) =>
                                                setEditedAttributes({
                                                    ...editedAttributes,
                                                    product_description: e.target.value,
                                                })
											}
										/>
									</p>
									<p>
										<strong>Product Dimension:</strong>
										<input
											type='text'
											value={editedAttributes?.product_dimension || ''}
											onChange={(e) =>
												setEditedAttributes({
													...editedAttributes,
													product_dimension: e.target.value,
												})
											}
										/>
									</p>
									<p>
										<strong>Product Name:</strong>
										<input
											type='text'
											value={editedAttributes?.product_name || ''}
											onChange={(e) =>
												setEditedAttributes({
													...editedAttributes,
													product_name: e.target.value,
												})
											}
										/>
									</p>
									<p>
										<strong>Product Weight:</strong>
										<input
											type='text'
											value={editedAttributes?.product_weight || ''}
											onChange={(e) =>
												setEditedAttributes({
													...editedAttributes,
													product_weight: e.target.value,
												})
											}
										/>
									</p>
									<p>
										<strong>SGID:</strong>
										<input
											type='text'
											value={editedAttributes?.sgid || ''}
											onChange={(e) =>
												setEditedAttributes({
													...editedAttributes,
													sgid: e.target.value,
												})
											}
										/>
									</p>
									<button
										onClick={handleSaveEdit}
										style={{
											margin: '10px',
											padding: '10px 20px',
											backgroundColor: '#1E90FF',
											color: 'white',
											border: 'none',
											borderRadius: '4px',
											cursor: 'pointer',
										}}>
										Save
									</button>
									<button
										onClick={handleCancelEdit}
										style={{
											margin: '10px',
											padding: '10px 20px',
											backgroundColor: 'grey',
											color: 'white',
											border: 'none',
											borderRadius: '4px',
											cursor: 'pointer',
										}}>
										Cancel
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			)}

			{view === 'all' && (
				<div
					style={{
						marginTop: '20px',
						textAlign: 'center',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						position: 'absolute',
						bottom: '-40px', // Adjusted to move the pagination to the bottom center
						right: '70%',
						transform: 'translateX(50%)',
					}}>
					<button
						onClick={() => setCurrentPage(currentPage - 1)}
						style={{
							padding: '10px 20px',
							backgroundColor: 'white',
							color: 'black',
							border: 'none',
							borderRadius: '5px',
							cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
							display: 'flex',
							alignItems: 'center',
							marginRight: '10px',
						}}
						disabled={currentPage === 0}>
						<FontAwesomeIcon
							icon={faArrowLeft}
							style={{ marginRight: '5px' }}
						/>
						Previous
					</button>
					<span style={{ margin: '0 20px' }}>
						<span style={{ fontWeight: 'bold' }}>{currentPage + 1}</span>{' '}
						of {Math.ceil(totalImages / itemsPerPage)}
					</span>
					<button
						onClick={() => setCurrentPage(currentPage + 1)}
						style={{
							padding: '10px 20px',
							backgroundColor: 'white',
							color: 'black',
							border: 'none',
							borderRadius: '5px',
							cursor: currentPage >= Math.ceil(totalImages / itemsPerPage) - 1 ? 'not-allowed' : 'pointer',
							display: 'flex',
							alignItems: 'center',
							marginLeft: '10px',
						}}
						disabled={currentPage >= Math.ceil(totalImages / itemsPerPage) - 1}>
						Next
						<FontAwesomeIcon
							icon={faArrowRight}
							style={{ marginLeft: '5px' }}
						/>
					</button>
				</div>
			)}
			<style jsx>{`
				.popup {
					position: absolute;
					background-color: rgba(0, 0, 0, 0.7);
					color: white;
					padding: 10px 20px;
					border-radius: 5px;
					z-index: 1000;
					font-size: 16px;
				}
			`}</style>
		</div>
	);
}
