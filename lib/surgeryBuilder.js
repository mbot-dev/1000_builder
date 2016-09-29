'use strict';

const utils = require('../lib/utils');
const commonBuilder = require('../lib/commonBuilder');

/*******************************************************************************
var SurgeryModule = {                                   // 手術記録情報
    surgeryItem: []
};

var surgeryItem = {
    surgicalInfo: {                                     // 手術ヘッダー情報
        attr: {
            type: ''                                    // MML0021
        },
        date: '',                                       // 手術施行日 CCYY-MM-DD
        startTime: '',                                  // 手術開始時刻 ? hh:mm
        duration: '',                                   // 手術時間 ? PTnHnM 5時間25分=PT5H25M
        surgicalDepartment: {},                         // 手術実施診療科情報 ? mmlDp:Departmentの配列  xsd確認 []
        patientDepartment: {}                           // 手術時に患者の所属していた診療科 mmlDp:Departmentの配列 説明X  xsd確認 []
    },
    surgicalDiagnosis: [],                              // 外科診断情報 mmlRd:RegisteredDiagnosisModuleの配列
    surgicalProcedure: [],                              // 手術法情報 procedureItemの配列
    surgicalStaffs: [],                                 // 麻酔を除く手術スタッフの情報 staffの配列 xsd確認 minOccurs=0
    anesthesiaProcedure: [],                            // 麻酔法名情報 ? titleの配列
    anesthesiologists: [],                              // 麻酔医情報 ? staffの配列
    anesthesiaDuration: '',                             // 麻酔時間 ? PTnHnM
    operativeNotes: '',                                 // 手術記録の自由文章表現 ?
    referenceInfo: {},                                  // 手術記録に用いる図や写真を外部参照 ? mmlCm:extRef
    memo: ''                                            // 手術に関する追加事項 ?
};

var procedureItem = {
    operation: {                                        // 手術法 choice
        value: '',
        attr: {
            code: '',                                   // 手術法コード
            system: ''                                  // 手術法コード体系名
        }
    },
    operationElement: [],                               // 手術法の要素分割表記 choice operationElementItem
    procedureMemo: ''                                   // 手術法に関する追加事項 ?
};

var operationElementItem = {
    values: []                                          // 分割された手術要素名 title配列
};

var title = {                                           // 分割された手術要素名
    value: '',
    attr: {
        code: '',                                       // 手術法コード 麻酔法名コード
        system: ''                                      // 手術法コード体系名 麻酔法名コード体系名
    }
};

var staff = {
    attr: {
        superiority: '',                                // 序列
        staffClass: ''                                  // 手術スタッフ区分 MML0022
    },
    staffInfo: {}                                      // スタッフ ID 情報 mmlPsi:PersonalizedInfoの配列 xsd確認 []
};
*******************************************************************************/

