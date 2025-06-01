// Drop-down menues and filtering products
const dropdownSize = document.querySelector("#dropdown-size");
const dropdownGender = document.querySelector("#dropdown-gender");
const shoppingcartContent = document.querySelector(".shoppingcart-content");
const container = document.querySelector("#container");
const API = 'https://api.noroff.dev/api/v1/rainy-days';

let allProducts = [];

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
        <a href="products/specific.html?id=${product.id}">
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

    const shoppingcartBox = document.createElement("div");
    shoppingcartBox.classList.add("shoppingcart-box");
    shoppingcartBox.innerHTML = `
    <img src="${productImage}"/>
    <div class="shoppingcart-detail"> 
        <h3>${productTitle}</h3>
        <p class="shoppingcart-price">${productPrice},-</p>
        <div class="shoppingcart-quantity">
            <button id="minus">-</button>
            <p class="number">1</p>
            <button id="pluss">+</button>
        </div>
    </div>
    <i class="fa-solid fa-trash shoppingcart-trash"></i>
    `;

    shoppingcartContent.appendChild(shoppingcartBox); 

    shoppingcartBox.querySelector(".shoppingcart-trash").addEventListener("click", () => {
        shoppingcartBox.remove();

        totalPrice();
    })

    shoppingcartBox.querySelector(".shoppingcart-quantity").addEventListener("click", (event) => {
        const number = shoppingcartBox.querySelector(".number");
        const minusButton = shoppingcartBox.querySelector("#minus");
        let quantity = parseInt(number.textContent); 

        if (event.target.id === "minus" && quantity > 1) {
            quantity--;
        } else if (event.target.id === "pluss") {
            quantity++;
        }

        number.textContent = quantity;
        totalPrice();
    });

    totalPrice();
};

const totalPrice = () => {
    const totalPriceElement = document.querySelector(".total-price");
    const shoppingcartBoxes = shoppingcartContent.querySelectorAll(".shoppingcart-detail");
    let total = 0;

    shoppingcartBoxes.forEach(shoppingcartBox => {
        const priceElement = shoppingcartBox.querySelector(".shoppingcart-price");
        const quantityElement = shoppingcartBox.querySelector(".number");
        const price = parseFloat(priceElement.textContent.replace(/[^\d.-]/g, ""));
        const quantity = parseInt (quantityElement.textContent);
        total += price * quantity; 
    });

    totalPriceElement.textContent = `${total.toFixed(2)} kr`;

};


