
const container = document.querySelector("#container");
const API = 'https://api.noroff.dev/api/v1/rainy-days';

async function gettingProducts() {
    try {
        const response = await fetch(API)
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const products = await response.json();

        displayProducts(products);
        } catch (error) {
            alert('Error fetching products: ' + error.message);
        }
    }

function displayProducts(products) {
    const container = document.querySelector('#container');
    container.innerHTML = '';

    products.forEach(product => {
       const productItem = document.createElement('div');
       productItem.className = 'product-item';

       productItem.innerHTML = `
        <a href="products/specific.html?id=${product.id}">
            <h3>${product.title}</h3>
            <img src="${product.image}" alt="${product.title}"/>
            <p>${product.price} kroner</p>
        </a>
       `;

       container.appendChild(productItem);
    });

}

gettingProducts();

