// API仕様
// attribute=contentType
var apiSpec = {
    patientInfo: ['患者情報', 'simplePatientInfo'],
    healthInsurance: ['健康保険', 'simpleHealthInsurance'],
    registeredDiagnosis: ['診断履歴', 'simpleRegisteredDiagnosis'],
    lifestyle: ['生活習慣', 'simpleLifestyle'],
    baseClinic: ['基礎的診療情報', 'simpleBaseClinic'],
    firstClinic: ['初診時特有情報', 'simpleFirstClinic'],
    progressCourse: ['経過記録', 'simpleProgressCourse'],
    surgery: ['手術記録', 'simpleSurgery'],
    summary: ['臨床サマリ', 'simpleSummary'],
    test: ['検歴情報', 'simpleTest'],
    report: ['報告書', 'simpleReport'],
    referral: ['紹介状', 'simpleReferral'],
    vitalSign: ['バイタルサイン', 'simpleVitalSign'],
    flowSheet: ['体温表', 'simpleFlowSheet'],
    prescription: ['処方せん', 'simplePrescription'],
    injection: ['注射記録', 'simpleInjection'],
    hemodialysis: ['透析記録', 'simpleHemodialysis']
};

// コールバックされたAPIデータを表示する
var showAPI = function (moduleName, apiName, apiData) {
    var arr = [];
    arr.push('<pre>');
    arr.push('// 患者');
    arr.push('\n');
    arr.push('var simplePatient = ');
    arr.push(prettyJSON(simplePatient));
    arr.push(';');
    arr.push('\n');
    arr.push('// 医師');
    arr.push('\n');
    arr.push('var simpleCreator = ');
    arr.push(prettyJSON(simpleCreator));
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
            showAPI(spec[0], spec[1], simple);
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
