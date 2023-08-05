---
title: JS Import
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-05
---

# Import module

`import` lệnh được sử dụng để nhập các chức năng được cung cấp bởi các module khác.

## Cách nhập

ECMAScript đặc tả về module hóa cung cấp bốn cách để nhập module:

* Import theo tên (Named Imports)
* Import theo không gian tên (Namespace Import)
* Import mặc định (Default Import)
* Import rỗng (Empty Import)

### Import theo tên

Nhập các mục cụ thể từ module nguồn bằng tên gốc của chúng.

```js
import { originModule } from './module.js'

// React Hook
import { useState, useEffect } from 'react'
```

Nhập các mục cụ thể từ module nguồn và đặt tên tùy chỉnh khi nhập. Sử dụng từ khóa `as` để đổi tên biến nhập.

```js
import { originMoudle as newMoudleName } from './module.js'
```

### Import theo không gian tên

Nhập tất cả nội dung của module nguồn như một đối tượng, xuất tất cả các mục được đặt tên từ module nguồn như các thuộc tính và phương thức của đối tượng. Mục xuất mặc định được loại bỏ khỏi đối tượng này.

```js
import * as module from './module.js'

// module `fs` của Node.js
import * as fs from 'fs'
```

Trong ví dụ trên, `originModule` sẽ được gắn vào đối tượng nhập dưới dạng thuộc tính, tức là `module.originModule`.

### Import mặc định

Nhập mục xuất mặc định từ tệp nguồn.

```js
import module from './module.js'
```

### Import rỗng

Tải mã module nhưng không tạo bất kỳ đối tượng mới nào.

```js
import './module.js'
```

## Đặc điểm của module

### Chỉ đọc

Các biến được nhập bằng lệnh `import` là chỉ đọc, vì chúng là giao diện nhập. Điều đó có nghĩa là không được phép ghi đè giao diện trong tệp kịch bản tải module.

```js
import { foo } from './module.js'

foo = { a: 1 }
// Lỗi cú pháp: 'a' là chỉ đọc;
```

Tuy nhiên, nếu biến nhập là một đối tượng, việc ghi đè biến đó là được phép.

```js
import { bar } from './module.js'

bar.a = 1
// Đúng
```

Mặc dù các thuộc tính của đối tượng được sửa đổi ở đây có thể được đọc bởi các module khác, nhưng cách làm này khó để gỡ lỗi, do đó, nên coi tất cả các biến nhập là chỉ đọc và tránh sửa đổi chúng.

### Đường dẫn nhập

Phần `from` sau lệnh `import` chỉ định vị trí của tệp module, có thể là đường dẫn tương đối hoặc tuyệt đối, và có thể bỏ qua phần mở rộng `.js`.

Nếu chỉ có tên module mà không có đường dẫn, thì **tệp cấu hình** (thường là `package.json` trong thư mục module được nhập) phải tồn tại để cho trình thông dịch JavaScript biết vị trí của module đó.

```js
import React from 'react'
```

### Nâng lên module

Lưu ý rằng lệnh `import` có hiệu lực nâng lên (hoisting), nghĩa là lệnh `import` sẽ được đưa lên đầu của module và được thực thi trước bất kỳ lệnh nào khác trong tệp.

```js
foo()

import { foo } from './module.js'
```

Đoạn mã trên không gây lỗi, vì việc thực thi `import` xảy ra trước khi `foo` được gọi. Hành vi này là do lệnh `import` được thực thi trong giai đoạn biên dịch, trước khi mã chạy.

### Thực thi tĩnh

Vì lệnh `import` được thực thi tĩnh, nên không thể sử dụng biểu thức và biến, những cú pháp này chỉ có thể có kết quả trong thời gian chạy.

```js
// Lỗi - Sử dụng biểu thức
import { 'f' + 'oo' } from 'my_module';

// Lỗi - Sử dụng biến
var module = 'my_module';
import { foo } from module;

// Lỗi - Sử dụng câu lệnh điều kiện
if (x === 1) {
  import { foo } from 'module1';
} else {
  import { foo } from 'module2';
}
```

Ba cách viết trên đều gây lỗi, vì chúng sử dụng biểu thức, biến và cấu trúc `if`. Trong giai đoạn phân tích tĩnh, những cú pháp này không thể có giá trị.

### Tải lại

Nếu một lệnh `import` được thực thi nhiều lần, nó chỉ được thực thi một lần và không được thực thi nhiều lần.

```js
import 'lodash'
import 'lodash'
```

Đoạn mã trên tải `lodash` hai lần, nhưng chỉ thực thi một lần.

```js
import { foo } from 'my_module';
import { bar } from 'my_module';

// Tương đương với
import { foo, bar } from 'my_module';
```

Đoạn mã trên, mặc dù `foo` và `bar` được tải trong hai lệnh khác nhau, nhưng chúng tương ứng với cùng một phiên bản của `my_module`. Điều đó có nghĩa là lệnh `import` hoạt động theo mô hình Singleton.

## Cô lập module

Hiện tại, thông qua quá trình biên dịch Babel, lệnh `require` của CommonJS và lệnh `import` của ES6 có thể được viết trong cùng một module, nhưng tốt nhất là không nên làm như vậy. Vì lệnh `import` được thực thi trong giai đoạn phân tích tĩnh, nó là lệnh được thực thi sớm nhất trong module. Đoạn mã dưới đây có thể không cho kết quả như mong đợi.

```js
require('core-js/modules/es6.symbol')

require('core-js/modules/es6.promise')

import React from 'React'
```
