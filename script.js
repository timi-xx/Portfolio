const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const menu = $("#mobileMenu");
$("#menuBtn").onclick = () => menu?.classList.add("open");
$("#closeMenu").onclick = () => menu?.classList.remove("open");
$$(".mobile-menu a").forEach(a => a.onclick = () => menu.classList.remove("open"));

$("#searchBtn").onclick = () => $("#searchDrawer")?.classList.add("open");
$("#closeSearch").onclick = () => $("#searchDrawer")?.classList.remove("open");

const products = {
  "Pink Dawn": { price: 95000, notes: "RED ROSE · RED PLUM · SAFFRON", color: "Red", image: "red.jpg" },
  "Blue Mist": { price: 110000, notes: "SAFFRON · CEDAR · AMBER", color: "Blue", image: "blue.jpg" },
  "Tulsi": { price: 105000, notes: "CLOVE BASIL · JASMINE · FREESIA", color: "Green", image: "green.jpg" },
  "Honey": { price: 120000, notes: "IRIS · VANILLA · SANDALWOOD", color: "Amber", image: "amber.jpg" }
};
let bag = [];

function money(n){ return "₦" + n.toLocaleString("en-NG"); }

function renderBag(){
  $("#bagCount").textContent = bag.length;
  const box = $("#bagItems");
  if(!bag.length){
    box.innerHTML = '<p class="empty">Your bag is currently empty.</p>';
  } else {
    box.innerHTML = bag.map((p,i)=>`
      <div class="bag-row">
        <img class="bag-thumbnail" src="${p.image}" alt="${p.name} fragrance bottle">
        <span class="bag-item-details">${p.name}<small>${p.color} · ${p.notes}</small></span>
        <span>${money(p.price)} <button class="remove" onclick="removeItem(${i})">×</button></span>
      </div>`).join("");
  }
  $("#bagTotal").textContent = money(bag.reduce((sum,p)=>sum+p.price,0));
}
window.removeItem = i => { bag.splice(i,1); renderBag(); };

$$(".add-btn").forEach(btn=>{
  btn.onclick=()=>{
    const product = products[btn.dataset.product];
    bag.push({name:btn.dataset.product, notes:product.notes, color:product.color, image:product.image, price:product.price});
    renderBag();
    $("#bag").classList.add("open");
  };
});
$("#bagBtn").onclick=()=>$("#bag").classList.add("open");
$("#closeBag").onclick=()=>$("#bag").classList.remove("open");
$(".checkout").onclick=()=>{
  if(!bag.length){
    alert("Your bag is currently empty.");
    return;
  }

  const paymentMethod = $("#paymentMethod").value;
  const total = bag.reduce((sum,p)=>sum+p.price,0);
  const itemLines = bag.map((p,index) =>
    `${index + 1}. ${p.name} (${p.color})\n   Notes: ${p.notes}\n   Price: ${money(p.price)}`
  ).join("\n\n");
  const message = [
    "Hello 1546 Fragrance House,",
    "",
    "I would like to place the following order:",
    "",
    itemLines,
    "",
    `TOTAL: ${money(total)}`,
    `PAYMENT METHOD: ${paymentMethod}`,
    "",
    "Please confirm availability and the next steps for payment and delivery."
  ].join("\n");
  window.open(`https://wa.me/2348025168334?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
};

$("#searchInput").addEventListener("input", e=>{
  const q=e.target.value.toLowerCase().trim();
  const matches=Object.keys(products).filter(p=>{
    const product = products[p];
    return `${p} ${product.notes} ${product.color}`.toLowerCase().includes(q);
  });
  $("#searchResults").innerHTML = q
    ? (matches.length ? matches.map(p=>`<button class="search-result" data-product="${p}"><img src="${products[p].image}" alt=""><span><strong>${p}</strong><small>${products[p].color} · ${products[p].notes}</small><small>${money(products[p].price)}</small></span></button>`).join("") : `<p class="search-empty">No fragrance found.</p>`)
    : "";
});

$("#searchResults").addEventListener("click", e=>{
  const result = e.target.closest(".search-result");
  if(!result) return;
  const card = [...document.querySelectorAll(".product-card")].find(item=>item.dataset.name===result.dataset.product);
  document.querySelectorAll(".product-card").forEach(item=>item.style.display="");
  $("#searchDrawer").classList.remove("open");
  if(card){
    card.scrollIntoView({behavior:"smooth", block:"center"});
    card.classList.add("search-highlight");
    setTimeout(()=>card.classList.remove("search-highlight"), 1400);
  }
});

$$(".note-list button").forEach(btn=>{
  btn.onclick=()=>{
    const family=btn.dataset.filter;
    document.querySelectorAll(".product-card").forEach(card=>{
      card.style.display = card.dataset.family===family ? "" : "none";
    });
    $("#collection").scrollIntoView({behavior:"smooth"});
  };
});

let quizAnswer = "";
$("#quizBtn").onclick=()=>$("#quizModal").classList.add("open");
$("#closeQuiz").onclick=()=>$("#quizModal").classList.remove("open");

const recommendations={
  fresh:"Tulsi",
  woody:"Blue Mist",
  floral:"Pink Dawn",
  amber:"Honey"
};
$$(".quiz-options button").forEach(btn=>{
  btn.onclick=()=>{
    quizAnswer=btn.dataset.answer;
    const productName = recommendations[quizAnswer];
    const product = products[productName];
    $("#quizContent").innerHTML=`
      <p class="kicker">YOUR 1546 MATCH</p>
      <img class="quiz-product-image" src="${product.image}" alt="${productName} fragrance bottle">
      <h2>${productName}</h2>
      <p class="quiz-product-details">${product.color} · ${product.notes}<br>${money(product.price)}</p>
      <button type="button" class="btn btn-dark" id="viewMatch" style="margin-top:28px">VIEW FRAGRANCE</button>`;
    $("#viewMatch").onclick=()=>{
      $("#quizModal").classList.remove("open");
      const card = [...document.querySelectorAll(".product-card")].find(item=>item.dataset.name===productName);
      card?.scrollIntoView({behavior:"smooth", block:"center"});
    };
  };
});

$("#newsletterForm").onsubmit=e=>{
  e.preventDefault();
  $("#newsletterMsg").textContent="WELCOME TO THE HOUSE OF 1546.";
  e.target.reset();
};

renderBag();
