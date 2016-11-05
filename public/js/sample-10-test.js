// 検査履歴情報
// ファイルコンテンツ(test_result.csv)から検査項目リストを生成する
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

// simpleTestを生成する
var createTest = function (callback) {

    // simpleTest
    var simpleTest = {
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
        simpleTest.testResult = appCtx.test_results;
        callback(simpleTest);
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
                simpleTest.testResult = appCtx.test_results;
                callback(simpleTest);
            }
        };
        xhr.send();
    }
};

// 検査履歴情報
var postTest = function (callback) {

    // callback で受け取る
    createTest(function (simpleTest) {

        // コンポジションを生成する
        // 検体検査の場合、確定日は報告日 YYYY-MM-DDTHH:mm:ss に一致させる
        var confirmDate = simpleTest.context.resultIssued;
        var uuid = window.uuid.v4();                // MML文書の UUID
        var simpleComposition = {                   // POSTする simpleComposition
            context: {                              // context: 検査結果確定時の文脈
                uuid: uuid,                         // UUID
                confirmDate: confirmDate,           // 確定日時 YYYY-MM-DDTHH:mm:ss
                patient: simplePatient,             // 対象患者
                creator: simpleCreator,             // 責任医師
                accessRight: simpleRight            // アクセス権
            },
            content: [simpleTest]                   // content: 臨床データ=検査結果
        };

        // POST
        post('test', simpleComposition, function (err, mml) {
            // コールバック
            callback(err, simpleTest, mml);
        });
    });
};
