// 初診時特有情報
var postFirstClinic = function (callback){                              // 初診時特有情報

    // simpleFirstClinic
    var simpleFirstClinic = {
        familyHistory: [],                                      // 家族歴情報 ? [familyHistoryItem]
        childhood: {},                                          // 小児期情報 ?
        pastHistory: {},                                        // 既往歴情報 ? [pastHistoryItem]
        chiefComplaints: '',                                    // 主訴 ?
        presentIllnessNotes: ''                                 // 現病歴自由記載 ?
    };

    // 家族歴項目
    var familyHistoryItem = {
        relation: 'motherInLaw',                                // 続柄コード MML0020
        simpleDiagnosis: {
            diagnosis: 'gastric cancer',                        // 疾患名
            code: 'C169-.007',                                  // 疾患コード
            system: 'ICD10',                                    // 疾患コード体系名
            dateOfRemission: '1989-08-25',                      // 疾患終了日 YYYY-MM-DD 形式（オプション）
            outcome: 'died'                                     // 転帰 MML0016を使用（オプション）
        },
        age: 'P40Y'                                             // 家族の疾患時年齢 ?
    };
    simpleFirstClinic.familyHistory.push(familyHistoryItem);

    // 小児期情報
    simpleFirstClinic.childhood = {
        birthInfo: {                                            // 出生時情報
            deliveryWeeks: 'P40W',                              // 分娩時週数 ? PnW
            deliveryMethod: 'cesarean section',                 // 分娩方法 ?
            bodyWeight: '3270',                                 // 出生時体重 ? g
            bodyHeight: '50'                                    // 出生時身長 ? cm
        },
        vaccination: []                                         // 予防接種情報 ? [vaccinationItem]
    };

    // 予防摂取項目1
    var vaccinationItem1 = {
        vaccine: 'polio',                                       // 接種ワクチン名
        injected: 'true',                                       // 実施状態．true：ワクチン接種，false：接種せず
        age: 'P6M',                                             // 接種時年齢 ? PnYnM 1歳6ヶ月=P1Y6M
        memo: 'first administration'                            // 実施時メモ ?
    };
    // 予防摂取項目1
    var vaccinationItem2 = {
        vaccine: 'polio',                                       // 接種ワクチン名
        injected: 'true',                                       // 実施状態．true：ワクチン接種，false：接種せず
        age: 'P1Y6M',                                           // 接種時年齢 ? PnYnM 1歳6ヶ月=P1Y6M
        memo: 'second administration'                           // 実施時メモ ?
    };
    simpleFirstClinic.childhood.vaccination.push(vaccinationItem1);
    simpleFirstClinic.childhood.vaccination.push(vaccinationItem2);

    // 既往歴 フリーノートか時間表現併用の選択
    simpleFirstClinic.pastHistory = {                           // 既往歴情報
        // freeNotes: '',                                       // フリーノート choice
        pastHistoryItem: []                                     // 時間表現併用 choice
    };

    // 既往歴項目1
    var pastHistoryItem1 = {
        timeExpression: '6 years old',                          // 時間表現
        eventExpression: 'appendectomy'                         // 時間表現に対応するイベント表現 ? [string]
    };
    // 既往歴項目1
    var pastHistoryItem2 = {
        timeExpression: '5 years ago (1994)',                   // 時間表現
        eventExpression: 'hypertension'                         // 時間表現に対応するイベント表現 ? [string]
    };
    simpleFirstClinic.pastHistory.pastHistoryItem.push(pastHistoryItem1);
    simpleFirstClinic.pastHistory.pastHistoryItem.push(pastHistoryItem2);

    // 主訴
    simpleFirstClinic.chiefComplaints = '頭痛';

    // 現病歴自由記載
    simpleFirstClinic.presentIllnessNotes = '2週間前より一日に数回側頭部から頭頂部にかけてのずきずきする痛みがあり。';

    // コンポジションを生成する
    var simpleComposition = {                   // POSTする simpleComposition
        context: {                              // context: 初診時の文脈
            uuid: generateUUID(),               // UUID
            confirmDate: confirmDate(),         // 確定日時 YYYY-MM-DDTHH:mm:ss
            patient: simplePatient,             // 対象患者
            creator: simpleCreator,             // 担当医師
            accessRight: simpleRight            // アクセス権
        },
        content: [simpleFirstClinic]            // content: 臨床データ=simpleFirstClinic
    };

    // POST
    post('firstClinic', simpleComposition, function (err, mml) {
        // コールバック
        callback(err, simpleComposition, mml);
    });
};
