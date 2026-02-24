
// Enemy manager
function EnemyManager(assets){
  this.assets = assets;
  this.enemies = [];
  this.phaseTime = 0;
  this.spawnPhase = 0;
  this.loop = 0;
  this.bombs = [];
  this.reset();
}
EnemyManager.prototype.reset = function(){
  this.enemies = [
    {type:'franken', x:120, y:72, t:0},
    {type:'dracula', x:40, y:52, t:1},
    {type:'fishman', x:170, y:96, t:2},
    {type:'mummy', x:90, y:30, t:3},
    {type:'skeleton', x:140, y:10, t:4}
  ];
  this.phaseTime = 0; this.spawnPhase=0; this.loop=0; this.bombs=[];
};
EnemyManager.prototype.update = function(dt, player){
  this.phaseTime += dt;
  // simple behaviors based on time and type
  for(let e of this.enemies){
    e.t = (e.t + dt*0.5)%10;
    if(e.type==='franken'){
      // arms up/down change - we'll use t to decide dangerous moment
      e.armsUp = Math.floor(e.t*2)%2===0;
    }else if(e.type==='dracula'){
      e.isBat = Math.floor(this.phaseTime)%5 < 2;
    }else if(e.type==='fishman'){
      e.out = (Math.floor(this.phaseTime)%6) < 2;
    }else if(e.type==='mummy'){
      // drop bombs occasionally
      if(Math.random() < 0.004 + this.loop*0.001) this.bombs.push({x:e.x+10,y:e.y+20,vy:40});
    }else if(e.type==='skeleton'){
      // patrol near top
      e.x += Math.sin(this.phaseTime*2)*0.5;
    }
  }
  // update bombs
  for(let b of this.bombs) b.y += b.vy*dt;
  // remove bombs offscreen
  this.bombs = this.bombs.filter(b=>b.y<150);
};
EnemyManager.prototype.draw = function(ctx){
  for(let e of this.enemies){
    let img = this.assets['enemy_'+e.type];
    if(img) ctx.drawImage(img, e.x, e.y, 48,48);
    // small state indicators: draw a white rectangle when dangerous
    if(e.type==='franken'){
      if(e.armsUp){ ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.fillRect(e.x+6,e.y+2,36,6); }
    }
    if(e.type==='dracula'){
      if(e.isBat) { ctx.fillStyle='rgba(255,255,255,0.25)'; ctx.fillRect(e.x,e.y,48,48); }
    }
  }
  // bombs
  ctx.fillStyle='#fff';
  for(let b of this.bombs) ctx.fillRect(b.x,b.y,8,8);
};
EnemyManager.prototype.checkCollisions = function(player){
  // simple collision tests - return 'hit' if player touches dangerous area
  for(let e of this.enemies){
    if(e.type==='franken' && e.armsUp){
      // if player is under arms area (x overlap)
      if(player.x+player.w > e.x+6 && player.x < e.x+42 && player.y > e.y+6) return true;
    }
    if(e.type==='dracula' && !e.isBat){
      if(Math.abs(player.x - e.x) < 28 && Math.abs(player.y - e.y) < 28) return true;
    }
    if(e.type==='fishman' && e.out){
      if(player.x+player.w > e.x && player.x < e.x+40 && player.y > e.y) return true;
    }
    // bombs
    for(let b of this.bombs){
      if(player.x < b.x+8 && player.x+player.w > b.x && player.y < b.y+8 && player.y+player.h > b.y) return true;
    }
  }
  return false;
};
