<h1>MYANI</h1>
<br>
<p>アニメレビューサイト(SPA)です。お気に入り登録、レビューを共有することができます。<br>
レスポンシブに対応してますのでスマホからでも閲覧可能です</p>
<img src='https://dev.myani.site/static/readme/myani.PNG'></img>
<img src='https://dev.myani.site/static/readme/myani2.PNG'></img>
<h1>URL</h1>
<p>https://dev.myani.site</p>
<p>テストユーザはメールアドレスtest@www.com パスワードTest0001です。


<h1>ER図</h1>
<img src='https://dev.myani.site/static/readme/Untitled.png'></img>
<h1>インフラ設計図</h1>
<img src='https://dev.myani.site/static/readme/名称未設定ファイル.drawio.png'></img>
<p>public subnetとprivate subnetが同じ構成で二つ存在しますが、災害リスクを考慮して設計しているだけで同じものです。</p>
<h1>使用技術</h1>
<ul>
  <li>react 18.2</li>
  <ul>
      <li>material ui</li>
  </ul>
   <li>Django 5.0</li>
  <ul>
    <li>restframework 3.14</li>
  </ul>
  <li>gunicorn</li>
  <li>nginx</li>
  <li>mysql</li>
  <li>AWS</li>
  <ul>
    <li>EC2</li>
    <li>ELB</li>
    <li>RDB</li>
    <li>CloudFront</li>
    <li>ACM</li>
    <li>ROUTE53</li>
    <li>S3</li>
  </ul>
</ul>
<h1>機能一覧</h1>
<ul>
  <li>ユーザ登録、ログイン機能</li>
  <ul>
    <li>認証メール送信</li>
    <li>ユーザ情報編集機能</li>
    <ul>
      <li>画像設定</li>
    </ul>
  </ul>
  <li>review投稿機能</li>
  <li>お気に入り登録機能</li>
  <li>ページネーション</li>
  <ul>
    <li>無限スクロール</li>
  </ul>
  <li>ユーザ検索機能</li>
  <ul>
    <li>検索フィルター</li>
  </ul>
</ul>
