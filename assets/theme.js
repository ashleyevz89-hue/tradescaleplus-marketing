/* tradescaleplus.com: the light and dark switch (28 Oct 2026).
   Every page has a switch in the nav (over 480px wide) and one in the footer, and a one-line script in its head that
   applies a saved choice before the page is drawn, so there is no flash. This file runs the switches: a click flips
   the theme, keeps the choice on this device (localStorage "tsp-theme") and updates every switch's label.
   With nothing saved the site is dark, whatever the device is set to. The colours themselves: assets/site.css. */
(function(){
  "use strict";
  var bs=document.querySelectorAll(".theme");
  if(!bs.length)return;
  var root=document.documentElement;
  function cur(){return root.getAttribute("data-theme")==="light"?"light":"dark";}
  function label(){
    var c=cur();
    for(var i=0;i<bs.length;i++)bs[i].setAttribute("aria-label",c==="light"?"Switch to dark theme":"Switch to light theme");
  }
  function flip(){
    var n=cur()==="light"?"dark":"light";
    root.setAttribute("data-theme",n);
    try{localStorage.setItem("tsp-theme",n);}catch(e){}
    label();
  }
  for(var j=0;j<bs.length;j++)bs[j].addEventListener("click",flip);
  /* a choice made in another tab of the site follows here too */
  addEventListener("storage",function(e){
    if(e.key==="tsp-theme"&&(e.newValue==="light"||e.newValue==="dark")){root.setAttribute("data-theme",e.newValue);label();}
  });
  label();
})();
