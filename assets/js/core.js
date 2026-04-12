// ===================================
// SHARED CORE JAVASCRIPT
// ===================================
// This file contains all core functionality
// Language-specific text is loaded from translation files

const destinations = [
  {id:1,name:"Paris",country:"France",continent:"europe",emoji:"🗼",badge:"Romantic",desc:"The City of Light — where art, cuisine, and romance converge along the River Seine.",history:"Paris was founded around 250 BC by the Parisii Celtic tribe. Julius Caesar conquered it in 52 BC. It became the French capital in 987 AD and flourished through the Renaissance, the Revolution, two World Wars, and emerged as a global cultural capital and fashion hub.",best:"Apr–Jun · Sep–Nov",types:["couple","solo"],solo:"Walk the Marais, café culture, world-class museums, solo jazz bars.",couple:"Seine river cruise, Eiffel Tower at night, wine tasting in Montmartre.",family:"Disneyland Paris nearby, Louvre, Luxembourg Gardens.",budget:"€€€",visa:"Schengen Visa",lang:"French",currency:"Euro (€)",timezone:"Europe/Paris",tags:["couple","solo"]},
  {id:2,name:"Kyoto",country:"Japan",continent:"asia",emoji:"⛩️",badge:"Cultural",desc:"Ancient temples, bamboo forests, geishas — Japan's soul perfectly preserved in one city.",history:"Kyoto served as Japan's imperial capital for over 1,000 years (794–1869). It escaped heavy WWII bombing, preserving 1,600+ Buddhist temples and 400+ Shinto shrines including 17 UNESCO World Heritage Sites.",best:"Mar–May · Oct–Nov",types:["solo","couple","family"],solo:"Philosopher's Path, temple-hopping at dawn, authentic ryokan stays.",couple:"Arashiyama bamboo at sunrise, kimono rental, private tea ceremony.",family:"Nijo Castle, Arashiyama Monkey Park, cultural craft workshops.",budget:"€€€",visa:"Visa-free (many countries)",lang:"Japanese",currency:"Yen (¥)",timezone:"Asia/Tokyo",tags:["solo","couple","family"]},
  {id:3,name:"Santorini",country:"Greece",continent:"europe",emoji:"🏛️",badge:"Scenic",desc:"Whitewashed cliffs, volcanic sunsets, Aegean blue — pure Mediterranean magic.",history:"Shaped by one of history's largest volcanic eruptions (c.1600 BC) — possibly inspiring the Atlantis legend. Colonised by Phoenicians, then Minoans. Later a key Byzantine and Venetian trading post in the Aegean.",best:"May–October",types:["couple","solo"],solo:"Cliff hikes, volcanic wine tours, photography at Oia.",couple:"Private villa, Oia sunset, catamaran cruise around caldera.",family:"Black sand beaches, Akrotiri ruins, boat trips around the island.",budget:"€€€€",visa:"Schengen Visa",lang:"Greek",currency:"Euro (€)",timezone:"Europe/Athens",tags:["couple","solo"]},
  {id:4,name:"New York City",country:"USA",continent:"americas",emoji:"🗽",badge:"Urban",desc:"The city that never sleeps — energy, culture, world-class food, and ambition on every block.",history:"Founded as New Amsterdam by Dutch settlers in 1626, seized by British in 1664 and renamed New York. Briefly the US capital in 1789–90. It became America's largest city, welcoming 12 million immigrants through Ellis Island between 1892–1954.",best:"Apr–Jun · Sep–Nov",types:["solo","couple","family"],solo:"Brooklyn walks, jazz bars in Harlem, food tours, open mic nights.",couple:"Central Park picnic, Broadway show, High Line sunset, fine dining.",family:"Central Park Zoo, Natural History Museum, Times Square, NYC ferry.",budget:"€€€€",visa:"ESTA / Visa required",lang:"English",currency:"USD ($)",timezone:"America/New_York",tags:["solo","couple","family"]},
  {id:5,name:"Bali",country:"Indonesia",continent:"asia",emoji:"🌺",badge:"Paradise",desc:"Sacred temples, terraced rice fields, surf beaches — a spiritual island of eternal beauty.",history:"Bali's Hindu-Buddhist culture dates to the 1st century AD. The Majapahit Empire's fall in 1343 brought mass Hindu migration here. It survived Dutch colonisation (1908) while retaining its unique Balinese culture unlike the rest of Muslim Indonesia.",best:"Apr–October",types:["solo","couple","family"],solo:"Yoga retreats, surf lessons, budget guesthouses in Canggu, Ubud arts.",couple:"Private villas, sunset at Tanah Lot, romantic couples spa retreat.",family:"Monkey Forest, Bali Safari Park, Waterbom water park Kuta.",budget:"€€",visa:"Visa on arrival",lang:"Balinese / Indonesian",currency:"IDR (Rp)",timezone:"Asia/Makassar",tags:["solo","couple","family"]},
  {id:6,name:"Machu Picchu",country:"Peru",continent:"americas",emoji:"🏔️",badge:"Ancient",desc:"Lost city of the Incas — a mist-covered mountain citadel, wonder of the ancient world.",history:"Built around 1450 AD by Inca Emperor Pachacuti as a royal estate. Abandoned during the Spanish conquest and forgotten by the outside world until American historian Hiram Bingham rediscovered it in 1911. Now a UNESCO World Heritage Site.",best:"Apr–October",types:["solo","couple"],solo:"Inca Trail hike (4 days), Sun Gate sunrise, budget stays in Aguas Calientes.",couple:"Sunrise private guided tour, helicopter view, local Peruvian cuisine.",family:"Train journey from Cusco, guided tours, Aguas Calientes hot springs.",budget:"€€€",visa:"Visa-free (many)",lang:"Spanish",currency:"PEN (S/)",timezone:"America/Lima",tags:["solo","couple"]},
  {id:7,name:"Serengeti Safari",country:"Tanzania",continent:"africa",emoji:"🦁",badge:"Wildlife",desc:"Witness the Great Migration — 1.5 million wildebeest crossing the endless golden savannah.",history:"The Serengeti ecosystem has been home to Maasai herders for centuries. Declared a national park in 1951, protecting 14,763 sq km of savannah and hosting the world's greatest wildlife spectacle — the annual Great Wildebeest Migration.",best:"Jun–October",types:["couple","family"],solo:"Solo safari camps, wildlife photography tours, conservation volunteering.",couple:"Luxury tented camps, hot air balloon safari at sunrise, sundowner drives.",family:"Kid-friendly lodges, game drives, conservation education centre.",budget:"€€€€",visa:"Visa required",lang:"Swahili / English",currency:"TZS",timezone:"Africa/Nairobi",tags:["couple","family"]},
  {id:8,name:"Amsterdam",country:"Netherlands",continent:"europe",emoji:"🚲",badge:"Vibrant",desc:"Canals, cycling, golden-age art, and a liberal spirit — Europe's most liveable city.",history:"Founded as a fishing village in the 12th century, Amsterdam became the world's wealthiest city during the Dutch Golden Age (17th century) through the spice trade. The VOC (Dutch East India Company) was the world's first multinational.",best:"Apr–September",types:["solo","couple","family"],solo:"Canal walks, Van Gogh Museum, cycling tours, brown café evenings.",couple:"Private boat rental, Jordaan neighborhood, artisan cheese tasting.",family:"Anne Frank House, NEMO Science Museum, Vondelpark, canal boat.",budget:"€€€",visa:"Schengen Visa",lang:"Dutch",currency:"Euro (€)",timezone:"Europe/Amsterdam",tags:["solo","couple","family"]},
  {id:9,name:"Maldives",country:"Maldives",continent:"asia",emoji:"🏝️",badge:"Luxury",desc:"Overwater bungalows, crystal-clear lagoons, and vibrant coral reefs — paradise on Earth.",history:"Inhabited for 2,500+ years, the Maldives was an independent sultanate for centuries. British Protectorate from 1887, independence in 1965. Known as the world's flattest nation and most threatened by rising sea levels.",best:"Nov–April",types:["couple","solo"],solo:"Budget guesthouses on local islands, snorkelling, freediving courses.",couple:"Overwater villa, private beach dinner, sunset dolphin cruise.",family:"Kid-friendly resort islands, snorkelling with rays, beach clubs.",budget:"€€€€€",visa:"Free on arrival (30 days)",lang:"Dhivehi",currency:"MVR",timezone:"Indian/Maldives",tags:["couple","solo"]},
  {id:10,name:"Rome",country:"Italy",continent:"europe",emoji:"🏺",badge:"Historic",desc:"2,800 years of history under your feet — the Eternal City overwhelms every sense.",history:"Rome was founded in 753 BC (traditionally) by Romulus. It evolved from a Kingdom to a Republic (509 BC) to an Empire that dominated Europe and the Mediterranean for 500 years, shaping law, language, architecture, and Christianity worldwide.",best:"Mar–May · Sep–Nov",types:["solo","couple","family"],solo:"Vatican early morning, Trastevere evenings, pasta cooking class.",couple:"Colosseum sunset tour, private Sistine Chapel visit, gelato walks.",family:"Gladiator school for kids, Borghese Gardens, pizza-making class.",budget:"€€€",visa:"Schengen Visa",lang:"Italian",currency:"Euro (€)",timezone:"Europe/Rome",tags:["solo","couple","family"]},
  {id:11,name:"Queenstown",country:"New Zealand",continent:"oceania",emoji:"🎿",badge:"Adventure",desc:"Adventure capital of the world — bungee jumping, skiing, fjords, and raw wilderness.",history:"Settled by Māori around 1300 AD. European settlers arrived in the 1860s during the Otago Gold Rush. Queenstown became an adventure tourism hub in the 1970s and is famously where the modern bungee jump was invented (1988).",best:"Dec–Feb (summer) · Jun–Aug (ski)",types:["solo","couple"],solo:"Solo bungee jump, hostel community, hike the Queenstown Hill circuit.",couple:"Milford Sound cruise, Central Otago wine tour, helicopter fjord flight.",family:"Skyline Luge rides, gondola, family-friendly jet boating on the Shotover.",budget:"€€€€",visa:"Visa / NZeTA required",lang:"English / Māori",currency:"NZD ($)",timezone:"Pacific/Auckland",tags:["solo","couple"]},
  {id:12,name:"Cairo & Pyramids",country:"Egypt",continent:"africa",emoji:"🏜️",badge:"Ancient",desc:"Stand before 4,500-year-old wonders — the last standing of the Seven Wonders of the Ancient World.",history:"The Great Pyramid of Giza was built c.2560 BC for Pharaoh Khufu and remained the world's tallest man-made structure for 3,800 years. Ancient Egyptian civilisation spanned 3,000 years, revolutionising mathematics, medicine, and monumental architecture.",best:"Oct–April",types:["solo","couple","family"],solo:"Desert overnight camping, budget group tours, vibrant Cairo bazaars.",couple:"Nile dinner cruise, sound & light show at Pyramids, luxury Nile cruise.",family:"Great Sphinx, mummy museums, camel rides, hands-on archaeology tours.",budget:"€€",visa:"Visa on arrival",lang:"Arabic",currency:"EGP (£E)",timezone:"Africa/Cairo",tags:["solo","couple","family"]},
];

