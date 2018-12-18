function load(){
   video.play(2);
 }
 var pause = document.getElementById('pause');
 var play = document.getElementById('play');

 function playVideo() {
   pause.style.display = 'block';
   play.style.display = 'none';
 }

 function fullscreen(){ 
   var elem =document.getElementById("playBack");
   var requestFullScreen=function(element) {
     //在ie下可行 
     var requestMethod =element.requestFullScreen
             ||element.webkitRequestFullScreen //谷歌
             ||element.mozRequestFullScreen  //火狐
             ||element.msRequestFullScreen; //IE11
     if (requestMethod) {     
       requestMethod.call(element);   //执行这个请求的方法
     } else if (typeof window.ActiveXObject !== "undefined") {  //window.ActiveXObject判断是否支持ActiveX控件    
       //这里其实就是模拟了按下键盘的F11，使浏览器全屏
       var wscript = new ActiveXObject("WScript.Shell"); //创建ActiveX  
       if (wscript !== null) {    //创建成功
           wscript.SendKeys("{F11}");//触发f11   
       }   
     }
   }
   requestFullScreen(elem);
 }

 function pauseVideo() {
   play.style.display = 'block';
   pause.style.display = 'none';
 }

 var progress = document.getElementById('progress');
 var progress_bar = document.getElementById('progress_bar');
 var progress_mask = document.getElementById('progress_mask');
 var ptxt = document.getElementById('progress_tips');
 var progress_barleft = 0;
 
 ptxt.innerHTML = "0%";
 progress_bar.onmousedown = function(event){
   var event = event || window.event;
   var leftVal = event.clientX - this.offsetLeft;
   var that = this;
     // 拖动一定写到 down 里面才可以
   document.onmousemove = function(event){
     var event = event || window.event;
     progress_barleft = event.clientX - leftVal;
     if(progress_barleft < 0) {
       progress_barleft = 0;
     }
     else if(progress_barleft > progress.offsetWidth - progress_bar.offsetWidth) {
       progress_barleft = progress.offsetWidth - progress_bar.offsetWidth;
     }
     
     progress_mask.style.width = progress_barleft +'px' ;
     that.style.left = progress_barleft + "px";

     ptxt.innerHTML = parseInt(progress_barleft/(progress.offsetWidth-progress_bar.offsetWidth) * 100) + "%";

     //防止选择内容--当拖动鼠标过快时候，弹起鼠标，bar也会移动，修复bug
     window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
   }

 }
 document.onmouseup = function(){
   document.onmousemove = null; //弹起鼠标不做任何操作
 }