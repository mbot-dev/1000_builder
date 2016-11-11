//
// サンプルプログラムで共通に使用するオブジェクト
//

//------------------------------------------------------------------
// 患者
//------------------------------------------------------------------
var simplePatient = {
    id: '0516',                                        // 患者ID
    facilityId: '1.2.840.114319.5.1000.1.26.1',        // 医療連携用の施設IDでプロジェクトから指定される
    kanjiName: '宮田 奈々',                             // 漢字の氏名
    kanaName: 'ミヤタ ナナ',                             // カナの氏名 （名寄せのため 必須）
    gender: 'female',                                  // 性別 MML0010を使用 (女:female 男:male その他:other 不明:unknown)
    dateOfBirth: '1994-11-26'                          // 生年月日 YYYY-MM-DD 形式
};

//------------------------------------------------------------------
// 医師（主治医、担当医、責任医師）
//------------------------------------------------------------------
var simpleCreator = {
    id: '201605',                                      // 医師のID
    kanjiName: '青山 慶二',                             // 医師名（kanjiName、kanaName、romanNameのどれか一つ必須）
    facilityId: '1.2.840.114319.5.1000.1.26.1',        // 医療連携用の施設ID プロジェクトから指定される
    facilityName: 'シルク内科',                          // 施設名
    facilityZipCode: '231-0023',                       // 施設郵便番号
    facilityAddress: '横浜市中区山下町1番地 8-9-01',      // 施設住所
    facilityPhone: '045-571-6572',                     // 施設電話番号
    departmentId: '01',                                // 医科用の場合は MML0028、歯科用の場合は MML0030 から選ぶ（オプション）
    departmentName: '第一内科',                         // 診療科名（オプション）
    license: 'doctor'                                  // 医療資格 MML0026を使用（オプション）
};

//------------------------------------------------------------------
// 報告書作成者 sampleReport で使用
//------------------------------------------------------------------
var simpleReporter = {
    id: '301604',                                      // 医師のID
    kanjiName: '大谷 誠也',                             // 医師名（kanjiName、kanaName、romanNameのどれか一つ必須）
    facilityId: '1.2.840.114319.5.1000.1.26.1',        // 医療連携用の施設ID プロジェクトから指定される
    facilityName: 'シルク内科',                          // 施設名
    facilityZipCode: '231-0023',                       // 施設郵便番号
    facilityAddress: '横浜市中区山下町1番地 8-9-01',      // 施設住所
    facilityPhone: '045-571-6572',                     // 施設電話番号
    departmentId: '01',                                // 医科用の場合は MML0028、歯科用の場合は MML0030 から選ぶ（オプション）
    departmentName: '放射線科',                         // 診療科名（オプション）
    license: 'doctor'                                  // 医療資格 MML0026を使用（オプション）
};

//------------------------------------------------------------------
// 検体検査実施施設の代表 sampleTest で使用
//------------------------------------------------------------------
var simpleTester = {
    id: '301604',                                      // 医師のID
    kanjiName: '石山 由美子',                            // 医師名（kanjiName、kanaName、romanNameのどれか一つ必須）
    facilityId: '1.2.840.114319.5.1000.1.27.500',      // 医療連携用の施設ID プロジェクトから指定される
    facilityName: 'ベイサイド・ラボ',                     // 施設名
    facilityZipCode: '231-0000',                       // 施設郵便番号
    facilityAddress: '横浜市日本大通り付近 1-5',           // 施設住所
    facilityPhone: '045-571-6572',                     // 施設電話番号
    license: 'lab'                                     // 医療資格 MML0026を使用（オプション）
};

//------------------------------------------------------------------
// アクセス権　プロジェクトでは下記の設定を推奨
//------------------------------------------------------------------
var simpleRight = {
    patient: 'read',                                   // 患者のアクセス権 参照可能
    creator: 'all',                                    // 診察した病院（記載者施設と称す）のアクセス権 参照、修正、削除が可能
    experience: 'read'                                 // 診療歴のある病院（患者がかかった事がある病院） 参照可能
};

