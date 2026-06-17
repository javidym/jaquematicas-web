/* =========================================================
   AJEDREZ MATEMÁTICO DEL REINO DE VAINILLA — Motor
   · Cruza el tablero: acierta una prueba para avanzar 1 casilla.
   · MODE='full'   -> los 8 niveles seguidos + victoria
   · MODE='single' -> un único nivel (para cada SDA)
========================================================= */
let MODE='full';
let DIFF='plata';                 // bronce | plata | oro
const DIFF_NAME={bronce:'🥉 Bronce',plata:'🥈 Plata',oro:'🥇 Oro'};

/* ---------- utilidades ---------- */
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>a.slice().sort(()=>Math.random()-.5);
function optsFrom(correct,cands){
  const cs=String(correct); const set=new Set([cs]); const out=[cs];
  for(const c of cands){ const s=String(c); if(s!=='NaN'&&s!==''&&!set.has(s)){set.add(s);out.push(s);} if(out.length>=4)break; }
  return shuffle(out);
}
function show(id){ document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); const e=document.getElementById(id); if(e)e.classList.add('active'); window.scrollTo(0,0); }

/* ---------- sprites pixel art ---------- */
function px(ctx,x,y,w,h,c){ ctx.fillStyle=c; ctx.fillRect(x,y,w,h); }
function drawGuardian(ctx,type,ox,oy,s){
  const P=(cx,cy,c,w=1,h=1)=>px(ctx,ox+cx*s,oy+cy*s,w*s,h*s,c);
  const OUT="#241810",CREMA="#f3dca6",CREMA2="#dcc185",SKIN="#f1c79b",SKIN2="#d9a878";
  function pedestal(){
    P(4,12,CREMA,8,1);P(3,13,CREMA,10,1);P(3,14,CREMA,10,1);P(2,15,CREMA,12,1);P(2,16,CREMA,12,1);
    P(1,17,CREMA,14,1);P(1,18,CREMA,14,1);P(2,19,CREMA2,12,1);
    P(3,13,CREMA2,1,6);P(12,13,CREMA2,1,6);P(2,19,OUT,12,1);P(0,17,OUT,1,2);P(15,17,OUT,1,2);
  }
  if(type==="rabal"){const MANE="#e0701f",MANE2="#b8531a";pedestal();
    P(7,3,CREMA,5,1);P(6,4,CREMA,7,1);P(5,5,CREMA,8,1);P(5,6,CREMA,8,1);P(5,7,CREMA,8,1);P(6,8,CREMA,7,1);
    P(6,9,CREMA,7,1);P(6,10,CREMA,6,1);P(6,11,CREMA,7,1);P(11,7,CREMA,3,1);P(12,8,CREMA,2,1);P(13,8,SKIN2,1,1);
    P(7,2,CREMA,1,1);P(10,2,CREMA,1,1);P(4,2,MANE,3,1);P(3,3,MANE,3,2);P(3,5,MANE2,2,3);P(4,8,MANE,2,2);
    P(6,1,MANE,4,1);P(5,2,MANE,2,1);P(8,5,"#111",4,2);P(8,5,"#333",1,1);P(11,5,"#333",1,1);P(5,4,OUT,1,4);P(13,8,OUT,1,1);return;}
  if(type==="reypi"){const ROBE="#e8b84b",ROBE2="#b8862c",BEARD="#f3ead2",GOLD="#ffd95a";pedestal();
    P(6,1,GOLD,1,1);P(8,0,GOLD,1,1);P(10,1,GOLD,1,1);P(5,2,GOLD,7,1);P(8,1,"#fff",1,1);
    P(6,3,SKIN,5,1);P(6,4,SKIN,5,2);P(7,4,"#000",1,1);P(9,4,"#000",1,1);P(6,6,BEARD,5,1);P(7,7,BEARD,3,2);
    P(5,9,ROBE,7,1);P(4,10,ROBE,9,2);P(5,12,ROBE2,7,1);P(8,10,"#fff",1,2);return;}
  pedestal();
  P(6,3,SKIN,5,1);P(5,4,SKIN,7,1);P(5,5,SKIN,7,1);P(6,6,SKIN,5,1);P(7,7,SKIN,3,1);
  P(6,5,"#fff",2,1);P(9,5,"#fff",2,1);P(7,5,"#1a1a1a",1,1);P(10,5,"#1a1a1a",1,1);P(8,6,SKIN2,1,1);
  let cloth="#cccccc";
  if(type==="vinalopop")cloth="#e6d8b0"; if(type==="alcudia")cloth="#2e6a9e";
  if(type==="glorieta")cloth="#7a2f4f"; if(type==="alfin")cloth="#b9b9b9";
  P(5,8,cloth,7,1);P(4,9,cloth,9,1);P(4,10,cloth,9,1);P(5,11,cloth,7,1);
  P(3,9,cloth,1,2);P(12,9,cloth,1,2);P(3,11,SKIN,1,1);P(12,11,SKIN,1,1);
  if(type==="vinalopop"){const B="#b89a68";P(5,2,B,7,2);P(6,1,B,5,1);P(5,4,B,1,1);P(11,4,B,1,1);P(5,3,"#a3875a",7,1);P(3,8,"#8a6a3a",1,3);P(12,8,"#8a6a3a",1,3);P(8,9,"#1c140c",1,2);}
  if(type==="alcudia"){const H="#f2c84b";P(4,4,H,2,4);P(11,4,H,2,4);P(5,7,H,1,2);P(11,7,H,1,2);P(5,0,"#d9b84a",7,1);P(5,1,"#d9b84a",7,1);P(5,0,"#241810",1,1);P(7,0,"#241810",1,1);P(9,0,"#241810",1,1);P(11,0,"#241810",1,1);P(3,8,"#1d486e",1,4);P(12,8,"#1d486e",1,4);}
  if(type==="glorieta"){const H="#4a3526";P(4,3,H,3,5);P(10,3,H,3,5);P(5,2,H,7,1);P(4,8,H,1,2);P(12,8,H,1,2);P(6,3,H,5,1);P(5,3,"#c0392b",7,1);P(11,10,"#2e7d32",2,2);P(11,10,"#fff",1,1);}
  if(type==="alfin"){const H="#1a1a1a";P(4,3,H,9,2);P(5,5,H,1,1);P(11,5,H,1,1);P(7,1,H,3,2);P(6,5,"#241810",2,1);P(9,5,"#241810",2,1);P(8,5,"#241810",1,1);P(7,9,"#5a8f3c",3,1);P(6,10,"#5a8f3c",1,1);P(10,10,"#5a8f3c",1,1);}
}

