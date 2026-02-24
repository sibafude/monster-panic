
// simple WebAudio beep manager
const Sound = (function(){
  let ctx = null;
  let enabled = true;
  function ensure(){
    if(!ctx){
      try{ ctx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ ctx=null; }
    }
  }
  function beep(freq=880, time=0.08, type='square'){
    if(!enabled) return;
    ensure();
    if(!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime+0.01);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+time);
    o.stop(ctx.currentTime+time+0.02);
  }
  function toggle(){ enabled = !enabled; return enabled; }
  function isEnabled(){ return enabled; }
  return {beep, toggle, isEnabled};
})();
