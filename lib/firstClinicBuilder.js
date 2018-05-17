'use strict';

const utils = require('../lib/utils');
const diagnosisBuilder = require('../lib/diagnosisBuilder');
const commonBuilder = require('../lib/commonBuilder');

/******************************************************************************
var FirstClinicModule = {                                   // 初診時特有情報
    familyHistory: [],                                      // 家族歴情報 ? [familyHistoryItem]
    childhood: {},                                          // 小児期情報 ?
    pastHistory: {},                                        // 既往歴情報 ?
    chiefComplaints: '',                                    // 主訴 ?
    presentIllnessNotes: ''                                 // 現病歴自由記載 ?
};

var familyHistoryItem = {
    relation: '',                                           // 続柄コード MML0020
    RegisteredDiagnosisModule: {},                          // 疾患名情報
    age: '',                                                // 家族の疾患時年齢 ?
    memo: ''                                                // メモ ?
};

var childhood = {                                           // 出生時情報
    birthInfo: {
        Facility: {},                                       // 出生施設 ? MML 共通形式 (施設情報形式)
        deliveryWeeks: '',                                  // 分娩時週数 ? PnW
        deliveryMethod: '',                                 // 分娩方法 ?
        bodyWeight: {                                       // 出生時体重 ?
            value: '',
            attr: {
                unit: ''
            }
        },
        bodyHeight: {                                       // 出生時身長 ?
            value: '',
            attr: {
                unit: ''
            }
        },
        chestCircumference: {                               // 出生時胸囲 ?
            value: '',
            attr: {
                unit: ''
            }
        },
        headCircumference: {                                // 出生時頭囲 ?
            value: '',
            attr: {
                unit: ''
            }
        },
        memo: ''                                            // 出生時メモ ?
    },
    vaccination: []                                         // 予防接種情報 ? [vaccinationItem]
};

var vaccinationItem = {
    vaccine: '',                                            // 接種ワクチン名
    injected: '',                                           // 実施状態．true：ワクチン接種，false：接種せず
    age: '',                                                // 接種時年齢 ? PnYnM 1歳6ヶ月=P1Y6M
    memo: ''                                                // 実施時メモ ?
};

var pastHistory = {                                         // 既往歴情報 choice
    freeNotes: '',                                          // 自由文章表現 choice
    pastHistoryItem: []                                     // 時間表現併用 choice
};

var pastHistoryItem = {
    timeExpression: '',                                     // 時間表現
    eventExpression: []                                     // 時間表現に対応するイベント表現 ? [string]
};
******************************************************************************/

