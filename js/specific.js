//Product specific page

const productSpecificContainer = document.querySelector("#specific-product");
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const productId = params.get("id");

const API = `https://api.noroff.dev/api/v1/rainy-days/${productId}`;


function updateCartCount() {
    const shoppingcart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = shoppingcart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.querySelector("#cart-count");

    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}


async function gettingProduct() {
    try {
        const response = await fetch(API)
        if (!response.ok) {
            throw new Error('Failed to fetch product');
        }
        
        const product = await response.json();

        const sizeOptions = product.sizes
            .map(size => `<option value="${size}">${size}</option>`)
            .join("");

        productSpecificContainer.innerHTML = `
            <img src="${product.image}" alt="${product.title}"/>
            <h1>${product.title}</h1> 
            <h2>${product.description}</h2>
            <h3>Price ${product.price} kroner</h3>
            <label for="select-size">Size:</label>
            <select id="select-size">${sizeOptions}</select>
            <button id="add-to-cart-button">Add to Cart</button>
        `;

        const addToCartButton = document.querySelector("#add-to-cart-button");
        
        addToCartButton.addEventListener("click", () => {
            const selectedSize = document.querySelector("#select-size").value;
            const shoppingcart = JSON.parse(localStorage.getItem("cart"))|| [];
            const existingItem = shoppingcart.find(item => 
                item.id === product.id && item.size === selectedSize
            );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                shoppingcart.push({
                    id: product.id, 
                    image: product.image, 
                    title: product.title, 
                    price: `${product.price} kr`,
                    size: selectedSize, 
                    quantity: 1
                }); 
            }

            localStorage.setItem("cart", JSON.stringify(shoppingcart)); 
            alert("Added to cart"); 
            updateCartCount();
        }); 

    } catch (error) {
        console.error("Cant fetch product");
        productSpecificContainer.innerHTML = "<p>Error loading product.</p>";
    }
 }

gettingProduct();
updateCartCount()

