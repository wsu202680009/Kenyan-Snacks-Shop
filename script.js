// ===== The menu =====
// To add or change a snack, edit this list.
const snacks = [
  { id: 1,  name: "Samosa",         emoji: "🥟", price: 30,  category: "fried",   desc: "Crispy pastry filled with spiced beef or lentils." },
  { id: 2,  name: "Mandazi",        emoji: "🍩", price: 20,  category: "fried",   desc: "Soft, lightly sweet coconut doughnut." },
  { id: 3,  name: "Bhajia",         emoji: "🥔", price: 100, category: "fried",   desc: "Thin potato slices in spiced batter. Per plate." },
  { id: 4,  name: "Viazi karai",    emoji: "🍟", price: 70,  category: "fried",   desc: "Coastal-style battered potatoes with chilli sauce." },
  { id: 5,  name: "Mkate mayai",    emoji: "🥚", price: 80,  category: "fried",   desc: "Egg and minced meat wrapped in thin dough." },
  { id: 6,  name: "Mahindi choma",  emoji: "🌽", price: 50,  category: "roasted", desc: "Charcoal-roasted maize with lemon and chilli." },
  { id: 7,  name: "Njugu karanga",  emoji: "🥜", price: 30,  category: "roasted", desc: "Roasted groundnuts in a paper cone." },
  { id: 8,  name: "Chapati",        emoji: "🫓", price: 30,  category: "roasted", desc: "Soft layered flatbread, cooked on a hot pan." },
  { id: 9,  name: "Kaimati",        emoji: "🍯", price: 50,  category: "sweet",   desc: "Golden dumplings in sugar syrup. 5 pieces." },
  { id: 10, name: "Kashata",        emoji: "🥥", price: 20,  category: "sweet",   desc: "Chewy coconut and peanut candy." },
  { id: 11, name: "Mabuyu",         emoji: "🍬", price: 30,  category: "sweet",   desc: "Baobab seeds coated in sweet, tangy red sugar." },
  { id: 12, name: "Chai",           emoji: "🍵", price: 40,  category: "drinks",  desc: "Milky Kenyan tea with ginger and spices." },
  { id: 13, name: "Madafu",         emoji: "🥥", price: 80,  category: "drinks",  desc: "Fresh coconut water, straight from the nut." }
];

// ===== Grab elements from the page =====
const menuList     = document.getElementById("menuList");
const filterBtns   = document.querySelectorAll(".filter");
const cartBtn      = document.getElementById("cartBtn");
const cartPanel    = document.getElementById("cart");
const overlay      = document.getElementById("overlay");
const closeCartBtn = document.getElementById("closeCart");
const cartItemsEl  = document.getElementById("cartItems");
const cartEmptyEl  = document.getElementById("cartEmpty");
const cartTotalEl  = document.getElementById("cartTotal");
const cartCountEl  = document.getElementById("cartCount");
const checkoutBtn  = document.getElementById("checkoutBtn");
const orderStatus  = document.getElementById("orderStatus");

// The basket: { snackId: quantity }
let cart = {};

function formatKES(amount) {
  return "KES " + amount.toLocaleString();
}

// ===== Show the menu =====
function showMenu(filter) {
  menuList.innerHTML = "";

  const list = filter === "all" ? snacks : snacks.filter(s => s.category === filter);

  list.forEach(snack => {
    const li = document.createElement("li");
    li.className = "menu-item";
    li.innerHTML = `
      <span class="menu-emoji" aria-hidden="true">${snack.emoji}</span>
      <div>
        <p class="menu-name">${snack.name}</p>
        <p class="menu-desc">${snack.desc}</p>
      </div>
      <div class="menu-side">
        <span class="menu-price">${formatKES(snack.price)}</span>
        <button class="add-btn" data-id="${snack.id}" aria-label="Add ${snack.name} to basket">Add</button>
      </div>
    `;
    menuList.appendChild(li);
  });
}

// Filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    showMenu(btn.dataset.filter);
  });
});

// "Add" buttons (one listener for the whole list)
menuList.addEventListener("click", e => {
  const btn = e.target.closest(".add-btn");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  cart[id] = (cart[id] || 0) + 1;
  updateCart();

  // Short confirmation on the button
  btn.textContent = "Added ✓";
  btn.classList.add("added");
  setTimeout(() => {
    btn.textContent = "Add";
    btn.classList.remove("added");
  }, 900);
});

// ===== Basket =====
function updateCart() {
  cartItemsEl.innerHTML = "";
  let total = 0;
  let count = 0;

  Object.keys(cart).forEach(id => {
    const snack = snacks.find(s => s.id === Number(id));
    const qty = cart[id];
    total += snack.price * qty;
    count += qty;

    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <div>
        <span class="cart-item-name">${snack.emoji} ${snack.name}</span>
        <span class="cart-item-price">${formatKES(snack.price * qty)}</span>
      </div>
      <div class="qty">
        <button data-id="${id}" data-change="-1" aria-label="Remove one ${snack.name}">−</button>
        <span>${qty}</span>
        <button data-id="${id}" data-change="1" aria-label="Add one ${snack.name}">+</button>
      </div>
    `;
    cartItemsEl.appendChild(li);
  });

  cartTotalEl.textContent = formatKES(total);
  cartCountEl.textContent = count;
  cartEmptyEl.hidden = count > 0;
  checkoutBtn.disabled = count === 0;

  // Little bounce on the basket counter
  cartCountEl.classList.remove("bump");
  void cartCountEl.offsetWidth;
  cartCountEl.classList.add("bump");
}

// + and − buttons inside the basket
cartItemsEl.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = btn.dataset.id;
  cart[id] += Number(btn.dataset.change);
  if (cart[id] <= 0) delete cart[id];
  updateCart();
});

function openCart() {
  cartPanel.hidden = false;
  overlay.hidden = false;
  cartBtn.setAttribute("aria-expanded", "true");
  orderStatus.textContent = "";
  closeCartBtn.focus();
}

function closeCart() {
  cartPanel.hidden = true;
  overlay.hidden = true;
  cartBtn.setAttribute("aria-expanded", "false");
  cartBtn.focus();
}

cartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !cartPanel.hidden) closeCart();
});

// Place order (demo only: no real payment)
checkoutBtn.addEventListener("click", () => {
  const total = cartTotalEl.textContent;
  cart = {};
  updateCart();
  orderStatus.textContent = `Order placed! Pay ${total} when you collect your snacks. Asante!`;
});

// ===== Contact form =====
const contactForm = document.getElementById("contactForm");
const formStatus  = document.getElementById("formStatus");

contactForm.addEventListener("submit", e => {
  e.preventDefault();

  const name    = document.getElementById("name").value.trim();
  const email   = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    formStatus.textContent = "Please fill in your name, email and message.";
    formStatus.className = "form-status error";
    return;
  }
  if (!email.includes("@") || !email.includes(".")) {
    formStatus.textContent = "Please enter a valid email address, like name@example.com.";
    formStatus.className = "form-status error";
    return;
  }

  formStatus.textContent = `Message sent. Thank you, ${name}! We'll reply soon.`;
  formStatus.className = "form-status success";
  contactForm.reset();
});

// ===== Start =====
showMenu("all");
updateCart();
