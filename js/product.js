async function fetchProductById(productId) {
    const url = `https://v2.api.noroff.dev/gamehub/${productId}`;
  
    try {
      showLoadingIndicator();
      console.log("Fetching product by ID:", productId);
  
      const response = await fetch(url);
  
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error(`Error ${response.status}: ${JSON.stringify(errorDetails)}`);
        alert(`Error fetching product: ${errorDetails.message}`);
        return;
      }
  
      const result = await response.json();
      const product = result?.data;
      console.log('Fetched Product:', product);
  
      if (product && product.id) {
        displayProduct(product);
      } else {
        throw new Error('Product data is missing or in the wrong format');
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      alert(`Error fetching product: ${error.message}`);
    } finally {
      hideLoadingIndicator();
    }
  }
  
  function displayProduct(productData) {
    const productContainer = document.getElementById('product-details');
    if (!productContainer) {
      console.error('Product details container not found!');
      alert("Error: Product details container not found!");
      return;
    }
  
    console.log('Displaying Product:', productData);
  
    const imageUrl = productData.image?.url || '../../images/fallback-image.jpg';
    const title = productData.title || 'Product Title Not Available';
    const description = productData.description || 'No description available.';
    const price = typeof productData.price === 'number'
      ? productData.price.toFixed(2)
      : 'N/A';
    const discountedPrice = typeof productData.discountedPrice === 'number'
      ? productData.discountedPrice.toFixed(2)
      : null;
    const ageRating = productData.ageRating || 'Not Rated';
  
    const productHTML = `
      <h2>${title}</h2>
      <img src="${imageUrl}" alt="${title}" style="width: 100%; max-width: 300px;" />
      <p>${description}</p>
      <p><strong>Age Rating:</strong> ${ageRating}</p>
      <p><strong>Price:</strong> $${price}</p>
      ${discountedPrice && discountedPrice < price ? `<p><strong>Discounted Price:</strong> $${discountedPrice}</p>` : ''}
      <button onclick="addToBasket('${productData.id}')">Add to Basket</button>
    `;
    
    console.log('Generated HTML:', productHTML);
  
    productContainer.innerHTML = productHTML;
  }
  
  function addToBasket(productId) {
    if (!productId) return;
  
    const basketItems = JSON.parse(localStorage.getItem('basket')) || [];
    if (!basketItems.includes(productId)) {
      basketItems.push(productId);
      localStorage.setItem('basket', JSON.stringify(basketItems));
      alert('Product added to basket!');
    } else {
      alert('Product is already in the basket.');
    }
  }
  
  function showLoadingIndicator() {
    const loader = document.getElementById('loading-indicator');
    if (loader) loader.style.display = 'block';
  }
  
  function hideLoadingIndicator() {
    const loader = document.getElementById('loading-indicator');
    if (loader) loader.style.display = 'none';
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
  
    if (productId) {
      fetchProductById(productId);
    } else {
      alert('Product ID not found!');
      console.error('Product ID not found in URL.');
    }
  });
