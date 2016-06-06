"use strict";

// https://gist.github.com/sente/1083506
var formatXml = function (xml) {
    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;
    var lines = xml.split('\r\n');
    //jQuery.each(xml.split('\r\n'), function(index, node) {
    lines.every (function(node, index, lines) {
        var indent = 0;
        if (node.match( /.+<\/\w[^>]*>$/ )) {
            indent = 0;
        } else if (node.match( /^<\/\w/ )) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
            indent = 1;
        } else {
            indent = 0;
        }

        var padding = '';
        for (var i = 0; i < pad; i++) {
            padding += '  ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;

        return true;
    });

    return formatted;
};

var addQuote = function (value) {
    var arr =['\"', value, '\"'];
    return arr.join('');
};

var addSingleQuote = function (value) {
    var arr =['\'', value, '\''];
    return arr.join('');
};

var hasProperty = function (obj, property) {
    if (typeof obj !== 'object') {
        return false;
    }
    var arr = property.split('.');
    var test = obj;
    var has = true;
    arr.every ((entry, index, arr) => {
        if (test.hasOwnProperty(entry)) {
            test = test[entry];
            return true;
        } else {
            has = false;
            return false;
        }
    });
    return has;
};

var prettyJSON = function (json) {
    return JSON.stringify(json, null, 4);
}

var addZero = function (x, n) {
    while (x.toString().length < n) {
        x = '0' + x;
    }
    return x;
};

// yyyy-MM-dd
var toDateString = function (date) {
    var yyyy = date.getFullYear();
    var MM = addZero(date.getMonth() + 1, 2);
    var dd = addZero(date.getDate(), 2);
    var arr = [yyyy, '-', MM, '-', dd];
    return arr.join('');
};

// yyyy-MM-ddTHH:mm:ss
var toDateTimeString = function (date) {
    var yyyy = date.getFullYear();
    var MM = addZero(date.getMonth() + 1, 2);
    var dd = addZero(date.getDate(), 2);
    var HH = addZero(date.getHours(), 2);
    var mm = addZero(date.getMinutes(), 2);
    var ss = addZero(date.getSeconds(), 2);
    var arr = [yyyy, '-', MM, '-', dd, 'T', HH, ':', mm, ':', ss];
    return arr.join('');
};

var nowAsDateTime = function () {
    return toDateTimeString(new Date());
};

var nowAsDate = function () {
    return toDateString(new Date());
};
