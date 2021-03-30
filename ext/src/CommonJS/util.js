function get_page_merchant_id(page_info) {
    return page_info.source_type === "websites"
        ? page_info.data.merchant_info.merchant_id
        : page_info.data.id;
}

function render_template(input_data, template_name) {
    return new Promise(function (resolve, reject) {
        let opts = {
            method: "GET",
            headers: {
                mimeType: "text/plain; charset=x-user-defined",
                dataType: "text",
            },
        };
        fetch(
            chrome.runtime.getURL("src/partials/" + template_name + ".html"),
            opts
        )
            .then((response) => response.text())
            .then(function (template) {
                let html = Mustache.render(template, {
                    ...input_data,
                });
                resolve(html);
            });
    });
}