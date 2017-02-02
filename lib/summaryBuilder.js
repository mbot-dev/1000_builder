'use strict';

const utils = require('../lib/utils');
const commonBuilder = require('../lib/commonBuilder');
const diagnosisBuilder = require('../lib/diagnosisBuilder');
const surgeryBuilder = require('../lib/surgeryBuilder');
const prescriptionBuilder = require('../lib/prescriptionBuilder');

/*********************************************************************************
var SummaryModule = {                                       // 臨床経過サマリー情報
    serviceHistory: {                                       // 期間情報
        attr: {
            start: '',                                          // サマリー対象期間の開始日
            end: ''                                             // サマリー対象期間の終了日
        },
        outPatient: [],                                         // 外来受診歴情報 ? [outPatientItem]
        inPatient: []                                           // 入院暦情報 ? [inPatientItem]
    },
    RegisteredDiagnosisModule: [],                          // サマリーにおける診断履歴情報 *
    deathInfo: {                                            // 死亡関連情報 ?
        value: '',
        attr: {
            date: '',                                           // 死亡日時
            autopsy: ''                                         // 剖検の有無．true：剖検あり，false：なし
        }
    },
    SurgeryModule: [],                                      // サマリーにおける手術記録情報 ?
    chiefComplaints: '',                                    // 主訴 ?
    patientProfile: '',                                     // 患者プロフィール ?
    history: '',                                            // 入院までの経過 ?
    physicalExam: {                                         // 入院時理学所見 ?
        value: [],                                          // xs:any *
        extRef: []                                          // [extRef] *
    },
    clinicalCourse: [],                                     // 経過および治療 ? [mmlSm:clinicalRecord]
    dischargeFindings: {                                    // 退院時所見 ?
        value: [],                                          // xs:any *
        extRef: []                                          // extRef * [extRef]
    },
    medication: {                                           // 退院時処方 ? medication
        value: '',                                          // mixed=true
        simplePrescription: {},                             // simplePrescription ?
        extRef: []                                          // extRef * [extRef]
    },
    testResults: [],                                        // 退院時検査結果 ? [testResult]
    plan: {                                                 // 退院後治療方針 ? plan
        value: [],                                          // xs:any *
        extRef: []                                          // extRef * [extRef]
    },
    remarks: ''                                             // 患者に関する留意事項 ?
};

var outPatientItem = {
    date: '',                                               // 外来受診日 date　書式：CCYY-MM-DD
    outPatientCondition: {                                  // 外来受診状態 ?
        value: '',
        attr: {
            first: '',                                      // 初診．true：初診，false：再診
            emergency: ''                                   // 救急受診．true：救急，false：通常
        }
    },
    staffs: []                                              // 患者担当スタッフ情報 ? [staffInfo]
};

var inPatientItem = {                                       // 個々の入院暦
    admission: {},                                          // 入院
    discharge: {},                                          // 退院
    staffs: [],                                             // ? [staffInfo]
};

var staffInfo = {                                           // 外来担当スタッフ
    PersonalizedInfo: {},                                   // mmlPsi:PersonalizedInfo  ToDo PersonalizedInfo
    creatorLicense: []                                      // mmlCi:creatorLicense
};

var admission = {                                           // 入院
    date: '',                                               // 入院 (転入) 日 CCYY-MM-DD
    admissionCondition: {                                   // 入院時状態 ?
        value: '',
        attr: {
            emergency: ''                                   // 緊急入院．boolean true：緊急入院，false：通常
        }
    },
    referFrom: {}                                           // 紹介元情報 ? mmlPsi:PersonalizedInfo
};

var discharge = {                                           // 退院
    date: '',                                               // 退院 (転出) 日 CCYY-MM-DD
    dischargeCondition: {                                   // 退院時状態 ?
        value: '',
        attr: {
            outcome: ''                                     // 退院時転帰 MML0016
        }
    },
    referTo: {}                                             // 紹介先情報 ? mmlPsi:PersonalizedInfo
};

// contains both text and other elements
var clinicalRecord = {
    attr: {
        date: ''                                            // イベント発生日時
    },
    value: '',
    relatedDoc: [],                                         // 関連文書 * [relatedDoc]
    extRef: []                                              // extref * [extRef]
};

// contains both text and other elements
var testResult = {                                          // 個々の検査結果
    attr: {
        date: ''                                            // YYYY-MM-DDThhTHH:mm:ss
    },
    value: '',
    extRef: [],                                             // extRef * [extRef]
    relatedDoc: []                                          // 関連文書 * [relatedDoc]
};

var relatedDoc = {
    value: '',                                              // MmlModuleItemのuid
    attr: {
        relation: ''                                        // MML0008
    }
};
*********************************************************************************/

