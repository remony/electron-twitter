var http = require('http');
var fs = require('fs'),
    request = require('request');




var download = function(url, path) {
    console.log('Saving to disk: ' + url);
    var callback = function() {
    	console.log('download complete')
    }
    var filename = url.split('/')
    filename = filename[filename.length - 1];

    request.head(url, function(err, res, body) {
        request(url).pipe(fs.createWriteStream("storage/" + path + '/' + filename)).on('close', callback);
    });
}


module.exports = {
    download: download
}