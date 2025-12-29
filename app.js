
// Utility to get numeric INR value in rupees
function toNumber(v){ return Number(String(v).replace(/[^0-9.-]/g, '')); }

// Cart state
const cart = [];

function renderCart(){
  const el = document.getElementById('cart-summary');
  if(!el) return;
  const total = cart.reduce((sum, item)=> sum + (item.price * item.quantity), 0);
  el.textContent = cart.length ? `Items: ${cart.length} | Total: ₹${total.toFixed(2)}` : 'Cart is empty';
}

// Add to Cart & GA4 event
function addToCart(productEl){
  const sku = productEl.dataset.sku;
  const name = productEl.dataset.name;
  const category = productEl.dataset.category;
  const price = toNumber(productEl.dataset.price);
  const item = { item_id: sku, item_name: name, item_category: category, price: price, quantity: 1 };
  cart.push({ ...item });
  renderCart();

  // Recommended event per GA4: add_to_cart
  gtag('event', 'add_to_cart', {
    currency: 'INR',
    value: price,
    items: [ item ]
  });
}

// Wire up product buttons
Array.from(document.querySelectorAll('.product .add-to-cart')).forEach(btn => {
  btn.addEventListener('click', e => {
    const p = e.currentTarget.closest('.product');
    addToCart(p);
  });
});

// CTA click custom event with dimension parameter cta_location
Array.from(document.querySelectorAll('.cta')).forEach(btn => {
  btn.addEventListener('click', e => {
    const loc = e.currentTarget.dataset.ctaLocation || 'unknown';
    gtag('event', 'cta_click', { cta_location: loc });
  });
});

// Begin checkout event
document.getElementById('begin-checkout').addEventListener('click', () => {
  const value = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  gtag('event', 'begin_checkout', {
    currency: 'INR',
    value: value,
    items: cart
  });
  alert('Checkout started (demo).');
});

// Complete purchase demo (adds shipping_amount custom metric)
document.getElementById('complete-purchase').addEventListener('click', () => {
  if(cart.length === 0){ alert('Cart is empty'); return; }
  const value = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const shipping = 99; // flat demo shipping fee
  const transactionId = 'T' + Date.now();

  gtag('event', 'purchase', {
    transaction_id: transactionId,
    currency: 'INR',
    value: value + shipping,
    shipping_amount: shipping, // custom metric candidate
    items: cart
  });
  alert('Purchase sent to GA4 (demo).');
});

// Create Account form: GA4 recommended sign_up + custom file_upload
const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(signupForm);
  const method = data.get('signup_method') || 'email';

  // Sign-up event
  gtag('event', 'sign_up', { method: method, form_name: 'signup' });

  // Set user property example
  gtag('set', 'user_properties', { user_type: 'registered' });

  alert('Account created (demo).');
});

// File upload tracking (custom event)
const kycInput = document.getElementById('kyc-file');
kycInput.addEventListener('change', (e) => {
  const f = e.target.files && e.target.files[0];
  if(!f) return;
  const sizeKB = Math.round(f.size / 1024);
  const ext = (f.name.split('.').pop() || '').toLowerCase();
  gtag('event', 'file_upload', {
    file_type: ext,
    file_size_kb: sizeKB
  });
});

// Contact form -> generate_lead recommended event
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  gtag('event', 'generate_lead', { form_name: 'contact' });
  alert('Message sent (demo).');
});

// Optional: track product tile click as select_item
Array.from(document.querySelectorAll('.product img, .product h3')).forEach(el => {
  el.addEventListener('click', e => {
    const p = e.currentTarget.closest('.product');
    const item = {
      item_id: p.dataset.sku,
      item_name: p.dataset.name,
      item_category: p.dataset.category,
      price: toNumber(p.dataset.price),
    };
    gtag('event', 'select_item', { items: [ item ]});
  });
});
