"use strict";

// https://gist.github.com/sente/1083506
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
    var arr =['\"', value, '\"'];
    return arr.join('');
};

function addSingleQuote (value) {
    var arr =['\'', value, '\''];
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
    var yyyy = date.getFullYear();
    var MM = addZero(date.getMonth() + 1, 2);
    var dd = addZero(date.getDate(), 2);
    var arr = [yyyy, '-', MM, '-', dd];
    var str = arr.join('');
    return str;
};

// yyyy-MM-ddTHH:mm:ss
function toDateTimeString (date) {
    var yyyy = date.getFullYear();
    var MM = addZero(date.getMonth() + 1, 2);
    var dd = addZero(date.getDate(), 2);
    var HH = addZero(date.getHours(), 2);
    var mm = addZero(date.getMinutes(), 2);
    var ss = addZero(date.getSeconds(), 2);
    var arr = [yyyy, '-', MM, '-', dd, 'T', HH, ':', mm, ':', ss];
    var str = arr.join('');
    return str;
};

function nowAsDateTime () {
    return toDateTimeString(new Date());
};

function nowAsDate () {
    return toDateString(new Date());
};
