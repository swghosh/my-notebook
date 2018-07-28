var saveButton = document.querySelector('button.savebutton')
var editorDiv = document.querySelector('div.editor')

var lastSavedSpan = document.querySelector('span.lastsaved')

function saveData(auto) {
    lastSavedSpan.innerHTML = 'saving...'

    var request = new XMLHttpRequest()
    request.open('POST', '/savenotebook', true)
    request.onreadystatechange = function() {
        if(request.readyState == 4 && request.status == 200) {
            lastSavedSpan.innerHTML = (auto) ? ('Auto saved ' + new Date().toLocaleString()) : ('Last saved ' + new Date().toLocaleString())
        }
    }
    var postData = JSON.stringify({
        content: editorDiv.innerHTML
    })
    request.send(postData)
}

saveButton.addEventListener('click', function() {
    saveData(false)
})

function loadData() {
    var request = new XMLHttpRequest()
    request.open('GET', '/loadnotebook', true)
    request.onreadystatechange = function() {
        if(request.readyState == 4 && request.status == 200) {
            lastSavedSpan.innerHTML = 'Last loaded ' + new Date().toLocaleString()
            var notebookData = JSON.parse(request.responseText)
            editorDiv.innerHTML = notebookData.content
        }
    }
    request.send()
}

loadData()

function autoSaveEnable() {
    setInterval(function() {
        saveData(true)
    }, 30000)
}