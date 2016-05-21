"use strict";

const rpc = require('json-rpc2');
const uuid = require('node-uuid');
const pd = require('pretty-data2').pd;
const readline = require('readline');
const fs = require('fs');
const utils = require('../lib/utils');
const simpleBuilder = require('../api/simpleBuilder');
const mmlBuilder = require('../lib/mmlBuilder');

var client = rpc.Client.$create(8080, 'localhost');

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
    facilityPhone: '070-454-9207',                     // 施設電話番号
    departmentId: '01',                                // 医科用:MML0028 歯科用:MML0030 から選ぶ
    departmentIdType: 'medical',                       // 医科用の診療科コード:medical 歯科用の診療科コード:dental を指定 MML0029(medical|dental|facility)から選ぶ
    departmentName: '第一内科',                         // 診療科名
    license: 'doctor'                                  // 医療資格 MML0026から選ぶ
};

// 処方
var simplePrescription = {
    medication: [
        {
            issuedTo: 'external',
            medicine: 'プレドニゾロン錠 5mg',                  // 処方薬
            medicineCode: '61222033',                       // 処方薬
            medicineCodeSystem: 'YJ',                       // コード体系
            dose: 4,                                        // 1回の量
            doseUnit: '錠',                                  // 単位
            frequencyPerDay: 1,                             // 1日の内服回数
            startDate: utils.nowAsDate(),                   // 服薬開始日 YYYY-MM-DD
            duration: 14,                                   // 7日分
            instruction: '内服 1回 朝食前',                   // 用法
            //PRN: false,                                   // 頓用=false
            brandSubstitutionPermitted: true,               // ジェネリック可
            //longTerm: false                                // 臨時処方
        },
        {
            issuedTo: 'external',
            medicine: 'メトリジン錠 2 mg',
            medicineCode: '612160027',
            medicineCodeSystem: 'YJ',
            dose: 1,                                        // 1回の量
            doseUnit: '錠',                                 // 単位
            frequencyPerDay: 2,                             // 1日の内服回数
            startDate: utils.nowAsDate(),                   // 服薬開始日
            duration: 14,                                   // 14日分
            instruction: '内服2回 朝夜食後',                  // 用法
            //PRN: false,                                   // 頓用=false
            brandSubstitutionPermitted: true,               // ジェネリック
            //longTerm: true                                // 長期処方
        },
        {
            issuedTo: 'external',
            medicine: 'マーズレンＳ顆粒',
            medicineCode: '612160027',
            medicineCodeSystem: 'YJ',
            dose: 0.5,                                      // 1回の量
            doseUnit: 'g',                                  // 単位
            frequencyPerDay: 2,                             // 1日の内服回数
            startDate: utils.nowAsDate(),                   // 服薬開始日
            duration: 14,                                   // 14日分
            instruction: '内服2回 朝夜食後',                   // 用法
            //PRN: false,                                   // 頓用=false
            brandSubstitutionPermitted: true,               // ジェネリック
            //longTerm: true                                // 長期処方
        },
        {
            issuedTo: 'external',
            medicine: 'ジクロフェナクnaゲル',
            medicineCode: '612320261',
            medicineCodeSystem: 'YJ',
            dose: 50,                                        // 総量
            doseUnit: 'g',                                   // 単位
            //frequencyPerDay: 2,                            // 1日の内服回数
            startDate: utils.nowAsDate(),                    // 服薬開始日
            //duration: 14,                                  // 14日分
            instruction: '一日３回左膝に塗布',                  // 用法
            //PRN: false,                                    // 頓用=false
            brandSubstitutionPermitted: true,                // ジェネリック
            //longTerm: true                                 // 長期処方
        }
    ]
};

// simpleMosule
var simplePrescriptionModule = {
    docInfo: {
        contentModuleType: 'prescription',
        uuid: uuid.v4(),                                // UUIDを発行
        confirmDate: utils.nowAsDateTime()              // 確定日時 YYYY-MM-DDTHH:mm:ss
    },
    data: [simplePrescription]
};

// 病名
// 開始日等
var now = new Date();
var confirmDate = utils.toDateTimeString(now);
var endDate = utils.toDateString(now);
now.setDate(now.getDate() - 245);
var startDate = utils.toDateString(now);

