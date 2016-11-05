// 報告書
var postReport = function (callback) {

    // simpleReport
    var simpleReport = {
        context: {},                                        // 報告書ヘッダー情報
        body: {}                                            // 報告書本文情報
    };

    simpleReport.context = {
        performTime: '2008-08-23T00:00:00',                 // 検査実施日時 required
        reportTime: '2008-08-23T00:00:00',                  // 報告日時 required
        reportStatus: '最終報告',                            // 報告状態
        statusCode: 'final',                                // mid 検査中 final 最終報告 required
        testClass: 'CT スキャン',                            // 報告書種別
        testClassCode: 'ctscan',                            // MML0033 required
        organ: '腹部',                                       // 臓器 ?
        consultFrom: {
            facility: '山下病院',                             // 依頼者情報 ?
            facilityCode: '1.2.840.114319.5.1000.1.26.1',
            client: '高松 愛海',                              // 依頼者 ?
            clientCode: '12',
            clientCodeId: 'facility'
        },
        perform: {                                            // 実施者情報
            facility: '山下病院',                               // 実施施設
            facilityCode: '1.2.840.114319.5.1000.1.26.1',      // required
            performer: '緒方 誠也',                             // 実施者
            performerCode: '51',
            performerCodeId: 'facility'                       // required
        }
    };

    // 報告書本文情報
    simpleReport.body = {
        chiefComplaints: '',                                // 主訴 ?
        testPurpose: '',                                    // 検査目的 ?
        testDx: '',                                         // 検査診断 ?
        testNotes: {}                                       // 検査所見記載 ?
    };

    // 主訴
    simpleReport.body.chiefComplaints = '特になし HCC';

    // 検査目的
    simpleReport.body.testPurpose = '（CT精査）治療後の評価をお願いします。平成14年3月28日にs5,s8にSMANCS注入を施行。4月8日、19日、6月22日、7月2日 RFA 施行。viableな病変の存在を確認。7月17日 CTガイド下PEIT施行。8月1日、8月16日 TACE 施行。';

    // 検査診断
    simpleReport.body.testDx = 'HCC, post TACE';

    // 検査所見記載
    simpleReport.body.testNotes = {
        value: '',
        extRef: []
    };
    simpleReport.body.testNotes.value = '肝前区域にTACE後のlipiodol集積を認めます。治療後のvaibilityの有無については治療後の変化に伴うabnormal enhance やlipiodol集積もあり評価困難ですが、一部結節状のソマリもあり残存ありそうです。follow評価下さい。明らかなnew lesionは指摘できません。腹水はありません。';

    // 参考画像1 オプション
    simpleReport.body.testNotes.extRef.push({
        href: '0001.jpg',                                   // ファイル名
        contentType: 'imge/jpeg',                           // MIME type ?
        medicalRole: 'ctScan',                              // 医学的役割 ? MML0033 から
        title: 'plain'                                      // タイトル ?
        // base64: fileAsBase64('0001.jpg')                    // Base64 本稼働では添付すること
    });
    // 参考画像2 オプション
    simpleReport.body.testNotes.extRef.push({
        href: '0002.jpg',                                   // ファイル名
        contentType: 'imge/jpeg',                           // MIME type ?
        medicalRole: 'ctScan',                              // 医学的役割 ? MML0033 から
        title: 'plain'                                      // タイトル ?
        // base64: fileAsBase64('0001.jpg')                    // Base64　本稼働では添付すること
    });

    // コンポジションを生成
    var confirmDate = nowAsDateTime();          // このMMLの確定日時 YYYY-MM-DDTHH:mm:ss
    var uuid = window.uuid.v4();                // MML文書の UUID
    var simpleComposition = {                   // POSTする simpleComposition
        context: {                              // context: 処方された時の文脈
            uuid: uuid,                         // UUID
            confirmDate: confirmDate,           // 確定日時 YYYY-MM-DDTHH:mm:ss
            patient: simplePatient,             // 対象患者
            creator: simpleCreator,             // 担当医師
            accessRight: simpleRight            // アクセス権
        },
        content: [simpleReport]                 // content: 臨床データ=simpleReport
    };

    // POST
    post('report', simpleComposition, function (err, mml) {
        // コールバック
        callback(err, simpleReport, mml);
    });
};
