/* tradescaleplus.com: the phone menu.
   The menu button (#tsp-burger) opens and closes the drawer (#tsp-drawer). Rewritten in November 2026: the focus moves
   into the drawer when it opens and back to the button when it closes, Tab stays inside it while it is open, Escape and a
   tap on any link close it, and widening the window shuts it. The button and the drawer are in every page's HTML;
   assets/mobile-nav.css shows and styles them. */
(function(){
  "use strict";
  function init(){
    var burger=document.getElementById("tsp-burger");
    var drawer=document.getElementById("tsp-drawer");
    var nav=document.getElementById("nav");
    if(!burger||!drawer)return;
    var wide=window.matchMedia?window.matchMedia("(min-width: 1181px)"):null;

    function isOpen(){return drawer.getAttribute("data-open")==="true";}
    function set(open,giveFocusBack){
      drawer.setAttribute("data-open",open?"true":"false");
      burger.setAttribute("aria-expanded",open?"true":"false");
      burger.setAttribute("aria-label",open?"Close menu":"Open menu");
      if(nav)nav.classList.toggle("open",open);
      document.body.style.overflow=open?"hidden":"";
      if(open){var first=drawer.querySelector("a");if(first)first.focus();}
      else if(giveFocusBack){burger.focus();}
    }
    burger.addEventListener("click",function(){set(!isOpen(),false);});
    drawer.addEventListener("click",function(e){
      var a=e.target.closest?e.target.closest("a"):null;
      if(a)set(false,false);
    });
    document.addEventListener("keydown",function(e){
      if(!isOpen())return;
      if(e.key==="Escape"){set(false,true);return;}
      if(e.key!=="Tab")return;
      /* keep Tab inside the open menu: the button, the drawer's links and its light and dark switch */
      var items=[burger].concat(Array.prototype.slice.call(drawer.querySelectorAll("a,button")));
      var i=items.indexOf(document.activeElement);
      if(e.shiftKey&&(i<=0)){e.preventDefault();items[items.length-1].focus();}
      else if(!e.shiftKey&&i===items.length-1){e.preventDefault();items[0].focus();}
    });
    if(wide){
      var close=function(){if(wide.matches&&isOpen())set(false,false);};
      if(wide.addEventListener)wide.addEventListener("change",close);else if(wide.addListener)wide.addListener(close);
    }
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
