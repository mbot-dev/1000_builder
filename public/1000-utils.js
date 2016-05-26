"use strict";

function formatXml (xml) {
    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;
    jQuery.each(xml.split('\r\n'), function(index, node) {
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
    });

    return formatted;
};

function addQuote (value) {
    var arr =[];
    arr.push('\"');
    arr.push(value);
    arr.push('\"');
    return arr.join('');
};

function addSingleQuote (value) {
    var arr =[];
    arr.push('\'');
    arr.push(value);
    arr.push('\'');
    return arr.join('');
};

function addZero (x, n) {
    while (x.toString().length < n) {
        x = '0' + x;
    }
    return x;
};

// yyyy-MM-dd
function toDateString (date) {
    var arr = [];
    arr.push(date.getFullYear());
    arr.push('-');
    arr.push(addZero(date.getMonth() + 1, 2));
    arr.push('-');
    arr.push(addZero(date.getDate(), 2));
    var str = arr.join('');
    return str;
};

// yyyy-MM-ddTHH:mm:ss
function toDateTimeString (date) {
    var arr = [];
    arr.push(date.getFullYear());
    arr.push('-');
    arr.push(addZero(date.getMonth() + 1, 2));
    arr.push('-');
    arr.push(addZero(date.getDate(), 2));
    arr.push('T');
    arr.push(addZero(date.getHours(), 2));
    arr.push(':');
    arr.push(addZero(date.getMinutes(), 2));
    arr.push(':');
    arr.push(addZero(date.getSeconds(), 2));
    var str = arr.join('');
    return str;
};

function nowAsDateTime () {
    return toDateTimeString(new Date());
};

function nowAsDate () {
    return toDateString(new Date());
};
