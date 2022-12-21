### Withdrawal Request

1. 只有 `Process` 狀態需要視規則傳送 `withdrawalInfo` , `selId` , `withdrawalType` , `withdrawalAccountingModels` 
2. `localBank` 需要傳第一項所有資料，其餘不用傳 `withdrawalAccountingModels`
3. `localBank` 時才有拆單功能 , `localBanking` 時 `selId` = 拆單的第一筆 `bankId`
4. `localBank`與`cryptoWallet` 可以在 `Approved` 之後繼續修改單內容
5. `cryptoWallet` 基礎邏輯與 `localBank` 相同，差在 `cryptoWallet` 不可拆單，所以詳細資料一樣是塞在 `withdrawalAccountingModels` 內


### ReceiptUploader
1. 只有 `LocalBank`與`CryptoWallet` 有上傳單據功能 
2. 可以直接 paste 圖片 , 詳細可以看 `usePasteEffect.ts` hooks內使用說明
3. 因為這隻有 paste 功能，所以在 `Upload` 元件內不會對 `FileList` 做直接操作，透過 `getReceiptPicture` 自動 refetch 來更新 fileList

### Withdrawal Request , WithdrawalType 下拉邏輯 
Verified 出單時 WithdrawalType 下拉邏輯 => 

1. 假如 `accountType = crypto` , 判斷可用 cryptoList 是否 > 0 , True 則顯示 `CryptoPay` 選項 ; 判斷 cryptoWalletList 是否 > 0 , True 則顯示 `CryptoWallet` 選項
2. 假如 `accountType = ewallet` , 判斷可用 localBankList 是否 > 0 , True 則顯示 `LocalBanking` ; 判斷 `eWalletName !== null` , True 則顯示 `OnlinePayment`
3. 假如`accountType = null` , 判斷可用 localBankList 是否 > 0 , True 則顯示 `LocalBanking` ; 判斷 onlinePayList 是否 > 0 , True 則顯示 `OnlinePayment`