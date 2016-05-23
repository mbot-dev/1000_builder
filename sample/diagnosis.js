"use strict";

const uuid = require('node-uuid');
const pd = require('pretty-data2').pd;
const utils = require('../lib/utils');
const simpleBuilder = require('../api/simpleBuilder');
const mmlBuilder = require('../lib/mmlBuilder');

// 対象患者
var simplePatient = {
    id: '0516',                                        // 施設(病院)内で発番されている患者Id
    idType: 'facility',                                // 施設固有のIdであることを示す
    facilityId: 'JPN012345678901',                     // 医療連携等のために施設に振られているId
    kanjiName: '宮田 奈々',                             // 漢字の氏名
    kanaName: 'ミヤタ ナナ',                             // カナ
    romanName: 'Nana Miyata',                          // ローマ字
    sex: 'femail',                                     // MML0010(女:femail 男:male その他:other 不明:unknown)
    birthday: '1994-11-26',                            // 生年月日
    maritalStatus: 'single',                           // 婚姻状況 MML0011を使用 オプション
    nationality: 'JPN',                                // 国籍 オプション
    zipCode: '000-0000',                               // 郵便番号
    address: '横浜市中区日本大通り 1-23-4-567',            // 住所
    telephone: '054-078-7934',                         // 電話番号
    mobile: '090-2710-1564',                           // モバイル
    email: 'miyata_nana@example.com'                   // 電子メール オプション
};

// 医師
var simpleCreator = {
    id: '201605',                                      // 施設で付番されている医師のId
    idType: 'facility',                                // 施設固有のIdであることを示す
    kanjiName: '青山 慶二',                             // 医師名
    prefix: 'Professor',                               // 肩書き等 オプション
    degree: 'MD/PhD',                                  // 学位 オプション
    facilityId: 'JPN012345678901',                     // 医療連携等のために施設に振られているId
    facilityIdType: 'JMARI',                           // 上記施設IDを発番している体系 MML0027(ca|insurance|monbusho|JMARI|OID)から選ぶ
    facilityName: 'シルク内科',                          // 施設名
    facilityZipCode: '231-0023',                       // 施設郵便番号
    facilityAddress: '横浜市中区山下町1番地 8-9-01',      // 施設住所
    facilityPhone: '045-571-6572',                     // 施設電話番号
    departmentId: '01',                                // 医科用:MML0028 歯科用:MML0030 から選ぶ
    departmentIdType: 'medical',                       // 医科用の診療科コード:medical 歯科用の診療科コード:dental を指定 MML0029(medical|dental|facility)から選ぶ
    departmentName: '第一内科',                         // 診療科名
    license: 'doctor'                                  // 医療資格 MML0026から選ぶ
};

// 病名
// 開始日等
var now = new Date();
var confirmDate = utils.toDateTimeString(now);
var endDate = utils.toDateString(now);
now.setDate(now.getDate() - 245);
var startDate = utils.toDateString(now);

var simpleDiagnosis = {
    diagnosis: 'colon carcinoid',
    code: 'C189-.006',
    system: 'ICD10',
    category: 'mainDiagnosis',
    startDate: startDate,
    endDate: endDate,
    outcome: 'fullyRecovered'
};

var simpleModule = {
    docInfo: {
        contentModuleType: 'registeredDiagnosis',
        uuid: uuid.v4(),
        confirmDate: confirmDate
    },
    data: [simpleDiagnosis]
};

// MML
var simpleMML = {
    patient: simplePatient,
    creator: simpleCreator,
    content: [simpleModule]
};
var mmlObj = simpleBuilder.buildMML(simpleMML);
var xml = mmlBuilder.build(mmlObj);
console.log('\n');
console.log(pd.xml(xml));
