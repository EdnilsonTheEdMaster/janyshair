const products = {
  agata: {
    id: "agata",
    name: "Agata",
    category: "CACHOS • CROCHET BRAIDS",
    price: null,
    image: "img/agata.jpg",
    imageAlt: "Modelo com cachos definidos e volumosos",
    description: "O cabelo Agata da Black Beauty tem cachos fechados e definidos. Sua fibra é orgânica, o que proporciona volume. Com 60cm de comprimento, é perfeito para ser utilizado no método crochet braids. Cada pacote contém 300g de cabelo.",
    specs: [
      ["Marca", "Black Beauty"],
      ["Tamanho", "60cm"],
      ["Material", "Orgânico"],
      ["Método de aplicação", "Crochet braids"],
      ["Peso", "300g"],
    ],
  },
  livre: {
    id: "livre",
    name: "Livre",
    category: "CACHOS • CROCHET BRAIDS",
    price: null,
    image: "img/livre.jpg",
    imageAlt: "Cabelo Livre, da Sleek, com cachos definidos",
    description: "O cabelo Livre, da Sleek, tem cachos definidos e faz parte da coleção Brazilian Virgin Hair. Sua biofibra adere a cremes, permite pentear e suporta calor. É ideal para Crochet Braids. Cada pacote contém 9 mechas, com comprimentos de 60, 65 e 70cm, e pesa 320g.",
    specs: [
      ["Marca", "Sleek"],
      ["Coleção", "Brazilian Virgin Hair"],
      ["Tamanho", "60cm / 65cm / 70cm"],
      ["Material", "Biofibra"],
      ["Método de aplicação", "Crochet Braids"],
      ["Peso", "320g"],
    ],
  },
  katrine: {
    id: "katrine",
    name: "Katrine",
    category: "CACHOS • CROCHET BRAIDS",
    price: null,
    image: "img/katrine.jpg",
    imageAlt: "Cabelo Katrine, da Sleek, com cachos definidos",
    description: "O cabelo Katrine, da Sleek, tem cachos definidos e faz parte da coleção Miracle. Sua biofibra adere a cremes, permite pentear e suporta calor. É ideal para Crochet Braids. Cada pacote contém 3 peças de 65cm e pesa 220g.",
    specs: [
      ["Marca", "Sleek"],
      ["Coleção", "Miracle"],
      ["Tamanho", "65cm"],
      ["Material", "Biofibra / Human Hair"],
      ["Método de aplicação", "Crochet Braids"],
      ["Peso", "220g"],
    ],
  },
};

const storageKey = "janyshair-cart";
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const formatPrice = (price) => price === null ? "Consulte" : currency.format(price);

function registerImageFallbacks(root) {
  root.querySelectorAll("img.product-image").forEach((image) => {
    const showPlaceholder = () => {
      const placeholder = document.createElement("div");
      const name = image.dataset.productName;
      placeholder.className = "product-image-placeholder";
      placeholder.setAttribute("role", "img");
      placeholder.setAttribute("aria-label", `Foto de ${name}`);
      placeholder.textContent = `FOTO ${name.toUpperCase()}`;
      image.replaceWith(placeholder);
    };

    image.addEventListener("error", showPlaceholder, { once: true });
    if (image.complete && !image.naturalWidth) showPlaceholder();
  });
}

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return {};
    return Object.fromEntries(
      Object.entries(saved).filter(([id, quantity]) =>
        Object.hasOwn(products, id) && Number.isInteger(quantity) && quantity > 0,
      ),
    );
  } catch (error) {
    console.error("Não foi possível carregar o carrinho salvo.", error);
    return {};
  }
}

let cart = readCart();

function saveCart() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  } catch (error) {
    console.error("Não foi possível salvar o carrinho.", error);
    window.alert("Não foi possível salvar seu carrinho neste navegador.");
  }
}

function updateCartCount() {
  const count = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  document.querySelectorAll(".cart-count").forEach((badge) => {
    badge.textContent = count;
    badge.setAttribute("aria-label", `${count} ${count === 1 ? "item" : "itens"} no carrinho`);
  });
}

function addToCart(id) {
  if (!Object.hasOwn(products, id)) return;
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  updateCartCount();
  const button = document.querySelector(`[data-product="${id}"]`);
  if (button) {
    const originalText = button.innerHTML;
    button.innerHTML = "Adicionado <span aria-hidden=\"true\">✓</span>";
    window.setTimeout(() => { button.innerHTML = originalText; }, 1400);
  }
}

