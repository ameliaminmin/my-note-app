# React Next Boilerplate

## 如何開始

1. 安裝所需套件

```
npm install
```

2. 啟動開發伺服器

```
npm run dev
```

再執行

```
npm run dev
```

3. 啟動後透過瀏覽器造訪 http://localhost:3000

4. 進入 `/app/page.js` 開始編輯首頁上的內容

## 如有使用 nvm

如使用 Windows 啟動 `npm run dev` 時無反應可先執行

```
nvm install 21.0.0
nvm use 21.0.0
```

## 開啟Cursor Tab

Ctrl + Shift + P

搜尋: Enable Cursor Tab

關閉 Cursor Tab

搜尋: Disable Cursor Tab

# 將專案送到github(第二行add後面改成.)，打在終端機
git init
<!--  -->
git add .
<!-- .是所有檔案，我們除了readme要傳所有檔案傳上去 -->
git commit -m "first commit"
<!-- 把變更正式存起來 -->
git branch -M main
<!-- 合作才會用到分支，協作。 -->
git remote add origin https://github.com/amelia-min-chen/my-note-app.git
git push -u origin main
<!-- 把資料正式推送，每個人環境不同，應該會叫你登入 -->