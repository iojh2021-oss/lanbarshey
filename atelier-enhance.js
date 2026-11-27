/* Procedural architectural and mechanical detailing for the walnut cinema atelier.
   No raster scene artwork: every visible addition is real Three.js geometry/material/light. */
(function(){
'use strict';
const gold=new T.MeshStandardMaterial({color:0xc49a5d,metalness:.82,roughness:.26});
const paleGold=new T.MeshStandardMaterial({color:0xe0bd7e,metalness:.76,roughness:.24});
const agedGold=new T.MeshStandardMaterial({color:0x76502b,metalness:.78,roughness:.34});
const walnut=new T.MeshStandardMaterial({color:0x351b10,roughness:.38,metalness:.08});
const walnut2=new T.MeshStandardMaterial({color:0x5a2d18,roughness:.34,metalness:.12});
const velvet=new T.MeshStandardMaterial({color:0x54151b,roughness:.94});
const velvetDark=new T.MeshStandardMaterial({color:0x270b10,roughness:.98});
const ivory=new T.MeshStandardMaterial({color:0xe8d7b8,roughness:.5});
const black=new T.MeshStandardMaterial({color:0x100e0c,metalness:.55,roughness:.28});
const glow=new T.MeshBasicMaterial({color:0xffd18a});
function mesh(parent,geo,mat,x=0,y=0,z=0){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function box(parent,x,y,z,w,h,d,mat){return mesh(parent,new T.BoxGeometry(w,h,d),mat,x,y,z)}
function cyl(parent,x,y,z,r1,r2,h,mat,axis='y',n=32){const m=mesh(parent,new T.CylinderGeometry(r1,r2,h,n),mat,x,y,z);if(axis==='x')m.rotation.z=Math.PI/2;if(axis==='z')m.rotation.x=Math.PI/2;return m}
function torus(parent,x,y,z,r,t,mat,rx=0,rz=0){const m=mesh(parent,new T.TorusGeometry(r,t,10,48),mat,x,y,z);m.rotation.x=rx;m.rotation.z=rz;return m}
function light(color,intensity,distance,x,y,z){const l=new T.PointLight(color,intensity,distance,2);l.position.set(x,y,z);sc.add(l);return l}
/* Focused atelier lighting: stage and tabletop only; no 3D room shell. */
R.shadowMap.type=T.PCFSoftShadowMap;
R.toneMapping=T.ACESFilmicToneMapping;
R.toneMappingExposure=1.16;
if('outputColorSpace' in R)R.outputColorSpace=T.SRGBColorSpace;
sc.background=new T.Color(0x090604);
sp.intensity=2.0;sp.angle=.78;sp.penumbra=.8;sp.distance=16;
sp.position.set(-1.4,5.1,2.4);sp.target.position.set(0,1.1,-1.2);
const warmKey=new T.PointLight(0xffb65f,1.15,9);warmKey.position.set(-3.2,3.2,1.2);sc.add(warmKey);
const warmFill=new T.PointLight(0xffcf83,.9,8);warmFill.position.set(3.4,3.0,-1.2);sc.add(warmFill);
/* Desk: solid carved apron, fluted legs, brass rails and drawer banks */
box(tb,0,.79,0,4.68,.18,1.28,walnut);
box(tb,0,.69,-.01,4.52,.08,1.18,agedGold);
box(tb,0,.65,-.01,4.48,.08,1.14,walnut2);
for(const side of [-1,1]){
 for(const z of [-.48,.48]){
  const leg=new T.Group();leg.position.set(side*2.12,.08,z);tb.add(leg);
  cyl(leg,0,.38,0,.075,.1,.7,walnut2);cyl(leg,0,.38,0,.082,.082,.68,gold);
  for(let y of [.12,.2,.57,.65])torus(leg,0,y,0,.09,.018,paleGold);
  box(leg,0,.04,0,.24,.08,.24,walnut);box(leg,0,.08,0,.27,.035,.27,gold);
 }
 for(let row=0;row<3;row++){
  const y=.36+row*.17;
  box(tb,side*1.58,y,.66,.92,.145,.16,walnut2);
  box(tb,side*1.58,y+.05,.748,.78,.012,.012,gold);
  box(tb,side*1.58,y-.05,.748,.78,.012,.012,agedGold);
  torus(tb,side*1.58,y,.77,.045,.012,paleGold,Math.PI/2);
  box(tb,side*1.58,y,.77,.012,.12,.012,gold);
 }
}
/* Front apron medallion */
torus(tb,0,.69,.66,.14,.018,gold,Math.PI/2);
cyl(tb,0,.69,.66,.095,.095,.02,agedGold,'z');
/* Brass corner caps and bolts on the worktop */
for(const x of [-2.2,2.2])for(const z of [-.55,.55]){
 box(tb,x,.965,z,.12,.025,.12,gold);
 cyl(tb,x,.985,z,.026,.026,.012,paleGold);
}
/* Mechanism detailing on each tabletop machine: mounting feet, screw heads, gear rims */
Object.entries(INST).forEach(([id,list])=>list.filter(o=>o.g.parent===sc).forEach(o=>{
 const base=o.g;
 for(const x of [-.43,.43])for(const z of [-.22,.22]){
  cyl(base,x,.025,z,.028,.028,.018,agedGold);
  box(base,x,.036,z,.012,.008,.012,paleGold);
 }
 const plaque=box(base,0,.12,.305,.32,.09,.018,agedGold);
 plaque.userData.part='body';
 box(base,0,.12,.318,.27,.052,.008,walnut);
 for(let x of [-.105,-.035,.035,.105])cyl(base,x,.12,.326,.012,.012,.008,paleGold,'z',12);
 if(id==='tw'||id==='sew'){
  const gear=new T.Group();gear.position.set(.37,.26,.27);base.add(gear);
  torus(gear,0,0,0,.13,.025,gold,Math.PI/2);
  cyl(gear,0,0,0,.04,.04,.035,agedGold,'z');
  for(let i=0;i<12;i++){const a=i*Math.PI/6;box(gear,Math.cos(a)*.13,Math.sin(a)*.13,0,.045,.035,.03,gold).rotation.z=a}
  gear.userData.turn=id==='tw'?1:-1;
  base.userData.extraGear=gear;
 }else{
  for(let x of [-.36,.36]){torus(base,x,.34,.29,.075,.012,gold,Math.PI/2);cyl(base,x,.34,.29,.018,.018,.018,paleGold,'z')}
 }
}));
/* Additional practical mechanisms: hand crank and winding key on music box */
INST.mb.forEach(o=>{
 const crank=new T.Group();crank.position.set(-.49,.34,-.18);o.g.add(crank);
 cyl(crank,0,0,0,.025,.025,.16,gold,'x');
 box(crank,0,.09,0,.035,.18,.035,paleGold);
 cyl(crank,0,.19,0,.035,.035,.1,walnut2);
 o.g.userData.windingCrank=crank;
});
/* Gear movement follows the real-time workshop simulation */
const started=performance.now();
function animate(){const t=(performance.now()-started)/1000;
 train.forEach(g=>g.rotation.z=t*g.userData.speed);
 Object.values(INST).flat().forEach(o=>{if(o.g.userData.extraGear)o.g.userData.extraGear.rotation.z=t*(o.g.userData.extraGear.userData.turn||1)*.6;if(o.g.userData.windingCrank&&S.mb.on)o.g.userData.windingCrank.rotation.x=t*2});
 requestAnimationFrame(animate)}
animate();
/* Better ambient response to projector state */
const projectorGlow=light(0xffd18a,.0,12,1.7,1.8,-1.1);
const oldSim=sim;
sim=function(dt){oldSim(dt);projectorGlow.intensity=S.pj.lamp&&(S.pj.on||S.cam.on)?.9:S.pj.lamp?.18:0};
})();

/* ---------- performance / quality selector ---------- */
(function(){
 'use strict';
 const bar=document.createElement('div');
 bar.id='qualityBar';
 bar.innerHTML='<label for="qualitySelect">⚙ کیفیت تصویر</label><select id="qualitySelect" aria-label="انتخاب کیفیت تصویر"><option value="low">گوشی ضعیف · روان</option><option value="medium">متعادل</option><option value="high">کیفیت بالا</option><option value="auto">خودکار</option></select><span id="qualityHint">کاهش فشار گرافیکی</span>';
 document.body.appendChild(bar);
 const select=bar.querySelector('select'),hint=bar.querySelector('#qualityHint');
 const presets={
  low:{pixel:.68,fps:24,shadow:false,mini:.65,label:'مناسب گوشی ضعیف'},
  medium:{pixel:.95,fps:30,shadow:true,mini:.9,label:'تعادل کیفیت و سرعت'},
  high:{pixel:1.35,fps:60,shadow:true,mini:1.25,label:'جزئیات بیشتر'},
 };
 function autoMode(){
  const cores=navigator.hardwareConcurrency||4,mem=navigator.deviceMemory||4;
  return (cores<=4||mem<=4||matchMedia('(max-width: 700px)').matches)?'low':'medium';
 }
 let mode='low',nextFrame=0;
 window.__atelierQualityMode=mode;
 function applyQuality(value){
  mode=value==='auto'?autoMode():value;
  window.__atelierQualityMode=mode;
  const p=presets[mode]||presets.low;
  document.body.classList.toggle('quality-low',mode==='low');
  if(typeof R!=='undefined'){
   R.setPixelRatio(Math.min(devicePixelRatio||1,p.pixel));
   R.setSize(innerWidth,innerHeight,false);
   R.shadowMap.enabled=p.shadow;
   if(typeof sp!=='undefined'&&sp.shadow&&sp.shadow.mapSize){
    const size=mode==='low'?256:mode==='medium'?512:1024;
    sp.shadow.mapSize.set(size,size);
    if(sp.shadow.map){sp.shadow.map.dispose();sp.shadow.map=null}
   }
  }
  if(typeof mr!=='undefined'&&mr){
   mr.setPixelRatio(Math.min(devicePixelRatio||1,p.mini));
   mr.setSize($('mini').clientWidth,$('mini').clientHeight,false);
  }
  if(typeof sz==='function'&&typeof S!=='undefined'&&S.sel)sz();
  nextFrame=0;
  hint.textContent=p.label+' · '+p.fps+'fps';
  try{localStorage.setItem('atelier-quality',value)}catch(e){}
 }
 const oldRender=R.render.bind(R);
 R.render=function(){
  const now=performance.now(),step=1000/((presets[mode]||presets.low).fps);
  if(now<nextFrame)return;
  nextFrame=now+step;
  return oldRender.apply(null,arguments);
 };
 let saved='auto';
 try{saved=localStorage.getItem('atelier-quality')||'auto'}catch(e){}
 if(!['low','medium','high','auto'].includes(saved))saved='auto';
 select.value=saved;
 select.addEventListener('change',()=>applyQuality(select.value));
 applyQuality(saved);
 window.addEventListener('resize',()=>applyQuality(select.value),{passive:true});
})();

/* Keep mini-view quality capped after the original resize helper runs. */
(function(){
 const originalSize=sz;
 sz=function(){
  originalSize();
  const p=({low:.65,medium:.9,high:1.25})[window.__atelierQualityMode]||.65;
  mr.setPixelRatio(Math.min(devicePixelRatio||1,p));
 };
 const miniRender=mr.render.bind(mr);
 let miniNext=0;
 mr.render=function(){
  const fps=({low:24,medium:30,high:60})[window.__atelierQualityMode]||24,now=performance.now();
  if(now<miniNext)return;
  miniNext=now+1000/fps;
  return miniRender.apply(null,arguments);
 };
})();
