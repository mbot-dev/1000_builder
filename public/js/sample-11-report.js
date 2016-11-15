// 報告書
var postReport = function (callback) {

    // simpleReport
    var simpleReport = {
        context: {},                                        // 報告書ヘッダー情報
        body: {}                                            // 報告書本文情報
    };

    // 依頼者 相談する側のスタッフ
    var consulter = asFacilityStaff(simpleCreator);

    // 検査を実施するスタッフ
    var performer = asFacilityStaff(simpleReporter);

    // 報告日時は現在とする
    var now = new Date();
    var reportTime = dateAsTimeStamp(now);
    // １日前を実施日とする
    now.setDate(now.getDate() - 1);
    var performTime = dateAsTimeStamp(now);

    // 報告書のコンテキスト
    simpleReport.context = {
        performTime: performTime,                           // 検査実施日時 required
        reportTime: reportTime,                             // 報告日時 required
        reportStatus: '最終報告',                            // 報告状態
        statusCode: 'final',                                // mid 検査中 final 最終報告 required
        testClass: 'CT スキャン',                            // 報告書種別
        testClassCode: 'ctscan',                            // MML0033 required
        organ: '腹部',                                       // 臓器 ?
        consulter: consulter,                               // 依頼者 ?
        performer: performer                                // 実施者情報
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
        title: 'plain',                                     // タイトル ?
        base64: fileAsBase64('0001.jpg')                    // ファイルコンテンツのBase64
    });
    // 参考画像2 オプション
    simpleReport.body.testNotes.extRef.push({
        href: '0002.jpg',                                   // ファイル名
        contentType: 'imge/jpeg',                           // MIME type ?
        medicalRole: 'ctScan',                              // 医学的役割 ? MML0033 から
        title: 'plain',                                     // タイトル ?
        base64: fileAsBase64('0001.jpg')                    // ファイルコンテンツのBase64
    });

    //------------------------------------------------------------
    // レポートの確定日時は報告日時に一致させる => reportTime
    // レポートのcreatorは報告書の記載者である => simpleReporter
    //------------------------------------------------------------
    var simpleComposition = {                   // POSTする simpleComposition
        context: {                              // context 文脈
            uuid: generateUUID(),               // UUID
            confirmDate: reportTime,            // 確定日時 = 報告日時 YYYY-MM-DDTHH:mm:ss
            patient: simpleOverseasPatient,     // 対象患者
            creator: simpleReporter,            // 報告書の記載者
            accessRight: simpleRight            // アクセス権
        },
        content: [simpleReport]                 // content: 臨床データ=simpleReport
    };

    //------------------------------------------------------------------
    // 報告書のタイトルと生成目的を設定する
    //------------------------------------------------------------------
    // 運用として報告書のタイトルに記載されているものが利用できる
    simpleComposition.context.title = simpleReport.context.testClass;
    // MML007 reportRadiology reportPathology reportTest 等から選ぶ
    simpleComposition.context.generationPurpose = 'reportRadiology';
    //------------------------------------------------------------------

    //------------------------------------------------------------------
    // 共通設定 患者とcreatorに自施設の情報を設定する
    //------------------------------------------------------------------
    simpleComposition.context.patient.facilityId = simpleFacility.id;
    simpleComposition.context.creator.facility = simpleFacility;
    //------------------------------------------------------------------

    // POST
    post('report', simpleComposition, function (err, mml) {
        // コールバック
        callback(err, simpleComposition, mml);
    });
};
