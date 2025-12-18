const products = [
    { name: "Labial Mate", price: 8.00, image: "img/Labial-mate.jpg" },
    { name: "Base Líquida", price: 15.00, image: "img/Base-liquido.jpg" },
    { name: "Paleta de Sombras", price: 18.00, image: "img/Paleta de sobra.jpg" },
    { name: "Gel de Cejas", price: 6.00, image: "img/gel de cejas.jpg" },
    { name: "Set de Brochas", price: 20.00, image: "img/brochas.jpg" },
    { name: "Gloss Labial", price: 7.00, image: "img/gloss.jpg" }
];

const container = document.getElementById("product-list");
const cartList = document.getElementById("cart");
const cartCount = document.getElementById("cart-count");
const subtotalEl = document.getElementById("subtotal");
const ivaEl = document.getElementById("iva");
const totalEl = document.getElementById("total");

let cart = [];

products.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <button class="agregar-btn" onclick="addToCart(${index})">Agregar</button>
    `;
    container.appendChild(card);
});

function addToCart(index) {
    cart.push(products[index]);
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    cartList.innerHTML = "";
    let subtotal = 0;

    cart.forEach((product, i) => {
        subtotal += product.price;
        const li = document.createElement("li");
        li.innerHTML = `
        ${product.name} - $${product.price.toFixed(2)}
        <button onclick="removeFromCart(${i})"
    style="margin-left: 10px; background: transparent; border: none; color: red; cursor: pointer;">
    <i class="fas fa-times"></i> <!-- Ícono profesional de "X" -->
</button>
      `;
        cartList.appendChild(li);
    });

    const iva = subtotal * 0.15;
    const total = subtotal + iva;

    cartCount.textContent = cart.length;
    subtotalEl.textContent = subtotal.toFixed(2);
    ivaEl.textContent = iva.toFixed(2);
    totalEl.textContent = total.toFixed(2);
}

// Vaciar carrito
document.getElementById("clearCart").addEventListener("click", () => {
    cart = [];
    updateCart();
    document.getElementById("pp-button").innerHTML = ""; // Limpiar la cajita si había
});

// ✅ Usar PayPhone Payment Box
document.getElementById("payButton").addEventListener("click", () => {
    const totalValue = parseFloat(totalEl.textContent); // Ej: 55.89
    const subtotalValue = parseFloat(subtotalEl.textContent); // Ej: 49.90
    const taxValue = parseFloat(ivaEl.textContent); // Ej: 5.99

    if (totalValue === 0) {
        alert("El carrito está vacío. Agrega productos antes de pagar.");
        return;
    }

    const storeId = "qvPrPn77Uuk1iSk4P6Hw";
    const token = "9Qqj6as__GgqfO9P0_w3GYjDFM8OivtjbxBVLqjxMAEVvDT29E48n2Y14_KcuXUEJXGaTFtqnOJXLlwAIOsYfcQs_LkzyBHiumIt052_oac2mi66Dsn6xAvT_17OgeS1_oUzj-piJrVMbBMJkrHx85E_2Uo5KTNsPT47qVv6kiP18DJBYmOqTp-QDdMB1OmSPIR0uqQtFHtCzUkwXCCYbFyCENQ1lybOzptc7ZBgImWXgFPvIofdeFVjJ2jjQzb-TpsKZpRaA1ubiSL-RspC9m03fYvpztqd-_kVkTWl7GKhRwGnn-V7zhwUJJjm8yRBIbMLnw8";

    // 🧮 Convertir a centavos sin redondeo intermedio
    const amount = Math.round(totalValue * 100); // Total en centavos
    const amountWithTax = Math.round(subtotalValue * 100); // Subtotal en centavos
    const tax = Math.round(taxValue * 100); // IVA en centavos
    const amountWithoutTax = 0; // No hay productos exentos

    const transactionData = {
        amount,
        amountWithoutTax,
        amountWithTax,
        tax,
        clientTransactionId: Date.now().toString(),
        storeId,
        reference: "Compra Moda y Estilo ",
        currency: "USD",
        email: "cliente@BeautyManta.com",
        returnUrl: "https://payphoneenpayphone.onrender.com"
    };

    const payButton = new PPaymentButtonBox({
        token,
        ...transactionData
    });

    payButton.render("pp-button");
});