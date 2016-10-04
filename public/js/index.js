//------------------------------------------------------------------
// Global object app context
//------------------------------------------------------------------
var appCtx = {
    access_token: '',           // アクセストークン
    expires_in: 0,              // トークンの有効期間（秒）このデモでは使用しない
    test_results: [],           // デモ固有で検査結果を格納する配列
    queue: []                   // 送信できなかったSimpleCompositonを保存するQueue
};

//------------------------------------------------------------------
// Access Token 取得後にコールされる関数
//------------------------------------------------------------------
var saveToken = function (token) {
    // tokenをappCtxに保存
    appCtx.access_token = token.access_token;
    appCtx.expires_in = token.expires_in;
    // Queueに保存されているsimpleCompositonをpostする
    while (appCtx.queue.length > 0) {
        var simple = appCtx.queue.shift();
        post(simple);
    }
};

//------------------------------------------------------------------
// Access Token 取得する
// Client Credentials Grant flow of the OAuth 2 specification
// https://tools.ietf.org/html/rfc6749#section-4.4
//------------------------------------------------------------------
var getAccessToken = function (callback) {
    var xhr = new XMLHttpRequest();

    // プロジェクトから支給された consumer key（デモ用）
    var consumerKey = '2a1ecdd5-a1ec-4226-aaac-e42b8d602c1e';

    // プロジェクトから支給された secret（デモ用）
    var secret = '5dbe45c15f68209ff401e1e218639c25e86067bb7d11438d9ca343681b1cc141';

    // 上記二つをコロンで連結し base64 でエンコードする
    var base64 = btoa(consumerKey + ':'　+　secret);

    // ポスト先は /oauth2/token
    xhr.open('POST', '/simple/api/v1/oauth2/token', true);

    // 認証用の HTTP Header をセットする
    xhr.setRequestHeader('Authorization', 'Basic ' + base64);

    // Content type は application/x-www-form-urlencoded
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');

    // ポストするデータは grant_type=client_credentials で URL エンコードする
    var postString = encodeURI('grant_type=client_credentials');

    // Event listener XMLHttpRequest固有
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {

            // レスポンスを調べる
            if (xhr.status === 200 ) {
                // HTTP Status が 200 で正常取得できた場合
                // レスポンステキストをパースしてJSONに変換する
                // 結果は {token_type: 'bearer', access_token: 'token', expires_in: ''有効期間秒''}
                var parsed = JSON.parse(xhr.responseText);
                if (parsed.token_type === 'bearer' && parsed.hasOwnProperty('access_token')) {
                    // token_type が 'bearer' であることを確認しコールバック
                    callback(null, parsed);
                } else {
                    var e = new Error('Unexpected server response');
                    alert(e);
                    callback(e, null);
                }
            } else {
                // status !== 200 原因
                // consumerKey または secretの誤り
                // Authorization ヘッダーの誤り
                // Content-typeの誤り
                // grant_type=client_credentials がセットされていない
                // 戻り値 {error: invalid_request(400) | invalid_client(401)}
                var err = JSON.parse(xhr.responseText);
                alert(new Error(err.error + ' ' + xhr.status));
                callback(err, null);
            }
        }
    };
    xhr.send(postString);
};

//------------------------------------------------------------------
// 1000-builderへsimpleCompositionをポストする
//------------------------------------------------------------------
var post = function (simpleComposition) {
    var xhr = new XMLHttpRequest();

    // ポスト先 /1000/simple/v1
    xhr.open('POST', '/simple/api/v1/mml', true);

    // Authorizationヘッダーを Bearer access_token にセットする
    xhr.setRequestHeader('Authorization', 'Bearer ' + appCtx.access_token);

    // contentType = json
    xhr.setRequestHeader('Content-type', 'application/json');

    // Event listener XMLHttpRequest固有
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {

            // レスポンスを調べる
            if (xhr.status > 199 && xhr.status < 300) {
                // response = 200, responseからJSONを生成する
                var parsed = JSON.parse(xhr.responseText);
                // 結果はMML(XML) なので 'pretty print する
                document.getElementById('mml_box').innerHTML = prettyXml(parsed.mml);

            } else if (xhr.status > 399 && xhr.status < 500) {
                // status = 400 | 401 | 403
                // access tokenが失効しているか不正な場合
                // Authorization に Bearer token がセットされていない
                // ポストするsimpleCompositionを一旦 Queue に保存する
                appCtx.queue.push(simpleComposition);
                // Tokenを再取得する
                getAccessToken(function(err, token) {
                    if (!err) {
                        // 成功した時点でQueueに保存したSimpleCompositionが再度postされる
                        saveToken(token);
                    }
                });
            } else {
                // simpleCompositionに誤りがある
                alert(new Error(xhr.status));
            }
        }
    };
    xhr.send(JSON.stringify(simpleComposition));
};

