'use strict';

var expect = require('chai').expect;
var simpleBuilder = require('../api/simpleBuilder');

describe('SimpleBuilder API', function() {
    describe('Shared componet test', function () {
        it('returns person id with type facility', function () {
            var id = simpleBuilder.buildPersonId('0056', 'facility', 'JPN012345678901');
            expect(id.value).to.equal('0056');
            expect(id.attr.type).to.equal('facility');
            expect(id.attr.tableId).to.equal('JPN012345678901');
        });
        it('returns full address with postal code and bisiness flag', function () {
            var address = simpleBuilder.buildBusinessAddress('231-0023', '横浜市中区山下町１番地');
            expect(address.full).to.equal('横浜市中区山下町１番地');
            expect(address.zip).to.equal('231-0023');
            expect(address.attr.repCode).to.equal('I');
            expect(address.attr.addressClass).to.equal('business');
            expect(address.attr.tableId).to.equal('MML0025');
        });
        it('returns full address with postal code and home flag', function () {
            var address = simpleBuilder.buildHomeAddress('231-0023', '横浜市中区山下町１番地');
            expect(address.full).to.equal('横浜市中区山下町１番地');
            expect(address.zip).to.equal('231-0023');
            expect(address.attr.repCode).to.equal('I');
            expect(address.attr.addressClass).to.equal('home');
            expect(address.attr.tableId).to.equal('MML0025');
        });
        it('returns phone number with type PH', function () {
            var phone = simpleBuilder.buildTelephone('045-681-5251');
            expect(phone.full).to.equal('045-681-5251');
            expect(phone.attr.telEquipType).to.equal('PH');
        });
        it('returns phone number with type CR', function () {
            var phone = simpleBuilder.buildMobile('045-681-5251');
            expect(phone.full).to.equal('045-681-5251');
            expect(phone.attr.telEquipType).to.equal('CR');
        });
        it('returns person name with type I', function () {
            var name = simpleBuilder.buildPersonNameWithKanji('宮下 奈々');
            expect(name.fullname).to.equal('宮下 奈々');
            expect(name.attr.repCode).to.equal('I');
            expect(name.attr.tableId).to.equal('MML0025');
        });
        it('returns person name with type P', function () {
            var name = simpleBuilder.buildPersonNameWithKana('ミヤシタ ナナ');
            expect(name.fullname).to.equal('ミヤシタ ナナ');
            expect(name.attr.repCode).to.equal('P');
            expect(name.attr.tableId).to.equal('MML0025');
        });
        it('returns person name with type A', function () {
            var name = simpleBuilder.buildPersonNameWithRoman('Nana Miyashita');
            expect(name.fullname).to.equal('Nana Miyashita');
            expect(name.attr.repCode).to.equal('A');
            expect(name.attr.tableId).to.equal('MML0025');
        });
        it('returns facility', function () {
            var facility = simpleBuilder.buildFacility('JPN012345678901', 'JMARI', 'シルク内科');
            expect(facility.Id.value).to.equal('JPN012345678901');
            expect(facility.Id.attr.type).to.equal('JMARI');
            expect(facility.Id.attr.tableId).to.equal('MML0027');
            var fname = facility.name[0];
            expect(fname.value).to.equal('シルク内科');
            expect(fname.attr.repCode).to.equal('I');
            expect(fname.attr.tableId).to.equal('MML0025');
        });
        it('returns medical department', function () {
            var department = simpleBuilder.buildMedicalDepartment('01','内科');
            expect(department.Id.value).to.equal('01');
            expect(department.Id.attr.type).to.equal('medical');
            expect(department.Id.attr.tableId).to.equal('MML0029');
            var fname = department.name[0];
            expect(fname.value).to.equal('内科');
            expect(fname.attr.repCode).to.equal('I');
            expect(fname.attr.tableId).to.equal('MML0025');
        });
        it('returns personalizedInfo', function () {
            var simplePerson = {
                id: '201605',
                idType: 'facility',                          // MML0024(全国統一:national 地域:local 施設固有:facility)
                kanjiName: '青山 慶二',
                kanaName: 'アオヤマ ケイジ',
                romanName: 'Keiji Aoyama',                   // TPPで外国人医師
                prefix: 'Professor',
                degree: 'MD/PhD',
                facilityId: 'JPN012345678901',
                facilityIdType: 'JMARI',                     // MML0027(ca|insurance|monbusho|JMARI|OID)
                facilityName: 'シルク内科',                    // 漢字
                facilityZipCode: '231-0023',
                facilityAddress: '横浜市中区山下町1番地 8-9-01', // 漢字
                facilityPhone: '045-571-6572',
                departmentId: '01',                          // 医科用:MML0028 歯科用:MML0030
                departmentIdType: 'medical',                 // MML0029を使用する(medical|dental|facility)
                departmentName: '第一内科',
                email: 'person@example.com'
            };
            var person = simpleBuilder.buildPersonalizedInfo(simplePerson);
            // Id
            expect(person.Id.value).to.equal(simplePerson.id);
            expect(person.Id.attr.type).to.equal(simplePerson.idType);
            expect(person.Id.attr.tableId).to.equal(simplePerson.facilityId);
            // personName
            person.personName.every(function (entry, index, arr) {
                switch (index) {
                    case 0:
                        expect(entry.fullname).to.equal(simplePerson.kanjiName);
                        expect(entry.attr.repCode).to.equal('I');
                        expect(entry.attr.tableId).to.equal('MML0025');
                        expect(entry.prefix).to.equal(simplePerson.prefix);
                        expect(entry.degree).to.equal(simplePerson.degree);
                    break;

                    case 1:
                        expect(entry.fullname).to.equal(simplePerson.kanaName);
                        expect(entry.attr.repCode).to.equal('P');
                        expect(entry.attr.tableId).to.equal('MML0025');
                        expect(entry.prefix).to.equal(simplePerson.prefix);
                        expect(entry.degree).to.equal(simplePerson.degree);
                    break;

                    case 2:
                        expect(entry.fullname).to.equal(simplePerson.romanName);
                        expect(entry.attr.repCode).to.equal('A');
                        expect(entry.attr.tableId).to.equal('MML0025');
                        expect(entry.prefix).to.equal(simplePerson.prefix);
                        expect(entry.degree).to.equal(simplePerson.degree);
                    break;

                    default:
                    break;
                }
            });
            // Facility
            expect(person.Facility.Id.value).to.equal(simplePerson.facilityId);
            expect(person.Facility.Id.attr.type).to.equal(simplePerson.facilityIdType);
            expect(person.Facility.Id.attr.tableId).to.equal('MML0027');
            person.Facility.name.forEach(function (entry) {
                expect(entry.value).to.equal(simplePerson.facilityName);
                expect(entry.attr.repCode).to.equal('I');
                expect(entry.attr.tableId).to.equal('MML0025');
            });
            // Department
            expect(person.Department.Id.value).to.equal(simplePerson.departmentId);
            expect(person.Department.Id.attr.type).to.equal(simplePerson.departmentIdType);
            expect(person.Department.Id.attr.tableId).to.equal('MML0029');
            person.Department.name.forEach(function (entry) {
                expect(entry.value).to.equal(simplePerson.departmentName);
                expect(entry.attr.repCode).to.equal('I');
                expect(entry.attr.tableId).to.equal('MML0025');
            });
            // addresses
            person.addresses.forEach(function (entry) {
                expect(entry.full).to.equal(simplePerson.facilityAddress);
                expect(entry.zip).to.equal(simplePerson.facilityZipCode);
                expect(entry.attr.repCode).to.equal('I');
                expect(entry.attr.addressClass).to.equal('business');
                expect(entry.attr.tableId).to.equal('MML0025');
            });
            // emailAddresses
            person.emailAddresses.forEach(function (entry) {
                expect(entry).to.equal(simplePerson.email);
            });
            // phones
            person.phones.forEach(function (entry) {
                expect(entry.full).to.equal(simplePerson.facilityPhone);
                expect(entry.attr.telEquipType).to.equal('PH');
            });
        });
        it('returns creatorInfo', function () {
            var simpleCreator = {
                id: '201605',
                idType: 'facility',                          // MML0024(全国統一:national 地域:local 施設固有:facility)
                kanjiName: '青山 慶二',
                facilityId: 'JPN012345678901',
                facilityIdType: 'JMARI',                     // MML0027(ca|insurance|monbusho|JMARI|OID)
                facilityName: 'シルク内科',                    // 漢字
                facilityZipCode: '231-0023',
                facilityAddress: '横浜市中区山下町1番地 8-9-01', // 漢字
                facilityPhone: '045-571-6572',
                departmentId: '01',                          // 医科用:MML0028 歯科用:MML0030
                departmentIdType: 'medical',                 // MML0029を使用する(medical|dental|facility)
                departmentName: '第一内科',
                license: 'doctor'
            };
            var creator = simpleBuilder.buildCreatorInfo(simpleCreator);
            creator.creatorLicense.forEach(function (entry) {
                expect(entry.value).to.equal(simpleCreator.license);
                expect(entry.attr.tableId).to.equal('MML0026');
            });
        });
        it('returns default access rights', function () {
            var rights = simpleBuilder.buildDefaultAccessRight('0456', '宮下 奈々');

            var creatorFacility = rights[0];
            expect(creatorFacility.attr.permit).to.equal('all');
            creatorFacility.facility.forEach(function(entry) {
                expect(entry.value).to.equal('記載者施設');
                expect(entry.attr.facilityCode).to.equal('creator');
                expect(entry.attr.tableId).to.equal('MML0035');
            });
            
            var patientExperience = rights[1];
            expect(patientExperience.attr.permit).to.equal('read');
            patientExperience.facility.forEach(function(entry) {
                expect(entry.value).to.equal('診療歴のある施設');
                expect(entry.attr.facilityCode).to.equal('experience');
                expect(entry.attr.tableId).to.equal('MML0035');
            });
            patientExperience.person.forEach(function(entry) {
                expect(entry.value).to.equal('宮下 奈々');
                expect(entry.attr.personCode).to.equal('patient');
                expect(entry.attr.tableId).to.equal('MML0036');
                expect(entry.attr.personId).to.equal('0456');
                expect(entry.attr.personIdType).to.equal('dolphinUserId_2001-10-03');
            });
        });
    });
});
