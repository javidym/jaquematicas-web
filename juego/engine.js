/* =========================================================
   EL REINO DE VAINILLA — Motor del juego (JaqueMáTICas 5º)
   · Niveles: bronce / plata / oro (dificultad escalada)
   · Preguntas generadas al azar -> NO se repiten entre partidas
   · 3 vidas: al 3er fallo la prueba se reinicia
   MODE = 'full'   -> mapa + 8 capítulos + victoria
   MODE = 'single' -> un único capítulo independiente
========================================================= */

let MODE  = 'full';
let LEVEL = 'plata';                 // bronce | plata | oro
const LEVEL_NAME = { bronce:"🥉 Bronce", plata:"🥈 Plata", oro:"🥇 Oro" };

/* ---------------- utilidades ---------------- */
const rnd  = (a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick = a=>a[Math.floor(Math.random()*a.length)];
function shuffle(a){ return a.slice().sort(()=>Math.random()-.5); }
// construye opciones (1 correcta + distractores) sin duplicados
function optsFrom(correct, cands){
  const cs=String(correct); const set=new Set([cs]); const out=[cs];
  for(const c of cands){ const s=String(c); if(s!=='NaN' && s!=='' && !set.has(s)){ set.add(s); out.push(s);} if(out.length>=4) break; }
  return shuffle(out);
}

// ---------- DATOS DE CAPÍTULOS ----------
const CHAPTERS = [
  { n:1, topic:"Multiplicación y división", title:"El bosque de los cubos arcoíris",
    guardian:"vinalopop", color:"#5a8f3c",
    story:[
      ["Vinalopop","Abrí los ojos entre hojas de colores. Estoy en el Bosque de los Cubos Arcoíris, ¡donde los árboles son cubos y pirámides!"],
      ["Roca mágica","«Cuando los resultados se ordenen, el bosque recuperará su equilibrio.»"],
      ["Vinalopop","¡Resolver multiplicaciones y divisiones! Eso sí lo entiendo. Cada acierto devolverá el color a un árbol."]
    ],
    intro:"🌳 Resuelve la operación. Cada acierto enciende un árbol del bosque." },

  { n:2, topic:"Decimales", title:"El ascenso a la Torre Alcudia",
    guardian:"alcudia", color:"#2e6a9e",
    story:[
      ["Alcudia","¡Vinalopop! La torre ha perdido el equilibrio. Cada escalón es una operación con decimales."],
      ["Alcudia","Si resuelves el resultado correcto, el escalón aparecerá de nuevo y podrás subir."],
      ["Vinalopop","¡Respiro hondo! Subiré escalón a escalón hasta la cima."]
    ],
    intro:"🪜 Resuelve cada operación con decimales para construir el escalón." },

  { n:3, topic:"El dinero", title:"El enigma de las monedas",
    guardian:null, color:"#e8b84b",
    story:[
      ["Alcaldesa","¡La balanza de oro está descompensada! El Gran Mercado no puede abrir si las monedas no son justas."],
      ["Guardián","Solo quien comprenda el valor real de cada moneda equilibrará la balanza."],
      ["Vinalopop","Si sumamos monedas pequeñas hasta alcanzar el valor exacto… ¡equilibraremos la balanza!"]
    ],
    intro:"🪙 Pulsa monedas hasta sumar EXACTAMENTE el precio. ¡Ni más ni menos!" },

  { n:4, topic:"Fracciones", title:"El gran trueque de Glorieta",
    guardian:"glorieta", color:"#7a2f4f",
    story:[
      ["Glorieta","El equilibrio se ha roto: los dulces están repartidos de forma desigual. Necesitamos repartir con justicia."],
      ["Vinalopop","Si juntamos las partes que faltan, cada puesto tendrá lo mismo: ¡un entero!"],
      ["Glorieta","Unamos mitades con mitades, tercios con tercios, cuartos con cuartos…"]
    ],
    intro:"🍰 Resuelve los retos de fracciones para repartir con justicia." },

  { n:5, topic:"Unidades de medida", title:"Los jardines de Rabal",
    guardian:"rabal", color:"#d4892b",
    story:[
      ["Rabal","¡El agua no llega a todas las flores! Los canales están desordenados: unos largos, otros cortos."],
      ["Vinalopop","Si ajustamos las longitudes y hacemos que todas las corrientes sean iguales, el agua fluirá."],
      ["Rabal","Convierte bien las medidas y cada salto en «L» hará brotar las fuentes."]
    ],
    intro:"📏 Convierte y compara las medidas para nivelar los canales." },

  { n:6, topic:"El tiempo", title:"La carrera del reloj real",
    guardian:null, color:"#9b59b6",
    story:[
      ["Alcudia","Sin las agujas, el ritmo del reino está paralizado. El gran reloj de ajedrez no se mueve."],
      ["Glorieta","Coloca cada aguja resolviendo los retos del tiempo y el reloj volverá a sonar."],
      ["Vinalopop","¡Tic-tac! Avanzo casilla a casilla como un peón valiente."]
    ],
    intro:"⏰ Lee el reloj y resuelve los retos del tiempo para despertarlo." },

  { n:7, topic:"Estadística", title:"El observatorio de Alfín",
    guardian:"alfin", color:"#16a085",
    story:[
      ["Alfín","He estado estudiando el ritmo del reino. Cada jugada deja un rastro de datos."],
      ["Alfín","Si analizamos la gráfica de movimientos, descubriremos dónde se oculta el Rey Pi."],
      ["Glorieta","¡El Palacio Geométrico! Allí está Pi. Lee bien los datos, Vinalopop."]
    ],
    intro:"📊 Interpreta la gráfica de datos del observatorio para hallar al Rey." },

  { n:8, topic:"Geometría", title:"El palacio geométrico del Rey Pi",
    guardian:"reypi", color:"#c0392b",
    story:[
      ["Glorieta","Ante nosotros se alza el Palacio Geométrico. ¡El Rey Pi está atrapado en una figura perfecta!"],
      ["Glorieta","Solo la simetría y las figuras correctas podrán romper el hechizo."],
      ["Alfín","Encaja triángulos, cuadrados y círculos en su sitio. ¡Cada acierto suena como una nota!"]
    ],
    intro:"🔷 Resuelve los retos de geometría para liberar al Rey Pi." }
];

const CHAPTER_FILES=[
  "Capitulo_1_Multiplicacion_y_division.html","Capitulo_2_Decimales.html",
  "Capitulo_3_Dinero.html","Capitulo_4_Fracciones.html",
  "Capitulo_5_Unidades_de_medida.html","Capitulo_6_El_tiempo.html",
  "Capitulo_7_Estadistica.html","Capitulo_8_Geometria.html"
];
function chapterFile(n){ return CHAPTER_FILES[n-1]; }

const JOIN_AFTER = { 1:"vinalopop", 2:"alcudia", 4:"glorieta", 5:"rabal", 7:"alfin", 8:"reypi" };

// ---------- ESTADO (solo persiste en el juego completo) ----------
let state = load();
function defState(){ return {done:0,stars:0,movimientos:0,extraLives:0,cosmetics:{},equip:null,collectibles:{},abilities:{},equipAbil:null,comodines:0}; }
function load(){
  try{ const s=JSON.parse(localStorage.getItem('vainilla_v2'));
    if(s && typeof s.done==='number'){ const d=defState(); return Object.assign(d,s,{cosmetics:Object.assign({},s.cosmetics),collectibles:Object.assign({},s.collectibles),abilities:Object.assign({},s.abilities)}); } }catch(e){}
  return defState();
}
function save(){ try{ localStorage.setItem('vainilla_v2', JSON.stringify(state)); }catch(e){} }
function hardReset(){ state=defState(); try{ localStorage.setItem('vainilla_v2', JSON.stringify(state)); }catch(e){} show('intro'); }

// ---------- NAVEGACIÓN ----------
function show(id){
  try{ if(PLAT){ PLAT.active=false; cancelAnimationFrame(PLAT.raf); } }catch(e){}
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const el=document.getElementById(id); if(el) el.classList.add('active');
  window.scrollTo(0,0);
}
function startGame(){ showLevelChooser(goMap); }
function goMap(){
  if(state.done>=8){ show('victory'); renderParty('winParty'); drawWinArt(); return; }
  viewMap();
}
function viewMap(){ show('map'); drawMap(); updateHud(); renderParty('partyStrip'); }
function updateHud(){
  const cur=Math.min(state.done+1,8);
  const pb=document.getElementById('progressBadge'); if(pb) pb.textContent = state.done>=8? '¡Completado!' : `Capítulo ${cur} / 8`;
  const sb=document.getElementById('starBadge'); if(sb) sb.textContent = '★ '+state.stars;
  const lb=document.getElementById('levelBadge'); if(lb) lb.textContent = LEVEL_NAME[LEVEL];
  const mb=document.getElementById('moveBadge'); if(mb) mb.textContent = '⚡ '+(state.movimientos||0);
}

// ---------- SELECTOR DE NIVEL ----------
function showLevelChooser(next){
  const old=document.getElementById('__levelOverlay'); if(old) old.remove();
  const ov=document.createElement('div'); ov.id='__levelOverlay';
  ov.style.cssText='position:fixed;inset:0;background:rgba(10,8,4,.97);z-index:9999;overflow:auto;display:flex;align-items:center;justify-content:center;padding:14px;';
  ov.innerHTML=`<div class="panel" style="max-width:680px;width:100%;text-align:center">
    <h1>ELIGE TU NIVEL</h1>
    <p class="small">La dificultad de TODAS las pruebas cambiará según el nivel.<br>Las preguntas se generan al azar: nunca son iguales dos veces.</p>
    <div class="row" style="margin-top:14px;align-items:stretch">
      <button class="btn lvlBtn" data-l="bronce" style="background:#c07b3c;border-color:#7d4a1d;box-shadow:0 4px 0 #5d3614;min-width:150px">🥉 BRONCE<br><span style="font-size:8px;line-height:1.6">Para empezar</span></button>
      <button class="btn lvlBtn" data-l="plata" style="background:#aab7c2;border-color:#6c7a86;box-shadow:0 4px 0 #4d5862;color:#1c140c;min-width:150px">🥈 PLATA<br><span style="font-size:8px;line-height:1.6">Nivel medio</span></button>
      <button class="btn lvlBtn oro" data-l="oro" style="min-width:150px">🥇 ORO<br><span style="font-size:8px;line-height:1.6">¡Para expertos!</span></button>
    </div>
  </div>`;
  document.body.appendChild(ov);
  ov.querySelectorAll('.lvlBtn').forEach(b=> b.onclick=()=>{ LEVEL=b.dataset.l; ov.remove(); next(); });
}

/* =========================================================
   SPRITES PIXEL ART
========================================================= */
function px(ctx,x,y,w,h,c){ ctx.fillStyle=c; ctx.fillRect(x,y,w,h); }
function drawGuardian(ctx, type, ox, oy, s){
  const P=(cx,cy,c,w=1,h=1)=>px(ctx, ox+cx*s, oy+cy*s, w*s, h*s, c);
  const OUT="#241810", CREMA="#f3dca6", CREMA2="#dcc185", SKIN="#f1c79b", SKIN2="#d9a878";
  function pedestal(){
    P(4,12,CREMA,8,1); P(3,13,CREMA,10,1); P(3,14,CREMA,10,1);
    P(2,15,CREMA,12,1); P(2,16,CREMA,12,1);
    P(1,17,CREMA,14,1); P(1,18,CREMA,14,1); P(2,19,CREMA2,12,1);
    P(3,13,CREMA2,1,6); P(12,13,CREMA2,1,6);
    P(2,19,OUT,12,1); P(0,17,OUT,1,2); P(15,17,OUT,1,2);
  }
  if(type==="rabal"){
    const MANE="#e0701f", MANE2="#b8531a"; pedestal();
    P(7,3,CREMA,5,1); P(6,4,CREMA,7,1); P(5,5,CREMA,8,1);
    P(5,6,CREMA,8,1); P(5,7,CREMA,8,1); P(6,8,CREMA,7,1);
    P(6,9,CREMA,7,1); P(6,10,CREMA,6,1); P(6,11,CREMA,7,1);
    P(11,7,CREMA,3,1); P(12,8,CREMA,2,1); P(13,8,SKIN2,1,1);
    P(7,2,CREMA,1,1); P(10,2,CREMA,1,1);
    P(4,2,MANE,3,1); P(3,3,MANE,3,2); P(3,5,MANE2,2,3); P(4,8,MANE,2,2);
    P(6,1,MANE,4,1); P(5,2,MANE,2,1);
    P(8,5,"#111",4,2); P(8,5,"#333",1,1); P(11,5,"#333",1,1);
    P(5,4,OUT,1,4); P(13,8,OUT,1,1); return;
  }
  if(type==="reypi"){
    const ROBE="#e8b84b", ROBE2="#b8862c", BEARD="#f3ead2", GOLD="#ffd95a"; pedestal();
    P(6,1,GOLD,1,1); P(8,0,GOLD,1,1); P(10,1,GOLD,1,1);
    P(5,2,GOLD,7,1); P(8,1,"#fff",1,1);
    P(6,3,SKIN,5,1); P(6,4,SKIN,5,2); P(7,4,"#000",1,1); P(9,4,"#000",1,1);
    P(6,6,BEARD,5,1); P(7,7,BEARD,3,2);
    P(5,9,ROBE,7,1); P(4,10,ROBE,9,2); P(5,12,ROBE2,7,1); P(8,10,"#fff",1,2); return;
  }
  pedestal();
  P(6,3,SKIN,5,1); P(5,4,SKIN,7,1); P(5,5,SKIN,7,1); P(6,6,SKIN,5,1); P(7,7,SKIN,3,1);
  P(6,5,"#fff",2,1); P(9,5,"#fff",2,1); P(7,5,"#1a1a1a",1,1); P(10,5,"#1a1a1a",1,1);
  P(8,6,SKIN2,1,1);
  let cloth="#cccccc";
  if(type==="vinalopop") cloth="#e6d8b0";
  if(type==="alcudia")   cloth="#2e6a9e";
  if(type==="glorieta")  cloth="#7a2f4f";
  if(type==="alfin")     cloth="#b9b9b9";
  P(5,8,cloth,7,1); P(4,9,cloth,9,1); P(4,10,cloth,9,1); P(5,11,cloth,7,1);
  P(3,9,cloth,1,2); P(12,9,cloth,1,2); P(3,11,SKIN,1,1); P(12,11,SKIN,1,1);
  if(type==="vinalopop"){
    const BEANIE="#b89a68";
    P(5,2,BEANIE,7,2); P(6,1,BEANIE,5,1); P(5,4,BEANIE,1,1); P(11,4,BEANIE,1,1);
    P(5,3,"#a3875a",7,1); P(3,8,"#8a6a3a",1,3); P(12,8,"#8a6a3a",1,3); P(8,9,"#1c140c",1,2);
  }
  if(type==="alcudia"){
    const HAIR="#f2c84b";
    P(4,4,HAIR,2,4); P(11,4,HAIR,2,4); P(5,7,HAIR,1,2); P(11,7,HAIR,1,2);
    P(5,0,"#d9b84a",7,1); P(5,1,"#d9b84a",7,1);
    P(5,0,"#241810",1,1); P(7,0,"#241810",1,1); P(9,0,"#241810",1,1); P(11,0,"#241810",1,1);
    P(3,8,"#1d486e",1,4); P(12,8,"#1d486e",1,4);
  }
  if(type==="glorieta"){
    const HAIR="#4a3526";
    P(4,3,HAIR,3,5); P(10,3,HAIR,3,5); P(5,2,HAIR,7,1); P(4,8,HAIR,1,2); P(12,8,HAIR,1,2);
    P(6,3,HAIR,5,1); P(5,3,"#c0392b",7,1); P(11,10,"#2e7d32",2,2); P(11,10,"#fff",1,1);
  }
  if(type==="alfin"){
    const HAIR="#1a1a1a";
    P(4,3,HAIR,9,2); P(5,5,HAIR,1,1); P(11,5,HAIR,1,1); P(7,1,HAIR,3,2);
    P(6,5,"#241810",2,1); P(9,5,"#241810",2,1); P(8,5,"#241810",1,1);
    P(7,9,"#5a8f3c",3,1); P(6,10,"#5a8f3c",1,1); P(10,10,"#5a8f3c",1,1);
  }
}
function guardianCanvas(type, cell=4){
  const c=document.createElement('canvas'); c.width=16*cell; c.height=20*cell;
  drawGuardian(c.getContext('2d'), type, 0, 0, cell);
  c.style.width=(16*cell)+'px'; c.style.height=(20*cell)+'px'; c.style.imageRendering='pixelated';
  c.style.border='none'; c.style.boxShadow='none'; c.style.background='transparent';
  return c;
}
function partyMembers(){
  const order=["vinalopop","alcudia","glorieta","rabal","alfin","reypi"]; const have=[];
  order.forEach(g=>{ for(const k in JOIN_AFTER){ if(JOIN_AFTER[k]===g && state.done>= +k){ have.push(g); break; } } });
  if(have.length===0) have.push("vinalopop");
  return have;
}
function renderParty(elId){
  const el=document.getElementById(elId); if(!el) return; el.innerHTML='';
  partyMembers().forEach(g=>{ el.appendChild(guardianCanvas(g,3)); });
}

/* =========================================================
   MAPA (solo juego completo)
========================================================= */
const NODES=[
  {x:120,y:430}, {x:250,y:330}, {x:175,y:200}, {x:330,y:130},
  {x:480,y:210}, {x:470,y:370}, {x:650,y:300}, {x:790,y:150}
];
function drawMap(){
  const mapCanvas=document.getElementById('mapCanvas'); if(!mapCanvas) return;
  const ctx=mapCanvas.getContext('2d'), W=900,H=540;
  ctx.fillStyle="#cfeab0"; ctx.fillRect(0,0,W,H);
  for(let y=0;y<H;y+=60)for(let x=0;x<W;x+=60){ if(((x/60)+(y/60))%2===0){ctx.fillStyle="rgba(180,220,150,.5)";ctx.fillRect(x,y,60,60);} }
  ctx.strokeStyle="#bcd9f2"; ctx.lineWidth=10; ctx.beginPath();
  ctx.moveTo(0,500); ctx.bezierCurveTo(300,470,500,560,900,480); ctx.stroke();
  ctx.strokeStyle="#b8862c"; ctx.lineWidth=8; ctx.setLineDash([14,12]); ctx.lineCap="round";
  ctx.beginPath(); ctx.moveTo(NODES[0].x,NODES[0].y);
  for(let i=1;i<NODES.length;i++) ctx.lineTo(NODES[i].x,NODES[i].y);
  ctx.stroke(); ctx.setLineDash([]);
  NODES.forEach((n,i)=>{
    const completed=i<state.done, active=i===state.done, locked=i>state.done;
    ctx.fillStyle="rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(n.x,n.y+30,30,8,0,0,7); ctx.fill();
    ctx.lineWidth=5;
    if(completed){ ctx.fillStyle="#5a8f3c"; ctx.strokeStyle="#2f5a22"; }
    else if(active){ const t=(Date.now()%1000)/1000; ctx.fillStyle="#e8b84b"; ctx.strokeStyle="#fff"; ctx.lineWidth=5+Math.sin(t*6.28)*3; }
    else { ctx.fillStyle="#8a8a8a"; ctx.strokeStyle="#555"; }
    ctx.beginPath(); ctx.arc(n.x,n.y,26,0,7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = locked? "#ddd" : "#1c140c";
    ctx.font="bold 22px 'Press Start 2P',monospace"; ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText(completed? "✓" : (i+1), n.x, n.y+2);
    ctx.font="9px 'Press Start 2P',monospace"; ctx.fillStyle="#3a2a10";
    ctx.fillText(CHAPTERS[i].topic.toUpperCase().slice(0,16), n.x, n.y+44);
  });
  const here = NODES[Math.min(state.done,7)];
  drawGuardian(ctx,"vinalopop", here.x-32, here.y-105, 4);
  if(state.done>=2) drawGuardian(ctx,"alcudia", here.x+4, here.y-105, 4);
  ctx.font="30px serif"; ctx.fillText("🏰", NODES[7].x, NODES[7].y-60);
  requestAnimationFrame(()=>{ const m=document.getElementById('map'); if(m && m.classList.contains('active')) drawMap(); });
}
document.addEventListener('click',function(e){
  const mapEl=document.getElementById('map'); if(!mapEl || !mapEl.classList.contains('active')) return;
  const c=document.getElementById('mapCanvas'); if(!c || e.target!==c) return;
  const r=c.getBoundingClientRect(); const sx=c.width/r.width, sy=c.height/r.height;
  const mx=(e.clientX-r.left)*sx, my=(e.clientY-r.top)*sy;
  NODES.forEach((n,i)=>{ if(Math.hypot(mx-n.x,my-n.y)<32 && i===state.done){ openChapter(i); } });
});

/* =========================================================
   CAPÍTULO: historia + minijuego + vidas
========================================================= */
let curChapter=0, fails=0;
const MAX_FAILS=3;
function livesBar(){
  let h=''; for(let i=0;i<MAX_FAILS;i++) h += (i < MAX_FAILS-fails) ? '❤️' : '🖤';
  return `<div class="livesBar" style="text-align:center;font-size:15px;margin:4px 0">${h}</div>`;
}
function restartCurrentGame(){
  fails=0; const games=[game1,game2,game3,game4,game5,game6,game7,game8]; games[curChapter]();
}
function onWrong(fbEl, retryMsg){
  fails++;
  document.querySelectorAll('.livesBar').forEach(e=>{ e.outerHTML=livesBar(); });
  if(fails>=MAX_FAILS){
    if(fbEl) fbEl.innerHTML='<span style="color:#ff8a7a">💥 ¡3 fallos! La prueba se reinicia desde el principio…</span>';
    setTimeout(restartCurrentGame, 1500); return true;
  }
  const r=MAX_FAILS-fails;
  if(fbEl) fbEl.innerHTML=(retryMsg||'<span style="color:#ff8a7a">✘ Inténtalo otra vez…</span>')
    +`<br><span class="small" style="color:#ffb38a">Te quedan ${r} ${r===1?'oportunidad':'oportunidades'}</span>`;
  return false;
}

function openChapter(i){
  curChapter=i; const ch=CHAPTERS[i];
  show('chapter');
  const t=document.getElementById('chTitle'); if(t) t.textContent=`Cap ${ch.n}: ${ch.topic}`;
  const st=document.getElementById('chStars'); if(st) st.textContent=LEVEL_NAME[LEVEL];
  let sprite = ch.guardian? `<div class="party" id="chSprite"></div>`:'';
  let html=`<h2>Capítulo ${ch.n} · ${ch.title}</h2>${sprite}`;
  ch.story.forEach(([who,txt])=>{ html+=`<div class="narr"><p class="speaker">${who}</p><p>${txt}</p></div>`; });
  html+=`<p class="center" style="color:var(--oro)">${ch.intro}</p>
         <p class="center small">🎮 Corre y salta por el mapa (←/→ y ESPACIO, o los botones). Para abrir cada 🚪 puerta resuelve el reto. ¡Llega a la meta 🏁!</p>
         <p class="center small" style="color:#9fd0ff">Nivel: <b>${LEVEL_NAME[LEVEL]}</b> · <a class="reset" onclick="changeLevelHere()">cambiar nivel</a></p>
         <p class="center small" style="color:#ffb38a">❤️❤️❤️ Tienes 3 vidas: si fallas 3 puertas, el nivel se reinicia.</p>
         <div class="center"><button class="btn oro" onclick="launchGame()">▶ ¡Comienza el reto!</button></div>`;
  document.getElementById('chStory').innerHTML=html;
  document.getElementById('chGame').innerHTML='';
  if(ch.guardian){ const sp=document.getElementById('chSprite'); if(sp) sp.appendChild(guardianCanvas(ch.guardian,4)); }
}
function changeLevelHere(){ showLevelChooser(()=>openChapter(curChapter)); }

function launchGame(){
  fails=0;
  document.getElementById('chStory').innerHTML=
    `<h2>Capítulo ${CHAPTERS[curChapter].n} · ${CHAPTERS[curChapter].topic} · <span style="color:#9fd0ff">${LEVEL_NAME[LEVEL]}</span></h2>`;
  startPlatformer();
}

function completeChapter(){
  state.movimientos=(state.movimientos||0)+1; save();    // bonus por superar el capítulo
  if(MODE==='single'){ completeChapterSingle(); return; }
  if(curChapter+1 > state.done){ state.done=curChapter+1; }
  save();
  const ch=CHAPTERS[curChapter]; const newGuardian=JOIN_AFTER[ch.n]; let joinHtml='';
  if(newGuardian && newGuardian!=='vinalopop'){
    const names={alcudia:"¡Torre Alcudia se une al equipo!",glorieta:"¡Dama Glorieta se une al equipo!",
      rabal:"¡Caballo Rabal se une al equipo!",alfin:"¡Alfín se une al equipo!",reypi:"¡El Rey Pi ha sido liberado!"};
    joinHtml=`<div class="qbox"><div id="joinSprite"></div><p style="color:var(--oro)">${names[newGuardian]}</p></div>`;
  }
  document.getElementById('chGame').innerHTML=`
    <div class="qbox"><div class="victory-emoji">⭐✨⭐</div><h2>¡RETO SUPERADO!</h2>
      <p>${ch.title} ha recuperado su armonía.</p>
      <p style="color:var(--oro)">⚡ ¡Has ganado 1 movimiento!${plRayCount?` Y recogiste ${plRayCount} rayito${plRayCount===1?'':'s'} ⚡`:''}</p>
      <p class="small">Movimientos totales: ${state.movimientos}</p></div>
    ${joinHtml}
    <div class="center">${ state.done>=8
        ? `<button class="btn oro" onclick="show('victory');renderParty('winParty');drawWinArt()">▶ Ver el final</button>`
        : `<button class="btn oro" onclick="goMap()">▶ Continuar la aventura</button>` }</div>`;
  if(newGuardian && newGuardian!=='vinalopop'){ document.getElementById('joinSprite').appendChild(guardianCanvas(newGuardian,5)); }
}
function completeChapterSingle(){
  const ch=CHAPTERS[curChapter]; const g=ch.guardian||"vinalopop";
  document.getElementById('chGame').innerHTML=`
    <div class="qbox"><div class="victory-emoji">⭐✨⭐</div><h2>¡RETO SUPERADO!</h2>
      <div class="party" id="okSprite"></div>
      <p>Has completado el reto de <b>${ch.topic}</b> en nivel <b>${LEVEL_NAME[LEVEL]}</b>.<br>${ch.title} ha recuperado su armonía. 🎉</p>
      <p style="color:var(--oro)">⚡ ¡Has ganado 1 movimiento!${plRayCount?` Y recogiste ${plRayCount} rayito${plRayCount===1?'':'s'} ⚡`:''}</p></div>
    <div class="center">
      <button class="btn oro" onclick="initChapter(${ch.n})">↺ Jugar otra vez</button>
      <a class="btn azul" href="index.html">▶ Menú de capítulos</a>
      ${ ch.n<8 ? `<a class="btn" href="${chapterFile(ch.n+1)}">➡ Capítulo ${ch.n+1}</a>`
                : `<a class="btn" href="Juego_Completo.html">👑 Juego completo</a>` }
    </div>`;
  const sp=document.getElementById('okSprite'); if(sp) sp.appendChild(guardianCanvas(g,4));
}

/* ---------- MOTOR DE PREGUNTAS (opción múltiple, con visual opcional) ---------- */
function quizGame(questions, opts={}){
  const total=questions.length; let idx=0;
  const host=document.getElementById('chGame');
  function render(){
    if(idx>=total){ completeChapter(); return; }
    const q=questions[idx];
    host.innerHTML=`
      <div class="stars">${'★'.repeat(idx)}${'☆'.repeat(total-idx)}</div>
      ${livesBar()}
      <div class="progressbar"><div style="width:${(idx/total)*100}%"></div></div>
      ${opts.banner? `<div class="qbox">${opts.banner(q)}</div>`:''}
      ${q.draw? `<div class="qbox"><div id="qvis" style="text-align:center"></div></div>`:''}
      <div class="qbox"><div class="qtext">${q.q}</div></div>
      <div class="row" id="optRow"></div>
      <div class="feedback" id="fb"></div>
      <p class="hint center">Reto ${idx+1} de ${total} · ${LEVEL_NAME[LEVEL]}</p>`;
    if(q.draw){ q.draw(document.getElementById('qvis')); }
    const row=document.getElementById('optRow');
    shuffle(q.options.slice()).forEach(o=>{
      const b=document.createElement('button'); b.className='opt'; b.textContent=o;
      b.onclick=()=>{
        if(String(o)===String(q.answer)){
          b.classList.add('good'); state.stars++; save();
          document.getElementById('fb').innerHTML=`<span style="color:#7fd048">✔ ${q.fb||'¡Correcto!'}</span>`;
          [...row.children].forEach(x=>x.disabled=true);
          setTimeout(()=>{ idx++; render(); }, 850);
        }else{
          b.classList.add('bad'); b.disabled=true;
          const restart=onWrong(document.getElementById('fb'));
          if(restart){ [...row.children].forEach(x=>x.disabled=true); }
        }
      };
      row.appendChild(b);
    });
  }
  render();
}

/* =========================================================
   VISUALES (reloj, gráfica, figuras)
========================================================= */
function clockCanvas(h,m){
  const c=document.createElement('canvas'); c.width=180;c.height=180;
  c.style.width='180px';c.style.height='180px';c.style.background='#f5e7c4';c.style.border='4px solid #b8862c';c.style.borderRadius='50%';
  const x=c.getContext('2d'); const cx=90,cy=90,R=78;
  x.strokeStyle="#3a2a10"; x.fillStyle="#3a2a10";
  for(let i=0;i<12;i++){ const a=i*Math.PI/6; x.beginPath(); x.arc(cx+Math.sin(a)*R*0.85, cy-Math.cos(a)*R*0.85,3,0,7); x.fill(); }
  const ah=(h%12)*Math.PI/6 + m*Math.PI/360;
  x.lineWidth=6;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.sin(ah)*40,cy-Math.cos(ah)*40);x.stroke();
  const am=m*Math.PI/30; x.lineWidth=4;x.strokeStyle="#c0392b";x.beginPath();x.moveTo(cx,cy);
  x.lineTo(cx+Math.sin(am)*60,cy-Math.cos(am)*60);x.stroke();
  x.fillStyle="#c0392b";x.beginPath();x.arc(cx,cy,5,0,7);x.fill();
  return c;
}
function chartCanvas(data, maxv){
  const c=document.createElement('canvas'); const n=data.length; c.width=70+n*78; if(c.width<420)c.width=420; c.height=240; c.style.background='#f5e7c4';
  const x=c.getContext('2d'); const bw=60, gap=18, base=200, x0=30;
  data.forEach(([name,v],i)=>{
    const px0=x0+i*(bw+gap); const hh=v/maxv*170;
    x.fillStyle="#2e6a9e"; x.fillRect(px0,base-hh,bw,hh);
    x.fillStyle="#3a2a10"; x.font="11px 'Press Start 2P',monospace"; x.textAlign="center"; x.fillText(v, px0+bw/2, base-hh-8);
    x.font="8px 'Press Start 2P',monospace"; x.fillText(name.slice(0,9), px0+bw/2, base+18);
  });
  x.strokeStyle="#3a2a10"; x.beginPath(); x.moveTo(20,base); x.lineTo(c.width-10,base); x.stroke();
  return c;
}
function polyCanvas(kind, label){
  const c=document.createElement('canvas');c.width=170;c.height=170;c.style.background='#f5e7c4';
  const x=c.getContext('2d'); x.fillStyle="#2e6a9e"; x.strokeStyle="#1c140c"; x.lineWidth=4; x.beginPath();
  const cc=85;
  if(kind==='tri'){x.moveTo(85,25);x.lineTo(150,140);x.lineTo(20,140);x.closePath();}
  else if(kind==='cuad'){x.rect(40,40,90,90);}
  else if(kind==='rect'){x.rect(20,55,130,60);}
  else if(kind==='circ'){x.arc(cc,cc,60,0,7);}
  else if(kind==='penta'){for(let i=0;i<5;i++){const a=i*2*Math.PI/5-Math.PI/2; const px0=cc+Math.cos(a)*62, py=cc+Math.sin(a)*62; i?x.lineTo(px0,py):x.moveTo(px0,py);}x.closePath();}
  else if(kind==='hexa'){for(let i=0;i<6;i++){const a=i*2*Math.PI/6; const px0=cc+Math.cos(a)*62, py=cc+Math.sin(a)*62; i?x.lineTo(px0,py):x.moveTo(px0,py);}x.closePath();}
  else if(kind==='rombo'){x.moveTo(85,20);x.lineTo(150,85);x.lineTo(85,150);x.lineTo(20,85);x.closePath();}
  x.fill(); x.stroke();
  return c;
}
// rectángulo/cuadrado con medidas (perímetro/área)
function rectMeasCanvas(w,h,unit){
  const c=document.createElement('canvas');c.width=200;c.height=170;c.style.background='#f5e7c4';
  const x=c.getContext('2d'); const W=120*(w>=h?1:w/h), H=110*(h>=w?1:h/w);
  const ox=(200-W)/2, oy=(150-H)/2;
  x.fillStyle="#9fc6e8"; x.strokeStyle="#1c140c"; x.lineWidth=4; x.fillRect(ox,oy,W,H); x.strokeRect(ox,oy,W,H);
  x.fillStyle="#1c140c"; x.font="11px 'Press Start 2P',monospace"; x.textAlign="center";
  x.fillText(`${w} ${unit}`, ox+W/2, oy+H+18);
  x.save(); x.translate(ox-10, oy+H/2); x.rotate(-Math.PI/2); x.fillText(`${h} ${unit}`,0,0); x.restore();
  return c;
}

/* =========================================================
   GENERADORES DE PREGUNTAS (por nivel, aleatorios)
========================================================= */

// ---- CAP 1: multiplicación y división ----
function gen1(level){
  const N=12, qs=[];
  for(let i=0;i<N;i++){
    if(i%2===0){ // multiplicación
      let a,b;
      if(level==='bronce'){ a=rnd(11,40); b=rnd(2,6); }
      else if(level==='plata'){ a=rnd(23,99); b=rnd(3,8); }
      else { if(Math.random()<.5){ a=rnd(120,499); b=rnd(3,9);} else { a=rnd(12,29); b=rnd(11,19);} }
      const c=a*b;
      qs.push({q:`🌳 ${a} × ${b} = ?`, answer:c, fb:`${a} × ${b} = ${c}`,
        options:optsFrom(c,[c+b, c-b, c+10, c-10, c+a, c+b*2].filter(v=>v>0))});
    } else { // división exacta
      let b,quo;
      if(level==='bronce'){ b=rnd(2,6); quo=rnd(3,12); }
      else if(level==='plata'){ b=rnd(3,9); quo=rnd(6,20); }
      else { b=rnd(4,12); quo=rnd(11,40); }
      const a=b*quo;
      qs.push({q:`🌳 ${a} ÷ ${b} = ?`, answer:quo, fb:`${a} ÷ ${b} = ${quo}`,
        options:optsFrom(quo,[quo+1,quo-1,quo+2,quo-2,quo+5,quo+10].filter(v=>v>0))});
    }
  }
  return shuffle(qs);
}

// ---- CAP 2: decimales ----
function gen2(level){
  const N=12, qs=[]; const r2=n=>Math.round(n*100)/100; const fmt=n=>Number(n.toFixed(2)).toString().replace('.',',');
  for(let i=0;i<N;i++){
    const types = level==='bronce'? ['add','sub','add','compare'] : level==='plata'? ['add','sub','compare','x10'] : ['add','sub','x10','x100','compare'];
    const t=pick(types);
    if(t==='add'||t==='sub'){
      let a,b;
      if(level==='bronce'){ a=rnd(5,40)/10; b=rnd(1,9)/10; }
      else if(level==='plata'){ a=rnd(10,90)/10; b=rnd(5,45)/10; }
      else { a=rnd(120,950)/100; b=rnd(25,500)/100; }
      if(t==='sub' && a<b){ const tmp=a; a=b; b=tmp; }
      const c=r2(t==='add'? a+b : a-b); const sym=t==='add'?'+':'−';
      qs.push({q:`🪜 ${fmt(a)} ${sym} ${fmt(b)} = ?`, answer:fmt(c), fb:`= ${fmt(c)}`,
        options:optsFrom(fmt(c),[fmt(r2(c+0.1)),fmt(r2(c-0.1)),fmt(r2(c+1)),fmt(r2(c-0.2)),fmt(r2(c+0.01))])});
    } else if(t==='x10'){
      const a=rnd(15,99)/10; const c=r2(a*10);
      qs.push({q:`🪜 ${fmt(a)} × 10 = ?`, answer:fmt(c), fb:`Al ×10 la coma se mueve: ${fmt(c)}`,
        options:optsFrom(fmt(c),[fmt(a),fmt(r2(a*100)),fmt(r2(c+1)),fmt(r2(c-1))])});
    } else if(t==='x100'){
      const a=rnd(105,950)/100; const c=r2(a*100);
      qs.push({q:`🪜 ${fmt(a)} × 100 = ?`, answer:fmt(c), fb:`Al ×100: ${fmt(c)}`,
        options:optsFrom(fmt(c),[fmt(r2(a*10)),fmt(r2(a*1000)),fmt(r2(c+10)),fmt(r2(c-10))])});
    } else { // compare
      const den = level==='oro'?100:10; const set=new Set();
      while(set.size<4){ set.add(rnd(level==='oro'?15:5, level==='oro'?599:95)); }
      const arr=[...set].map(v=>v/den); const mx=Math.max(...arr);
      qs.push({q:`🪜 ¿Qué decimal es MAYOR?`, answer:fmt(mx), fb:`${fmt(mx)} es el mayor`, options:shuffle(arr.map(fmt))});
    }
  }
  return shuffle(qs);
}

// ---- CAP 3: dinero (preguntas para las puertas) ----
function gen3(level){
  const fmt=n=>Number(n.toFixed(2)).toString().replace('.',',');
  const base=level==='bronce'?1:(level==='plata'?2:5);
  const N=12, qs=[];
  for(let i=0;i<N;i++){
    const t=pick(['change','cents','coins']);
    if(t==='change'){ const step=level==='oro'?0.05:0.10; const u=Math.round(base/step); const cost=Math.round(rnd(1,u-1)*step*100)/100; const ch=Math.round((base-cost)*100)/100;
      qs.push({q:`🪙 Pagas ${base}€ por algo de ${fmt(cost)} €. ¿Cuánto te devuelven?`, answer:fmt(ch)+' €', fb:`${base} − ${fmt(cost)} = ${fmt(ch)} €`,
        options:optsFrom(fmt(ch)+' €',[fmt(Math.round((base-cost+0.1)*100)/100)+' €',fmt(cost)+' €',fmt(Math.round((base-cost-0.1)*100)/100)+' €'])}); }
    else if(t==='cents'){ const e=(level==='oro'?rnd(1,19)*0.05:rnd(1,9)*0.1); const ev=Math.round(e*100)/100; const cents=Math.round(ev*100);
      qs.push({q:`🪙 ¿Cuántos céntimos son ${fmt(ev)} €?`, answer:cents+' c', fb:`${fmt(ev)} € = ${cents} céntimos`,
        options:optsFrom(cents+' c',[(cents+10)+' c',(cents-5>0?cents-5:cents+5)+' c',(cents*10)+' c'])}); }
    else { const coin=level==='bronce'?0.5:(level==='plata'?0.2:0.05); const lbl=level==='bronce'?'50c':(level==='plata'?'20c':'5c'); const n=rnd(3,level==='oro'?9:5); const tot=Math.round(n*coin*100)/100;
      qs.push({q:`🪙 ¿Cuánto valen ${n} monedas de ${lbl}?`, answer:fmt(tot)+' €', fb:`${n} × ${fmt(coin)} = ${fmt(tot)} €`,
        options:optsFrom(fmt(tot)+' €',[fmt(Math.round((tot+coin)*100)/100)+' €',fmt(Math.round((tot-coin)*100)/100)+' €',n+' €'])}); }
  }
  return shuffle(qs);
}

// ---- CAP 4: fracciones ----
function gen4(level){
  const N=12, qs=[];
  const dens = level==='bronce'?[2,3,4]:level==='plata'?[2,3,4,5,6,8]:[3,4,5,6,8,10,12];
  function fracOpts(num,d){
    const set=new Set([`${num}/${d}`]); const out=[`${num}/${d}`];
    [num+1,num-1,num+2,num-2,d-num,1].forEach(k=>{ if(k>0&&k<=d){ const s=`${k}/${d}`; if(!set.has(s)){set.add(s);out.push(s);} } });
    let e=1; while(out.length<4){ const k=((num+e-1)%d)+1; const s=`${k}/${d}`; if(!set.has(s)){set.add(s);out.push(s);} e++; if(e>30)break; }
    return shuffle(out.slice(0,4));
  }
  for(let i=0;i<N;i++){
    const t = pick(level==='bronce'? ['complete','equiv','compare'] : level==='plata'? ['complete','sum','equiv','compare'] : ['complete','sum','sub','equiv','compare']);
    const d=pick(dens);
    if(t==='complete'){ const a=rnd(1,d-1), r=d-a;
      qs.push({q:`🍰 ${a}/${d} + ? = 1 (entero)`, answer:`${r}/${d}`, fb:`${a}/${d} + ${r}/${d} = ${d}/${d} = 1`, options:fracOpts(r,d)});
    } else if(t==='sum'){ const a=rnd(1,d-2), b=rnd(1,d-a), c=a+b;
      qs.push({q:`🍰 ${a}/${d} + ${b}/${d} = ?`, answer:`${c}/${d}`, fb:`Mismo denominador: ${a}+${b}=${c} → ${c}/${d}`, options:fracOpts(c,d)});
    } else if(t==='sub'){ let a=rnd(2,d), b=rnd(1,a-1>0?a-1:1); if(b>=a)b=a-1; const c=a-b;
      qs.push({q:`🍰 ${a}/${d} − ${b}/${d} = ?`, answer:`${c}/${d}`, fb:`${a}−${b}=${c} → ${c}/${d}`, options:fracOpts(c,d)});
    } else if(t==='equiv'){ const a=rnd(1,d-1), k=rnd(2,3); const nn=a*k, dd=d*k;
      qs.push({q:`🍰 ${a}/${d} es equivalente a…`, answer:`${nn}/${dd}`, fb:`${a}/${d} = ${nn}/${dd} (×${k})`,
        options:optsFrom(`${nn}/${dd}`,[`${nn+1}/${dd}`,`${nn}/${dd+1}`,`${a}/${dd}`,`${nn-1}/${dd}`])});
    } else { // compare same denom (necesita al menos 2 numeradores distintos)
      const dc = d<3? pick([3,4,5]) : d;
      let x=rnd(1,dc-1), y; do{ y=rnd(1,dc-1);}while(y===x); const big=Math.max(x,y), sm=Math.min(x,y);
      qs.push({q:`🍰 ¿Qué fracción es MAYOR?`, answer:`${big}/${dc}`, fb:`Con igual denominador, mayor numerador = mayor: ${big}/${dc}`,
        options:optsFrom(`${big}/${dc}`,[`${sm}/${dc}`,`${Math.max(1,big-1)}/${dc}`,`1/${dc}`])});
    }
  }
  return shuffle(qs);
}

// ---- CAP 5: unidades de medida ----
function gen5(level){
  const N=12, qs=[];
  const pairs=[['km','m',1000],['m','cm',100],['cm','mm',10],['L','ml',1000],['kg','g',1000]];
  function uOpts(c,u,f){ return optsFrom(`${c} ${u}`,[`${c*10} ${u}`,`${Math.round(c/10)} ${u}`,`${c+f} ${u}`,`${c*100} ${u}`,`${Math.round(c/100)} ${u}`]); }
  for(let i=0;i<N;i++){
    const [big,small,f]=pick(pairs);
    const t = pick(level==='bronce'? ['toSmall','toSmall','compare'] : level==='plata'? ['toSmall','toBig','compare'] : ['toSmallDec','toBig','compare']);
    if(t==='toSmall'){ const v=rnd(2,9); const c=v*f;
      qs.push({q:`📏 ${v} ${big} = ? ${small}`, answer:`${c} ${small}`, fb:`${v} ${big} = ${c} ${small}`, options:uOpts(c,small,f)});
    } else if(t==='toSmallDec'){ const v=rnd(11,49)/10; const c=Math.round(v*f);
      qs.push({q:`📏 ${String(v).replace('.',',')} ${big} = ? ${small}`, answer:`${c} ${small}`, fb:`${String(v).replace('.',',')} ${big} = ${c} ${small}`, options:uOpts(c,small,f)});
    } else if(t==='toBig'){ const c=rnd(2,9); const v=c*f;
      qs.push({q:`📏 ${v} ${small} = ? ${big}`, answer:`${c} ${big}`, fb:`${v} ${small} = ${c} ${big}`,
        options:optsFrom(`${c} ${big}`,[`${c*10} ${big}`,`${c+1} ${big}`,`${Math.round(c/10)||1} ${big}`,`${v} ${big}`])});
    } else { // compare
      let v1=rnd(1,9), v2=rnd(1,9); while(v2===v1) v2=rnd(1,9);
      const a={t:`${v1*f} ${small}`,val:v1*f}, b={t:`${v2} ${big}`,val:v2*f};
      const c={t:`${rnd(1,9)*f+5} ${small}`}; c.val=parseInt(c.t);
      let arr=[a,b,c].filter((o,ix,ar)=>ar.findIndex(z=>z.t===o.t)===ix);
      const mx=arr.reduce((p,q)=>q.val>p.val?q:p);
      qs.push({q:`📏 ¿Cuál es la medida MAYOR?`, answer:mx.t, fb:`${mx.t} es la mayor`, options:shuffle(arr.map(o=>o.t))});
    }
  }
  return shuffle(qs);
}

// ---- CAP 6: el tiempo ----
function gen6(level){
  const N=12, qs=[]; const pad=n=>String(n).padStart(2,'0'); const ft=(h,m)=>`${h}:${pad(m)}`;
  for(let i=0;i<N;i++){
    const t = pick(level==='bronce'? ['read','read','conv','interval'] : level==='plata'? ['read5','interval','conv','conv'] : ['readAny','interval','convHard','interval']);
    if(t==='read'||t==='read5'||t==='readAny'){
      const h=rnd(1,12);
      const m = t==='read'? pick([0,15,30,45]) : t==='read5'? pick([0,5,10,15,20,25,30,35,40,45,50,55]) : rnd(0,59);
      const correct=ft(h,m);
      const w=[ft(h%12+1,m), ft(h,(m+15)%60), ft(h,(m+30)%60)];
      qs.push({q:`⏰ ¿Qué hora marca el reloj?`, answer:correct, fb:`Son las ${correct}`, options:optsFrom(correct,w),
        draw:el=>el.appendChild(clockCanvas(h,m))});
    } else if(t==='interval'){
      const h=rnd(1,9), m1=pick([0,10,15,20,30]);
      const dur = level==='bronce'? pick([15,30,45,60]) : level==='plata'? pick([20,25,40,50]) : pick([35,55,70,75,90]);
      let tot=h*60+m1+dur, h2=Math.floor(tot/60), m2=tot%60; if(h2>12) h2-=12;
      qs.push({q:`⏱️ ¿Cuánto tiempo pasa desde las ${ft(h,m1)} hasta las ${ft(h2,m2)}?`,
        answer:`${dur} min`, fb:`Pasan ${dur} minutos`, options:optsFrom(`${dur} min`,[`${dur+10} min`,`${dur-10} min`,`${dur+15} min`,`${dur+5} min`].filter(s=>parseInt(s)>0))});
    } else if(t==='conv'){
      const opt=pick([['1 hora = ? minutos','60 min',['30 min','100 min','90 min']],
        ['Media hora = ? minutos','30 min',['15 min','60 min','20 min']],
        ['1 hora y media = ? minutos','90 min',['60 min','120 min','100 min']],
        ['2 horas = ? minutos','120 min',['100 min','60 min','140 min']],
        ['Un cuarto de hora = ? minutos','15 min',['30 min','25 min','10 min']]]);
      qs.push({q:`⏱️ ${opt[0]}`, answer:opt[1], fb:opt[1], options:optsFrom(opt[1],opt[2])});
    } else { // convHard
      const opt=pick([['90 minutos = ? hora(s)','1 h y 30 min',['1 h y 15 min','2 h','1 h y 45 min']],
        ['1 día = ? horas','24 h',['12 h','48 h','20 h']],
        ['1 minuto = ? segundos','60 s',['100 s','30 s','120 s']],
        ['180 minutos = ? horas','3 h',['2 h','4 h','3 h y 30 min']],
        ['1 semana = ? días','7 días',['5 días','10 días','14 días']]]);
      qs.push({q:`⏱️ ${opt[0]}`, answer:opt[1], fb:opt[1], options:optsFrom(opt[1],opt[2])});
    }
  }
  return shuffle(qs);
}

// ---- CAP 7: estadística ----
function gen7(level){
  const cats = pick([
    ["Peón","Caballo","Torre","Dama","Alfín"],
    ["Lunes","Martes","Miércol","Jueves","Viernes"],
    ["Vainilla","Choco","Fresa","Limón","Menta"],
    ["Rojo","Azul","Verde","Oro","Gris"]
  ]);
  const maxv = level==='bronce'?8:level==='plata'?12:20;
  let data;
  // generar hasta que máximo y mínimo sean únicos
  for(let tries=0;tries<60;tries++){
    data = cats.map(c=>[c, rnd(1,maxv)]);
    const vals=data.map(d=>d[1]); const mx=Math.max(...vals), mn=Math.min(...vals);
    if(vals.filter(v=>v===mx).length===1 && vals.filter(v=>v===mn).length===1 && mx!==mn) break;
  }
  const draw = el=>el.appendChild(chartCanvas(data,maxv));
  const total=data.reduce((s,d)=>s+d[1],0);
  const sorted=[...data].sort((a,b)=>b[1]-a[1]);
  const top=sorted[0], bottom=sorted[sorted.length-1];
  const names=data.map(d=>d[0]);
  const nameOpts=correct=>{ const others=shuffle(names.filter(n=>n!==correct)).slice(0,3); return shuffle([correct,...others]); };
  const qs=[];
  qs.push({q:`📊 ¿Quién tiene MÁS?`, answer:top[0], fb:`${top[0]} con ${top[1]}`, options:nameOpts(top[0]), draw});
  qs.push({q:`📊 ¿Quién tiene MENOS?`, answer:bottom[0], fb:`${bottom[0]} con ${bottom[1]}`, options:nameOpts(bottom[0]), draw});
  qs.push({q:`📊 ¿Cuál es el TOTAL de todos los datos?`, answer:String(total), fb:`Sumando todo = ${total}`, options:optsFrom(total,[total-3,total+4,total-6,total+2]), draw});
  const a=pick(data); let b=pick(data.filter(d=>d[0]!==a[0] && d[1]!==a[1])); if(!b) b=pick(data.filter(d=>d[0]!==a[0])); const dif=Math.abs(a[1]-b[1]);
  qs.push({q:`📊 ¿Cuántos más tiene ${a[1]>=b[1]?a[0]:b[0]} que ${a[1]>=b[1]?b[0]:a[0]}?`, answer:String(dif), fb:`${Math.max(a[1],b[1])} − ${Math.min(a[1],b[1])} = ${dif}`, options:optsFrom(dif,[dif+1,dif-1,dif+2,dif+3].filter(v=>v>=0)), draw});
  const rd=pick(data);
  qs.push({q:`📊 ¿Qué valor tiene «${rd[0]}»?`, answer:String(rd[1]), fb:`${rd[0]} = ${rd[1]}`, options:optsFrom(rd[1],[rd[1]+1,rd[1]-1,rd[1]+2,rd[1]-2].filter(v=>v>0)), draw});
  if(level!=='bronce'){
    const range=top[1]-bottom[1];
    qs.push({q:`📊 ¿Cuál es el RECORRIDO (mayor − menor)?`, answer:String(range), fb:`${top[1]} − ${bottom[1]} = ${range}`, options:optsFrom(range,[range+1,range-1,range+2,total]), draw});
  }
  if(level==='oro'){
    if(total % data.length===0){ const mean=total/data.length;
      qs.push({q:`📊 ¿Cuál es la MEDIA (total ÷ nº de datos)?`, answer:String(mean), fb:`${total} ÷ ${data.length} = ${mean}`, options:optsFrom(mean,[mean+1,mean-1,mean+2,total]), draw});
    } else { const half=Math.round(total/2);
      qs.push({q:`📊 ¿Cuántos datos hay en total (categorías)?`, answer:String(data.length), fb:`Hay ${data.length} categorías`, options:optsFrom(data.length,[data.length+1,data.length-1,data.length+2,half]), draw});
    }
  }
  return shuffle(qs);
}

// ---- CAP 8: geometría ----
function gen8(level){
  const N=12, qs=[];
  const shapes=[['tri','triángulo',3],['cuad','cuadrado',4],['rect','rectángulo',4],['penta','pentágono',5],['hexa','hexágono',6],['hexa','hexágono',6],['rombo','rombo',4],['circ','círculo',0]];
  const allNames=['triángulo','cuadrado','rectángulo','pentágono','hexágono','rombo','círculo'];
  for(let i=0;i<N;i++){
    const t = pick(level==='bronce'? ['name','sides','name'] : level==='plata'? ['name','sides','perim'] : ['sides','perim','area','name']);
    if(t==='name'){ const s=pick(shapes);
      qs.push({q:`🔷 ¿Qué figura es?`, answer:s[1], fb:`Es un ${s[1]}`, options:optsFrom(s[1], shuffle(allNames.filter(n=>n!==s[1]))), draw:el=>el.appendChild(polyCanvas(s[0]))});
    } else if(t==='sides'){ const s=pick(shapes);
      qs.push({q:`🔷 ¿Cuántos lados tiene esta figura?`, answer:String(s[2]), fb:`El ${s[1]} tiene ${s[2]} lado(s)`, options:optsFrom(s[2],[s[2]+1,s[2]-1,s[2]+2,s[2]+3].filter(v=>v>=0)), draw:el=>el.appendChild(polyCanvas(s[0]))});
    } else if(t==='perim'){
      const square = level!=='oro' && Math.random()<.5;
      const w=rnd(2,level==='oro'?12:9), h=square?w:rnd(2,level==='oro'?12:9); const unit=pick(['cm','m']);
      const per=2*(w+h);
      qs.push({q:`🔷 ¿Cuál es el PERÍMETRO de esta figura? (suma de los lados)`, answer:`${per} ${unit}`, fb:`Perímetro = 2×(${w}+${h}) = ${per} ${unit}`,
        options:optsFrom(`${per} ${unit}`,[`${w*h} ${unit}`,`${per+2} ${unit}`,`${per-2} ${unit}`,`${w+h} ${unit}`]),
        draw:el=>el.appendChild(rectMeasCanvas(w,h,unit))});
    } else { // area
      const w=rnd(2,12), h=rnd(2,12); const unit=pick(['cm','m']); const ar=w*h;
      qs.push({q:`🔷 ¿Cuál es el ÁREA de esta figura? (base × altura)`, answer:`${ar} ${unit}²`, fb:`Área = ${w}×${h} = ${ar} ${unit}²`,
        options:optsFrom(`${ar} ${unit}²`,[`${2*(w+h)} ${unit}²`,`${ar+w} ${unit}²`,`${ar-h} ${unit}²`,`${w+h} ${unit}²`]),
        draw:el=>el.appendChild(rectMeasCanvas(w,h,unit))});
    }
  }
  return shuffle(qs);
}

/* =========================================================
   CAP 3: DINERO (interactivo, objetivos al azar por nivel)
========================================================= */
function game3(){
  const level=LEVEL;
  const rounds = level==='bronce'?4:level==='plata'?5:6;
  const step   = level==='bronce'?0.10:0.05;
  const maxE   = level==='bronce'?2:level==='plata'?3:5;
  const minU   = Math.round((level==='bronce'?0.40:0.50)/step);
  const maxU   = Math.round(maxE/step);
  const targets=[]; const seen=new Set();
  let guard=0;
  while(targets.length<rounds && guard++<400){
    const u=rnd(minU,maxU); const val=Math.round(u*step*100)/100; const k=val.toFixed(2);
    if(!seen.has(k)){ seen.add(k); targets.push(val); }
  }
  let round=0; const host=document.getElementById('chGame');
  const coins=[[1,'1€','c-euro'],[0.5,'50c','c-cent'],[0.2,'20c','c-cent'],[0.1,'10c','c-small'],[0.05,'5c','c-small']];
  function render(){
    if(round>=targets.length){ completeChapter(); return; }
    let sum=0; const tgt=targets[round];
    host.innerHTML=`
      <div class="stars">${'★'.repeat(round)}${'☆'.repeat(targets.length-round)}</div>
      ${livesBar()}
      <div class="qbox">
        <div class="qtext">Forma exactamente <b>${tgt.toFixed(2).replace('.',',')} €</b></div>
        <p class="hint">Pulsa monedas para sumar. Equilibra la balanza ⚖️ · ${LEVEL_NAME[LEVEL]}</p>
        <div id="bal" style="font-size:20px">⚖️</div>
        <div class="qtext" id="sumTxt" style="color:var(--oro)">0,00 €</div>
      </div>
      <div class="row" id="coinRow"></div>
      <div class="feedback" id="fb"></div>
      <div class="row">
        <button class="btn azul" id="undo">↺ Reiniciar monedas</button>
        <button class="btn oro" id="check">✔ Comprobar balanza</button>
      </div>
      <p class="hint center">Mercado ${round+1} de ${targets.length}</p>`;
    const cr=document.getElementById('coinRow');
    coins.forEach(([v,lbl,cls])=>{ const b=document.createElement('button'); b.className='coin '+cls; b.textContent=lbl;
      b.onclick=()=>{ sum=Math.round((sum+v)*100)/100; upd(); }; cr.appendChild(b); });
    function upd(){
      document.getElementById('sumTxt').textContent=sum.toFixed(2).replace('.',',')+' €';
      document.getElementById('bal').textContent = Math.abs(sum-tgt)<0.001? '⚖️ ✅' : (sum>tgt? '⚖️⬇️' : '⚖️⬆️');
    }
    document.getElementById('undo').onclick=()=>{ sum=0; upd(); document.getElementById('fb').textContent=''; };
    document.getElementById('check').onclick=()=>{
      if(Math.abs(sum-tgt)<0.001){ state.stars++; save();
        document.getElementById('fb').innerHTML='<span style="color:#7fd048">✔ ¡Balanza equilibrada!</span>';
        round++; setTimeout(render,900);
      }else{ onWrong(document.getElementById('fb'),'<span style="color:#ff8a7a">✘ Aún no es justa. Ajusta las monedas.</span>'); }
    };
  }
  render();
}

/* ---- lanzadores de minijuego ---- */
function game1(){ quizGame(gen1(LEVEL)); }
function game2(){ quizGame(gen2(LEVEL)); }
function game4(){ quizGame(gen4(LEVEL),{banner:()=>`<div class="qtext">Une las partes para formar el ENTERO 🟦</div>`}); }
function game5(){ quizGame(gen5(LEVEL)); }
function game6(){ quizGame(gen6(LEVEL)); }
function game7(){ quizGame(gen7(LEVEL)); }
function game8(){ quizGame(gen8(LEVEL)); }

/* =========================================================
   DECORACIÓN INTRO / VICTORIA + ARRANQUES
========================================================= */
function drawIntroArt(){
  const c=document.getElementById('introCanvas'); if(!c) return; const x=c.getContext('2d');
  x.clearRect(0,0,c.width,c.height);
  drawGuardian(x,"vinalopop",10,10,5); drawGuardian(x,"glorieta",90,10,5);
  drawGuardian(x,"reypi",170,10,5); drawGuardian(x,"rabal",250,10,5);
}
function drawWinArt(){
  const c=document.getElementById('winCanvas'); if(!c) return; const x=c.getContext('2d');
  x.clearRect(0,0,360,120);
  ["vinalopop","alcudia","glorieta","rabal","alfin","reypi"].forEach((g,i)=> drawGuardian(x,g, 10+i*58, 8, 3.4));
}
function initFullGame(){ MODE='full'; drawIntroArt(); }
function initChapter(n){ MODE='single'; showLevelChooser(()=>openChapter(n-1)); }

/* =========================================================
   MODO PLATAFORMAS (tipo Mario): correr, saltar y abrir
   puertas resolviendo el reto del tema de cada capítulo.
========================================================= */
const PLAT={active:false, raf:0, keys:{left:false,right:false}, jumpHeld:false, jumpBuffer:0};
const TILE=32, VW=640, VH=384, ROWS=12, GROUNDR=9;        // suelo en filas 9..11
const GRAV=0.42, MOVE=3.3, JUMP=-9.6, MAXVY=11;  // salto ALTO con hang-time y buen control en el aire
let plP=null, plDoors=[], plPits=new Set(), plObs=new Set(), plSolids=new Set();
let plRayitos=[], plEnemies=[], plRayCount=0, plMaxHearts=3;
let plGoalCol=0, plCols=0, plCam=0, plHearts=3, plCheckpoint=0, plQueue=[], plQi=0, plDoorsOpen=0, plModal=false;

const GEN_ARR=[gen1,gen2,gen3,gen4,gen5,gen6,gen7,gen8];
function platPiece(){ return CHAPTERS[curChapter].guardian || 'vinalopop'; }

/* escenarios fieles a la historia (uno por capítulo) */
const PLAT_THEMES=[
  /*1 Bosque*/            {sky:['#9fd8ff','#dff3c0'], top:'#6cae3e', body:'#7a5230', stripe:'#5a9433', crate:['#8a5a2b','#b07b3c'], night:false, bg:['🌳','🌲'], name:'Bosque de los Cubos'},
  /*2 Torre Alcudia*/     {sky:['#bcd0e0','#e6dcc6'], top:'#b9aa86', body:'#7d7060', stripe:'#9a8c6e', crate:['#7d7464','#9a8e74'], night:false, bg:['🏰','🗼'], name:'Torre de Alcudia'},
  /*3 Mercado*/           {sky:['#ffe0b0','#ffeccb'], top:'#c7a15a', body:'#8a6a3a', stripe:'#b08a4a', crate:['#9a5a2b','#c07b3c'], night:false, bg:['⛺','🧺'], name:'El Mercado'},
  /*4 Mercado central*/   {sky:['#ffd9a0','#ffe9c6'], top:'#caa46a', body:'#8a6a3a', stripe:'#b08a4a', crate:['#9a5a2b','#c07b3c'], night:false, bg:['⚖️','⛺'], name:'Mercado Central (balanza)'},
  /*5 Jardines Raval*/    {sky:['#bfe9ff','#e3f7c8'], top:'#5fae46', body:'#7a5230', stripe:'#4f9a36', crate:['#6a8a3a','#86a64c'], night:false, bg:['⛲','🌳'], name:'Jardines de Rabal'},
  /*6 Reloj Real*/        {sky:['#d8c6e8','#efe6d4'], top:'#a98c5a', body:'#6e5a3a', stripe:'#8c724a', crate:['#7a5a2b','#9a7b3c'], night:false, bg:['🕰️','⏰'], name:'Salón del Reloj'},
  /*7 Observatorio*/      {sky:['#0e1b3a','#22305c'], top:'#3a3f6a', body:'#23264a', stripe:'#4a4f86', crate:['#3a3f6a','#565c92'], night:true,  bg:['🔭','🪐','🌙'], name:'Observatorio'},
  /*8 Palacio de Pi*/     {sky:['#f3e3ff','#ffeec9'], top:'#d9c27a', body:'#b89a5a', stripe:'#e8cf8a', crate:['#b89a5a','#d9c27a'], night:false, bg:['🏛️','👑'], name:'Palacio Geométrico'}
];
function platTheme(){ return PLAT_THEMES[curChapter]||PLAT_THEMES[0]; }

/* ---- TIENDA: gasta rayitos (movimientos). Precios altos: cuesta conseguirlos ---- */
// Habilidades funcionales (se equipa solo UNA a la vez)
const ABILITIES={
  alas:  {emoji:'🪽', name:'Alas de Vainilla', price:90,  desc:'SÚPER SALTO: saltas mucho más alto y flotas más tiempo, para cruzar huecos y obstáculos con facilidad.'},
  botas: {emoji:'👟', name:'Botas veloces',    price:70,  desc:'VELOCIDAD: corres más rápido por todo el mapa.'},
  escudo:{emoji:'🛡️', name:'Escudo de nata',   price:110, desc:'PROTECCIÓN: los soldados de chocolate ya no te devuelven al inicio si te tocan.'},
  iman:  {emoji:'🧲', name:'Imán de rayitos',  price:80,  desc:'ATRACCIÓN: recoges los rayitos ⚡ cercanos sin tener que tocarlos justo encima.'}
};
// Accesorios estéticos (solo decorativos; se ponen sobre tu personaje)
const COSMETICS={
  gorro:   {emoji:'🧢',name:'Gorra aventurera', price:30, desc:'Accesorio decorativo: una gorra para tu personaje.'},
  gafas:   {emoji:'🕶️',name:'Gafas de sol',     price:45, desc:'Accesorio decorativo: gafas de sol con mucho estilo.'},
  sombrero:{emoji:'🎩',name:'Chistera elegante',price:60, desc:'Accesorio decorativo: una chistera de gala.'},
  corona:  {emoji:'👑',name:'Corona dorada',    price:100,desc:'Accesorio decorativo: la corona más lujosa del reino.'}
};
// Coleccionables (solo para tu colección, sin efecto)
const COLLECTIBLES={
  peonb:   {emoji:'🥉',name:'Peón de bronce',   price:25, desc:'Pieza de colección de bronce.'},
  caballop:{emoji:'🥈',name:'Caballo de plata', price:50, desc:'Pieza de colección de plata.'},
  reyo:    {emoji:'🥇',name:'Rey de oro',       price:90, desc:'Pieza de colección de oro.'},
  estrella:{emoji:'⭐',name:'Estrella mágica',  price:70, desc:'Estrella brillante para tu colección.'},
  trofeo:  {emoji:'🏆',name:'Trofeo del Reino', price:150,desc:'El gran trofeo: solo para los más constantes.'}
};
const LIFE_PRICE=40, LIFE_MAX=2;
const COMODIN_PRICE=25;   // cada comodín 50/50
const COMODIN_DESC='En una puerta, elimina 2 respuestas incorrectas (pista 50/50).';
function nextPlatQuestion(){ if(plQi>=plQueue.length){ plQueue=GEN_ARR[curChapter](LEVEL); plQi=0; } return plQueue[plQi++]; }

function buildPlatLevel(){
  plPits=new Set(); plObs=new Set(); plDoors=[]; plRayitos=[]; plEnemies=[]; plDoorsOpen=0;
  const nDoors = LEVEL==='bronce'?10:(LEVEL==='plata'?11:12);   // mínimo 10 preguntas por nivel
  const pitW   = LEVEL==='bronce'?1:2;
  const obsH   = LEVEL==='bronce'?1:2;
  const enemyP = LEVEL==='bronce'?0.35:(LEVEL==='plata'?0.7:1);
  const addRay=(c,r)=>plRayitos.push({x:c*TILE+TILE/2, y:r*TILE+TILE/2, got:false});
  let x=4;
  for(let i=0;i<nDoors;i++){
    // hueco con arco de rayitos para guiar el salto
    const hasPit=Math.random()<0.6;
    if(hasPit){ for(let w=0;w<pitW;w++) plPits.add(x+2+w);
      addRay(x+2,GROUNDR-2); addRay(x+2+Math.floor(pitW/2),GROUNDR-4); addRay(x+1+pitW,GROUNDR-2); }
    const landing=x+2+(hasPit?pitW:0);
    // obstáculo (caja) + rayito encima
    const oc=landing+2;
    if(Math.random()<0.75){ const h=rnd(1,obsH); for(let k=1;k<=h;k++) plObs.add(oc+','+(GROUNDR-k)); addRay(oc,GROUNDR-3); }
    // zona llana con rayitos y posible soldado de chocolate
    const zoneA=oc+2, zoneB=oc+4;
    addRay(zoneA,GROUNDR-1); addRay(zoneB,GROUNDR-1);
    if(Math.random()<enemyP){ plEnemies.push({x:zoneA*TILE, y:GROUNDR*TILE-26, w:22, h:26, dir:1, minX:zoneA*TILE, maxX:(zoneB+1)*TILE, alive:true}); }
    const doorCol=oc+6;
    plDoors.push({col:doorCol, solved:false});
    x=doorCol+2;
  }
  plGoalCol=x+3; plCols=plGoalCol+3;
  addRay(plGoalCol-1,GROUNDR-1);
  rebuildSolids(); plCheckpoint=0;
}
function rebuildSolids(){
  plSolids=new Set(plObs);
  plDoors.forEach(d=>{ if(!d.solved){ for(let r=0;r<GROUNDR;r++) plSolids.add(d.col+','+r); } }); // muro de altura completa (no saltable)
}
function solidAt(c,r){
  if(c<0) return true;
  if(c>=plCols) return false;
  if(r>=GROUNDR) return !plPits.has(c);
  return plSolids.has(c+','+r);
}
function resetPlayer(col){
  const cx = col? (col+1)*TILE : 1.4*TILE;
  plP={x:cx, y:(GROUNDR-3)*TILE, w:20, h:36, vx:0, vy:0, onGround:false, face:1};
}
function startPlatformer(){
  plMaxHearts=3+(state.extraLives||0); plHearts=plMaxHearts; plRayCount=0; buildPlatLevel();
  plQueue=GEN_ARR[curChapter](LEVEL); plQi=0;
  const host=document.getElementById('chGame');
  host.innerHTML=`
    <div class="plat-hud">
      <span class="badge" id="plHearts">❤️❤️❤️</span>
      <span class="badge">${CHAPTERS[curChapter].topic} · ${LEVEL_NAME[LEVEL]}</span>
      <span class="badge" id="plRay">⚡ 0</span>
      <span class="badge" id="plAbil"></span>
      <span class="badge" id="plCom"></span>
      <span class="badge" id="plDoors">🚪 0/${plDoors.length}</span>
    </div>
    <canvas id="plat" width="${VW}" height="${VH}"></canvas>
    <p class="hint center">←/→ para moverte (también en el aire). SALTAR: pulsa ESPACIO; si lo MANTIENES, saltas seguido al aterrizar. Coge rayitos ⚡, esquiva o pisa a los soldados 🟫, abre las 🚪 y llega a la 🏁</p>
    <div class="plat-controls">
      <button class="plat-btn" id="btnL">◀</button>
      <button class="plat-btn" id="btnJ">⤒ SALTAR</button>
      <button class="plat-btn" id="btnR">▶</button>
    </div>
    <div id="doorOverlay"></div>`;
  bindPlatControls();
  resetPlayer(0); plModal=false; PLAT.keys.left=PLAT.keys.right=false; PLAT.jumpHeld=false; PLAT.jumpBuffer=0;
  updatePlatHud();
  PLAT.active=true; cancelAnimationFrame(PLAT.raf); PLAT.raf=requestAnimationFrame(platLoop);
}
function bindPlatControls(){
  const L=document.getElementById('btnL'), R=document.getElementById('btnR'), J=document.getElementById('btnJ');
  const press=(el,on,off)=>{ if(!el)return;
    el.addEventListener('pointerdown',e=>{e.preventDefault();on();});
    ['pointerup','pointerleave','pointercancel'].forEach(ev=>el.addEventListener(ev,e=>{e.preventDefault();off();})); };
  press(L,()=>PLAT.keys.left=true,()=>PLAT.keys.left=false);
  press(R,()=>PLAT.keys.right=true,()=>PLAT.keys.right=false);
  press(J,()=>{ PLAT.jumpHeld=true; PLAT.jumpBuffer=9; },()=>{ PLAT.jumpHeld=false; });
}
function platLoop(){
  if(!PLAT.active) return;
  if(!plModal) platUpdate();
  platRender();
  PLAT.raf=requestAnimationFrame(platLoop);
}
function moveAxis(axis, amt){
  const p=plP;
  if(axis==='x') p.x+=amt; else p.y+=amt;
  const left=Math.floor(p.x/TILE), right=Math.floor((p.x+p.w-1)/TILE);
  const top=Math.floor(p.y/TILE), bottom=Math.floor((p.y+p.h-1)/TILE);
  for(let c=left;c<=right;c++) for(let r=top;r<=bottom;r++){
    if(!solidAt(c,r)) continue;
    if(axis==='x'){ if(amt>0) p.x=c*TILE-p.w; else if(amt<0) p.x=c*TILE+TILE; p.vx=0; }
    else { if(amt>0){ p.y=r*TILE-p.h; p.vy=0; p.onGround=true; } else if(amt<0){ p.y=r*TILE+TILE; p.vy=0; } }
  }
}
function platUpdate(){
  const p=plP;
  const ab=state.equipAbil;
  const mv=(ab==='botas')?MOVE*1.5:MOVE;
  const jv=(ab==='alas')?-12.0:JUMP;
  const gv=(ab==='alas')?0.34:GRAV;
  p.vx=(PLAT.keys.right?mv:0)-(PLAT.keys.left?mv:0);
  if(p.vx>0)p.face=1; else if(p.vx<0)p.face=-1;
  if(p.onGround && (PLAT.jumpHeld || PLAT.jumpBuffer>0)){ p.vy=jv; p.onGround=false; PLAT.jumpBuffer=0; }
  if(PLAT.jumpBuffer>0) PLAT.jumpBuffer--;
  p.vy=Math.min(p.vy+gv, MAXVY);
  moveAxis('x', p.vx);
  p.onGround=false; moveAxis('y', p.vy);
  plCam=Math.max(0, Math.min(p.x+p.w/2-VW/2, plCols*TILE-VW));
  if(plCols*TILE<VW) plCam=0;
  if(p.y>VH+60){ resetPlayer(plCheckpoint); return; }   // caer en un hueco: vuelve al checkpoint
  // soldados de chocolate: patrullan
  const espeed=1.1+(LEVEL==='oro'?0.6:(LEVEL==='plata'?0.3:0));
  plEnemies.forEach(en=>{ if(!en.alive) return; en.x+=en.dir*espeed;
    if(en.x<=en.minX){ en.x=en.minX; en.dir=1; } else if(en.x+en.w>=en.maxX){ en.x=en.maxX-en.w; en.dir=-1; } });
  // colisión con enemigos: pisarlos los derrota; tocarlos de lado te devuelve al checkpoint
  for(const en of plEnemies){ if(!en.alive) continue;
    if(p.x<en.x+en.w && p.x+p.w>en.x && p.y<en.y+en.h && p.y+p.h>en.y){
      if(p.vy>0 && (p.y+p.h)-en.y < 18){ en.alive=false; p.vy=-7; }   // ¡pisotón!
      else if(ab==='escudo'){ /* protegido: no pasa nada */ }
      else { resetPlayer(plCheckpoint); return; }
    }
  }
  // recoger rayitos ⚡ (cada uno = 1 movimiento). Con imán, radio mayor.
  const rr=(ab==='iman')?46:18, rrv=(ab==='iman')?46:20;
  plRayitos.forEach(ry=>{ if(ry.got) return;
    if(Math.abs((p.x+p.w/2)-ry.x)<rr && Math.abs((p.y+p.h/2)-ry.y)<rrv){ ry.got=true; plRayCount++; state.movimientos=(state.movimientos||0)+1; save(); updatePlatHud(); } });
  if(!plModal) checkDoor();
  if(p.x+p.w/2 >= plGoalCol*TILE) platLevelDone();
}
function checkDoor(){
  const p=plP;
  for(const d of plDoors){
    if(d.solved) continue;
    const dx=d.col*TILE;
    if(p.x+p.w >= dx-3 && p.x < dx+TILE && p.y+p.h > (GROUNDR-3)*TILE){ openDoorQuiz(d); break; }
  }
}
function openDoorQuiz(d){
  plModal=true; PLAT.keys.left=PLAT.keys.right=false;
  const q=nextPlatQuestion();
  const ov=document.getElementById('doorOverlay');
  ov.innerHTML=`<div class="door-modal"><div class="door-card panel">
    <h3>🚪 ¡Puerta cerrada con llave!</h3>
    <p class="small">Resuelve el reto para abrirla:</p>
    ${q.draw?`<div id="dvis" style="text-align:center;margin:6px 0"></div>`:''}
    <div class="qbox"><div class="qtext">${q.q}</div></div>
    <div class="row" id="dopts"></div>
    <div class="feedback" id="dfb"></div>
  </div></div>`;
  if(q.draw) q.draw(document.getElementById('dvis'));
  const row=document.getElementById('dopts');
  shuffle(q.options.slice()).forEach(o=>{
    const b=document.createElement('button'); b.className='opt'; b.textContent=o;
    b.onclick=()=>{
      if(String(o)===String(q.answer)){
        b.classList.add('good'); [...row.children].forEach(x=>x.disabled=true);
        state.stars++; save();
        d.solved=true; plDoorsOpen++; rebuildSolids(); updatePlatHud(); plCheckpoint=d.col;
        document.getElementById('dfb').innerHTML=`<span style="color:#7fd048">✔ ${q.fb||'¡Correcto!'} · ¡Puerta abierta! 🔓</span>`;
        setTimeout(()=>{ ov.innerHTML=''; plModal=false; }, 750);
      }else{
        b.classList.add('bad'); b.disabled=true; plHearts--; updatePlatHud();
        const fb=document.getElementById('dfb');
        if(plHearts<=0){ fb.innerHTML='<span style="color:#ff8a7a">💥 ¡Sin vidas! El nivel se reinicia…</span>'; [...row.children].forEach(x=>x.disabled=true); setTimeout(()=>{ ov.innerHTML=''; plModal=false; startPlatformer(); }, 1400); }
        else fb.innerHTML=`<span style="color:#ff8a7a">✘ Casi… te quedan ${plHearts} ${plHearts===1?'vida':'vidas'}. Prueba otra opción.</span>`;
      }
    };
    row.appendChild(b);
  });
  // comodín 50/50 (si tienes)
  if((state.comodines||0)>0){
    const cd=document.createElement('div'); cd.className='center'; cd.style.marginTop='8px';
    const cb=document.createElement('button'); cb.className='btn azul'; cb.style.fontSize='9px';
    cb.textContent=`🃏 Pista 50/50 (x${state.comodines})`;
    cb.onclick=()=>{
      if((state.comodines||0)<=0) return;
      state.comodines--; save(); updatePlatHud();
      const wrong=[...row.children].filter(x=>!x.disabled && x.textContent!==String(q.answer));
      shuffle(wrong).slice(0,2).forEach(x=>{ x.disabled=true; x.style.opacity='.3'; });
      cb.disabled=true; cb.textContent='🃏 Pista usada';
    };
    document.querySelector('.door-card').appendChild(cd); cd.appendChild(cb);
  }
}
function platLevelDone(){ PLAT.active=false; cancelAnimationFrame(PLAT.raf); completeChapter(); }
function updatePlatHud(){
  const h=document.getElementById('plHearts'); if(h) h.textContent='❤️'.repeat(Math.max(0,plHearts))+'🖤'.repeat(Math.max(0,plMaxHearts-plHearts));
  const d=document.getElementById('plDoors'); if(d) d.textContent=`🚪 ${plDoorsOpen}/${plDoors.length}`;
  const ry=document.getElementById('plRay'); if(ry) ry.textContent=`⚡ ${plRayCount}`;
  const ab=document.getElementById('plAbil'); if(ab) ab.textContent = state.equipAbil&&ABILITIES[state.equipAbil]? ABILITIES[state.equipAbil].emoji+' '+ABILITIES[state.equipAbil].name.split(' ')[0] : '';
  const cm=document.getElementById('plCom'); if(cm) cm.textContent = (state.comodines||0)>0? `🃏 ${state.comodines}` : '';
}
// soldado de ajedrez de chocolate (peón marrón oscuro)
function drawChoco(ctx,X,Y,w,h){
  ctx.fillStyle='#3a2616';                       // chocolate oscuro
  ctx.fillRect(X+2,Y+h-7,w-4,7);                 // base
  ctx.fillRect(X+5,Y+h-15,w-10,9);               // cuello base
  ctx.fillRect(X+4,Y+9,w-8,h-17);                // cuerpo
  ctx.beginPath(); ctx.arc(X+w/2,Y+9,7,0,7); ctx.fill();   // cabeza
  ctx.fillStyle='#5a3a22'; ctx.fillRect(X+6,Y+11,3,h-22);  // brillo
  ctx.fillStyle='#241208'; ctx.fillRect(X+4,Y+15,w-8,3);   // collar
  ctx.fillStyle='#ffe0d0'; ctx.fillRect(X+w/2-4,Y+7,2,2); ctx.fillRect(X+w/2+2,Y+7,2,2); // ojos
  ctx.fillStyle='#c0392b'; ctx.fillRect(X+w/2-4,Y+7,1,1); ctx.fillRect(X+w/2+3,Y+7,1,1); // pupilas rojas
}
function platRender(){
  const cv=document.getElementById('plat'); if(!cv){ PLAT.active=false; return; } const ctx=cv.getContext('2d');
  const TH=platTheme();
  const g=ctx.createLinearGradient(0,0,0,VH); g.addColorStop(0,TH.sky[0]); g.addColorStop(1,TH.sky[1]); ctx.fillStyle=g; ctx.fillRect(0,0,VW,VH);
  if(TH.night){ // estrellas
    for(let i=0;i<40;i++){ const sxp=((i*137 - plCam*0.3)%(VW+40)+VW+40)%(VW+40)-20; const syp=(i*53)%180+8; ctx.fillStyle=i%5? 'rgba(255,255,255,.85)':'rgba(255,240,180,.9)'; ctx.fillRect(sxp,syp,2,2); }
  }else{ // nubes
    ctx.fillStyle='rgba(255,255,255,.8)';
    for(let i=0;i<4;i++){ const cxp=((i*220 - plCam*0.4)%(VW+220)+VW+220)%(VW+220)-110; ctx.beginPath(); ctx.arc(cxp,60+(i%2)*30,16,0,7); ctx.arc(cxp+18,60+(i%2)*30,20,0,7); ctx.arc(cxp+38,60+(i%2)*30,16,0,7); ctx.fill(); }
  }
  // props de fondo del escenario (parallax)
  ctx.textAlign='center'; ctx.textBaseline='alphabetic';
  for(let c=3;c<plCols;c+=6){ const emoji=TH.bg[(c/3|0)%TH.bg.length]; const X=c*TILE-plCam*0.6; if(X<-50||X>VW+50) continue; ctx.font=Math.floor(TILE*1.6)+'px serif'; ctx.fillText(emoji, X, GROUNDR*TILE-1); }
  // suelo
  const c0=Math.floor(plCam/TILE), c1=c0+Math.ceil(VW/TILE)+1;
  for(let c=c0;c<=c1;c++){
    if(c<0||c>=plCols||plPits.has(c)) continue;
    for(let r=GROUNDR;r<ROWS;r++){
      const X=c*TILE-plCam, Y=r*TILE;
      ctx.fillStyle=(r===GROUNDR)?TH.top:TH.body; ctx.fillRect(X,Y,TILE,TILE);
      if(r===GROUNDR){ ctx.fillStyle=TH.stripe; ctx.fillRect(X,Y,TILE,6); }
      ctx.strokeStyle='rgba(0,0,0,.08)'; ctx.strokeRect(X,Y,TILE,TILE);
    }
  }
  // obstáculos (cajas según escenario)
  plObs.forEach(s=>{ const [c,r]=s.split(',').map(Number); const X=c*TILE-plCam,Y=r*TILE; if(X<-TILE||X>VW) return;
    ctx.fillStyle=TH.crate[0]; ctx.fillRect(X,Y,TILE,TILE); ctx.fillStyle=TH.crate[1]; ctx.fillRect(X+3,Y+3,TILE-6,TILE-6); ctx.strokeStyle='#3a2a18'; ctx.lineWidth=2; ctx.strokeRect(X,Y,TILE,TILE); });
  // puertas
  ctx.textAlign='center'; ctx.textBaseline='middle';
  plDoors.forEach(d=>{ const X=d.col*TILE-plCam; if(X<-TILE||X>VW) return;
    const Yt=(GROUNDR-3)*TILE, H=3*TILE;
    if(d.solved){ ctx.fillStyle='rgba(40,30,20,.20)'; ctx.fillRect(X+6,Yt,TILE-12,H); }
    else{
      // muro de altura completa
      ctx.fillStyle=TH.crate[0]; ctx.fillRect(X,0,TILE,GROUNDR*TILE);
      ctx.strokeStyle='rgba(0,0,0,.15)'; ctx.lineWidth=1; for(let yy=0;yy<GROUNDR;yy++) ctx.strokeRect(X,yy*TILE,TILE,TILE);
      // portón en la parte baja
      ctx.fillStyle='#7a4a1d'; ctx.fillRect(X+3,Yt,TILE-6,H); ctx.fillStyle='#9a6a30'; ctx.fillRect(X+6,Yt+4,TILE-12,H-8);
      ctx.fillStyle='#e8b84b'; ctx.beginPath(); ctx.arc(X+TILE-9,Yt+H/2,3,0,7); ctx.fill();
      ctx.font='16px serif'; ctx.fillText('🔒',X+TILE/2,Yt+18);
    }
  });
  // meta
  { const X=plGoalCol*TILE-plCam; if(X>-TILE&&X<VW+TILE){ ctx.font='30px serif'; ctx.textBaseline='alphabetic'; ctx.fillText('🏁',X+TILE/2,GROUNDR*TILE-2); ctx.textBaseline='middle'; } }
  // rayitos ⚡
  ctx.textAlign='center'; ctx.textBaseline='middle';
  plRayitos.forEach(ry=>{ if(ry.got) return; const X=ry.x-plCam; if(X<-20||X>VW+20) return; ctx.font=Math.floor(TILE*0.7)+'px serif'; ctx.fillText('⚡',X,ry.y); });
  // soldados de chocolate
  plEnemies.forEach(en=>{ if(!en.alive) return; const X=en.x-plCam; if(X<-TILE||X>VW) return; drawChoco(ctx,X,en.y,en.w,en.h); });
  // jugador (sprite del guardián)
  const sx=plP.x-plCam, sy=plP.y, s=2, ox=Math.round(sx-(16*s-plP.w)/2), oy=Math.round(sy+plP.h-20*s);
  if(plP.face<0){ ctx.save(); ctx.translate(ox+16*s,0); ctx.scale(-1,1); drawGuardian(ctx,platPiece(),0,oy,s); ctx.restore(); }
  else drawGuardian(ctx,platPiece(),ox,oy,s);
  // accesorio estético equipado
  if(state.equip && COSMETICS[state.equip]){ ctx.font=Math.floor(TILE*0.55)+'px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(COSMETICS[state.equip].emoji, sx+plP.w/2, oy+s*5); }
}
// teclado (una sola vez); solo actúa con el plataformas activo
window.addEventListener('keydown',e=>{
  if(!PLAT.active) return;
  const k=e.key;
  if(['ArrowLeft','ArrowRight','ArrowUp',' ','w','a','d'].includes(k)) e.preventDefault();
  if(k==='ArrowLeft'||k==='a') PLAT.keys.left=true;
  else if(k==='ArrowRight'||k==='d') PLAT.keys.right=true;
  else if(k==='ArrowUp'||k===' '||k==='w'){ PLAT.jumpHeld=true; PLAT.jumpBuffer=9; }
});
window.addEventListener('keyup',e=>{
  const k=e.key;
  if(k==='ArrowLeft'||k==='a') PLAT.keys.left=false;
  else if(k==='ArrowRight'||k==='d') PLAT.keys.right=false;
  else if(k==='ArrowUp'||k===' '||k==='w') PLAT.jumpHeld=false;
});

/* =========================================================
   TIENDA DEL REINO (gastar rayitos / movimientos)
========================================================= */
function openShop(){
  let ov=document.getElementById('__shopOverlay');
  if(!ov){ ov=document.createElement('div'); ov.id='__shopOverlay'; ov.className='shop-modal'; document.body.appendChild(ov); }
  renderShop();
}
function closeShop(){ const o=document.getElementById('__shopOverlay'); if(o) o.remove(); updateHud(); }
function reShop(){ if(document.getElementById('__shopOverlay')) renderShop(); }
function buyMov(cost){ if((state.movimientos||0)>=cost){ state.movimientos-=cost; save(); return true; } return false; }
function buyLife(){ if((state.extraLives||0)<LIFE_MAX && buyMov(LIFE_PRICE)){ state.extraLives=(state.extraLives||0)+1; save(); } reShop(); }
function buyAbility(id){ const it=ABILITIES[id]; if(it && !state.abilities[id] && buyMov(it.price)){ state.abilities[id]=true; state.equipAbil=id; save(); } reShop(); }
function equipAbility(id){ state.equipAbil=(state.equipAbil===id)?null:id; save(); reShop(); }
function buyCosmetic(id){ const it=COSMETICS[id]; if(it && !state.cosmetics[id] && buyMov(it.price)){ state.cosmetics[id]=true; state.equip=id; save(); } reShop(); }
function equipCosmetic(id){ state.equip=(state.equip===id)?null:id; save(); reShop(); }
function buyComodin(){ if(buyMov(COMODIN_PRICE)){ state.comodines=(state.comodines||0)+1; save(); } reShop(); }
function buyCollectible(id){ const it=COLLECTIBLES[id]; if(it && !state.collectibles[id] && buyMov(it.price)){ state.collectibles[id]=true; save(); } reShop(); }
function renderShop(){
  const ov=document.getElementById('__shopOverlay'); if(!ov) return;
  const bal=state.movimientos||0; const ok=c=>bal>=c;
  let h=`<div class="panel shop-card">
    <button class="btn azul" style="float:right;margin:0" onclick="closeShop()">✕</button>
    <h1>🛒 Tienda del Reino</h1>
    <p style="color:var(--oro);text-align:center">Tienes ⚡ <b>${bal}</b> movimientos · ¡los precios son altos, cuesta conseguirlos!</p>`;
  // HABILIDADES
  h+=`<h3>🧰 Habilidades (solo 1 equipada)</h3><div class="shop-grid">`;
  for(const id in ABILITIES){ const it=ABILITIES[id], have=state.abilities[id];
    h+=`<div class="shop-item"><div class="si-emoji">${it.emoji}</div><div class="small"><b>${it.name}</b></div><div class="si-desc">${it.desc}</div>`;
    if(!have) h+=`<button class="btn ${ok(it.price)?'oro':''}" ${ok(it.price)?'':'disabled'} onclick="buyAbility('${id}')">Comprar ⚡ ${it.price}</button>`;
    else h+=`<button class="btn ${state.equipAbil===id?'':'azul'}" onclick="equipAbility('${id}')">${state.equipAbil===id?'✔ Equipada':'Equipar'}</button>`;
    h+=`</div>`;
  }
  // COMODINES
  h+=`</div><h3>🃏 Comodines (pistas)</h3><div class="shop-grid">
      <div class="shop-item"><div class="si-emoji">🃏</div><div class="small"><b>Pista 50/50</b></div>
        <div class="si-desc">${COMODIN_DESC}</div><div class="small">Tienes: ${state.comodines||0}</div>
        <button class="btn ${ok(COMODIN_PRICE)?'oro':''}" ${ok(COMODIN_PRICE)?'':'disabled'} onclick="buyComodin()">Comprar ⚡ ${COMODIN_PRICE}</button>
      </div></div>`;
  // VIDAS
  h+=`<h3>❤️ Vidas extra</h3><div class="shop-grid">`;
  const ev=state.extraLives||0;
  h+=`<div class="shop-item"><div class="si-emoji">❤️</div><div class="small"><b>Vida extra</b></div>
      <div class="si-desc">Empiezas cada nivel con un corazón más (máx. ${LIFE_MAX}).</div>`;
  if(ev>=LIFE_MAX) h+=`<div class="small" style="color:#7fd048">✔ Máximo (${ev}/${LIFE_MAX})</div>`;
  else h+=`<div class="small">Tienes: ${ev}/${LIFE_MAX}</div><button class="btn ${ok(LIFE_PRICE)?'oro':''}" ${ok(LIFE_PRICE)?'':'disabled'} onclick="buyLife()">Comprar ⚡ ${LIFE_PRICE}</button>`;
  h+=`</div></div>`;
  // ACCESORIOS
  h+=`<h3>🎩 Accesorios (decorativos)</h3><div class="shop-grid">`;
  for(const id in COSMETICS){ const it=COSMETICS[id], have=state.cosmetics[id];
    h+=`<div class="shop-item"><div class="si-emoji">${it.emoji}</div><div class="small"><b>${it.name}</b></div><div class="si-desc">${it.desc}</div>`;
    if(!have) h+=`<button class="btn ${ok(it.price)?'oro':''}" ${ok(it.price)?'':'disabled'} onclick="buyCosmetic('${id}')">Comprar ⚡ ${it.price}</button>`;
    else h+=`<button class="btn ${state.equip===id?'':'azul'}" onclick="equipCosmetic('${id}')">${state.equip===id?'✔ Puesto':'Poner'}</button>`;
    h+=`</div>`;
  }
  // COLECCIONABLES
  h+=`</div><h3>🏆 Coleccionables</h3><div class="shop-grid">`;
  for(const id in COLLECTIBLES){ const it=COLLECTIBLES[id], have=state.collectibles[id];
    h+=`<div class="shop-item"><div class="si-emoji">${it.emoji}</div><div class="small"><b>${it.name}</b></div><div class="si-desc">${it.desc}</div>`;
    if(!have) h+=`<button class="btn ${ok(it.price)?'oro':''}" ${ok(it.price)?'':'disabled'} onclick="buyCollectible('${id}')">Comprar ⚡ ${it.price}</button>`;
    else h+=`<div class="small" style="color:#7fd048">✔ Conseguido</div>`;
    h+=`</div>`;
  }
  h+=`</div><div class="center" style="margin-top:12px">
        <button class="btn azul" onclick="closeShop()">◀ Volver</button>
        ${state.equipAbil?`<button class="btn rojo" onclick="equipAbility(state.equipAbil)">Quitar habilidad</button>`:''}
        ${state.equip?`<button class="btn rojo" onclick="equipCosmetic(state.equip)">Quitar accesorio</button>`:''}
      </div></div>`;
  ov.innerHTML=h;
}
