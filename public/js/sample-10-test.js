// 検査履歴情報

// デモ固有で検査結果を格納する配列
var test_results = [];

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

    // デモ設定 現在時刻を報告日時とする
    var now = new Date();
    var resultTimestamp = dateAsTimeStamp(now);
    // ５時間前を受付時刻とする
    now.setHours(now.getHours() -5);
    var issuedTimestamp = dateAsTimeStamp(now);

    // simpleTest
    var simpleTest = {
        context: {
            issuedId: generateUUID(),                       // 検査依頼ID
            issuedTime: issuedTimestamp,                    // 受付日時 YYYY-MM-DDTHH:mm:ss 形式
            resultIssued: resultTimestamp,                  // 報告日時 YYYY-MM-DDTHH:mm:ss 形式
            resultStatus: '最終報告',                        // 報告状態 最終報告または検査中
            resultStatusCode: 'final',                      // 報告状態コード  検査中:mid  最終報告:final
            codeSystem: 'YBS_2016',                         // 検査コード体系名
            facilityName: simpleCreator.facilityName,       // 検査依頼施設名称
            facilityId: simpleCreator.facilityId,           // 検査依頼施設ID
            facilityIdType: 'JMARI',                        // 検査依頼施設IDタイプ
            laboratory: simpleTester                        // 検査実施施設の代表（sample-commonで定義）
        }
    };
    if (test_results.length > 0) {
        simpleTest.testResult = test_results;
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
                    test_results.push(entry);
                });
                simpleTest.testResult = test_results;
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

        //-----------------------------------------------------------------------
        // 検体検査の場合、確定日は報告日 YYYY-MM-DDTHH:mm:ss に一致させる
        // creator は検査を実施した施設の代表者とする => simpleTest.context.laboratory => simpleTester
        var testConfirmDate = simpleTest.context.resultIssued;
        //-----------------------------------------------------------------------
        // コンポジションを生成する
        var simpleComposition = {                   // POSTする simpleComposition
            context: {                              // context: 検査結果確定時の文脈
                uuid: generateUUID(),               // UUID
                confirmDate: testConfirmDate,       // 確定日時 YYYY-MM-DDTHH:mm:ss
                patient: simplePatient,             // 対象患者
                creator: simpleTester,              // 検査実施施設の代表者
                accessRight: simpleRight            // アクセス権
            },
            content: [simpleTest]                   // content: 臨床データ=検査結果
        };

        // POST
        post('test', simpleComposition, function (err, mml) {
            // コールバック
            callback(err, simpleComposition, mml);
        });
    });
};