//------------------------------------------------------------------
// 時間関係のユーティリティ
//------------------------------------------------------------------
var padZero = function (x) {
    if (x.toString().length < 2) {
        x = '0' + x;
    }
    return x;
};
// YYYY-MM-DDTHH:mm:ss 形式の文字列にして返す
var dateAsTimeStamp = function (date) {
    var yyyy = date.getFullYear();
    var MM = padZero(date.getMonth() + 1);
    var DD = padZero(date.getDate());
    var HH = padZero(date.getHours());
    var mm = padZero(date.getMinutes());
    var ss = padZero(date.getSeconds());
    // 連結
    var arr = [yyyy, '-', MM, '-', DD, 'T', HH, ':', mm, ':', ss];
    return arr.join('');
};
// YYYY-MM-DD 形式の文字列にして返す
var dateAsString = function (date) {
    var yyyy = date.getFullYear();
    var MM = padZero(date.getMonth() + 1);
    var DD = padZero(date.getDate());
    // 連結
    var arr = [yyyy, '-', MM, '-', DD];
    return arr.join('');
};

//------------------------------------------------------------------
// 確定日
//------------------------------------------------------------------
var confirmDate = function () {
    // 医学イベント（カルテ等）の確定日時を YYYY-MM-DDTHH:mm:ss の形式で返す
    // サンプルコードでは現在時刻を使用する
    return dateAsTimeStamp(new Date());
};

//------------------------------------------------------------------
// uuid
//------------------------------------------------------------------
var generateUUID = function () {
    // 各処理系でUUIDを生成する ex. 570818C7-E921-469E-802C-3EE03DDD3EAB
    var aUUID = window.uuid.v4();
    return aUUID;
};

//------------------------------------------------------------------
// ファイルのコンテンツをBase64で返す
//------------------------------------------------------------------
var fileAsBase64 = function (path) {
    // ファイルの内容をバイナリーデータとして読み込みBase64にエンコードして返す
    // JavaScriptの例
    // var binary = fs.readFileSync(path);
    // return new Buffer(binary).toString('base64');
    // サンプルではnullを返す
    return null;
};

//------------------------------------------------------------------
// Access Tokenを保存しておく変数
//------------------------------------------------------------------
var appCtx = {
    access_token: '',           // アクセストークン
    expires_in: 0               // トークンの有効期間（秒）このデモでは使用しない
};

//------------------------------------------------------------------
// Access Token 取得後にコールされる関数
//------------------------------------------------------------------
var saveToken = function (token) {
    // tokenをappCtxに保存
    appCtx.access_token = token.access_token;
    appCtx.expires_in = token.expires_in;
};

//------------------------------------------------------------------
// Access Token 取得する
// Client Credentials Grant flow of the OAuth 2 specification
// https://tools.ietf.org/html/rfc6749#section-4.4
//------------------------------------------------------------------
var getAccessToken = function (callback) {

    // JavaScript HTTPクライアント
    var xhr = new XMLHttpRequest();

    // プロジェクトから支給された consumer key（デモ用）
    var consumerKey = '2a1ecdd5-a1ec-4226-aaac-e42b8d602c1e';

    // プロジェクトから支給された secret（デモ用）
    var secret = '5dbe45c15f68209ff401e1e218639c25e86067bb7d11438d9ca343681b1cc141';

    // 上記二つをコロンで連結し base64 でエンコードする
    var base64 = btoa(consumerKey + ':'　+　secret);

    // ポスト先は /mml/api/v1/oauth2/token
    xhr.open('POST', '/mml/api/v1/oauth2/token', true);

    // 認証用の HTTP Header をセットする
    // 'Basic' + 半角スペース + base64 で連結する
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
                // HTTP Status が 200 => 正常取得できた場合
                // レスポンステキストをパースしてJSONに変換する
                // 結果は {token_type: 'bearer', access_token: 発行されたトークン, expires_in: '有効期間秒}
                var parsed = JSON.parse(xhr.responseText);
                // token_type が 'bearer' であることを確認
                if (parsed.token_type === 'bearer' && parsed.hasOwnProperty('access_token')) {
                    // tokenを保存
                    saveToken(parsed);
                    // コールバック null = No error
                    callback(null);
                } else {
                    var e = new Error('Unexpected server response');
                    callback(e);
                }
            } else {
                // status !== 200 原因
                // consumerKey または secretの誤り
                // Authorization ヘッダーの誤り
                // Content-typeの誤り
                // grant_type=client_credentials がセットされていない
                // 戻り値 {error: invalid_request(400) | invalid_client(401)}
                var err = JSON.parse(xhr.responseText);
                callback(err);
            }
        }
    };
    xhr.send(postString);
};

