//
// サンプルプログラムで共通に使用するオブジェクトのリテラル及び関数
//

//------------------------------------------------------------------------------
// 病院情報
// MMLでは Facility（施設）と称す
// ID はプロジェクトから指定される
// 緊急連絡先、夜間受付、Fax 等は無視
//------------------------------------------------------------------------------
var simpleFacility = {
    id: '1.2.840.114319.5.1000.1.26.1',         // 施設ID プロジェクトから指定される
    name: 'シルク病院',                           // 施設名
    zipCode: '231-0023',                        // 郵便番号
    address: '横浜市中区山下町1番地 8-9-01',        // 住所
    telephone: '045-571-6572'                   // 電話番号
};

//------------------------------------------------------------------------------
// 内科の例
// 診療科名とIDは病院で決めたもの
//------------------------------------------------------------------------------
var simpleInternalDept = {
    id: '01',                          // 病院で決めている第一内科のID
    name: '第一内科'                    // 診療科名
};

//------------------------------------------------------------------------------
// 外科の例
// 診療科名とIDは病院で決めたもの
//------------------------------------------------------------------------------
var simpleSurgicalDept = {
    id: '10',                          // 病院で決めている外科のID
    name: '外科'                        // 診療科名
};

//------------------------------------------------------------------------------
// 放射線科の例
// 診療科名とIDは病院で決めたもの
//------------------------------------------------------------------------------
var simpleRadiologyDept  = {
    id: '30',                          // 病院で決めている放射線科科のID
    name: '放射線科科'                   // 診療科名
};

//------------------------------------------------------------------------------
// 医師（主治医、担当医、責任医師）
// 医師のIDは病院で決めたもの
// 性別、生年月日等は採用しない
// サンプルプログラムでは creator として使用する
//------------------------------------------------------------------------------
var simpleCreator = {
    id: '201605',                                // 医師のID
    fullName: '青山 慶二',                        // 医師名
    license: 'doctor',                           // 医療資格 MML0026を使用（オプション）
    department: simpleInternalDept               // 診療科
};

//------------------------------------------------------------------------------
// 執刀医 手術記録で使用
// 医師のIDは病院で決めたもの
// サンプルプログラムでは後述の asSurgicalStaff を適用して執刀医として使用する
//------------------------------------------------------------------------------
var simpleOperator = {
    id: '201800',                              // 医師のID
    fullName: '本庄 里子',                      // 医師名
    license: 'doctor',                         // 医療資格 MML0026を使用（オプション）
    department: simpleSurgicalDept             // 診療科
};

//------------------------------------------------------------------------------
// 麻酔医 手術記録で使用
// 医師のIDは病院で決めたもの
// サンプルプログラムでは後述の asSurgicalStaff を適用して麻酔医として使用する
//------------------------------------------------------------------------------
var simpleAnesthesiologist = {
    id: '201900',                              // 施設で付番されている医師のId
    fullName: '鈴木 翔平',                       // 医師名
    license: 'doctor'                          // 医療資格 MML0026を使用（オプション）
};

//------------------------------------------------------------------------------
// 報告書作成者　報告書で使用
// 医師のIDは病院で決めたもの
// 報告書の creator であり performer である
//------------------------------------------------------------------------------
var simpleReporter = {
    id: '301604',                               // 医師のID
    fullName: '菊池 誠也',                       // 医師名
    license: 'doctor',                          // 医療資格 MML0026を使用（オプション）
    department: simpleRadiologyDept             // 診療科
};

//------------------------------------------------------------------------------
// 検体検施設の情報　検歴で使用
// 施設のIDはプロジェクトから発番
//------------------------------------------------------------------------------
var simpleLaboratory = {
    id: '1.2.840.114319.5.1000.1.27.500',      // 医療連携用の施設ID プロジェクトから指定される
    name: 'ベイサイド・ラボ',                     // 施設名
    zipCode: '231-0000',                       // 施設郵便番号
    address: '横浜市日本大通り付近 1-5',           // 施設住所
    telephone: '045-571-6572'                  // 施設電話番号
};

//------------------------------------------------------------------------------
// 検査施設の代表
// 代表のIDは検査施設で決めているもの
// 検歴情報の creator である
//------------------------------------------------------------------------------
var simpleLabTester = {
    id: '301604',                               // 検査施設代表のID
    fullName: '石山 由美子',                      // 代表者
    license: 'other'                            // 医療資格 MML0026を使用（オプション）
};

//------------------------------------------------------------------------------
// 職員に施設情報を設定するユーティリティ
// プロジェクトでは必ず施設情報が必要である
// staff: 医師、看護師等の基本的職員情報
//------------------------------------------------------------------------------
var asFacilityStaff = function (staff) {
    // XSDではtable値しか受け取らないので診療科は落とす => 将来は変更の可能性あり
    var ourStaff = {
        id: staff.id,
        fullName: staff.fullName,
        facility: simpleFacility
    }
    return ourStaff;
}
// 報告書の相談をする側のスタッフ
var asConsulter = function (staff) {
    return asFacilityStaff(staff);
};
// 報告書の実施者
var asPerformer = function (staff) {
    return asFacilityStaff(staff);
};

