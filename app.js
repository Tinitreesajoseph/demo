
/***** SAFETY GUARD *****/
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){ dataLayer.push(arguments); };

/***** UTIL *****/
function toNumber(v){ return Number(String(v).replace(/[^0-9.-]/g, '')); }

/***** CART STATE *****/
const cart = [];

/***** RENDER CART *****/
function renderCart(){
  const el = document.getElementById('cart-summary');
  if(!el) return; // <-- leave only this comment
  const total = cart.reduce((sum, item)=> sum + (item.price * item.quantity), 0);
  el.textContent = cart.length ? `Items: ${cart.length} | Total: ₹${total.toFixed(2)}` : 'Cart is empty';
}

/***** ADD TO CART *****/
function addToCart(productEl){
  const item = {
    item_id: productEl.dataset.sku,
    item_name: productEl.dataset.name,
    item_category: productEl.dataset.category,
    price: toNumber(productEl.dataset.price),
    quantity: 1
  };
  cart.push({ ...item });
  renderCart();

  console.log('[ATC]', item);
  gtag('event', 'add_to_cart', {
    currency: 'INR',
    value: item.price,
    items: [ item ]
  });
}

/***** WIRE PRODUCT BUTTONS *****/
document.querySelectorAll('.product .add-to-cart').forEach(btn => {
  btn.addEventListener('click', e => addToCart(e.currentTarget.closest('.product')));
});

/***** CTA CLICKS (HEADER/FOOTER) *****/
document.querySelectorAll('.cta').forEach(btn => {
  btn.addEventListener('click', e => {
    const loc = e.currentTarget.dataset.ctaLocation || 'unknown'; // header/footer
    console.log('[CTA]', loc);
    gtag('event', 'cta_click', { cta_location: loc });
  });
});

/***** BEGIN CHECKOUT *****/
const beginBtn = document.getElementById('begin-checkout');
if(beginBtn){
  beginBtn.addEventListener('click', () => {
    const value = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    console.log('[BEGIN_CHECKOUT] cart value', value, cart);
    gtag('event', 'begin_checkout', {
      currency: 'INR',
      value: value,
      items: cart
    });
    alert('Checkout started (demo).');
  });
}

/***** COMPLETE PURCHASE (INCLUDES shipping_amount) *****/
const completeBtn = document.getElementById('complete-purchase');
if(completeBtn){
  completeBtn.addEventListener('click', () => {
    if(cart.length === 0){ alert('Cart is empty'); return; }
    const value = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const shipping = 99;                // change as needed
    const transactionId = 'T' + Date.now();

    console.log('[PURCHASE] value, shipping', value, shipping);
    gtag('event', 'purchase', {
      transaction_id: transactionId,
      currency: 'INR',
      value: value + shipping,
      shipping_amount: shipping,        // custom metric parameter
      items: cart
    });
    alert('Purchase sent to GA4 (demo).');
  });
}

/***** SIGNUP FORM -> sign_up *****/
const signupForm = document.getElementById('signup-form');
if(signupForm){
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(signupForm);
    const method = data.get('signup_method') || 'email';

    console.log('[SIGN_UP]', method);
    gtag('event', 'sign_up', { method: method, form_name: 'signup' });

    // Optional user property
    gtag('set', 'user_properties', { user_type: 'registered' });

    alert('Account created (demo).');
  });
}

/***** FILE UPLOAD -> file_upload *****/
const kycInput = document.getElementById('kyc-file');
if(kycInput){
  kycInput.addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    if(!f) return;
    const sizeKB = Math.round(f.size / 1024);
    const ext = (f.name.split('.').pop() || '').toLowerCase();

    console.log('[UPLOAD]', ext, sizeKB);
    gtag('event', 'file_upload', {
      file_type: ext,
      file_size_kb: sizeKB
    });
  });
}

/***** CONTACT FORM -> generate_lead *****/
const contactForm = document.getElementById('contact-form');
if(contactForm){
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('[LEAD] contact form submitted');
    gtag('event', 'generate_lead', { form_name: 'contact' });
    alert('Message sent (demo).');
  });
}

/***** PRODUCT TILE -> select_item *****/
document.querySelectorAll('.product img, .product h3').forEach(el => {
  el.addEventListener('click', e => {
    const p = e.currentTarget.closest('.product');
    const item = {
      item_id: p.dataset.sku,
      item_name: p.dataset.name,
      item_category: p.dataset.category,
      price: toNumber(p.dataset.price)
    };
    console.log('[SELECT_ITEM]', item);
    gtag('event', 'select_item', { items: [ item ]});
  });
});
``
