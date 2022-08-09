## WithdrawalSubmission Form 規則 

1. localBank + memberCard  => 下拉選單顯示 accountNo , 選擇後自動帶入 bankName
2. localBank + manualCard  => AccountNo 為 input 框 , bankName 提供所有bank下拉選單
3. crypto + memberCard  => 根據 channel 渲染存在的錢包地址 , 沒有該 channel 則顯示 empty data , bankName 自動帶入當前 channel 類別
4. crypto + manualCard  => 根據 channel 自動填入 bankName , AccountNo 為 input框供填寫
5. 每次切換 payment type 或 手動/已存取卡片均會重置 acc.no / bankName 確保資料正確
6. accountHolderName 非必填 , 若 api response 本身有給則預設都顯示該內容
7. memo 此處為必填 ( 沒填 api 會吐 error ) 
8. withdraw 金額前端不做驗證 , 由後端驗證 