// 患者
var simplePatient = {
    id: '0516',                                        // 患者ID
    idType: 'facility',                                // IDのタイプ MML0024 を使用する
    facilityId: 'JPN012345678901',                     // 医療連携用の施設IDでプロジェクトから指定される
    kanjiName: '宮田 奈々',                             // 漢字の氏名（氏名は漢字、カナ、ローマ字のどれか一つ必須）
    kanaName: 'ミヤタ ナナ',                             // カナの氏名（同上）
    romanName: 'Nana Miyata',                          // ローマ字の氏名（同上）
    gender: 'femail',                                  // 性別 MML0010を使用 (女:female 男:male その他:other 不明:unknown)
    dateOfBirth: '1994-11-26',                         // 生年月日 YYYY-MM-DD 形式
    maritalStatus: 'single',                           // 婚姻状況 MML0011を使用（オプション）
    nationality: 'JPN',                                // 国籍（オプション）
    postalCode: '000-0000',                            // 郵便番号（オプション）
    address: '横浜市中区日本大通り 1-23-4-567',           // 住所（オプション）
    telephone: '054-078-7934',                         // 電話番号（オプション）
    mobile: '090-2710-1564',                           // モバイル（オプション）
    email: 'miyata_nana@example.com'                   // 電子メール（オプション）
};

// 医師等
var simpleCreator = {
    id: '201605',                                      // 医師のID
    idType: 'facility',                                // IDのタイプ MML0024 を使用する
    kanjiName: '青山 慶二',                             // 医師名（kanjiName、kanaName、romanNameのどれか一つ必須）
    prefix: 'Professor',                               // 肩書き等（オプション）
    degree: 'MD/PhD',                                  // 学位（オプション）
    facilityId: 'JPN012345678901',                     // 医療連携用の施設ID プロジェクトから指定される
    facilityIdType: 'JMARI',                           // 上記施設IDを発番している体系 MML0027を使用（ca|insurance|monbusho|JMARI|OID)
    facilityName: 'シルク内科',                          // 施設名
    facilityZipCode: '231-0023',                       // 施設郵便番号
    facilityAddress: '横浜市中区山下町1番地 8-9-01',      // 施設住所
    facilityPhone: '045-571-6572',                     // 施設電話番号
    departmentId: '01',                                // 医科用の場合は MML0028、歯科用の場合は MML0030 から選ぶ（オプション）
    departmentIdType: 'medical',                       // 医科用の診療科コードの場合はmedicalを、歯科用の診療科コードの場合はdentalを指定する MML0029(medical|dental|facility)から選ぶ（オプション）
    departmentName: '第一内科',                         // 診療科名（オプション）
    license: 'doctor'                                  // 医療資格 MML0026を使用（オプション）
};

