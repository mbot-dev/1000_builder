## 千年ビルダー

　千年ビルダーは、電子カルテなどの医療情報システムに簡単なAPIを提供し、千年カルテが必要とするMML4.0形式のデータを生成するAPIサーバーです。

### 動作サンプル

 * [このページ](https://1000-builder.au-syd.mybluemix.net)でAPIとサーバーのレスポンスを確認することができます。


### API情報

  1. [Wiki simple](https://github.com/mbot-dev/1000_builder/wiki/simple)にあります。
  2. 稼働サンプルのJavaScriptも参考にしてください。


### インストール
　APIのみをサポートする場合は、インストールは不要です。千年カルテプロジェクトから支給される開発サーバーをご利用ください。  
　以下は独自に拡張される場合等に参考にしてください。

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


### 関連情報

 * [千年カルテプロジェクト](https://www.facebook.com/gEHR-398609153661839/)
 * [MML4.0](http://www.medxml.net/MML40j/mml4.html)
 * [カルテに記載される情報](https://gist.github.com/dolphin-dev/f177a57c91d527e01059)
 * [確定日について](https://gist.github.com/dolphin-dev/c0d59774ecfbe47c0b3b)
