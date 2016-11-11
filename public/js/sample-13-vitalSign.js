// Vital Sign
var postVitalSign = function (callback) {

    // バイタルサインを計測した日時
    // デモ 今から10H 前
    var now = new Date();
    now.setHours(now.getHours() - 10);
    var observedTime = dateAsTimeStamp(now);

    var simpleVitalSign = {
        context: {                                              // バイタルサインが計測された時のコンテキスト（オプション）
            observer: '花田 綾子'                                // バイタルサインを計測した人（オプション）
        },
        item: [],                                               // 計測項目の配列
        observedTime: observedTime,                             // バイタルサインを観察した時間 YYYY-MM-DDTHH:mm:ss 形式
        protocol: {                                             // バイタルサインの測定方法を記載する親エレメント（オプション）
            position: 'sitting',                                // バイタルサインを測定した時の体位 mmlVs03を使用（オプション）
            device: 'Apple Watch',                              // バイタルサインの測定に使用した機材、デバイス。聴診器、水銀柱血圧計、機械式血圧計、動脈内プローベなど。（オプション）
            bodyLocation: '右腕'                                 // バイタルサインを測定した身体の部位。右上腕、左下腿など（オプション）
        }
    };

    // 収縮期血圧
    simpleVitalSign.item.push({
        itemName: 'Systolic blood pressure',                    // バイタルサイン項目 mmlVs01を使用
        numValue: 135,                                          // 値
        unit: 'mmHg'                                            // 単位 mmlVs02を使用
    });

    // 拡張期血圧
    simpleVitalSign.item.push({
        itemName: 'Diastolic blood pressure',                   // バイタルサイン項目 mmlVs01を使用
        numValue: 80,                                           // 値
        unit: 'mmHg'                                            // 単位 mmlVs02を使用
    });

    // コンポジションを生成する
    var simpleComposition = {                   // POSTする simpleComposition
        context: {                              // context: バイタルサイン確定時の文脈
            uuid: generateUUID(),               // UUID
            confirmDate: confirmDate(),         // 確定日時 YYYY-MM-DDTHH:mm:ss
            patient: simplePatient,             // 対象患者
            creator: simpleCreator,             // 責任医師
            accessRight: simpleRight            // アクセス権
        },
        content: [simpleVitalSign]              // content: 臨床データ=バイタルサイン
    };

    // POST
    post('vitalsign', simpleComposition, function (err, mml) {
        // コールバック
        callback(err, simpleComposition, mml);
    });
};
