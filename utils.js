var log = function() {
    console.log.apply(console, arguments)
}

// 保存
var saveJSON = function(path, json) {
    var fs = require('fs')
    var s = JSON.stringify(json, null, 2)
    fs.writeFile(path, s, function(error) {
        if (error !== null) {
            console.log('--- 写入文件错误 ---', error)
        } else {
            console.log('--- 保存成功 ---')
        }
    })
}

// 缓存
var cached_url = function(url) {
    var fs = require('fs')
    var path = url.split('?')[1] + '.html'
    var exists = fs.existsSync(path)
    log('Cache exists', exists)
    if (exists) {
        var data = fs.readFileSync(path)
        return data
    } else {
        var request = require('sync-request')
        var r = request('GET', url)
        var body = r.getBody('utf-8')
        fs.writeFileSync(path, body)
        return body
    }
}

exports.log = log
exports.save = saveJSON
exports.cached = cached_url