/* ---------- visuales (reloj / figura) ---------- */
function clockCanvas(h,m){
  const c=document.createElement('canvas');c.width=120;c.height=120;
  c.style.width='120px';c.style.height='120px';c.style.background='#f5e7c4';c.style.border='4px solid #b8862c';c.style.borderRadius='50%';
  const x=c.getContext('2d');const cx=60,cy=60,R=50;
  x.strokeStyle="#3a2a10";x.fillStyle="#3a2a10";
  for(let i=0;i<12;i++){const a=i*Math.PI/6;x.beginPath();x.arc(cx+Math.sin(a)*R*0.85,cy-Math.cos(a)*R*0.85,2.5,0,7);x.fill();}
  const ah=(h%12)*Math.PI/6+m*Math.PI/360;x.lineWidth=5;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.sin(ah)*26,cy-Math.cos(ah)*26);x.stroke();
  const am=m*Math.PI/30;x.lineWidth=3;x.strokeStyle="#c0392b";x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.sin(am)*40,cy-Math.cos(am)*40);x.stroke();
  x.fillStyle="#c0392b";x.beginPath();x.arc(cx,cy,4,0,7);x.fill();
  return c;
}
function shapeCanvas(kind){
  const c=document.createElement('canvas');c.width=120;c.height=120;c.style.background='#f5e7c4';c.style.border='3px solid #b8862c';c.style.borderRadius='6px';
  const x=c.getContext('2d');x.fillStyle="#2e6a9e";x.strokeStyle="#1c140c";x.lineWidth=4;x.beginPath();const cc=60;
  if(kind==='tri'){x.moveTo(60,18);x.lineTo(104,100);x.lineTo(16,100);x.closePath();}
  else if(kind==='cuad'){x.rect(28,28,64,64);}
  else if(kind==='rect'){x.rect(16,40,88,40);}
  else if(kind==='circ'){x.arc(cc,cc,44,0,7);}
  else if(kind==='penta'){for(let i=0;i<5;i++){const a=i*2*Math.PI/5-Math.PI/2;const px0=cc+Math.cos(a)*44,py=cc+Math.sin(a)*44;i?x.lineTo(px0,py):x.moveTo(px0,py);}x.closePath();}
  else if(kind==='hexa'){for(let i=0;i<6;i++){const a=i*2*Math.PI/6;const px0=cc+Math.cos(a)*44,py=cc+Math.sin(a)*44;i?x.lineTo(px0,py):x.moveTo(px0,py);}x.closePath();}
  x.fill();x.stroke();return c;
}

