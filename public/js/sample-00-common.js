//
// サンプルプログラムで共通に使用するオブジェクトのリテラル及び関数
//

//------------------------------------------------------------------------------
// 病院情報 => MMLでは Facility（施設）と称す
//------------------------------------------------------------------------------
var simpleFacility = {
    id: '1.2.840.114319.5.1000.1.26.1',         // 施設ID プロジェクトから指定される
    name: 'シルク病院',                           // 施設名
    zipCode: '231-0023',                        // 郵便番号
    address: '横浜市中区山下町1番地 8-9-01',        // 住所
    telephone: '045-571-6572'                   // 電話番号
};

//------------------------------------------------------------------------------
// 診療科 内科の例
//------------------------------------------------------------------------------
var simpleInternalDept = {
    id: '01',                                   // 診療科ID 病院で発番したもの
    name: '第一内科'                             // 診療科名称 病院で決めた名称
};

//------------------------------------------------------------------------------
// 放射線科の例 報告書の医師に適用する
//------------------------------------------------------------------------------
var simpleRadiologyDept  = {
    id: '30',                                   // 診療科ID 病院で発番したもの
    name: '放射線科'                             // 診療科名称 病院で決めた名称
};

//------------------------------------------------------------------------------
// creator => 記録の確定責任者である （主治医、担当医、責任医師）
//------------------------------------------------------------------------------
var simpleCreator = {
    id: '201605',                                // 医師ID 病院で発番したもの
    fullName: '青山 慶二',                        // 医師名
    license: 'doctor',                           // 医療資格 MML0026を使用
    department: simpleInternalDept               // 診療科（オプション）
};

//------------------------------------------------------------------------------
// 執刀医 手術記録で使用 => 後述の asSurgicalStaff を適用する
//------------------------------------------------------------------------------
var simpleOperator = {
    id: '201800',                              // 医師ID 病院で発番したもの
    fullName: '本庄 里子',                       // 医師名
    license: 'doctor'                          // 医療資格 MML0026を使用
};

//------------------------------------------------------------------------------
// 麻酔医 手術記録で使用 => 後述の asSurgicalStaff を適用する
//------------------------------------------------------------------------------
var simpleAnesthesiologist = {
    id: '201900',                              // 医師ID 病院で発番したもの
    fullName: '鈴木 翔平',                       // 医師名
    license: 'doctor'                          // 医療資格 MML0026を使用
};

//------------------------------------------------------------------------------
// 報告書作成者 => 報告書の creator である
//------------------------------------------------------------------------------
var simpleReporter = {
    id: '301604',                               // 医師ID 病院で発番したもの
    fullName: '菊池 誠也',                       // 医師名
    license: 'doctor',                          // 医療資格 MML0026を使用
    department: simpleRadiologyDept             // 診療科（オプション）
};

//------------------------------------------------------------------------------
// 検体検施設の情報　検歴で使用
//------------------------------------------------------------------------------
var simpleLaboratory = {
    id: '1.2.840.114319.5.1000.1.27.500',      // 施設ID プロジェクトから指定される
    name: 'ベイサイド・ラボ',                     // 施設名
    zipCode: '231-0000',                       // 郵便番号
    address: '横浜市日本大通り付近 1-5',           // 住所
    telephone: '045-571-6572'                  // 電話番号
};

//------------------------------------------------------------------------------
// 検査施設の代表 => 検歴情報の creator である
//------------------------------------------------------------------------------
var simpleLabTester = {
    id: '301604',                               // 検査施設代表のID 施設で発番したもの
    fullName: '石山 由美子',                      // 代表者指名
    license: 'other'                            // 医療資格 MML0026を使用
};

//------------------------------------------------------------------------------
// 職員に施設情報を設定するユーティリティ => プロジェクトでは必ず施設情報が必要である
// staff: 医師、看護師等の基本情報
//------------------------------------------------------------------------------
var asFacilityStaff = function (staff) {
    // 報告書の相談をする側のスタッフ、実施者に適用する
    var ourStaff = {
        id: staff.id,
        fullName: staff.fullName
    };
    // 医療資格 => APIでは推奨するが MML規格では採用されない
    if (staff.license !== null) {
        ourStaff.license = staff.license;
    }
    // 自施設情報を設定する 必須
    ourStaff.facility = simpleFacility;

    // 診療科情報は設定しない（MML4.1 XSDとの整合を取るため）

    return ourStaff;
};

