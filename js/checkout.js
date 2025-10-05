// ProShop checkout.js — handle cart + order placement
import { getCart, updateQty, removeFromCart, findProductById, formatMoney, updateCartBadge, saveOrder } from "./core.js";

document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("orderTable");
  const totalEl = document.getElementById("orderTotal");
  const form = document.getElementById("payForm");

  function render() {
    const cart = getCart();
    if (!cart.length) {
      tbody.innerHTML = "<tr><td colspan='4'>Cart is empty</td></tr>";
      totalEl.textContent = "$0.00";
      return;
    }
    let total = 0;
    tbody.innerHTML = cart.map(item => {
      const p = findProductById(item.id);
      const sub = p.price * item.qty;
      total += sub;
      return `<tr>
        <td>${p.name}</td>
        <td><input type="number" min="1" value="${item.qty}" data-id="${p.id}" style="width:60px"></td>
        <td>${formatMoney(p.price)}</td>
        <td>${formatMoney(sub)}</td>
      </tr>`;
    }).join("");
    totalEl.textContent = formatMoney(total);
  }

  tbody.addEventListener("change", e => {
    const input = e.target.closest("input[data-id]");
    if (input) {
      updateQty(input.dataset.id, parseInt(input.value, 10));
      render();
      updateCartBadge();
    }
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const cart = getCart();
    if (!cart.length) { alert("Cart empty!"); return; }

    const formData = new FormData(form);
    const total = tbody.querySelectorAll("tr").length ? totalEl.textContent : "$0.00";
    const order = {
      id: "ORD" + Date.now(),
      status: "paid",
      total: parseFloat(total.replace("$","")),
      items: cart,
      when: new Date().toLocaleString(),
      shipping: {
        name: formData.get("fullName"),
        phone: formData.get("phone"),
        address: formData.get("address")
      },
      payment: formData.get("method")
    };
    saveOrder(order);
    localStorage.removeItem("proshop_cart");
    updateCartBadge();
    alert("Order placed!");
    location.href = "orders.html";
  });

  render();
  updateCartBadge();
});
