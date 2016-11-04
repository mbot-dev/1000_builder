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
    var confirmDate = nowAsDateTime();          // このMMLの確定日時 YYYY-MM-DDTHH:mm:ss
    var uuid = window.uuid.v4();                // MML文書の UUID
    var simpleComposition = {                   // POSTする simpleComposition
        context: {                              // context: 注射された時の文脈
            uuid: uuid,                         // UUID
            confirmDate: confirmDate,           // 確定日時 YYYY-MM-DDTHH:mm:ss
            patient: simplePatient,             // 対象患者
            creator: simpleCreator,             // 担当医師
            accessRight: simpleRight            // アクセス権
        },
        content: [simpleLifestyle]              // content: 臨床データ=simpleLifestyle
    };

    // POST
    post('lifestyle', simpleComposition, function (err, mml) {
        if (err) {
            callback(err, simpleLifestyle, null);
        } else {
            callback(null, simpleLifestyle, mml);
        }
    });
};
