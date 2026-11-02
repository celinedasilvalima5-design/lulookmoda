const INSTAGRAM_URL = "https://www.instagram.com/lulook_moda/";

const products = [
  { id: 1, name: "Kit cueca box Kelvin Klein masculina", category: "Masculina", price: 35, sizes: ["G"], colors: [], stock: null, tag: "", symbol: "✦" },
  { id: 2, name: "Conjunto robe e camisola", category: "Pijamas", price: 75, sizes: ["Único"], colors: ["Preto", "Azul-marinho"], stock: 2, tag: "Só 2 unidades", symbol: "♡" },
  { id: 3, name: "Baby Doll canelado", category: "Pijamas", price: 30, sizes: ["M"], colors: ["Marrom", "Amarelo"], stock: null, tag: "", symbol: "☾" },
  { id: 4, name: "Baby Doll canelado de alça", category: "Pijamas", price: 30, sizes: ["M"], colors: [], stock: null, tag: "", symbol: "♡" },
  { id: 5, name: "Pijama Barbara — estampa de Nutella", category: "Pijamas", price: 55, sizes: ["M"], colors: ["Estampa de Nutella"], stock: null, tag: "", symbol: "☾" },
  { id: 6, name: "Baby Doll Rita", category: "Pijamas", price: 22, sizes: ["G"], colors: ["Azul"], stock: null, tag: "", symbol: "♡" },
  { id: 7, name: "Pantufas rosa aberta", category: "Pijamas", price: 30, sizes: ["36"], colors: ["Rosa"], stock: null, tag: "", symbol: "✿" },
  { id: 8, name: "Pantufas azul fechada", category: "Pijamas", price: 30, sizes: ["37"], colors: ["Azul"], stock: null, tag: "", symbol: "✿" },
  { id: 9, name: "Conjunto Ipanema tule", category: "Biquínis e moda praia", price: 87, sizes: ["G"], colors: ["Branco"], stock: null, tag: "", symbol: "☼" },
  { id: 10, name: "Saída de praia Gaby tule", category: "Biquínis e moda praia", price: 45, sizes: ["M"], colors: ["Azul", "Laranja"], stock: null, tag: "", symbol: "☼" },
  { id: 11, name: "Vestido cropped estampado", category: "Biquínis e moda praia", price: 75, sizes: [], colors: ["Estampado"], stock: null, tag: "", symbol: "✿" },
  { id: 12, name: "Conjunto renda preto", category: "Lingeries", price: 56, sizes: ["G"], colors: ["Preto"], stock: null, tag: "", symbol: "♡" }
];

const cart = new Map();
const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const sortFilter = document.getElementById("sort-filter");
const cartPanel = document.getElementById("cart-panel");
const cartBackdrop = document.getElementById("cart-backdrop");
const cartItems = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartFooter = document.getElementById("cart-footer");
const toast = document.getElementById("toast");
let toastTimer;

function money(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}
function detailText(values, fallback) {
  return values && values.length ? values.map(escapeHtml).join(", ") : fallback;
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}
function visibleProducts() {
  let list = products.filter(product => {
    const term = searchInput.value.trim().toLocaleLowerCase("pt-BR");
    const matchesText = !term || `${product.name} ${product.category} ${product.colors.join(" ")}`.toLocaleLowerCase("pt-BR").includes(term);
    const matchesCategory = categoryFilter.value === "Todas" || product.category === categoryFilter.value;
    return matchesText && matchesCategory && product.stock !== 0;
  });
  if (sortFilter.value === "price-asc") list.sort((a, b) => a.price - b.price);
  if (sortFilter.value === "price-desc") list.sort((a, b) => b.price - a.price);
  if (sortFilter.value === "name") list.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  return list;
}
function renderProducts() {
  const list = visibleProducts();
  document.getElementById("product-total").textContent = `${list.length} ${list.length === 1 ? "peça" : "peças"}`;
  document.getElementById("results-message").textContent = list.length ? `Mostrando ${list.length} ${list.length === 1 ? "resultado" : "resultados"}` : "";
  document.getElementById("empty-state").hidden = list.length !== 0;
  productGrid.innerHTML = list.map((product, index) => `
    <article class="product-card" style="animation-delay:${Math.min(index * 35, 250)}ms">
      <div class="product-visual tone-${product.id % 4}">
        ${product.tag ? `<span class="product-tag">${escapeHtml(product.tag)}</span>` : ""}
        <div class="product-placeholder" aria-hidden="true">${product.symbol}<small>LU LOOK MODA</small></div>
        ${product.stock !== null && product.stock <= 2 ? `<span class="stock-tag">${product.stock === 1 ? "Última unidade" : `Restam ${product.stock} unidades`}</span>` : ""}
      </div>
      <div class="product-info">
        <div class="product-category">${escapeHtml(product.category)}</div>
        <h3>${escapeHtml(product.name)}</h3>
        <div class="product-price">${money(product.price)}</div>
        <div class="product-details"><div><strong>Tamanho:</strong> ${detailText(product.sizes, "não informado")}</div><div><strong>Cor:</strong> ${detailText(product.colors, "não informada")}</div></div>
        <div class="product-actions"><button class="add-button" data-add="${product.id}" type="button">${cart.has(product.id) ? "Adicionar mais uma" : "Adicionar à sacola"} +</button></div>
      </div>
    </article>`).join("");
}
function openCart() {
  document.body.classList.add("cart-open");
  cartPanel.setAttribute("aria-hidden", "false");
  document.getElementById("close-cart").focus();
}
function closeCart() {
  document.body.classList.remove("cart-open");
  cartPanel.setAttribute("aria-hidden", "true");
}
function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product || product.stock === 0) return;
  const current = cart.get(id) || 0;
  if (product.stock !== null && current >= product.stock) {
    showToast("Você já selecionou todas as unidades informadas.");
    return;
  }
  cart.set(id, current + 1);
  renderCart();
  renderProducts();
  showToast("Peça adicionada à sua sacola ♡");
}
function removeFromCart(id) {
  cart.delete(id);
  renderCart();
  renderProducts();
}
function orderSummary() {
  const lines = ["Olá! Vim pelo site da Lu Look Moda e gostaria de consultar este pedido:", ""];
  let total = 0;
  cart.forEach((quantity, id) => {
    const product = products.find(item => item.id === id);
    if (!product) return;
    total += product.price * quantity;
    lines.push(`${quantity}x ${product.name} — ${money(product.price * quantity)}`);
    lines.push(`Tamanho: ${product.sizes.length ? product.sizes.join(", ") : "confirmar"} | Cor: ${product.colors.length ? product.colors.join(", ") : "confirmar"}`);
  });
  lines.push("", `Total estimado: ${money(total)}`, "", "Pode confirmar a disponibilidade e me orientar sobre o pagamento, por favor?");
  return lines.join("\n");
}
function renderCart() {
  const count = [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-heading-count").textContent = `(${count})`;
  cartEmpty.hidden = count !== 0;
  cartFooter.hidden = count === 0;
  if (!count) {
    cartItems.innerHTML = "";
    document.getElementById("cart-total").textContent = money(0);
    return;
  }
  let total = 0;
  cartItems.innerHTML = [...cart.entries()].map(([id, quantity]) => {
    const product = products.find(item => item.id === id);
    total += product.price * quantity;
    return `<div class="cart-line"><div class="cart-mini" aria-hidden="true">${product.symbol}</div><div><h3>${escapeHtml(product.name)}</h3><p>Qtd.: ${quantity}<br>Tamanho: ${detailText(product.sizes, "confirmar")}<br>Cor: ${detailText(product.colors, "confirmar")}</p><button class="remove-line" data-remove="${id}" type="button">Remover</button></div><div class="cart-line-price">${money(product.price * quantity)}</div></div>`;
  }).join("");
  document.getElementById("cart-total").textContent = money(total);
}
productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});
cartItems.addEventListener("click", event => {
  const button = event.target.closest("[data-remove]");
  if (button) removeFromCart(Number(button.dataset.remove));
});
[searchInput, categoryFilter, sortFilter].forEach(control => control.addEventListener("input", renderProducts));
document.querySelectorAll("[data-category]").forEach(button => button.addEventListener("click", () => {
  categoryFilter.value = button.dataset.category;
  renderProducts();
  document.getElementById("produtos").scrollIntoView({ behavior: "smooth" });
}));
document.getElementById("clear-filters").addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "Todas";
  sortFilter.value = "featured";
  renderProducts();
});
document.getElementById("open-cart").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
document.getElementById("continue-shopping").addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);
document.addEventListener("keydown", event => { if (event.key === "Escape") closeCart(); });
document.getElementById("checkout-instagram").addEventListener("click", async () => {
  if (!cart.size) return;
  const summary = orderSummary();
  try {
    await navigator.clipboard.writeText(summary);
    document.getElementById("copy-feedback").textContent = "Resumo copiado! Cole na conversa do Instagram.";
  } catch {
    document.getElementById("copy-feedback").textContent = "Se possível, copie o resumo antes de enviar sua mensagem.";
  }
  window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer");
  showToast("Instagram aberto. Cole o resumo do pedido na conversa.");
});
document.getElementById("copy-order").addEventListener("click", async () => {
  const summary = orderSummary();
  try {
    await navigator.clipboard.writeText(summary);
    document.getElementById("copy-feedback").textContent = "Resumo copiado! Agora é só colar no Instagram.";
    showToast("Resumo do pedido copiado ♡");
  } catch {
    document.getElementById("copy-feedback").textContent = "Não foi possível copiar automaticamente neste navegador.";
  }
});
document.getElementById("menu-toggle").addEventListener("click", () => {
  const nav = document.querySelector(".desktop-nav");
  const isOpen = nav.classList.toggle("menu-visible");
  document.getElementById("menu-toggle").setAttribute("aria-expanded", String(isOpen));
});
document.querySelectorAll(".desktop-nav a").forEach(link => link.addEventListener("click", () => {
  document.querySelector(".desktop-nav").classList.remove("menu-visible");
  document.getElementById("menu-toggle").setAttribute("aria-expanded", "false");
}));
document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
renderCart();
