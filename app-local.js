#!/usr/bin/env node

const httpPort = process.env.PORT || 8080
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.txt': 'text/plain',
    '.gif': 'image/gif',
    '.png': 'image/png',
    'other': 'application/octet-stream'
}

var http = require('http')
var url = require('url')
var path = require('path')
var fs = require('fs')

var webServer = http.createServer((req, res) => {
    var parsedUrl = url.parse(path.normalize(req.url))
    var body = ''

    req.on('data', (chunk) => {
        if(body.length > 1e6) req.connection.destroy()
        body += chunk
    })
    req.on('end', () => {
        produceResponse(parsedUrl.pathname, body, res)
    })
})

var produceResponse = (pathname, body, res) => {
    if(pathname == '/') {
        res.writeHead(200, {
            'Content-Type': mimeTypes['.html']
        })
        fs.createReadStream(path.join('static', 'readonly.html'), 'utf8').pipe(res)
    }
    else if(pathname == '/savenotebook') {
        fs.writeFile('./notebookdata.dat', body.trim(), (err) => {
            if(err) {
                res.writeHead(400, {
                    'Content-Type': mimeTypes['.txt']
                })
                res.end('Bad Request')
            }
            else {
                res.writeHead(200, {
                    'Content-Type': mimeTypes['.txt']
                })
                res.end('Saved')
            }
        })
    }
    else if(pathname == '/loadnotebook') {
        fs.readFile('./notebookdata.dat', 'utf8', (err, data) => {
            if(err) {
                res.writeHead(400, {
                    'Content-Type': mimeTypes['.txt']
                })
                res.end('Bad Request')
            }
            else {
                res.writeHead(200, {
                    'Content-Type': mimeTypes['.json'] + '; charset=utf8'
                })
                res.end(data)
            }
        })
    }
    else {
        var fileStream = fs.createReadStream(path.join('static', pathname)).on('error', (err) => {
            fourZeroFour(res)
        })
        
        var extension = pathname.substring(pathname.lastIndexOf('.')) || 'other'

        res.writeHead(200, {
            'Content-Type': (mimeTypes[extension] == undefined) ? mimeTypes['other'] : mimeTypes[extension]
        })
        fileStream.pipe(res)
    }
}

var fourZeroFour = (res) => {
    res.writeHead(404, {
        'Content-Type': 'text/html; charset=utf8'            
    })
    res.end('This is not the resource that you are looking for. It seems like a four zero four error occured.')
}

webServer.listen(httpPort)

