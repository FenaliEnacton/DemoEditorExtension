// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts

chrome.runtime.onInstalled.addListener(function () {
  refresh_data(); console.log("Install")
});

chrome.runtime.onStartup.addListener(function () {
  refresh_data();
  console.log("start up")
});

chrome.tabs.onUpdated.addListener((tab_id, changeInfo, tab) => {
  if (changeInfo.status == "complete" && tab.active) {

    scrapping_page(tab.url).then((res) => {
      if (res.data) {
        chrome.tabs.sendMessage(tab_id, {
          from: "on_updated_listener",
          action: "RUN_COUPON_CHECK_SCRIPT",
          data: { ...res },
        })
      }
    })
  }
})


chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });