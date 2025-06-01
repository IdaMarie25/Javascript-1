// Drop-down menues and filtering products
const dropdownSize = document.querySelector("#dropdown-size");
const dropdownGender = document.querySelector("#dropdown-gender");
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




