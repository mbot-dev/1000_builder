## MMLアップコンバータ（千年ビルダー）

MMLアップコンバータは、電子カルテなどの医療情報システムに簡単なAPIを提供し、千年カルテが必要とするMML4.0形式のデータを生成するAPIサーバーです。  


### APIサポート
千年カルテに参加するとプロジェクトから開発用のサーバーが提供されます。下記の情報を参考にそれぞれの処理系でAPIをサポートしてください。

 * [API情報](https://github.com/mbot-dev/1000_builder/wiki)


このリポジトリーにはAPIサーバーとサンプルプログラムが置いてありますが、独自に拡張される場合等を除き、インストール以降の手順は不要です。


### インストール方法
 * Node.jsをインストール（Ver 8.9.4 以降）
 * このリポジトリをクローン
  - git clone git@github.com:mbot-dev/1000_builder.git
 * クローンしたディレクトリへ移動
 * npm install


### 使用方法

##### （１）APIサーバー起動
 * クローンしたディレクトリへ移動
 * npm start
 * サーバーが起動し、コンソールに Listening on 0.0.0.1:6001 と表示されます。

##### （２）クライアントで動きを確認
 * ブラウザーでサーバーを起動させたマシンのアドレスとポートへアクセスします。
 * 例　http://192.168.10.17:6001

#### (３）アクセス・トークン
 * デフォルトではアクセストークンは使用しない設定になっています。
 * アクセストークンを使用する場合は、下記の設定をおこなってください。
  - 設定ファイル: config/default.json
  - 値: use_token: true  <- false をtrue に変更する

##### （４）サンプルプログラムを調べる
 * MMLで扱う情報の種類ごとに public/js に sample- で始まるファイルがあります。


### 寄与するには
 * issue 及び pull request を受付
 * このリポジトリのオーナー（mbot-dev）へ連絡


### クレジット等
 * [千年カルテプロジェクト](https://www.facebook.com/gEHR-398609153661839/)
 * [MML4.0](http://www.medxml.net/MML40j/mml4.html)
 * [API稼働サンプル](https://1000-builder.au-syd.mybluemix.net)


### ライセンス
　[MIT](https://opensource.org/licenses/mit-license.php)
