const notebookDataDownload = {
    hostname: 'storage.googleapis.com',
    path: '/swg-personal/notebookdata.json',
    method: 'GET',
    headers: {
        'Cache-Control': 'no-cache, max-age=0'
    }
}
const oAuthToken = 'ya29.GlsGBuoP6kK8oHnjfGEn_z3ymm73oL__5uvGCss4SZuMjuRRNLdhgjyiXOoGQ9Bkma05Rx2_7YCQxJpmLtHwy4_yKUXZoYAU0_B496cfoRNeOI2LCnNs7wvz5GCg'
const notebookDataUpload = {
    hostname: 'www.googleapis.com',
    path: '/upload/storage/v1/b/swg-personal/o?uploadType=media&name=notebookdata.json',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + oAuthToken
    }
}

var https = require('https')

exports.uploadNotebookData = (notebookData, callback) => {
    var postData = Buffer.from(JSON.stringify(notebookData))
    var options = notebookDataUpload
    options.headers['Content-Length'] = postData.length

    var request = https.request(options, (res) => {
        var data = ''

        res.on('data', (chunk) => {
            data += chunk
        })

        res.on('end', () => {
            callback(data)
        })
    })
    request.write(postData.toString('binary'))
    request.end()
}

exports.downloadNotebookData = (callback) => {
    https.get(notebookDataDownload, (res) => {
        var data = ''
        res.on('data', (chunk) => {
            data += chunk
        })
        res.on('end', () => {
            callback(JSON.parse(data))
        })
    })
}