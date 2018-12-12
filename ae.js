'use strict';

var ae = {};

ae.trans = {
    AJAX: function(data){},
    JSONP: function(data){},
    CORS: function(data){}
}

ae.func = {
    getId: function(id) {
        var ID = document.getElementById(id);
        return ID;
    },

    isArray: function(value) { 
    	return Object.prototype.toString.apply(value) === '[object Array]';
    }
}

ae.event = {
    click: function(id,fn) {
        ae.func.getId(id).addEventListener('click',fn)
    }
}

ae.trans.AJAX = function(data, callback) {
    var xml;
    // data.url = `${data.url}?t=${Math.random()}`;
    // 首先判断当前浏览器是否支持XMLHttpRequest,若不支持则为IE5,IE6
    if(window.XMLHttpRequest) {
        xml = new XMLHttpRequest();
    }
    else {
        xml = new ActiveXObjects("Microsoft.XMLHttp");
    }

    


    // readyState 准备状态状态
    // 0 - (未初始化)还没有调用send()方法
    // 1 - (载入)已调用send()方法，正在发送请求
    // 2 - (载入完成)send()方法执行完成，
    // 3 - (交互)正在解析响应内容
    // 4 - (完成)响应内容解析完成，可以在客户端调用了


    // 回调函数，依次执行4次
    xml.onreadystatechange = function() {
        if(xml.readyState === 4) {
            if(xml.status === 200) {
                callback(xml);
            }
            else {
                console.log(`执行错误，状态码为${xml.status}`);
            }
        }
    }

    // 打开发送
    xml.open(data.type, data.url, data.async);

    //data.type == "POST" ? xml.send(postString) : xml.send();
    xml.send();
}

ae.trans.JSONP = function(data) {
    var script = document.createElement('script');
    var head = document.getElementsByTagName('head')[0];
    script.src = `${data.url}?callback=${data.callback}`;
    head.appendChild(script);
}

ae.trans.CORS = function(data, callback) {
    var xml;
    if(window.XMLHttpRequest) {
        xml = new XMLHttpRequest();
    }
    else {
        xml = new ActiveXObjects("Microsoft.XMLHttp");
    }

    xml.onreadystatechange = function() {
        if(xml.readyState == 4) {
            if(xml.status == 200) {
                callback(xml);
            }
        }
    }

    xml.open(data.type, data.url, data.async);
    
    xml.send();
}