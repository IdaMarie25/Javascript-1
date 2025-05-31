
// Write an async function to fetch products from your API.

//Display a loading indicator while fetching.

//Handle errors gracefully (show user an alert or message).

//Render the product list dynamically into the HTML.

//Implement filtering controls.





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
       <h3>${product.title}</h3>
       <img src="${product.image}" alt="${product.title}"/>
       <p>${product.price} kroner</p>
       `;

       container.appendChild(productItem);
    });

}

gettingProducts();



        /*
        const json = await response.json()
        const products = json.data;

        products.forEach(product => {
            const card = document.createElement("div")
            const image = document.createElement("img")
            const content = document.createElement("div")
            const title = document.createElement("h2")
            const price = document.createElement("p")

            card.className = 'card'
            image.className = 'card-image'
            content.className = 'card-content'
            title.className = 'card-title'
            price.className = 'card-price'

            image.src = product.image.url
            image.alt = product.image.alt
            title.textContent = product.title
            price.textContent = product.price

            content.appendChild(title)
            content.appendChild(price)
            card.appendChild(image)
            card.appendChild(content)

            container.appendChild(card)
        });
        } catch (error) {
            console.error("Failed to fetch and create product", error)
        }*/