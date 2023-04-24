[Api](https://admin.n88dev.com/swagger/index.html#/Bonus/Bonus_GetList)
</br>
[BonusCreate 文件](https://q2qqjr.axshare.com/#id=f3e9av&p=bouns_create&g=1)
</br>
[Bonus List 文件](https://q2qqjr.axshare.com/#id=45cyh6&p=bouns_managment&g=1)

### About Timezone

- 此頁面為避免市場混淆 , 除了 updateTime 以外其餘時間處理一率使用 +0 處理

### 主表單頁面

- Table 可直接切換該 Bonus 的 status
- 複製功能在複製時僅可設定新的 BonusCode , 其餘需在複製後手動進入編輯頁面做修改

### Scratch Card

僅有 Special 狀態的 Bonus 支援 Scratch Card 生成 , 頁面支持 `export excel` 和 自動生成 Scratch Code

### Bonus Create/Edit `apiV2/Bonus/Set`

- Create / Edit , 共用同一隻檔案 , 透過 `params` 辨別當前行為是編輯還是新增
- 編輯時有某些特定欄位會設為 disable ,畫面右邊區塊則為設定 `active` 後才可開始編輯
- 不同 Bonus Type 有不同行為 / 顯示元件 , 詳閱 Bonus Create 文件
- Api 文件上有的欄位 , 若 `type.ts` 檔沒有定義則代表該欄位目前已沒有用
- 畫面左邊區塊主要是 `PromotionInfo` , 對應檔案為 `BonusDetailMainForm.tsx`
- 畫面右邊區塊為 `Specific` 內資料 , 對應檔案為 `BonusDetailSubForm.tsx`
- 畫面右下區塊為 各個 `Specific` 內的 `details` , 對應檔案為 `BannerInfoEditTab` 和其子元件
- `MainForm` 和 `SubForm` 主要用 `BonusType` 做條件渲染 , 找尋特定 BonusType 行為可直接搜該 Type 名稱
- 所有有顯示的 Bonus Type 可搜尋 `constants.ts` 內的 `BonusTypeEnum`
- 在特定 `bonusType` 為 `FreeBet` , `RetentionFreeBet`, `DeviceBonus` 時 設定 `amount Type` 為 `Amount` (預設為 `percentage`)
- 當 isDisplayDate 未打勾時
  1. 參數 'Display Date' 送 null 給後端。
  2. BonusDetailSubForm.tsx 的 bannerUrl、title、description 需為非必填。
- 當 `bonusType` 為 `FreeBet` , `First deposit `, `DeviceBonus` 時支援以下選項
  1. Same Device ID restrict
  2. Same IP restrict
  3. Same Real Name restrict
- 以上每組都包含一個 count 計次 inputNumber , `bonusType = freebet` 時 `SameIPRestrict`要預設開啟

#### Banner Info

畫面右下角之 Banner Info 需帶入 `apiV2/Bonus/Set` 的各個 `specific` 內的 `details` ，因表單結構無法支援超過三層巢狀 , 故在輸入時是填在其他欄位。 </br>
送 api 時才將各個部位組合起來， `details` 為 string type , 故需在最後將該物件整個轉成 string

#### `Error Handling`

因為畫面 `specific` 區塊 , 需要在手動 active 後才做 required 檢查 </br>
故 active 打開時才會啟動 rules , 送出時會逐項檢查未甜的部分 , 畫面未顯示的區塊則用 `message.error` 彈窗逐格彈出 , 一次彈出一格 , 直到全部檢查完畢。

- tips : `winOver` 和 `rollOver` 欄位一次只可填入一格 , 在該二欄位獨立寫 `validator` 做驗證

#### `SetGroupModa.tsx`

Bonus Type 為 `TierRedepositBonus` 時送出的 bonus amount 必須是 `tierAmountList` , 前端顯示彈窗供使用者設定 list

#### `utils.ts`

- 共用 func 或 資料轉換 func
- C2S means `Client to Server`
- S2C means `Server to Client`

#### `contants.ts`

前端寫死的 list 和各種條件判斷用的 enum 均記錄在此
