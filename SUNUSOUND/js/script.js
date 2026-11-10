/* script.js – logique de l'application (navigation, lecteur, favoris, playlists) */
const $ = s => document.querySelector(s);
const store = {                                   // petit utilitaire localStorage
  get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},
  set:(k,v)=>localStorage.setItem(k,JSON.stringify(v))
};
let favs = store.get('ss_favs',[]);               // ids des favoris
let playlists = store.get('ss_pl',[]);            // [{id,name,songs:[ids]}]
let recent = store.get('ss_recent',[]);           // dernières écoutes
let page='home', genre='Tous', query='';
let queue = SONGS.map(s=>s.id), current=null;     // file de lecture et chanson en cours
const audio = new Audio(); audio.volume = .7;

const byId = id => SONGS.find(s=>s.id===id);
const fmt = t => isFinite(t) ? Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0') : '0:00';
const esc = s => s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const saveAll = () => { store.set('ss_favs',favs); store.set('ss_pl',playlists); store.set('ss_recent',recent); };
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2800)}

/* ---------- Composants HTML ---------- */
const bg = s => `background:url('${s.cover}') center/cover,linear-gradient(135deg,#EC4899,#8B5CF6)`;
const card = s => `<div class="card" data-play="${s.id}"><div class="cv" style="${bg(s)}"><button class="fav${favs.includes(s.id)?' on':''}" data-fav="${s.id}">♥</button><span class="pl">▶</span></div><h4>${s.title}</h4><p>${s.artist}</p></div>`;
const grid = l => `<div class="grid" data-ids="${l.map(s=>s.id)}">${l.map(card).join('')}</div>`;
const empty = t => `<p class="empty">${t}</p>`;
const section = (t,h) => `<h2>${t}</h2>${h}`;
const chips = (l,attr) => `<div class="chips">${l.map(x=>`<button class="chip" ${attr}="${esc(x)}">${esc(x)}</button>`).join('')}</div>`;
const row = (s,plId) => `<div class="row" data-play="${s.id}"><div class="cv" style="${bg(s)}"></div><div><b>${s.title}</b><br><small>${s.artist} · ${s.genre}</small></div><small>${s.duration}</small>${plId?`<button class="btn alt" data-rm="${plId}:${s.id}">Retirer</button>`:''}</div>`;
const uniq = a => [...new Set(a)];

/* ---------- Rendu des pages ---------- */
function renderHome(){
  const sn = SONGS.filter(s=>['Mbalax','Rap Galsen'].includes(s.genre));
  $('#page-home').innerHTML = `<h1>Bienvenue sur SUNUSOUND 👋</h1><p class="sub">La musique qui nous rassemble.</p>`
   + section('Tendances musicales', grid(SONGS.slice(0,6)))
   + section('Artistes populaires', chips(uniq(SONGS.map(s=>s.artist)),'data-q'))
   + section('Albums recommandés', chips(uniq(SONGS.map(s=>s.album)),'data-q'))
   + section('Musiques sénégalaises', grid(sn))
   + section('Nouveautés', grid(SONGS.slice(-5).reverse()));
}
function renderExplore(){
  const l = SONGS.filter(s=>(genre==='Tous'||s.genre===genre) && (s.title+s.artist+s.album).toLowerCase().includes(query));
  $('#page-explore').innerHTML = `<h1>Explorer</h1>`
   + `<div class="chips">${GENRES.map(g=>`<button class="chip${g===genre?' on':''}" data-genre="${g}">${g}</button>`).join('')}</div>`
   + section(query?`Résultats pour « ${esc(query)} »`:'Toutes les chansons', l.length?grid(l):empty('Aucun résultat trouvé.'));
}
function renderLibrary(){
  const f = favs.map(byId).filter(Boolean), r = recent.map(byId).filter(Boolean);
  $('#page-library').innerHTML = `<h1>Bibliothèque</h1>`
   + section('Mes musiques favorites', f.length?grid(f):empty('Aucun favori : cliquez sur ♥ pour en ajouter.'))
   + section('Mes albums', f.length?chips(uniq(f.map(s=>s.album)),'data-q'):empty('Vos albums apparaîtront ici.'))
   + section('Mes artistes préférés', f.length?chips(uniq(f.map(s=>s.artist)),'data-q'):empty('Vos artistes apparaîtront ici.'))
   + section('Dernières écoutes', r.length?grid(r):empty('Vous n\'avez encore rien écouté.'));
}
function renderPlaylists(){
  const boxes = playlists.map(p=>{
    const l = p.songs.map(byId).filter(Boolean);
    return `<div class="plbox"><div class="plhead"><h3>${esc(p.name)}</h3>
      <select id="sel${p.id}">${SONGS.map(s=>`<option value="${s.id}">${s.title} – ${s.artist}</option>`).join('')}</select>
      <button class="btn" data-add="${p.id}">Ajouter</button>
      <button class="btn alt" data-ren="${p.id}">Renommer</button>
      <button class="btn alt" data-del="${p.id}">Supprimer</button></div>
      <div data-ids="${l.map(s=>s.id)}">${l.length?l.map(s=>row(s,p.id)).join(''):empty('Playlist vide : ajoutez une chanson.')}</div></div>`;
  }).join('');
  $('#page-playlists').innerHTML = `<h1>Playlists</h1>
    <div class="plhead"><input id="plName" class="txt" placeholder="Nom de la nouvelle playlist"><button class="btn" id="plCreate">Créer</button></div>`
    + (boxes || empty('Aucune playlist pour le moment. Créez la première !'));
}
function render(){ renderHome(); renderExplore(); renderLibrary(); renderPlaylists(); updatePlayer(); }
function show(p){
  page=p;
  document.querySelectorAll('.page').forEach(e=>e.classList.toggle('on',e.id==='page-'+p));
  document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.page===p));
  $('main').scrollTop=0;
}