// 処方せんサンプル
var simplePrescription = function () {
    // 服薬開始日（デモなので現在時刻）
    var startDate = nowAsDate();                        // YYYY-MM-DD形式
    // 生成する simplePrescription
    var simple = {
        contentType: 'Medication',                      // contentTypeをMedicationにする
        medication: []                                  // 処方の配列
    };

    // 処方
    var med = {
        issuedTo: 'external',                           // 院外処方の場合はexternal、院内処方の場合はinternalを指定する（オプション）
        medicine: 'マーズレン S 顆粒',                    // 処方薬名称
        medicineCode: '612320261',                      // 処方薬のコード
        medicineCodeSystem: 'YJ',                       // コード体系
        dose: 1,                                        // 数量
        doseUnit: 'g',                                  // 単位
        frequencyPerDay: 2,                             // 1日の内服回 数総量のみが記載される外用剤などの場合には省略可（オプション）
        startDate: startDate,                           // 服薬開始日 YYYY-MM-DD（オプション）
        duration: 'P30D',                               // 30日分 P数値D で記述する（オプション）
        instruction: '内服2回 朝夜食後に',                 // 用法（オプション）
        PRN: false,                                     // 頓用の時 true（オプション）
        brandSubstitutionPermitted: true,               // ジェネリック医薬品への代替可 可の時true、省略時は可とみなす（オプション）
        longTerm: false                                 // 長期処方の時true、短期であればfalse（オプション）
    };
    simple.medication.push(med);                        // 配列へ追加

    med = {
        issuedTo: 'external',                           // 院外処方の場合はexternal、院内処方の場合はinternalを指定する（オプション）
        medicine: 'メトリジン錠 2 mg',                    // 処方薬名称
        medicineCode: '612160027',                      // 処方薬のコード
        medicineCodeSystem: 'YJ',                       // コード体系
        dose: 2,                                        // 数量
        doseUnit: '錠',                                 // 単位
        frequencyPerDay: 2,                             // 1日の内服回数 数総量のみが記載される外用剤などの場合には省略可（オプション）
        startDate: startDate,                           // 服薬開始日 YYYY-MM-DD（オプション）
        duration: 'P30D',                               // 30日分 P数値D で記述する（オプション）
        instruction: '内服2回 朝夜食後に',                 // 用法（オプション）
        PRN: false,                                     // 頓用の時 true（オプション）
        brandSubstitutionPermitted: false,              // ジェネリック医薬品への代替可 可の時true、省略時は可とみなす（オプション）
        longTerm: true                                  // 長期処方の時true、短期であればfalse（オプション）
    };
    simple.medication.push(med);                        // 配列へ追加

    return simple;
};

// 注射サンプル
var simpleInjection = function () {
    // 生成する simpleInjection
    var simple = {
        contentType: 'Injection',                       // contentTypeをInjectionにする
        medication: []                                  // 注射の配列
    };
    // 投与開始日時（デモなので現在時刻）
    var start = new Date();                             // 投与開始日時
    var end = new Date();
    end.setHours(start.getHours() + 2);                 // 2H後 投与終了日時
    var med = {
        medicine: 'ラクテック 500ml',                     // 薬剤名称
        medicineCode: '12304155',                       // 薬剤コード
        medicineCodeystem: 'YJ',                        // コード体系
        dose: '500',                                    // 用量
        doseUnit: 'ml',                                 // 単位
        startDateTime: toDateTimeString(start),         // 投与開始日時 YYYY-MM-DDTHH:mm:ss（オプション）
        endDateTime: toDateTimeString(end),             // 投与終了日時 YYYY-MM-DDTHH:mm:ss（オプション）
        instruction: '2時間で投与する',                    // 用法指示（オプション）
        route: '右前腕静脈ルート',                         // 投与経路 投与する注射ルートを記載する。例：右前腕留置ルート，右鎖骨下中心静脈ルート（オプション）
        site: '右前腕',                                  // 投与部位 注射した部位を記載する。例：右上腕三角，腹部（オプション）
        deliveryMethod: '点滴静注',                       // 注射方法 例：筋注，皮下注，静注，点滴静注，中心静脈注射（オプション）
        batchNo: '1'                                    // 処方番号 これにより用法が共通する薬剤をまとめて一つの処方単位とすることができる。（オプション）
    };
    simple.medication.push(med);
    med = {
        medicine: 'ビタメジン静注用',                      // 薬剤名称
        medicineCode: '553300555',                      // 薬剤コード
        medicineCodeystem: 'YJ',                        // コード体系
        dose: '1',                                      // 用量
        doseUnit: 'V',                                  // 単位
        batchNo: '1'                                    // 処方番号（オプション）
    };
    simple.medication.push(med);

    // 投与開始、終了日時
    start = new Date();                                 // 投与開始日時
    end = new Date();
    end.setHours(start.getHours() + 1);                 // 1H後 投与終了日時
    med = {
        medicine: 'セファメジンα 2g キット',               // 薬剤名称
        medicineCode: '14433344',                       // 薬剤コード
        medicineCodeystem: 'YJ',                        // コード体系
        dose: '1',                                      // 用量
        doseUnit: 'V',                                  // 単位
        startDateTime: toDateTimeString(start),         // 投与開始日時 YYYY-MM-DDTHH:mm:ss（オプション）
        endDateTime: toDateTimeString(end),             // 投与終了日時 YYYY-MM-DDTHH:mm:ss（オプション）
        instruction: '1時間で投与する',                    // 用法指示（オプション）
        route: '右前腕静脈ルート',                         // 投与経路 投与する注射ルートを記載する。例：右前腕留置ルート，右鎖骨下中心静脈ルート（オプション）
        site: '右前腕',                                  // 投与部位 注射した部位を記載する。例：右上腕三角，腹部（オプション）
        deliveryMethod: '点滴静注',                       // 注射方法 例：筋注，皮下注，静注，点滴静注，中心静脈注射（オプション）
        batchNo: '1'                                    // 処方番号 これにより用法が共通する薬剤をまとめて一つの処方単位とすることができる。（オプション）
    };
    simple.medication.push(med);
    return simple;
};

