'use strict';


const utils = require('../lib/utils');
const commonBuilder = require('../lib/commonBuilder');

/********************************************************************************
var ReportModule = {
    information: {},                                        // 報告書ヘッダー情報
    reportBody: {}                                          // 報告書本文情報
};

var information = {
    attr: {
        performTime: '',                                    // 検査実施日時 required
        reportTime: ''                                      // 報告日時 required
    },
    reportStatus: {                                         // 報告状態
        value: '',
        attr: {
            statusCode: '',                                 // mid 検査中 final 最終報告 required
            statusCodeId: ''                                // mmlLb0001と入力 required
        }
    },
    testClass: {                                            // 報告書種別
        value: '',
        attr: {
            testClassCode: '',                              // MML0033 required
            testClassCodeId: ''                             // MML0033 required
        }
    },
    testSubclass: {                                         // 報告書詳細種別 ?
        value: '',
        attr: {
            testSubclassCode: '',
            testSubclassCodeId: ''
        }
    },
    organ: '',                                              // 臓器 ?
    consultFrom: {                                          // 依頼者情報 ?
        conFacility: {                                      // 依頼施設 ?
            value: '',
            attr: {
                facilityCode: '',
                facilityCodeId: ''                          // MML0027
            }
        },
        conDepartment: {                                    // 依頼診療科 ?
            value: '',
            attr: {
                depCode: '',
                depCodeId: ''
            }
        },
        conWard: {                                          // 依頼病棟 ?
            value: '',
            attr: {
                wardCode: '',
                wardCodeId: ''
            }
        },
        client: {                                           // 依頼者 ?
            value: '',
            attr: {
                clientCode: '',
                clientCodeId: ''
            }
        }
    },
    perform: {                                              // 実施者情報
        pFacility: {                                        // 実施施設
            value: '',
            attr: {
                facilityCode: '',                           // required
                facilityCodeId: ''                          // required
            }
        },
        pDepartment: {                                      // 実施診療科 ?
            value: '',
            attr: {
                depCode: '',
                depCodeId: ''
            }
        },
        pWard: {                                            // 実施病棟 ?
            value: '',
            attr: {
                wardCode: '',
                wardCodeId: ''
            }
        },
        performer: {                                        // 実施者
            value: '',
            attr: {
                performerCode: '',                          // required
                performerCodeId: ''                         // required
            }
        },
        supervisor: {                                        // 監督者 ?
            value: '',
            attr: {
                supervisorCode: '',
                supervisorCodeId: ''
            }
        }
    }
};

var reportBody = {                                          // 報告書本文情報
    chiefComplaints: '',                                    // 主訴 ?
    testPurpose: '',                                        // 検査目的 ?
    testDx: '',                                             // 検査診断 ?
    testNotes: {                                            // 検査所見記載 ?
        value: ''                                           // mixed=true extRef * 外部参照図
    },
    testMemo: [],                                           // 検査コメント ? [testMemo]
    testMemoF: ''                                           // 検査フリーコメント ?
};

var testMemo = {
    value: '',
    attr: {
        tmCodeName: '',
        tmCode: '',
        tmCodeId: ''
    }
};
********************************************************************************/

