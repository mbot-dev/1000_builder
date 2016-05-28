## 千年ビルダー

千年ビルダーは、電子カルテなどの医療情報システムに簡単なAPIを提供し、千年カルテプロジェクトが必要とするMML4.0形式のデータを生成するサーバーアプリケーションです。利用にあたってMMLの知識は不要です。


### ユースケース

 * クライアントは千年カルテに参加したい医療情報システムで、既存の場合もあれば新規開発の場合もあります。
 * サーバーはこのリポジトリから構築することもできますが、SaaSとしても提供されます。
 * クライアントは、処方、検査、病名等のデータを、簡単な構造のJSONにしてサーバーへポストします。
 * サーバーはポストされたデータからMML4.0を生成し、クライアントに返します。
 * 返されたデータを千年カルテに送信します。


### JSON-RPC 2.0
クライアントとサーバーは次のように通信します。

* 通信方式: リモートプロシジャーコール
* 仕様: JSON-RPC 2.0

サーバーはNode.jsで実装されていますが、クライアントはJSONデータをHTTP/HTTPSでPOSTするだけです。
現在では殆ど全ての言語でこの機能がサポートされており、アプリケーションに組み込むことができます。


### クライアントのみ開発

 * プロジェクトの[ホームページ](https://1000-builder.au-syd.mybluemix.net)にアクセスし、ポストするデータの概略、サーバーのレスポンスを確認してください。
 * [Wiki simple](https://github.com/mbot-dev/1000_builder/wiki/simple)を参考に、データを用意し、ポスト手順を実装してください。
 * 次のソースをブラウザーでオープンし、参考にしてください。
  - /public/index.html の javascript
  - showPrescription() -> post() で全体がつかめます
 * テストサーバーを使用し、動作の確認をしてください。
 * 本番では SaaS を利用します。


### サーバも開発

* Node.jsをインストール
* このリポジトリをクローン
 - git clone git@github.com:mbot-dev/1000_builder.git
* クローンしたディレクトリへ移動 （$ cd /path_to/clone_directory）
* npm install
* node app.js（RPC サーバーが起動します）

ブラウザーで

 * http://localhost:6001 へアクセス


### サーバープログラムの概要

  * RPC エンドポイント: /api/rpcRouter.js
  * ポストデータを中間オブジェクト（MMLのXML要素に対応）に変換: /api/simpleBuilder.js
  * 中間オブジェクトを手動でXMLに変換: /lib/内の各Builder.js


### ポストデータの詳細

 1. [Wiki simple](https://github.com/mbot-dev/1000_builder/wiki/simple)
 2. index.html の javascript
  - 処方せん: simplePrescription()
  - 検体検査: simpleLabTest()
  - 病名: simpleDiagnosis()


### フィードバック

 * issue 及び pull request を受付ます。
 * 連絡先 このリポジトリのオーナー（mbot-dev）
 * データをセットするには注意点があります。このリポジトリの wiki で説明してゆく予定です。

### 関連情報

 * [千年カルテプロジェクト](https://www.facebook.com/gEHR-398609153661839/)
 * [MML4.0](http://www.medxml.net/MML40j/mml4.html)
 * [カルテに記載される情報](https://gist.github.com/dolphin-dev/f177a57c91d527e01059)
 * [確定日について](https://gist.github.com/dolphin-dev/c0d59774ecfbe47c0b3b)
