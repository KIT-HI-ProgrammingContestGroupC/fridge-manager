- こちらのサイトを大いに参考にしています。  
[アールエフェクト Nuxt 3を使いこなすために基礎から徹底解説 Server API Route](https://reffect.co.jp/vue/nuxt3#Server_API_Route)

  - sqlite3を、prismaというツールを用いて操作するようにしました。
  - よくある`SELECT ,,,`みたいなSQL文ではなく、`findMany()`メソッドとか`create()`メソッドとかを用いてデータを読み込んだり書き込んだりするようです。　　
  - prismaが入ってないとかでエラーが出た場合は、ルートディレクトリで次のようなコマンドを入力する必要があるかもしれません。　　
`npm install prisma`　　→ `npx prisma init`

- できたこと(local...3000/addItemから操作できます)
  - データの読み込み&一覧表示
  - データの追加

- TODO
  - まだテスト用に動かしている段階で、実際のデータに即していません 
  - ~~検索機能に触れていません~~
  - GET/POSTについて理解していません
  - 編集/削除を実装していません