//------------------------------------------------------------------------------
// 手術スタッフの役割を生成するユーティリティ
// staff: 医師、看護師等の基本的職員情報
// role: 執刀医、手術助手、麻酔医、器械だし看護師、等の役割 MML0022, MML0023
//------------------------------------------------------------------------------
var asSurgicalStaff = function (staff, role) {
    // 職員情報 医療資格は使用しない
    var staffInfo = asFacilityStaff(staff);

    // 手術スタッフの形式で返す
    var staff = {
        staffClass: role,
        staffInfo: staffInfo
    }
    return staff;
};

//------------------------------------------------------------------------------
// 患者 日本人
// 患者のIDは病院で発番したもの
// 人名表現形式としてフルネームを使用し、漢字を使用する
// カナは名寄せのため必須
// 氏名は姓名の順
// 姓と名の区切り文字は半角または全角のスペース
//------------------------------------------------------------------------------
var simplePatient = {
    id: '0516',                                 // 患者ID
    fullName: '宮田 奈々',                       // 漢字の氏名
    kana: 'ミヤタ ナナ',                          // カナの氏名
    gender: 'female',                           // 性別 MML0010を使用 (女:female 男:male その他:other 不明:unknown)
    dateOfBirth: '1994-11-26'                   // 生年月日 YYYY-MM-DD 形式
};

//------------------------------------------------------------------------------
// 患者 外国人
// 患者のIDは病院で発番したもの
// 人名表現形式としてフルネームを使用し、全角文字を使用する
// ファミリーネーム(姓)とギブンネーム(名)は、頭文字を大文字で他は小文字とする
// ミドルネームを文化的に記載する場合は頭文字のみとする
// 語順は、ギブンネーム(名) ミドルネーム ファミリーネーム(姓)とする
// カナは名寄せのため必須
// 名前の区切り文字は半角または全角のスペース
//------------------------------------------------------------------------------
var simpleOverseasPatient = {
    id: '0800',                                 // 患者ID
    fullName: 'James F Brown',                  // フルネームで全角文字
    kana: '゙ジェームス エフ ブラウン',               // カナの氏名 （名寄せのため 必須）
    gender: 'male',                             // 性別 MML0010を使用 (女:female 男:male その他:other 不明:unknown)
    dateOfBirth: '1984-03-10'                   // 生年月日 YYYY-MM-DD 形式
};

//------------------------------------------------------------------------------
// アクセス権
// 患者、記載者施設（診察した病院）、診療歴のある病院（患者がかかった事がある病院）について設定する
// プロジェクトでは下記の設定を推奨
// これはデフォルトの設定で、アクセス権が定義されていない時は自動で設定される
// 情報毎に、病院の意向、ポリシーを聞いて設定すること
// 例）病名は患者には見せない、他は可 等
//------------------------------------------------------------------------------
var simpleRight = {
    patient: 'read',                             // 患者のアクセス権 参照可能
    creator: 'all',                              // 記載者施設と称すのアクセス権 参照、修正、削除が可能
    experience: 'read'                           // 診療歴のある病院 参照可能
};

//------------------------------------------------------------------------------
// 時間関係のユーティリティ
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
    var arr = ['P'];
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
// 記録の確定日時
// カルテが確定された日時、報告書が確定された日時、検体検査が報告された日時等
// YYYY-MM-DD'T'HH:mm:ss ISO8601 形式
// MMLは文書をベースにしている => 記録の確定時が重要
// 医学イベントの発生日時ではない
// https://gist.github.com/dolphin-dev/c0d59774ecfbe47c0b3b　参照
//------------------------------------------------------------------------------
var confirmDate = function () {
    // サンプルでは現在時刻とする
    return dateAsTimeStamp(new Date());
};

//------------------------------------------------------------------------------
// UUID （Universary Unique Identifier）
// 各処理系でUUIDを生成する 例 570818C7-E921-469E-802C-3EE03DDD3EAB
// UUID は 2^122 = 5316911983139663491615228241121378304 ~ 10^36 通り
// 千年カルテ　10^3
// 太陽の寿命(年)　~ 10^10
// 地球上の全バクテリアの細胞数　~ 10^33
// 宇宙全体の原子数　~ 10^80
//------------------------------------------------------------------------------
var generateUUID = function () {
    var aUUID = window.uuid.v4();
    return aUUID;
};

//------------------------------------------------------------------------------
// 外部参照ファイル
// 報告書、手術記録、臨床サマリ等で使用される extRef
// ファイルのコンテンツをBase64で返す
// URL safe にしない
// 76文字毎に改行しない
//------------------------------------------------------------------------------
var fileAsBase64 = function (path) {
    // ファイルの内容をバイナリーデータとして読み込みBase64にエンコードして返す
    // JavaScriptの例
    // var binary = fs.readFileSync(path);
    // return new Buffer(binary).toString('base64');
    // サンプルではnullを返す
    return null;
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
