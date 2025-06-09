# CLAUDE.md

このファイルは、このリポジトリでコードを操作する際にClaude Code (claude.ai/code) にガイダンスを提供します。

## 開発コマンド

- `npm run dev` - Turbopackを使用して開発サーバーを起動
- `npm run build` - 本番用にアプリケーションをビルド
- `npm run start` - 本番サーバーを起動
- `npm run lint` - ESLintを実行してコード品質をチェック
- `npm run db:migrate` - データベースマイグレーションを実行
- `npm run db:generate` - Prismaクライアントを生成
- `npm run db:push` - スキーマ変更をデータベースにプッシュ
- `npm run db:studio` - データベース管理用のPrisma Studioを開く

## セットアップ手順

1. Dockerサービスを開始: `docker-compose up -d`
2. 依存関係をインストール: `npm install`
3. データベーススキーマをプッシュ: `npm run db:push`
4. Prismaクライアントを生成: `npm run db:generate`
5. 開発サーバーを起動: `npm run dev`

開発中に送信されたメールを確認するには、http://localhost:8025 でMailHog Webインターフェースにアクセスしてください。

## 設計

ソフトウェアが満たすべき要件・仕様・制約を記載していきます。

- Model ・・・ TypeScriptのinterfaceを用いて、知識を概念同士の関係性として形式的に記述します。
- Application ・・・ 自然言語によってアプリケーションを記述します。機能群やバリデーションなどを記載します。
- System ・・・ DBや認証方式、ライブラリ、デプロイ方法など、ModelとApplicationの内容をソフトウェア的に実現する上で指定したい情報を記述します。

これらの情報をAIに渡すことで精度の高いソフトウェアコードの生成を目指します。

### Model

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

export interface Todo {
    id: UUIDv7
    title: string;
    note: string;
    accountId: Account['id']
}
```

### Application

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
- TODO作成
  - `title`は必須
  - `note`は任意
- TODO一覧
  - ログインしているアカウント紐づくTODOをリスト表示する
- TODO編集
- TODO削除

### System

#### フレームワーク

- Next.js 15
  - App Router

#### スタイリング

- Tailwind CSS v4 with PostCSS
- フォントはGeist SansとGeist MonoがCSS変数として設定済み

#### 言語

- TypeScript
  - パスエイリアス（`@/*`はプロジェクトルートにマップ）を使用したStrictモードが有効

#### DB

- mysql
- prisma
- ローカルではdockerイメージを利用して、docker-compose.ymlに追加

#### SMTP

- ローカルではmailhogのdockerイメージを使用して、docker-compose.ymlに追加

#### 認証

- サインアップあるいはログインに成功すると、`Login`データが作成され、その`id`がクッキー内に設定される。
- 各リクエストにおいて、設定された`id`を元にDB検索を行い、期限切れをしていない`Login`データが存在すれば、認証成功とする。
- ユーザー情報が必要な場合は、`Login.accountId`を元に引いてくることができる。
- ログアウト時は、`Login`データを削除する。

## 開発方針

- `app`配下はサーバーコンポーネントを置き、機能固有のクライアントコンポーネントは`components/features`配下に置いてimportする
- 通信はなるべくサーバーアクションで行い、サーバーコンポーネントからクライアントコンポーネントにインジェクトする
