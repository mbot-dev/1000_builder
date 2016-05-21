"use strict";

module.exports = {

    isUndefined: function(test) {
        return (typeof test === 'undefined');
    },

    isDefined: function(test) {
        return (typeof test !== 'undefined');
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
        return x;
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
    }
};
