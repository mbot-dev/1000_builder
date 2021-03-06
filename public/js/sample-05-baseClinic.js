// 基礎的診療情報
var postBaseClinic = function (callback) {

    // simpleBaseClinic
    var simpleBaseClinic = {                                // 基礎的診療情報
        allergy: [],                                        // アレルギー情報 ? [allergyItem]
        bloodtype: {}
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
        rh: 'rhD+',                                     // Rho(D) 式血液型 ? MML0019
        others: [{
            typeName: 'h',
            typeJudgement: 'o',
            description: 'g'
        }],
        memo: '血液型メモ'
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
        content: [simpleBaseClinic]             // content: 臨床データ=simpleBaseClinic
    };

    //------------------------------------------------------------------
    // 共通設定 患者とcreatorに自施設の情報を設定する
    //------------------------------------------------------------------
    simpleComposition.context.patient.facilityId = simpleFacility.id;
    simpleComposition.context.creator.facility = simpleFacility;
    //------------------------------------------------------------------

    // POST
    post('baseClinic', simpleComposition, function (err, mml) {
        // コールバック
        callback(err, simpleComposition, mml);
    });
};
