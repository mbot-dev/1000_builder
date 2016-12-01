// 手術記録
var postSurgery = function (callback) {                     // 手術記録情報

    // simpleSurgery
    var simpleSurgery = {
        surgeryItem: []                                     // [surgeryItem]
    };

    // 手術日 昨日とする
    var now = new Date();
    now.setDate(now.getDate() - 1);
    var opDate = dateAsString(now);

    // 開始時刻 xs:time => T09:00:00
    var startTime = '09:18:00';

    // 手術時間 3時間20分 => P3H20M
    var duration = timesAsDuration(3, 20);

    // 手術記録項目
    var surgeryItem = {
        context: {                                          // 手術ヘッダー情報 -> surgicalInfo
            type: 'elective',                               // 手術区分 MML0021 待期手術
            date: opDate,                                   // 手術施行日 CCYY-MM-DD
            startTime: startTime,                           // 手術開始時刻 ? hh:mm:ss
            duration: duration                             // 手術時間 ? PTnHnM 5時間25分=PT5H25M
            // surgicalDepartment: simpleSurgicalDept,         // 手術実施診療科情報 ?  due to on xsd
            // patientDepartment: simpleInternalDept           // 手術時に患者の所属していた診療科 ?  xsd
        },
        surgicalDiagnosis: [],                              // 外科診断情報 simpleDiagnosis -> [mmlRd:RegisteredDiagnosisModule]
        surgicalProcedure: [],                              // 手術法情報 [procedureItem]
        surgicalStaffs: [],                                 // 麻酔を除く手術スタッフの情報 ? [staff]
        anesthesiaProcedure: [],                            // 麻酔法名情報 ? [titleItem]
        anesthesiologists: [],                              // 麻酔医情報 ? [staff]
        referenceInfo: {}                                   // 手術記録に用いる図や写真を外部参照 ? mmlCm:extRef
    };
    simpleSurgery.surgeryItem.push(surgeryItem);

    // 傷病名
    var diagnosis = {
        diagnosis: 'Lung cancer',                           // 疾患名
        code: 'C349-.007',                                  // 疾患コード
        system: 'ICD10',                                    // 疾患コード体系名
        category: 'mainDiagnosis'
    };
    // 配列へ追加
    surgeryItem.surgicalDiagnosis.push(diagnosis);

    // 手術法1
    var procedureItem1 = {
        operation: 'coronary artery bypass grafting'       // 手術法
    };
    // 手術法2
    var procedureItem2 = {
        operation: 'cardio-pulmonary bypass'               // 手術法
    };
    // 配列へ追加
    surgeryItem.surgicalProcedure.push(procedureItem1);
    surgeryItem.surgicalProcedure.push(procedureItem2);

    // 執刀医 オプション sample-common で定義
    var operator = asSurgicalStaff(simpleOperator, 'operator');
    surgeryItem.surgicalStaffs.push(operator);

    // 麻酔法1
    var titleItem1 = {                                       // 分割された手術要素名
        title: 'general anesthesia'
    };
    // 麻酔法2
    var titleItem2 = {                                       // 分割された手術要素名
        title: 'tracheal intubation'
    };
    // 麻酔法3
    var titleItem3 = {                                       // 分割された手術要素名
        title: 'G+O+Ethrane'
    };
    // 配列へ追加
    surgeryItem.anesthesiaProcedure.push(titleItem1);
    surgeryItem.anesthesiaProcedure.push(titleItem2);
    surgeryItem.anesthesiaProcedure.push(titleItem3);

    // 麻酔医 オプション sample-common で定義
    var anesthesiologist = asSurgicalStaff(simpleAnesthesiologist, 'anesthesiologist');
    surgeryItem.anesthesiologists.push(anesthesiologist);

    // 外部参照
    surgeryItem.referenceInfo = {
        contentType: 'image/jpeg',
        medicalRole: 'surgicalFigure',
        title: 'Skin incision',
        href: 'surgicalFigure001.jpg',
        base64: fileAsBase64('surgicalFigure001.jpg')     // ファイルコンテンツのBase64
    };

    // コンポジション
    var simpleComposition = {                   // POSTする simpleComposition
        context: {                              // context: 手術時の文脈
            uuid: generateUUID(),               // UUID
            confirmDate: confirmDate(),         // 確定日時 YYYY-MM-DDTHH:mm:ss
            patient: simplePatient,             // 対象患者
            creator: simpleCreator,             // 担当医師
            accessRight: simpleRight            // アクセス権
        },
        content: [simpleSurgery]                // content: 臨床データ=simpleSurgery
    };

    //------------------------------------------------------------------
    // 共通設定 患者とcreatorに自施設の情報を設定する
    //------------------------------------------------------------------
    simpleComposition.context.patient.facilityId = simpleFacility.id;
    simpleComposition.context.creator.facility = simpleFacility;
    //------------------------------------------------------------------

    // POST
    post('surgery', simpleComposition, function (err, mml) {
        // コールバック
        callback(err, simpleComposition, mml);
    });
};
