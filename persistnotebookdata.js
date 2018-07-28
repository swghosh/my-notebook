var Storage = require('@google-cloud/storage')

const bucketName = process.env.BUCKET_NAME || ''
const fileName = 'datainsidenotebook.json'

var bucket = new Storage().bucket(bucketName)

exports.uploadNotebookData = (notebookData, callback) => {

    notebookData = JSON.stringify(notebookData)

    var file = bucket.file(fileName)
    var writeStream = file.createWriteStream({
        metadata: {
            contentType: 'application/json'
        }
    })
    
    writeStream.on('finish', () => {
        callback()
    })
    writeStream.end(notebookData)
}

exports.downloadNotebookData = (callback) => {
    var file = bucket.file(fileName)
    var readStream = file.createReadStream()

    var notebookData = ''
    readStream.on('data', (chunk) => {
        notebookData += chunk
    })
    readStream.on('end', () => {
        callback(JSON.parse(notebookData))
    })
}