// 病名サンプル
// 1病名毎に1モジュール
var simpleDiagnosis = function () {
    // デモ用の日時
    var now = new Date();
    var dateOfRemission = toDateString(now);                // 疾患終了日
    now.setDate(now.getDate() - 30);                        // 30日前を
    var dateOfOnset = toDateString(now);                    // 疾患開始日

    return {
        contentType: 'Medical Diagnosis',                   // contentTypeをMedical Diagnosisにする
        diagnosis: 'colon carcinoid',                       // 疾患名
        code: 'C189-.006',                                  // 疾患コード
        system: 'ICD10',                                    // 疾患コード体系名
        category: 'mainDiagnosis',                          // 診断の分類　MML0012からMML0015を使用（オプション）
        dateOfOnset: dateOfOnset,                           // 疾患開始日 YYYY-MM-DD 形式（オプション）
        dateOfRemission: dateOfRemission,                   // 疾患終了日 YYYY-MM-DD 形式（オプション）
        outcome: 'fullyRecovered'                           // 転帰 MML0016を使用（オプション）
    };
};

// ファイルコンテンツ(test_result.csv)から検査項目リストを生成する下請け
var createTestItems = function (content) {
    var items = [];
    var lineArray = [];
    var simpleItem = {};
    // リターン区切りでline by line
    var lines = content.split("\n");
    // 最初の行はヘッダーなので除く
    lines.shift();
    lines.every(function (entry, index, lines) {
        if (entry === '') {
            return false;
        }
        // この行をカンマ区切りで配列に格納する
        lineArray = entry.split(/\s*,\s*/);
        // この行のテスト項目
        simpleItem = {
            spcCode: lineArray[0],                      // 検体コード
            spcName: lineArray[1],                      // 検体名称
            code: lineArray[2],                         // 検査項目コード
            name: lineArray[3],                         // 検査項目名称
            value: lineArray[4]                         // 結果値
        };
        if (lineArray[5] !== '') {
            simpleItem.unit = lineArray[5];              // 単位
        }
        if (lineArray[6] !== '' ) {
            simpleItem.lowerLimit = lineArray[6];        // 下限値
        }
        if (lineArray[7] !== '' ) {
            simpleItem.upperLimit = lineArray[7];        // 上限値
        }
        if (lineArray[8] !== '' ) {
            simpleItem.out = lineArray[8];               // 判定フラグ
        }
        if (lineArray[9] !== '' && lineArray[10] !== '') {
            simpleItem.memoCode = lineArray[9];          // メモコード
            simpleItem.memo = lineArray[10];             // メモ
        }
        items.push(simpleItem);
        return true;
    });
    return items;
};