/* ---------- generadores (escalan con DIFF, al azar) ---------- */
function genOps(){
  const L=DIFF, t=pick(['mul','div','add','sub']);
  if(t==='mul'){
    let a,b;
    if(L==='bronce'){a=rnd(2,9);b=rnd(2,9);}
    else if(L==='plata'){a=rnd(12,30);b=rnd(2,9);}
    else{ if(Math.random()<.5){a=rnd(101,299);b=rnd(2,9);} else {a=rnd(11,25);b=rnd(11,19);} }
    const c=a*b; return {q:`➗ ${a} × ${b} = ?`,answer:c,fb:`${a}×${b}=${c}`,options:optsFrom(c,[c+a,c-b,c+10,c-10,c+b].filter(v=>v>0))};
  }
  if(t==='div'){
    let b,q;
    if(L==='bronce'){b=rnd(2,9);q=rnd(2,9);}
    else if(L==='plata'){b=rnd(3,9);q=rnd(6,15);}
    else{b=rnd(4,12);q=rnd(10,30);}
    const a=b*q; return {q:`➗ ${a} ÷ ${b} = ?`,answer:q,fb:`${a}÷${b}=${q}`,options:optsFrom(q,[q+1,q-1,q+2,q-2,q+5].filter(v=>v>0))};
  }
  let a,b;
  if(L==='bronce'){a=rnd(15,80);b=rnd(10,40);}
  else if(L==='plata'){a=rnd(100,400);b=rnd(50,200);}
  else{a=rnd(300,900);b=rnd(100,500);}
  if(t==='add'){const c=a+b;return {q:`➗ ${a} + ${b} = ?`,answer:c,fb:`= ${c}`,options:optsFrom(c,[c+10,c-10,c+1,c-2,c+100].filter(v=>v>0))};}
  if(a<b){const z=a;a=b;b=z;} const c=a-b; return {q:`➗ ${a} − ${b} = ?`,answer:c,fb:`= ${c}`,options:optsFrom(c,[c+10,c-10,c+1,c-2,c+100].filter(v=>v>0))};
}
function genDec(){
  const L=DIFF, r2=n=>Math.round(n*100)/100, fmt=n=>Number(n.toFixed(2)).toString().replace('.',',');
  const t=pick(L==='oro'?['add','sub','x10','x100']:['add','sub','x10']);
  if(t==='add'){
    let a,b;
    if(L==='bronce'){a=rnd(3,20)/10;b=rnd(1,9)/10;}
    else if(L==='plata'){a=rnd(10,90)/10;b=rnd(5,40)/10;}
    else{a=rnd(120,900)/100;b=rnd(25,400)/100;}
    const c=r2(a+b);return {q:`🔢 ${fmt(a)} + ${fmt(b)} = ?`,answer:fmt(c),fb:`= ${fmt(c)}`,options:optsFrom(fmt(c),[fmt(r2(c+0.1)),fmt(r2(c-0.1)),fmt(r2(c+1)),fmt(r2(c-0.2))])};
  }
  if(t==='sub'){
    let a,b;
    if(L==='bronce'){a=rnd(10,25)/10;b=rnd(1,9)/10;}
    else if(L==='plata'){a=rnd(20,95)/10;b=rnd(5,40)/10;}
    else{a=rnd(150,900)/100;b=rnd(25,400)/100;}
    if(a<b){const z=a;a=b;b=z;} const c=r2(a-b);
    return {q:`🔢 ${fmt(a)} − ${fmt(b)} = ?`,answer:fmt(c),fb:`= ${fmt(c)}`,options:optsFrom(fmt(c),[fmt(r2(c+0.1)),fmt(r2(c-0.1)),fmt(r2(c+0.2)),fmt(r2(c+1))])};
  }
  if(t==='x100'){const a=rnd(105,950)/100,c=r2(a*100);return {q:`🔢 ${fmt(a)} × 100 = ?`,answer:fmt(c),fb:`Al ×100: ${fmt(c)}`,options:optsFrom(fmt(c),[fmt(r2(a*10)),fmt(r2(a*1000)),fmt(r2(c+10))])};}
  const a=(L==='bronce'?rnd(12,49)/10:rnd(105,250)/100),c=r2(a*10);
  return {q:`🔢 ${fmt(a)} × 10 = ?`,answer:fmt(c),fb:`Al ×10: ${fmt(c)}`,options:optsFrom(fmt(c),[fmt(a),fmt(r2(c+1)),fmt(r2(c-1))])};
}
function genMoney(){
  const L=DIFF, fmt=n=>Number(n.toFixed(2)).toString().replace('.',',');
  const base=L==='bronce'?1:(L==='plata'?2:5);
  const t=pick(['change','cents','sum']);
  if(t==='change'){
    const step=L==='oro'?0.05:0.10; const units=Math.round(base/step);
    const cost=Math.round(rnd(1,units-1)*step*100)/100; const ch=Math.round((base-cost)*100)/100;
    return {q:`🪙 Pagas ${base}€ por algo de ${fmt(cost)} €. ¿Cuánto te devuelven?`,answer:fmt(ch)+' €',fb:`${base} − ${fmt(cost)} = ${fmt(ch)} €`,
      options:optsFrom(fmt(ch)+' €',[fmt(Math.round((base-cost+0.1)*100)/100)+' €',fmt(cost)+' €',fmt(Math.round((base-cost-0.1)*100)/100)+' €'])};
  }
  if(t==='cents'){
    const e=(L==='oro'?rnd(1,19)*0.05:rnd(1,9)*0.1); const ev=Math.round(e*100)/100; const cents=Math.round(ev*100);
    return {q:`🪙 ¿Cuántos céntimos son ${fmt(ev)} €?`,answer:cents+' c',fb:`${fmt(ev)} € = ${cents} céntimos`,options:optsFrom(cents+' c',[(cents+10)+' c',(cents-5>0?cents-5:cents+5)+' c',(cents*10)+' c'])};
  }
  const coin=L==='bronce'?0.5:(L==='plata'?0.2:0.05); const lbl=L==='bronce'?'50 céntimos':(L==='plata'?'20 céntimos':'5 céntimos');
  const n=rnd(3,L==='oro'?9:5); const tot=Math.round(n*coin*100)/100;
  return {q:`🪙 ¿Cuánto valen ${n} monedas de ${lbl}?`,answer:fmt(tot)+' €',fb:`${n} × ${fmt(coin)} = ${fmt(tot)} €`,options:optsFrom(fmt(tot)+' €',[fmt(Math.round((tot+coin)*100)/100)+' €',fmt(Math.round((tot-coin)*100)/100)+' €',n+' €'])};
}
function genFrac(){
  const L=DIFF; const dens=L==='bronce'?[2,3,4]:(L==='plata'?[2,3,4,5,6]:[3,4,5,6,8,10]);
  const d=pick(dens);
  const t=pick(L==='bronce'?['complete','compare','half']:(L==='plata'?['complete','compare','sum']:['complete','compare','sum','sub']));
  const fracOpts=(num,dd)=>{ const set=new Set([`${num}/${dd}`]); const out=[`${num}/${dd}`];
    [num+1,num-1,num+2,dd-num,1].forEach(k=>{if(k>0&&k<=dd){const s=`${k}/${dd}`;if(!set.has(s)){set.add(s);out.push(s);}}});
    let e=1; while(out.length<4){const k=((num+e-1)%dd)+1;const s=`${k}/${dd}`;if(!set.has(s)){set.add(s);out.push(s);}e++;if(e>30)break;}
    return shuffle(out.slice(0,4)); };
  if(t==='half') return {q:`🍰 ¿Qué fracción es la MITAD de un entero?`,answer:`1/2`,fb:`La mitad = 1/2`,options:['1/2','1/3','2/2','1/4']};
  if(t==='complete'){const a=rnd(1,d-1),r=d-a;return {q:`🍰 ${a}/${d} + ? = 1 entero`,answer:`${r}/${d}`,fb:`${a}/${d} + ${r}/${d} = 1`,options:fracOpts(r,d)};}
  if(t==='sum'){const a=rnd(1,d-1),b=rnd(1,d-a),c=a+b;return {q:`🍰 ${a}/${d} + ${b}/${d} = ?`,answer:`${c}/${d}`,fb:`${a}+${b}=${c} → ${c}/${d}`,options:fracOpts(c,d)};}
  if(t==='sub'){let a=rnd(2,d),b=rnd(1,a-1);const c=a-b;return {q:`🍰 ${a}/${d} − ${b}/${d} = ?`,answer:`${c}/${d}`,fb:`${a}−${b}=${c} → ${c}/${d}`,options:fracOpts(c,d)};}
  const dc=d<3?3:d;let x=rnd(1,dc-1),y;do{y=rnd(1,dc-1);}while(y===x);const big=Math.max(x,y),sm=Math.min(x,y);
  return {q:`🍰 ¿Qué fracción es MAYOR?`,answer:`${big}/${dc}`,fb:`Gana el mayor numerador`,options:optsFrom(`${big}/${dc}`,[`${sm}/${dc}`,`1/${dc}`,`${Math.max(1,big-1)}/${dc}`])};
}
function genMeasure(){
  const L=DIFF;
  if(L==='bronce'){
    const opt=pick([['📏 1 metro = ? centímetros','100 cm',['10 cm','1000 cm','50 cm']],['📏 1 km = ? metros','1000 m',['100 m','10 m','500 m']],['📏 1 cm = ? mm','10 mm',['100 mm','5 mm','1 mm']],['💧 1 litro = ? ml','1000 ml',['100 ml','10 ml','500 ml']],['⚖️ 1 kilo = ? gramos','1000 g',['100 g','10 g','500 g']]]);
    return {q:opt[0],answer:opt[1],fb:opt[1],options:optsFrom(opt[1],opt[2])};
  }
  if(L==='plata'){
    const [big,small,f]=pick([['m','cm',100],['km','m',1000],['L','ml',1000],['kg','g',1000],['cm','mm',10]]);
    const v=rnd(2,9), c=v*f;
    return {q:`📏 ${v} ${big} = ? ${small}`,answer:`${c} ${small}`,fb:`${v} ${big} = ${c} ${small}`,options:optsFrom(`${c} ${small}`,[`${c*10} ${small}`,`${Math.round(c/10)} ${small}`,`${c+f} ${small}`])};
  }
  const [big,small,f]=pick([['km','m',1000],['m','cm',100],['L','ml',1000],['kg','g',1000]]);
  if(Math.random()<.5){ const v=rnd(11,49)/10, c=Math.round(v*f);
    return {q:`📏 ${String(v).replace('.',',')} ${big} = ? ${small}`,answer:`${c} ${small}`,fb:`${String(v).replace('.',',')} ${big} = ${c} ${small}`,options:optsFrom(`${c} ${small}`,[`${c*10} ${small}`,`${Math.round(c/10)} ${small}`,`${c+f} ${small}`])}; }
  const c=rnd(2,9), v=c*f;
  return {q:`📏 ${v} ${small} = ? ${big}`,answer:`${c} ${big}`,fb:`${v} ${small} = ${c} ${big}`,options:optsFrom(`${c} ${big}`,[`${c*10} ${big}`,`${c+1} ${big}`,`${Math.round(c/10)||1} ${big}`])};
}
function genTime(){
  const L=DIFF, pad=n=>String(n).padStart(2,'0'), ft=(H,M)=>`${H}:${pad(M)}`;
  const t=pick(L==='bronce'?['clock','clock','conv']:(L==='plata'?['clock5','interval','conv']:['clockAny','interval','convHard']));
  if(t==='clock'||t==='clock5'||t==='clockAny'){
    const h=rnd(1,12); const m=t==='clock'?pick([0,30]):(t==='clock5'?pick([0,5,10,15,20,25,30,35,40,45,50,55]):rnd(0,59));
    const correct=ft(h,m); const w=[ft(h%12+1,m),ft(h,(m+15)%60),ft(h,(m+30)%60)];
    return {q:`⏰ ¿Qué hora marca el reloj?`,answer:correct,fb:`Son las ${correct}`,options:optsFrom(correct,w),draw:el=>el.appendChild(clockCanvas(h,m))};
  }
  if(t==='interval'){
    const h=rnd(1,9),m1=pick([0,10,15,20,30]); const dur=L==='oro'?pick([35,55,70,75,90]):pick([15,30,45,60]);
    let tot=h*60+m1+dur,h2=Math.floor(tot/60),m2=tot%60; if(h2>12)h2-=12;
    return {q:`⏱️ ¿Cuánto pasa de las ${ft(h,m1)} a las ${ft(h2,m2)}?`,answer:`${dur} min`,fb:`Pasan ${dur} minutos`,options:optsFrom(`${dur} min`,[`${dur+10} min`,`${dur-10} min`,`${dur+15} min`].filter(s=>parseInt(s)>0))};
  }
  if(t==='convHard'){
    const opt=pick([['90 minutos = ?','1 h y 30 min',['1 h y 15 min','2 h','1 h y 45 min']],['1 día = ? horas','24 h',['12 h','48 h','20 h']],['1 minuto = ? segundos','60 s',['100 s','30 s','120 s']],['180 minutos = ? horas','3 h',['2 h','4 h','3 h 30 min']],['1 semana = ? días','7 días',['5 días','10 días','14 días']]]);
    return {q:`⏱️ ${opt[0]}`,answer:opt[1],fb:opt[1],options:optsFrom(opt[1],opt[2])};
  }
  const opt=pick([['1 hora = ? minutos','60 min',['30 min','100 min','90 min']],['Media hora = ? minutos','30 min',['15 min','60 min','45 min']],['1 día = ? horas','24 h',['12 h','48 h','10 h']],['1 minuto = ? segundos','60 s',['100 s','30 s','120 s']],['Un cuarto de hora = ?','15 min',['30 min','20 min','10 min']]]);
  return {q:`⏰ ${opt[0]}`,answer:opt[1],fb:opt[1],options:optsFrom(opt[1],opt[2])};
}
function genStats(){
  const L=DIFF, max=L==='bronce'?9:(L==='plata'?15:25), cnt=L==='oro'?5:4;
  const list=[]; while(list.length<cnt){const v=rnd(1,max); if(!list.includes(v))list.push(v);}
  const t=pick(L==='bronce'?['max','min','sum']:['max','min','sum','range']);
  if(t==='max'){const mx=Math.max(...list);const o=shuffle(list.filter(v=>v!==mx)).slice(0,3);return {q:`📊 Datos: ${list.join(', ')}. ¿El MAYOR?`,answer:String(mx),fb:`El mayor es ${mx}`,options:shuffle([mx,...o].map(String))};}
  if(t==='min'){const mn=Math.min(...list);const o=shuffle(list.filter(v=>v!==mn)).slice(0,3);return {q:`📊 Datos: ${list.join(', ')}. ¿El MENOR?`,answer:String(mn),fb:`El menor es ${mn}`,options:shuffle([mn,...o].map(String))};}
  if(t==='range'){const mx=Math.max(...list),mn=Math.min(...list),rg=mx-mn;return {q:`📊 Datos: ${list.join(', ')}. ¿El RECORRIDO (mayor−menor)?`,answer:String(rg),fb:`${mx}−${mn}=${rg}`,options:optsFrom(rg,[rg+1,rg-1,rg+2,mx].filter(v=>v>=0))};}
  const k=L==='bronce'?3:list.length; const three=list.slice(0,k); const s=three.reduce((a,b)=>a+b,0);
  return {q:`📊 ¿Cuánto suman: ${three.join(' + ')}?`,answer:String(s),fb:`= ${s}`,options:optsFrom(s,[s+1,s-1,s+2,s-3].filter(v=>v>0))};
}
function genGeo(){
  const L=DIFF;
  const shapes=[['tri','triángulo',3],['cuad','cuadrado',4],['rect','rectángulo',4],['penta','pentágono',5],['hexa','hexágono',6],['circ','círculo',0]];
  const names=['triángulo','cuadrado','rectángulo','pentágono','hexágono','círculo'];
  const t=pick(L==='bronce'?['name','sides']:(L==='plata'?['name','sides','perim']:['sides','perim','area']));
  if(t==='perim'){
    const sq=L==='plata' && Math.random()<.5; const w=rnd(2,L==='oro'?12:9), h=sq?w:rnd(2,9); const unit=pick(['cm','m']); const per=2*(w+h);
    return {q:`🔷 Un ${sq?'cuadrado':'rectángulo'} mide ${w} y ${h} ${unit} de lado. ¿Su PERÍMETRO?`,answer:`${per} ${unit}`,fb:`2×(${w}+${h}) = ${per} ${unit}`,options:optsFrom(`${per} ${unit}`,[`${w*h} ${unit}`,`${per+2} ${unit}`,`${per-2} ${unit}`,`${w+h} ${unit}`])};
  }
  if(t==='area'){
    const w=rnd(2,12),h=rnd(2,12); const unit=pick(['cm','m']); const ar=w*h;
    return {q:`🔷 Un rectángulo de base ${w} y altura ${h} ${unit}. ¿Su ÁREA?`,answer:`${ar} ${unit}²`,fb:`${w}×${h} = ${ar} ${unit}²`,options:optsFrom(`${ar} ${unit}²`,[`${2*(w+h)} ${unit}²`,`${ar+w} ${unit}²`,`${ar-h} ${unit}²`,`${w+h} ${unit}²`])};
  }
  const s=pick(shapes);
  if(t==='name') return {q:`🔷 ¿Qué figura es?`,answer:s[1],fb:`Es un ${s[1]}`,options:optsFrom(s[1],shuffle(names.filter(n=>n!==s[1]))),draw:el=>el.appendChild(shapeCanvas(s[0]))};
  return {q:`🔷 ¿Cuántos lados tiene esta figura?`,answer:String(s[2]),fb:`El ${s[1]} tiene ${s[2]} lado(s)`,options:optsFrom(s[2],[s[2]+1,s[2]-1,s[2]+2,s[2]+3].filter(v=>v>=0)),draw:el=>el.appendChild(shapeCanvas(s[0]))};
}

