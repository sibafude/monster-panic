
// main entry
(function(){
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  // fixed internal resolution
  const IW = 240, IH=180;
  function resize(){
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = IW * ratio;
    canvas.height = IH * ratio;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(ratio,0,0,ratio,0,0);
    ctx.imageSmoothingEnabled = false;
  }
  window.addEventListener('resize', resize);
  resize();

  // load assets images
  const assets = {};
  const imgNames = ['player','enemy_franken','enemy_dracula','enemy_fishman','enemy_mummy','enemy_skeleton','sword','bomb','ui_button','tile'];
  let loaded=0;
  function loadAll(cb){
    for(let name of imgNames){
      const img = new Image();
      img.src = 'images/'+name+'.png';
      img.onload = ()=>{ assets[name]=img; loaded++; if(loaded===imgNames.length) cb(); };
    }
  }

  // input
  const input = {left:false,right:false,jump:false,attack:false};
  function setupControls(){
    const left = document.getElementById('left');
    const right = document.getElementById('right');
    const jump = document.getElementById('jump');
    const attack = document.getElementById('attack');
    function bind(el, key){
      el.addEventListener('touchstart', e=>{ e.preventDefault(); input[key]=true; }, {passive:false});
      el.addEventListener('touchend', e=>{ e.preventDefault(); input[key]=false; }, {passive:false});
      el.addEventListener('mousedown', e=>{ input[key]=true; });
      el.addEventListener('mouseup', e=>{ input[key]=false; });
    }
    bind(left,'left'); bind(right,'right'); bind(jump,'jump'); bind(attack,'attack');
  }

  // game objects
  let player, enemies, ui;
  function initGame(){
    player = new Player(assets['player']);
    enemies = new EnemyManager(assets);
    ui = new UIManager();
    ui.reset();
  }

  // game state
  let last=performance.now(), gameOver=false;
  function tick(ts){
    const dt = Math.min(0.05, (ts-last)/1000);
    last = ts;
    // update
    player.update(dt, input);
    enemies.update(dt, player);
    if(enemies.checkCollisions(player)){
      // player hit
      Sound.beep(200,0.18);
      gameOver=true;
    }
    // draw
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // background tiles
    if(assets['tile']){
      for(let y=0;y<IH;y+=64){ for(let x=0;x<IW;x+=64){ ctx.drawImage(assets['tile'], x, y, 64,64); } }
    }else{ ctx.fillStyle='#111'; ctx.fillRect(0,0,IW,IH); }
    // draw player/enemies/ui
    enemies.draw(ctx);
    player.draw(ctx);
    // HUD is handled by HTML overlay update
    if(gameOver){
      ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(20,60,200,60);
      ctx.fillStyle='#fff'; ctx.font='16px monospace'; ctx.fillText('GAME OVER',80,95);
    }else{
      requestAnimationFrame(tick);
    }
  }

  loadAll(()=>{
    setupControls();
    initGame();
    requestAnimationFrame(tick);
  });

  // expose for debugging
  window._MP = {player:()=>player};
})();