module.exports = {

    // reportStatus
    buildReportStatus: function (target, arr) {
        arr.push('<mmlRp:reportStatus');
        arr.push(' mmlRp:statusCode=');
        arr.push(utils.addQuote(target.attr.statusCode));
        arr.push(' mmlRp:statusCodeId=');
        arr.push(utils.addQuote(target.attr.statusCodeId));
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlRp:reportStatus>');
    },

    // testClass
    buildTestClass: function (target, arr) {
        arr.push('<mmlRp:testClass');
        arr.push(' mmlRp:testClassCode=');
        arr.push(utils.addQuote(target.attr.testClassCode));
        arr.push(' mmlRp:testClassCodeId=');
        arr.push(utils.addQuote(target.attr.testClassCodeId));
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlRp:testClass>');
    },

    // testSubclass
    buildTestSubclass: function (target, arr) {
        arr.push('<mmlRp:testSubclass>');
        if (target.hasOwnProperty('attr') && target.attr.hasOwnProperty('testSubclassCode')) {
            arr.push(' mmlRp:testSubclassCode=');
            arr.push(utils.addQuote(target.attr.testSubclassCode));
        }
        if (target.hasOwnProperty('attr') && target.attr.hasOwnProperty('testSubclassCodeId')) {
            arr.push(' mmlRp:testSubclassCodeId=');
            arr.push(utils.addQuote(target.attr.testSubclassCodeId));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlRp:testSubclass>');
    },

    // organ
    buildOrgan: function (target, arr) {
        arr.push('<mmlRp:organ>');
        arr.push(target);
        arr.push('</mmlRp:organ>');
    },

    // consultFrom
    buildConsultFrom: function (target, arr) {
        arr.push('<mmlRp:consultFrom>');

        if (target.hasOwnProperty('conFacility')) {
            var conFacility = target.conFacility;
            arr.push('<mmlRp:conFacility');
            if (conFacility.hasOwnProperty('attr') && conFacility.attr.hasOwnProperty('facilityCode')) {
                arr.push(' mmlRp:facilityCode=');
                arr.push(utils.addQuote(conFacility.attr.facilityCode));
            }
            if (conFacility.hasOwnProperty('attr') && conFacility.attr.hasOwnProperty('facilityCodeId')) {
                arr.push(' mmlRp:facilityCodeId=');
                arr.push(utils.addQuote(conFacility.attr.facilityCodeId));
            }
            arr.push('>');
            arr.push(conFacility.value);
            arr.push('</mmlRp:conFacility>');
        }
        if (target.hasOwnProperty('conDepartment')) {
            var conDepartment = target.conDepartment;
            arr.push('<mmlRp:conDepartment');
            if (conDepartment.hasOwnProperty('attr') && conDepartment.attr.hasOwnProperty('depCode')) {
                arr.push(' mmlRp:depCode=');
                arr.push(utils.addQuote(conDepartment.attr.depCode));
            }
            if (conDepartment.hasOwnProperty('attr') && conDepartment.attr.hasOwnProperty('depCodeId')) {
                // arr.push(' mmlRp:depCodeId=');
                arr.push(' depCodeId=');
                arr.push(utils.addQuote(conDepartment.attr.depCodeId));
            }
            arr.push('>');
            arr.push(conDepartment.value);
            arr.push('</mmlRp:conDepartment>');
        }
        if (target.hasOwnProperty('conWard')) {
            var conWard = target.conWard;
            arr.push('<mmlRp:conWard');
            if (conWard.hasOwnProperty('attr') && conWard.attr.hasOwnProperty('wardCode')) {
                arr.push(' mmlRp:wardCode=');
                arr.push(utils.addQuote(conWard.attr.wardCode));
            }
            if (conWard.hasOwnProperty('attr') && conWard.attr.hasOwnProperty('wardCodeId')) {
                arr.push(' mmlRp:wardCodeId=');
                arr.push(utils.addQuote(conWard.attr.wardCodeId));
            }
            arr.push('>');
            arr.push(conWard.value);
            arr.push('</mmlRp:conWard>');
        }
        if (target.hasOwnProperty('client')) {
            var client = target.client;
            arr.push('<mmlRp:client');
            if (client.hasOwnProperty('attr') && client.attr.hasOwnProperty('clientCode')) {
                arr.push(' mmlRp:clientCode=');
                arr.push(utils.addQuote(client.attr.clientCode));
            }
            if (client.hasOwnProperty('attr') && client.attr.hasOwnProperty('clientCodeId')) {
                arr.push(' mmlRp:clientCodeId=');
                arr.push(utils.addQuote(client.attr.clientCodeId));
            }
            arr.push('>');
            arr.push(client.value);
            arr.push('</mmlRp:client>');
        }

        arr.push('</mmlRp:consultFrom>');
    },

    // perform
    buildperform: function (target, arr) {
        arr.push('<mmlRp:perform>');

        if (target.hasOwnProperty('pFacility')) {
            var pFacility = target.pFacility;
            arr.push('<mmlRp:pFacility');
            if (pFacility.hasOwnProperty('attr') && pFacility.attr.hasOwnProperty('facilityCode')) {
                arr.push(' mmlRp:facilityCode=');
                arr.push(utils.addQuote(pFacility.attr.facilityCode));
            }
            if (pFacility.hasOwnProperty('attr') && pFacility.attr.hasOwnProperty('facilityCodeId')) {
                arr.push(' mmlRp:facilityCodeId=');
                arr.push(utils.addQuote(pFacility.attr.facilityCodeId));
            }
            arr.push('>');
            arr.push(pFacility.value);
            arr.push('</mmlRp:pFacility>');
        }
        if (target.hasOwnProperty('pDepartment')) {
            var pDepartment = target.pDepartment;
            arr.push('<mmlRp:pDepartment');
            if (pDepartment.hasOwnProperty('attr') && pDepartment.attr.hasOwnProperty('depCode')) {
                arr.push(' mmlRp:depCode=');
                arr.push(utils.addQuote(pDepartment.attr.depCode));
            }
            if (pDepartment.hasOwnProperty('attr') && pDepartment.attr.hasOwnProperty('depCodeId')) {
                // arr.push(' mmlRp:depCodeId=');
                arr.push(' depCodeId=');
                arr.push(utils.addQuote(pDepartment.attr.depCodeId));
            }
            arr.push('>');
            arr.push(pDepartment.value);
            arr.push('</mmlRp:pDepartment>');
        }
        if (target.hasOwnProperty('pWard')) {
            var pWard = target.pWard;
            arr.push('<mmlRp:pWard');
            if (pWard.hasOwnProperty('attr') && pWard.attr.hasOwnProperty('wardCode')) {
                arr.push(' mmlRp:wardCode=');
                arr.push(utils.addQuote(pWard.attr.wardCode));
            }
            if (pWard.hasOwnProperty('attr') && pWard.attr.hasOwnProperty('wardCodeId')) {
                arr.push(' mmlRp:wardCodeId=');
                arr.push(utils.addQuote(pWard.attr.wardCodeId));
            }
            arr.push('>');
            arr.push(pWard.value);
            arr.push('</mmlRp:pWard>');
        }
        if (target.hasOwnProperty('performer')) {
            var performer = target.performer;
            arr.push('<mmlRp:performer');
            if (performer.hasOwnProperty('attr') && performer.attr.hasOwnProperty('performerCode')) {
                arr.push(' mmlRp:performerCode=');
                arr.push(utils.addQuote(performer.attr.performerCode));
            }
            if (performer.hasOwnProperty('attr') && performer.attr.hasOwnProperty('performerCodeId')) {
                arr.push(' mmlRp:performerCodeId=');
                arr.push(utils.addQuote(performer.attr.performerCodeId));
            }
            arr.push('>');
            arr.push(performer.value);
            arr.push('</mmlRp:performer>');
        }
        if (target.hasOwnProperty('supervisor')) {
            var supervisor = target.supervisor;
            arr.push('<mmlRp:supervisor');
            if (supervisor.hasOwnProperty('attr') && supervisor.attr.hasOwnProperty('supervisorCode')) {
                arr.push(' mmlRp:supervisorCode=');
                arr.push(utils.addQuote(supervisor.attr.supervisorCode));
            }
            if (supervisor.hasOwnProperty('attr') && supervisor.attr.hasOwnProperty('supervisorCodeId')) {
                arr.push(' mmlRp:supervisorCodeId=');
                arr.push(utils.addQuote(supervisor.attr.supervisorCodeId));
            }
            arr.push('>');
            arr.push(supervisor.value);
            arr.push('</mmlRp:supervisor>');
        }

        arr.push('</mmlRp:perform>');
    },

    // information
    buildInformation: function (target, arr) {
        arr.push('<mmlRp:information');
        arr.push(' mmlRp:performTime=');
        arr.push(utils.addQuote(target.attr.performTime));
        arr.push(' mmlRp:reportTime=');
        arr.push(utils.addQuote(target.attr.reportTime));
        arr.push('>');

        // reportStatus
        this.buildReportStatus(target.reportStatus, arr);

        // testClass
        this.buildTestClass(target.testClass, arr);

        // testSubclass
        if (target.hasOwnProperty('testSubclass')) {
            this.buildTestSubclass(target.testSubclass, arr);
        }

        // organ
        if (target.hasOwnProperty('organ')) {
            this.buildOrgan(target.organ, arr);
        }

        // consultFrom
        if (target.hasOwnProperty('consultFrom')) {
            this.buildConsultFrom(target.consultFrom, arr);
        }

        // perform
        this.buildperform(target.perform, arr);

        arr.push('</mmlRp:information>');
    },

    // chiefComplaints
    buildChiefComplaints: function (target, arr) {
        arr.push('<mmlRp:chiefComplaints>');
        arr.push(target);
        arr.push('</mmlRp:chiefComplaints>');
    },

    // testPurpose
    buildTestPurpose: function (target, arr) {
        arr.push('<mmlRp:testPurpose>');
        arr.push(target);
        arr.push('</mmlRp:testPurpose>');
    },

    // testDx
    buildTestDx: function (target, arr) {
        arr.push('<mmlRp:testDx>');
        arr.push(target);
        arr.push('</mmlRp:testDx>');
    },

    // testNotes //
    buildTestNotes: function (target, arr) {
        arr.push('<mmlRp:testNotes>');
        arr.push(target.value);
        if (target.hasOwnProperty('extRef')) {
            target.extRef.forEach((entry) => {
                commonBuilder.buildExtRef(entry, arr);
            });
        }
        arr.push('</mmlRp:testNotes>');
    },

    // testMemo
    buildTestMemo: function (target, arr) {
        arr.push('<mmlRp:testMemo');
        if (target.hasOwnProperty('attr') && target.attr.hasOwnProperty('tmCodeName')) {
            arr.push(' mmlRp:tmCodeName=');
            arr.push(utils.addQuote(target.attr.tmCodeName));
        }
        if (target.hasOwnProperty('attr') && target.attr.hasOwnProperty('tmCode')) {
            arr.push(' mmlRp:tmCode=');
            arr.push(utils.addQuote(target.attr.tmCode));
        }
        if (target.hasOwnProperty('attr') && target.attr.hasOwnProperty('tmCodeId')) {
            arr.push(' mmlRp:tmCodeId=');
            arr.push(utils.addQuote(target.attr.tmCodeId));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlRp:testMemo>');
    },

    // testMemoF
    buildTestMemoF: function (target, arr) {
        arr.push('<mmlRp:testMemoF>');
        arr.push(target);
        arr.push('</mmlRp:testMemoF>');
    },

    // reportBody
    buildReportBody: function (target, arr) {
        arr.push('<mmlRp:reportBody>');

        // chiefComplaints
        if (target.hasOwnProperty('chiefComplaints')) {
            this.buildChiefComplaints(target.chiefComplaints, arr);
        }

        // testPurpose
        if (target.hasOwnProperty('testPurpose')) {
            this.buildTestPurpose(target.testPurpose, arr);
        }

        // testDx
        if (target.hasOwnProperty('testDx')) {
            this.buildTestDx(target.testDx, arr);
        }

        // testNotes
        if (target.hasOwnProperty('testNotes')) {
            this.buildTestNotes(target.testNotes, arr);
        }

        // testMemo
        if (target.hasOwnProperty('testMemo')) {
            this.buildTestMemo(target.testMemo, arr);
        }

        // testMemoF
        if (target.hasOwnProperty('testMemoF')) {
            this.buildTestMemoF(target.testMemoF, arr);
        }

        arr.push('</mmlRp:reportBody>');
    },

    build: function (target, arr) {
        arr.push('<mmlRp:ReportModule>');

        // information
        this.buildInformation(target.information, arr);

        // reportBody
        this.buildReportBody(target.reportBody, arr);

        arr.push('</mmlRp:ReportModule>');
    }
};
