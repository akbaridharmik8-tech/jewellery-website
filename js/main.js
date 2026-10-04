/* ==========================================================================
   Aurelia Jewels — site behaviour
   Edit SETTINGS and PRODUCTS below to customise the site for a client.
   ========================================================================== */

const SETTINGS = {
  brand: "Aurelia Jewels",
  // WhatsApp number in international format, digits only (e.g. 919876543210).
  whatsapp: "910000000000",
  currency: "INR",
  locale: "en-IN",
};

// art: ring | necklace | earrings | bracelet  ·  tone: 1-4 (background tint)
const PRODUCTS = [
  { id: 1, name: "Solitaire Promise Ring", category: "rings", material: "18K Rose Gold · 0.5ct", price: 68500, art: "ring", tone: 1, tag: "Bestseller" },
  { id: 2, name: "Heritage Kundan Choker", category: "necklaces", material: "22K Gold · Kundan", price: 185000, art: "necklace", tone: 2, tag: "Bridal" },
  { id: 3, name: "Teardrop Diamond Drops", category: "earrings", material: "18K White Gold · VVS", price: 92000, art: "earrings", tone: 3 },
  { id: 4, name: "Classic Tennis Bracelet", category: "bracelets", material: "18K White Gold · 2ct", price: 145000, art: "bracelet", tone: 4, tag: "New" },
  { id: 5, name: "Eternity Band", category: "rings", material: "Platinum · 1ct", price: 74000, art: "ring", tone: 4 },
  { id: 6, name: "Lakshmi Temple Haar", category: "necklaces", material: "22K Antique Gold", price: 236000, art: "necklace", tone: 1, tag: "Festive" },
  { id: 7, name: "Pearl Jhumka", category: "earrings", material: "22K Gold · Pearls", price: 38500, art: "earrings", tone: 2 },
  { id: 8, name: "Filigree Kada", category: "bracelets", material: "22K Yellow Gold", price: 112000, art: "bracelet", tone: 3, tag: "Handmade" },
];

document.documentElement.classList.add("js");

const money = new Intl.NumberFormat(SETTINGS.locale, { style: "currency", currency: SETTINGS.currency, maximumFractionDigits: 0 });
const waLink = (text) => `https://wa.me/${SETTINGS.whatsapp}?text=${encodeURIComponent(text)}`;

/* ---------- WhatsApp links ---------- */
document.querySelectorAll(".js-whatsapp").forEach((a) => {
  a.href = waLink(`Hi ${SETTINGS.brand}, I'd like to know more about your jewellery.`);
});

/* ---------- Header: scroll state + mobile menu ---------- */
const header = document.querySelector(".site-header");
const nav = document.getElementById("primary-nav");
const toggle = document.querySelector(".menu-toggle");

const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

function setMenu(open) {
  nav.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  toggle.querySelector("use").setAttribute("href", open ? "#i-close" : "#i-menu");
}
toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
});

/* ---------- Wishlist (remembered in this browser) ---------- */
const WISH_KEY = "aurelia-wishlist";
let wishlist = new Set();
try { wishlist = new Set(JSON.parse(localStorage.getItem(WISH_KEY) || "[]")); } catch { /* storage unavailable */ }
const wishCount = document.getElementById("wishlist-count");
function saveWishlist() {
  wishCount.textContent = wishlist.size;
  try { localStorage.setItem(WISH_KEY, JSON.stringify([...wishlist])); } catch { /* ignore */ }
}
saveWishlist();

/* ---------- Products ---------- */
const grid = document.getElementById("product-grid");
const chips = document.querySelectorAll(".chip");