let activeFilter='all';
let activeState='All States';
let searchTerms=[];
let chatOpen=false;
let currentMap=null;
let modalTimeInterval;
let exchangeRates=null;

function buildSearchTerms(){
  const destinationTerms=destinations.map(d=>({name:d.name,type:'destination',country:d.country,continent:d.continent}));
  const indiaTerms=(window.allIndia||[]).map(p=>({name:p.name,type:'india',state:p.state,tags:p.tags}));
  searchTerms=[...destinationTerms,...indiaTerms].sort((a,b)=>a.name.localeCompare(b.name));
}

function handleSearchInput(){
  filterAll();
  renderSearchSuggestions();
}

function getFavs() { return JSON.parse(localStorage.getItem('wander_favs') || '[]'); }

function toggleFav(e, name) {
  e.stopPropagation();
  let favs = getFavs();
  const btn = e.currentTarget;
  if(favs.includes(name)) {
    favs = favs.filter(n => n !== name);
    btn.classList.remove('active');
    btn.innerHTML = '🤍';
  } else {
    favs.push(name);
    btn.classList.add('active');
    btn.innerHTML = '❤️';
  }
  localStorage.setItem('wander_favs', JSON.stringify(favs));
  if(activeFilter === 'favorites') filterAll();
}

function renderSearchSuggestions(){
  const input=document.getElementById('searchInput');
  const query=input.value.trim().toLowerCase();
  const container=document.getElementById('searchSuggestions');
  if(!query){
    container.innerHTML='';
    return;
  }
  const matches=searchTerms.filter(term=>term.name.toLowerCase().includes(query)).slice(0,12);
  if(!matches.length){
    container.innerHTML='<div class="suggestion-empty">🌍 No destination found.</div>';
    return;
  }
  container.innerHTML=matches.map(term=>`
    <div class="suggestion-item" onclick="selectSuggestion('${term.name.replace(/'/g,"\\'")}', '${term.type}', '${term.state || ''}')">
      <strong>${term.name}</strong>
      <span style="color:var(--muted);font-size:11px;margin-left:8px">
        ${term.type==='destination' ? `🌐 ${term.country}` : `🇮🇳 ${term.state || 'India'}`}
      </span>
    </div>
  `).join('');
}

