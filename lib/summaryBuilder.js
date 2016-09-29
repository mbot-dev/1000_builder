'use strict';

const utils = require('../lib/utils');


var SummaryModule = {                                       // 臨床経過サマリー情報
    serviceHistory: {},                                     // 期間情報
    RegisteredDiagnosisModule: [],                          // サマリーにおける診断履歴情報 ? 解説は* []
    deathInfo: {},                                          // 死亡関連情報 ?
    SurgeryModule: [],                                      // サマリーにおける手術記録情報 ?
    chiefComplaints: '',                                    // 主訴 ?
    patientProfile: '',                                     // 患者プロフィール ?
    history: '',                                            // 入院までの経過 ?
    physicalExam: {},                                       // 入院時理学所見 ?
    clinicalCourse: [],                                     // 経過および治療 ? mmlSm:clinicalRecord
    dischargeFindings: {},                                  // 退院時所見 ? dischargeFindings
    medication: {},                                         // 退院時処方 ? medication
    testResults: [],                                        // 退院時検査結果 ? mmlSm:testResult
    plan: {},                                               // 退院後治療方針 ? plan
    remarks: ''                                             // 患者に関する留意事項 ?
};

var serviceHistory = {
    attr: {
        start: '',                                          // サマリー対象期間の開始日
        end: ''                                             // サマリー対象期間の終了日
    },
    outPatient: [],                                         // 外来受診歴情報 ? outPatientItem
    inPatient: []                                           // 入院暦情報 ?
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
    staffs: []                                              // 患者担当スタッフ情報 ?
};

var staffInfo = {                                           // 外来担当スタッフ
    PersonalizedInfo: {},                                   // mmlPsi:PersonalizedInfo
    creatorLicense: []                                      // mmlCi:creatorLicense
};

var inPatientItem = {                                       // 個々の入院暦
    admission: {},                                          // 入院
    discharge: {},                                          // 退院
    staffs: [],
};

var admission = {                                           // 入院
    date: '',                                               // 入院 (転入) 日 CCYY-MM-DD
    admissionCondition: {                                   // 入院時状態 ?
        value: '',
        attr: {
            emergency: ''                                   // 緊急入院．true：緊急入院，false：通常
        }
    },
    referFrom: {}                                           // 紹介元情報 ? mmlPsi:PersonalizedInfo
};

var discharge = {                                           // 退院
    date: '',                                               // 退院 (転出) 日 CCYY-MM-DD
    dischargeCondition: {                                   // 退院時状態
        value: '',
        attr: {
            outcome: ''                                     // 退院時転帰 MML0016
        }
    },
    referTo: {}                                             // 紹介先情報 mmlPsi:PersonalizedInfo
};

var deathInfo = {                                           // 死亡関連情報
    value: '',
    attr: {
        date: '',                                           // 死亡日時
        autopsy: ''                                         // 剖検の有無．true：剖検あり，false：なし
    }
};

// contains both text and other elements
var physicalExam = {
    value: '',
    extRef: []
};

var clinicalRecord = {
    attr: {
        date: ''                                            // イベント発生日時
    },
    value: '',
    relatedDoc: [],
    extRef: []
};

var dischargeFindings = {
    value: '',
    extRef: []
};

var medication = {
    value: '',
    PrescriptionModule: {},
    extRef: []
};

var testResult = {                                          // 個々の検査結果
    attr: {
        date: ''
    },
    value: '',
    extRef: [],
    relatedDoc: []
};

var relatedDoc = {
    value: '',                                              // MmlModuleItemのuid
    attr: {
        relation: ''                                        // MML0008
    }
};

var plan = {
    value: '',
    extRef: []
};
