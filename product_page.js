// ProShop product_page.js — single product details
import { findProductById, getParam, addToCart, updateCartBadge } from "./core.js";

document.addEventListener("DOMContentLoaded", () => {
  const id = getParam("id");
  const product = findProductById(id);

  if (!product) {
    document.querySelector("main").innerHTML = "<p>Product not found.</p>";
    return;
  }

  document.getElementById("pName").textContent = product.name;
  document.getElementById("pCat").textContent = product.cat;
  document.getElementById("pPrice").textContent = `$${product.price.toFixed(2)}`;
  document.getElementById("pDesc").textContent = product.desc;
  const imgBox = document.getElementById("pImage");
  if (imgBox) imgBox.style.background = `url(${product.img || "https://via.placeholder.com/400x300"}) center/cover`;

  const btn = document.getElementById("addBtn");
  btn.addEventListener("click", () => {
    addToCart(product.id, 1);
    updateCartBadge();
    alert("Added to cart!");
  });

  updateCartBadge();
});