//------------------------------------------------------------------------------
// 手術スタッフの役割を生成するユーティリティ
// staff: 医師、看護師等の基本的職員情報
// role: 執刀医、手術助手、麻酔医、器械だし看護師、等の役割 MML0022, MML0023
//------------------------------------------------------------------------------
var asSurgicalStaff = function (staff, role) {
    // 自施設情報を設定する
    var staffInfo = asFacilityStaff(staff);
    // 手術スタッフの形式で返す
    var staff = {
        staffClass: role,
        staffInfo: staffInfo
    };
    return staff;
};

//------------------------------------------------------------------------------
// 患者 日本人
//------------------------------------------------------------------------------
var simplePatient = {
    id: '0516',                                 // 患者ID 病院で発番したもの
    fullName: '宮田 奈々',                        // 漢字のフルネーム 区切り文字は全角/半角のスペース
    kana: 'ミヤタ ナナ',                          // カナ 名寄せのため必須　区切り文字は同上
    gender: 'female',                           // 性別 MML0010を使用 (女:female 男:male その他:other 不明:unknown)
    dateOfBirth: '1994-11-26'                   // 生年月日 YYYY-MM-DD 形式
};

//------------------------------------------------------------------------------
// 患者 外国人
// ファミリーネーム(姓)とギブンネーム(名)は、頭文字を大文字で他は小文字とする
// ミドルネームを文化的に記載する場合は頭文字のみとする
// 語順は、ギブンネーム(名) ミドルネーム ファミリーネーム(姓)とする
//------------------------------------------------------------------------------
var simpleOverseasPatient = {
    id: '0800',                                 // 患者ID 病院で発番したもの
    fullName: 'James F Brown',                  // フルネームで全角文字 区切り文字は全角/半角のスペース
    kana: '゙ジェームス エフ ブラウン',               // カナ 名寄せのため必須 区切り文字は同上
    gender: 'male',                             // 性別 MML0010を使用 (女:female 男:male その他:other 不明:unknown)
    dateOfBirth: '1984-03-10'                   // 生年月日 YYYY-MM-DD 形式
};

//------------------------------------------------------------------------------
// アクセス権 => 千年カルテに送信後のデータのアクセス権限である
// 患者、記載者施設（診察した病院）、診療歴のある病院（患者がかかった事がある病院）について設定する
//------------------------------------------------------------------------------
var simpleRight = {
    // 情報毎に、病院の意向、ポリシーを聞いて設定すること 例）病名は患者には見せない、他は可 等
    // プロジェクトでは下記の設定を推奨
    patient: 'read',                             // 患者のアクセス権 参照可能
    creator: 'all',                              // 記載者施設と称すのアクセス権 参照、修正、削除が可能
    experience: 'read'                           // 診療歴のある病院 参照可能
};

//------------------------------------------------------------------------------
// 月や時間を二桁で設定するため、左にゼロをパッドする
//------------------------------------------------------------------------------
var padZero = function (x) {
    if (x.toString().length < 2) {
        x = '0' + x;
    }
    return x;
};

//------------------------------------------------------------------------------
// 日時を YYYY-MM-DDTHH:mm:ss ISO8601 形式の文字列にして返す
//------------------------------------------------------------------------------
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

//------------------------------------------------------------------------------
// 日付を YYYY-MM-DD 形式の文字列にして返す
//------------------------------------------------------------------------------
var dateAsString = function (date) {
    var yyyy = date.getFullYear();
    var MM = padZero(date.getMonth() + 1);
    var DD = padZero(date.getDate());
    // 連結
    var arr = [yyyy, '-', MM, '-', DD];
    return arr.join('');
};

//------------------------------------------------------------------------------
// 日数を継続表現で返す => P + 日数 + D
//------------------------------------------------------------------------------
var daysAsDuration = function (days) {
    return 'P' + days + 'D';
};

//------------------------------------------------------------------------------
// 時間を継続表現で返す => P + 時間 + H + 分 + D
//------------------------------------------------------------------------------
var timesAsDuration = function (hour, minuets) {
    var arr = ['PT'];
    if (hour !== null) {
        arr.push(hour);
        arr.push('H');
    }
    if (minuets !== null) {
        arr.push(minuets);
        arr.push('M');
    }
    return arr.join('');
};

