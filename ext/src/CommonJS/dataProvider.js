function refresh_data() {
    add_merchant_in_storage()
    add_websites_in_storage()
    add_websites_merchants_in_storage()
}

function add_merchant_in_storage() {
    try {
        api.get("/merchants").then((res) => {
            if (res.success) {
                //console.log("merchants :", res)
                let merchants = {}
                for (let i = 0; i < res.data.length; i++) {
                    merchants[res.data[i].id] = res.data[i];
                }
                //console.log("merchants:", merchants)
                chrome.storage.local.set({ merchants: merchants })
            }
            else {
                console.log("Merchant:", res.msg)
            }
        })
    } catch (error) {
        console.log("Error", error)
    }
}

function add_websites_in_storage() {
    try {
        api.get("/websites").then((res) => {
            if (res.success) {
                //console.log("merchants :", res)
                let websites = {}
                for (let i = 0; i < res.data.length; i++) {
                    websites[res.data[i].id] = res.data[i];
                }
                //console.log("websites:", websites)
                chrome.storage.local.set({ websites: websites })
            }
            else {
                console.log("websites:", res.msg)
            }
        })
    } catch (error) {
        console.log("Error", error)
    }
}

function add_websites_merchants_in_storage() {
    try {
        api.get("/website/merchants").then((res) => {
            if (res.success) {

                //console.log("websites_merchant:", res.data)
                chrome.storage.local.set({ website_merchants: res.data })
            }
            else {
                console.log("websites:", res.msg)
            }
        })
    } catch (error) {
        console.log("Error", error)
    }
}

function scrapping_page(web_url) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["websites", "website_merchants", "merchants"], (result) => {
            let res = null;
            let res2;
            let source_type = null;
            if (result.websites) {
                //console.log("website:", result.websites)
                let websites = Object.values(result.websites);
                let web_merchants = Object.values(result.website_merchants)
                websites.forEach(element => {
                    let url = new URL(web_url);
                    let _url = new URL(element.url);
                    if (url.hostname == _url.hostname) {
                        res = element;
                        source_type = "websites";
                        console.log("website::")
                    }
                });
                if (res) {
                    web_merchants.forEach((element) => {
                        if (web_url.includes(element.url)) {
                            let merchant_info = {
                                ...element,
                            };
                            res.merchant_info = merchant_info;
                            // res = { ...element, ...res };
                            resolve({ source_type, data: res });
                            res2 = element;
                            source_type = "websites";
                        }
                    });
                } else {
                    let merchants = Object.values(result.merchants);
                    merchants.forEach((element) => {
                        let url = new URL(web_url);
                        let element_url = new URL(element.website);
                        if (element_url.hostname === url.hostname) {
                            res = element;
                            source_type = "merchants";
                            resolve({ source_type, data: res });
                        }
                    });
                }
            }

        })
    })
}

function get_merchant_info(merchant_id) {
    //console.log("Merchant_info", merchant_id)
    return new Promise((resolve, reject) => {
        try {
            api.get("/merchant/info?merchant_id=" + merchant_id).then((res) => {
                if (res.success) {
                    resolve(res.data);
                } else {
                    console.log("❌", res.msg);
                    reject(res.msg);
                }
            });
        } catch (error) {
            console.log("❌", error);
            reject(error);
        }
    });
}

function get_merchant_name(merchant_info) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["websites"], (result) => {
            if (result.websites) {
                let merchant_name = merchant_info.websites;
                merchant_name = merchant_name.map((e) => {
                    e.name = result.websites[e.website_id].name;
                    return e;
                })
                merchant_info.websites = merchant_name;
            }
            resolve(merchant_info);
        })
    })
}