function renderCatalog() {
  const catalog = document.querySelector("#catalog-products");
  if (!catalog) return;

  const productEntries = Object.values(products);
  document.querySelector("#catalog-count").textContent =
    `${productEntries.length} ${productEntries.length === 1 ? "cabelo" : "cabelos"}`;

  productEntries.forEach((product) => {
    const card = document.createElement("article");
    card.className = "catalog-card";
    const specs = product.specs.map(([label, value]) =>
      `<div><dt>${label}</dt><dd>${value}</dd></div>`,
    ).join("");
    card.innerHTML = `
      <div class="catalog-card-photo">
        <img class="product-image" data-product-name="${product.name}" src="${product.image}" alt="${product.imageAlt}" />
        <span class="catalog-card-category">${product.category}</span>
      </div>
      <div class="catalog-card-content">
        <h3>${product.name}</h3>
        <p class="catalog-card-description">${product.description}</p>
        <div class="catalog-card-specs">
          <h4>ESPECIFICAÇÕES TÉCNICAS</h4>
          <dl>${specs}</dl>
        </div>
        <div class="catalog-card-footer">
          <div><span class="price-label">${product.price === null ? "PREÇO" : "POR PACOTE"}</span><strong>${formatPrice(product.price)}</strong></div>
          <button class="button button-red add-to-cart" type="button" data-product="${product.id}">
            Adicionar ao carrinho <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
    `;
    registerImageFallbacks(card);
    catalog.append(card);
  });

  catalog.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.product));
  });
}

function changeQuantity(id, amount) {
  if (!Object.hasOwn(cart, id)) return;
  cart[id] += amount;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  delete cart[id];
  saveCart();
  renderCart();
}

function renderCart() {
  const list = document.querySelector("#cart-items-list");
  if (!list) return;

  list.replaceChildren();
  let subtotal = 0;
  const entries = Object.entries(cart);

  if (entries.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-cart";
    empty.innerHTML = '<div class="empty-cart-mark" aria-hidden="true">✳</div><h2>Seu carrinho está esperando</h2><p>Encontre uma textura que tenha tudo a ver com você.</p><a class="button button-red" href="index.html#colecao">Conhecer o destaque <span aria-hidden="true">↗</span></a>';
    list.append(empty);
  }

  entries.forEach(([id, quantity]) => {
    const product = products[id];
    if (!product) return;
    subtotal += product.price * quantity;

    const item = document.createElement("article");
    item.className = "cart-item";
    const specs = product.specs.map(([label, value]) =>
      `<div><dt>${label}</dt><dd>${value}</dd></div>`,
    ).join("");
    item.innerHTML = `
      <div class="cart-product">
        <img class="cart-product-image product-image" data-product-name="${product.name}" src="${product.image}" alt="${product.imageAlt}" />
        <div class="cart-product-copy">
          <p class="cart-product-category">${product.category}</p>
          <h2>${product.name}</h2>
          <p class="cart-product-description">${product.description}</p>
          <details class="cart-product-specs">
            <summary>ESPECIFICAÇÕES TÉCNICAS</summary>
            <dl>${specs}</dl>
          </details>
        </div>
      </div>
      <div class="quantity-control" aria-label="Quantidade de ${product.name}">
        <button type="button" data-action="decrease" aria-label="Diminuir quantidade de ${product.name}">−</button>
        <span class="quantity-value">${quantity}</span>
        <button type="button" data-action="increase" aria-label="Aumentar quantidade de ${product.name}">+</button>
      </div>
      <div class="cart-item-price">
        ${product.price === null ? "Consulte" : currency.format(product.price * quantity)}
        <button class="remove-item" type="button" data-action="remove">Remover</button>
      </div>
    `;
    item.querySelector('[data-action="decrease"]').addEventListener("click", () => changeQuantity(id, -1));
    item.querySelector('[data-action="increase"]').addEventListener("click", () => changeQuantity(id, 1));
    item.querySelector('[data-action="remove"]').addEventListener("click", () => removeFromCart(id));
    registerImageFallbacks(item);
    list.append(item);
  });

  const hasUnpricedItems = entries.some(([id]) => products[id].price === null);
  document.querySelector("#cart-subtotal").textContent = hasUnpricedItems ? "A consultar" : currency.format(subtotal);
  document.querySelector("#cart-total").textContent = hasUnpricedItems ? "A consultar" : currency.format(subtotal);
  document.querySelector("#checkout-button").disabled = entries.length === 0;
  updateCartCount();
}

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => addToCart(button.dataset.product));
});

renderCatalog();

const checkoutButton = document.querySelector("#checkout-button");
if (checkoutButton) {
  checkoutButton.addEventListener("click", () => {
    const message = document.querySelector("#checkout-message");
    message.hidden = false;
    message.textContent = "O pagamento online ainda não está disponível. Seus itens continuam salvos no carrinho.";
  });
}

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-navigation");
if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
    navigation.classList.toggle("is-open", !isOpen);
  });
}

updateCartCount();
renderCart();
registerImageFallbacks(document);
