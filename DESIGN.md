# Design

このファイルには、ソフトウェアが満たすべき要件・仕様・制約を記載していきます。

- Model ・・・ TypeScriptのinterfaceを用いて、知識を概念同士の関係性として形式的に記述します。
- Application ・・・ 自然言語によってアプリケーションを記述します。機能群やバリデーションなどを記載します。
- System ・・・ DBや認証方式、ライブラリ、デプロイ方法など、ModelとApplicationの内容をソフトウェア的に実現する上で指定したい情報を記述します。

これらの情報をAIに渡すことで精度の高いソフトウェアコードの生成を目指します。

## Model

```ts
export type UUIDv7 = string;
export type DateTime = Date;
export type Email = string;

export interface Account {
    id: UUIDv7
    email: Email
}

export interface Login {
    id: UUIDv7
    expiredAt: DateTime
    accountId: Account['id']
}
```

## Application

- サインアップ
  - LPから「ログイン」ボタンを押して、ログイン/サインアップ画面に遷移
  - ログイン/サインアップ画面にてメールアドレスを入力
  - 登録用メールが送信され、リンクを押して登録完了
  - リンクの期限は３０分
  - アプリトップページに遷移
- ログイン
  - LPから「ログイン」ボタンを押して、ログイン/サインアップ画面に遷移
  - ログイン/サインアップ画面にてメールアドレスを入力
  - ログイン用メールが送信され、リンクを押してログイン完了
  - リンクの期限は３０分
  - アプリトップページに遷移
- ログアウト
  - 右上にアカウントアイコンを置き、ポップアップメニューからログアウト
  - ログアウト後はログイン/サインアップ画面に遷移

## System

### DB

- mysql
- prisma
- ローカルではdockerイメージを利用して、docker-compose.ymlに追加

### SMTP

- ローカルではmailhogのdockerイメージを使用して、docker-compose.ymlに追加

### 認証

- サインアップあるいはログインに成功すると、`Login`データが作成され、その`id`がクッキー内に設定される。
- 各リクエストにおいて、設定された`id`を元にDB検索を行い、期限切れをしていない`Login`データが存在すれば、認証成功とする。
- ユーザー情報が必要な場合は、`Login.accountId`を元に引いてくることができる。
- ログアウト時は、`Login`データを削除する。
