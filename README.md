## 千年ビルダー

千年ビルダーは、電子カルテなどの医療情報システムに簡単なAPIを提供し、千年カルテプロジェクトが必要とするMML4.0形式のデータを生成するサーバーアプリケーションです。利用にあたってMMLの知識は不要です。


### 利用方法

 * クライアントは千年カルテに参加する医療情報システムです。MMLを理解し直接サポートすることもできますが、千年ビルダーの使用が推奨されています。
 * クライアントは、処方、検査、病名等のデータを、簡単な構造のJSONにしてサーバーへポストします。
 * サーバーはポストされたデータからMML4.0を生成し、千年カルテプロジェクトに送信しますます。（クライアントの開発ステージでは生成されたMMLはクライアントへ返されます。）
 * サーバーはプロジェクトから提供されます。


### 動作確認

[このページ](https://1000-builder.au-syd.mybluemix.net)で、ポストするデータ、サーバーのレスポンスを確認することができます。


### APIの詳細と手順

 1. [Wiki simple](https://github.com/mbot-dev/1000_builder/wiki/simple)にあります。
 2. このリポジトリの /public/js/index.js（動作確認ページ）の JavaScript を参考にしてください。
  - startApp() がエントリーポイントでここから順を追うと全体がつかめます。
  - 最初に Access Token を取得します。
  - その後JSONサンプルをPOSTします。


### クライアント-サーバ間の通信仕様

  * 通信方式:　JSON/HTTPS
  * エンドポイント:　/1000/simple/v1
  * メソッド: POST のみ
  * 具体例:　/public/index.html の post()


### クライアントのみ開発

 * Wikiとindex.jsを参考に、それぞれの処理系でデータを用意しポスト手順を実装してください。
 * 千年カルテから提供されるテストサーバーを使用し、動作の確認をしてください。
 * [千年バリデータ](https://1000-validator.au-syd.mybluemix.net/)を使用しXMLの妥当性検証を行ってください。
 * 稼働ステージへ以降します。
 * 以上。


### サーバも開発

* Node.jsをインストール
* このリポジトリをクローン
 - git clone git@github.com:mbot-dev/1000_builder.git
* クローンしたディレクトリへ移動
* npm install
* node app.js（サーバーが起動します）

ブラウザーで

 * http://localhost:6001 へアクセス


### サーバープログラムの概要

  * HTTP API:　/api/simpleRouter.js
  * ポストデータを中間オブジェクト（MMLのXML要素に対応）に変換:　/api/simpleBuilder.js
  * 中間オブジェクトを手動でXMLに変換:　/lib/内の各Builder.js


### フィードバック

 * issue 及び pull request を受付ます。
 * 連絡先 このリポジトリのオーナー（mbot-dev）
 * データをセットするには注意点があります。このリポジトリの wiki で説明してゆく予定です。


### 関連情報

 * [千年カルテプロジェクト](https://www.facebook.com/gEHR-398609153661839/)
 * [MML4.0](http://www.medxml.net/MML40j/mml4.html)
 * [カルテに記載される情報](https://gist.github.com/dolphin-dev/f177a57c91d527e01059)
 * [確定日について](https://gist.github.com/dolphin-dev/c0d59774ecfbe47c0b3b)
