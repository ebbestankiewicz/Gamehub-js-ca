let allProducts = [];
let basket = JSON.parse(localStorage.getItem('basket')) || [];

async function fetchProducts() {
    const url = 'https://v2.api.noroff.dev/gamehub';

    try {
        showLoadingIndicator();
        const response = await fetch(url);

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(`Error ${response.status}: ${JSON.stringify(errorDetails)}`);
        }

        const data = await response.json();
        if (data?.data && Array.isArray(data.data)) {
            allProducts = data.data;
            displayProducts(allProducts);
        } else {
            throw new Error('Unexpected response format');
        }
    } catch (error) {
        alert(`Failed to fetch products: ${error.message}`);
    } finally {
        hideLoadingIndicator();
    }
}

function displayProducts(products) {
    const productContainer = document.getElementById('product-container');
    if (!productContainer) return;

    productContainer.innerHTML = ''; 
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';

        const imageUrl = product.image?.url || './images/fallback-image.jpg';
        const priceHtml = product.discountedPrice && product.discountedPrice < product.price
            ? `<p class="strikethrough">$${product.price.toFixed(2)}</p><p>$${product.discountedPrice.toFixed(2)}</p>`
            : `<p>$${product.price.toFixed(2)}</p>`;

        // Correct the link to the product detail page inside 'products' folder
        productElement.innerHTML = `
            <a href="/products/index.html?id=${product.id}">
                <img src="${imageUrl}" alt="${product.title}" />
                <h3>${product.title}</h3>
                ${priceHtml}
            </a>
            <button onclick="addToBasket('${product.id}')">Add to Basket</button>
        `;

        productContainer.appendChild(productElement);
    });
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

function applyFilter() {
    const filterValue = document.getElementById('filter')?.value || 'none';
    let sortedProducts = [...allProducts];

    function getLowestPrice(product) {
        return product.discountedPrice && product.discountedPrice < product.price ? product.discountedPrice : product.price;
    }

    switch (filterValue) {
        case 'price-low-high':
            sortedProducts.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
            break;
        case 'price-high-low':
            sortedProducts.sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
            break;
        case 'age':
            sortedProducts.sort((a, b) => a.ageRating - b.ageRating);
            break;
        case 'release':
            sortedProducts.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
            break;
        case 'genre':
            sortedProducts.sort((a, b) => a.genre.localeCompare(b.genre));
            break;
        case 'sale':
            sortedProducts = sortedProducts.filter(product => product.discountedPrice < product.price);
            break;
        case 'none':
        default:
            break;
    }

    displayProducts(sortedProducts);
}

function showLoadingIndicator() {
    if (!document.getElementById('loading-indicator')) {
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'loading-indicator';
        loadingIndicator.innerText = 'Loading...';
        document.body.appendChild(loadingIndicator);
    }
}

function hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    document.getElementById('filter')?.addEventListener('change', applyFilter);
});
