// 病名サンプル
// 1病名毎に1モジュール
var postRegisteredDiagnosis = function (callback) {

    // デモ用の日時
    var now = new Date();
    var dateOfRemission = toDateString(now);                // 疾患終了日
    now.setDate(now.getDate() - 30);                        // 30日前を
    var dateOfOnset = toDateString(now);                    // 疾患開始日

    // simpleRegisteredDignosis
    var simpleRegisteredDignosis = {
        diagnosis: 'colon carcinoid',                       // 疾患名
        code: 'C189-.006',                                  // 疾患コード
        system: 'ICD10',                                    // 疾患コード体系名
        category: 'mainDiagnosis',                          // 診断の分類　MML0012からMML0015を使用（オプション）
        dateOfOnset: dateOfOnset,                           // 疾患開始日 YYYY-MM-DD 形式（オプション）
        dateOfRemission: dateOfRemission,                   // 疾患終了日 YYYY-MM-DD 形式（オプション）
        outcome: 'fullyRecovered'                           // 転帰 MML0016を使用（オプション）
    };

    // コンポジションを生成する
    var confirmDate = nowAsDateTime();          // 確定日時　YYYY-MM-DDTHH:mm:ss
    var uuid = window.uuid.v4();                // MML文書の UUID
    var simpleComposition = {                   // POSTする simpleComposition
        context: {                              // context: 病名確定時の文脈
            uuid: uuid,                         // UUID
            confirmDate: confirmDate,           // 確定日時 YYYY-MM-DDTHH:mm:ss
            patient: simplePatient,             // 対象患者
            creator: simpleCreator,             // 担当医師
            accessRight: simpleRight            // アクセス権
        },
        content: [simpleRegisteredDignosis]     // content: 臨床データ=病名
    };

    // POST
    post('registeredDiagnosis', simpleComposition, function (err, mml) {
        // コールバック
        callback(err, simpleRegisteredDignosis, mml);
    });
};