function productCard(p) {
  const liked = wishlist.has(p.id);
  const msg = `Hi ${SETTINGS.brand}, I'm interested in the "${p.name}" (${p.material}, ${money.format(p.price)}). Is it available?`;
  return `
    <li class="product">
      <div class="product-media tone-${p.tone}">
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
        <button class="icon-btn wish-btn" data-id="${p.id}" aria-pressed="${liked}" aria-label="${liked ? "Remove" : "Save"} ${p.name} ${liked ? "from" : "to"} wishlist">
          <svg aria-hidden="true"><use href="#i-heart"/></svg>
        </button>
        <svg class="art" aria-hidden="true"><use href="#art-${p.art}"/></svg>
      </div>
      <div class="product-body">
        <p class="product-meta">${p.material}</p>
        <h3>${p.name}</h3>
        <p class="product-price">${money.format(p.price)} <small>onwards</small></p>
        <a class="btn btn-ghost" href="${waLink(msg)}" target="_blank" rel="noopener">
          Enquire <svg aria-hidden="true"><use href="#i-arrow"/></svg>
        </a>
      </div>
    </li>`;
}

function render(filter = "all") {
  const items = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);
  grid.innerHTML = items.length ? items.map(productCard).join("") : `<li class="empty">No pieces in this category yet.</li>`;
}

function setFilter(filter) {
  chips.forEach((c) => {
    const active = c.dataset.filter === filter;
    c.classList.toggle("is-active", active);
    c.setAttribute("aria-pressed", String(active));
  });
  render(filter);
}

chips.forEach((c) => c.addEventListener("click", () => setFilter(c.dataset.filter)));
document.querySelectorAll("[data-filter-link]").forEach((a) =>
  a.addEventListener("click", () => setFilter(a.dataset.filterLink))
);

grid.addEventListener("click", (e) => {
  const btn = e.target.closest(".wish-btn");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const name = PRODUCTS.find((p) => p.id === id).name;
  const liked = !wishlist.has(id);
  liked ? wishlist.add(id) : wishlist.delete(id);
  btn.setAttribute("aria-pressed", String(liked));
  btn.setAttribute("aria-label", `${liked ? "Remove" : "Save"} ${name} ${liked ? "from" : "to"} wishlist`);
  saveWishlist();
});

render();

/* ---------- Lead form ---------- */
const form = document.getElementById("lead-form");
const success = document.getElementById("form-success");

function setError(input, message) {
  const el = document.getElementById(`${input.id}-error`);
  el.textContent = message;
  input.setAttribute("aria-invalid", message ? "true" : "false");
  if (message) input.setAttribute("aria-errormessage", el.id);
}

function validate() {
  const name = form.elements.name;
  const phone = form.elements.phone;
  let firstInvalid = null;

  if (name.value.trim().length < 2) { setError(name, "Please enter your name."); firstInvalid ??= name; }
  else setError(name, "");

  const digits = phone.value.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) { setError(phone, "Please enter a valid phone number (10 digits)."); firstInvalid ??= phone; }
  else setError(phone, "");

  return firstInvalid;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const invalid = validate();
  if (invalid) { invalid.focus(); return; }

  const data = Object.fromEntries(new FormData(form));
  // No backend yet: hand the enquiry to WhatsApp so the lead is never lost.
  // Swap this for a fetch() to Formspree, Google Sheets, a CRM, etc.
  const text = `New enquiry for ${SETTINGS.brand}\nName: ${data.name}\nPhone: ${data.phone}\nInterest: ${data.interest}${data.message ? `\nMessage: ${data.message}` : ""}`;
  window.open(waLink(text), "_blank", "noopener");

  success.hidden = false;
  form.reset();
});
form.addEventListener("input", (e) => {
  if (e.target.getAttribute("aria-invalid") === "true") validate();
});

/* ---------- Newsletter ---------- */
const nlForm = document.getElementById("newsletter-form");
const nlMsg = document.getElementById("nl-msg");
nlForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("nl-email");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    nlMsg.textContent = "Please enter a valid email address.";
    nlMsg.style.color = "var(--color-destructive)";
    email.focus();
    return;
  }
  nlMsg.textContent = "You're on the list. Welcome!";
  nlMsg.style.color = "var(--color-success)";
  nlForm.reset();
});

/* ---------- Scroll reveal ---------- */
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-visible"));
}

document.getElementById("year").textContent = new Date().getFullYear();