//------------------------------------------------------------------------------
// 記録の確定日時 => カルテが確定された日時、報告書が確定された日時、検体検査が報告された日時等
// YYYY-MM-DD'T'HH:mm:ss ISO8601 形式
//------------------------------------------------------------------------------
var confirmDate = function () {
    // サンプルでは現在時刻とする
    return dateAsTimeStamp(new Date());
};

//------------------------------------------------------------------------------
// UUID => 送信データ simpleComposition を一意に識別するため必須
//------------------------------------------------------------------------------
var generateUUID = function () {
    // サンプルでは /public/js/uuid.js を使用する
    // UUIの例 570818C7-E921-469E-802C-3EE03DDD3EAB
    var aUUID = window.uuid.v4();
    return aUUID;
};

//------------------------------------------------------------------------------
// 外部参照ファイル => 報告書、手術記録、臨床サマリ等で使用される extRef
// ファイルのコンテンツをBase64で返す => URLセーフにしない、76文字毎に改行しない
//------------------------------------------------------------------------------
var fileAsBase64 = function (path) {
    // ファイルの内容をバイナリーデータとして読み込みBase64にエンコードして返す
    // JavaScriptの例
    // var binary = fs.readFileSync(path);
    // return new Buffer(binary).toString('base64');
    return null;    // サンプルではnullを返す
};

//------------------------------------------------------------------------------
// Access Tokenを保存しておく変数
//------------------------------------------------------------------------------
var appCtx = {
    access_token: '',           // アクセストークン
    expires_in: 0               // トークンの有効期間（秒）このデモでは使用しない
};

//------------------------------------------------------------------------------
// Access Token 取得後にコールされる関数
//------------------------------------------------------------------------------
var saveToken = function (token) {
    // tokenをappCtxに保存
    appCtx.access_token = token.access_token;
    appCtx.expires_in = token.expires_in;
};

//------------------------------------------------------------------------------
// Access Token 取得する
// Client Credentials Grant flow of the OAuth 2 specification
// https://tools.ietf.org/html/rfc6749#section-4.4
//------------------------------------------------------------------------------
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
    // xhr.open('POST', '/mml/api/v1/oauth2/token', true);
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
            if (xhr.status === 200) {
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
                    callback(new Error('Unexpected server response'));
                }
            } else if (xhr.status === 400 || xhr.status === 401) {
                // 400: invalid request
                // Authorization ヘッダーの設定誤り
                // Content-typeの誤り
                // ボディにgrant_type=client_credentials がセットされていない
                // 上記がURLエンコードされていない
                // 401: invalid client
                // consumerKey または secretの誤り
                var parsed = JSON.parse(xhr.responseText);
                var cbError = new Error(parsed.error);
                cbError.status = xhr.status;
                callback(cbError);
            } else {
                // Internal Server error 等
                var e = new Error('Unexpected server response');
                e.status = xhr.status;
                callback(e);
            }
        }
    };
    xhr.send(postString);
};

//------------------------------------------------------------------------------
// 1000-builderへsimpleCompositionをポストする
//------------------------------------------------------------------------------
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
                callback(null, parsed.result.mml);
                // callback(null, parsed.result);

            } else if (xhr.status === 400 || xhr.status === 401) {
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
                // status = 500 etc.
                // simpleCompositionに誤りがある
                // POST パラメータの設定間違い
                var errMsg = null;
                try {
                    var ret = JSON.parse(xhr.responseText);
                    errMsg = ret.error;
                } catch (e) {
                    errMsg = e.message;
                }
                var cbError = new Error(errMsg);
                cbError.status = xhr.status;
                callback(cbError, null);
            }
        }
    };
    xhr.send(JSON.stringify(simpleComposition));
};


//------------------------------------------------------------------------------
// RPC バージョン
// jsonRpcオブジェクトを/mml/rpc/v1へPOSTする
//------------------------------------------------------------------------------
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
                    // エラー RPC の場合
                    callback(parsed.error.message, null);
                } else {
                    // 生成されたMMLをコールバックする
                    callback(null, parsed.result.mml);
                }

            } else if (xhr.status === 400 || xhr.status === 401) {
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
