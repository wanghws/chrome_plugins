//background长期驻守

var loadStatus = {status:""}


//popup取得加载结果
var loadCallback = function(){
    return loadStatus;
}

//监听,得到商品信息加载结果
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.status == "success"){
            loadStatus.status = "success";
        }
});

//popup调用,通知content取得商品信息,同时回调给popup
function showItem(callback) {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {}, function(item) {
            callback(item);
        });
    });
}