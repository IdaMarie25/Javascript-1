// Drop-down menues and filtering products
const dropdownSize = document.querySelector("#dropdown-size");
const dropdownGender = document.querySelector("#dropdown-gender");
const shoppingcartContent = document.querySelector(".shoppingcart-content");
const cartCount = document.querySelector("#cart-count")
const container = document.querySelector("#container");
const API = 'https://api.noroff.dev/api/v1/rainy-days';

let allProducts = [];

document.addEventListener("DOMContentLoaded", () => {
    const savedCart = getCart();
    savedCart.forEach(item => renderCartItem(item));
    updateCartTotal();
    updateCartCount();

    const buyButton = document.querySelector(".buy-button");

    if (buyButton) {
        buyButton.addEventListener("click", () => {
            window.location.href = "checkout/index.html";
        });
    };
});

async function prepareAndLoad() {
    try {
        const response = await fetch(API)
        const products = await response.json();
        allProducts = products; 

        dropdowns(products);
        displayProducts(products);
    } catch (error) {
        console.error("Failed to prepare and load", error);
    }
}

async function dropdowns(products) {
    try {
        const allSizes = new Set();
        const allGenders = new Set();

        products.forEach(product => {
            product.sizes.forEach(size => allSizes.add(size))
            if (product.gender) allGenders.add(product.gender);
        });  

        allSizes.forEach(size => {
            const option = document.createElement("option");
            option.value = size;
            option.textContent = size;
            dropdownSize.appendChild(option);
        })

        allGenders.forEach(gender => {
            const option = document.createElement("option");
            option.value = gender;
            option.textContent = gender;
            dropdownGender.appendChild(option);
        })
    } catch (error) {
        console.error("Failed to fetch sizes:", error);
    }
}

//Fetching products


function displayProducts(products) {
    container.innerHTML = '';

    products.forEach(product => {
       const productItem = document.createElement('div');
       productItem.className = 'product-item product-box';

       productItem.innerHTML = `
        <a href="product/index.html?id=${product.id}">
            <img src="${product.image}" alt="${product.title}"/>
            <h3>${product.title}</h3>
            <p>${product.price} kroner</p>
        </a>
        <button class="addbutton">Add to cart</button>
       `;

       container.appendChild(productItem);
    });
}

function filterProducts() {
    const selectedSize = dropdownSize.value;
    const selectedGender = dropdownGender.value;

    const filtered = allProducts.filter(product => {
        const matchesSize = selectedSize === "" || product.sizes.includes(selectedSize);
        const matchesGender = selectedGender === "" || product.gender.includes(selectedGender);
        return matchesSize && matchesGender;
    });
    displayProducts(filtered);
}

dropdownSize.addEventListener("change", filterProducts);
dropdownGender.addEventListener("change", filterProducts);

prepareAndLoad();


const shoppingbagIcon = document.querySelector("#shoppingbag-icon");
const shoppingcart = document.querySelector(".shoppingcart");
const shoppingcartClose = document.querySelector("#shoppingcart-close");

shoppingbagIcon.addEventListener("click", () => shoppingcart.classList.add("active"));
shoppingcartClose.addEventListener("click", () => shoppingcart.classList.remove("active")); 

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("addbutton")) {
        const productBox = e.target.closest(".product-item");
        addToCart(productBox);
    }
});

function addToCart(productBox) {
    const productImage = productBox.querySelector("img").src;
    const productTitle = productBox.querySelector("h3").textContent;
    const productPrice = productBox.querySelector("p").textContent;

    let shoppingcart = getCart();
    const existing = shoppingcart.find(item => item.title === productTitle);

    if (existing) {
        existing.quantity += 1;
    } else {
        shoppingcart.push({ image: productImage, title: productTitle, price: productPrice, quantity: 1});
    }

    saveCart(shoppingcart);
    renderCart(shoppingcart);
    updateCartTotal();
    updateCartCount();
}

function renderCart (shoppingcart) {
    shoppingcartContent.innerHTML = "";
    shoppingcart.forEach(item => renderCartItem(item));
}

function renderCartItem(item) {
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
    </div>
    <i class="fa-solid fa-trash shoppingcart-trash"></i>
    `;

  shoppingcartBox.querySelector(".minus").addEventListener("click", () => {
        updateQuantity(item.title, -1);
  });
  shoppingcartBox.querySelector(".plus").addEventListener("click", () => {
    updateQuantity(item.title, 1);
    });
    shoppingcartBox.querySelector(".shoppingcart-trash").addEventListener("click", () => {
        removeFromCart(item.title);
  });

    shoppingcartContent.appendChild(shoppingcartBox); 

}

function updateQuantity(title, change) {
    let shoppingcart = getCart();
    const item = shoppingcart.find(i => i.title === title);
    if (!item) return;

    item.quantity += change;
    if (item.quantity < 1) {
        shoppingcart = shoppingcart.filter(i => i.title !== title);
    }

    saveCart(shoppingcart);
    renderCart(shoppingcart);
    updateCartTotal();
    updateCartCount();
}

function removeFromCart(title) {
    let shoppingcart = getCart();
    shoppingcart = shoppingcart.filter(item => item.title !== title);
    saveCart(shoppingcart);
    renderCart(shoppingcart);
    updateCartTotal();
    updateCartCount();
}

function updateCartTotal () {
    const totalPriceElement = document.querySelector(".total-price");
    const shoppingcart = getCart();
    let total = 0;

    shoppingcart.forEach(item => {
        const price = parseFloat(item.price.replace(/[^\d.-]/g, ""));
        total += price * item.quantity;
    });

    totalPriceElement.textContent = `${total.toFixed(2)} kr`;
}

function updateCartCount() {
    const shoppingcart = getCart();
    const totalItems = shoppingcart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(shoppingcart) {
    localStorage.setItem("cart", JSON.stringify(shoppingcart));
}





