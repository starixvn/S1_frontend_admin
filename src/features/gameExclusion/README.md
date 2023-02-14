## EditGameExclusion 說明 

### 元件
- EditGameExclusion : 主要邏輯與 api 撰寫於此處，元件最父層 
- BasicInfoForm : 基本資料表單，包含 `userName` `selectedTp`
- GameInfoForm : 僅用來 map 渲染 `GameSelector` 元件
- GameSelector : 遊戲選擇下拉，根據當前選擇的 `selectedTp` 動態生成下拉選單 
- ResultTable : 僅用來渲染顯示當前的表單結果，監聽 `form` 來顯示，不會對表單進行異動，無關乎頁面邏輯

### 設計與操作邏輯 

- 操作流程：`EditGameExclusion`( form , data )  => `BasicInfoForm` (selectedTp) => `GameInfoForm` (map `GameSelector`)
- 除了 `EditGameExclusion` 保有絕大多數邏輯外，其餘子元件僅能對 form 做異動，其餘副作用與須同步的邏輯透過監聽 form 寫在 `EditGameExclusion`
- `ResultTable` 獨立撰寫元件邏輯，渲染 form 的內容
