var postProgressCourse = function (callback) {

    // 経過記録
    var simpleProgressCourse = {
        freeExpression: ''
    };

    /*
    // 改行サンプル  <xhtml:br/> を挿入
    var arr = [];
    arr.push('検尿　糖(-)蛋白(1)潜血(2)');
    arr.push('心音呼吸音正常（usually piping rales)');
    arr.push('118/86');
    arr.push('貧血はHb10程度らしい。鉄剤終了後に再検されるだろう。');
    arr.push('全身的には安定。関節症状も無し。');
    var text = arr.join('<xhtml:br/>');
    simpleProgressCourse.freeExpression = text;*/

    // section + source sample
    var jsonCurse = {
        test: '検尿　糖(-)蛋白(1)潜血(2)',
        herat: '心音呼吸音正常（usually piping rales)',
        obs1: '貧血はHb10程度らしい。鉄剤終了後に再検されるだろう。',
        obs2: '全身的には安定。関節症状も無し。'
    };
    var textCourse = JSON.stringify(jsonCurse); // ! pretty
    var arr = [];
    arr.push('<xhtml:section>');
    arr.push('<xhtml:source src=');
    arr.push('\"滉志会\"');
    arr.push(' type=');
    arr.push('\"json; codecs=abc ver1.2\" />');
    arr.push(textCourse);
    arr.push('</xhtml:section>');
    simpleProgressCourse.freeExpression = arr.join('');

    // コンポジションを生成する
    var simpleComposition = {                   // POSTする simpleComposition
        context: {                              // context: 注射された時の文脈
            uuid: generateUUID(),               // UUID
            confirmDate: confirmDate(),         // 確定日時 YYYY-MM-DDTHH:mm:ss
            patient: simpleOverseasPatient,     // 対象患者
            creator: simpleCreator,             // 担当医師
            accessRight: simpleRight            // アクセス権
        },
        content: [simpleProgressCourse]              // content: 臨床データ=progressCourse
    };

    //------------------------------------------------------------------
    // 共通設定 患者とcreatorに自施設の情報を設定する
    //------------------------------------------------------------------
    simpleComposition.context.patient.facilityId = simpleFacility.id;
    simpleComposition.context.creator.facility = simpleFacility;
    //------------------------------------------------------------------

    // POST
    post('progressCourse', simpleComposition, function (err, mml) {
        // コールバック
        callback(err, simpleComposition, mml);
    });
};
