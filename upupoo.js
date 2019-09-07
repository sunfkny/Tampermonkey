// ==UserScript==
// @name         UPUPOO增强
// @description  为 [UPUPOO网页版](http://wallpaper.upupoo.com) 添加功能
// @version      0.1
// @author       Sunfkny
// @grant        GM_xmlhttpRequest
// @match        http://wallpaper.upupoo.com/store/*
// ==/UserScript==

(function () {
    'use strict';
    var url = window.location.href;
    var num = url.replace(/[^0-9]/ig, "");
    var fileName;
    var wallpaperRaw;
    var wallpaperView;

    //隐藏原下载按钮
    var rightParent = document.getElementsByClassName("wrapRightTop5")[0];
    var d = document.getElementsByClassName("inside2")[0];
    rightParent.removeChild(d);

    //初始化底部按钮
    var bottomParent = document.getElementsByClassName("comment")[0];
    var existingItem = document.getElementsByClassName("commentTop")[0];
    var newItem = document.createElement("div");
    var align = document.createAttribute("align");
    align.value = "center";
    newItem.setAttributeNode(align);
    var id = document.createAttribute("id");
    id.value = "buttonDiv";
    newItem.setAttributeNode(id);

    //添加底部按钮
    bottomParent.insertBefore(newItem, existingItem);
    document.getElementById("buttonDiv").innerHTML = '<a id="mView" style="font-size: 20px;display: inline-block;width: 240px;height: 50px;line-height:50px;border-radius: 100px;background-image:linear-gradient(-226deg, #009CFF 0%, #00E6FF 100%);margin: 15px;"align="center">在线预览</a><a id="mDownload" style="font-size: 20px;display: inline-block;width: 240px;height: 50px;line-height:50px;border-radius: 100px;background-image: linear-gradient(-226deg, #009CFF 0%, #00E6FF 100%);margin: 15px;"align="center">下载源文件</a>';

    var mDownload=document.getElementById("mDownload");
    var mView=document.getElementById("mView");
    //获取配置文件
    GM_xmlhttpRequest({
        method: 'GET',
        url: "http://source.upupoo.com/theme/" + num + "/theme.upup",
        onload: response => {
            var obj = eval("(" + response.responseText + ")");
            fileName=obj.src;

            //判断类型
            var v = document.getElementsByTagName("video")[0];
            if (typeof(v) == "undefined") {
                wallpaperRaw = "http://source.upupoo.com/theme/" + num + "/paper.zip";
                wallpaperView = "http://source.upupoo.com/theme/" + num + "/index.html";
            }
            else {
                wallpaperRaw= "http://source.upupoo.com/theme/" + num + "/"+fileName;
                wallpaperView=v.src;
                //提示视频预览有损
                mView.textContent+="(有损)";
            }
            mDownload.href=wallpaperRaw;
            mView.onclick=function(){location.href=wallpaperView};

        }
    });



})()