/* ---------- Lecteur ---------- */
function play(id, ids){
  if(ids && ids.length) queue = ids;
  const s = byId(id); current = id;
  audio.src = s.src;
  audio.play().catch(()=>{});                      // les erreurs sont gérées par audio.onerror
  recent = [id,...recent.filter(x=>x!==id)].slice(0,10);
  saveAll(); render();
}
function step(d){
  if(!queue.length) return;
  let i = queue.indexOf(current); i = (i+d+queue.length)%queue.length;
  play(queue[i]);
}
function updatePlayer(){
  const s = byId(current);
  $('#pTitle').textContent = s? s.title : 'Aucune lecture';
  $('#pArtist').textContent = s? s.artist : 'Choisissez une chanson';
  if(s) $('#pCover').setAttribute('style', bg(s));
  $('#play').textContent = audio.paused ? '▶' : '⏸';
  $('#pFav').classList.toggle('on', favs.includes(current));
}
function toggleFav(id){
  if(id==null) return;
  favs = favs.includes(id) ? favs.filter(x=>x!==id) : [...favs,id];
  saveAll(); render();
}
$('#play').onclick = () => { if(current==null) return play(queue[0]); audio.paused ? audio.play() : audio.pause(); };
$('#next').onclick = () => step(1);
$('#prev').onclick = () => audio.currentTime>3 ? audio.currentTime=0 : step(-1);
$('#rep').onclick = e => { audio.loop=!audio.loop; e.currentTarget.classList.toggle('on',audio.loop); toast(audio.loop?'Répétition activée':'Répétition désactivée'); };
$('#pFav').onclick = () => toggleFav(current);
$('#vol').oninput = e => audio.volume = e.target.value/100;
$('#seek').oninput = e => { if(audio.duration) audio.currentTime = e.target.value/100*audio.duration; };
audio.onplay = audio.onpause = updatePlayer;
audio.ontimeupdate = () => { $('#cur').textContent=fmt(audio.currentTime); if(audio.duration) $('#seek').value=audio.currentTime/audio.duration*100; };
audio.onloadedmetadata = () => $('#dur').textContent = fmt(audio.duration);
audio.onended = () => step(1);                     // lecture automatique de la suivante
audio.onerror = () => toast('Fichier audio introuvable : '+byId(current).src);

/* ---------- Événements (délégation) ---------- */
document.addEventListener('click', e=>{
  const t = e.target;
  const fav=t.closest('[data-fav]'); if(fav){ e.stopPropagation(); return toggleFav(+fav.dataset.fav); }
  const rm=t.closest('[data-rm]'); if(rm){ e.stopPropagation(); const [p,s]=rm.dataset.rm.split(':').map(Number); const pl=playlists.find(x=>x.id===p); pl.songs=pl.songs.filter(x=>x!==s); saveAll(); return render(); }
  const pl=t.closest('[data-play]'); if(pl){ const ids=(pl.closest('[data-ids]').dataset.ids||'').split(',').map(Number); return play(+pl.dataset.play, ids); }
  const nav=t.closest('[data-page]'); if(nav) return show(nav.dataset.page);
  const g=t.closest('[data-genre]'); if(g){ genre=g.dataset.genre; return renderExplore(); }
  const q=t.closest('[data-q]'); if(q){ query=q.dataset.q.toLowerCase(); genre='Tous'; $('#search').value=q.dataset.q; renderExplore(); return show('explore'); }
  if(t.id==='plCreate'){ const n=$('#plName').value.trim(); if(!n) return toast('Donnez un nom à la playlist.'); playlists.push({id:Date.now(),name:n,songs:[]}); saveAll(); return render(); }
  const add=t.closest('[data-add]'); if(add){ const p=playlists.find(x=>x.id==add.dataset.add), id=+$('#sel'+p.id).value; if(p.songs.includes(id)) return toast('Déjà dans la playlist.'); p.songs.push(id); saveAll(); return render(); }
  const ren=t.closest('[data-ren]'); if(ren){ const p=playlists.find(x=>x.id==ren.dataset.ren), n=prompt('Nouveau nom :',p.name); if(n&&n.trim()){ p.name=n.trim(); saveAll(); render(); } return; }
  const del=t.closest('[data-del]'); if(del){ if(confirm('Supprimer cette playlist ?')){ playlists=playlists.filter(x=>x.id!=del.dataset.del); saveAll(); render(); } }
});
$('#search').addEventListener('input', e=>{ query=e.target.value.toLowerCase().trim(); renderExplore(); show('explore'); });
render();