module.exports = {

    // familyHistory
    buildFamilyHistory: function (target, arr) {
        arr.push('<mmlFcl:familyHistory>');
        target.forEach((entry) => {
            arr.push('<mmlFcl:familyHistoryItem>');

            arr.push('<mmlFcl:relation>');
            arr.push(entry.relation);
            arr.push('</mmlFcl:relation>');

            diagnosisBuilder.build(entry.RegisteredDiagnosisModule, arr);

            if (entry.hasOwnProperty('age')) {
                arr.push('<mmlFcl:age>');
                arr.push(entry.age);
                arr.push('</mmlFcl:age>');
            }

            if (entry.hasOwnProperty('memo')) {
                arr.push('<mmlFcl:memo>');
                arr.push(entry.memo);
                arr.push('</mmlFcl:memo>');
            }

            arr.push('</mmlFcl:familyHistoryItem>');
        });
        arr.push('</mmlFcl:familyHistory>');
    },

    // childhood
    buildChildhood: function (target, arr) {
        arr.push('<mmlFcl:childhood>');

        if (target.hasOwnProperty('birthInfo')) {
            const birthInfo = target.birthInfo;
            arr.push('<mmlFcl:birthInfo>');
            if (birthInfo.hasOwnProperty('Facility')) {
                commonBuilder.buildFacility(birthInfo.Facility, arr);
            }
            if (birthInfo.hasOwnProperty('deliveryWeeks')) {
                arr.push('<mmlFcl:deliveryWeeks>');
                arr.push(birthInfo.deliveryWeeks);
                arr.push('</mmlFcl:deliveryWeeks>');
            }
            if (birthInfo.hasOwnProperty('deliveryMethod')) {
                arr.push('<mmlFcl:deliveryMethod>');
                arr.push(birthInfo.deliveryMethod);
                arr.push('</mmlFcl:deliveryMethod>');
            }
            if (birthInfo.hasOwnProperty('bodyWeight')) {
                arr.push('<mmlFcl:bodyWeight ');
                arr.push(' mmlFcl:unit=');
                arr.push(utils.addQuote(birthInfo.bodyWeight.attr.unit));
                arr.push('>');
                arr.push(birthInfo.bodyWeight.value);
                arr.push('</mmlFcl:bodyWeight>');
            }
            if (birthInfo.hasOwnProperty('bodyHeight')) {
                arr.push('<mmlFcl:bodyHeight ');
                arr.push(' mmlFcl:unit=');
                arr.push(utils.addQuote(birthInfo.bodyHeight.attr.unit));
                arr.push('>');
                arr.push(birthInfo.bodyHeight.value);
                arr.push('</mmlFcl:bodyHeight>');
            }
            if (birthInfo.hasOwnProperty('chestCircumference')) {
                arr.push('<mmlFcl:chestCircumference ');
                arr.push(' mmlFcl:unit=');
                arr.push(utils.addQuote(birthInfo.chestCircumference.attr.unit));
                arr.push('>');
                arr.push(birthInfo.chestCircumference.value);
                arr.push('</mmlFcl:chestCircumference>');
            }
            if (birthInfo.hasOwnProperty('headCircumference')) {
                arr.push('<mmlFcl:headCircumference ');
                arr.push(' mmlFcl:unit=');
                arr.push(utils.addQuote(birthInfo.headCircumference.attr.unit));
                arr.push('>');
                arr.push(birthInfo.headCircumference.value);
                arr.push('</mmlFcl:headCircumference>');
            }
            if (birthInfo.hasOwnProperty('memo')) {
                arr.push('<mmlFcl:memo>');
                arr.push(birthInfo.memo);
                arr.push('</mmlFcl:memo>');
            }

            arr.push('</mmlFcl:birthInfo>');
        }

        if (target.hasOwnProperty('vaccination')) {
            arr.push('<mmlFcl:vaccination>');
            target.vaccination.forEach((entry) => {
                arr.push('<mmlFcl:vaccinationItem>');

                arr.push('<mmlFcl:vaccine>');
                arr.push(entry.vaccine);
                arr.push('</mmlFcl:vaccine>');

                arr.push('<mmlFcl:injected>');
                arr.push(entry.injected);
                arr.push('</mmlFcl:injected>');

                if (entry.hasOwnProperty('age')) {
                    arr.push('<mmlFcl:age>');
                    arr.push(entry.age);
                    arr.push('</mmlFcl:age>');
                }

                if (entry.hasOwnProperty('memo')) {
                    arr.push('<mmlFcl:memo>');
                    arr.push(entry.memo);
                    arr.push('</mmlFcl:memo>');
                }

                arr.push('</mmlFcl:vaccinationItem>');
            });
            arr.push('</mmlFcl:vaccination>');
        }
        arr.push('</mmlFcl:childhood>');
    },

    // pastHistory
    buildPastHistory: function (target, arr) {
        arr.push('<mmlFcl:pastHistory>');
        if (target.hasOwnProperty('freeNotes')) {
            arr.push('<mmlFcl:freeNotes>');
            arr.push(target.freeNotes);
            arr.push('</mmlFcl:freeNotes>');

        } else if (target.hasOwnProperty('pastHistoryItem')) {
            target.pastHistoryItem.forEach((entry) => {
                arr.push('<mmlFcl:pastHistoryItem>');

                arr.push('<mmlFcl:timeExpression>');
                arr.push(entry.timeExpression);
                arr.push('</mmlFcl:timeExpression>');

                if (entry.hasOwnProperty('eventExpression')) {
                    entry.eventExpression.forEach((e) => {
                        arr.push('<mmlFcl:eventExpression>');
                        arr.push(e);
                        arr.push('</mmlFcl:eventExpression>');
                    });
                }

                arr.push('</mmlFcl:pastHistoryItem>');
            });
        }
        arr.push('</mmlFcl:pastHistory>');
    },

    // chiefComplaints
    buildChiefComplaints: function (target, arr) {
        arr.push('<mmlFcl:chiefComplaints>');
        arr.push(target);
        arr.push('</mmlFcl:chiefComplaints>');
    },

    // presentIllnessNotes
    buildPresentIllnessNotes: function (target, arr) {
        arr.push('<mmlFcl:presentIllnessNotes>');
        arr.push(target);
        arr.push('</mmlFcl:presentIllnessNotes>');
    },

    build: function (target, arr) {

        arr.push('<mmlFcl:FirstClinicModule>');

        // familyHistory
        if (target.hasOwnProperty('familyHistory')) {
            this.buildFamilyHistory(target.familyHistory, arr);
        }

        // childhood
        if (target.hasOwnProperty('childhood')) {
            this.buildChildhood(target.childhood, arr);
        }

        // pastHistory
        if (target.hasOwnProperty('pastHistory')) {
            this.buildPastHistory(target.pastHistory, arr);
        }

        // chiefComplaints
        if (target.hasOwnProperty('chiefComplaints')) {
            this.buildChiefComplaints(target.chiefComplaints, arr);
        }

        // presentIllnessNotes
        if (target.hasOwnProperty('presentIllnessNotes')) {
            this.buildPresentIllnessNotes(target.presentIllnessNotes, arr);
        }

        arr.push('</mmlFcl:FirstClinicModule>');
    },

    deleteInstance: function (arr) {
        arr.push('<mmlFcl:FirstClinicModule/>');
    }
};
