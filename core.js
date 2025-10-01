// ProShop core.js — shared data, cart, helpers

// ====== Categories (slug → label) ======
export const CATS = {
  mens: "Men's",
  ladies: "Ladies",
  cosmetics: "Cosmetics",
  electronics: "Electronics",
};
const CANON = { "men's": "men's", "ladies": "ladies", "cosmetics": "cosmetics", "electronics": "electronics" };
export const catLabelFromSlug = (slug) => CATS[slug] || null;
export const canonFromSlug = (slug) => {
  const label = CATS[slug];
  if (!label) return null;
  return label.toLowerCase();
};

// ====== Mock catalog (put your real products here) ======
export const PRODUCTS = [
  // Men's
  { id: "p1",  name: "Casual Shirt",           price: 15.90, cat: "men's",        desc: "Slim fit cotton", img: "" },
  { id: "p2",  name: "Running Sneakers",       price: 32.00, cat: "men's",        desc: "Lightweight EVA sole", img: "" },
  // Ladies
  { id: "p3",  name: "Leather Handbag",        price: 29.00, cat: "ladies",       desc: "Compact crossbody", img: "" },
  { id: "p4",  name: "Summer Dress",           price: 21.50, cat: "ladies",       desc: "Floral, breathable", img: "" },
  // Cosmetics
  { id: "p5",  name: "Matte Lipstick",         price: 9.50,  cat: "cosmetics",    desc: "Long-lasting", img: "" },
  { id: "p6",  name: "Vitamin C Serum",        price: 12.90, cat: "cosmetics",    desc: "Brightening 30ml", img: "" },
  // Electronics
  { id: "p7",  name: "Wireless Earbuds Pro",   price: 39.99, cat: "electronics",  desc: "ENC mic, BT 5.3", img: "" },
  { id: "p8",  name: "Smartwatch Lite",        price: 29.50, cat: "electronics",  desc: "Heart rate, sleep", img: "" },
  { id: "p9",  name: "LED Desk Lamp",          price: 16.75, cat: "electronics",  desc: "3 modes, USB-C", img: "" },
  { id: "p10", name: "Gaming Mouse RGB",       price: 13.20, cat: "electronics",  desc: "7200 DPI", img: "" },
];

// ===== Storage keys =====
const CART_KEY = "proshop_cart";
const ORDERS_KEY = "proshop_orders";

// ===== Money / URL helpers =====
export const formatMoney = (n) => `$${(n ?? 0).toFixed(2)}`;
export const getParam = (k) => new URLSearchParams(location.search).get(k);

// ===== Cart =====
export function getCart() { try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return []; } }
export function setCart(items) { localStorage.setItem(CART_KEY, JSON.stringify(items)); dispatchEvent(new CustomEvent("cart:change")); }
export function cartCount() { return getCart().reduce((s, i) => s + (i.qty || 0), 0); }
export function addToCart(id, qty = 1) { const c=getCart(); const i=c.findIndex(x=>x.id===id); if(i>=0) c[i].qty+=qty; else c.push({id,qty}); setCart(c); }
export function removeFromCart(id) { setCart(getCart().filter(x => x.id !== id)); }
export function updateQty(id, qty) { const c=getCart().map(x=>x.id===id?{...x,qty:Math.max(1,qty|0)}:x); setCart(c); }

// ===== Orders (local demo) =====
export function saveOrder(order){ const all=getOrders(); all.push(order); localStorage.setItem(ORDERS_KEY, JSON.stringify(all)); }
export function getOrders(){ try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]"); } catch { return []; } }
export function findOrder(id){ return getOrders().find(o=>o.id===id); }

// ===== Products helpers =====
export const findProductById = (id) => PRODUCTS.find(p => p.id === id);
export const categories = () => Object.values(CATS); // labels
export const listByCanonCat = (canon) => PRODUCTS.filter(p => p.cat === CANON[canon] );

// ===== UI helpers =====
export function updateCartBadge(){ const el=document.getElementById("cartCount"); if(el) el.textContent=cartCount(); }
export function productCard(p){
  const price = formatMoney(p.price);
  return `
  <article class="card">
    <a href="product.html?id=${encodeURIComponent(p.id)}" class="card-media" aria-label="${p.name}"></a>
    <div class="card-body">
      <div class="card-title">${p.name}</div>
      <div class="muted">${p.cat[0].toUpperCase()+p.cat.slice(1)}</div>
      <div class="price">${price}</div>
      <div class="card-actions">
        <a class="btn" href="product.html?id=${encodeURIComponent(p.id)}">View</a>
        <button class="btn btn-primary" data-add="${p.id}">Add</button>
      </div>
    </div>
  </article>`;
}
export function wireAddButtons(root=document){
  root.addEventListener("click",(e)=>{ const btn=e.target.closest("[data-add]"); if(!btn) return; addToCart(btn.getAttribute("data-add"),1); });
}

// Global cart badge updater
addEventListener("cart:change", updateCartBadge);
document.addEventListener("DOMContentLoaded", updateCartBadge);