/* ---------- niveles ---------- */
const LEVELS=[
  {topic:"Operaciones",  icon:"➗", piece:"vinalopop", gen:genOps},
  {topic:"Decimales",    icon:"🔢", piece:"alcudia",   gen:genDec},
  {topic:"Dinero",       icon:"🪙", piece:"glorieta",  gen:genMoney},
  {topic:"Fracciones",   icon:"🍰", piece:"glorieta",  gen:genFrac},
  {topic:"Medidas",      icon:"📏", piece:"rabal",     gen:genMeasure},
  {topic:"El tiempo",    icon:"⏰", piece:"alfin",     gen:genTime},
  {topic:"Estadística",  icon:"📊", piece:"alfin",     gen:genStats},
  {topic:"Geometría",    icon:"🔷", piece:"vinalopop", gen:genGeo, finalKing:true}
];
const LEVEL_FILES=[
  "Nivel_1_Operaciones.html","Nivel_2_Decimales.html","Nivel_3_Dinero.html","Nivel_4_Fracciones.html",
  "Nivel_5_Medidas.html","Nivel_6_El_tiempo.html","Nivel_7_Estadistica.html","Nivel_8_Geometria.html"
];
function levelFile(n){ return LEVEL_FILES[n-1]; }

/* ---------- tablero: movimiento de ajedrez + obstáculos ---------- */
let COLS=5, ROWS=5, CELL=80;
let lvl=0, hearts=3, currentQ=null;
let obstacles=new Set();                 // claves "c,r"
let startCell=[0,0], keyCell=[0,0], pos=[0,0];
let pieceType='peon', awaitingMove=false, legalTargets=[];
let anim=null, moves=0, minMoves=0;
const easeIO=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;