function selectSuggestion(name, type, state){
  const input=document.getElementById('searchInput');
  input.value=name;
  clearSearchSuggestions();
  filterAll();
  
  if(type==='destination'){
    const d=destinations.find(x=>x.name===name);
    if(d){
      document.getElementById('destinations').scrollIntoView({behavior:'smooth'});
      setTimeout(()=>openModal(d.id), 600);
    }
  } else if(type==='india'){
    const indiaData = window.indiaData || {};
    const p=indiaData[state]?.find(x=>x.name===name);
    if(p){
      document.getElementById('india').scrollIntoView({behavior:'smooth'});
      setTimeout(()=>openIndiaModal(p, state), 600);
    }
  }
}

function clearSearchSuggestions(){
  const container=document.getElementById('searchSuggestions');
  if(container) container.innerHTML='';
}

document.addEventListener('click',e=>{
  const suggestions=document.getElementById('searchSuggestions');
  const input=document.getElementById('searchInput');
  if(suggestions && input && !suggestions.contains(e.target) && e.target !== input){
    suggestions.innerHTML='';
  }
});

function createStars(){
  const c=document.getElementById('stars');
  if(!c) return;
  for(let i=0;i<120;i++){
    const s=document.createElement('div');
    s.className='star';
    s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;--d:${2+Math.random()*4}s;--delay:${Math.random()*4}s`;
    c.appendChild(s);
  }
}

function animCounter(el,target,sfx=''){
  if(!el) return;
  let n=0;
  const step=Math.ceil(target/60);
  const iv=setInterval(()=>{
    n=Math.min(n+step,target);
    el.textContent=n.toLocaleString()+sfx;
    if(n>=target)clearInterval(iv);
  },25);
}

function buildImageUrl(query,index){
  const seed = encodeURIComponent(query.replace(/[^a-zA-Z]/g, '') + index);
  return `https://picsum.photos/seed/${seed}/640/420`;
}

function formatLocalTime(zone){
  if(!zone) return 'N/A';
  try{
    return new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',timeZone:zone,timeZoneName:'short'});
  }catch{
    return 'N/A';
  }
}

function updateModalLocalTime(zone){
  const el=document.getElementById('modalLocalTime');
  if(el) el.textContent=formatLocalTime(zone);
}

function renderDest(data){
  const g=document.getElementById('destGrid');
  if(!data.length){
    g.innerHTML='<p style="color:var(--muted);padding:40px;grid-column:1/-1;text-align:center">No destinations found.</p>';
    return;
  }
  g.innerHTML='';
  const favs = getFavs();
  data.forEach((d, i)=>{
    const imageUrl=buildImageUrl(d.name, d.id);
    const el=document.createElement('div');
    el.className='dest-card reveal visible';
    el.style.animation=`staggerIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards`;
    el.style.animationDelay=`${i * 0.05}s`;
    const isFav = favs.includes(d.name);
    el.innerHTML=`
      <div class="dest-img" style="background-image:url('${imageUrl}')">
        <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFav(event, '${d.name.replace(/'/g, "\\'")}')">${isFav ? '❤️' : '🤍'}</button>
        <span style="position:relative;z-index:1">${d.emoji}</span>
        <div class="dest-badge">${d.badge}</div>
      </div>
      <div class="dest-body">
        <div class="dest-country">${d.country.toUpperCase()} · ${d.continent.toUpperCase()}</div>
        <div class="dest-name">${d.name}</div>
        <div class="dest-desc">${d.desc}</div>
        <div class="dest-time"><span>🕘 ${formatLocalTime(d.timezone)}</span></div>
        <div class="dest-meta">
          ${d.tags.includes('solo')?'<span class="dest-tag solo">🎒 Solo</span>':''}
          ${d.tags.includes('couple')?'<span class="dest-tag couple">💑 Couple</span>':''}
          ${d.tags.includes('family')?'<span class="dest-tag family">👨‍👩‍👧 Family</span>':''}
        </div>
        <div class="dest-footer">
          <div class="best-time">Best time: <span>${d.best}</span></div>
          <button class="dest-btn" onclick="openModal(${d.id})">Explore →</button>
        </div>
      </div>`;
    g.appendChild(el);
  });
  observeReveal();
}

function filterAll(){
  const q=document.getElementById('searchInput').value.toLowerCase();
  const favs = getFavs();
  let data=destinations;
  
  if(activeFilter==='favorites') data=data.filter(d=>favs.includes(d.name));
  else if(activeFilter!=='all') data=data.filter(d=>d.continent===activeFilter||d.tags.includes(activeFilter));
  if(q) data=data.filter(d=>d.name.toLowerCase().includes(q)||d.country.toLowerCase().includes(q)||d.continent.toLowerCase().includes(q)||d.desc.toLowerCase().includes(q));
  
  renderDest(data);
  
  const indiaData = window.indiaData || {};
  let indData=indiaData[activeState]||[];
  if(activeFilter==='favorites') indData=(window.allIndia||[]).filter(d=>favs.includes(d.name));
  else if(activeFilter!=='all') indData=indData.filter(d=>d.tags&&d.tags.includes(activeFilter));
  if(q) indData=indData.filter(d=>d.name.toLowerCase().includes(q)||d.desc.toLowerCase().includes(q)||(d.state||activeState).toLowerCase().includes(q));
  
  renderIndia(indData);
}

function setFilter(f,el){
  activeFilter=f;
  document.querySelectorAll('.filter-chips .chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  filterAll();
}

async function initMap(placeName, queryContext) {
  const mapEl = document.getElementById('mapView');
  if(!mapEl) return;
  
  if(currentMap) {
    currentMap.remove();
    currentMap = null;
  }
  
  mapEl.innerHTML = '<span style="font-size:13px;color:var(--muted)">🌍 Locating...</span>';
  
  try {
    let searchName = placeName;
    if (placeName.includes('North Goa') || placeName.includes('South Goa')) searchName = 'Goa';
    
    let geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchName + (queryContext ? ' ' + queryContext : ''))}&limit=1`);
    let geoData = await geoRes.json();
    
    if (!geoData.length) {
      geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchName)}&limit=1`);
      geoData = await geoRes.json();
    }
    
    if (geoData && geoData.length > 0) {
      const latitude = geoData[0].lat;
      const longitude = geoData[0].lon;
      mapEl.innerHTML = '';
      
      currentMap = L.map('mapView', { zoomControl: false }).setView([latitude, longitude], 12);
      L.control.zoom({ position: 'bottomright' }).addTo(currentMap);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(currentMap);
      
      const icon = L.divIcon({ className: 'custom-map-marker', html: '<div style="font-size: 32px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.6)); transform: translate(-50%, -100%);">📍</div>', iconSize: [0, 0] });
      L.marker([latitude, longitude], { icon }).addTo(currentMap);
      
      setTimeout(() => { if(currentMap) currentMap.invalidateSize(); }, 300);
    } else {
      mapEl.innerHTML = '<span style="font-size:13px;color:var(--muted)">⚠️ Map data not available.</span>';
    }
  } catch(e) {
    mapEl.innerHTML = '<span style="font-size:13px;color:var(--muted)">⚠️ Could not load map.</span>';
  }
}

