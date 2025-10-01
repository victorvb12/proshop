// ProShop category_page.js — tiles + filtered grid
import {
  PRODUCTS, productCard, wireAddButtons, updateCartBadge,
  CATS, catLabelFromSlug, canonFromSlug, getParam
} from "./core.js";

document.addEventListener("DOMContentLoaded", () => {
  const tiles = document.getElementById("catTiles");
  const grid  = document.getElementById("grid");
  const title = document.getElementById("catTitle");
  const tools = document.getElementById("tools");
  const search = document.getElementById("searchGrid");
  const sort   = document.getElementById("sortGrid");

  const slug = (getParam("cat") || "").toLowerCase();

  function renderTiles() {
    title.textContent = "Categories";
    tools.classList.add("hidden");
    grid.innerHTML = "";
    tiles.innerHTML = Object.entries(CATS).map(([key,label]) => `
      <a class="card cat-tile" href="category.html?cat=${key}">
        <div class="card-body">
          <div class="card-title" style="font-size:20px">${label}</div>
        </div>
      </a>
    `).join("");
  }

  function renderGrid(catSlug) {
    const label = catLabelFromSlug(catSlug);
    const canon = canonFromSlug(catSlug);
    if (!label || !canon) { renderTiles(); return; }

    title.textContent = label;
    tiles.innerHTML = "";
    tools.classList.remove("hidden");

    let list = PRODUCTS.filter(p => p.cat === canon);

    function apply() {
      let cur = [...list];
      const q = (search?.value || "").toLowerCase();
      if (q) cur = cur.filter(p => p.name.toLowerCase().includes(q));
      const s = sort?.value;
      if (s === "priceAsc")  cur.sort((a,b)=>a.price-b.price);
      if (s === "priceDesc") cur.sort((a,b)=>b.price-a.price);
      if (s === "nameAsc")   cur.sort((a,b)=>a.name.localeCompare(b.name));
      grid.innerHTML = cur.length ? cur.map(productCard).join("") : `<p class="muted">No products yet.</p>`;
      wireAddButtons(grid);
    }

    apply();
    search?.addEventListener("input", apply);
    sort?.addEventListener("change", apply);
  }

  if (!slug) renderTiles(); else renderGrid(slug);
  updateCartBadge();
});
