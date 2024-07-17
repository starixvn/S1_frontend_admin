# Tour 使用說明

## 使用步驟

1. 在需要導覽的元素上定義 `data-tour` 屬性，格式為 `data-tour="xxxxx"`，例如 `data-tour="certain-filter"`。
2. 在 `steps-config` 資料夾中，建立一個屬於該頁面的 `tour-steps` 檔案，並且 export 出來。
3. 針對需要特別處理的步驟，用 enum 標注出來。
4. 在頁面的主要元件中，引入 Antd 的 Tour 組件。
5. 使用自定義的 hook `useGenerateTourSteps`，將定義好的 `steps-config` 傳入函式。

## Hooks 說明

### `useGenerateTourSteps`

這個 hook 的主要作用是根據預定義的步驟配置生成 Ant Design Tour 所需的步驟數據。根據配置的 `selector` 值動態獲取對應的 DOM 元素。

#### 參數

- `tourSteps` (Array): 預先定義的 step-config 陣列，包含每個步驟的 selector, title, description 和 cover。

#### 返回值

- 返回符合 Antd 需求的 steps 陣列，每個 step 包含 target, title, description 和 cover。

### 範例

```jsx
// 引入 steps-config
import { headerManagementTour } from './steps-config/headerManagementTour';

// 使用自定義 hook 生成 steps
const steps = useGenerateTourSteps(headerManagementTour);

// 將生成的 steps 傳入 Antd 的 Tour 組件
<Tour steps={steps} />

// 使用Begin Button 去觸發啟動
// 需要特別處理的步驟 可以使用傳入 onChange prop 進入 Tour元件
<TourBeginButton handleClick={() => setOpen(true)} />
<Tour steps={steps} onChange={handleonChange} />

```
