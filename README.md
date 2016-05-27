## 千年ビルダー

千年ビルダーは、千年カルテプロジェクトに参加するのを手助けするサーバーアプリケーションです。クライアントは各種の医療情報システムで、
そこから簡単なデータを受け取り、MML4.0にエンコードしたデータを返します。利用にあたってMMLの知識は不要です。


### ユースケース

 * クライアントは千年カルテに参加したい医療情報システムで、既存の場合もあれば新規開発の場合もあります。
 * サーバーはこのリポジトリから構築することもできますが、SaaS としても提供されます。
 * クライアントは、処方、検査、病名等のデータを、簡単な構造の JSON にしてサーバーへポストします。
 * サーバーはポストされたデータから MML4.0 を生成し、クライアントに返します。
 * 返されたデータを千年カルテに送信します。


### JSON-RPC 2.0
クライアントとサーバーは次のように通信します。

* 通信方式: リモートプロシジャーコール
* 仕様: JSON-RPC 2.0

サーバーは Node.js で実装されていますが、クライアントは JSON データを HTTP で POST するだけです。
現在では殆ど全ての言語でこの機能がサポートされており、既存のアプリケーションに組み込むのも簡単です。


### クライアントのみ開発

 * プロジェクトの[ホームページ](https://1000-builder.au-syd.mybluemix.net)にアクセスし、ポストするデータの概略、サーバーのレスポンスを確認してください。
 * [Wiki simple](https://github.com/mbot-dev/1000_builder/wiki/simple)を参考に、データを用意し、ポスト手順を実装してください。
 * 次のソースをブラウザーでオープンし、参考にしてください。
  - /public/index.html の javascript
  - showPrescription()を起点にソースを追うと流れがつかめます
 * テストサーバーを使用し、動作の確認をしてください。
 * 本番では SaaS を利用します。


### サーバも開発

* Node.js をインストール
* このリポジトリをクローン
 - git clone git@github.com:mbot-dev/1000_builder.git
* クローンしたディレクトリへ移動 （$ cd /path_to/clone_directory）
* npm install
* node app.js（RPC サーバーが起動します）

別のコンソールを立ち上げて

 * クローンしたディレクトリへ移動　（$ cd /path_to/clone_directory）
 * サンプルディレクトリへ移動 ($ cd ./sample）
 * node rpcClient.js


### サーバープログラムの概要

  * RPC エンドポイント: /api/rpcRouter.js
  * ポストデータを中間オブジェクト（MMLのXML要素に対応）に変換: /api/simpleBuilder.js
  * 中間オブジェクトを手動でXMLに変換: /lib/内の各Builder.js


### ポストデータの詳細

 1. [Wiki simple](https://github.com/mbot-dev/1000_builder/wiki/simple)
 2. サンプルプログラム
  - 処方せん: /sample/prescription.js
  - 検体検査: /sample/labTest.js
  - 病名: /sample/diagnosis.js


### フィードバック

 * issue 及び pull request を受付ます。
 * 連絡先 このリポジトリのオーナー（mbot-dev）
 * データをセットするには注意点があります。このリポジトリの wiki で説明してゆく予定です。

### 関連情報

 * [千年カルテプロジェクト](https://www.facebook.com/gEHR-398609153661839/)
 * [MML4.0](http://www.medxml.net/MML40j/mml4.html)
