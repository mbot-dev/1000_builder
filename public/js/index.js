// API仕様
// attribute=contentType
var apiSpec = {
    patientInfo: ['患者情報', 'simplePatientInfo', '医師'],
    healthInsurance: ['健康保険', 'simpleHealthInsurance', '医師'],
    registeredDiagnosis: ['診断履歴', 'simpleRegisteredDiagnosis', '医師'],
    lifestyle: ['生活習慣', 'simpleLifestyle', '医師'],
    baseClinic: ['基礎的診療情報', 'simpleBaseClinic', '医師'],
    firstClinic: ['初診時特有情報', 'simpleFirstClinic', '医師'],
    progressCourse: ['経過記録', 'simpleProgressCourse', '医師'],
    surgery: ['手術記録', 'simpleSurgery', '医師'],
    summary: ['臨床サマリ', 'simpleSummary', '医師'],
    test: ['検歴情報', 'simpleTest', '検査実施施設の代表'],
    report: ['報告書', 'simpleReport', '報告書作成者'],
    referral: ['紹介状', 'simpleReferral', '医師'],
    vitalSign: ['バイタルサイン', 'simpleVitalSign', '医師'],
    flowSheet: ['体温表', 'simpleFlowSheet', '医師'],
    prescription: ['処方せん', 'simplePrescription', '医師'],
    injection: ['注射記録', 'simpleInjection', '医師'],
    hemodialysis: ['透析記録', 'simpleHemodialysis', '医師']
};

// コールバックされたAPIデータを表示する
var showAPI = function (moduleName, apiName, creatorName, simpleComposition) {
    var patient = simpleComposition.context.patient;
    var creator = simpleComposition.context.creator;
    var apiData = simpleComposition.content[0];
    var arr = [];
    arr.push('<pre>');
    arr.push('// 患者');
    arr.push('\n');
    arr.push('var simplePatient = ');
    arr.push(prettyJSON(patient));
    arr.push(';');
    arr.push('\n');
    arr.push('// ');
    arr.push(creatorName);
    arr.push('\n');
    arr.push('var simpleCreator = ');
    arr.push(prettyJSON(creator));
    arr.push(';');
    arr.push('\n');
    arr.push('// ');
    arr.push(moduleName);          // 処方箋 etc.
    arr.push('\n');
    arr.push('var ');
    arr.push(apiName);            // simpleXX
    arr.push(' = ');
    arr.push(prettyJSON(apiData));// simpleXXのJSON
    arr.push(';');
    arr.push('</pre>');
    var text = arr.join('');
    document.getElementById('simple_box').innerHTML = text;
};

// コールバックされたMMLを表示する
var showMML = function (mml) {
    // 結果はMML(XML) なので pretty print する
    document.getElementById('mml_box').innerHTML = prettyXml(mml);
};

// APIを起動する
var invokeAPI = function (contentType) {

    // contentTypeから名称とAPIデータ形式を得る
    var spec = apiSpec[contentType];

    // simplePrescription => postPrescription 等の関数名に変更する
    var funcName = 'post' + spec[1].substring('simple'.length);

    // Applyする
    window[funcName](function (err, simple, mml) {
        if (err) {
            alert(err);
        } else {
            // APIデータ形式を表示する
            showAPI(spec[0], spec[1], spec[2], simple);
            // 生成されたMMLを表示する
            showMML(mml);
        }
    });
};

// selectionが変更された
var changeModule = function (selection) {
    // 選択されたAPIを起動する
    invokeAPI(selection.value);
};

// ページロード後にコールされる関数
var startApp = function () {
    // Access Tokenを取得し処方せんサンプルをpostする
    getAccessToken(function(err) {
        if (err) {
            alert(err);
        } else {
            invokeAPI('prescription');
        }
    });
};