module.exports = {

    // surgicalInfo
    buildSurgicalInfo: function (target, arr) {
        arr.push('<mmlSg:surgicalInfo');
        if (target.hasOwnProperty('attr')) {
            arr.push(' mmlSg:type=');
            arr.push(utils.addQuote(target.attr.type));
        }
        arr.push('>');

        arr.push('<mmlSg:date>');
        arr.push(target.date);
        arr.push('</mmlSg:date>');

        if (target.hasOwnProperty('startTime')) {
            arr.push('<mmlSg:startTime>');
            arr.push(target.startTime);
            arr.push('</mmlSg:startTime>');
        }

        if (target.hasOwnProperty('duration')) {
            arr.push('<mmlSg:duration>');
            arr.push(target.duration);
            arr.push('</mmlSg:duration>');
        }

        if (target.hasOwnProperty('surgicalDepartment')) {
            arr.push('<mmlSg:surgicalDepartment>');
            commonBuilder.buildDepartment(target.surgicalDepartment, arr);
            arr.push('</mmlSg:surgicalDepartment>');
        }

        if (target.hasOwnProperty('patientDepartment')) {
            arr.push('<mmlSg:patientDepartment>');
            commonBuilder.buildDepartment(target.patientDepartment, arr);
            arr.push('</mmlSg:patientDepartment>');
        }
        arr.push('</mmlSg:surgicalInfo>');
    },

    // surgicalDiagnosis
    buildSurgicalDiagnosis: function (target, arr) {
        arr.push('<mmlSg:surgicalDiagnosis>');
        target.forEach((entry) {
            diagnosisBuilder.build(entry, arr);
        });
        arr.push('</mmlSg:surgicalDiagnosis>');
    },

    // surgicalProcedure
    buildSurgicalProcedure: function (target, arr) {
        arr.push('<mmlSg:surgicalProcedure>');
        target.forEach((entry) {
            arr.push('<mmlSg:procedureItem>');

            if (entry.hasOwnProperty('operation')) {
                var operation = entry.operation;
                arr.push('<mmlSg:operation');
                if (operation.hasOwnProperty('attr') && operation.attr.hasOwnProperty('code')) {
                    arr.push(' mmlSg:code=');
                    arr.push(operation.attr.code);
                }
                if (operation.hasOwnProperty('attr') && operation.attr.hasOwnProperty('system')) {
                    arr.push(' mmlSg:system=');
                    arr.push(operation.attr.system);
                }
                arr.push('>');
                arr.push(operation.value);
                arr.push('<mmlSg:operation>');

            } else if (entry.hasOwnProperty('operationElement')) {
                arr.push('<mmlSg:operationElement>');
                entry.operationElement.forEach((e) {
                    arr.push('<mmlSg:operationElementItem>');
                    arr.push('<mmlSg:title');
                    if (e.hasOwnProperty('attr') && e.attr.hasOwnProperty('code')) {
                        arr.push(' mmlSg:code=');
                        arr.push(utils.addQuote(e.attr.code));
                    }
                    if (e.hasOwnProperty('attr') && e.attr.hasOwnProperty('system')) {
                        arr.push(' mmlSg:system=');
                        arr.push(utils.addQuote(e.attr.system));
                    }
                    arr.push('>');
                    arr.push(e.value);
                    arr.push('</mmlSg:title>');
                    arr.push('</mmlSg:operationElementItem>')
                });
                arr.push('</mmlSg:operationElement>');
            }
            // memo
            if (entry.hasOwnProperty('procedureMemo')) {
                arr.push('<mmlSg:procedureMemo>');
                arr.push(entry.procedureMemo);
                arr.push('</mmlSg:procedureMemo>');
            }
            arr.push('</mmlSg:procedureItem>');
        });
        arr.push('</mmlSg:surgicalProcedure>');
    },

    // surgicalStaffs
    buildSurgicalStaffs: function (target, arr) {
        arr.push('<mmlSg:surgicalStaffs>');
        target.forEach((entry) {
            arr.push('<mmlSg:staff ');
            if (entry.hasOwnProperty('attr') && entry.attr.hasOwnProperty('staffClass') {
                arr.push(' mmlSg:staffClass=');
                arr.push(utils.addQuote(entry.attr.staffClass));
            }
            if (entry.hasOwnProperty('attr') && entry.attr.hasOwnProperty('superiority') {
                arr.push(' mmlSg:superiority=');
                arr.push(utils.addQuote(entry.attr.superiority));
            }
            arr.push('>');
            arr.push('<mmlSg:staffInfo>');
            commonBuilder.buildPersonalizedInfo(entry.PersonalizedInfo, arr);
            arr.push('</mmlSg:staffInfo>');
            arr.push('</mmlSg:staff>');
        });
        arr.push('</mmlSg:surgicalStaffs>');
    },

    // anesthesiaProcedure
    buildAnesthesiaProcedure: function (target, arr) {
        arr.push('<mmlSg:anesthesiaProcedure>');
        target.forEach((entry) {
            arr.push('<mmlSg:title');
            if (e.hasOwnProperty('attr') && e.attr.hasOwnProperty('code')) {
                arr.push(' mmlSg:code=');
                arr.push(utils.addQuote(e.attr.code));
            }
            if (e.hasOwnProperty('attr') && e.attr.hasOwnProperty('system')) {
                arr.push(' mmlSg:system=');
                arr.push(utils.addQuote(e.attr.system));
            }
            arr.push('>');
            arr.push(entry.value);
            arr.push('</mmlSg:title>');
        });
        arr.push('</mmlSg:anesthesiaProcedure>');
    },

    // anesthesiologists
    buildAnesthesiologists: function (target, arr) {
        arr.push('<mmlSg:anesthesiologists>');
        target.forEach((entry) {
            arr.push('<mmlSg:staff ');
            if (entry.hasOwnProperty('attr') && entry.attr.hasOwnProperty('staffClass') {
                arr.push(' mmlSg:staffClass=');
                arr.push(utils.addQuote(entry.attr.staffClass));
            }
            if (entry.hasOwnProperty('attr') && entry.attr.hasOwnProperty('superiority') {
                arr.push(' mmlSg:superiority=');
                arr.push(utils.addQuote(entry.attr.superiority));
            }
            arr.push('>');
            arr.push('<mmlSg:staffInfo>');
            commonBuilder.buildPersonalizedInfo(entry.PersonalizedInfo, arr);
            arr.push('</mmlSg:staffInfo>');
            arr.push('</mmlSg:staff>');
        });
        arr.push('</mmlSg:anesthesiologists>');
    },

    // anesthesiaDuration
    buildAnesthesiaDuration: function (target, arr) {
        arr.push('<mmlSg:anesthesiaDuration>');
        arr.push(target);
        arr.push('</mmlSg:anesthesiaDuration>');
    },

    // operativeNotes
    buildOperativeNotes: function (target, arr) {
        arr.push('<mmlSg:operativeNotes>');
        arr.push(target);
        arr.push('</mmlSg:operativeNotes>');
    },

    // referenceInfo
    buildReferenceInfo: function (target, arr) {
        arr.push('<mmlSg:referenceInfo>');
        target.forEach((entry) {
            commonBuilder.buildExtRef(entry, arr);
        });
        arr.push('</mmlSg:referenceInfo>');
    },

    // memo
    buildMemo: function (target, arr) {
        arr.push('<mmlSg:memo>');
        arr.push(target);
        arr.push('</mmlSg:memo>');
    },

    build: function (target, arr) {

        arr.push('<mmlSg:SurgeryModule>');

        target.surgeryItem.forEach((entry) {
            arr.push('<mmlSg:surgeryItem>');

            // surgicalInfo
            this.buildSurgicalInfo(entry.surgicalInfo, arr);

            // surgicalDiagnosis
            this.buildSurgicalDiagnosis(entry.surgicalDiagnosis, arr);

            // surgicalProcedure
            this.buildSurgicalProcedure(entry.surgicalProcedure, arr);

            // surgicalStaffs
            if (target.hasOwnProperty('surgicalStaffs')) {
                this.buildSurgicalStaffs(entry.surgicalStaffs, arr);
            }

            // anesthesiaProcedure
            if (target.hasOwnProperty('anesthesiaProcedure')) {
                this.buildAnesthesiaProcedure(entry.anesthesiaProcedure, arr);
            }

            // anesthesiologists
            if (target.hasOwnProperty('anesthesiologists')) {
                this.buildAnesthesiologists(entry.anesthesiologists, arr);
            }

            // anesthesiaDuration
            if (target.hasOwnProperty('anesthesiaDuration')) {
                this.buildAnesthesiaDuration(entry.anesthesiaDuration, arr);
            }

            // operativeNotes
            if (target.hasOwnProperty('operativeNotes')) {
                this.buildOperativeNotes(entry.operativeNotes, arr);
            }

            // referenceInfo
            if (target.hasOwnProperty('referenceInfo')) {
                this.buildReferenceInfo(entry.referenceInfo, arr);
            }

            // memo
            if (target.hasOwnProperty('memo')) {
                this.buildMemo(entry.memo, arr);
            }

            arr.push('<mmlSg:surgeryItem>');
        });

        arr.push('</mmlSg:SurgeryModule>');
    }
};
