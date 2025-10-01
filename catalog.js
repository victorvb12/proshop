// ProShop catalog.js — render homepage grid
import { PRODUCTS, productCard, wireAddButtons, updateCartBadge } from "./core.js";

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  if (!grid) return;

  // render products
  grid.innerHTML = PRODUCTS.map(productCard).join("");
  wireAddButtons(grid);
  updateCartBadge();

  // search & sort
  const searchInput = document.getElementById("search");
  const sortSel = document.getElementById("sort");

  function applyFilters() {
    let list = [...PRODUCTS];
    const q = searchInput?.value?.toLowerCase();
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q));
    const sort = sortSel?.value;
    if (sort === "priceAsc") list.sort((a,b)=>a.price-b.price);
    if (sort === "priceDesc") list.sort((a,b)=>b.price-a.price);
    if (sort === "nameAsc") list.sort((a,b)=>a.name.localeCompare(b.name));
    grid.innerHTML = list.map(productCard).join("");
  }

  searchInput?.addEventListener("input", applyFilters);
  sortSel?.addEventListener("change", applyFilters);
});
