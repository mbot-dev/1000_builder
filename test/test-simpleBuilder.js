'use strict';

var expect = require('chai').expect;
var simpleBuilder = require('../api/simpleBuilder');

describe('SimpleBuilder API', function() {
    describe('Shared componet test', function () {
        it('returns person id with type facility', function () {
            var id = simpleBuilder.buildPersonId('0056', 'facility', 'JPN012345678901')
            expect(id.value).to.equal('0056');
            expect(id.attr.type).to.equal('facility');
            expect(id.attr.tableId).to.equal('JPN012345678901');
        });
        it('returns full address with postal code and usage flag', function () {
            var address = simpleBuilder.buildAddress('bussiness', '231-0023', '横浜市中区山下町１番地')
            expect(address.full).to.equal('横浜市中区山下町１番地');
            expect(address.zip).to.equal('231-0023');
            expect(address.attr.repCode).to.equal('I');
            expect(address.attr.addressClass).to.equal('bussiness');
            expect(address.attr.tableId).to.equal('MML0025');
        });
        it('returns phone number with type', function () {
            var phone = simpleBuilder.buildPhone('PH', '045-681-5251')
            expect(phone.full).to.equal('045-681-5251');
            expect(phone.attr.telEquipType).to.equal('PH');
        });
        it('returns person name with type I', function () {
            var name = simpleBuilder.buildPersonNameWithKanji('宮下 奈々')
            expect(name.fullname).to.equal('宮下 奈々');
            expect(name.attr.repCode).to.equal('I');
            expect(name.attr.tableId).to.equal('MML0025');
        });
        it('returns person name with type P', function () {
            var name = simpleBuilder.buildPersonNameWithKana('ミヤシタ ナナ')
            expect(name.fullname).to.equal('ミヤシタ ナナ');
            expect(name.attr.repCode).to.equal('P');
            expect(name.attr.tableId).to.equal('MML0025');
        });
        it('returns person name with type A', function () {
            var name = simpleBuilder.buildPersonNameWithRoman('Nana Miyashita')
            expect(name.fullname).to.equal('Nana Miyashita');
            expect(name.attr.repCode).to.equal('A');
            expect(name.attr.tableId).to.equal('MML0025');
        });
    });
});