// 検査サンプル
var simpleLabTest = function (callback) {
    var laboratoryTest = {
        contentType: 'Laboratory Report',                   // contentTypeをLaboratory Reportにする
        context: {
            issuedId: uuid.v4(),                            // 検査依頼ID
            issuedTime: nowAsDateTime(),                    // 受付日時 YYYY-MM-DDTHH:mm:ss 形式
            resultIssued: nowAsDateTime(),                  // 報告日時 YYYY-MM-DDTHH:mm:ss 形式
            resultStatus: '最終報告',                        // 報告状態 最終報告または検査中
            resultStatusCode: 'final',                      // 報告状態コード  検査中:mid  最終報告:final
            codeSystem: 'YBS_2016',                         // 検査コード体系名
            facilityName: simpleCreator.facilityName,       // 検査依頼施設名称
            facilityId: simpleCreator.facilityId,           // 検査依頼施設ID
            facilityIdType: 'JMARI',                        // 検査依頼施設IDタイプ
            laboratory: {                                    // 検査実施施設の情報
                id: '303030',                                // 施設で発番している代表のID
                idType: 'facility',                          // 施設で付番されているIDであることを示す
                kanjiName: '石山 由美子',                      // 施設の代表（kanjiName、kanaName、romanNameのどれか一つは必須）代表とは?
                facilityId: '1.2.3.4.5.6.7890.1.2',          // 施設のID プロジェクトから指定
                facilityIdType: 'OID',                       // MML0027を使用 プロジェクトから指定
                facilityName: 'ベイサイド・ラボ',               // 施設の名称
                facilityZipCode: '231-0000',                 // 施設の郵便番号
                facilityAddress: '横浜市中区スタジアム付近 1-5', // 施設の住所
                facilityPhone: '045-000-0072',               // 施設の電話
                license: 'lab'                               // MML0026を使用（オプション）
            }
        }
    };
    if (appCtx.test_results.length > 0) {
        laboratoryTest.testResult = appCtx.test_results;
        callback(laboratoryTest);
    } else {
        // 検査結果ファイルを読み込んで
        var xhr = new XMLHttpRequest();
        xhr.open("GET", '/test_result.csv', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status/100 === 2) {
                // 検査結果オブジェクトを生成する
                var items = createTestItems(xhr.responseText);
                items.forEach (function (entry) {
                    appCtx.test_results.push(entry);
                });
                laboratoryTest.testResult = appCtx.test_results;
                callback(laboratoryTest);
            }
        };
        xhr.send();
    }
};

// Vital Sign サンプル
var simpleVitalSign = function () {
    var vitalSign = {
        contentType: 'Vital Sign',                              // contentTypeをVital Signにする
        context: {                                              // バイタルサインが計測された時のコンテキスト（オプション）
            observer: '花田 綾子'                                // バイタルサインを計測した人（オプション）
        },
        item: [],                                               // 計測項目の配列
        observedTime: nowAsDateTime(),                          // バイタルサインを観察した時間 YYYY-MM-DDTHH:mm:ss 形式
        protocol: {                                             // バイタルサインの測定方法を記載する親エレメント（オプション）
            position: 'sitting',                                // バイタルサインを測定した時の体位 mmlVs03を使用（オプション）
            device: 'Apple Watch',                              // バイタルサインの測定に使用した機材、デバイス。聴診器、水銀柱血圧計、機械式血圧計、動脈内プローベなど。（オプション）
            bodyLocation: '右腕'                                 // バイタルサインを測定した身体の部位。右上腕、左下腿など（オプション）
        }
    };
    // 収縮期血圧
    vitalSign.item.push({
        itemName: 'Systolic blood pressure',                    // バイタルサイン項目 mmlVs01を使用
        numValue: 135,                                          // 値
        unit: 'mmHg'                                            // 単位 mmlVs02を使用
    });
    // 拡張期血圧
    vitalSign.item.push({
        itemName: 'Diastolic blood pressure',                   // バイタルサイン項目 mmlVs01を使用
        numValue: 80,                                           // 値
        unit: 'mmHg'                                            // 単位 mmlVs02を使用
    });
    return vitalSign;
};

// 生活習慣
var simpleLifestyle = {
    occupation: '会社員',
    tobacco: '吸わない',
    alcohol: 'Beer 350ml/日',
    other: 'ウォーキング'
};

// 基礎的診療情報
var simpleBaseClinic = {                                    // 基礎的診療情報
    allergy: [],                                            // アレルギー情報 ? [allergyItem]
    bloodtype: {
        abo: 'a',                                           // ABO 式血液型 MML0018
        rh: 'rhD+'                                          // Rho(D) 式血液型 ? MML0019
    }
    // infection: []                                        // 感染性情報 ? [infectionItem]
};
var allergyItem = {
    factor: 'crab',                                         // アレルギー原因
    severity: 'mild',                                       // アレルギー反応程度 ? MML0017
    identifiedDate: 'since almost 20 years ago',            // アレルギー同定日 ?
    memo: 'no reaction to shrimp'                           // アレルギーメモ ?
};
simpleBaseClinic.allergy.push(allergyItem);

// 初診時特有情報
var simpleFirstClinic = {                                   // 初診時特有情報
    contentType: 'firstClinic',
    familyHistory: [],                                      // 家族歴情報 ? [familyHistoryItem]
    childhood: {},                                          // 小児期情報 ?
    pastHistory: {},                                        // 既往歴情報 ?
    chiefComplaints: '頭痛',                                    // 主訴 ?
    presentIllnessNotes: '2週間前より一日に数回側頭部から頭頂部にかけてのずきずきする痛みがあり。' // 現病歴自由記載 ?
};

