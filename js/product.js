//Product specific page

const productSpecificContainer = document.querySelector("#specific-product");
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const productId = params.get("id");
const shoppingcartContent = document.querySelector(".shoppingcart-content");
const cartCount = document.querySelector("#cart-count")

const API = `https://api.noroff.dev/api/v1/rainy-days/${productId}`;




async function gettingProduct() {
    try {
        const response = await fetch(API)
        if (!response.ok) {
            throw new Error('Failed to fetch product');
        }
        
        const product = await response.json();

        productSpecificContainer.innerHTML = `
            <img src="${product.image}" alt="${product.title}"/>
            <h1>${product.title}</h1> 
            <h2>${product.description}</h2>
            <h3>Price ${product.price}</h3>
            <p>Color: ${product.baseColor}</p>
            <p>Available sizes: ${product.sizes.join(" ")}</p>
            <button id="add-to-cart-button">Add to Cart</button>
        `;

        document 
            .querySelector("#add-to-cart-button")
            .addEventListener("click", () => {
                addToCart(product);
            });
            
        renderCart(getCart());
        updateCartCount();
    } catch (error) {
        console.error("Cant fetch product");
        productSpecificContainer.innerHTML = "<p>Error loading product.</p>";
    }

    const buyButton = document.querySelector(".buy-button");

    if (buyButton) {
        buyButton.addEventListener("click", () => {
            window.location.href = "../checkout/index.html";
        });
    };
 }

 function addToCart(product) {
    let shoppingcart = getCart();

    const existing = shoppingcart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity++;
    } else {
        shoppingcart.push({
            id: product.id, 
            image: product.image,
            title: product.title, 
            price: `${product.price} kr`, 
            quantity: 1,
        });
    }

    saveCart(shoppingcart);
    renderCart(shoppingcart);
    updateCartCount();
    alert("Added to cart");
 }

function renderCart(shoppingcart) {
    let shoppingcartContainer = document.querySelector(".shoppingcart-content");
    if (!shoppingcartContainer) {
        shoppingcartContainer = document.createElement("div");
        shoppingcartContainer.classList.add("shoppingcart-content");
        productSpecificContainer.appendChild(shoppingcartContainer);
    }

    shoppingcartContainer.innerHTML = "";

    if (shoppingcart.length === 0) {
        shoppingcartContainer.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    shoppingcart.forEach((item) => {
        const shoppingcartBox = document.createElement("div");
        shoppingcartBox.classList.add("shoppingcart-box");
        shoppingcartBox.innerHTML = `
            <img src="${item.image}"/>
            <div class="shoppingcart-detail">
                <h3>${item.title}</h3>
                <p class="shoppingcart-price">${item.price}</p>
                <div class="shoppingcart-quantity">
                    <button class="minus">-</button>
                    <p class="number">${item.quantity}</p>
                    <button class="plus">+</button>
                </div>
                <i class="fa-solid fa-trash shoppingcart-trash"></i>
            </div>
            `;

            shoppingcartBox.querySelector(".minus").addEventListener("click", () => {
                updateQuantity(item.id, -1);
            });

            shoppingcartBox.querySelector(".plus").addEventListener("click", () => {
                updateQuantity(item.id, 1);
            });

            shoppingcartBox
                .querySelector(".shoppingcart-trash")
                .addEventListener("click", () => {
                    removeFromCart(item.id)
                });
                
            shoppingcartContainer.appendChild(shoppingcartBox);
        });


}

function updateQuantity(id, change) {
    let shoppingcart = getCart();
    const item = shoppingcart.find(i => i.id === id);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity < 1) {
        shoppingcart = shoppingcart.filter
            (i => !(i.id !== id)
        );
    }

    saveCart(shoppingcart);
    renderCart(shoppingcart);
    updateCartCount();
}

function removeFromCart(id) {
    let shoppingcart = getCart();
    shoppingcart = shoppingcart.filter(item => item.id !== id);
    saveCart(shoppingcart);
    renderCart(shoppingcart);
    updateCartCount();
}

function updateCartCount() {
    const shoppingcart = getCart();
    const totalItems = shoppingcart.reduce((sum, item) => sum + item.quantity, 0);

    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

function getCart() {
    return JSON.parse(localStorage.getItem("cart"))|| [];
}

function saveCart(shoppingcart) {
    localStorage.setItem("cart", JSON.stringify(shoppingcart));
}

gettingProduct();

const shoppingbagIcon = document.querySelector("#shoppingbag-icon");
const shoppingcart = document.querySelector(".shoppingcart");
const shoppingcartClose = document.querySelector("#shoppingcart-close");

shoppingbagIcon.addEventListener("click", () => shoppingcart.classList.add("active"));
shoppingcartClose.addEventListener("click", () => shoppingcart.classList.remove("active")); 