module.exports = {

    // serviceHistory
    buildServiceHistory: function (target, arr) {
        arr.push('<mmlSm:serviceHistory');

        //--------------------------------------------------------------------------
        // attribute
        //--------------------------------------------------------------------------
        if (target.hasOwnProperty('attr') && target.attr.hasOwnProperty('start')) {
            arr.push(' mmlSm:start=');
            arr.push(utils.addQuote(target.attr.start));
        }
        if (target.hasOwnProperty('attr') && target.attr.hasOwnProperty('end')) {
            arr.push(' mmlSm:end=');
            arr.push(utils.addQuote(target.attr.end));
        }
        arr.push('>');

        //--------------------------------------------------------------------------
        // outPatient
        //--------------------------------------------------------------------------
        if (target.hasOwnProperty('outPatient')) {
            arr.push('<mmlSm:outPatient>');
            target.outPatient.forEach((entry) => {
                arr.push('<mmlSm:outPatientItem>');

                arr.push('<mmlSm:date>');
                arr.push(entry.date);
                arr.push('</mmlSm:date>');

                if (entry.hasOwnProperty('outPatientCondition')) {
                    var outPatientCondition = entry.outPatientCondition;
                    arr.push('<mmlSm:outPatientCondition');
                    if (outPatientCondition.hasOwnProperty('attr') && outPatientCondition.attr.hasOwnProperty('first')) {
                        arr.push(' mmlSm:first=');
                        arr.push(utils.addQuote(outPatientCondition.attr.first));
                    }
                    if (outPatientCondition.hasOwnProperty('attr') && outPatientCondition.attr.hasOwnProperty('emergency')) {
                        arr.push(' mmlSm:emergency=');
                        arr.push(utils.addQuote(outPatientCondition.attr.emergency));
                    }
                    arr.push('>');
                    arr.push(outPatientCondition.value);
                    arr.push('</mmlSm:outPatientCondition>');
                }

                // staffs
                if (entry.hasOwnProperty('staffs')) {
                    arr.push('<mmlSm:staffs>');
                    entry.staffs.forEach((staffInfo) => {
                        arr.push('<mmlSm:staffInfo>');
                        commonBuilder.buildPersonalizedInfo(staffInfo.PersonalizedInfo, arr);
                        staffInfo.creatorLicense.forEach((cl) => {
                            commonBuilder.buildCreatorLicense(cl, arr);
                        });
                        arr.push('</mmlSm:staffInfo>');
                    });
                    arr.push('</mmlSm:staffs>');
                }

                arr.push('</mmlSm:outPatientItem>');
            });
            arr.push('</mmlSm:outPatient>');
        }

        //--------------------------------------------------------------------------
        // inPatient(admission,discharge,staffs)
        //--------------------------------------------------------------------------
        if (target.hasOwnProperty('inPatient')) {
            arr.push('<mmlSm:inPatient>');
            target.inPatient.forEach((entry) => {
                // entry = inPatientItem
                arr.push('<mmlSm:inPatientItem>');

                //-----------------------------------------------------------
                // admission(date,admissionCondition,referFrom)
                //-----------------------------------------------------------
                var admission = entry.admission;
                arr.push('<mmlSm:admission>');
                arr.push('<mmlSm:date>');
                arr.push(admission.date);
                arr.push('</mmlSm:date>');

                // admissionCondition
                if (admission.hasOwnProperty('admissionCondition')) {
                    var admissionCondition = admission.admissionCondition;
                    arr.push('<mmlSm:admissionCondition');
                    if (admissionCondition.hasOwnProperty('attr') && admissionCondition.attr.hasOwnProperty('emergency')) {
                        arr.push(' mmlSm:emergency=');
                        arr.push(utils.addQuote(admissionCondition.attr.emergency));
                    }
                    arr.push('>');
                    arr.push(admissionCondition.value);
                    arr.push('</mmlSm:admissionCondition>');
                }

                // referFrom
                if (admission.hasOwnProperty('referFrom')) {
                    arr.push('<mmlSm:referFrom>');
                    commonBuilder.buildPersonalizedInfo(admission.referFrom, arr);
                    arr.push('</mmlSm:referFrom>');
                }
                // admission
                arr.push('</mmlSm:admission>');

                //-----------------------------------------------------------
                // discharge
                //-----------------------------------------------------------
                var discharge = entry.discharge;
                arr.push('<mmlSm:discharge>');

                arr.push('<mmlSm:date>');
                arr.push(discharge.date);
                arr.push('</mmlSm:date>');

                // dischargeCondition
                if (discharge.hasOwnProperty('dischargeCondition')) {
                    var dischargeCondition = discharge.dischargeCondition;
                    arr.push('<mmlSm:dischargeCondition');
                    if (dischargeCondition.hasOwnProperty('attr') && dischargeCondition.attr.hasOwnProperty('outcome')) {
                        arr.push(' mmlSm:outcome=');
                        arr.push(utils.addQuote(dischargeCondition.attr.outcome));
                    }
                    arr.push('>');
                    arr.push(dischargeCondition.value);
                    arr.push('</mmlSm:dischargeCondition>');
                }

                // referTo
                if (discharge.hasOwnProperty('referTo')) {
                    var referTo = discharge.referTo;
                    arr.push('<mmlSm:referTo>');
                    commonBuilder.buildPersonalizedInfo(referTo, arr);
                    arr.push('</mmlSm:referTo>');
                }
                arr.push('</mmlSm:discharge>');

                //-----------------------------------------------------------
                // staffs
                //-----------------------------------------------------------
                if (entry.hasOwnProperty('staffs')) {
                    arr.push('<mmlSm:staffs>');
                    entry.staffs.forEach((staffInfo) => {
                        arr.push('<mmlSm:staffInfo>');
                        commonBuilder.buildPersonalizedInfo(staffInfo.PersonalizedInfo, arr);
                        staffInfo.creatorLicense.forEach((cl) => {
                            commonBuilder.buildCreatorLicense(cl, arr);
                        });
                        arr.push('</mmlSm:staffInfo>');
                    });
                    arr.push('</mmlSm:staffs>');
                }

                // inPatientItem end
                arr.push('</mmlSm:inPatientItem>');
            });
            arr.push('</mmlSm:inPatient>');
        }

        arr.push('</mmlSm:serviceHistory>');
    },

    // RegisteredDiagnosisModule
    buildRegisteredDiagnosisModule: function (target, arr) {
        target.forEach((entry) => {
            diagnosisBuilder.build(entry, arr);
        });
    },

    // deathInfo
    buildDeathInfo: function (target, arr) {
        arr.push('<mmlSm:deathInfo');
        if (target.hasOwnProperty('attr') && target.attr.hasOwnProperty('date')) {
            arr.push(' mmlSm:date=');
            arr.push(utils.addQuote(target.attr.date));
        }
        if (target.hasOwnProperty('attr') && target.attr.hasOwnProperty('autopsy')) {
            arr.push(' mmlSm:autopsy=');
            arr.push(utils.addQuote(target.attr.autopsy));
        }
        arr.push('>');
        arr.push(target.value);
        arr.push('</mmlSm:deathInfo>');
    },

    // SurgeryModule
    buildSurgeryModule: function (target, arr) {
        target.forEach((entry) => {
            surgeryBuilder.build(entry, arr);
        });
    },

    // chiefComplaints
    buildChiefComplaints: function (target, arr) {
        arr.push('<mmlSm:chiefComplaints>');
        arr.push(target);
        arr.push('</mmlSm:chiefComplaints>');
    },

    // patientProfile
    buildPatientProfile: function (target, arr) {
        arr.push('<mmlSm:patientProfile>');
        arr.push(target);
        arr.push('</mmlSm:patientProfile>');
    },

    // history
    buildHistory: function (target, arr) {
        arr.push('<mmlSm:history>');
        arr.push(target);
        arr.push('</mmlSm:history>');
    },

    // physicalExam
    buildPhysicalExam: function (target, arr) {
        arr.push('<mmlSm:physicalExam>');
        arr.push(target.value);
        if (target.hasOwnProperty('extRef')) {
            target.extRef.forEach((entry) => {
                commonBuilder.buildExtRef(entry, arr);
            });
        }
        arr.push('</mmlSm:physicalExam>');
    },

    // clinicalCourse
    buildClinicalCourse: function (target, arr) {
        arr.push('<mmlSm:clinicalCourse>');
        target.forEach((entry) => {
            arr.push('<mmlSm:clinicalRecord');

            if (entry.hasOwnProperty('attr') && entry.attr.hasOwnProperty('date')) {
                arr.push(' mmlSm:date=');
                arr.push(utils.addQuote(entry.attr.date));
            }
            arr.push('>');
            arr.push(entry.value);

            if (entry.hasOwnProperty('relatedDoc')) {
                entry.relatedDoc.forEach((e) => {
                    arr.push('<mmlSm:relatedDoc');
                    if (e.hasOwnProperty('attr') && e.attr.hasOwnProperty('relation')) {
                        arr.push(' mmlSm:relation=');
                        arr.push(utils.addQuote(e.attr.relation));
                    }
                    arr.push('>');
                    arr.push(e.value);
                    arr.push('</mmlSm:relatedDoc>');
                });
            }

            if (entry.hasOwnProperty('extRef')) {
                entry.extRef.forEach((e) => {
                    commonBuilder.buildExtRef(e, arr);
                });
            }
            arr.push('</mmlSm:clinicalRecord>');
        });
        arr.push('</mmlSm:clinicalCourse>');
    },

    // dischargeFindings
    buildDischargeFindings: function (target, arr) {
        arr.push('<mmlSm:dischargeFindings>');
        arr.push(target.value);
        if (target.hasOwnProperty('extRef')) {
            target.extRef.forEach((entry) => {
                commonBuilder.buildExtRef(entry, arr);
            });
        }
        arr.push('</mmlSm:dischargeFindings>');
    },

    // medication
    buildMedication: function (target, arr) {
        arr.push('<mmlSm:medication>');
        arr.push(target.value);
        if (target.hasOwnProperty('PrescriptionModule')) {
            prescriptionBuilder.build(target.PrescriptionModule, arr);
        }
        if (target.hasOwnProperty('extRef')) {
            target.extRef.forEach((entry) => {
                commonBuilder.buildExtRef(entry, arr);
            });
        }
        arr.push('</mmlSm:medication>');
    },

    // testResults
    buildTestResults: function (target, arr) {
        arr.push('<mmlSm:testResults>');
        target.forEach((entry) => {
            arr.push('<mmlSm:testResult');
            if (entry.hasOwnProperty('attr') && entry.attr.hasOwnProperty('date')) {
                arr.push(' mmlSm:date=');
                arr.push(utils.addQuote(entry.attr.date));
            }
            arr.push('>');
            arr.push(entry.value);
            if (entry.hasOwnProperty('extRef')) {
                entry.extRef.forEach((e) => {
                    commonBuilder.buildExtRef(e, arr);
                });
            }
            if (entry.hasOwnProperty('relatedDoc')) {
                entry.extRef.forEach((e) => {
                    arr.push('<mmlSm:relatedDoc');
                    if (e.hasOwnProperty('attr') && e.attr.hasOwnProperty('relation')) {
                        arr.push(' mmlSm:relation=');
                        arr.push(utils.addQuote(e.attr.relation));
                    }
                    arr.push(e.value);
                    arr.push('</mmlSm:relatedDoc>');
                });
            }
            arr.push('</mmlSm:testResult>');
        });
        arr.push('</mmlSm:testResults>');
    },

    // plan
    buildPlan: function (target, arr) {
        arr.push('<mmlSm:plan>');
        arr.push(target.value);
        if (target.hasOwnProperty('extRef')) {
            target.extRef.forEach((entry) => {
                commonBuilder.buildExtRef(entry, arr);
            });
        }
        arr.push('</mmlSm:plan>');
    },

    // remarks
    buildRemarks: function (target, arr) {
        arr.push('<mmlSm:remarks>');
        arr.push(target.value);
        arr.push('</mmlSm:remarks>');
    },

    build: function (target, arr) {

        arr.push('<mmlSm:SummaryModule>');

        // serviceHistory
        this.buildServiceHistory(target.serviceHistory, arr);

        // RegisteredDiagnosisModule
        if (target.hasOwnProperty('RegisteredDiagnosisModule')) {
            this.buildRegisteredDiagnosisModule(target.RegisteredDiagnosisModule, arr);
        }

        // deathInfo
        if (target.hasOwnProperty('deathInfo')) {
            this.buildDeathInfo(target.deathInfo, arr);
        }

        // SurgeryModule
        if (target.hasOwnProperty('SurgeryModule')) {
            this.buildSurgeryModule(target.SurgeryModule, arr);
        }

        // chiefComplaints
        if (target.hasOwnProperty('chiefComplaints')) {
            this.buildChiefComplaints(target.chiefComplaints, arr);
        }

        // patientProfile
        if (target.hasOwnProperty('patientProfile')) {
            this.buildPatientProfile(target.patientProfile, arr);
        }

        // history
        if (target.hasOwnProperty('history')) {
            this.buildHistory(target.history, arr);
        }

        // physicalExam
        if (target.hasOwnProperty('physicalExam')) {
            this.buildPhysicalExam(target.physicalExam, arr);
        }

        // clinicalCourse
        if (target.hasOwnProperty('clinicalCourse')) {
            this.buildClinicalCourse(target.clinicalCourse, arr);
        }

        // dischargeFindings
        if (target.hasOwnProperty('dischargeFindings')) {
            this.buildDischargeFindings(target.dischargeFindings, arr);
        }

        // medication
        if (target.hasOwnProperty('medication')) {
            this.buildMedication(target.medication, arr);
        }

        // testResults
        if (target.hasOwnProperty('testResults')) {
            this.buildTestResults(target.testResults, arr);
        }

        // plan
        if (target.hasOwnProperty('plan')) {
            this.buildPlan(target.plan, arr);
        }

        // remarks
        if (target.hasOwnProperty('remarks')) {
            this.buildRemarks(target.remarks, arr);
        }

        arr.push('</mmlSm:SummaryModule>');
    }
};