async function fetchRates() {
  if (exchangeRates) return exchangeRates;
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    exchangeRates = data.rates;
    return exchangeRates;
  } catch (e) {
    return null;
  }
}

function getIsoCode(currStr) {
  if(!currStr) return 'USD';
  const map = {'Euro':'EUR','Yen':'JPY','USD':'USD','IDR':'IDR','PEN':'PEN','TZS':'TZS','MVR':'MVR','NZD':'NZD','EGP':'EGP','INR':'INR'};
  for(let key in map) { if(currStr.includes(key)) return map[key]; }
  return 'USD';
}

async function convertCurrency(targetCode) {
  const from = document.getElementById('convFrom')?.value || 'USD';
  const amount = parseFloat(document.getElementById('convAmount')?.value) || 0;
  const resultEl = document.getElementById('convResult');
  if (!resultEl) return;
  resultEl.innerText = "Calculating...";
  const rates = await fetchRates();
  if (!rates || !rates[from] || !rates[targetCode]) { resultEl.innerText = "Unavailable"; return; }
  const inTarget = (amount / rates[from]) * rates[targetCode];
  resultEl.innerText = inTarget.toLocaleString('en-US', {maximumFractionDigits: 2}) + ' ' + targetCode;
}

function openModal(id){
  const d=destinations.find(x=>x.id===id);
  if(!d)return;
  
  document.getElementById('modalHero').innerHTML=`<span style="position:relative;z-index:1;font-size:100px">${d.emoji}</span>`;
  document.getElementById('modalTitle').textContent=d.name;
  document.getElementById('modalCountry').textContent=`${d.country} · ${d.continent.charAt(0).toUpperCase()+d.continent.slice(1)}`;
  
  document.getElementById('mapView').innerHTML = '';
  initMap(d.name, d.country);

  document.getElementById('infoGrid').innerHTML=`
    <div class="info-box"><label>Best Time to Visit</label><strong>${d.best}</strong></div>
    <div class="info-box"><label>Local Time</label><strong id="modalLocalTime">${formatLocalTime(d.timezone)}</strong></div>
    <div class="info-box"><label>Budget Level</label><strong>${d.budget}</strong></div>
    <div class="info-box"><label>Visa Info</label><strong>${d.visa}</strong></div>
    <div class="info-box"><label>Currency</label><strong>${d.currency}</strong></div>`;
  
  updateModalLocalTime(d.timezone);
  clearInterval(modalTimeInterval);
  modalTimeInterval=setInterval(()=>updateModalLocalTime(d.timezone),30000);
  
  document.getElementById('modalDesc').innerHTML=`
    <p style="margin-bottom:16px;font-size:15px;color:var(--text)">${d.desc}</p>
    <p style="margin-bottom:10px"><strong style="color:var(--gold)">🎒 Solo:</strong> ${d.solo}</p>
    <p style="margin-bottom:10px"><strong style="color:#FF6B9D">💑 Couple:</strong> ${d.couple}</p>
    <p><strong style="color:var(--teal)">👨‍👩‍👧 Family:</strong> ${d.family}</p>`;
  
  document.getElementById('modalHistory').innerHTML=`<p style="margin-bottom:16px;font-size:15px;color:var(--text);font-family:'Playfair Display',serif;font-style:italic">The Story of ${d.name}</p>${d.history}`;
  
  const isoCode = getIsoCode(d.currency);
  document.getElementById('modalPlan').innerHTML=`
    <div style="background:var(--surface2);border-radius:14px;padding:20px;margin-bottom:16px">
      <p style="font-size:14px;color:var(--gold);font-weight:600;margin-bottom:12px">💱 Budget Estimator</p>
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <input type="number" id="convAmount" value="100" oninput="convertCurrency('${isoCode}')" style="width:80px;background:var(--surface);border:1px solid rgba(240,237,230,.1);border-radius:8px;padding:8px;color:var(--text);font-family:'DM Sans',sans-serif;outline:none">
        <select id="convFrom" onchange="convertCurrency('${isoCode}')" style="background:var(--surface);border:1px solid rgba(240,237,230,.1);border-radius:8px;padding:8px;color:var(--text);font-family:'DM Sans',sans-serif;outline:none;cursor:pointer">
          <option value="USD" selected>USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="INR">INR</option>
          <option value="AUD">AUD</option>
          <option value="CAD">CAD</option>
        </select>
        <span style="color:var(--muted);font-size:13px">to</span>
        <strong id="convToCode" style="color:var(--gold);font-size:14px">${isoCode}</strong>
        <span style="font-size:18px;font-weight:700;margin-left:auto;color:var(--text)" id="convResult">...</span>
      </div>
    </div>`;
  
  document.querySelectorAll('.m-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
  document.querySelector('.m-tab').classList.add('active');
  document.getElementById('tab-overview').classList.add('active');
  document.getElementById('modalOverlay').classList.add('open');
  convertCurrency(isoCode);
}

function openIndiaModal(place,state){
  const historyText = place.history || `${place.name} is a remarkable destination in ${state}.`;
  
  document.getElementById('modalHero').innerHTML=`<span style="position:relative;z-index:1;font-size:100px">${place.emoji}</span>`;
  document.getElementById('modalTitle').textContent=place.name;
  document.getElementById('modalCountry').textContent=`${place.name}, ${state}, India`;
  
  document.getElementById('mapView').innerHTML = '';
  initMap(place.name, 'India');

  document.getElementById('infoGrid').innerHTML=`
    <div class="info-box"><label>📍 Location</label><strong>${place.name}, ${state}</strong></div>
    <div class="info-box"><label>🗓️ Best Time to Visit</label><strong>${place.best||'Oct–Mar'}</strong></div>
    <div class="info-box"><label>🏷️ Category</label><strong>${(place.tags||[]).map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(', ')}</strong></div>
    <div class="info-box"><label>⏰ Local Time</label><strong id="modalLocalTime">${formatLocalTime('Asia/Kolkata')}</strong></div>
    <div class="info-box"><label>🇮🇳 State</label><strong>${state}</strong></div>
    <div class="info-box"><label>💰 Currency</label><strong>INR (₹)</strong></div>`;
  
  updateModalLocalTime('Asia/Kolkata');
  clearInterval(modalTimeInterval);
  modalTimeInterval=setInterval(()=>updateModalLocalTime('Asia/Kolkata'),30000);
  
  document.getElementById('modalDesc').innerHTML=`
    <p style="margin-bottom:16px;font-size:15px;color:var(--text);line-height:1.8"><strong style="color:var(--gold)">✨ About ${place.name}:</strong></p>
    <p style="margin-bottom:16px;font-size:14px;color:var(--muted);line-height:1.8">${place.desc}</p>`;
  
  document.getElementById('modalHistory').innerHTML=`<p style="margin-bottom:16px;font-size:15px;color:var(--text);font-family:'Playfair Display',serif;font-style:italic">📖 The Story of ${place.name}</p><p style="font-size:14px;color:var(--muted);line-height:1.8">${historyText}</p>`;
  
  document.getElementById('modalPlan').innerHTML=`
    <div style="background:var(--surface2);border-radius:14px;padding:20px">
      <p style="font-size:14px;color:var(--gold);font-weight:600;margin-bottom:12px">💱 Budget Estimator</p>
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <input type="number" id="convAmount" value="100" oninput="convertCurrency('INR')" style="width:80px;background:var(--surface);border:1px solid rgba(240,237,230,.1);border-radius:8px;padding:8px;color:var(--text);font-family:'DM Sans',sans-serif;outline:none">
        <select id="convFrom" onchange="convertCurrency('INR')" style="background:var(--surface);border:1px solid rgba(240,237,230,.1);border-radius:8px;padding:8px;color:var(--text);font-family:'DM Sans',sans-serif;outline:none;cursor:pointer">
          <option value="USD" selected>USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="INR" selected>INR</option>
        </select>
        <span style="color:var(--muted);font-size:13px">to</span>
        <strong style="color:var(--gold);font-size:14px">INR</strong>
        <span style="font-size:18px;font-weight:700;margin-left:auto;color:var(--text)" id="convResult">...</span>
      </div>
    </div>`;
  
  document.querySelectorAll('.m-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
  document.querySelector('.m-tab').classList.add('active');
  document.getElementById('tab-overview').classList.add('active');
  document.getElementById('modalOverlay').classList.add('open');
  convertCurrency('INR');
}

function closeModal(e){
  if(e.target===document.getElementById('modalOverlay'))closeModalDirect();
}

function closeModalDirect(){
  clearInterval(modalTimeInterval);
  document.getElementById('modalOverlay').classList.remove('open');
  if(currentMap) {
    currentMap.remove();
    currentMap = null;
  }
}

function switchTab(id,el){
  document.querySelectorAll('.m-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('tab-'+id).classList.add('active');
  if(id === 'overview' && currentMap) {
    setTimeout(() => currentMap.invalidateSize(), 100);
  }
}

function renderStateTabs(){
  const c=document.getElementById('stateTabs');
  if(!c) return;
  
  const indiaData = window.indiaData || {};
  c.innerHTML='';
  
  Object.keys(indiaData).forEach(s=>{
    const b=document.createElement('button');
    b.className='state-tab'+(s===activeState?' active':'');
    b.textContent=s==='All States'?'🇮🇳 All States':s;
    b.onclick=()=>{activeState=s;renderStateTabs();filterAll();};
    c.appendChild(b);
  });
}

function renderIndia(dataOverride){
  const g=document.getElementById('indiaGrid');
  if(!g) return;
  
  g.innerHTML='';
  
  const indiaData = window.indiaData || {};
  const places=dataOverride || indiaData[activeState]||[];
  
  if(!places.length){
    g.innerHTML='<p style="color:var(--muted);padding:40px;grid-column:1/-1;text-align:center">No places found.</p>';
    return;
  }
  
  const tc={heritage:'t-heritage',nature:'t-nature',spiritual:'t-spiritual',beach:'t-beach',hill:'t-hill',fort:'t-fort'};
  const favs = getFavs();
  
  places.forEach((p, i)=>{
    const imgUrl=buildImageUrl(`${p.name} ${p.state||activeState} India`, i + 100);
    const el=document.createElement('div');
    el.className='india-card reveal visible';
    el.style.animation=`staggerIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards`;
    el.style.animationDelay=`${i * 0.05}s`;
    const isFav = favs.includes(p.name);
    el.innerHTML=`
      <div class="india-card-img" style="background-image:url('${imgUrl}');background-size:cover;background-position:center;position:relative">
        <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFav(event, '${p.name.replace(/'/g, "\\'")}')">${isFav ? '❤️' : '🤍'}</button>
        <div style="position:absolute;inset:0;background:rgba(0,0,0,0.5)"></div>
        <span style="position:relative;z-index:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))">${p.emoji}</span>
      </div>
      <div class="india-card-body">
        <div class="india-card-state">${p.state||activeState}</div>
        <div class="india-card-name">${p.name}</div>
        <div class="india-card-desc">${p.desc}</div>
        <div class="india-card-tags">${(p.tags||[]).map(t=>`<span class="india-tag ${tc[t]||''}">${t}</span>`).join('')}</div>
      </div>`;
    el.onclick=()=>openIndiaModal(p, p.state||activeState);
    g.appendChild(el);
  });
  observeReveal();
}

function toggleChat(){
  chatOpen=!chatOpen;
  document.getElementById('chatWindow').classList.toggle('open',chatOpen);
  document.getElementById('chatToggle').textContent=chatOpen?'✕':'🌍';
}

function openChat(){
  if(!chatOpen)toggleChat();
}

function quickAsk(q){
  if(!chatOpen)openChat();
  document.getElementById('chatInput').value=q;
  sendChat();
}

function findPlaceByQuery(query){
  const text=query.toLowerCase();
  let place=destinations.find(d=>text.includes(d.name.toLowerCase())||text.includes(d.country.toLowerCase()));
  if(place) return place;
  
  const indiaData = window.indiaData || {};
  for(const state of Object.keys(indiaData)){
    for(const p of indiaData[state]){
      const name=p.name.toLowerCase();
      if(text.includes(name)||text.includes(state.toLowerCase())){
        return {
          ...p,
          country:'India',
          continent:'asia',
          timezone:'Asia/Kolkata',
          best:'Oct–Mar',
          budget:'Varies',
          visa:'E-Visa',
          lang:'Hindi',
          currency:'INR',
          history:`${p.name} is a destination in ${state}.`
        };
      }
    }
  }
  return null;
}

async function generateBotResponse(question){
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const text = question.toLowerCase();
  const place=findPlaceByQuery(question);
  
  if (text.match(/hello|hi|hey|help/)) {
    return "Hello! 👋 I'm your travel guide. Ask me about any destination!";
  }
  if (place) {
    if (text.match(/history|story/)) {
      return `<strong>📖 History of ${place.name}:</strong><br>${place.history}`;
    }
    if (text.match(/weather|best time|when/)) {
      return `<strong>🌤️ When to visit ${place.name}:</strong><br>Best time: <strong>${place.best}</strong><br>Local time: ${formatLocalTime(place.timezone)}`;
    }
    return `<strong>✨ ${place.name}</strong><br>${place.desc}`;
  }
  return "Try asking me about a destination from the site!";
}

async function sendChat(){
  const inp=document.getElementById('chatInput');
  const q=inp.value.trim();
  if(!q)return;
  
  addMsg(q,'user');
  inp.value='';
  showTyping();
  const response=await generateBotResponse(q);
  removeTyping();
  addMsg(response,'bot');
}

function addMsg(text,role){
  const c=document.getElementById('chatMsgs');
  const d=document.createElement('div');
  d.className=`msg ${role}`;
  const t=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  d.innerHTML=`<div class="msg-bubble">${text.replace(/\n/g,'<br>')}</div><div class="msg-time">${t}</div>`;
  c.appendChild(d);
  c.scrollTop=c.scrollHeight;
}

function showTyping(){
  const c=document.getElementById('chatMsgs');
  const d=document.createElement('div');
  d.className='msg bot';
  d.id='typing';
  d.innerHTML='<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
  c.appendChild(d);
  c.scrollTop=c.scrollHeight;
}

function removeTyping(){
  const t=document.getElementById('typing');
  if(t)t.remove();
}

function observeReveal(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  },{threshold:.1});
  document.querySelectorAll('.reveal:not(.visible)').forEach(el=>obs.observe(el));
}

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    closeModalDirect();
  }
});

window.onload=()=>{
  createStars();
  buildSearchTerms();
  renderDest(destinations);
  renderStateTabs();
  renderIndia();
  observeReveal();
  
  setTimeout(()=>{
    animCounter(document.getElementById('c1'),500,'+');
    animCounter(document.getElementById('c2'),195,'+');
    animCounter(document.getElementById('c3'),300,'+');
    animCounter(document.getElementById('c4'),50,'K+');
  },1200);
};
