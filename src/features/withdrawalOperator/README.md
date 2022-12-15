### Withdrawal Request

1. 只有 `Process` 狀態需要視規則傳送 `withdrawalInfo` , `selId` , `withdrawalType` , `withdrawalAccountingModels` 
2. `localBank` 需要傳第一項所有資料，其餘不用傳 `withdrawalAccountingModels`
3. `localBank` 時才有拆單功能 , `localBanking` 時 `selId` = 拆單的第一筆 `bankId`
4. `localBank` 可以在 `Approved` 之後繼續修改拆單內容

### ReceiptUploader
1. 只有 `LocalBank` 有上傳單據功能 
2. 可以直接 paste 圖片 , 詳細可以看 `usePasteEffect.ts` hooks內使用說明
3. 因為這隻有 paste 功能，所以在 `Upload` 元件內不會對 `FileList` 做直接操作，透過 `getReceiptPicture` 自動 refetch 來更新 fileList