var page_info = {};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "RUN_COUPON_CHECK_SCRIPT") {
        page_info = request.data;
        console.log("matched with", page_info);
    }
})