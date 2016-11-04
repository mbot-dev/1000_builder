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
};

//------------------------------------------------------------------
// Access Token 取得する
// Client Credentials Grant flow of the OAuth 2 specification
// https://tools.ietf.org/html/rfc6749#section-4.4
//------------------------------------------------------------------
var getAccessToken = function (callback) {

    // HTTPクライアント
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
                    // token_type が 'bearer' であることを確認
                    // tokenを保存してコールバック
                    saveToken(parsed);
                    callback(null);
                } else {
                    var e = new Error('Unexpected server response');
                    // alert(e);
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

    // HTTPクライアント
    var xhr = new XMLHttpRequest();

    // ポスト先 /mml/api/v1/contentType
    xhr.open('POST', '/mml/api/v1/' + contentType, true);

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
                callback(null, parsed.mml);

            } else if (xhr.status > 399 && xhr.status < 500) {
                // status = 400 | 401
                // access tokenが失効しているか不正な場合
                // Authorization に Bearer token がセットされていない
                // Tokenを再取得する
                getAccessToken(function (err) {
                    if (!err) {
                        // 再帰する
                        post(contentType, simpleComposition, callback);
                    }
                });
            } else {
                // simpleCompositionに誤りがある
                // alert(new Error(xhr.status));
                callback(new Error(xhr.status), null);
            }
        }
    };
    xhr.send(JSON.stringify(simpleComposition));
};

// 患者
var simplePatient = {
    id: '0516',                                        // 患者ID
    facilityId: '1.2.840.114319.5.1000.1.26.1',        // 医療連携用の施設IDでプロジェクトから指定される
    kanjiName: '宮田 奈々',                             // 漢字の氏名（氏名は漢字、カナ、ローマ字のどれか一つ必須）
    kanaName: 'ミヤタ ナナ',                             // カナの氏名（同上）
    gender: 'female',                                  // 性別 MML0010を使用 (女:female 男:male その他:other 不明:unknown)
    dateOfBirth: '1994-11-26',                         // 生年月日 YYYY-MM-DD 形式
};

// 医師等
var simpleCreator = {
    id: '201605',                                      // 医師のID
    kanjiName: '青山 慶二',                             // 医師名（kanjiName、kanaName、romanNameのどれか一つ必須）
    prefix: 'Professor',                               // 肩書き等（オプション）
    degree: 'MD/PhD',                                  // 学位（オプション）
    facilityId: '1.2.840.114319.5.1000.1.26.1',        // 医療連携用の施設ID プロジェクトから指定される
    facilityName: 'シルク内科',                          // 施設名
    facilityZipCode: '231-0023',                       // 施設郵便番号
    facilityAddress: '横浜市中区山下町1番地 8-9-01',      // 施設住所
    facilityPhone: '045-571-6572',                     // 施設電話番号
    departmentId: '01',                                // 医科用の場合は MML0028、歯科用の場合は MML0030 から選ぶ（オプション）
    departmentName: '第一内科',                         // 診療科名（オプション）
    license: 'doctor'                                  // 医療資格 MML0026を使用（オプション）
};

// アクセス権
var simpleRight = {
    patient: 'read',
    creator: 'all',
    experience: 'read'
};
