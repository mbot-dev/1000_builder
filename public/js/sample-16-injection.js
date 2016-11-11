// 注射記録
var postInjection = function (callback) {

    // simpleInjection
    var simpleInjection = {
        medication: []                                  // 注射の配列
    };

    // 投与開始日時（デモなので現在時刻）
    var start = new Date();                             // 投与開始日時
    var end = new Date();
    end.setHours(start.getHours() + 2);                 // 2H後 投与終了日時

    // 注射薬1
    var med1 = {
        medicine: 'ラクテック 500ml',                     // 薬剤名称
        medicineCode: '12304155',                       // 薬剤コード
        medicineCodeystem: 'YJ',                        // コード体系
        dose: '500',                                    // 用量
        doseUnit: 'ml',                                 // 単位
        startDateTime: dateAsTimeStamp(start),          // 投与開始日時 YYYY-MM-DDTHH:mm:ss（オプション）
        endDateTime: dateAsTimeStamp(end),              // 投与終了日時 YYYY-MM-DDTHH:mm:ss（オプション）
        instruction: '2時間で投与する',                    // 用法指示（オプション）
        route: '右前腕静脈ルート',                         // 投与経路 投与する注射ルートを記載する。例：右前腕留置ルート，右鎖骨下中心静脈ルート（オプション）
        site: '右前腕',                                  // 投与部位 注射した部位を記載する。例：右上腕三角，腹部（オプション）
        deliveryMethod: '点滴静注',                       // 注射方法 例：筋注，皮下注，静注，点滴静注，中心静脈注射（オプション）
        batchNo: '1'                                    // 処方番号 これにより用法が共通する薬剤をまとめて一つの処方単位とすることができる。（オプション）
    };

    // 注射薬2
    var med2 = {
        medicine: 'ビタメジン静注用',                      // 薬剤名称
        medicineCode: '553300555',                      // 薬剤コード
        medicineCodeystem: 'YJ',                        // コード体系
        dose: '1',                                      // 用量
        doseUnit: 'V',                                  // 単位
        batchNo: '1'                                    // 処方番号（オプション）
    };

    // 注射薬3
    // 投与開始、終了日時
    start = new Date();                                 // 投与開始日時
    end = new Date();
    end.setHours(start.getHours() + 1);                 // 1H後 投与終了日時
    var med3 = {
        medicine: 'セファメジンα 2g キット',               // 薬剤名称
        medicineCode: '14433344',                       // 薬剤コード
        medicineCodeystem: 'YJ',                        // コード体系
        dose: '1',                                      // 用量
        doseUnit: 'V',                                  // 単位
        startDateTime: dateAsTimeStamp(start),          // 投与開始日時 YYYY-MM-DDTHH:mm:ss（オプション）
        endDateTime: dateAsTimeStamp(end),              // 投与終了日時 YYYY-MM-DDTHH:mm:ss（オプション）
        instruction: '1時間で投与する',                    // 用法指示（オプション）
        route: '右前腕静脈ルート',                         // 投与経路 投与する注射ルートを記載する。例：右前腕留置ルート，右鎖骨下中心静脈ルート（オプション）
        site: '右前腕',                                  // 投与部位 注射した部位を記載する。例：右上腕三角，腹部（オプション）
        deliveryMethod: '点滴静注',                       // 注射方法 例：筋注，皮下注，静注，点滴静注，中心静脈注射（オプション）
        batchNo: '1'                                    // 処方番号 これにより用法が共通する薬剤をまとめて一つの処方単位とすることができる。（オプション）
    };
    // 配列へ追加
    simpleInjection.medication.push(med1);
    simpleInjection.medication.push(med2);
    simpleInjection.medication.push(med3);

    // コンポジションを生成する
    var simpleComposition = {                   // POSTする simpleComposition
        context: {                              // context: 注射された時の文脈
            uuid: generateUUID(),               // UUID
            confirmDate: confirmDate(),         // 確定日時 YYYY-MM-DDTHH:mm:ss
            patient: simplePatient,             // 対象患者
            creator: simpleCreator,             // 担当医師
            accessRight: simpleRight            // アクセス権
        },
        content: [simpleInjection]              // content: 臨床データ=注射記録
    };

    // POST
    post('injection', simpleComposition, function (err, mml) {
        // コールバック
        callback(err, simpleComposition, mml);
    });
};
