# Fridge Manager

冷蔵庫の中のものを管理するためのwebアプリ

## For developer
### パッケージのインストール

```bash
npm install
```

### サーバの起動
```bash
npm run dev
```

- サーバを起動したPCからアクセスする場合、`https://127.0.0.1:3000`にアクセス
- 外部デバイスからアクセスする場合、 `https://YOUR_SERVERS_IP_ADDRESS:3000`にアクセス

証明書なしでhttpsブラウザにアクセスしているためプライバシーエラーの画面が出る。
Chromeであれば Advanced > Proceed to YOUR_SERVERS_IP_ADDRESS (unsafe) をクリックすればアクセスできる。

### .envファイルの設定方法
（トークン設定のために必ず個人でする）
Nuxt3でfridge-managerのルート直下に".env"ファイルを作成。
ファイルの中身は、slackのプロコンc_2024_github_envチャンネルからコピペで！
