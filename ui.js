
// UI helper
function UIManager(){
  this.score = 0;
  this.scoreEl = document.getElementById('score');
  this.soundBtn = document.getElementById('btn-sound');
  this.soundBtn.onclick = ()=>{ const s = Sound.toggle(); this.soundBtn.textContent = s? 'SND' : 'MUTE'; };
}
UIManager.prototype.addScore = function(n){ this.score += n; this.update(); Sound.beep(900,0.06); };
UIManager.prototype.reset = function(){ this.score = 0; this.update(); };
UIManager.prototype.update = function(){ this.scoreEl.textContent = 'SCORE: '+this.score; };
