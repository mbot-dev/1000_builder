// 手術記録
var postSurgery = function (callback) {                     // 手術記録情報

    // simpleSurgery
    var simpleSurgery = {
        surgeryItem: []                                     // [surgeryItem]
    };

    // 手術記録項目
    var surgeryItem = {
        context: {                                          // 手術ヘッダー情報 -> surgicalInfo
            type: 'elective',                               // MML0021
            date: '2015-09-05',                             // 手術施行日 CCYY-MM-DD
            startTime: '09:18',                             // 手術開始時刻 ? hh:mm
            duration: 'P3H20M',                             // 手術時間 ? PTnHnM 5時間25分=PT5H25M
            surgicalDepartmentId: '16',                     // 手術実施診療科情報 ? [mmlDp:Department]
            surgicalDepartmentName: 'Cardiovasucular surgery',　// 手術実施診療科情報 ? [mmlDp:Department]
            patientDepartmentId: '01',
            patientDepartmentName: 'Internal medicine'　　　　// 手術時に患者の所属していた診療科 ? [mmlDp:Department]
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

    // 手術スタッフ1
    var staff = {
        staffInfo: simpleCreator                            // スタッフ 情報 simpleCreator -> [mmlPsi:PersonalizedInfo]
    };
    surgeryItem.surgicalStaffs.push(staff);

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

    // 麻酔医
    var simpleAnesthesiologist = {
        id: '201607',                                      // 施設で付番されている医師のId
        kanjiName: '鈴木 涼介',                             // 医師名
        prefix: 'Professor',                               // 肩書き等 オプション
        degree: 'MD/PhD',                                  // 学位 オプション
        facilityId: '1.2.840.114319.5.1000.1.26.1',        // プロジェクトから発番された医療機関Id
        facilityName: 'シルク内科',                          // 施設名
        facilityZipCode: '231-0023',                       // 施設郵便番号
        facilityAddress: '横浜市中区山下町1番地 8-9-01',       // 施設住所
        facilityPhone: '045-571-6572',                     // 施設電話番号
        license: 'doctor'                                  // 医療資格 MML0026から選ぶ
    };
    var staff2 = {
        staffInfo: simpleAnesthesiologist                  // スタッフ 情報 simpleCreator -> [mmlPsi:PersonalizedInfo]
    };
    surgeryItem.anesthesiologists.push(staff2);

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

    // POST
    post('surgery', simpleComposition, function (err, mml) {
        // コールバック
        callback(err, simpleComposition, mml);
    });
};
