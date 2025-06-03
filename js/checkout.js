document.addEventListener("DOMContentLoaded", () => {
    const summaryContainer = document.querySelector("#checkout-summary");
    const totalElement = document.querySelector("#checkout-total");

    const shoppingcart = JSON.parse(localStorage.getItem("cart")) || [];

    if (shoppingcart.length === 0) {
        summaryContainer.innerHTML = "<p>Your cart i empty. </p>";
        totalElement.textContent = "";
        return;
    }

    let total = 0;

    shoppingcart.forEach(item => { 
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("checkout-item");

        const price = parseFloat(item.price.replace(/[^\d.-]/g, ""));
        const subtotal = price * item.quantity;
        total += subtotal;

        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="checkout-image">
            <h3>${item.title}</h3>
            <p>Price: ${item.price}</p>
            <p>Quantity: ${item.quantity}</p>
            <p>Subtotal: ${subtotal.toFixed(2)} kr</p>
            `;
        summaryContainer.appendChild(itemDiv);
    });

    totalElement.textContent = `Total: ${total.toFixed(2)} kr`;

    const checkoutForm = document.querySelector(".checkout-form");

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function () {
            localStorage.removeItem("cart");
        });
    }


});