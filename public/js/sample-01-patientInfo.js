// 患者情報
var postPatientInfo = function (callback) {

    // simplePatientInfo
    var simplePatientInfo = {
        id: '0516',                                        // 施設(病院)内で発番されている患者Id
        facilityId: '1.2.840.114319.5.1000.1.26.1',        // 医療連携等のために施設に振られているId
        kanjiName: '宮田 奈々',                             // 漢字の氏名
        kanaName: 'ミヤタ ナナ',                             // カナ
        gender: 'female',                                  // MML0010(女:female 男:male その他:other 不明:unknown)
        dateOfBirth: '1994-11-26',                         // 生年月日
        maritalStatus: 'single',                           // 婚姻状況 MML0011を使用 オプション
        nationality: 'JPN',                                // 国籍 オプション
        postalCode: '000-0000',                            // 郵便番号
        address: '横浜市中区日本大通り 1-23-4-567',            // 住所
        telephone: '054-078-7934',                         // 電話番号
        mobile: '090-2710-1564',                           // モバイル
        email: 'miyata_nana@example.com'                   // 電子メール オプション
    };

    // コンポジションを生成する
    var simpleComposition = {                   // POSTする simpleComposition
        context: {                              // context: 注射された時の文脈
            uuid: generateUUID(),               // UUID
            confirmDate: confirmDate(),         // 確定日時 YYYY-MM-DDTHH:mm:ss
            patient: simplePatient,             // 対象患者
            creator: simpleCreator,             // 担当医師
            accessRight: simpleRight            // アクセス権
        },
        content: [simplePatientInfo]            // content: 臨床データ=simplePatientInfoとする
    };

    // POST
    post('patientInfo', simpleComposition, function (err, mml) {
        // コールバック
        callback(err, simpleComposition, mml);
    });
};
