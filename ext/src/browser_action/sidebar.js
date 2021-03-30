var g_web_page_info = {};
document.addEventListener("DOMContentLoaded", () => {
    render_page()
})

function render_page() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
        scrapping_page(tab[0].url).then((res) => {
            if (res) {
                console.log("object :::", res)
                g_web_page_info = res;
                add_merchant_info(res);
            }
        })
    })
}
async function add_merchant_info(page_info) {
    let merchant_info = await get_merchant_info(get_page_merchant_id(page_info));
    console.log("merchant_info :", merchant_info)

    let compiled_merchant_info = await get_merchant_name(merchant_info);
    render_merchant_info(compiled_merchant_info);
    console.log("mechant_info", compiled_merchant_info)

}
function render_merchant_info(merchant_info) {
    //console.log("merchant info render method :", merchant_info)
    render_template(
        { ...merchant_info }, "popup_merchant_info"
    ).then((popup_merchant_info) => {
        //console.log("template ", popup_merchant_info)
        $('#merchant_info').append(popup_merchant_info)
        handle_add_new_coupon()
    });
}

function handle_add_new_coupon() {
    $(".add_new_coupon").click(() => {
        let merchant_id = get_page_merchant_id(g_web_page_info);
        window.open(`${config.create_coupon}${merchant_id}`);
    })
}