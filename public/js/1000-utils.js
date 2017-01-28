"use strict";

// https://gist.github.com/sente/1083506
function formatXml (xml) {
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
            if (pad !== 0) {
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
}

function prettyXml(xml) {
    var xml_formatted = formatXml(xml);
    // 表示するために escapeする
    var ret1 = xml_formatted.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/ /g, '&nbsp;').replace(/\n/g,'<br />');
    // 改行は特別なので（規格書から）
    ret1 = ret1.replace(/&lt;xhtml:br\/&gt;/g, '<br />');
    return ret1;
}

function addQuote (value) {
    var arr =['\"', value, '\"'];
    return arr.join('');
}

function addSingleQuote (value) {
    var arr =['\'', value, '\''];
    return arr.join('');
}

function hasProperty (obj, property) {
    if (typeof obj !== 'object') {
        return false;
    }
    var arr = property.split('.');
    var test = obj;
    var has = true;
    arr.every (function (entry, index, arr) {
        if (test.hasOwnProperty(entry)) {
            test = test[entry];
            return true;
        } else {
            has = false;
            return false;
        }
    });
    return has;
}

function prettyJSON (json) {
    return JSON.stringify(json, null, 3);
}

function addZero (x, n) {
    while (x.toString().length < n) {
        x = '0' + x;
    }
    return x;
}
