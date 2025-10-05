// ProShop receipt.js — show order details
import { getParam, findOrder, findProductById, formatMoney, updateCartBadge } from "./core.js";

document.addEventListener("DOMContentLoaded", () => {
  const id = getParam("id");
  const order = findOrder(id);

  if (!order) {
    document.querySelector("main").innerHTML = "<p>Order not found.</p>";
    return;
  }

  document.getElementById("orderId").textContent = order.id;
  document.getElementById("status").textContent = order.status;
  document.getElementById("paidAt").textContent = order.when;
  document.getElementById("total").textContent = formatMoney(order.total);

  const itemsEl = document.getElementById("items");
  itemsEl.innerHTML = order.items.map(it => {
    const p = findProductById(it.id);
    return `<tr><td>${p?.name || it.id}</td><td>${it.qty}</td></tr>`;
  }).join("");

  document.getElementById("printBtn")?.addEventListener("click", () => window.print());

  updateCartBadge();
});
