document.addEventListener("DOMContentLoaded", function () {
    //handle_save()
    update_page()
});

function update_page() {
    chrome.storage.local.get(["editor_token"], (result) => {
        if (result.editor_token) {
            //console.log("Token : ", result)
            $('#editor-token').val(result.editor_token);
        }
    })
    handle_save();
}
function handle_save() {
    $('#save').click(() => {
        let token = $('#editor-token').val()
        if (token) {
            chrome.storage.local.set({ editor_token: token })
            console.log("Token saved")
        }
        else {
            console.log("Token Required")
        }
    })
}