## Main Module

- [Redux](https://redux.js.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Ant Design](https://ant.design/)
- [lodash](https://www.lodashjs.com/)

## 開發設定

### `npm ci`

安裝指定 node module , 使用 `npm ci` 避免 npm 對專案內 module 自動升版

### `npm run prepare`

安裝 husky 環境

### `npm run start`

啟動 local 端開發環境

## Git commit

因有安裝 husky 做程式碼檢查 , 下 Commit 時務必使用 Terminal 下指令 , 使用 Source Tree 等工具會導致失敗

## 常用 Scripts

### `npm i <套件名稱>@<版本>`

安裝該套件的指定版本

### `npm uninstall <套件名稱>`

解除安裝

## Available Scripts

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

---

##### # 更改頁面標題

我們使用 [react-document-title](https://www.npmjs.com/package/react-document-title) 來更改頁面標題，其主要優勢為：

- 可以像 React 組件一樣使用，傳入 props 來決定 title
- 可以在 App 的多個地方使用，不用各個地方寫 `useEffect` 和 `document.title`

##### [# 單一品牌操作 & 多品牌操作模式](./README/單一品牌與多品牌模式.md)

##### # 編輯器 - tinymce-react

[相關說明](./README/tinymce.md)

使用 [tinymce-react](https://www.npmjs.com/package/@tinymce/tinymce-react) 作為共用元件編輯器

```
"@tinymce/tinymce-react": "^4.1.0" // 目前使用 `^4.1.0` 版本
```
