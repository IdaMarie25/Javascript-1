// Drop-down menues
const dropdownSize = document.querySelector("#dropdown-size");
const dropdownGender = document.querySelector("#dropdown-gender");
const API = 'https://api.noroff.dev/api/v1/rainy-days';

async function dropdowns() {
    try {
        const response = await fetch(API);
        const products = await response.json();

        const allSizes = new Set();
        const allGenders = new Set();

        products.forEach(product => {
            product.sizes.forEach(size => allSizes.add(size))

            if (product.gender) {
                allGenders.add(product.gender);
            }
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

dropdowns();

//Fetching products
const container = document.querySelector("#container");


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



