'use strict';

const utils = require('../lib/utils');

/*******************************************************************************
var BaseClinicModule = {                    // 基礎的診療情報
    allergy: [],                            // アレルギー情報 ? [allergyItem]
    bloodtype: {},                          // 血液型情報 ?
    infection: []                           // 感染性情報 ? [infectionItem]
};

var allergyItem = {
    factor: '',                             // アレルギー原因
    severity: '',                           // アレルギー反応程度 ? MML0017
    identifiedDate: '',                     // アレルギー同定日 ?
    memo: ''                                // アレルギーメモ ?
};

var bloodtype = {
    abo: '',                                // ABO 式血液型 MML0018
    rh: '',                                 // Rho(D) 式血液型 ? MML0019
    others: [],                             // その他の血液型 ? [other]
    memo: ''                                // メモ ?
};

var other = {
    typeName: '',                           // 血液型名称
    typeJudgement: '',                      // 血液型判定
    description: ''                         // 血液型注釈 ?
};

var infectionItem = {
    factor: '',                             // 感染性要因名
    examValue: '',                          // 感染性要因検査値
    identifiedDate: '',                     // 感染性要因同定日 ?
    memo: ''                                // 感染性要因メモ ?
};
********************************************************************************/

module.exports = {

    // allergy
    buildAllergy: function (target, arr) {
        arr.push('<mmlBc:allergy>');
        target.forEach((entry) => {
            arr.push('<mmlBc:allergyItem>');

            arr.push('<mmlBc:factor>');
            arr.push(entry.factor);
            arr.push('</mmlBc:factor>');

            if (entry.hasOwnProperty('severity')) {
                arr.push('<mmlBc:severity>');
                arr.push(entry.severity);
                arr.push('</mmlBc:severity>');
            }

            if (entry.hasOwnProperty('identifiedDate')) {
                arr.push('<mmlBc:identifiedDate>');
                arr.push(entry.identifiedDate);
                arr.push('</mmlBc:identifiedDate>');
            }

            if (entry.hasOwnProperty('memo')) {
                arr.push('<mmlBc:memo>');
                arr.push(entry.memo);
                arr.push('</mmlBc:memo>');
            }

            arr.push('</mmlBc:allergyItem>');
        });
        arr.push('</mmlBc:allergy>');
    },

    // bloodtype
    buildBloodtype: function (target, arr) {
        arr.push('<mmlBc:bloodtype>');

        arr.push('<mmlBc:abo>');
        arr.push(target.abo);
        arr.push('</mmlBc:abo>');

        if (target.hasOwnProperty('rh')) {
            arr.push('<mmlBc:rh>');
            arr.push(target.rh);
            arr.push('</mmlBc:rh>');
        }

        if (target.hasOwnProperty('others')) {
            arr.push('<mmlBc:others>');
            target.others.forEach((entry) => {
                arr.push('<mmlBc:other>');
                arr.push('<mmlBc:typeName>');
                arr.push(entry.typeName);
                arr.push('</mmlBc:typeName>');
                arr.push('<mmlBc:typeJudgement>');
                arr.push(entry.typeJudgement);
                arr.push('</mmlBc:typeJudgement>');
                if (entry.hasOwnProperty('description')) {
                    arr.push('<mmlBc:description>');
                    arr.push(entry.description);
                    arr.push('</mmlBc:description>');
                }
                arr.push('</mmlBc:other>');
            });
            arr.push('</mmlBc:others>');
        }

        if (target.hasOwnProperty('memo')) {
            arr.push('<mmlBc:memo>');
            arr.push(target.memo);
            arr.push('</mmlBc:memo>');
        }

        arr.push('</mmlBc:bloodtype>');
    },

    // infection
    buildInfection: function (target, arr) {
        arr.push('<mmlBc:infection>');
        target.forEach((entry) => {
            arr.push('<mmlBc:infectionItem>');

            arr.push('<mmlBc:factor>');
            arr.push(entry.factor);
            arr.push('</mmlBc:factor>');

            arr.push('<mmlBc:examValue>');
            arr.push(entry.examValue);
            arr.push('</mmlBc:examValue>');

            if (entry.hasOwnProperty('identifiedDate')) {
                arr.push('<mmlBc:identifiedDate>');
                arr.push(entry.identifiedDate);
                arr.push('</mmlBc:identifiedDate>');
            }

            if (entry.hasOwnProperty('memo')) {
                arr.push('<mmlBc:memo>');
                arr.push(entry.memo);
                arr.push('</mmlBc:memo>');
            }

            arr.push('</mmlBc:infectionItem>');
        });
        arr.push('</mmlBc:infection>');
    },

    build: function (target, arr) {

        arr.push('<mmlBc:BaseClinicModule>');

        // allergy
        if (target.hasOwnProperty('allergy')) {
            this.buildAllergy(target.allergy, arr);
        }

        // bloodtype
        if (target.hasOwnProperty('bloodtype')) {
            this.buildBloodtype(target.bloodtype, arr);
        }

        // infection
        if (target.hasOwnProperty('infection')) {
            this.buildInfection(target.infection, arr);
        }

        arr.push('</mmlBc:BaseClinicModule>');
    }
};
