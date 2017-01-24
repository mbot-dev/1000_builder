var postReferral = function (callback) {

    // 紹介状の対象患者 = simplePatient
    var patient = simplePatient;

    // 紹介元の医師 = simpleCreator
    var referFrom = simpleCreator;

    // 紹介先の医療機関
    var referToFacility = {
        facilityId: '1.2.840.114319.5.1000.1.67890.1',      // 施設ID プロジェクトから指定される
        facilityName: '京都医科大学',                         // 施設名
    };

    // 紹介状のコンテント
    var simpleReferral = {
        title: '受診願い',
        chiefComplaints: '全身倦怠感',
        presentIllness: {
            value: '検診にて白血球異常値を指摘され二次検診目的にて当院受診。精査の結果、急性骨髄性白血病と診断された。',
            extRef: []
        },
        referPurpose: '精査の上、加療をお願いします。'
    };

    // 現病歴へ外部参照を追加する
    simpleReferral.presentIllness.extRef.push({
        href: '0003.pdf',                                   // ファイル名
        contentType: 'application/pdf',                     // MIME type ?
        medicalRole: 'laboratoryTest',                      // 医学的役割 ? MML0033 から
        title: '検体検査',                                   // タイトル ?
        base64: fileAsBase64('0003.pdf')                    // ファイルコンテンツのBase64
    });

    //  紹介状の関係を設定する
    simpleReferral.patient = patient;
    simpleReferral.referFrom = referFrom;
    simpleReferral.referToFacility = referToFacility;

    // コンポジションを生成する
    var simpleComposition = {                   // POSTする simpleComposition
        context: {                              // context: バイタルサイン確定時の文脈
            uuid: generateUUID(),               // UUID
            confirmDate: confirmDate(),         // 確定日時 YYYY-MM-DDTHH:mm:ss
            patient: simplePatient,             // 対象患者
            creator: simpleCreator,             // 責任医師
            accessRight: simpleRight            // アクセス権
        },
        content: [simpleReferral]              // content: 臨床データ=バイタルサイン
    };

    //------------------------------------------------------------------
    // 紹介状のタイトルと生成目的を設定する
    // 紹介状の内容を示すタイトルを入力すること(企画書)
    //------------------------------------------------------------------
    simpleComposition.context.title = '急性骨髄性白血病';       // ...
    simpleComposition.context.generationPurpose = 'consult';  // MML007

    //------------------------------------------------------------------
    // 共通設定 患者とcreatorに自施設の情報を設定する
    //------------------------------------------------------------------
    simpleComposition.context.patient.facilityId = simpleFacility.id;
    simpleComposition.context.creator.facility = simpleFacility;
    //------------------------------------------------------------------

    // POST
    post('referral', simpleComposition, function (err, mml) {
        // コールバック
        callback(err, simpleComposition, mml);
    });
};
