# TODOアプリをclaude codeで作る試み

前回、[インスタグラムクローンをclaude codeで作る試み](https://github.com/coder-ka/instagram-clone-vibed)をした。

そこで得られた知見を元に、再構築を行う。

## 改善点

前回同様、[Next.jsのボイラープレート](https://vercel.com/templates/next.js/nextjs-boilerplate)から開始する。

- 今後のボイラープレートにすることを目指して、アプリ開発で頻出の技術要素実装を固めていく
- DESIGN.mdになるべく細かく設計指示を行い、こまめにコミットしていく

## プロンプト履歴

- DESIGN.mdを元に認証回りの機能を作成して
- route.tsじゃなくて、Server Actionsを使うように修正
- Login error: TypeError: \_\_TURBOPACK\_\_imported\_\_module_\$5b\$project\$5d2f\$node_modules\$2f\$nodemailer\$2f\$lib\$2f\$odemailer\$2e\$js\_\_\$5b\$app\$2d\$rsc\$5d\$\_\_\$28\$ecmascript\$29\_\_.default.createTransporter is not a function
- メールログインすると認証エラーになる。コンソールには「無効な認証タイプです」と書いてある。
- トップページで、ログインしている場合は「ようこそ」と表示して、していない場合は「ログインまたはサインアップしてください」として
- アカウントのポップアップメニュー内のメールアドレスがはみ出してる
- ログアウトをしてもログイン画面に飛ばない
- CLAUDE.mdを日本語にして 
- 開発サーバーを起動して
- app配下のページはサーバーコンポーネントにして、components配下にfeaturesフォルダを作ってそこからクライアントコ ンポーネントをimportする構成にして
- アクションはサーバーコンポーネントのページ側からクライアントコンポーネントにインジェクトするように直して
- サーバーアクションをlib/actionsに切り分けないで、関数の実体をサーバーコンポーネント内に定義して

## 途中操作

- DESIGN.mdの内容をCLAUDE.mdに移管

## 結果

TODO
