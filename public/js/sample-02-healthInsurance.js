// 健康保険情報
var postHealthInsurance = function (callback) {

    // simpleHealthInsurance
    var simpleHealthInsurance = {
        countryType: 'JPN',                             // 国コード ?
        insuranceClass: '国７',                          // 保険種別 ?
        insuranceClassCode: '10',                       // 保険種別コード ?
        insuranceNumber: '8001',                        // 健康保険者番号
        clientGroup: '宮市みへし',                        // 被保険者記号
        clientNumber: '421',                            // 被保険者番号
        familyClass: 'false',                           // 本人家族区分．true：本人，false：家族
        startDate: '2016-02-20',                        // 開始日 (交付年月日) YYYY-MM-DD
        expiredDate: '2017-02-28',                      // 有効期限 YYYY-MM-DD
        paymentInRatio: '0.3',                          // 入院時の負担率 ?
        paymentOutRatio: '0.3',                         // 外来時の負担率 ?
        publicInsurance: []                             // 公費負担医療情報 [publicInsuranceItem]  ?
    };

    // 公費
    var publicInsuranceItem = {
        priority: '1',                                   // 優先順位
        providerName: '公費',                             // 公費負担名称 ?
        provider: '15450034',                            // 負担者番号
        recipient: '0009043',                            // 受給者番号
        startDate: '1997-09-30',                         // 開始日 YYYY-MM-DD
        expiredDate: '1999-09-30',                       // 有効期限 YYYY-MM-DD
        paymentRatio: '10000',                           // 負担率または負担金 ?
        ratioType: 'fix'                                 // paymentRatioのタイプ paymentRatioがある時は必須 MML0032
    };

    // 主保険へ追加
    simpleHealthInsurance.publicInsurance.push(publicInsuranceItem);

    // コンポジションを生成する
    var simpleComposition = {                   // POSTする simpleComposition
        context: {                              // context: 注射された時の文脈
            uuid: generateUUID(),               // UUID
            confirmDate: confirmDate(),         // 確定日時 YYYY-MM-DDTHH:mm:ss
            patient: simplePatient,             // 対象患者
            creator: simpleCreator,             // 担当医師
            accessRight: simpleRight            // アクセス権
        },
        content: [simpleHealthInsurance]        // content: 臨床データ=simpleHealthInsuranceとする
    };

    //------------------------------------------------------------------
    // 共通設定 患者とcreatorに自施設の情報を設定する
    //------------------------------------------------------------------
    simpleComposition.context.patient.facilityId = simpleFacility.id;
    simpleComposition.context.creator.facility = simpleFacility;
    //------------------------------------------------------------------

    // POST
    post('healthInsurance', simpleComposition, function (err, mml) {
        // コールバック
        callback(err, simpleComposition, mml);
    });
};
