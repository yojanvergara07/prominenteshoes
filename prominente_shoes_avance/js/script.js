let cart = JSON.parse(localStorage.getItem('prominenteCart') || '[]');

const money = n => n > 0 
  ? n.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }) 
  : 0;

function saveCart() {
  localStorage.setItem('prominenteCart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const el = document.getElementById('cart-count');
  if (el) el.textContent = cart.reduce((s, p) => s + p.qty, 0);
}

function addProduct(id) {
  const p = productos.find(x => x.id === id);
  if (!p) return;

  const old = cart.find(x => x.id === id);
  if (old) old.qty++;
  else cart.push({ ...p, qty: 1 });

  saveCart();
  alert('Producto agregado al carrito de demostración.');
  renderCart();
}

function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const cat = grid.dataset.category || 'todos';
  const search = (document.getElementById('search')?.value || '').toLowerCase();

  const list = productos.filter(p => 
    (cat === 'todos' || p.categoria === cat) && 
    p.nombre.toLowerCase().includes(search)
  );

  grid.innerHTML = '';

  list.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}">
      <div class="pad">
        <small class="eyebrow">${p.categoria}</small>
        <h3>${p.nombre}</h3>
        <p>${p.descripcion}</p>
        <strong class="price">${money(p.precio)}</strong>
        <br>
        <button class="btn" type="button" data-add="${p.id}">Agregar al carrito</button> 
        <a class="btn" href="producto.html">Ver detalle</a>
      </div>
    `;

    const img = card.querySelector('img');
    img.onerror = () => { img.src = 'imagenes/categoria-sandalias.png'; };

    grid.appendChild(card);
  });

  grid.querySelectorAll('[data-add]').forEach(b => 
    b.addEventListener('click', () => addProduct(Number(b.dataset.add)))
  );
}

function renderCart() {
  const list = document.getElementById('cart-list');
  if (!list) return;

  list.innerHTML = '';

  if (!cart.length) {
    list.innerHTML = '<p class="muted">Tu carrito está vacío. Visita los catálogos para agregar productos.</p>';
  }

  cart.forEach(p => {
    const row = document.createElement('div');
    row.className = 'cartrow';
    row.innerHTML = `
      <span>${p.nombre} × ${p.qty}<br><small class="price">${money(p.precio)}</small></span>
      <span>
        <button type="button" data-minus="${p.id}">−</button> 
        <button type="button" data-plus="${p.id}">+</button>
      </span>
    `;
    list.appendChild(row);
  });

  const total = cart.reduce((s, p) => s + p.precio * p.qty, 0);
  const t = document.getElementById('cart-total');
  if (t) t.textContent = 'Total estimado: ' + money(total);

  list.querySelectorAll('[data-minus]').forEach(b => 
    b.onclick = () => {
      const p = cart.find(x => x.id === Number(b.dataset.minus));
      p.qty--;
      if (p.qty < 1) cart = cart.filter(x => x.id !== p.id);
      saveCart();
      renderCart();
    }
  );

  list.querySelectorAll('[data-plus]').forEach(b => 
    b.onclick = () => {
      cart.find(x => x.id === Number(b.dataset.plus)).qty++;
      saveCart();
      renderCart();
    }
  );
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderProducts();
  renderCart();

  document.getElementById('search')?.addEventListener('input', renderProducts);

  document.getElementById('clear-cart')?.addEventListener('click', () => {
    cart = [];
    saveCart();
    renderCart();
  });

  document.getElementById('contact-form')?.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('form-msg').textContent = 'Gracias. Formulario de demostración: aún no envía mensajes reales.';
    e.target.reset();
  });

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});