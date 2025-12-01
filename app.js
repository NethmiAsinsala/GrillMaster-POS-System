localStorage.clear();

function load(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (e) {
        return null;
    }
}

function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

let products = load("products") || [];
let customers = load("customers") || [];
let orders = load("orders") || [];
let cart = [];

loadDefaultProducts();

function loadDefaultProducts() {
    if (products.length === 0) {
        products = [
            {id: Date.now() + 1, name: "Smashed Chicken Burger", category: "Burgers", price: 1200, image:"assets/img/smashed-chicken-burgers.jpg" },
            {id: Date.now() + 2, name: "Greek Chicken Burger", category: "Burgers", price: 1500, image:"assets/img/Greek-Chicken-Burger.jpg" },
            {id: Date.now() + 3, name: "Crispy Fried Chicken Burger", category: "Burgers", price: 1800, image:"assets/img/Crispy-fried-chicken-burgers.jpg" },
            {id: Date.now() + 4, name: "Juicy Chicken Burger", category: "Burgers", price: 2000, image:"assets/img/Juicy-Chicken-Burgers.jpg" },
            {id: Date.now() + 5, name: "Aired Chicken Burger", category: "Burgers", price: 2200, image:"assets/img/aired-chicken-burgers.jpg" },
            {id: Date.now() + 6, name: "Baked Fries", category: "Fries", price: 900, image:"assets/img/baked-fries.jpg" },
            {id: Date.now() + 7, name: "Regular Fries", category: "Fries", price: 600, image:"assets/img/regular-french-friesjpg.jpg" },
            {id: Date.now() + 8, name: "Coca Cola buddy", category: "Drinks", price: 120, image:"assets/img/cocacola-buddy.jpg" },
            {id: Date.now() + 9, name: "Coca Cola Can", category: "Drinks", price: 300, image:"assets/img/cocacola-tin.jpeg" },
            {id: Date.now() + 10, name: "Coca Cola Cup", category: "Drinks", price: 200, image:"assets/img/coak.jpg" },
            {id: Date.now() + 11, name: "Pepsi Cup", category: "Drinks", price: 200, image:"assets/img/pepsi-cup.jpg" },
            {id: Date.now() + 12, name: "Pepsi Bottle", category: "Drinks", price: 500, image:"assets/img/pepsi-bottle.jpg" },
            {id: Date.now() + 13, name: "Sprite Can", category: "Drinks", price: 200, image:"assets/img/sprite-can.jpg" }
        ];
        save("products", products);
    }
}

function renderProductCatalog() {
    let catalog = document.getElementById("productList");
    let category = document.getElementById("categoryFilter").value;
    let search = document.getElementById("searchProduct").value.toLowerCase();
    catalog.innerHTML = "";
    products
        .filter(p => (category === "all" || p.category === category))
        .filter(p => p.name.toLowerCase().includes(search))
        .forEach(p => {
            catalog.innerHTML += `
                <div class="product" onclick="addToCart(${p.id})">
                 <img src="${p.image}" alt="${p.name}" class="product-image">
                    <strong>${p.name}</strong>
                    <div>LKR ${p.price}</div>
                </div>
            `;
        });
}

document.getElementById("categoryFilter").addEventListener("change", renderProductCatalog);
document.getElementById("searchProduct").addEventListener("input", renderProductCatalog);

function generateOrderId() {
    let count = load("orderCount") || 1;
    save("orderCount", count + 1);
    return "OR" + count.toString().padStart(3, "0");
}

function hideAllPanels() {
    document.getElementById("panel-products").style.display = "none";
    document.getElementById("panel-customers").style.display = "none";
    document.getElementById("panel-orders").style.display = "none";
}
function clearPanelContent() {
    document.getElementById("productList").innerHTML = "";
    document.getElementById("productsList").innerHTML = "";

    document.getElementById("customersList").innerHTML = "";

    document.getElementById("ordersList").innerHTML = "";

    document.getElementById("subtotal").textContent = "0.00";
    document.getElementById("tax").textContent = "0.00";
    document.getElementById("total").textContent = "0.00";
}


function showProducts() {
    hideAllPanels();
    clearPanelContent();
    document.getElementById("panel-products").style.display = "block";
    renderProductsList();
}

