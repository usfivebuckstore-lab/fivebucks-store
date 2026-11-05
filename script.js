const products = [
  {id:'p1',name:'Pocket Bluetooth Speaker',category:'Tech',description:'Compact sound for everyday adventures.',tag:'POPULAR FIND',image:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85'},
  {id:'p2',name:'Everyday Cable Kit',category:'Tech',description:'Keep your everyday cables in order.',tag:'SMART PICK',image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=85'},
  {id:'p3',name:'Minimal Desk Organizer',category:'Desk',description:'A calmer home for your little essentials.',tag:'DESK FAVOURITE',image:'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85'},
  {id:'p4',name:'Reusable Water Bottle',category:'Everyday',description:'A simple sidekick for busy days.',tag:'DAILY ESSENTIAL',image:'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85'},
  {id:'p5',name:'Travel Pouch',category:'On the go',description:'Small-space storage, wherever you go.',tag:'ON THE GO',image:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85'},
  {id:'p6',name:'Soft Touch Phone Stand',category:'Desk',description:'A handy angle for calls and videos.',tag:'CLEVER LITTLE FIND',image:'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=85'}
];
const cart = new Map();
const grid = document.getElementById('product-grid');
const drawer = document.getElementById('cart-drawer');
const overlay = document.getElementById('overlay');
let activeFilter = 'All';
let toastTimer;

const money = value => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value);

function renderProducts(){
  const query = document.getElementById('product-search').value.trim().toLowerCase();
  const shown = products.filter(p => (activeFilter === 'All' || p.category === activeFilter) &&
    (p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)));
  grid.innerHTML = shown.length ? shown.map(p => `
    <article class="product-card">
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <span class="product-tag">${p.tag}</span>
        <button class="product-add" data-add="${p.id}" aria-label="Add ${p.name} to bag">+</button>
      </div>
      <div class="product-meta"><div><h3>${p.name}</h3><p>${p.description}</p></div><div class="product-price">$5</div></div>
    </article>`).join('') : '<div class="no-results">No finds match that search. Try another word.</div>';
}
function addToCart(id){cart.set(id,(cart.get(id)||0)+1);renderCart();showToast('Added to your bag');}
function changeQty(id,delta){const qty=(cart.get(id)||0)+delta;if(qty<=0)cart.delete(id);else cart.set(id,qty);renderCart();}
function renderCart(){
  const count=[...cart.values()].reduce((a,b)=>a+b,0);
  document.getElementById('cart-count').textContent=count;
  document.getElementById('drawer-count').textContent=`(${count})`;
  document.getElementById('subtotal').textContent=money(count*5);
  document.getElementById('checkout-button').disabled=count===0;
  const items=document.getElementById('cart-items');
  if(!count){items.innerHTML='<div class="empty-cart"><span>✳</span><h3>Your bag is looking a little empty.</h3><p>Find something good for five bucks.</p><button class="button button-dark" id="continue-shopping">Explore finds</button></div>';return;}
  items.innerHTML=[...cart.entries()].map(([id,qty])=>{
    const p=products.find(item=>item.id===id);
    return `<div class="cart-line"><img src="${p.image}" alt=""><div><h3>${p.name}</h3><p>$5 each</p><div class="qty-controls"><button data-qty="${id}" data-delta="-1" aria-label="Remove one">−</button><span>${qty}</span><button data-qty="${id}" data-delta="1" aria-label="Add one">+</button></div></div><div class="line-price">${money(qty*5)}</div></div>`;
  }).join('');
}
function openCart(){drawer.classList.add('open');overlay.classList.add('show');document.body.style.overflow='hidden';document.getElementById('close-cart').focus();}
function closeCart(){drawer.classList.remove('open');overlay.classList.remove('show');document.body.style.overflow='';}
function showToast(message){const toast=document.getElementById('toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2200);}

document.getElementById('filters').addEventListener('click',event=>{
  const button=event.target.closest('[data-filter]');if(!button)return;
  activeFilter=button.dataset.filter;
  document.querySelectorAll('.filter').forEach(item=>item.classList.toggle('active',item===button));
  renderProducts();
});
document.getElementById('product-search').addEventListener('input',renderProducts);
document.getElementById('focus-search').addEventListener('click',()=>{document.getElementById('shop').scrollIntoView({behavior:'smooth'});setTimeout(()=>document.getElementById('product-search').focus(),350);});
document.getElementById('product-grid').addEventListener('click',event=>{const button=event.target.closest('[data-add]');if(button)addToCart(button.dataset.add);});
document.getElementById('open-cart').addEventListener('click',openCart);
document.getElementById('close-cart').addEventListener('click',closeCart);
overlay.addEventListener('click',closeCart);
document.getElementById('cart-items').addEventListener('click',event=>{
  const quantityButton=event.target.closest('[data-qty]');
  if(quantityButton)changeQty(quantityButton.dataset.qty,Number(quantityButton.dataset.delta));
  if(event.target.id==='continue-shopping')closeCart();
});
document.getElementById('checkout-button').addEventListener('click',()=>showToast('Checkout is not connected yet. No payment has been taken.'));
document.getElementById('newsletter-form').addEventListener('submit',event=>{event.preventDefault();showToast('Newsletter sign-up is not connected yet.');});
document.getElementById('menu-toggle').addEventListener('click',()=>{
  const nav=document.getElementById('site-nav');
  const isOpen=nav.classList.toggle('open');
  document.getElementById('menu-toggle').setAttribute('aria-expanded',String(isOpen));
});
document.querySelectorAll('[data-jump-filter]').forEach(card=>card.addEventListener('click',()=>{
  activeFilter=card.dataset.jumpFilter;
  document.querySelectorAll('.filter').forEach(button=>button.classList.toggle('active',button.dataset.filter===activeFilter));
  renderProducts();
}));
document.querySelectorAll('.nav a').forEach(link=>link.addEventListener('click',()=>{
  document.getElementById('site-nav').classList.remove('open');
  document.getElementById('menu-toggle').setAttribute('aria-expanded','false');
}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeCart();document.getElementById('site-nav').classList.remove('open');}});
document.getElementById('year').textContent=new Date().getFullYear();
renderProducts();renderCart();
