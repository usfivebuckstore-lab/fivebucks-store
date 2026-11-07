/* Set to true only after payment and fulfillment are configured. */
const CHECKOUT_ENABLED=false;
const EMAIL="usfivebuckstore@gmail.com";
const L={Tech:"Tech",Everyday:"Everyday",...{"Desk & home":"Desk & Home","On the go":"On the Go",Men:"Men’s Fashion",Women:"Women’s Fashion"}};
const CATS=["All",...Object.keys(L)],$=i=>document.getElementById(i),esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const label=c=>c==="All"?"All products":L[c],split=t=>{const i=t.indexOf(" – ");return i<0?[t,""]:[t.slice(0,i),t.slice(i+3)]};
const PL={"Size":"sizes","Color / style":"styles","Model":"models","Option":"options"};
let cat="All",q="",shown=48,cur=null,sel=[],C=[];
try{C=JSON.parse(localStorage.getItem("fb_cart2")||"[]")}catch(e){}
const P=PRODUCTS,find=id=>P.find(p=>p.id===id),n=()=>C.reduce((a,i)=>a+i.q,0),cnt=c=>c==="All"?P.length:P.filter(p=>p.category===c).length;
function setCat(c,go){cat=c;q="";$("sq").value="";shown=48;render();if(go!==false)document.getElementById(c==="All"?"top":"shop")?.scrollIntoView();if(c==="All")scrollTo({top:0})}
function list(){let l=P.filter(p=>(cat==="All"||p.category===cat)&&(!q||p.title.toLowerCase().includes(q.toLowerCase())||p.tags.join(" ").toLowerCase().includes(q.toLowerCase())));const s=$("so").value;if(s==="a")l=[...l].sort((a,b)=>a.title.localeCompare(b.title));if(s==="z")l=[...l].sort((a,b)=>b.title.localeCompare(a.title));return l}
function meta(p){const m=p.options.filter(o=>o.values.length>1).map(o=>o.values.length+" "+(PL[o.name]||"options"));return m.join(" · ")}
function render(){
$("nav").innerHTML=CATS.map(c=>`<button class="${c===cat?"on":""}" onclick="setCat('${c}',false);scrollTo({top:0})">${label(c)}</button>`).join("");
$("dep").innerHTML=CATS.map(c=>`<button class="${c===cat?"on":""}" onclick="setCat('${c}',false)"><span>${label(c)}</span><span>${cnt(c)}</span></button>`).join("");
const l=list();$("rt").textContent=q?`Results for “${q}”`:label(cat);$("rc").textContent=`${l.length} product${l.length===1?"":"s"}`;
$("g").innerHTML=l.slice(0,shown).map(p=>`<article class="card" onclick="openP('${p.id}')"><img src="${p.images[0]}" alt="${esc(split(p.title)[0])}" loading="lazy"><div class="cb"><h3>${esc(split(p.title)[0])}</h3><div class="price">$5.00 <small>USD</small></div><div class="mu">${meta(p)||"&nbsp;"}</div></div></article>`).join("")||"<p>No products found. Try a different search.</p>";
$("mb").style.display=l.length>shown?"block":"none";$("cc").textContent=n();$("cc").style.display=n()?"grid":"none";
$("cats").style.display=cat==="All"&&!q?"block":"none";
$("tiles").innerHTML=CATS.slice(1).map(c=>{const p=P.find(x=>x.category===c);return`<button class="tile" onclick="setCat('${c}')"><img src="${p.images[0]}" alt=""><div><b>${label(c)}</b><small>${cnt(c)} products</small></div></button>`}).join("")}
function openP(id){cur=find(id);sel=cur.options.map(o=>o.values.length===1?0:-1);const[t,s]=split(cur.title);
$("pm").innerHTML=`<button class="x" onclick="closeP()" aria-label="Close">×</button><div><img class="main" id="bm" src="${cur.images[0]}" alt="${esc(t)}"><div class="th">${cur.gallery.map(i=>`<img data-i="${i}" class="${i===0?"on":""}" src="${cur.images[i]}" alt="" onclick="setBig(${i})">`).join("")}</div></div>
<div><div class="crumb">${label(cur.category)}</div><h1>${esc(t)}</h1>${s?`<p class="sub">${esc(s)}</p>`:""}<div class="price">$5.00 <small>USD</small></div>
${cur.options.map((o,d)=>o.values.length>1?`<div class="opt">${esc(o.name)}: <span id="sv${d}">Select</span></div><div class="pills">${o.values.map((v,j)=>`<button class="pl" data-d="${d}" data-j="${j}" onclick="pick(${d},${j})">${esc(v)}</button>`).join("")}</div>`:"").join("")}
<div class="err" id="er"></div><button class="btn p" onclick="add()">Add to cart</button>
${cur.specs.length||cur.note?`<div class="det"><h3>Product details</h3>${cur.specs.length?`<table>${cur.specs.map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join("")}</table>`:""}${cur.note?`<p class="mu">${esc(cur.note)}</p>`:""}</div>`:""}</div>`;
$("pv").classList.add("open")}
function setBig(i){$("bm").src=cur.images[i];document.querySelectorAll(".th img").forEach(t=>t.classList.toggle("on",+t.dataset.i===i))}
function closeP(){$("pv").classList.remove("open")}
function pick(d,j){sel[d]=j;document.querySelectorAll(`.pl[data-d="${d}"]`).forEach(b=>b.classList.toggle("on",+b.dataset.j===j));$("sv"+d).textContent=cur.options[d].values[j];$("er").textContent="";
const v=cur.variants.find(v=>v.o.every((x,i)=>sel[i]<0||x===sel[i]));if(v&&v.i>=0)$("bm").src=cur.images[v.i]}
function varImg(p,s){const v=p.variants.find(v=>v.o.every((x,i)=>x===s[i]));return v&&v.i>=0?p.images[v.i]:p.images[0]}
function add(){const d=sel.findIndex(x=>x<0);if(d>=0){$("er").textContent="Please select a "+cur.options[d].name.toLowerCase()+".";return}
const k=cur.id+"|"+sel.join(","),f=C.find(i=>i.k===k);f?f.q++:C.push({k,id:cur.id,s:[...sel],q:1});save();closeP();cart(1)}
function save(){try{localStorage.setItem("fb_cart2",JSON.stringify(C))}catch(e){}render();cart($("dr").classList.contains("open"))}
function chg(k,d){const i=C.find(x=>x.k===k);i.q+=d;if(i.q<1)C=C.filter(x=>x.k!==k);save()}
function rm(k){C=C.filter(x=>x.k!==k);save()}
const desc=(p,s)=>p.options.map((o,d)=>o.values.length>1?o.values[s[d]]:"").filter(Boolean).join(" / ");
function cart(o){const d=$("dr");d.classList.toggle("open",!!o);const t=n();
d.innerHTML=`<div class="dh"><h2>Cart (${t})</h2><button class="x" onclick="cart(0)" aria-label="Close cart">×</button></div><div style="flex:1;overflow:auto">${C.map(i=>{const p=find(i.id);return`<div class="ci"><img src="${varImg(p,i.s)}" alt=""><div><div class="t">${esc(split(p.title)[0])}</div><div class="mu">${esc(desc(p,i.s))}</div><b>$5.00</b><div class="q"><button onclick="chg('${i.k}',-1)" aria-label="Decrease">−</button>${i.q}<button onclick="chg('${i.k}',1)" aria-label="Increase">+</button><button class="rm" onclick="rm('${i.k}')">Remove</button></div></div></div>`}).join("")||`<p class="mu" style="margin-top:20px">Your cart is empty.</p><button class="btn" onclick="cart(0)">Continue shopping</button>`}</div>
<div style="padding-top:14px"><div style="display:flex;justify-content:space-between;font-size:18px"><span>Subtotal</span><b>$${(t*5).toFixed(2)}</b></div><div class="mu" style="margin:4px 0 12px">Shipping and taxes calculated at checkout.</div><button class="btn p" ${t&&CHECKOUT_ENABLED?"":"disabled"} onclick="checkout()">Checkout</button>${CHECKOUT_ENABLED?"":`<div class="mu" style="margin-top:8px;font-size:13px">Online checkout is not available yet. Questions? <a href="mailto:${EMAIL}">${EMAIL}</a></div>`}</div>`}
function checkout(){if(!CHECKOUT_ENABLED)return;const t=n();$("cf").innerHTML=`<button type="button" class="x" onclick="$('co').classList.remove('open')">×</button><h2>Checkout</h2><div class="mu">${t} item${t===1?"":"s"} · Subtotal $${(t*5).toFixed(2)}</div><input class="f" id="fn" placeholder="Full name" required><input class="f" id="fe" type="email" placeholder="Email" required><textarea class="f" id="fa" rows="3" placeholder="Delivery address" required></textarea><button class="btn p">Place order request</button>`;cart(0);$("co").classList.add("open")}
$("cf").onsubmit=e=>{e.preventDefault();if(!CHECKOUT_ENABLED)return;const T=C.map(i=>{const p=find(i.id);return`${i.q} x ${p.title} [${desc(p,i.s)||"no options"}] - $${(i.q*5).toFixed(2)}`}).join("\n");
location.href=`mailto:${EMAIL}?subject=`+encodeURIComponent("FiveBucks order request")+"&body="+encodeURIComponent(`Name: ${$("fn").value}\nEmail: ${$("fe").value}\nAddress: ${$("fa").value}\n\n${T}\n\nSubtotal: $${(n()*5).toFixed(2)}`)};
$("sf").onsubmit=e=>{e.preventDefault();q=$("sq").value.trim();cat="All";shown=48;render();$("shop").scrollIntoView()};$("so").onchange=render;
$("mb").onclick=()=>{shown+=48;render()};$("oc").onclick=()=>cart(1);$("yr").textContent=new Date().getFullYear();
["pv","co"].forEach(i=>$(i).addEventListener("click",e=>{if(e.target.id===i)$(i).classList.remove("open")}));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeP();cart(0);$("co").classList.remove("open")}});
render();cart(0);
