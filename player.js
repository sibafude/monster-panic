
// Player class
function Player(img){
  this.img = img;
  this.x = 40;
  this.y = 100;
  this.vy = 0;
  this.w = 32;
  this.h = 32;
  this.onGround = true;
  this.facing = 1;
  this.attacking = false;
}
Player.prototype.update = function(dt, input){
  // horizontal
  if(input.left){ this.x -= 80*dt; this.facing=-1; }
  if(input.right){ this.x += 80*dt; this.facing=1; }
  // gravity/jump
  if(input.jump && this.onGround){ this.vy = -180; this.onGround=false; Sound.beep(880,0.06); }
  this.vy += 600*dt;
  this.y += this.vy*dt;
  if(this.y >= 100){ this.y = 100; this.vy = 0; this.onGround = true; }
  // attack (simple cooldown)
  if(input.attack && !this.attacking){
    this.attacking = true;
    setTimeout(()=>{ this.attacking=false; }, 220);
    Sound.beep(1200,0.06);
  }
  // clamp
  if(this.x < 8) this.x = 8;
  if(this.x > 200) this.x = 200;
};
Player.prototype.draw = function(ctx, scale){
  if(this.img){
    ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
  }else{
    ctx.fillStyle='#fff'; ctx.fillRect(this.x,this.y,this.w,this.h);
  }
  // attack indicator
  if(this.attacking){
    ctx.fillStyle='rgba(255,255,255,0.4)';
    if(this.facing>0) ctx.fillRect(this.x+this.w, this.y+6, 12,12);
    else ctx.fillRect(this.x-12, this.y+6, 12,12);
  }
};
