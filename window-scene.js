import * as THREE from './assets/vendor/three/three.module.js';
import { createMotion } from './window-motion.js';

export async function startScene(host, { clock, scrollTo } = {}) {
  const request = clock?.request ?? requestAnimationFrame;
  const cancel = clock?.cancel ?? cancelAnimationFrame;
  const canvas = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  // Match Retina without the old fractional downsampling that softened every edge.
  renderer.setPixelRatio(2);
  renderer.setClearColor(0xf3f6fa, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-8,8,3,-3,.1,70);
  camera.position.set(0,0,18);
  const assembly = new THREE.Group();
  scene.add(assembly);
  scene.add(new THREE.AmbientLight(0xffffff, 2.3));
  const key = new THREE.DirectionalLight(0xffffff, 3.1);
  key.position.set(-3,5,18);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xcad3f1, 1.5); fill.position.set(5,-4,6); scene.add(fill);

  function roundShape(w,h,r) {
    const x=-w/2,y=-h/2,s=new THREE.Shape();
    s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;
  }
  function rect(c,x,y,w,h,r,fill){c.fillStyle=fill;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();}
  const names=['Field notes','A little perspective','Workspace','A clear direction'];
  const contents=[];
  function texture(index) {
    const surface=document.createElement('canvas'); surface.width=1024; surface.height=620;
    const c=surface.getContext('2d');
    rect(c,0,0,1024,620,25,index===1?'#eeecf6':index===3?'#e8eff7':'#ffffff');
    rect(c,0,0,1024,80,22,'#f4f6f9');rect(c,0,35,1024,45,0,'#f4f6f9');
    ['#8fa4bd','#b4c2d3','#ced8e5'].forEach((col,i)=>{c.fillStyle=col;c.beginPath();c.arc(32+i*26,39,8,0,Math.PI*2);c.fill();});
    c.font='500 29px Aspekta, sans-serif';c.fillStyle='#66758a';c.textAlign='center';c.fillText(names[index],512,50);c.textAlign='left';
    if(index===0){
      c.fillStyle='#73859c';c.font='500 26px Aspekta, sans-serif';c.fillText('IDEAS IN PROGRESS',65,151);
      c.fillStyle='#2f4159';c.font='500 74px Aspekta, sans-serif';c.fillText('Make room',65,250);c.fillText('for a good idea.',65,339);
      rect(c,67,382,840,2,0,'#d6dfeb');
      [710,550].forEach((w,i)=>rect(c,67,424+i*38,w,12,6,'#dce4ee'));
      c.font='500 24px Aspekta, sans-serif';c.fillStyle='#788ba2';c.fillText('01 / A PLACE TO BEGIN',67,565);
    }else if(index===1){
      // A real, procedural architectural illustration: layered open window planes.
      c.save();c.translate(530,335);c.rotate(-.1);
      for(let i=3;i>=0;i--){c.save();c.translate(-i*50,i*23);c.strokeStyle=['#84789f','#a59aba','#bdb4ce','#d0c9dd'][i];c.lineWidth=4;c.strokeRect(-205,-150,400,255);c.beginPath();c.moveTo(-205,-108);c.lineTo(195,-108);c.stroke();c.restore();}
      c.restore();c.fillStyle='#7e7296';c.font='500 26px Aspekta, sans-serif';c.fillText('A LITTLE ROOM TO THINK.',55,565);
    }else if(index===2){
      c.fillStyle='#334861';c.font='500 57px Aspekta, sans-serif';c.fillText('Today, in focus.',63,169);
      const tasks=['Gather the pieces','Find the connection','Make it happen'];
      tasks.forEach((t,i)=>{const y=235+i*110;rect(c,65,y,43,43,9,i===0?'#819bb9':'#e8eef5');if(i===0){c.strokeStyle='#fff';c.lineWidth=4;c.beginPath();c.moveTo(74,y+21);c.lineTo(83,y+30);c.lineTo(99,y+14);c.stroke();}c.font='500 37px Aspekta, sans-serif';c.fillStyle=i===0?'#8393a7':'#4c607a';c.fillText(t,137,y+35);rect(c,137,y+66,765,2,0,'#e4eaf2');});
    }else{
      c.fillStyle='#546e8f';c.font='500 29px Aspekta, sans-serif';c.fillText('EVERYTHING IN ITS PLACE',63,151);
      const blocks=[[63,205,530,245],[612,205,346,115],[612,339,346,111]];
      blocks.forEach(([x,y,w,h],i)=>{rect(c,x,y,w,h,12,['#aac1db','#c0d0e4','#d1deee'][i]);c.strokeStyle='#7f9bbd';c.lineWidth=3;c.strokeRect(x+19,y+20,w-38,h-40);});
      c.fillStyle='#617c9d';c.font='500 26px Aspekta, sans-serif';c.fillText('LESS SWITCHING. MORE SEEING.',63,553);
    }
    const t=new THREE.CanvasTexture(surface);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());contents.push(t);return t;
  }
  await document.fonts.ready;
  const dots=[];
  for(let x=-8;x<=8;x+=.3)for(let y=-3;y<=3;y+=.3)dots.push(x,y,-1.7);
  const dotGeometry=new THREE.BufferGeometry();dotGeometry.setAttribute('position',new THREE.Float32BufferAttribute(dots,3));
  scene.add(new THREE.Points(dotGeometry,new THREE.PointsMaterial({color:0xb9c9de,size:.7,transparent:true,opacity:.35,sizeAttenuation:false})));
  const panels=[], bodies=[];
  // A bounded, feathered contact shadow travels with each window. Unlike the
  // old distant receiving plane, it cannot project beyond the camera framing.
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=768;shadowCanvas.height=512;
  const shadowContext=shadowCanvas.getContext('2d');
  shadowContext.filter='blur(25px)';
  rect(shadowContext,78,78,612,356,20,'rgba(60,87,125,.16)');
  const shadowTexture=new THREE.CanvasTexture(shadowCanvas);
  const shadowGeometry=new THREE.PlaneGeometry(5.35,3.72);
  const shadowMaterial=new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false,toneMapped:false});
  const geometry=new THREE.ExtrudeGeometry(roundShape(4.3,2.6,.12),{depth:.07,bevelEnabled:true,bevelThickness:.027,bevelSize:.025,bevelSegments:3,steps:1,curveSegments:12});
  const face=new THREE.ShapeGeometry(roundShape(4.27,2.57,.1));
  const coords=face.attributes.position; const uv=face.attributes.uv;
  for(let i=0;i<coords.count;i++)uv.setXY(i,(coords.getX(i)+4.27/2)/4.27,(coords.getY(i)+2.57/2)/2.57);
  const sideMaterial=new THREE.MeshStandardMaterial({color:0xd6e0ec,roughness:.5,metalness:.1});
  for(let i=0;i<4;i++){
    const group=new THREE.Group();
    const shadow=new THREE.Mesh(shadowGeometry,shadowMaterial);shadow.position.set(.04,-.09,-.13);group.add(shadow);
    const body=new THREE.Mesh(geometry,sideMaterial);group.add(body);bodies.push(body);
    const front=new THREE.Mesh(face,new THREE.MeshBasicMaterial({map:texture(i)}));front.position.z=.104;group.add(front);
    assembly.add(group);panels.push(group);
  }
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const motion=createMotion(reduce.matches?'grid':'float');
  let paused=false,visible=true,disposed=false,contextLost=false,raf=0,last=0,elapsed=0;
  const pointer=new THREE.Vector2(),tilt=new THREE.Vector2();
  const labels={float:['窗口自由展开','Windows unfolded'],focus:['主窗口与三个辅助窗口','One focus, three supporting windows'],grid:['四个窗口，各就各位','Four windows, all in place']};
  function status(){document.getElementById('scene-status').textContent=labels[motion.requested][document.documentElement.lang==='en'?1:0];}
  function pauseLabel(){const english=document.documentElement.lang==='en';const button=document.getElementById('motion-toggle');button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',paused?(english?'Resume animation':'继续动画'):(english?'Pause animation':'暂停动画'));button.querySelector('img').src=`./assets/icons/${paused?'play':'pause'}.svg`;}
  function pick(value){
    motion.request(value,paused||reduce.matches);
    for(const b of document.querySelectorAll('[data-scene]'))b.setAttribute('aria-pressed',String(b.dataset.scene===motion.requested));
    host.dataset.layout=motion.requested;status();requestFrame();
  }
  for(const b of document.querySelectorAll('[data-scene]'))b.addEventListener('click',()=>{clearTimeout(introTimer);pick(b.dataset.scene);});
  document.getElementById('hero-try').addEventListener('click',()=>{clearTimeout(introTimer);pick(motion.requested==='grid'?'float':'grid');const target=document.getElementById('hero-exhibit');if(scrollTo)scrollTo(target);else target.scrollIntoView({behavior:reduce.matches?'instant':'smooth',block:'center'});});
  document.getElementById('motion-toggle').addEventListener('click',()=>{paused=!paused;clearTimeout(introTimer);pauseLabel();requestFrame();});
  document.addEventListener('site-language',()=>{status();pauseLabel();});
  let pendingPointer;
  host.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||paused||reduce.matches)return;pendingPointer=[e.clientX,e.clientY];requestFrame();});
  host.addEventListener('pointerleave',()=>{pendingPointer=undefined;pointer.set(0,0);requestFrame();});
  function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;const aspect=w/h;const vh=Math.max(7.1,12.2/aspect);camera.left=-vh*aspect/2;camera.right=vh*aspect/2;camera.top=vh/2;camera.bottom=-vh/2;camera.updateProjectionMatrix();renderer.setSize(w,h,false);requestFrame();}
  const observer=new ResizeObserver(resize);observer.observe(host);
  const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible){last=0;requestFrame();}else{cancel(raf);raf=0;}},{threshold:.02});intersection.observe(host);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancel(raf);raf=0;}else{last=0;requestFrame();}});
  reduce.addEventListener('change',()=>{clearTimeout(introTimer);motion.request(motion.requested,true);pointer.set(0,0);requestFrame();});
  // Opt-in browser QA records bounds of the actual meshes passed to WebGL.
  // It stays out of the normal rendering loop unless the audit URL is used.
  const auditEnabled=new URLSearchParams(location.search).has('scene-audit');
  const audit={frames:0,overlaps:0,clipped:0,minGap:Infinity};
  function auditFrame(){
    assembly.updateMatrixWorld(true);
    const boxes=bodies.map(body=>new THREE.Box3().setFromObject(body));
    for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
      const a=boxes[i],b=boxes[j];
      const gap=Math.max(b.min.x-a.max.x,a.min.x-b.max.x,b.min.y-a.max.y,a.min.y-b.max.y);
      audit.minGap=Math.min(audit.minGap,gap);if(gap<0)audit.overlaps++;
    }
    for(const panel of panels){const b=new THREE.Box3().setFromObject(panel);if(b.min.x<camera.left||b.max.x>camera.right||b.min.y<camera.bottom||b.max.y>camera.top)audit.clipped++;}
    audit.frames++;host.dataset.audit=JSON.stringify({...audit,minGap:Number(audit.minGap.toFixed(4))});
  }
  function requestFrame(){if(!raf&&!disposed&&!contextLost&&visible&&!document.hidden)raf=request(frame);}
  function frame(now){
    raf=0;const dt=Math.min((now-(last||now))/1000,.04);last=now;
    if(pendingPointer){const r=host.getBoundingClientRect();pointer.set((pendingPointer[0]-r.left)/r.width-.5,(pendingPointer[1]-r.top)/r.height-.5);pendingPointer=undefined;}
    const moving=!paused&&!reduce.matches;
    if(moving)elapsed+=dt;
    const poses=motion.step(dt,elapsed,moving);
    for(let i=0;i<panels.length;i++){
      const v=poses[i],p=panels[i];
      p.position.set(v[0],v[1],v[2]);p.rotation.set(v[3],v[4],v[5]);p.scale.setScalar(v[6]);
    }
    if(moving)tilt.lerp(pointer,.05);
    assembly.rotation.y=tilt.x*.075;assembly.rotation.x=tilt.y*.045;
    if(auditEnabled)auditFrame();
    renderer.render(scene,camera);
    if(auditEnabled)canvas.dataset.frames=String(Number(canvas.dataset.frames||0)+1);
    if(host.dataset.settled!==String(motion.settled))host.dataset.settled=String(motion.settled);
    if(host.dataset.phase!==motion.phase)host.dataset.phase=motion.phase;
    if(host.dataset.currentLayout!==motion.current)host.dataset.currentLayout=motion.current;
    if(moving&&(!motion.settled||motion.current==='float'||tilt.distanceTo(pointer)>.00005))requestFrame();
  }
  panels.forEach((p,i)=>{const v=motion.poses[i];p.position.set(v[0],v[1],v[2]);p.rotation.set(v[3],v[4],v[5]);p.scale.setScalar(v[6]);});
  let introTimer=setTimeout(()=>{if(!paused&&!reduce.matches&&visible)pick('grid');},2400);
  for(const b of document.querySelectorAll('[data-scene]'))b.setAttribute('aria-pressed',String(b.dataset.scene===motion.requested));
  resize();status();pauseLabel();host.classList.add('is-ready');host.dataset.renderer='three-webgl';host.dataset.layout=motion.requested;
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();contextLost=true;cancel(raf);raf=0;host.classList.remove('is-ready');host.dataset.renderer='static-fallback';document.getElementById('scene-status').textContent=document.documentElement.lang==='en'?'Static illustration':'静态插画模式';document.querySelector('.scene-controls').hidden=true;document.getElementById('motion-toggle').hidden=true;document.getElementById('hero-try').hidden=true;});
  window.addEventListener('pageshow',()=>{last=0;requestFrame();});
  window.addEventListener('pagehide',e=>{if(e.persisted){cancel(raf);raf=0;return;}disposed=true;clearTimeout(introTimer);cancel(raf);observer.disconnect();intersection.disconnect();geometry.dispose();face.dispose();shadowTexture.dispose();shadowGeometry.dispose();shadowMaterial.dispose();contents.forEach(t=>t.dispose());renderer.dispose();});
}
