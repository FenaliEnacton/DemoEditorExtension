const api = {
    get: function (url, header = {}, data = "") {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['editor_token'], (result) => {
                let opt = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${result.editor_token}`,
                        ...header,
                    },
                };

                fetch(config.api_url + url, opt)
                    .then((Response) => Response.json())
                    .then((data) => {
                        resolve(data)
                    })
            })
        })
    },
    post: function (url, body, header = {}) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['editor_token'], (result) => {
                let opt = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${result.editor_token}`,
                        ...header,
                    },
                    body: JSON.stringify(body)
                };

                fetch(config.api_url + url, opt)
                    .then((response) => response.json)
                    .then((data) => {
                        resolve(data)
                    })
            })
        })
    },

}