const notebookDataDownload = {
    hostname: 'storage.googleapis.com',
    path: '/swg-personal/notebookdata.json',
    method: 'GET'
}
const oAuthToken = 'ya29.GlsGBtBTj0nGGi4c4bNFjxYhBYZD0N1pALVDkr-MIy2yWEx6llphsv99z2A4kqyWWVs2-cv6CIhxtSLs-4h7vzPYAKpvbyaAz5n1iXsMg-has_soDETol0r1e2LD'
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