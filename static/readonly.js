var editorDiv = document.querySelector('div.editor')

var lastSavedSpan = document.querySelector('span.lastsaved')

function loadData() {
    var request = new XMLHttpRequest()
    request.open('GET', '/loadnotebook', true)
    request.onreadystatechange = function() {
        if(request.readyState == 4 && request.status == 200) {
            lastSavedSpan.innerHTML = '(read-only) Last loaded ' + new Date().toLocaleString()
            var notebookData = JSON.parse(request.responseText)
            editorDiv.innerHTML = notebookData.content
        }
    }
    request.send()
}

loadData()