var simpleDiagnosisModule = {
    docInfo: {
        contentModuleType: 'registeredDiagnosis',
        uuid: uuid.v4(),
        confirmDate: confirmDate
    },
    data: [
        {
            diagnosis: 'colon carcinoid',
            code: 'C189-.006',
            system: 'ICD10',
            category: 'mainDiagnosis',
            startDate: startDate,
            endDate: endDate,
            outcome: 'fullyRecovered'
        },
        {
            diagnosis: '高尿酸血症',
            code: 'E790-.003',
            system: 'ICD10',
            category: 'mainDiagnosis',
            startDate: startDate
        }
    ]
};

function simpleLabTest(callBack) {

    // 検査Id 運用で決める
    var registId = uuid.v4();

    // 必要な日時 dateTime 型
    var registTime = utils.toDateTimeString(new Date());  // 受付日時
    var reportTime = utils.toDateTimeString(new Date());  // 報告日時
    var confirmDate = reportTime;

    var simpleTest = {
        registId: registId,                             // 検査Id 　運用で決める
        registTime: registTime,                         // 受付日時
        reportTime: reportTime,                         // 報告日時
        reportStatusCode: 'final',                      // 報告状態 コード  mmlLb0001
        reportStatusName: '最終報告',                    // 報告状態
        codeSystem: 'YBS_2016',                         // 検査コード体系名
        facilityName: simpleCreator.facilityName,       // 検査依頼施設
        facilityId: simpleCreator.facilityId,           // 検査依頼施設
        facilityIdType: 'JMARI',                        // 検査依頼施設
        labCenter: {
            id: '303030',                                // 検査実施会社内での Id
            idType: 'facility',                          // 施設で付番されているIdであることを示す
            kanjiName: '石山 由美子',                      // 検査実施施設の代表 なんちゃって個人情報から 代表とは?
            facilityId: '1.2.3.4.5.6.7890.1.2',          // OID
            facilityIdType: 'OID',                       // MML0027 OID 方式
            facilityName: 'ベイスターズ・ラボ',             // 検査実施会社の名称
            facilityZipCode: '231-0000',                 // 検査実施会社の郵便番号
            facilityAddress: '横浜市中区スタジアム付近 1-5', // 検査実施会社の住所
            facilityPhone: '049-611-2719',               // 検査実施会社の電話
            license: 'lab'                               // MML0026 他に?
        },
        testItem: []
    };
    const rl = readline.createInterface({
        input: fs.createReadStream('./test_result.csv')
    });
    rl.on('line', (line) => {
        //console.log('Line from file:', line);
        var arr = line.split(/\s*,\s*/);
        var simpleItem = {};

        simpleItem.spcName = arr[0];              // 検体名
        simpleItem.spcCode = arr[1];              // 検体コード
        simpleItem.testName = arr[2];             // テスト項目名
        simpleItem.testCode = arr[3];             // コード
        simpleItem.testResult = arr[4];           // 結果値

        if (arr[5] !== '') {
            simpleItem.unit = arr[5];              // 単位
        }
        if (arr[6] !== '' ) {
            simpleItem.low = arr[6];               // 下限値
        }
        if (arr[7] !== '' ) {
            simpleItem.up = arr[7];                // 上限値
        }
        if (arr[8] !== '' ) {
            simpleItem.out = arr[8];               // 判定フラグ
        }
        if (arr[9] !== '' && arr[10] !== '') {
            simpleItem.memoCode = arr[9];          // メモコード
            simpleItem.memo = arr[10];             // メモ
        }
        simpleTest.testItem.push(simpleItem);

    }).on('close', () => {
        // simpleDocInfo
        var simpleDocInfo = {
            contentModuleType: 'test',
            uuid: uuid.v4(),
            confirmDate: confirmDate                       // 報告日時に一致させる
        };
        callBack({docInfo: simpleDocInfo, data: [simpleTest]});
    });
};

simpleLabTest((simpleTestModule) => {
    // simpleMMl
    var simpleMML = {
        patient: simplePatient,
        creator: simpleCreator,
        content: [simplePrescriptionModule, simpleDiagnosisModule, simpleTestModule]
    };

    var xml = mmlBuilder.build(simpleBuilder.buildMML(simpleMML));
    console.log('\n');
    console.log(pd.xml(xml));
});
