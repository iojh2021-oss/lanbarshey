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
/* Cinematic renderer and warm room lighting */
R.shadowMap.type=T.PCFSoftShadowMap;
R.toneMapping=T.ACESFilmicToneMapping;
R.toneMappingExposure=1.16;
if('outputColorSpace' in R)R.outputColorSpace=T.SRGBColorSpace;
sc.background=new T.Color(0x100905);
sc.fog=new T.FogExp2(0x100905,.022);
sp.intensity=2.15;sp.angle=.72;sp.penumbra=.72;sp.distance=18;sp.position.set(-1.4,5.1,2.4);sp.target.position.set(0,1.1,-1.2);
light(0xffb65f,1.35,9,-3.5,3.1,-2.4);light(0xffcf83,1.15,8,3.6,3.2,-2.7);light(0xffd28b,.72,7,0,3.9,1.1);
/* Raised parquet floor: alternating walnut inlays and brass pinstripes */
const floorGroup=new T.Group();floorGroup.position.set(0,.012,-1);sc.add(floorGroup);
const floorMat=[new T.MeshStandardMaterial({color:0x392014,roughness:.42}),new T.MeshStandardMaterial({color:0x4b2918,roughness:.4})];
for(let row=0;row<12;row++)for(let col=0;col<10;col++){
 const x=-4.5+col*.98,z=-6.5+row*1.08;
 box(floorGroup,x,0,z,.96,.018,1.06,floorMat[(row+col)%2]);
}
for(let x=-4.85;x<=4.86;x+=.18)box(floorGroup,x,.012,5.5,.012,.008,12,agedGold);
/* Wall wainscoting, pilasters and framed library bays */
for(const side of [-1,1]){
 const x=side*4.91;
 box(sc,x,1.18,-1,.16,1.9,11.8,walnut);
 box(sc,x-side*.012,2.25,-1,.12,.08,11.8,gold);
 box(sc,x-side*.012,.22,-1,.12,.08,11.8,gold);
 for(let z=-5.5;z<4.8;z+=1.45){
  box(sc,x-side*.02,1.15,z,.11,1.65,.06,walnut2);
  box(sc,x-side*.085,1.15,z,.025,1.55,.025,gold);
  box(sc,x-side*.085,1.15,z+.65,.025,.025,.025,paleGold);
  box(sc,x-side*.085,1.15,z-.65,.025,.025,.025,paleGold);
 }
}
/* Rear wall paneling and tall bookcase alcoves */
for(let x of [-4.25,4.25]){
 box(sc,x,2.23,-5.86,1.32,4.35,.16,walnut);
 box(sc,x,2.23,-5.75,1.23,4.2,.035,walnut2);
 for(let y=.55;y<4.2;y+=.9)box(sc,x,y,-5.69,1.2,.035,.06,gold);
 for(let y=.75;y<4.0;y+=.9)for(let k=0;k<5;k++){
  const bw=.12+(k%2)*.035,bh=.32+(k%3)*.09;
  box(sc,x-.48+k*.22,y+bh/2,-5.63,bw,bh,.12,k%3===0?velvet: k%3===1?agedGold:walnut);
  box(sc,x-.48+k*.22,y+bh+.012,-5.63,bw+.015,.025,.13,gold);
 }
}
/* Grand proscenium mouldings around the projection screen */
for(let z of [-5.64,-5.5]){
 box(sc,0,4.48,z,8.5,.16,.18,gold);box(sc,0,.06,z,8.5,.16,.18,gold);
 box(sc,-4.18,2.27,z,.16,4.45,.18,gold);box(sc,4.18,2.27,z,.16,4.45,.18,gold);
}
for(let side of [-1,1]){
 for(let y of [.18,.42,.66,.9,1.14,1.38,1.62,1.86,2.1,2.34,2.58,2.82,3.06,3.3,3.54,3.78,4.02,4.26]){
  const m=box(sc,side*4.03,y,-5.48,.18,.035,.22,paleGold);m.rotation.z=side*.08;
 }
}
/* Heavy velvet curtains with sculpted folds, valance and tassels */
for(const side of [-1,1]){
 const curtain=new T.Group();curtain.position.set(side*3.78,2.34,-5.28);sc.add(curtain);
 const panel=mesh(curtain,new T.PlaneGeometry(.78,4.0,18,24),velvet);
 panel.position.x=side*.04;panel.rotation.y=side*.08;
 const a=panel.geometry.attributes.position;
 for(let i=0;i<a.count;i++){const u=a.getX(i),v=a.getY(i);a.setZ(i,Math.sin((u+.39)*Math.PI*18)*.035+Math.cos(v*3)*.018)}
 panel.geometry.computeVertexNormals();
 for(let f=0;f<8;f++){
  const fold=box(curtain,side*(-.32+f*.09),0,.055,.025,3.85,.035,velvetDark);
  fold.rotation.z=side*.012;
 }
 box(curtain,0,2.05,.08,.9,.13,.2,gold);
 box(curtain,0,-2.03,.08,.9,.11,.2,gold);
 for(let y of [-1.7,1.7])torus(curtain,0,y,.12,.08,.014,paleGold,Math.PI/2);
}
/* ceiling coffers and chandelier */
for(let x=-3.8;x<=3.81;x+=1.9)box(sc,x,4.48,-1,.045,.045,8.8,gold);
for(let z=-5.2;z<=3.2;z+=2.1)box(sc,0,4.48,z,8,.045,.045,gold);
const chandelier=new T.Group();chandelier.position.set(0,4.12,-1.25);sc.add(chandelier);
cyl(chandelier,0,0,0,.12,.16,.22,agedGold);
for(let i=0;i<8;i++){const a=i*Math.PI/4,x=Math.cos(a)*.62,z=Math.sin(a)*.62;
 const arm=mesh(chandelier,new T.TorusGeometry(.42,.018,8,28,Math.PI/2),gold,x*.35,-.12,z*.35);arm.rotation.y=-a;
 cyl(chandelier,x,-.2,z,.045,.055,.34,gold);
 const bulb=mesh(chandelier,new T.SphereGeometry(.07,16,12),glow,x,-.39,z);
 const pl=new T.PointLight(0xffc878,.18,2);pl.position.copy(bulb.position);chandelier.add(pl);
}
torus(chandelier,0,-.12,0,.7,.018,gold,Math.PI/2);
/* Tall antique clock on the left wall: case, dial, Roman-style ticks, hands */
const clock=new T.Group();clock.position.set(-4.68,3.05,-4.25);clock.rotation.y=Math.PI/2;sc.add(clock);
box(clock,0,0,0,.82,1.45,.16,walnut);box(clock,0,.12,.1,.67,.78,.04,agedGold);
cyl(clock,0,.28,.15,.3,.3,.045,ivory,'z',48);torus(clock,0,.28,.18,.31,.025,gold,Math.PI/2);
for(let i=0;i<12;i++){const a=i*Math.PI/6;box(clock,Math.sin(a)*.245,.28+Math.cos(a)*.245,.205,.018,.055,.012,black).rotation.z=-a}
const hand1=box(clock,0,.34,.22,.018,.19,.014,black);hand1.rotation.z=-.5;
const hand2=box(clock,.045,.28,.225,.014,.13,.012,black);hand2.rotation.z=1.1;
cyl(clock,0,.28,.24,.035,.035,.025,gold,'z');
/* Library props: gramophone horn on a walnut plinth */
const gram=new T.Group();gram.position.set(-3.65,1.08,-3.95);sc.add(gram);
box(gram,0,0,0,.85,.32,.7,walnut2);box(gram,0,.17,0,.9,.04,.74,gold);
cyl(gram,0,.38,0,.16,.13,.32,agedGold);
const horn=mesh(gram,new T.ConeGeometry(.42,.82,32,1,true),gold,0,.72,-.08);horn.rotation.x=Math.PI/2;horn.rotation.z=Math.PI;
torus(gram,0,.72,-.48,.39,.025,paleGold,Math.PI/2);
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
/* Visible synchronized belt and gear train beneath the table */
const under=new T.Group();under.position.set(0,.3,.71);sc.add(under);
function toothedGear(x,y,r,count,speed){const g=new T.Group();g.position.set(x,y,0);under.add(g);torus(g,0,0,0,r*.78,r*.12,gold);cyl(g,0,0,0,r*.22,r*.22,.06,agedGold,'z');
 for(let i=0;i<count;i++){const a=i*2*Math.PI/count;box(g,Math.cos(a)*r*.92,Math.sin(a)*r*.92,0,r*.24,r*.19,.065,paleGold).rotation.z=a}
 g.userData.speed=speed;return g}
