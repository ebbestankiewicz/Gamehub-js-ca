
async function fetchProductById(productId) {
    const url = `https://v2.api.noroff.dev/gamehub/${productId}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(`Error ${response.status}: ${JSON.stringify(errorDetails)}`);
        }

        const product = await response.json();
        if (product?.data) {
            displayProduct(product.data);
        } else {
            throw new Error('Product data is not in the expected format');
        }
    } catch (error) {
        console.error('Failed to fetch product:', error);
        alert(`Error fetching product: ${error.message}`);
    }
}


function displayProduct(productData) {
    const productContainer = document.getElementById('product-details');
    if (!productContainer) return;

    const imageUrl = productData.image?.url || './images/fallback-image.jpg';
    const title = productData.title || 'Product Title Not Available';
    const description = productData.description || 'No description available.';
    const price = typeof productData.price === 'number' ? productData.price.toFixed(2) : 'N/A';
    const discountedPrice = typeof productData.discountedPrice === 'number' ? productData.discountedPrice.toFixed(2) : 'N/A';
    const ageRating = productData.ageRating || 'Not Rated';

    productContainer.innerHTML = `
        <h2>${title}</h2>
        <img src="${imageUrl}" alt="${title}" />
        <p>${description}</p>
        <p><strong>Age Rating:</strong> ${ageRating}</p>
        <p><strong>Price:</strong> $${price}</p>
        ${discountedPrice < price ? `<p><strong>Discounted Price:</strong> $${discountedPrice}</p>` : ''}
        <button onclick="addToBasket('${productData.id}')">Add to Basket</button>
    `;
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


document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        fetchProductById(productId);
    } else {
        alert('Product ID not found!');
    }
});
