/* Little Dance Club — original models, animation and playback of the full MIDI theme song. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let dancing = false, dance = 'bounce', danceTime = 0, lastTime = 0;
  let soundOn = true, musicFailed = false, musicRequest = 0;
  const music = new window.ThemeSongPlayer(window.THEME_SONG_MIDI);
  music.volume = .45;
  const helloUntil = [0, 0];
  const speech = $('speech');
  let speechTimer;
  function say(message) {
    speech.textContent = message;
    clearTimeout(speechTimer);
    speechTimer = setTimeout(() => { speech.innerHTML = 'Hey, dancing buddy! <span aria-hidden="true">♡</span>'; }, 3200);
  }

  function updateSound() {
    $('sound').setAttribute('aria-pressed', String(soundOn && !musicFailed));
    $('sound').setAttribute('aria-label', musicFailed ? 'Retry music playback' : soundOn ? 'Turn music off' : 'Turn music on');
    $('sound-label').textContent = musicFailed ? 'Retry sound' : soundOn ? 'Sound on' : 'Sound off';
    music.muted = !soundOn;
  }
  async function startMusic() {
    const request = ++musicRequest;
    musicFailed = false;
    updateSound();
    try {
      // Called in the dance-button handler so one tap unlocks browser audio.
      await music.play();
      if (request !== musicRequest || !dancing || document.hidden) {
        if (!dancing || document.hidden) music.pause();
      }
    } catch (error) {
      if (request !== musicRequest || error.name === 'AbortError') return;
      console.warn('Music could not start:', error);
      say('Tap Retry sound to try again. ♡');
      musicFailed = true;
      updateSound();
    }
  }
  function pauseMusic() {
    ++musicRequest;
    // Preserve the MIDI clock so the next dance tap resumes the same notes.
    music.pause();
  }
  $('sound').addEventListener('click', () => {
    soundOn = musicFailed || !soundOn;
    musicFailed = false;
    updateSound();
    if (soundOn) {
      dancing = true;
      updateDanceButton();
      startMusic();
    }
  });
  function updateDanceButton() {
    $('play').setAttribute('aria-pressed', String(dancing));
    $('play-label').textContent = dancing ? 'Take a break' : 'Let’s dance!';
    $('play-icon').textContent = dancing ? 'Ⅱ' : '▶';
  }
  $('play').addEventListener('click', () => {
    dancing = !dancing;
    updateDanceButton();
    if (dancing) {
      startMusic();
      say('You’ve got the moves! ♡');
    } else {
      pauseMusic();
      say('And… a little rest. ♡');
    }
  });
  document.addEventListener('visibilitychange', () => {
    lastTime = 0;
    if (document.hidden) pauseMusic();
    else if (dancing) startMusic();
  });
  document.querySelectorAll('.dance').forEach(button => button.addEventListener('click', () => {
    dance = button.dataset.dance;
    danceTime = 0;
    document.querySelectorAll('.dance').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
    say({ bounce: 'Bounce, bounce, little friend! ↟', wiggle: 'Wiggle like a noodle! 〰', spin: 'Round and round we go! ♡' }[dance]);
  }));
  let lastConfetti = 0;
  $('celebrate').addEventListener('click', () => {
    if (performance.now() - lastConfetti < 550) return;
    lastConfetti = performance.now();
    say('Hip hip hooray! You’re amazing! ♡');
    if (reducedMotion.matches) return;
    const colors = ['#efaeab', '#f3cc62', '#93b98d', '#b6a3d9', '#f7f2d8', '#91c5ce'];
    for (let i = 0; i < 65; i++) {
      const bit = document.createElement('i');
      bit.className = 'confetti-bit';
      bit.style.cssText = `left:${Math.random()*100}%;background:${colors[i%colors.length]};--duration:${2+Math.random()*1.8}s;--delay:${Math.random()*.5}s;--drift:${Math.random()*160-80}px;${i%3===0?'border-radius:50%;width:10px;height:10px;':''}`;
      $('confetti').appendChild(bit);
      setTimeout(() => bit.remove(), 4500);
    }
  });

  try {
    if (!window.THREE) throw new Error('Three.js unavailable');
    createScene();
  } catch (error) {
    console.error('The dance stage could not start:', error);
    $('fallback').hidden = false;
  }

  function createScene() {
    const T = THREE;
    const container = $('scene');
    const scene = new T.Scene();
    scene.background = new T.Color('#dcefdc');
    scene.fog = new T.Fog('#dcefdc', 22, 55);
    const camera = new T.OrthographicCamera(-7, 7, 4, -4, .1, 100);
    camera.position.set(0, 6.7, 13);
    camera.lookAt(0, 1.0, 0);
    const renderer = new T.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.28;
    container.appendChild(renderer.domElement);
    scene.add(new T.HemisphereLight('#fff9e5', '#9da780', 2.8));
    const sun = new T.DirectionalLight('#fff1d4', 3.1);
    sun.position.set(-4, 9, 6); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left:-8, right:8, top:8, bottom:-8, near:.1, far:28 });
    sun.shadow.normalBias = .035; sun.shadow.bias = -.0002;
    sun.shadow.radius = 4;
    scene.add(sun);
    const mat = (color, extra={}) => new T.MeshStandardMaterial({ color, roughness: .75, ...extra });
    const cream = mat('#fff8e9'), black = mat('#303635'), eyeBlack = mat('#1e2925', { roughness:.2 });
    const blush = mat('#efaaa0'), white = mat('#fffdf5');
    function mesh(geometry, material, parent, x=0,y=0,z=0) {
      const m = new T.Mesh(geometry,material); m.position.set(x,y,z); m.castShadow=true; m.receiveShadow=true; parent.add(m); return m;
    }
    function ball(parent, material, x,y,z, sx,sy=sx,sz=sx) {
      const m=mesh(new T.SphereGeometry(1,32,24), material,parent,x,y,z); m.scale.set(sx,sy,sz); return m;
    }
    function tube(parent, points, radius, material) {
      return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),24,radius,8,false),material,parent);
    }
    mesh(new T.PlaneGeometry(200,200),mat('#d5e7bd'),scene,0,-.12,0).rotation.x=-Math.PI/2;
    // Soft grassy hills and little lollipop trees frame the play space.
    ball(scene,mat('#b5d19c'),-7,-.6,-7,6,2.4,3);
    ball(scene,mat('#c4dbab'),4,-.7,-10,7,3.1,3.5);
    ball(scene,mat('#a5c58c'),9,-.8,-6,5,2,3);
    function tree(x,z,s=1) {
      const g=new T.Group();g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g);
      mesh(new T.CylinderGeometry(.11,.15,1.8,12),mat('#b5a07b'),g,0,.8,0);
      ball(g,mat('#99bc80'),0,2,0,.72,1,.67);
      ball(g,mat('#a9c58a'),-.35,1.8,.15,.48,.6,.5);
    }
    tree(-5.2,-3,1.15);tree(5,-4,1.2);tree(7.1,-2,.8);tree(-7,-1,.75);
    function cloud(x,y,z,s=1) {
      const g=new T.Group();g.position.set(x,y,z);g.scale.setScalar(s);scene.add(g);
      const cm=mat('#fffdef');
      ball(g,cm,0,0,0,.7,.25,.3);ball(g,cm,-.28,.16,0,.35,.32,.3);ball(g,cm,.16,.23,0,.4,.38,.3);ball(g,cm,.5,.08,0,.3,.23,.28);
      return g;
    }
    const clouds=[cloud(-4.6,4.5,-6,1.25),cloud(4.6,4.9,-8,1.4),cloud(.5,5.6,-12,.8)];
    const sunBall=ball(scene,mat('#ffe1a0',{emissive:'#f2c174',emissiveIntensity:.15}),-5,5.6,-9,.49);
    // A rounded, candy-colored platform.
    const stage = new T.Group();scene.add(stage);
    mesh(new T.CylinderGeometry(3.65,3.65,.2,96),mat('#d89d9b'),stage,0,.04,0);
    mesh(new T.CylinderGeometry(3.66,3.66,.10,96),mat('#f2c1ba'),stage,0,.18,0);
    const rim=mesh(new T.TorusGeometry(3.60,.055,12,96),mat('#f8d9c9'),stage,0,.235,0);rim.rotation.x=Math.PI/2;
    const inner=mesh(new T.TorusGeometry(2.95,.012,8,96),mat('#e4aba7'),stage,0,.238,0);inner.rotation.x=Math.PI/2;
    // Procedural wood grain keeps the whole project independent of remote assets.
    const woodCanvas=document.createElement('canvas');woodCanvas.width=512;woodCanvas.height=512;
    const ctx=woodCanvas.getContext('2d');ctx.fillStyle='#c59662';ctx.fillRect(0,0,512,512);
    for(let i=0;i<54;i++) {
      ctx.strokeStyle=i%3===0?'#aa784b66':'#e3b98288';ctx.lineWidth=i%3===0?2.2:1.2;ctx.beginPath();
      const start=i*10;
      for(let y=0;y<=512;y+=8) { const x=start+Math.sin(y*.018+i*1.5)*3+Math.sin(y*.04+i)*1.3; y===0?ctx.moveTo(x,y):ctx.lineTo(x,y); }
      ctx.stroke();
    }
    const texture=new T.CanvasTexture(woodCanvas);texture.colorSpace=T.SRGBColorSpace;
    const wood=mat('#ffffff',{map:texture});
    const woodEnd=mat('#dab17d');
    const tung=new T.Group();tung.position.set(-1.5,.25,.05);scene.add(tung);
    const tungBody=new T.Group();tung.add(tungBody);
    mesh(new T.CylinderGeometry(.51,.49,1.88,48),wood,tungBody,0,1.63,0);
    ball(tungBody,woodEnd,0,2.56,0,.51,.14,.51);
    ball(tungBody,wood,0,.71,0,.49,.16,.49);
    for(let r=.12;r<.5;r+=.105) {const ring=mesh(new T.TorusGeometry(r,.009,6,48),mat('#bd925e'),tungBody,0,2.687-r*.045,0);ring.rotation.x=-Math.PI/2;}
    // Large soft eyes, rosy cheeks, and an open little smile.
    function eyes(parent,y,z,spacing,size) {
      [-1,1].forEach(side=>{
        ball(parent,white,side*spacing,y,z,size,size*1.17,size*.47);
        ball(parent,eyeBlack,side*spacing+.025,y-.012,z+size*.4,size*.48,size*.65,size*.23);
        ball(parent,white,side*spacing+.002,y+.045,z+size*.61,size*.15);
      });
    }
    eyes(tungBody,1.94,.464,.205,.167);
    ball(tungBody,woodEnd,0,1.67,.56,.09,.12,.09);
    [-1,1].forEach(s=>ball(tungBody,blush,s*.34,1.62,.397,.105,.058,.038));
    ball(tungBody,black,0,1.43,.49,.16,.13,.035);
    ball(tungBody,blush,0,1.38,.523,.095,.046,.015);
    function limb(parent,x,y,z,material,length,radius) {
      const g=new T.Group();g.position.set(x,y,z);parent.add(g);
      mesh(new T.CylinderGeometry(radius,radius*.85,length,16),material,g,0,-length/2,0);
      ball(g,material,0,-length,0,radius*1.12);
      return g;
    }
    const tungArms=[limb(tungBody,-.5,1.83,0,wood,.64,.085),limb(tungBody,.5,1.83,0,wood,.64,.085)];
    tungArms[0].rotation.z=-.5;tungArms[1].rotation.z=.5;
    const tungLegs=[limb(tung,-.23,.74,0,wood,.44,.09),limb(tung,.23,.74,0,wood,.44,.09)];
    tungLegs.forEach(leg=>ball(leg,woodEnd,0,-.48,.11,.18,.12,.28));
    // Panda's oversized head and rounded paws make a friendly toy silhouette.
    const panda=new T.Group();panda.position.set(1.5,.25,.05);scene.add(panda);
    const pandaBody=new T.Group();panda.add(pandaBody);
    ball(pandaBody,black,0,.96,0,.60,.66,.46);
    ball(pandaBody,cream,0,1.17,.12,.56,.62,.45);
    ball(pandaBody,cream,0,2.03,0,.74,.65,.57);
    [-1,1].forEach(s=>{
      ball(pandaBody,black,s*.54,2.54,-.04,.25,.26,.20);
      ball(pandaBody,mat('#626357'),s*.54,2.55,.13,.125,.14,.025);
      const patch=ball(pandaBody,black,s*.275,2.09,.495,.205,.25,.065);patch.rotation.z=s*-.26;
      ball(pandaBody,white,s*.268,2.12,.552,.104,.125,.035);
      ball(pandaBody,eyeBlack,s*.268-.014,2.10,.582,.064,.078,.026);
      ball(pandaBody,white,s*.268-.031,2.13,.606,.023);
      ball(pandaBody,blush,s*.48,1.89,.434,.12,.065,.025);
    });
    ball(pandaBody,white,0,1.86,.52,.26,.18,.10);
    ball(pandaBody,black,0,1.94,.616,.085,.06,.035);
    tube(pandaBody,[[-.12,1.83,.61],[0,1.79,.632],[.12,1.83,.61]],.016,black);
    // A tiny sage bow tie.
    const bow=mat('#9db77f');
    const bowL=ball(pandaBody,bow,-.11,1.51,.5,.14,.09,.065);bowL.rotation.z=-.3;
    const bowR=ball(pandaBody,bow,.11,1.51,.5,.14,.09,.065);bowR.rotation.z=.3;
    ball(pandaBody,bow,0,1.51,.56,.065);
    const pandaArms=[new T.Group(),new T.Group()];
    pandaArms.forEach((g,i)=>{g.position.set(i===0?-.51:.51,1.43,0);pandaBody.add(g);ball(g,black,0,-.29,0,.19,.43,.2);ball(g,black,0,-.57,.02,.2,.2,.21);});
    const pandaLegs=[new T.Group(),new T.Group()];
    pandaLegs.forEach((g,i)=>{g.position.set(i===0?-.32:.32,.43,0);panda.add(g);ball(g,black,0,-.15,.1,.25,.27,.33);});
    // Small daisies and pebbles beyond the dance floor.
    function flower(x,z,color) {
      const g=new T.Group();g.position.set(x,0,z);scene.add(g);
      mesh(new T.CylinderGeometry(.018,.018,.28,6),mat('#7d9b64'),g,0,.13,0);
      const petal=mat(color);
      for(let i=0;i<5;i++){const a=i*Math.PI*2/5;ball(g,petal,Math.cos(a)*.09,.30+Math.sin(a)*.09,0,.07,.07,.025);}
      ball(g,mat('#f5cf75'),0,.3,.023,.045,.045,.028);
    }
    flower(-4.1,1.1,'#fff8e3');flower(-4.45,.75,'#fff8e3');flower(4.15,1.0,'#f3b9b1');flower(4.5,.7,'#fff8e3');flower(3.8,-1.4,'#fff8e3');
    [-1,1].forEach(s=>{ball(scene,mat('#b3cba0'),s*4.8,.05,2,.34,.15,.22);ball(scene,mat('#bfd3a7'),s*5.2,.04,2.1,.2,.12,.17);});
    function note(text,color,x,y,z) {
      const c=document.createElement('canvas');c.width=128;c.height=160;
      const cx=c.getContext('2d');cx.font='110px Georgia';cx.textAlign='center';cx.fillStyle=color;cx.fillText(text,64,122);
      const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;
      const spr=new T.Sprite(new T.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));spr.position.set(x,y,z);spr.scale.set(.5,.625,1);scene.add(spr);return spr;
    }
    const notes=[note('♪','#c3a35d',-2.6,2.7,.3),note('♫','#b39ab8',2.65,2.9,.2),note('✦','#f0ce80',-3.3,1.8,.4),note('✦','#faf3cb',3.3,1.85,.3)];
    notes.forEach(n=>n.userData.baseY=n.position.y);
    const raycaster=new T.Raycaster(),pointer=new T.Vector2();
    function greet(index) {
      helloUntil[index]=performance.now()+1800;
      say(index===0?'Tung tung! A big hello to you! ♡':'Panda sends a big bear hug! ♡');
    }
    renderer.domElement.addEventListener('pointerup',event=>{
      const rect=renderer.domElement.getBoundingClientRect();
      pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
      raycaster.setFromCamera(pointer,camera);
      const hits=raycaster.intersectObjects([tung,panda],true);
      if(hits.length){let obj=hits[0].object;while(obj.parent && obj!==tung && obj!==panda)obj=obj.parent;greet(obj===tung?0:1);}
    });
    // The name badges provide the same greeting for keyboard users.
    document.querySelectorAll('.character-label').forEach((label,index)=>{
      label.setAttribute('role','button');label.setAttribute('tabindex','0');
      label.setAttribute('aria-label',index===0?'Say hello to Tung Tung':'Say hello to Panda');
      label.style.pointerEvents='auto';label.style.cursor='pointer';
      label.addEventListener('click',()=>greet(index));
      label.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();greet(index);}});
    });
    function resize() {
      const width=container.clientWidth,height=container.clientHeight;
      renderer.setSize(width,height);
      const aspect=width/height;
      const narrow=width<620;
      const viewWidth=narrow?6.0:Math.max(7.15,aspect*4.4);
      tung.position.x=narrow?-1.3:-1.5;
      panda.position.x=narrow?1.3:1.5;
      camera.lookAt(0,narrow?1.5:1.0,0);
      camera.left=-viewWidth/2;camera.right=viewWidth/2;
      camera.top=viewWidth/aspect/2;camera.bottom=-viewWidth/aspect/2;
      camera.updateProjectionMatrix();
    }
    new ResizeObserver(resize).observe(container);resize();
    function animate(now) {
      requestAnimationFrame(animate);
      if(document.hidden){lastTime=0;return;}
      const dt=lastTime?Math.min((now-lastTime)/1000,.05):0;lastTime=now;
      const motion=reducedMotion.matches ? .35 : 1;
      if(dancing)danceTime+=dt;
      const t=danceTime*2*Math.PI/1.2;
      [tung,panda].forEach((character,index)=>{
        const p=t+index*.5;
        const body=index===0?tungBody:pandaBody;
        const arms=index===0?tungArms:pandaArms;
        const legs=index===0?tungLegs:pandaLegs;
        let hop=0,tilt=0,turn=0;
        if(dancing) {
          if(dance==='bounce'){hop=Math.abs(Math.sin(p))*.29*motion;tilt=Math.sin(p)*.09*motion;}
          if(dance==='wiggle'){tilt=Math.sin(p*1.5)*.20*motion;turn=Math.sin(p)*.3*motion;hop=(1+Math.sin(p*2))*.035*motion;}
          if(dance==='spin'){turn=reducedMotion.matches?Math.sin(p)*.25:t*.47;hop=Math.abs(Math.sin(p))*.13*motion;tilt=Math.sin(p)*.05*motion;}
        }
        character.position.y=.25+hop;
        character.rotation.y=turn;
        body.rotation.z=tilt;
        if(!dancing&&!reducedMotion.matches)body.scale.y=1+Math.sin(now*.0018+index)*.008;
        else body.scale.y=1;
        arms.forEach((arm,side)=>{
          arm.rotation.x=dancing?Math.sin(p+side*2)*.35*motion:0;
          arm.rotation.z=(side===0?-1:1)*(.35+(dancing?(1+Math.sin(p))*.35*motion:0));
        });
        if(now<helloUntil[index]){const wave=now*.014;arms[1].rotation.z=2.4+Math.sin(wave)*.2;arms[1].rotation.x=-.15;}
        legs.forEach((leg,side)=>{leg.rotation.x=dancing?Math.sin(p+(side===0?0:Math.PI))*.3*motion:0;});
      });
      if(!reducedMotion.matches) {
        notes.forEach((n,i)=>{n.position.y=n.userData.baseY+Math.sin(now*.0015+i*2)*.10;n.material.rotation=Math.sin(now*.001+i)*.12;});
        clouds.forEach((c,i)=>c.position.x+=Math.sin(now*.0002+i)*dt*.025);
      }
      renderer.render(scene,camera);
    }
    requestAnimationFrame(animate);
    renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();$('fallback').hidden=false;});
    renderer.domElement.addEventListener('webglcontextrestored',()=>{$('fallback').hidden=true;});
  }
})();
