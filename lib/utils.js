'use strict';

module.exports = {

    isUndefined: function(test) {
        return (typeof test === 'undefined');
    },

    isDefined: function(test) {
        return (typeof test !== 'undefined');
    },

    hasProperty: function (obj, property) {
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
    },

    propertyIsNotNull: function (obj, property) {
        // ''も含める
        return obj.hasOwnProperty(property) && obj[property] !== null && obj[property] !== '';
    },

    propertyIsNotNullAllowEmpty: function (obj, property) {
        // ''も含める
        return obj.hasOwnProperty(property) && obj[property] !== null;
    },

    propertyIsNull: function (obj, property) {
        return !propertyIsNotNull;
    },

    setPropertyIfNotNull: function (target, obj, property) {
        if (this.propertyIsNotNull(obj, property)) {
            target[property] = obj[property];
        }
    },

    propertyIsArrayAndNotEmpty: function (obj, property) {
        if (!obj.hasOwnProperty(property)) {
            return false;
        }
        var arr = obj[property];
        if (!Array.isArray(arr)) {
            return false;
        }
        return arr.length > 0;
    },

    addQuote: function(value) {
        var arr =[];
        arr.push('\"');
        arr.push(value);
        arr.push('\"');
        return arr.join('');
    },

    addSingleQuote: function(value) {
        var arr =[];
        arr.push('\'');
        arr.push(value);
        arr.push('\'');
        return arr.join('');
    },

    addZero: function(x, n) {
        while (x.toString().length < n) {
            x = '0' + x;
        }
        return x + '';
    },

    // yyyy-MM-dd
    toDateString: function(date) {
        var arr = [];
        arr.push(date.getFullYear());
        arr.push('-');
        arr.push(this.addZero(date.getMonth() + 1, 2));
        arr.push('-');
        arr.push(this.addZero(date.getDate(), 2));
        var str = arr.join('');
        return str;
    },

    // yyyy-MM-ddTHH:mm:ss
    toDateTimeString: function(date) {
        var arr = [];
        arr.push(date.getFullYear());
        arr.push('-');
        arr.push(this.addZero(date.getMonth() + 1, 2));
        arr.push('-');
        arr.push(this.addZero(date.getDate(), 2));
        arr.push('T');
        arr.push(this.addZero(date.getHours(), 2));
        arr.push(':');
        arr.push(this.addZero(date.getMinutes(), 2));
        arr.push(':');
        arr.push(this.addZero(date.getSeconds(), 2));
        var str = arr.join('');
        return str;
    },

    nowAsDateTime: function() {
        return this.toDateTimeString(new Date());
    },

    nowAsDate: function() {
        return this.toDateString(new Date());
    },

    compactDateTime: function(dateTime) {
        return dateTime.replace(/-/g, '').replace(/T/g, '').replace(/:/g, '');
    },

    formatXml: function(xml) {
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
};
