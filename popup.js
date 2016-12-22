var domain = "https://demo.aaa.com";//用来接收商品信息的web后台
var item;

//获得background页面对象
var backgroundPage = chrome.extension.getBackgroundPage();
$(document).ready(function () {

    if (backgroundPage){
        if (backgroundPage.loadCallback().status == "success"){
            $("#addItemMenu").text("添加商品");
            $("#addItemMenu").click(function () {
                backgroundPage.showItem(function (item) {
                    this.item = item;
                    $("#saveDiv").show();
                });
            });
        }
    }

    $("#saveItemMenu").click(function () {
        saveItem();
    });

	//检查web后台是否登录
    $.ajax({
        type: 'POST',
        url: domain+"/plugin/login",
        data: "",
        success: function (response) {
            if (response == "success"){
                $("#loginStatus").text("已登录");
            }
        },
        error:function (response) {
            $("#loginStatus").text("未登录");
        }
    });

});

function saveItem() {
    $("#addItemMenu").text("保存中...");
    $("#saveDiv").hide();

    var str = "";
    for(i=0;i<item.attributes.length;i++){
        str += item.attributes[i]+',';
    }
    item.attributes = str;
    var str = "";
    for(i=0;i<item.thumbs.length;i++){
        str += item.thumbs[i]+',';
    }
    item.thumbs = str;

    var str = "";
    for(i=0;i<item.descImages.length;i++){
        str += item.descImages[i]+',';
    }
    item.descImages = str;

    item.productId = $("#productId").val();

	//保存商品信息到后台
    $.ajax({
        type: 'POST',
        url: domain+"/plugin/chrome",
        data: item,
        success: function (data) {

            if (data.status == "success"){
                $("#addItemMenu").text("保存成功");
                $("#saveDiv").show();

            }
        },
        error:function (data) {
            $("#addItemMenu").text("保存失败:"+data.message);
            $("#saveDiv").show();
        },
        dataType: "json"
    });
}