var familyHistoryItem = {
    relation: 'motherInLaw',                                // 続柄コード MML0020
    simpleDiagnosis: {
        contentType: 'Medical Diagnosis',                   // contentTypeをMedical Diagnosisにする
        diagnosis: 'gastric cancer',                        // 疾患名
        code: 'C169-.007',                                  // 疾患コード
        system: 'ICD10',                                    // 疾患コード体系名
        dateOfRemission: '1989-08-25',                      // 疾患終了日 YYYY-MM-DD 形式（オプション）
        outcome: 'died'                                     // 転帰 MML0016を使用（オプション）
    },
    age: 'P40Y'                                            // 家族の疾患時年齢 ?
};
simpleFirstClinic.familyHistory.push(familyHistoryItem);

var childhood = {                                           // 出生時情報
    birthInfo: {
        deliveryWeeks: 'P40W',                              // 分娩時週数 ? PnW
        deliveryMethod: 'cesarean section',                 // 分娩方法 ?
        bodyWeight: '3270',                                 // 出生時体重 ? g
        bodyHeight: '50'                                    // 出生時身長 ? cm
    },
    vaccination: []                                         // 予防接種情報 ? [vaccinationItem]
};

var vaccinationItem1 = {
    vaccine: 'polio',                                       // 接種ワクチン名
    injected: 'true',                                       // 実施状態．true：ワクチン接種，false：接種せず
    age: 'P6M',                                             // 接種時年齢 ? PnYnM 1歳6ヶ月=P1Y6M
    memo: 'first administration'                            // 実施時メモ ?
};
var vaccinationItem2 = {
    vaccine: 'polio',                                       // 接種ワクチン名
    injected: 'true',                                       // 実施状態．true：ワクチン接種，false：接種せず
    age: 'P1Y6M',                                           // 接種時年齢 ? PnYnM 1歳6ヶ月=P1Y6M
    memo: 'second administration'                           // 実施時メモ ?
};
childhood.vaccination.push(vaccinationItem1);
childhood.vaccination.push(vaccinationItem2);
simpleFirstClinic.childhood = childhood;

var pastHistory = {                                         // 既往歴情報 choice
    pastHistoryItem: []                                     // 時間表現併用 choice Not support
};

var pastHistoryItem1 = {
    timeExpression: '6 years old',                          // 時間表現
    eventExpression: appendectomy                           // 時間表現に対応するイベント表現 ? [string]
};
var pastHistoryItem2 = {
    timeExpression: '5 years ago (1994)',                   // 時間表現
    eventExpression: hypertension                           // 時間表現に対応するイベント表現 ? [string]
};
pastHistory.pastHistoryItem.push(pastHistoryItem1);
pastHistory.pastHistoryItem.push(pastHistoryItem2);
simpleFirstClinic.pastHistory = pastHistory;

// 手術記録











// 処方せんサンプルをPOSTする
var showPrescription = function () {
    // staffs
    var prescription = simplePrescription();    // 処方せん
    var confirmDate = nowAsDateTime();          // このMMLの確定日時 YYYY-MM-DDTHH:mm:ss
    var uid = uuid.v4();                        // MML文書の UUID
    var simpleComposition = {                   // POStする simpleComposition
        context: {                              // context: 処方された時の文脈
            uuid: uid,                          // UUID
            confirmDate: confirmDate,           // 確定日時 YYYY-MM-DDTHH:mm:ss
            patient: simplePatient,             // 対象患者
            creator: simpleCreator              // 担当医師
        },
        content: [prescription]                 // content: 臨床データの処方せん
    };
    // 表示
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
    arr.push('// 処方せん');
    arr.push('\n');
    arr.push('var simplePrescription = ');
    arr.push(prettyJSON(prescription));
    arr.push(';');
    arr.push('</pre>');
    var text = arr.join('');
    document.getElementById('simple_box').innerHTML = text;
    // POST する
    post(simpleComposition);
};

