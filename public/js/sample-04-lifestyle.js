// 生活習慣
var postLifestyle = function (callback) {

    // simpleLifestyle
    var simpleLifestyle = {
        occupation: '会社員',
        tobacco: '吸わない',
        alcohol: 'ビール 350ml/day',
        other: 'ウォーキング'
    };

    // コンポジションを生成する
    var simpleComposition = {                   // POSTする simpleComposition
        context: {                              // context: 注射された時の文脈
            uuid: generateUUID(),               // UUID
            confirmDate: confirmDate(),         // 確定日時 YYYY-MM-DDTHH:mm:ss
            patient: simpleOverseasPatient,     // 対象患者
            creator: simpleCreator,             // 担当医師
            accessRight: simpleRight            // アクセス権
        },
        content: [simpleLifestyle]              // content: 臨床データ=simpleLifestyle
    };

    //------------------------------------------------------------------
    // 共通設定 患者とcreatorに自施設の情報を設定する
    //------------------------------------------------------------------
    simpleComposition.context.patient.facilityId = simpleFacility.id;
    simpleComposition.context.creator.facility = simpleFacility;
    //------------------------------------------------------------------

    // POST
    post('lifestyle', simpleComposition, function (err, mml) {
        // コールバック
        callback(err, simpleComposition, mml);
    });
};