const PIECE_INFO={
  peon:{sym:'♟',name:'Peón',rule:'1 casilla recta'},
  torre:{sym:'♜',name:'Torre',rule:'en línea recta'},
  alfil:{sym:'♝',name:'Alfil',rule:'en diagonal'},
  caballo:{sym:'♞',name:'Caballo',rule:'en forma de L (salta rocas)'},
  dama:{sym:'♛',name:'Dama',rule:'recta o en diagonal'}
};
const PIECE_OF={vinalopop:'peon',alcudia:'torre',glorieta:'dama',rabal:'caballo',alfin:'alfil',reypi:'peon'};

const ckey=(c,r)=>c+','+r;
const inB=(c,r)=>c>=0&&c<COLS&&r>=0&&r<ROWS;
const isObs=(c,r)=>obstacles.has(ckey(c,r));

function movesFrom(c,r){
  const res=[];
  if(pieceType==='peon'){ [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dc,dr])=>{const nc=c+dc,nr=r+dr;if(inB(nc,nr)&&!isObs(nc,nr))res.push([nc,nr]);}); }
  else if(pieceType==='caballo'){ [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]].forEach(([dc,dr])=>{const nc=c+dc,nr=r+dr;if(inB(nc,nr)&&!isObs(nc,nr))res.push([nc,nr]);}); }
  else{
    let dirs;
    if(pieceType==='torre') dirs=[[1,0],[-1,0],[0,1],[0,-1]];
    else if(pieceType==='alfil') dirs=[[1,1],[1,-1],[-1,1],[-1,-1]];
    else dirs=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
    dirs.forEach(([dc,dr])=>{ let nc=c+dc,nr=r+dr; while(inB(nc,nr)&&!isObs(nc,nr)){ res.push([nc,nr]); nc+=dc; nr+=dr; } });
  }
  return res;
}
function bfsDist(s,k){
  const q=[[s[0],s[1],0]], seen=new Set([ckey(s[0],s[1])]);
  while(q.length){ const [c,r,d]=q.shift(); if(c===k[0]&&r===k[1]) return d;
    for(const [nc,nr] of movesFrom(c,r)){ const kk=ckey(nc,nr); if(!seen.has(kk)){ seen.add(kk); q.push([nc,nr,d+1]); } } }
  return Infinity;
}
function generateBoard(){
  pieceType=PIECE_OF[LEVELS[lvl].piece]||'peon';
  let cfg;
  if(DIFF==='bronce') cfg={cols:5,rows:5,obs:4,min:2,max:6};
  else if(DIFF==='plata') cfg={cols:6,rows:6,obs:7,min:3,max:8};
  else cfg={cols:6,rows:6,obs:10,min:3,max:12};
  COLS=cfg.cols; ROWS=cfg.rows; CELL=Math.floor(400/COLS);
  const cv=document.getElementById('board'); if(cv){ cv.width=COLS*CELL; cv.height=ROWS*CELL; }
  let best=null;
  for(let att=0; att<400 && !best; att++){
    obstacles=new Set(); let placed=0, g=0;
    while(placed<cfg.obs && g++<300){ const c=rnd(0,COLS-1),r=rnd(0,ROWS-1); if(!isObs(c,r)){ obstacles.add(ckey(c,r)); placed++; } }
    const free=[]; for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++) if(!isObs(c,r)) free.push([c,r]);
    if(free.length<4) continue;
    const s=pick(free), k=pick(free);
    if(s[0]===k[0]&&s[1]===k[1]) continue;
    if(pieceType==='alfil' && ((s[0]+s[1])%2)!==((k[0]+k[1])%2)) continue; // el alfil no cambia de color
    startCell=s; keyCell=k;
    const d=bfsDist(s,k);
    if(d>=cfg.min && d<=cfg.max) best={s,k,obs:new Set(obstacles)};
  }
  if(!best){ // plan B sin obstáculos: siempre alcanzable
    obstacles=new Set(); startCell=[0,0];
    let k=[COLS-1,ROWS-1]; if(pieceType==='alfil' && ((COLS-1)+(ROWS-1))%2!==0) k=[COLS-1,ROWS-2];
    keyCell=k; best={s:startCell,k:keyCell,obs:obstacles};
  }
  startCell=best.s; keyCell=best.k; obstacles=best.obs;
  pos=[startCell[0],startCell[1]]; awaitingMove=false; legalTargets=[]; anim=null;
  minMoves=bfsDist(startCell,keyCell); moves=0;
}
function drawBoard(){
  const cv=document.getElementById('board'); if(!cv) return; const ctx=cv.getContext('2d');
  const S=Math.max(2,Math.floor(CELL/20)); const ox=Math.round((CELL-16*S)/2);
  ctx.clearRect(0,0,cv.width,cv.height); ctx.textAlign="center"; ctx.textBaseline="middle";
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){ ctx.fillStyle=(c+r)%2===0?'#f0e0b8':'#b58a55'; ctx.fillRect(c*CELL,r*CELL,CELL,CELL); }
  obstacles.forEach(sk=>{ const [c,r]=sk.split(',').map(Number); ctx.font=Math.floor(CELL*0.55)+"px serif"; ctx.fillText("🪨",c*CELL+CELL/2,r*CELL+CELL/2+2); });
  // casilla clave
  { const [c,r]=keyCell; ctx.save(); ctx.strokeStyle="#e8b84b"; ctx.lineWidth=4; ctx.strokeRect(c*CELL+3,r*CELL+3,CELL-6,CELL-6); ctx.restore();
    if(!(pos[0]===c&&pos[1]===r)){ if(LEVELS[lvl].finalKing) drawGuardian(ctx,"reypi",c*CELL+ox,r*CELL,S); else { ctx.font=Math.floor(CELL*0.5)+"px serif"; ctx.fillText("👑",c*CELL+CELL/2,r*CELL+CELL/2); } }
  }
  // destinos legales (verde) cuando toca mover
  if(awaitingMove) legalTargets.forEach(([c,r])=>{ ctx.fillStyle="rgba(90,143,60,.55)"; ctx.beginPath(); ctx.arc(c*CELL+CELL/2,r*CELL+CELL/2,CELL*0.17,0,7); ctx.fill(); ctx.strokeStyle="#2f5a22"; ctx.lineWidth=3; ctx.stroke(); });
  // pieza del jugador (con animación de movimiento)
  let pcx=pos[0]*CELL, pcy=pos[1]*CELL;
  if(anim){
    const e=easeIO(anim.t);
    pcx=anim.fromC*CELL+(anim.toC-anim.fromC)*CELL*e;
    pcy=anim.fromR*CELL+(anim.toR-anim.fromR)*CELL*e;
    if(anim.knight) pcy-=Math.sin(anim.t*Math.PI)*CELL*0.5;  // saltito en arco
  }
  drawGuardian(ctx,LEVELS[lvl].piece,Math.round(pcx)+ox,Math.round(pcy),S);
}
// clic en el tablero para elegir la casilla de destino
document.addEventListener('click',function(e){
  const cv=document.getElementById('board'); if(!cv || e.target!==cv || !awaitingMove) return;
  const rect=cv.getBoundingClientRect(); const sx=cv.width/rect.width, sy=cv.height/rect.height;
  const c=Math.floor((e.clientX-rect.left)*sx/CELL), r=Math.floor((e.clientY-rect.top)*sy/CELL);
  if(legalTargets.some(t=>t[0]===c&&t[1]===r)) doMove(c,r);
});
function doMove(c,r){
  if(anim) return;
  const fromC=pos[0], fromR=pos[1], knight=pieceType==='caballo', dur=380, t0=performance.now();
  awaitingMove=false; legalTargets=[];
  function frame(now){
    const t=Math.min(1,(now-t0)/dur);
    anim={fromC,fromR,toC:c,toR:r,t,knight}; drawBoard();
    if(t<1){ requestAnimationFrame(frame); }
    else{
      anim=null; pos=[c,r]; moves++; drawBoard();
      if(c===keyCell[0]&&r===keyCell[1]) levelComplete();
      else setTimeout(nextTurn,250);
    }
  }
  requestAnimationFrame(frame);
}

