'use strict';

var expect = require('chai').expect;
var utils = require('../lib/utils');

describe('Utility API', function() {
    describe('Object property test', function () {
        it('returns true if object has own property', function () {
            var has1 = utils.hasProperty({a: 'aa'}, 'a');
            var has2 = utils.hasProperty({a: {b: 'bb'}}, 'a.b');
            var has3 = utils.hasProperty({a: {b: {c: 'cc'}}}, 'a.b.c');
            var has4 = utils.hasProperty({a: {b: {d: 'cc'}}}, 'a.b.c');
            expect(has1).to.equal(true);
            expect(has2).to.equal(true);
            expect(has3).to.equal(true);
            expect(has4).to.equal(false);
        });
    });
    describe('Add string quote', function () {
        it('returns string with single quote', function() {
            var str = utils.addSingleQuote('target');
            expect(str).to.equal('\'target\'');
        });
        it('returns string with double quote', function () {
            var str = utils.addQuote('target');
            expect(str).to.equal('\"target\"');
        });
        it('returns string with padding zero', function () {
            var str1 = utils.addZero(1, 1);
            var str2 = utils.addZero(1, 2);
            var str3 = utils.addZero(1, 3);
            expect(str1).to.equal('1');
            expect(str2).to.equal('01');
            expect(str3).to.equal('001');
        });
    });
    describe('Date to string conversion', function () {
        var date = new Date();
        var yyyy = date.getFullYear();
        var month = utils.addZero(date.getMonth()+1, 2);
        var day = utils.addZero(date.getDate(), 2);
        var hours = utils.addZero(date.getHours(), 2);
        var minuets = utils.addZero(date.getMinutes(),2);
        var seconds = utils.addZero(date.getSeconds(),2);
        it('returns date string', function() {
            var str = utils.toDateString(date);
            expect(str).to.equal(yyyy+'-'+month+'-'+day);
        });
        it('returns datetime string', function () {
            var str = utils.toDateTimeString(date);
            expect(str).to.equal(yyyy+'-'+month+'-'+day+'T'+hours+':'+minuets+':'+seconds);
        });
    });
});
