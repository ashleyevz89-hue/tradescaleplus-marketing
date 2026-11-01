/* tradescaleplus.com: what the pages of the "AI agents for websites" site do when they load (November 2026).
   One file for the five rebuilt pages (home, car dealers, property agencies, any website, the AI door); the older pages
   keep their own small script. It does six things, each only where the page has the part it needs:
   1. fades blocks in as they scroll into view (once; none of it when the visitor asks for reduced motion);
   2. gives the top bar its background once the page is scrolled;
   3. dims the background behind the section being read (only while the scroll is moving, not every frame);
   4. rotates the car and property example conversations, and runs their tabs;
   5. copies the two install lines on a tap of the Copy button;
   6. on the home page, loads the moving picture in the ring only on a wide screen, only when it is near the screen, and
      never on a phone, in data-saver mode or with reduced motion; and tucks the floating "Try the live demo" button away. */
(function(){
"use strict";
var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 1. entrance reveals: one recipe, staggered, fire once ---------- */
Array.prototype.forEach.call(document.querySelectorAll("[data-stag]"),function(g){
  Array.prototype.forEach.call(g.children,function(c,i){c.style.transitionDelay=Math.min(i*0.1,0.9).toFixed(2)+"s";});
});
var rvs=Array.prototype.slice.call(document.querySelectorAll(".rv"));
function showAll(){rvs.forEach(function(e){e.classList.add("in");});}
if(!("IntersectionObserver" in window)||reduce){showAll();}
else{
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});
  },{threshold:.12,rootMargin:"0px 0px -6% 0px"});
  rvs.forEach(function(e){io.observe(e);});
  requestAnimationFrame(function(){
    rvs.forEach(function(e){var r=e.getBoundingClientRect();if(r.top<innerHeight*.92)e.classList.add("in");});
  });
}

/* ---------- 2. the top bar ---------- */
var nav=document.getElementById("nav");
function navState(){if(nav)nav.classList.toggle("on",scrollY>10);}
addEventListener("scroll",navState,{passive:true});navState();

/* ---------- 3. the veil behind the section being read ---------- */
var veil=document.getElementById("veil");
var veilEls=Array.prototype.slice.call(document.querySelectorAll("[data-veil]"));
var vC=.85,vT=.87,vRaf=0;
function veilTarget(){
  var mid=innerHeight*.5,t=.87;
  for(var i=0;i<veilEls.length;i++){
    var r=veilEls[i].getBoundingClientRect();
    if(r.top<=mid&&r.bottom>=mid){t=parseFloat(veilEls[i].getAttribute("data-veil"));break;}
  }
  return t;
}
function veilStep(){
  vRaf=0;
  vC+=(vT-vC)*.14;
  if(Math.abs(vT-vC)<.004)vC=vT;
  veil.style.opacity=vC.toFixed(3);
  if(vC!==vT)vRaf=requestAnimationFrame(veilStep);
}
function veilUpdate(){
  if(!veil)return;
  vT=veilTarget();
  if(reduce){vC=vT;veil.style.opacity=vT.toFixed(3);return;}
  if(!vRaf)vRaf=requestAnimationFrame(veilStep);
}
addEventListener("scroll",veilUpdate,{passive:true});
addEventListener("resize",veilUpdate);
veilUpdate();

/* ---------- 4. the example conversations ---------- */
var vw=document.querySelector("[data-vignettes]");
if(vw){
  var tabs=Array.prototype.slice.call(vw.querySelectorAll(".vtab"));
  var panels=Array.prototype.slice.call(vw.querySelectorAll(".vstack>.convo"));
  var cur=0,stopped=false,hover=false;
  var show=function(i){
    cur=i;
    panels.forEach(function(p,k){
      if(k===i){p.removeAttribute("data-off");p.removeAttribute("aria-hidden");}
      else{p.setAttribute("data-off","");p.setAttribute("aria-hidden","true");}
    });
    tabs.forEach(function(t,k){t.setAttribute("aria-selected",k===i?"true":"false");t.tabIndex=k===i?0:-1;});
  };
  tabs.forEach(function(t,k){
    t.addEventListener("click",function(){stopped=true;show(k);});
    t.addEventListener("keydown",function(e){
      if(e.key!=="ArrowRight"&&e.key!=="ArrowLeft")return;
      e.preventDefault();stopped=true;
      var n=(k+(e.key==="ArrowRight"?1:tabs.length-1))%tabs.length;
      show(n);tabs[n].focus();
    });
  });
  vw.addEventListener("mouseenter",function(){hover=true;});
  vw.addEventListener("mouseleave",function(){hover=false;});
  vw.addEventListener("focusin",function(){stopped=true;});
  show(0);
  /* the example changes by itself every eight seconds until the visitor chooses one, and not at all with reduced motion */
  if(!reduce){
    setInterval(function(){if(stopped||hover||document.hidden)return;show((cur+1)%panels.length);},8000);
  }
}

/* ---------- 5. copy the install lines ---------- */
Array.prototype.forEach.call(document.querySelectorAll("[data-copy]"),function(b){
  var label=b.textContent;
  b.addEventListener("click",function(){
    var src=document.getElementById(b.getAttribute("data-copy"));
    if(!src)return;
    var text=src.innerText.replace(/\n{2,}/g,"\n").trim();
    function done(ok){b.textContent=ok?"Copied":"Press Ctrl+C to copy";setTimeout(function(){b.textContent=label;},2200);}
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){done(true);},function(){done(false);});
    }else{
      try{var r=document.createRange();r.selectNodeContents(src);var s=getSelection();s.removeAllRanges();s.addRange(r);done(document.execCommand("copy"));}
      catch(e){done(false);}
    }
  });
});

/* ---------- 6. home page: the moving picture, and the floating button ---------- */
var video=document.getElementById("bgv");
if(video){
  var conn=navigator.connection||{};
  var saver=!!conn.saveData||/(^|-)2g$/.test(conn.effectiveType||"");
  var wide=window.matchMedia&&window.matchMedia("(min-width: 821px)").matches;
  if(wide&&!saver&&!reduce&&"IntersectionObserver" in window){
    var vio=new IntersectionObserver(function(en){
      if(!en[0].isIntersecting)return;
      vio.disconnect();
      video.addEventListener("playing",function(){video.classList.add("on");});
      video.src=video.getAttribute("data-src");
      video.load();
      var p=video.play();if(p&&p.catch)p.catch(function(){});
    },{rootMargin:"400px 0px"});
    vio.observe(video);
  }
}
var live=document.querySelector(".cw-live"),hero=document.getElementById("top");
if(live&&hero&&"IntersectionObserver" in window){
  new IntersectionObserver(function(en){live.classList.toggle("away",en[0].isIntersecting);}).observe(hero);
}
/* on phones the button also tucks away while the reader scrolls down, so it never sits over what they are reading;
   a scroll up, or the end of the page, brings it back */
if(live&&window.matchMedia&&matchMedia("(max-width:820px)").matches){
  var lastY=scrollY;
  addEventListener("scroll",function(){
    var y=scrollY,end=y+innerHeight>=document.documentElement.scrollHeight-120;
    if(end||y<lastY-6)live.classList.remove("tuck");else if(y>lastY+6)live.classList.add("tuck");
    lastY=y;
  },{passive:true});
}
})();
