//Product specific page

const ProductSpecificContainer = document.querySelector("#specific-product");
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const productId = params.get("id");

const API = `https://api.noroff.dev/api/v1/rainy-days/${productId}`;


async function gettingProduct() {
    try {
        const response = await fetch(API)
        if (!response.ok) {
            throw new Error('Failed to fetch product');
        }
        const product = await response.json();

        ProductSpecificContainer.innerHTML = `
        <img src="${product.image}" alt="${product.title}"/>
        <h1>${product.title}</h1> 
        <h2>${product.description}</h2>
        <h3>Price ${product.price} kroner</h3>
        <p>Size ${product.sizes}</p>
        <button>Add to the Cart</button>
        `;
    } catch (error) {
        console.error("Cant fetch product");
    }
 }

gettingProduct();
