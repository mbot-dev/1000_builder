// 体温表
var postFlowSheet = function (callback) {

    // コンテキスト
    var context = {
        facility: 'EHR医科大学',
        facilityCode: 'JPN432101234567',
        facilityCodeId: 'JMARI',                    // ca | insurance | monbusho | JMARI
        department: '第5内科',                       // ?
        depCode: '1',
        depCodeId: 'MML0028',
        ward: '病棟',                                // ?
        wardCode: '4',
        wardCodeId: 'MML0028',
        observer: '看護師A',                         // ?
        obsCode: '007',
        obsCodeId: 'local'
    };

    // VitalSign 1
    var simpleVitalSign1 = {
        item: [],                                   // 計測項目の配列
        observedTime: '2016-12-01T08:32:47'         // バイタルサインを観察した時間 YYYY-MM-DDTHH:mm:ss 形式
    };
    simpleVitalSign1.item.push({
        itemName: 'Systolic blood pressure',        // バイタルサイン項目 mmlVs01を使用
        numValue: 120,                              // 値
        unit: 'mmHg'
    });
    simpleVitalSign1.item.push({
        itemName: 'Diastolic blood pressure',       // バイタルサイン項目 mmlVs01を使用
        numValue: 80,                              // 値
        unit: 'mmHg'
    });
    simpleVitalSign1.item.push({
        itemName: 'Pulse rate',                     // バイタルサイン項目 mmlVs01を使用
        numValue: 60,                               // 値
        unit: '/min'
    });
    simpleVitalSign1.item.push({
        itemName: 'Body temperature',               // バイタルサイン項目 mmlVs01を使用
        numValue: 36,                               // 値
        unit: 'centigrade'
    });

    // VitalSign 2
    var simpleVitalSign2 = {
        item: [],                                   // 計測項目の配列
        observedTime: '2016-12-01T19:21:39'         // バイタルサインを観察した時間 YYYY-MM-DDTHH:mm:ss 形式
    };
    simpleVitalSign2.item.push({
        itemName: 'Systolic blood pressure',        // バイタルサイン項目 mmlVs01を使用
        numValue: 132,                              // 値
        unit: 'mmHg'
    });
    simpleVitalSign2.item.push({
        itemName: 'Diastolic blood pressure',       // バイタルサイン項目 mmlVs01を使用
        numValue: 72,                               // 値
        unit: 'mmHg'
    });
    simpleVitalSign2.item.push({
        itemName: 'Pulse rate',                     // バイタルサイン項目 mmlVs01を使用
        numValue: 64,                               // 値
        unit: '/min'
    });
    simpleVitalSign2.item.push({
        itemName: 'Body temperature',               // バイタルサイン項目 mmlVs01を使用
        numValue: 36.2,                             // 値
        unit: 'centigrade'
    });
    simpleVitalSign2.item.push({
        itemName: 'SpO2',                           // バイタルサイン項目 mmlVs01を使用
        numValue: 97,                               // 値
        unit: '%'
    });

    // intake
    var intakeArr = [];
    intakeArr.push({
        intakeType: '朝食（主）',
        intakeVolume: 10,                            // ? xs:decimal
        intakeUnit: '/10'                            // ?
    });
    intakeArr.push({
        intakeType: '朝食（副）',
        intakeVolume: 8,                             // ? xs:decimal
        intakeUnit: '/10'                            // ?
    });
    intakeArr.push({
        intakeType: '経管栄養剤',
        intakeVolume: 200,                           // ? xs:decimal
        intakeUnit: 'ml',                            // ?
        intakePathway: '胃瘻',                        // ?
        intakeStartTime: '2016-12-01T15:30:11',      // ? xs:dateTime
        intakeEndTime: '2016-12-01T16:04:13'         // ? xs:dateTime
    });

    // bodilyOutput
    bodilyArr = [];
    bodilyArr.push({
        boType: 'urine',
        boVolume: 1736,                                // ? xs:decimal
        boUnit: 'ml',
        boFrequency: [
            {
                bofTimes: 5,                                // ? xs:decimal
                bofPeriodStartTime: '2016-12-01T09:00:00',  // ? xs:dateTim
                bofPeriodEndTime: '2016-12-01T21:00:00'     // ? xs:dateTim
            }
        ]
    });
    bodilyArr.push({
        boType: 'feces',
        boVolume: 345,                                // ? xs:decimal
        boUnit: 'g',
        boFrequency: [
            {
                bofTimes: 1,                                // ? xs:decimal
                bofPeriodStartTime: '2016-12-01T09:00:00',  // ? xs:dateTim
                bofPeriodEndTime: '2016-12-02T09:00:00'     // ? xs:dateTim
            }
        ],
        boMemo: '褐色調'
    });
    bodilyArr.push({
        boType: 'bile',
        boVolume: 80,                                // ? xs:decimal
        boUnit: 'ml',
        boPathway: 'ドレーン',
        boStartTime: '2016-12-01T10:30:00',          // ? xs:dateTime
        boEndTime: '2016-12-01T12:12:00'
    });

    // FlowSheet
    var simpleFlowSheet = {
        context: context,
        vitalSign: [simpleVitalSign1, simpleVitalSign2],   // *
        intake: intakeArr,                                 // *
        bodilyOutput: bodilyArr                            // *
    };

    // コンポジションを生成
    var simpleComposition = {                   // POSTする simpleComposition
        context: {                              // context 文脈
            uuid: generateUUID(),               // UUID
            confirmDate: confirmDate(),            // 確定日時 = 報告日時 YYYY-MM-DDTHH:mm:ss
            patient: simpleOverseasPatient,     // 対象患者
            creator: simpleCreator,            // 報告書の記載者
            accessRight: simpleRight            // アクセス権
        },
        content: [simpleFlowSheet]              // content: simpleFlowSheet
    };

    //------------------------------------------------------------------
    // FlowSheetのタイトルと生成目的を設定する
    //------------------------------------------------------------------
    // 体温表、熱型表、温度板
    simpleComposition.context.title = '体温表';
    // MML007 flowsheet
    simpleComposition.context.generationPurpose = 'flowsheet';
    //------------------------------------------------------------------

    //------------------------------------------------------------------
    // 共通設定 患者とcreatorに自施設の情報を設定する
    //------------------------------------------------------------------
    simpleComposition.context.patient.facilityId = simpleFacility.id;
    simpleComposition.context.creator.facility = simpleFacility;
    //------------------------------------------------------------------

    // POST
    post('flowsheet', simpleComposition, function (err, mml) {
        // コールバック
        callback(err, simpleComposition, mml);
    });
};
