// サマリ
var postSummary = function (callback) {                        // 臨床経過サマリー情報

    // simpleSummary
    var simpleSummary = {
        context: {                                              // 期間情報
            start: '',                                          // サマリー対象期間の開始日
            end: '',                                            // サマリー対象期間の終了日
            inPatient: []                                       // 入院暦情報 ? [inPatientItem]
        },
        chiefComplaints: '',                                    // 主訴 ?
        patientProfile: '',                                     // 患者プロフィール ?
        history: '',                                            // 入院までの経過 ?
        physicalExam: {},                                       // 入院時理学所見 ?
        clinicalCourse: [],                                     // 経過および治療 ? [clinicalRecord]
        dischargeFindings: {},                                  // 退院時所見 ?
        medication: {},                                         // 退院時処方 ?
        testResults: [],                                        // 退院時検査結果 ? [testResult]
        plan: {}                                                // 退院後治療方針 ?
    };

    // サマリー対象期間の開始日
    simpleSummary.context.start = '1999-08-25';

    // サマリー対象期間の終了日
    simpleSummary.context.end = '1999-08-31';

    // 入院暦項目
    var inPatientItem = {                                       // 個々の入院暦
        admission: {},                                          // 入院
        discharge: {}                                           // 退院
        // staffs: [],                                          // ? [staffInfo] このサンプルでは使用しない
    };
    // 入院情報
    inPatientItem.admission = {                                 // 入院
        date: '2015-8-27',                                      // 入院 (転入) 日 CCYY-MM-DD
        admissionCondition: 'Emergency admission by ambulancetrue', // 入院時状態 ?
        emergency: 'true',                                      // 緊急入院．true：緊急入院，false：通常
        // referFrom:                                           // 紹介元情報 ?
    };
    // 退院情報
    inPatientItem.discharge = {                                 // 退院
        date: '1999-08-31',                                     // 退院 (転出) 日 CCYY-MM-DD
        dischargeCondition: '4 P.O.D, the patient was transferred to the chronic hospital.', // 退院時状態 ?
        outcome: 'transferChronic',                             // 退院時転帰 MML0016
        // referTo:                                             // 紹介先情報 ?
    };
    // 入院暦項目をcontextの配列へ追加
    simpleSummary.context.inPatient.push(inPatientItem);

    // 主訴
    simpleSummary.chiefComplaints = 'Severe chest pain';

    // 患者プロフィール
    simpleSummary.patientProfile = 'The patient is a 40-year-old married forester.';

    // 入院までの経過
    simpleSummary.history = 'On a background of good health, the patient noted the onset of chest pain and dyspnea on Aug 25,1999. At 10 A.M., he was put into the ambulance on a stretcher and driven to our hospital. On arrival, the symptoms subsided and he went home without any medication. Two days ago (Aug 27), he felt intractable chest pain and was referred to the department of cardiovascular surgery under the diagnosis of unstable angina pectoris.';

    // 入院時理学所見
    simpleSummary.physicalExam = {
        value: 'Physical findings were essentially normal except for the blood pressure which was 160/100. Heart sounds were clear and rhythm was regular without audible murmurs or friction sounds.'
        // extRef: []       // 外部参照 必要なら追加
    };

    // 経過および治療項目
    var clinicalRecord = {
        date: '1999-08-27',                                               // イベント発生日時
        recode: 'Emergency coronary angiography was carried out. Three vessels (LAD, #9, #12) were involved.',
        extRef: [{                                                         // 外部参照 ?
            contentType: 'image/jpeg',
            medicalRole: 'angioGraphy',
            title: 'Preoperative coronary angiography',
            href: 'surgicalFigure003.jpg',
            base64: fileAsBase64('surgicalFigure003.jpg')                 // ファイルコンテンツのBase64
        }]
        // relatedDoc: []                                                 // 関連文書 ? このバージョンではサポートしていない
    };
    // 関連文書 Not supported
    // clinicalRecord.relatedDoc.push({
        // uuid: '11D1AC5400A0C94A814796045F768ED5',                      // 関連文書のUUID
        // relation: 'detail'                                             // 関連文書との関係
    // });
    simpleSummary.clinicalCourse.push(clinicalRecord);

    // 退院時所見
    simpleSummary.dischargeFindings = {
        value: 'Symptoms free, no wound infection.'                      // mixed=true extRef *
        // extRef: []                                                    // 外部参照 ? 必要なら追加
    };

    // 退院時処方
    var medicine = {
        medicine: 'プレドニゾロン錠 5mg',                  // 処方薬
        medicineCode: '61222033',                       // 処方薬のコード
        medicineCodeSystem: 'YJ',                       // コード体系
        dose: 4,                                        // 1回の量
        doseUnit: '錠',                                 // 単位
        frequencyPerDay: 1,                             // 1日の内服回数
        startDate: '2016-11-02',                        // 服薬開始日 YYYY-MM-DD
        duration: 'P14D',                               // 14日分 ToDo
        instruction: '内服 1回 朝食前'                    // 用法
    };
    simpleSummary.medication = {
        value: 'Prescription on discharge',             // mixed=true
        simplePrescription: {
            medication: [medicine]
        }
    };

    // 検査結果項目1
    var testResult1 = {                                         // 個々の検査結果
        date: '1999-08-31',
        testResult: 'Labo findings on discharge',
        extRef: [{                                              // 外部参照 ?
            contentType: 'APPLICATION/HL72.3-HL7ER2.3',
            medicalRole: 'laboratoryTest',
            title: 'Blood chemistry data on discharge',
            href: 'prescription004.HL7',
            base64: fileAsBase64('prescription004.HL7')         // ファイルコンテンツのBase64
        }]
    };
    // 検査結果項目2
    var testResult2 = {                                          // 個々の検査結果
        date: '1999-08-31',
        testResult: 'ECG on discharge. No ST change and new Q wave was observed.',
        extRef: [{                                              // 外部参照 ?
            contentType: 'image/jpeg',
            medicalRole: 'ecg',
            title: 'ECG on discharge',
            href: 'exam004.jpg',
            base64: fileAsBase64('exam004.jpg')                // ファイルコンテンツのBase64
        }]
    };
    // 配列へ追加
    simpleSummary.testResults.push(testResult1);
    simpleSummary.testResults.push(testResult2);

    // 退院後治療方針
    simpleSummary.plan = {
        value: 'Rehabilitation program and wound care will continue in the chronic hospital.'
        // extRef: []                                            // 外部参照 ? 必要なら追加
    };

    // コンポジション
    var simpleComposition = {                   // POSTする simpleComposition
        context: {                              // context: サマリ時文脈
            uuid: generateUUID(),               // UUID
            confirmDate: confirmDate(),         // 確定日時 YYYY-MM-DDTHH:mm:ss
            patient: simpleOverseasPatient,     // 対象患者
            creator: simpleCreator,             // 担当医師
            accessRight: simpleRight            // アクセス権
        },
        content: [simpleSummary]                // content: 臨床データ=simpleSummary
    };

    //------------------------------------------------------------------
    // 共通設定 患者とcreatorに自施設の情報を設定する
    //------------------------------------------------------------------
    simpleComposition.context.patient.facilityId = simpleFacility.id;
    simpleComposition.context.creator.facility = simpleFacility;
    //------------------------------------------------------------------

    // POST
    post('summary', simpleComposition, function (err, mml) {
        // コールバック
        callback(err, simpleComposition, mml);
    });
};