const train=[toothedGear(-.72,0,.23,16,.65),toothedGear(-.25,0,.16,12,-.92),toothedGear(.22,0,.2,16,.69),toothedGear(.68,0,.13,10,-1.1)];
const shaft=cyl(under,0,0,-.09,.026,.026,1.85,agedGold,'x');
const belt=mesh(under,new T.TorusGeometry(.52,.012,8,64),black,0,0,.02);belt.scale.set(1.55,.55,1);
/* Additional practical mechanisms: hand crank and winding key on music box */
INST.mb.forEach(o=>{
 const crank=new T.Group();crank.position.set(-.49,.34,-.18);o.g.add(crank);
 cyl(crank,0,0,0,.025,.025,.16,gold,'x');
 box(crank,0,.09,0,.035,.18,.035,paleGold);
 cyl(crank,0,.19,0,.035,.035,.1,walnut2);
 o.g.userData.windingCrank=crank;
});
/* Projection screen gains an inset matte, gold beading and theatre footlights */
/* Keep the live projection canvas unobstructed; the existing wall canvas is the screen surface. */
for(let x=-3.32;x<=3.33;x+=.22){
 const bulb=mesh(sc,new T.SphereGeometry(.035,12,10),glow,x,.23,-5.55);
 const l=new T.PointLight(0xffc36e,.055,1.2);l.position.copy(bulb.position);sc.add(l);
}
for(const y of [.37,4.12])box(sc,0,y,-5.53,7.05,.025,.035,paleGold);
/* Fine decorative wall sconces */
for(const side of [-1,1]){
 const s=new T.Group();s.position.set(side*4.5,3.05,-1.7);sc.add(s);
 box(s,0,-.25,0,.14,.42,.12,agedGold);torus(s,0,-.06,.02,.13,.016,gold,Math.PI/2);
 const bulb=mesh(s,new T.SphereGeometry(.085,16,12),glow,0,.18,.08);
 const l=new T.PointLight(0xffc16f,.6,3);l.position.copy(bulb.position);s.add(l);
}
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
 function applyQuality(value){
  mode=value==='auto'?autoMode():value;
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
