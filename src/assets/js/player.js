var videoCtrl = {
   btn: {
      pre: null,                          // 上一个(Element)
      play: null,                         // 播放(Element)
      pause: null,                        // 暂停(Element)
      next: null,                         // 下一个(Element)
      slow: null,                         // 慢速(Element)
      fast: null,                         // 快进(Element)
      screen: null,                       // 显示(Element)
      voice: null,                        // 声音(Element)
      barrage: null                       // 弹幕(Element)
   },
   progress: {
      bar: null,                          // 进度条(Element)
      currentBar: null,                   // 当前进度(Element)
      btn: null,                          // 进度调按钮(Element)
      tips: null,                         // 进度提示(Element)
      time: null,                         // 进度时间(Element)
      start: 0,                           // 开始位置（像素）
      current: 0,                         // 当前位置（像素）
      total: 0,                           // 总共位置（像素）
      percentage: 0                       // 进度百分比
   },
   state: {
      play: true,                         // 播放 默认播放
      mute: false,                        // 声音 默认静音
      barrageStart: false,                // 弹幕 默认关闭
      screen: 0,                          // 屏幕 -1异常 0正常 1精简 2全屏
      currentTime: 0,                     // 当前时间
      totalTime: 0,                       // 总共时间
      playSpeed: 1                        // 播放速度
   },
   prompt: {
      playSpeed: null,                    // 播放速度提示(Element)
      currentTime: null                   // 当前时间提示(Element)
   },
   _init: function() {
      // 慢速按钮
      this.btn.slow = document.getElementById('player_back');
      // 加速按钮
      this.btn.fast = document.getElementById('player_forward');
      // 暂停按钮
      this.btn.pause = document.getElementById('pause');
      // 播放按钮
      this.btn.play = document.getElementById('play');
      // 进度条
      this.progress.bar = document.getElementById('progress');
      // 已完成进度条
      this.progress.currentBar = document.getElementById('progress_mask');
      // 进度条按钮
      this.progress.btn = document.getElementById('progress_bar');
      // 进度提示
      this.progress.tips = document.getElementById('progress_tips');
      // 视频速度提示
      this.prompt.playSpeed = document.getElementById('speed');
      // 时间提示
      this.prompt.currentTime = document.getElementById('timer');
      // 进度条总长度
      this.progress.total = this.progress.bar.offsetWidth;
      // 当前时间
      this.state.currentTime = new Date();
      this.prompt.currentTime.innerHTML = this.getTime();
   },
   // 获取currentTime保存的时间
   getTime: function() {
      return `${this.state.currentTime.getHours()} : ${this.state.currentTime.getMinutes()} : ${this.state.currentTime.getSeconds()} `;
   },
   // 传入时间戳，存入currentTime
   setTime: function(time) {
      this.state.currentTime = new Date(time);
   },
   // 获取当前进度条的长度（单位：像素）
   getCurrent: function() {
      this.progress.current = Math.floor(this.progress.currentBar.offsetWidth);
      return this.progress.current;
   },
   // 设置进度的长度（单位：像素）
   setCurrent: function(current) {
      this.progress.currentBar.style.width = current + 'px';
      this.progress.btn.style.left = current + "px";

      this.progress.tips.innerHTML = this.getPercntage();
   },
   // 获取当前进度百分比
   getPercntage: function() {
      this.progress.percentage = Math.floor(this.progress.currentBar.offsetWidth / this.progress.total * 100) + '%';
      return this.progress.percentage;
   },
   // 传入百分比数值(不加'%')去改变进度条长度
   setPercntage(percentage) {
      this.progress.current = this.progress.total * percentage * 0.01;
      this.setCurrent(this.progress.current);
   },
   // 定时器，1秒执行一次，获取时间
   interval: function() {
      return setInterval(() => {
         this.state.currentTime = this.state.currentTime.getTime() + 1000;
         this.state.currentTime = new Date(this.state.currentTime);
         this.prompt.currentTime.innerHTML = this.getTime();
      }, 1000);
   },
   // 慢放限制
   slow: function() {
      if(this.state.playSpeed <= 0.25) {
         return ;
      }

      this.state.playSpeed *= 0.5;
      this.prompt.playSpeed.innerHTML = `x${this.state.playSpeed}倍速`
   },
   // 快放限制
   fast: function() {
      if(this.state.playSpeed >= 4) {
         return ;
      }

      this.state.playSpeed *= 2;
      this.prompt.playSpeed.innerHTML = `x${this.state.playSpeed}倍速`
   },
   // 暂停
   pause: function() {
      this.btn.play.style.display = 'block';
      this.btn.pause.style.display = 'none';

      clearInterval(this.state.play);
   },
   // 播放
   play: function() {
      this.btn.pause.style.display = 'block';
      this.btn.play.style.display = 'none';

      // 设置当前播放进度
      this.setCurrent(this.getCurrent());

      this.state.play = this.interval();
   },
   // 监听进度条操作
   moveAction: function() {
      that = this;
      this.progress.btn.onmousedown = function(event) {
         clearInterval(videoCtrl.state.play);
         var event = event || window.event;
         var leftVal = event.clientX - this.offsetLeft;
         
         document.onmousemove = function(event){
            var event = event || window.event;
            var progress_barleft = event.clientX - leftVal;
            if(progress_barleft < 0) {
               progress_barleft = 0;
            }
            else if(progress_barleft > that.progress.bar.offsetWidth) {
               progress_barleft = that.progress.bar.offsetWidth
            }

            that.progress.current = progress_barleft;
            that.setCurrent(that.progress.current);
      
            //防止选择内容--当拖动鼠标过快时候，弹起鼠标，bar也会移动，修复bug
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
         }
         document.onmouseup = function(){
            document.onmousemove = null;
            videoCtrl.play();
         }
         document.onclick = function() {
            document.onmouseup = null;
         }
      };
   },
   initBar: function() {
      // 绑定elm
      this._init();

      // 视频播放
      this.play();
   }
}

window.onload = function() {
   videoCtrl.initBar();

   videoCtrl.moveAction();

   videoCtrl.setPercntage(20);

   videoCtrl.btn.pause.onclick = function() {
      videoCtrl.pause();
      video.pause();
   };

   videoCtrl.btn.play.onclick = function() {
      videoCtrl.play();
      video.resume();
   };

   videoCtrl.btn.slow.onclick = function() {
      videoCtrl.slow();
      video.playSlow();
   };

   videoCtrl.btn.fast.onclick = function() {
      videoCtrl.fast();
      video.playFast();
   };
}