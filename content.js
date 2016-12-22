var SITE_TYPE = 0;
var item = {};
$(document).ready(function () {
    if (location.href.indexOf("detail.tmall.") >= 0) {
        SITE_TYPE = 1;
    }else if(location.href.indexOf("item.taobao.com") >= 0){
        SITE_TYPE = 2;
    }else if(location.href.indexOf("item.jd.com") >= 0){
        SITE_TYPE = 3;
    }


    if (SITE_TYPE <=0)return;

    switch (SITE_TYPE){
        case 1:
            item.type = 1;
            tmall();
            break
        case 2:
            item.type = 2;
            taobao();
            break
        case 3:
            item.type = 3;
            jd();
            break
        default:
            break;
    }
});
function tmall(){
    //console.log("tmall");
    item.itemId = $.getUrlParam("id");
    item.title = $.trim($($(".tb-detail-hd").find("h1")[0]).text());
    item.recommend = $.trim($($(".tb-detail-hd").find("p")[0]).text());

    var price = 999999999;
    var markPrice = 0;
    $(".tm-price").each(function () {

        low = parseInt($(this).text());
        if (markPrice==0)markPrice = low;

        //console.log(low);
        if (low < price){
            price = low;
        }
    });
    item.markPrice = markPrice;
    item.price = price;

    item.attributes = new Array();
    $(".attributes-list").find("li").each(function () {
        //console.log($.trim($(this).text()));
        item.attributes.push($.trim($(this).text()));
    });
    item.thumbs = new Array();
    $(".tb-thumb").find("img").each(function () {
        //console.log($(this).attr("src"));
        var urlstr = "https:"+$(this).attr("src");
        //urlstr = urlstr.substr(0,urlstr.indexOf(".jpg_")+4);
        item.thumbs.push(urlstr);
    });
    item.stock = $.trim($("#J_EmStock").text()).replace(/[^0-9]/ig, "");
    item.postage = $.trim($.trim($("#J_PostageToggleCont").text())).replace(/[^0-9]/ig, "");
    if(parseInt(item.postage) > 0){
        item.postage = 0;
    }else{
        item.postage = 1;
    }
    console.log(item);
    sendStatus();
}

function taobao(){
    //console.log("taobao");
    item.itemId = $.getUrlParam("id");
    item.title = $.trim($(".tb-main-title").text());
    item.recommend = $.trim($(".tb-subtitle").text());

    var price = 999999999;
    var markPrice = 0;
    $(".tb-rmb-num").each(function () {

        low = parseInt($(this).text());
        if (markPrice==0)markPrice = low;

        //console.log(low);
        if (low < price){
            price = low;
        }
    });
    item.markPrice = markPrice;
    item.price = price;

    item.attributes = new Array();
    $(".attributes-list").find("li").each(function () {
        //console.log($.trim($(this).text()));
        item.attributes.push($.trim($(this).text()));
    });
    item.thumbs = new Array();
    $(".tb-thumb").find("img").each(function () {
        //console.log($(this).attr("src"));
        var url = "https:"+$(this).attr("src");
        url = url.substr(0,url.indexOf(".jpg_")+4);
        item.thumbs.push(url);
    });
    item.stock = $.trim($("#J_SpanStock").text()).replace(/[^0-9]/ig, "");
    item.postage = $.trim($("#J_PostageToggleCont").text());
    if(parseInt(item.postage) > 0){
        item.postage = 0;
    }else{
        item.postage = 1;
    }

    //console.log(item);
    sendStatus();
}

function jd(){
    //console.log("jd");
    item.itemId = $(".sku").find("span").text();
    if(!item.itemId){
        item.itemId = $.trim($("#short-share").find("span").text()).replace("商品编号：","");
    }

    item.title = $.trim($(".sku-name").text());

    if(!item.title){
        item.title = $.trim($("#name").find("h1").text());
    }

    item.recommend = $.trim($(".news").text());
    if(!item.recommend){
        item.recommend = $.trim($("#p-ad").text());
    }

    item.price = $(".p-price").find(".price").text();
    if(!item.price){
        item.price = $.trim($("#jd-price").text()).replace("￥","");
    }

    item.attributes = new Array();
    $(".parameter2").find("li").each(function () {
        //console.log($.trim($(this).text()));
        item.attributes.push($.trim($(this).text()));
    });

    if(item.attributes.length<=0){
        $("#parameter2").find("li").each(function () {
            //console.log($.trim($(this).text()));
            item.attributes.push($.trim($(this).text()));
        });
    }

    item.thumbs = new Array();
    $(".spec-items").find("img").each(function () {
        //console.log($(this).attr("src"));
        var url = "http:"+$(this).attr("src");
        url = url.replace("!cc_50x64.jpg","");
        url = url.replace("/n5","/n1");
        url = url.replace("/s50x64","/s350x449")
        //url = url.substr(0,url.indexOf(".jpg_")+4);
        item.thumbs.push(url);
    });
    item.stock = 99999;
    //console.log(item);
    item.postage = "";

    sendStatus();
}

//发送商品信息加载状态
function sendStatus() {
    chrome.runtime.sendMessage({"status":"success"}, function(response) {
        //console.log("item load success");
        //console.log(response);
    });
}

//监听,background通知展示获取商品信息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    showItemInfo(item);
    sendResponse(item);
});

function showItemInfo(item) {

    if (item.type==1){
        item.descImages = new Array();
        $("#description").find("img").each(function () {
            //console.log($(this).attr("src"));
            var url = $(this).attr("src");
            if (url.indexOf("http")<0)return;
            if (url.indexOf(".gif")>=0)return;

            //url = url.substr(0,url.indexOf(".jpg_")+4);
            item.descImages.push(url);
        });
    }else if(item.type==2){
        item.descImages = new Array();
        $("#J_DivItemDesc").find("img").each(function () {
            //console.log($(this).attr("src"));
            var url = $(this).attr("src");
            if (url.indexOf("http")<0)return;

            //url = url.substr(0,url.indexOf(".jpg_")+4);
            item.descImages.push(url);
        });
    }


    var str = '<div id="itemDiv" style="position: fixed; top:0; background:#fff; width:90%; padding:40px 5%; z-index:999999999;">';
    str += '<b>ID:</b>'+item.itemId+'<br><br>';
    str += '<b>名称:</b>'+item.title+'<br><br>';
    str += '<b>推荐:</b>'+item.recommend+'<br><br>';
    str += '<b>市场价:</b>'+item.markPrice+'<br><br>';
    str += '<b>价格:</b>'+item.price+'<br><br>';
    str += '<b>库存:</b>'+item.stock+'<br><br>';
    str += '<b>属性:</b><br>';
    for(i=0;i<item.attributes.length;i++){
        str += item.attributes[i]+'<br>';
    }
    str += '<br>';
    str += '<b>介绍:</b><br>';
    for(i=0;i<item.descImages.length;i++){
        str += item.descImages[i]+'<br>';
    }

    str += '<br>';
    str += '<b>主图:</b><br>';
    for(i=0;i<item.thumbs.length;i++){
        str += item.thumbs[i]+'<br>';
    }



    str += '</div>';
    $('body').append(str);
    $('#itemDiv').lightbox_me({
        centered: true
    });
}

//从url里把商品id取出来
$.getUrlParam = function(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return unescape(r[2]); return null;
}