// 注射サンプルをPOSTする
var showInjection = function () {
    // staffs
    var injection = simpleInjection();          // 注射記録
    var confirmDate = nowAsDateTime();          // このMMLの確定日時 YYYY-MM-DDTHH:mm:ss
    var uid = uuid.v4();                        // MML文書の UUID
    var simpleComposition = {                   // POSTする simpleComposition
        context: {                              // context: 注射された時の文脈
            uuid: uid,                          // UUID
            confirmDate: confirmDate,           // 確定日時 YYYY-MM-DDTHH:mm:ss
            patient: simplePatient,             // 対象患者
            creator: simpleCreator              // 担当医師
        },
        content: [injection]                    // content: 臨床データの注射記録
    };
    // 表示
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
    arr.push('// 注射記録');
    arr.push('\n');
    arr.push('var simpleInjection = ');
    arr.push(prettyJSON(injection));
    arr.push(';');
    arr.push('</pre>');
    var text = arr.join('');
    document.getElementById('simple_box').innerHTML = text;
    // send する
    post(simpleComposition);
};

// 病名サンプルをPOSTする
var showDiagnosis = function () {
    // staffs
    var diagnosis = simpleDiagnosis();          // 病名
    var confirmDate = nowAsDateTime();          // 確定日時　YYYY-MM-DDTHH:mm:ss
    var uid = uuid.v4();                        // MML文書の UUID
    var simpleComposition = {                   // POSTする simpleComposition
        context: {                              // context: 病名確定時の文脈
            uuid: uid,                          // UUID
            confirmDate: confirmDate,           // 確定日時 YYYY-MM-DDTHH:mm:ss
            patient: simplePatient,             // 対象患者
            creator: simpleCreator              // 担当医師
        },
        content: [diagnosis]                    // content: 臨床データの病名
    };
    // 表示
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
    arr.push('// 病名');
    arr.push('\n');
    arr.push('var simpleDiagnosis = ');
    arr.push(prettyJSON(diagnosis));
    arr.push(';');
    arr.push('</pre>');
    var text = arr.join('');
    document.getElementById('simple_box').innerHTML = text;
    // POST する
    post(simpleComposition);
};

// 検査サンプルをPOSTする
var showLabTest = function () {

    simpleLabTest (function (simpleTest) {
        // staffs
        var confirmDate = simpleTest.context.resultIssued;  // 検体検査の場合、確定日は報告日 YYYY-MM-DDTHH:mm:ss に一致させる
        var uid = uuid.v4();                        // MML文書の UUID
        var simpleComposition = {                   // POSTする simpleComposition
            context: {                              // context: 検査結果確定時の文脈
                uuid: uid,                          // UUID
                confirmDate: confirmDate,           // 確定日時 YYYY-MM-DDTHH:mm:ss
                patient: simplePatient,             // 対象患者
                creator: simpleCreator              // 責任医師
            },
            content: [simpleTest]                   // content: 臨床データの検査結果
        };
        // 表示
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
        arr.push('// 検査');
        arr.push('\n');
        arr.push('var simpleTest = ');
        arr.push(prettyJSON(simpleTest));
        arr.push(';');
        arr.push('</pre>');
        var text = arr.join('');
        document.getElementById('simple_box').innerHTML = text;
        // POST する
        post(simpleComposition);
    });
};

// バイタルサイン サンプルをPOSTする
var showVitalSign = function () {
    // staffs
    var vitalSign = simpleVitalSign();          // バイタルサイン
    var confirmDate = nowAsDateTime();          // 確定日時　YYYY-MM-DDTHH:mm:ss
    var uid = uuid.v4();                        // MML文書の UUID
    var simpleComposition = {                   // POSTする simpleComposition
        context: {                              // context: バイタルサイン確定時の文脈
            uuid: uid,                          // UUID
            confirmDate: confirmDate,           // 確定日時 YYYY-MM-DDTHH:mm:ss
            patient: simplePatient,             // 対象患者
            creator: simpleCreator              // 責任医師
        },
        content: [vitalSign]                    // content: 臨床データのバイタルサイン
    };
    // 表示
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
    arr.push('// バイタルサイン');
    arr.push('\n');
    arr.push('var simpleVitalSign = ');
    arr.push(prettyJSON(vitalSign));
    arr.push(';');
    arr.push('</pre>');
    var text = arr.join('');
    document.getElementById('simple_box').innerHTML = text;
    // POST する
    post(simpleComposition);
};

// selectionが変更された
var changeModule = function (selection) {
    window[selection.value]();
};

// ページロード後にコールされる関数
var startApp = function () {
    // Access Tokenを取得し処方せんサンプルをpostする
    getAccessToken(function(err, token) {
        if (!err) {
            saveToken(token);
            showPrescription();
        }
    });
};
