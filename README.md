## 千年ビルダー

千年ビルダーは、電子カルテなどの医療情報システムに簡単なAPIを提供し、千年カルテが必要とするMML4.0形式のデータを生成するAPIサーバーです。  


### APIサポート
千年カルテに参加するとプロジェクトから開発用のサーバーが提供されます。下記の情報を参考にそれぞれの処理系でAPIをサポートしてください。

 * [API情報](https://github.com/mbot-dev/1000_builder/wiki)


このリポジトリーにはAPIサーバーとサンプルプログラムが置いてありますが、独自に拡張される場合等を除き、インストール以降の手順は不要です。


### インストール方法
 * Node.jsをインストール
 * このリポジトリをクローン
  - git clone git@github.com:mbot-dev/1000_builder.git
 * クローンしたディレクトリへ移動
 * npm install


### 使用方法

##### （１）APIサーバー起動
 * クローンしたディレクトリへ移動
 * npm start
 * サーバーが起動し、コンソールに Listening on 127.0.0.1:6001 と表示されます。
 * 上記の 6001 はサーバーがバインドしたHTTPポートで、環境によって変わることがあります。

##### （２）クライアントで動きを確認
 * ブラウザーでサーバーがバインドしたポートへアクセスします。
 * 例　http://localhost:6001

##### （３）サンプルプログラムを調べる
 * MMLで扱う情報の種類ごとに public/js に sample- で始まるファイルがあります。


### 寄与するには
 * issue 及び pull request を受付
 * このリポジトリのオーナー（mbot-dev）へ連絡


### クレジット等
 * [千年カルテプロジェクト](https://www.facebook.com/gEHR-398609153661839/)
 * [MML4.0](http://www.medxml.net/MML40j/mml4.html)
 * [API稼働サンプル](https://1000-builder.cfapps.io/)


### ライセンス
　[MIT](https://opensource.org/licenses/mit-license.php)