//------------------------------------------------------------------
// 1000-builderへsimpleCompositionをポストする
//------------------------------------------------------------------
var post = function (contentType, simpleComposition, callback) {

    // JavaScript HTTPクライアント
    var xhr = new XMLHttpRequest();

    // ポスト先 /mml/api/v1/contentType
    xhr.open('POST', '/mml/api/v1/' + contentType, true);

    // Authorizationヘッダーを Bearer access_token にセットする
    // 'Bearer' + 半角スペース + アクセストークン で連結する
    xhr.setRequestHeader('Authorization', 'Bearer ' + appCtx.access_token);

    // contentType = application/json
    xhr.setRequestHeader('Content-type', 'application/json');

    // Event listener XMLHttpRequest固有
    xhr.onreadystatechange = function () {

        if (xhr.readyState === 4) {

            // レスポンスを調べる
            if (xhr.status > 199 && xhr.status < 300) {
                // response = 200, responseからJSONを生成する
                var parsed = JSON.parse(xhr.responseText);
                if (parsed.error) {
                    // エラー
                    callback(parsed.error.message, null);
                } else {
                    // 生成されたMMLをコールバックする
                    callback(null, parsed.result.mml);
                }

            } else if (xhr.status > 399 && xhr.status < 500) {
                // status = 400 | 401
                // access tokenが失効しているか不正な場合
                // Authorization に Bearer token がセットされていない
                // Tokenを再取得する
                getAccessToken(function (err) {
                    if (err) {
                        // トークンの取得に失敗
                        callback(err, null);
                    } else {
                        // 再帰する => 再度ポスト
                        post(contentType, simpleComposition, callback);
                    }
                });
            } else {
                // simpleCompositionに誤りがある
                // status = 500
                callback(new Error(xhr.status), null);
            }
        }
    };
    xhr.send(JSON.stringify(simpleComposition));
};


//------------------------------------------------------------------
// RPC バージョン
// jsonRpcオブジェクトを/mml/rpc/v1へPOSTする
//------------------------------------------------------------------
var rpc = function (simpleComposition, callback) {

    // JSON-RPC 2.0
    var jsonRpc = {
        jsonrpc: '2.0',
        method: 'build',
        params: [simpleComposition],
        id: simpleComposition.context.uuid
    };

    // JavaScript HTTPクライアント
    var xhr = new XMLHttpRequest();

    // ポスト先 /mml/rpc/v1
    xhr.open('POST', '/mml/rpc/v1', true);

    // Authorizationヘッダーを Bearer access_token にセットする
    // 'Bearer' + 半角スペース + アクセストークン で連結する
    xhr.setRequestHeader('Authorization', 'Bearer ' + appCtx.access_token);

    // contentType = application/json
    xhr.setRequestHeader('Content-type', 'application/json');

    // Event listener XMLHttpRequest固有
    xhr.onreadystatechange = function () {

        if (xhr.readyState === 4) {

            // レスポンスを調べる
            if (xhr.status > 199 && xhr.status < 300) {
                // response = 200, responseからJSONを生成する
                var parsed = JSON.parse(xhr.responseText);
                if (parsed.error) {
                    // エラー
                    callback(parsed.error.message, null);
                } else {
                    // 生成されたMMLをコールバックする
                    callback(null, parsed.result.mml);
                }

            } else if (xhr.status > 399 && xhr.status < 500) {
                // status = 400 | 401
                // access tokenが失効しているか不正な場合
                // Authorization に Bearer token がセットされていない
                // Tokenを再取得する
                getAccessToken(function (err) {
                    if (err) {
                        // トークンの取得に失敗
                        callback(err, null);
                    } else {
                        // 再帰する => 再度ポスト
                        rpc(simpleComposition, callback);
                    }
                });
            } else {
                // simpleCompositionに誤りがある
                // status = 500
                callback(new Error(xhr.status), null);
            }
        }
    };
    xhr.send(JSON.stringify(jsonRpc));
};
