const E={Tech:"Tech",Everyday:"Everyday","Desk & home":"Desk & home","On the go":"On the go",Men:"Men’s fashion",Women:"Women’s fashion"};
const CATS=["All",...Object.keys(E)],$=i=>document.getElementById(i),esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const label=c=>c==="All"?"All products":E[c];
let cat="All",q="",shown=48,cur=null,sel=[],big=0,C=[];
try{C=JSON.parse(localStorage.getItem("fb_cart2")||"[]")}catch(e){}
const P=PRODUCTS,find=id=>P.find(p=>p.id===id),n=()=>C.reduce((a,i)=>a+i.q,0);
function setCat(c){cat=c;q="";$("sq").value="";shown=48;render();scrollTo({top:0})}
function list(){let l=P.filter(p=>(cat==="All"||p.category===cat)&&(!q||(p.title+" "+p.tags.join(" ")).toLowerCase().includes(q.toLowerCase())));const s=$("so").value;if(s==="a")l=[...l].sort((a,b)=>a.title.localeCompare(b.title));if(s==="z")l=[...l].sort((a,b)=>b.title.localeCompare(a.title));return l}
function render(){const cnt=c=>c==="All"?P.length:P.filter(p=>p.category===c).length;
$("nav").innerHTML=CATS.map(c=>`<button class="${c===cat?"on":""}" onclick="setCat('${c}')">${label(c)}</button>`).join("");
$("dep").innerHTML=CATS.map(c=>`<button class="${c===cat?"on":""}" onclick="setCat('${c}')">${label(c)} (${cnt(c)})</button>`).join("");
$("sc").innerHTML=CATS.map(c=>`<option value="${c}" ${c===cat?"selected":""}>${label(c)}</option>`).join("");
const l=list();$("rc").textContent=`${l.length} result${l.length===1?"":"s"}${cat!=="All"?" in "+label(cat):""}${q?` for “${q}”`:""}`;
$("g").innerHTML=l.slice(0,shown).map(p=>{const k=p.options.filter(o=>o.values.length>1).length;return`<div class="card"><img src="${p.images[0]}" alt="${esc(p.title)}" loading="lazy" onclick="openP('${p.id}')"><h3 onclick="openP('${p.id}')">${esc(p.title)}</h3><div class="price"><sup>$</sup>5<sup>00</sup></div><div class="mu">${k?"Choose "+p.options.filter(o=>o.values.length>1).map(o=>o.name.toLowerCase()).join(" & "):"Ready to order"}</div><button class="btn" onclick="openP('${p.id}')">See options</button></div>`}).join("")||"<p>No products found.</p>";
$("mb").style.display=l.length>shown?"block":"none";$("cc").textContent=n();
$("tiles").innerHTML=cat==="All"&&!q?CATS.slice(1).map(c=>{const p=P.find(x=>x.category===c);return`<button class="tile" onclick="setCat('${c}')"><img src="${p.images[0]}" alt=""><b>${label(c)}</b><small>${cnt(c)} items · $5 each</small></button>`}).join(""):""}
function setBig(i){big=i;const u=P_img(cur,i);$("bm").src=u;document.querySelectorAll(".th img").forEach(t=>t.classList.toggle("on",+t.dataset.i===i))}
const P_img=(p,i)=>p.images[i]||p.images[0];
function openP(id){cur=find(id);sel=cur.options.map(o=>o.values.length===1?0:-1);
$("pm").innerHTML=`<button class="x" onclick="closeP()" aria-label="Close">×</button><div><img class="main" id="bm" src="${cur.images[0]}" alt="${esc(cur.title)}"><div class="th">${cur.gallery.map(i=>`<img data-i="${i}" class="${i===0?"on":""}" src="${cur.images[i]}" alt="" onclick="setBig(${i})">`).join("")}</div></div>
<div><h2 style="margin:0 0 6px;font-weight:500">${esc(cur.title)}</h2><div class="mu">${label(cur.category)}</div><div class="price" style="margin:8px 0">$5.00</div><div class="mu">Shipping confirmed before you pay.</div>
${cur.options.map((o,d)=>o.values.length>1?`<div class="opt">${esc(o.name)}: <span id="sv${d}"></span></div><div class="pills">${o.values.map((v,j)=>`<button class="pl" data-d="${d}" data-j="${j}" onclick="pick(${d},${j})">${esc(v)}</button>`).join("")}</div>`:"").join("")}
<div class="err" id="er"></div><button class="btn o" style="width:100%" onclick="add()">Add to cart</button>
${cur.note?`<p class="mu">${esc(cur.note)}</p>`:""}${cur.specs.length?`<table>${cur.specs.map(s=>`<tr><td>${esc(s[0])}</td><td>${esc(s[1])}</td></tr>`).join("")}</table>`:""}</div>`;
$("pv").classList.add("open")}
function closeP(){$("pv").classList.remove("open")}
function pick(d,j){sel[d]=j;document.querySelectorAll(`.pl[data-d="${d}"]`).forEach(b=>b.classList.toggle("on",+b.dataset.j===j));$("sv"+d).textContent=cur.options[d].values[j];$("er").textContent="";
const v=cur.variants.find(v=>v.o.every((x,i)=>sel[i]<0||x===sel[i]));if(v&&v.i>=0)$("bm").src=cur.images[v.i]}
function varImg(p,s){const v=p.variants.find(v=>v.o.every((x,i)=>x===s[i]));return v&&v.i>=0?p.images[v.i]:p.images[0]}
function add(){if(sel.some(x=>x<0)){const d=sel.findIndex(x=>x<0);$("er").textContent="Please choose a "+cur.options[d].name.toLowerCase()+".";return}
const k=cur.id+"|"+sel.join(","),f=C.find(i=>i.k===k);f?f.q++:C.push({k,id:cur.id,s:[...sel],q:1});save();closeP();cart(1)}
function save(){try{localStorage.setItem("fb_cart2",JSON.stringify(C))}catch(e){}render();cart($("dr").classList.contains("open"))}
function chg(k,d){const i=C.find(x=>x.k===k);i.q+=d;if(i.q<1)C=C.filter(x=>x.k!==k);save()}
const desc=(p,s)=>p.options.map((o,d)=>o.values.length>1?o.values[s[d]]:"").filter(Boolean).join(" / ");
function cart(o){const d=$("dr");d.classList.toggle("open",!!o);const t=n();
d.innerHTML=`<div style="display:flex;justify-content:space-between"><h2 style="margin:0">Shopping cart</h2><button class="x" style="position:static" onclick="cart(0)">×</button></div><div style="flex:1;overflow:auto">${C.map(i=>{const p=find(i.id);return`<div class="ci"><img src="${varImg(p,i.s)}" alt=""><div>${esc(p.title)}<div class="mu">${esc(desc(p,i.s))}</div><b>$5.00</b><div class="q"><button onclick="chg('${i.k}',-1)">−</button> ${i.q} <button onclick="chg('${i.k}',1)">+</button></div></div></div>`}).join("")||"<p>Your cart is empty.</p>"}</div><div style="padding-top:10px"><div style="font-size:18px">Items (${t}): <b>$${(t*5).toFixed(2)}</b></div><div class="mu">Shipping is confirmed before you pay.</div><button class="btn o" style="width:100%;margin-top:8px" ${t?"":"disabled"} onclick="checkout()">Proceed to checkout</button></div>`}
function checkout(){const t=n();$("cf").innerHTML=`<button type="button" class="x" onclick="$('co').classList.remove('open')">×</button><h2 style="margin:0">Checkout</h2><div>${t} item${t===1?"":"s"} · Items total <b>$${(t*5).toFixed(2)}</b></div><input class="f" id="fn" placeholder="Full name" required><input class="f" id="fe" type="email" placeholder="Email" required><textarea class="f" id="fa" rows="3" placeholder="Delivery address" required></textarea><button class="btn o">Send order request</button><div class="mu">This opens your email app with your order ready to send. We reply with the shipping cost and how to pay.</div>`;cart(0);$("co").classList.add("open")}
$("cf").onsubmit=e=>{e.preventDefault();const L=C.map(i=>{const p=find(i.id);return`${i.q} x ${p.title} [${desc(p,i.s)||"no options"}] - $${(i.q*5).toFixed(2)}`}).join("\n");
location.href="mailto:usfivebuckstore@gmail.com?subject="+encodeURIComponent("FiveBucks order request")+"&body="+encodeURIComponent(`Name: ${$("fn").value}\nEmail: ${$("fe").value}\nAddress: ${$("fa").value}\n\n${L}\n\nItems total: $${(n()*5).toFixed(2)} (shipping to be confirmed)`)};
$("sf").onsubmit=e=>{e.preventDefault();q=$("sq").value;shown=48;render()};$("sc").onchange=e=>setCat(e.target.value);$("so").onchange=render;
$("mb").onclick=()=>{shown+=48;render()};$("oc").onclick=()=>cart(1);$("yr").textContent=new Date().getFullYear();
["pv","co"].forEach(i=>$(i).addEventListener("click",e=>{if(e.target.id===i)$(i).classList.remove("open")}));
render();cart(0);