function showCustomers() {
    hideAllPanels();
    clearPanelContent();
    document.getElementById("panel-customers").style.display = "block";
    renderCustomersList();
}

function showOrders() {
    hideAllPanels();
    clearPanelContent();
    document.getElementById("panel-orders").style.display = "block";
    renderOrdersList();
}

document.getElementById("productForm").addEventListener("submit", function(e) {
    e.preventDefault();
    let product = {
        id: Date.now(),
        name: document.getElementById("pName").value,
        category: document.getElementById("pCategory").value,
        price: parseFloat(document.getElementById("pPrice").value)
    };
    products.push(product);
    save("products", products);
    renderProductsList();
    renderProductCatalog();
    this.reset();
});

function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    save("products", products);
    renderProductsList();
    renderProductCatalog();
}

function renderProductsList() {
    let list = document.getElementById("productsList");
    list.innerHTML = "";
    products.forEach(p => {
        list.innerHTML += `
            <div class="row">
                <span>${p.name} - LKR ${p.price}</span>
                <button class="btn danger" onclick="deleteProduct(${p.id})">X</button>
            </div>
        `;
    });
}

document.getElementById("customerForm").addEventListener("submit", function(e) {
    e.preventDefault();
    let customer = {
        id: Date.now(),
        name: document.getElementById("cName").value,
        contact: document.getElementById("cContact").value
    };
    customers.push(customer);
    save("customers", customers);
    renderCustomersList();
    renderCustomerDropdown();
    this.reset();
});

function deleteCustomer(id) {
    customers = customers.filter(c => c.id !== id);
    save("customers", customers);
    renderCustomersList();
    renderCustomerDropdown();
}

function renderCustomersList() {
    let list = document.getElementById("customersList");
    list.innerHTML = "";
    customers.forEach(c => {
        list.innerHTML += `
            <div class="row">
                <span>${c.name} (${c.contact})</span>
                <button class="btn danger" onclick="deleteCustomer(${c.id})">X</button>
            </div>
        `;
    });
}

function renderCustomerDropdown() {
    let dropdown = document.getElementById("selectCustomer");
    dropdown.innerHTML = `<option value="">Walk-in</option>`;
    customers.forEach(c => {
        dropdown.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
}

function addToCart(id) {
    let product = products.find(p => p.id === id);
    let item = cart.find(i => i.id === id);
    if (item) {
        item.qty++;
    } else {
        cart.push({...product, qty: 1});
    }
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    renderCart();
}

function clearCart() {
    cart = [];
    renderCart();
}

document.getElementById("clearCartBtn").addEventListener("click", clearCart);

function renderCart() {
    let cartDiv = document.getElementById("cartItems");
    cartDiv.innerHTML = "";
    let subtotal = 0;
    cart.forEach(i => {
        subtotal += i.price * i.qty;
        cartDiv.innerHTML += `
            <div class="row">
                <span>${i.name} x ${i.qty}</span>
                <button class="btn danger" onclick="removeFromCart(${i.id})">X</button>
            </div>
        `;
    });
    let tax = subtotal * 0.05;
    let total = subtotal + tax;
    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("tax").textContent = tax.toFixed(2);
    document.getElementById("total").textContent = total.toFixed(2);
}

document.getElementById("checkoutBtn").addEventListener("click", function() {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }
    let order = {
        orderId: generateOrderId(),
        customerId: document.getElementById("selectCustomer").value || "Walk-in",
        items: cart,
        total: document.getElementById("total").textContent,
        date: new Date().toLocaleString()
    };
    orders.push(order);
    save("orders", orders);
    clearCart();
    renderOrdersList();
    alert("Order placed successfully!");
});

function renderOrdersList() {
    let list = document.getElementById("ordersList");
    list.innerHTML = "";
    orders.forEach(o => {
        list.innerHTML += `
            <div class="row">
                <span>${o.orderId} - LKR ${o.total}</span>
                <small>${o.date}</small>
            </div>
        `;
    });
}


window.addEventListener('DOMContentLoaded', () => {
   renderProductCatalog();
   renderCustomerDropdown();
   renderOrdersList();
});
