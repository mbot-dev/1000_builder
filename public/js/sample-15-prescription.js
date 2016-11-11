// 処方せん
var postPrescription = function (callback) {

    // simplePrescription
    var simplePrescription = {
        medication: []                                  // 処方の配列
    };

    // 服薬開始日（デモなので現在時刻）
    var startDate = dateAsString(new Date());           // YYYY-MM-DD形式

    // 処方1
    var med1 = {
        issuedTo: 'external',                           // 院外処方の場合はexternal、院内処方の場合はinternalを指定する（オプション）
        medicine: 'マーズレン S 顆粒',                    // 処方薬名称
        medicineCode: '612320261',                      // 処方薬のコード
        medicineCodeSystem: 'YJ',                       // コード体系
        dose: 1,                                        // 数量
        doseUnit: 'g',                                  // 単位
        frequencyPerDay: 2,                             // 1日の内服回 数総量のみが記載される外用剤などの場合には省略可（オプション）
        startDate: startDate,                           // 服薬開始日 YYYY-MM-DD（オプション）
        duration: 'P30D',                               // 30日分 P数値D で記述する（オプション）
        instruction: '内服2回 朝夜食後に',                 // 用法（オプション）
        PRN: false,                                     // 頓用の時 true（オプション）
        brandSubstitutionPermitted: true,               // ジェネリック医薬品への代替可 可の時true、省略時は可とみなす（オプション）
        longTerm: false                                 // 長期処方の時true、短期であればfalse（オプション）
    };

    // 処方2
    var med2 = {
        issuedTo: 'external',                           // 院外処方の場合はexternal、院内処方の場合はinternalを指定する（オプション）
        medicine: 'メトリジン錠 2 mg',                    // 処方薬名称
        medicineCode: '612160027',                      // 処方薬のコード
        medicineCodeSystem: 'YJ',                       // コード体系
        dose: 2,                                        // 数量
        doseUnit: '錠',                                 // 単位
        frequencyPerDay: 2,                             // 1日の内服回数 数総量のみが記載される外用剤などの場合には省略可（オプション）
        startDate: startDate,                           // 服薬開始日 YYYY-MM-DD（オプション）
        duration: 'P30D',                               // 30日分 P数値D で記述する（オプション）
        instruction: '内服2回 朝夜食後に',                 // 用法（オプション）
        PRN: false,                                     // 頓用の時 true（オプション）
        brandSubstitutionPermitted: false,              // ジェネリック医薬品への代替可 可の時true、省略時は可とみなす（オプション）
        longTerm: true                                  // 長期処方の時true、短期であればfalse（オプション）
    };
    // 配列へ追加
    simplePrescription.medication.push(med1);
    simplePrescription.medication.push(med2);

    // コンポジションを生成
    var simpleComposition = {                   // POSTする simpleComposition
        context: {                              // context: 処方された時の文脈
            uuid: generateUUID(),               // UUID
            confirmDate: confirmDate(),         // 確定日時 YYYY-MM-DDTHH:mm:ss
            patient: simplePatient,             // 対象患者
            creator: simpleCreator,             // 担当医師
            accessRight: simpleRight            // アクセス権
        },
        content: [simplePrescription]           // content: 臨床データ=処方せん
    };

    // POST
    post('prescription', simpleComposition, function (err, mml) {
        // コールバック
        callback(err, simpleComposition, mml);
    });

    /***********************************************************
    リモートプロシジャーコール(JSON-RPC2.0)を使用する場合

    contextに contentType = 'prescription' の属性を設定する
    simpleComposition.context.contentType = 'prescription';

    rpc(simpleComposition, function (err, mml) {
        callback(err, simpleComposition, mml);
    });
    ***********************************************************/

};