/* ---------- selector de dificultad ---------- */
function showLevelChooser(next){
  const old=document.getElementById('__diffOverlay'); if(old) old.remove();
  const ov=document.createElement('div'); ov.id='__diffOverlay';
  ov.style.cssText='position:fixed;inset:0;background:rgba(10,8,4,.97);z-index:9999;overflow:auto;display:flex;align-items:center;justify-content:center;padding:14px;';
  ov.innerHTML=`<div class="panel" style="max-width:660px;width:100%;text-align:center">
    <h1>ELIGE TU NIVEL</h1>
    <p class="small">Cuanto más alto, más difíciles serán las pruebas, más grande el tablero y más rocas habrá que esquivar.</p>
    <div class="row" style="margin-top:14px">
      <button class="btn" data-l="bronce" style="background:#c07b3c;border-color:#7d4a1d;box-shadow:0 4px 0 #5d3614;min-width:150px">🥉 BRONCE<br><span style="font-size:8px">Tablero 5×5 · pocas rocas</span></button>
      <button class="btn" data-l="plata" style="background:#aab7c2;border-color:#6c7a86;box-shadow:0 4px 0 #4d5862;color:#1c140c;min-width:150px">🥈 PLATA<br><span style="font-size:8px">Tablero 6×6 · más rocas</span></button>
      <button class="btn oro" data-l="oro" style="min-width:150px">🥇 ORO<br><span style="font-size:8px">Tablero 6×6 · muchas rocas</span></button>
    </div>
  </div>`;
  document.body.appendChild(ov);
  ov.querySelectorAll('button[data-l]').forEach(b=> b.onclick=()=>{ DIFF=b.dataset.l; ov.remove(); next(); });
}

