"use strict";


const pizzas = [
    { id: "cheese", name: "Cheese", price: 8.50 },
    { id: "pepperoni", name: "Pepperoni", price: 8.50 },
    { id: "hawaiian", name: "Hawaiian", price: 8.50 },
    { id: "bbq-chicken", name: "BBQ Chicken", price: 8.50 },
    { id: "meat-lovers", name: "Meat Lovers", price: 8.50 },
    { id: "vegetarian", name: "Vegetarian", price: 8.50 },
    { id: "supreme", name: "Supreme", price: 8.50 },
    { id: "butter-chicken", name: "Butter Chicken", price: 13.50 },
    { id: "seafood", name: "Seafood", price: 13.50 },
    { id: "mexican", name: "Mexican", price: 13.50 },
    { id: "garlic-chicken", name: "Garlic Chicken", price: 13.50 },
    { id: "peri-peri", name: "Peri Peri", price: 13.50 }
];

const MAX_PIZZAS = 5;
const DELIVERY_FEE = 3.00;

function getElement(id) {
    return document.getElementById(id);
}

function money(amount) {
    return "$" + amount.toFixed(2);
}

function getCart() {
    try {
        return JSON.parse(localStorage.getItem("pizzaCart")) || {};
    } catch {
        return {};
    }
}

function saveCart(cart) {
    localStorage.setItem("pizzaCart", JSON.stringify(cart));
}

function getPizza(id) {
    return pizzas.find(pizza => pizza.id === id);
}

function pizzaCount() {
    return Object.values(getCart()).reduce(
        (total, quantity) => total + quantity, 0
    );
}

function getSubtotal() {
    const cart = getCart();
    let total = 0;

    for (const id in cart) {
        const pizza = getPizza(id);

        if (pizza) {
            total += pizza.price * cart[id];
        }
    }

    return total;
}


function addPizza(id) {
    const cart = getCart();

    if (pizzaCount() >= MAX_PIZZAS) {
        alert("You can only order a maximum of 5 pizzas.");
        return;
    }

    cart[id] = (cart[id] || 0) + 1;
    saveCart(cart);

    renderMenu();
}


function renderMenu() {
    const grid = getElement("pizza-grid");

    if (!grid) return;

    grid.innerHTML = "";

    pizzas.forEach((pizza, index) => {
        const card = document.createElement("article");
        card.className = "pizza-card";

        const heading = document.createElement("h3");
        heading.textContent = pizza.name;

        const type = document.createElement("p");
        type.textContent = index < 7 ? "Regular Pizza" : "Gourmet Pizza";

        const price = document.createElement("p");
        price.textContent = money(pizza.price);

        const button = document.createElement("button");
        button.className = "button primary";
        button.textContent = "Add Pizza";
        button.disabled = pizzaCount() >= MAX_PIZZAS;
        button.addEventListener("click", () => addPizza(pizza.id));

        card.append(heading, type, price, button);
        grid.appendChild(card);
    });

    const count = getElement("menu-cart-count");
    const total = getElement("menu-cart-total");

    if (count) count.textContent = pizzaCount();
    if (total) total.textContent = "Subtotal: " + money(getSubtotal());
}


function changeQuantity(id, amount) {
    const cart = getCart();

    if (amount > 0 && pizzaCount() >= MAX_PIZZAS) {
        alert("Maximum 5 pizzas allowed.");
        return;
    }

    cart[id] = (cart[id] || 0) + amount;

    if (cart[id] <= 0) {
        delete cart[id];
    }

    saveCart(cart);
    renderOrder();
}


function renderOrder() {
    const container = getElement("order-items");

    if (!container) return;

    const cart = getCart();
    container.innerHTML = "";

    for (const id in cart) {
        const pizza = getPizza(id);
        if (!pizza) continue;

        const row = document.createElement("div");
        row.className = "order-item";

        const details = document.createElement("span");
        details.textContent =
            `${pizza.name} - ${money(pizza.price)} x ${cart[id]}`;

        const minus = document.createElement("button");
        minus.textContent = "-";
        minus.addEventListener("click", () => changeQuantity(id, -1));

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.addEventListener("click", () => changeQuantity(id, 1));

        row.append(details, minus, plus);
        container.appendChild(row);
    }

    const empty = getElement("empty-order");
    if (empty) empty.hidden = pizzaCount() !== 0;

    const delivery =
        document.querySelector('input[name="fulfilment"]:checked')
        ?.value === "delivery";

    const deliveryFee =
        delivery && pizzaCount() > 0 ? DELIVERY_FEE : 0;

    getElement("summary-count").textContent = pizzaCount();
    getElement("summary-subtotal").textContent = money(getSubtotal());
    getElement("summary-delivery").textContent = money(deliveryFee);
    getElement("summary-total").textContent =
        money(getSubtotal() + deliveryFee);

    getElement("confirm-order").disabled = pizzaCount() === 0;
}


