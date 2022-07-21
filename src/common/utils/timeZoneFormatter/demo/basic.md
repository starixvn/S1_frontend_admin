# Basic Usage

```ts
import { dateRangeToUtcFormatter } from 'common/utils'

utcFormatter('2022-07-20T00:00:00', 8)
// 2022-07-20T00:00:00+08:00

utcFormatter('2022-07-20T00:00:00', 7)
// 2022-07-20T00:00:00+07:00

utcFormatter('2022-07-20T00:00:00+08:00', 7)
// 2022-07-20T00:00:00+07:00
```
