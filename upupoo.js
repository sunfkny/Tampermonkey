// ==UserScript==
// @name         UPUPOO增强
// @description  为 啊噗啊噗动态壁纸 wallpaper.upupoo.com 添加网页下载功能
// @version      0.2
// @author       Sunfkny
// @grant        GM_xmlhttpRequest
// @match        http://wallpaper.upupoo.com/store/*
// @match        http://wallpaper.upupoo.com/
// @namespace https://github.com/sunfkny/Tampermonkey
// ==/UserScript==

(function () {
    'use strict';
    var url = window.location.href;


    //匹配全站
    if (url.search("http://wallpaper.upupoo.com/")!=-1){

        //隐藏右上角下载按钮
        var righttopParent = document.getElementsByClassName("top-btm")[0];
        var d2 = document.getElementsByClassName("download-func")[0];
        righttopParent.removeChild(d2);


        //注入脚本
        unsafeWindow.search = function(){
            location.href="http://wallpaper.upupoo.com/store/search-"+searchInput.value+"----.htm";
        };

        unsafeWindow.onKeyPress = function(e){
            var keyCode = null;
            if(e.which){
                keyCode = e.which;}
            else if(e.keyCode){
                keyCode = e.keyCode;}
            if(keyCode == 13) {
                search();
                return false;
            }
            return true;
        };


        //生成搜索组件
        righttopParent.innerHTML = '<div style="margin-top:10px;"><div onclick="search()" style="float:right;display:inline-block;background:linear-gradient(90deg, #009CFF 0%, #00BBEC 100%);height:40px;width:80px;line-height:40px;text-align:center;font-weight:bold;border-radius:.5rem;font-size:20px;color:#F5FDFF;margin-left:10px;margin-right:82px;"><a>搜索</a></div><div style="display:inline-block;float:right;"><input onkeypress="return onKeyPress(event)" style="color:#000;border-width:0px;width:240px;height:40px;border-radius:.5rem;font-size:14px;padding-left:14px;padding-right:14px;" type="text" id="searchInput"></div></div>';

        //搜索框保持上次搜索文本
        var searchInput= document.getElementById("searchInput");
        if (url.search("search")!=-1){
            searchInput.value=decodeURI(url.split("-")[1]);
        }
        if (url.search("paperDetail")!=-1){
            searchInput.value=decodeURI(document.referrer.split("-")[1]);
        }
    }


    //匹配详情页
    if (url.search("http://wallpaper.upupoo.com/store/")!=-1){
        var num = url.replace(/[^0-9]/ig, "");
        var fileName;
        var wallpaperRaw;
        var wallpaperView;

        //隐藏原下载按钮
        var rightParent = document.getElementsByClassName("wrapRightTop5")[0];
        var d1 = document.getElementsByClassName("inside2")[0];
        rightParent.removeChild(d1);

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
    }


})()

