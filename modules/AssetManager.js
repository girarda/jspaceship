/**
 * @fileoverview AssetManager class definition. 
 * @author sethladd@gmail.com (Seth Ladd)
 */

function AssetManager() {
    var successCount = 0;
    var errorCount = 0;
    var cache = {};
    var downloadQueue = [];

AssetManager.prototype.queueDownload = function(path) {
    downloadQueue.push(path);
    }
AssetManager.prototype.downloadAll = function(callback) {
    if (downloadQueue.length === 0 && this.soundsQueue.length === 0) {
        callback();
    }
    
    for (var i = 0; i < downloadQueue.length; i++) {
        var path = downloadQueue[i];
        var img = new Image();
        var that = this;
        img.addEventListener("load", function() {
            console.log(this.src + ' is loaded');
            successCount += 1;
            if (isDone()) {
                callback();
            }
        }, false);
        img.addEventListener("error", function() {
            errorCount += 1;
            if (isDone()) {
                callback();
            }
        }, false);
        img.src = path;
        cache[path] = img;
    }
}

AssetManager.prototype.getAsset = function(path) {
    return cache[path];
}
var isDone = function() {
    return (downloadQueue.length == successCount + errorCount);
}
}
