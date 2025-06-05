async function displayBasket() {
    const basketItems = JSON.parse(localStorage.getItem('basket')) || [];
    const basketContainer = document.getElementById('basket-items');
    const totalPriceContainer = document.getElementById('total-price');
  
    if (!basketContainer || !totalPriceContainer) return;
  
    basketContainer.innerHTML = '';
    totalPriceContainer.innerHTML = '';
  
    if (basketItems.length === 0) {
      basketContainer.innerHTML = '<p>Your basket is empty.</p>';
      return;
    }
  
    let totalPrice = 0;
  
    showLoadingIndicator();
  
    try {
      for (const productId of basketItems) {
        const product = await fetchProductById(productId);
        if (product) {
          const price = product.discountedPrice ?? product.price;
          totalPrice += price;
          displayProductInBasket(product);
        }
      }
  
      totalPriceContainer.innerHTML = `Total Price: $${totalPrice.toFixed(2)}`;
    } catch (error) {
      console.error('Error displaying basket:', error);
      basketContainer.innerHTML = '<p>Error loading basket items. Please try again later.</p>';
    } finally {
      hideLoadingIndicator();
    }
  }
  
  async function fetchProductById(productId) {
    const url = `https://v2.api.noroff.dev/gamehub/${productId}`;
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error ${response.status}: ${JSON.stringify(errorDetails)}`);
      }
  
      const product = await response.json();
      return product?.data ?? null;
    } catch (error) {
      console.error(`Failed to fetch product (ID: ${productId}):`, error);
      return null;
    }
  }
  
  function displayProductInBasket(product) {
    const basketContainer = document.getElementById('basket-items');
    if (!basketContainer) return;
  
    const imageUrl = product.image?.url || './images/fallback-image.jpg';
    const title = product.title || 'Product Title Not Available';
    const price = (product.discountedPrice ?? product.price).toFixed(2);
  
    const productElement = document.createElement('div');
    productElement.className = 'basket-item';
  
    productElement.innerHTML = `
      <div class="basket-item-content">
        <img src="${imageUrl}" alt="${title}" class="basket-item-image" />
        <div class="basket-item-details">
          <h4>${title}</h4>
          <p>Price: $${price}</p>
          <button class="remove-button" onclick="removeFromBasket('${product.id}')">Remove</button>
        </div>
      </div>
    `;
  
    basketContainer.appendChild(productElement);
  }
  
  function removeFromBasket(productId) {
    const basketItems = JSON.parse(localStorage.getItem('basket')) || [];
    const updatedBasket = basketItems.filter(id => id !== productId);
    localStorage.setItem('basket', JSON.stringify(updatedBasket));
    displayBasket();
  }
  
  function confirmOrder() {
    localStorage.removeItem('basket');
    window.location.href = 'confirmation/index.html';
  }
  
  function showLoadingIndicator() {
    const loader = document.getElementById('loading-indicator');
    if (loader) loader.style.display = 'block';
  }
  
  function hideLoadingIndicator() {
    const loader = document.getElementById('loading-indicator');
    if (loader) loader.style.display = 'none';
  }
  
  document.addEventListener('DOMContentLoaded', displayBasket);
  
