// 基礎的診療情報
var postBaseClinic = function (callback) {

    // simpleBaseClinic
    var simpleBaseClinic = {                                // 基礎的診療情報
        allergy: [],                                        // アレルギー情報 ? [allergyItem]
        bloodtype: {},
        // infection: []                                    // 感染性情報 ? [infectionItem]
    };

    // アレルギー項目
    var allergyItem = {
        factor: 'crab',                                         // アレルギー原因
        severity: 'mild',                                       // アレルギー反応程度 ? MML0017
        identifiedDate: 'since almost 20 years ago',            // アレルギー同定日 ?
        memo: 'no reaction to shrimp'                           // アレルギーメモ ?
    };
    simpleBaseClinic.allergy.push(allergyItem);

    // 血液型
    simpleBaseClinic.bloodtype = {
        abo: 'a',                                       // ABO 式血液型 MML0018
        rh: 'rhD+'                                      // Rho(D) 式血液型 ? MML0019
    };

    // コンポジションを生成する
    var confirmDate = nowAsDateTime();          // このMMLの確定日時 YYYY-MM-DDTHH:mm:ss
    var uuid = window.uuid.v4();               // MML文書の UUID
    var simpleComposition = {                   // POSTする simpleComposition
        context: {                              // context: 注射された時の文脈
            uuid: uuid,                         // UUID
            confirmDate: confirmDate,           // 確定日時 YYYY-MM-DDTHH:mm:ss
            patient: simplePatient,             // 対象患者
            creator: simpleCreator,             // 担当医師
            accessRight: simpleRight            // アクセス権
        },
        content: [simpleBaseClinic]             // content: 臨床データ=simpleBaseClinic
    };

    // POST
    post('baseClinic', simpleComposition, function (err, mml) {
        if (err) {
            callback(err, simpleBaseClinic, null);
        } else {
            callback(null, simpleBaseClinic, mml);
        }
    });
};