/* ---------- flujo ---------- */
function startGame(){ MODE='full'; showLevelChooser(()=>{ lvl=0; startLevel(); }); }
function initLevel(n){ MODE='single'; showLevelChooser(()=>{ lvl=n-1; startLevel(); }); }
function reChooseDiff(){ showLevelChooser(()=>startLevel()); }
function startLevel(){
  hearts=3;
  show('play'); generateBoard();
  const lb=document.getElementById('lvlBadge'); if(lb) lb.textContent=`Nivel ${lvl+1}`;
  const tb=document.getElementById('topicBadge'); if(tb) tb.textContent=`${LEVELS[lvl].icon} ${LEVELS[lvl].topic}`;
  updateHearts(); drawBoard(); nextTurn();
}
function updateHearts(){ const h=document.getElementById('hearts'); if(h) h.textContent='❤️'.repeat(hearts)+'🖤'.repeat(3-hearts); }
function updateStepInfo(){ const s=document.getElementById('stepInfo'); if(s) s.textContent=`${DIFF_NAME[DIFF]} · ${PIECE_INFO[pieceType].sym} ${PIECE_INFO[pieceType].name} (${PIECE_INFO[pieceType].rule}) · Movimientos: ${moves} · mínimo ${minMoves} · 👑 esquiva 🪨`; }
function nextTurn(){
  if(pos[0]===keyCell[0]&&pos[1]===keyCell[1]){ levelComplete(); return; }
  awaitingMove=false; legalTargets=[]; updateStepInfo(); drawBoard();
  currentQ=LEVELS[lvl].gen();
  const quiz=document.getElementById('quiz');
  quiz.innerHTML=`
    <div class="qbox">
      <p class="small">Resuelve para poder mover tu pieza:</p>
      ${currentQ.draw? `<div id="qvis" style="margin:8px 0"></div>`:''}
      <div class="qtext">${currentQ.q}</div>
    </div>
    <div class="row" id="optRow"></div>
    <div class="feedback" id="fb"></div>`;
  if(currentQ.draw) currentQ.draw(document.getElementById('qvis'));
  const row=document.getElementById('optRow');
  shuffle(currentQ.options.slice()).forEach(o=>{ const b=document.createElement('button'); b.className='opt'; b.textContent=o; b.onclick=()=>answer(b,o,row); row.appendChild(b); });
}
function answer(btn,val,row){
  if(String(val)===String(currentQ.answer)){
    btn.classList.add('good'); [...row.children].forEach(x=>x.disabled=true); onCorrect();
  }else{
    btn.classList.add('bad'); btn.disabled=true; hearts--; updateHearts();
    const bd=document.getElementById('board'); if(bd){ bd.classList.add('shake'); setTimeout(()=>bd.classList.remove('shake'),350); }
    if(hearts<=0){
      document.getElementById('fb').innerHTML=`<span style="color:#ff8a7a">💥 ¡Sin vidas! Repites el nivel desde el inicio…</span>`;
      [...row.children].forEach(x=>x.disabled=true); setTimeout(startLevel,1500);
    }else{
      document.getElementById('fb').innerHTML=`<span style="color:#ff8a7a">✘ Casi… te quedan ${hearts} ${hearts===1?'vida':'vidas'}. Prueba otra opción.</span>`;
    }
  }
}
function onCorrect(){
  legalTargets=movesFrom(pos[0],pos[1]); awaitingMove=true; drawBoard();
  const quiz=document.getElementById('quiz');
  quiz.innerHTML=`
    <div class="qbox">
      <h2 style="color:#7fd048;margin:0 0 8px">✔ ¡Correcto!</h2>
      <p class="qtext">Pulsa una casilla <span style="color:#7fd048">verde</span> del tablero para mover tu ${PIECE_INFO[pieceType].name.toLowerCase()}.</p>
      <p class="small">${PIECE_INFO[pieceType].sym} Mueve ${PIECE_INFO[pieceType].rule}. Llega a 👑 esquivando las rocas 🪨.</p>
    </div>`;
}
function levelComplete(){
  const quiz=document.getElementById('quiz');
  const last = lvl===LEVELS.length-1;
  if(MODE==='single'){
    quiz.innerHTML=`
      <div class="qbox"><div class="victory-emoji">⭐✨⭐</div><h2>¡Nivel ${lvl+1} superado!</h2>
        <p>Has cruzado el tablero de <b>${LEVELS[lvl].topic}</b> en nivel <b>${DIFF_NAME[DIFF]}</b> y llegado a la corona 👑.</p>
        <p style="color:var(--oro)">${moves===minMoves?'🌟 ¡Camino perfecto! Lo lograste en el mínimo de movimientos.':`Lo lograste en ${moves} movimientos (el mínimo era ${minMoves}).`}</p></div>
      <div class="center">
        <button class="btn oro" onclick="startLevel()">↺ Jugar otra vez</button>
        <button class="btn azul" onclick="reChooseDiff()">⚙ Cambiar dificultad</button>
        <a class="btn azul" href="index.html">▶ Menú</a>
        ${ last? `<a class="btn" href="Juego_Completo.html">👑 Juego completo</a>`
               : `<a class="btn" href="${levelFile(lvl+2)}">➡ Nivel ${lvl+2}: ${LEVELS[lvl+1].icon} ${LEVELS[lvl+1].topic}</a>` }
      </div>`;
    return;
  }
  quiz.innerHTML=`
    <div class="qbox"><div class="victory-emoji">⭐✨⭐</div><h2>¡Nivel ${lvl+1} superado!</h2>
      <p>${last?'Has liberado al Rey Pi 👑':'Has llegado a la corona. ¡Sigue avanzando por el reino!'}</p>
      <p style="color:var(--oro)">${moves===minMoves?'🌟 ¡Camino perfecto!':`En ${moves} movimientos (mínimo ${minMoves}).`}</p></div>
    <div class="center">
      ${ last? `<button class="btn oro" onclick="winGame()">🏆 Ver el final</button>`
             : `<button class="btn oro" onclick="lvl++;startLevel()">▶ Nivel ${lvl+2}: ${LEVELS[lvl+1].icon} ${LEVELS[lvl+1].topic}</button>` }
    </div>`;
}
function winGame(){ show('win'); drawWinArt(); }
function resetAll(){ show('intro'); }

/* ---------- arte intro / victoria ---------- */
function drawIntroArt(){
  const c=document.getElementById('introCanvas'); if(!c)return; const x=c.getContext('2d'); x.clearRect(0,0,c.width,c.height);
  drawGuardian(x,"vinalopop",20,10,5); drawGuardian(x,"alcudia",100,10,5); drawGuardian(x,"reypi",180,10,5); drawGuardian(x,"rabal",260,10,5);
}
function drawWinArt(){
  const c=document.getElementById('winCanvas'); if(!c)return; const x=c.getContext('2d'); x.clearRect(0,0,360,120);
  ["vinalopop","alcudia","glorieta","rabal","alfin","reypi"].forEach((g,i)=>drawGuardian(x,g,10+i*58,8,3.4));
}