function updateDelivery() {
    const delivery =
        document.querySelector('input[name="fulfilment"]:checked')
        ?.value === "delivery";

    getElement("delivery-fields").hidden = !delivery;
    getElement("customer-address").required = delivery;
    getElement("customer-phone").required = delivery;

    renderOrder();
}


function cancelOrder() {
    if (confirm("Are you sure you want to cancel your order?")) {
        saveCart({});
        window.location.href = "menu.html";
    }
}


function confirmOrder(event) {
    event.preventDefault();

    const cart = getCart();
    const name = getElement("customer-name").value.trim();

    const fulfilment =
        document.querySelector('input[name="fulfilment"]:checked').value;

    const address = getElement("customer-address").value.trim();
    const phone = getElement("customer-phone").value.trim();

    if (pizzaCount() === 0 || pizzaCount() > MAX_PIZZAS) {
        alert("Please select between 1 and 5 pizzas.");
        return;
    }

    if (!name) {
        alert("Please enter your name.");
        return;
    }

    if (fulfilment === "delivery" && (!address || !phone)) {
        alert("Please enter your delivery address and phone number.");
        return;
    }

    const items = [];

    for (const id in cart) {
        const pizza = getPizza(id);

        if (!pizza) continue;

        items.push({
            name: pizza.name,
            price: pizza.price,
            quantity: cart[id],
            lineTotal: pizza.price * cart[id]
        });
    }

    const subtotal = getSubtotal();
    const deliveryFee =
        fulfilment === "delivery" ? DELIVERY_FEE : 0;

    const order = {
        orderNumber: "DP-" + Date.now(),
        date: new Date().toLocaleString("en-NZ"),
        customer: {
            name: name,
            fulfilment: fulfilment,
            address: fulfilment === "delivery" ? address : "",
            phone: fulfilment === "delivery" ? phone : ""
        },
        items: items,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: subtotal + deliveryFee
    };

    const orders = JSON.parse(localStorage.getItem("pizzaOrders") || "[]");
    orders.push(order);

    localStorage.setItem("pizzaOrders", JSON.stringify(orders));
    localStorage.setItem("lastPizzaOrder", JSON.stringify(order));

    saveCart({});

    window.location.href = "receipt.html";
}


function renderReceipt() {
    const container = getElement("receipt-content");
    if (!container) return;

    const order = JSON.parse(localStorage.getItem("lastPizzaOrder") || "null");

    if (!order) {
        container.textContent = "No order found.";
        return;
    }

    container.innerHTML = "";

    function addLine(label, value) {
        const paragraph = document.createElement("p");
        paragraph.textContent = `${label}: ${value}`;
        container.appendChild(paragraph);
    }

    addLine("Order Number", order.orderNumber);
    addLine("Date", order.date);
    addLine("Customer", order.customer.name);
    addLine("Order Type", order.customer.fulfilment);

    if (order.customer.fulfilment === "delivery") {
        addLine("Address", order.customer.address);
        addLine("Phone", order.customer.phone);
    }

    const heading = document.createElement("h3");
    heading.textContent = "Pizzas Ordered";
    container.appendChild(heading);

    order.items.forEach(item => {
        addLine(
            item.name,
            `${item.quantity} x ${money(item.price)} = ${money(item.lineTotal)}`
        );
    });

    addLine("Subtotal", money(order.subtotal));
    addLine("Delivery Fee", money(order.deliveryFee));
    addLine("TOTAL", money(order.total));

    const download = getElement("download-receipt");

    if (download) {
        download.addEventListener("click", () => {
            const receiptText = container.innerText;

            const blob = new Blob(
                [receiptText],
                { type: "text/plain" }
            );

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "DreamPizzaReceipt.txt";
            link.click();

            URL.revokeObjectURL(url);
        });
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;

    if (page === "menu") {
        renderMenu();
    }

    if (page === "order") {
        renderOrder();

        document.querySelectorAll('input[name="fulfilment"]')
            .forEach(input => {
                input.addEventListener("change", updateDelivery);
            });

        getElement("checkout-form")
            .addEventListener("submit", confirmOrder);

        getElement("cancel-order")
            .addEventListener("click", cancelOrder);

        updateDelivery();
    }

    if (page === "receipt") {
        renderReceipt();

        getElement("new-order")
            .addEventListener("click", () => {
                saveCart({});
                window.location.href = "menu.html";
            });
    }
});