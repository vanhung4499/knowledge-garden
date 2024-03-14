---
title: TS Compiler Options
tags:
  - ts
categories:
  - ts
date created: 2024-03-15
date modified: 2024-03-15
---

# Compiler Options

TypeScript cung cấp rất nhiều tùy chọn biên dịch, nhưng tài liệu chính thức mô tả mỗi tùy chọn khá trừu tượng. Chương này sẽ giới thiệu chi tiết mỗi tùy chọn và cung cấp các ví dụ tương ứng.

Chỉ mục (nhấp vào tùy chọn để điều hướng đến mô tả chi tiết):

Tùy chọn | Kiểu | Giá trị mặc định | Mô tả
--- | --- | --- | ---
[`allowJs`](#allowjs) | `boolean` | `false` | Cho phép biên dịch các tệp js
[`allowSyntheticDefaultImports`](#allowsyntheticdefaultimports) | `boolean` | `false` | Cho phép sử dụng nhập mặc định cho các mô-đun không bao gồm xuất mặc định. Tùy chọn này không ảnh hưởng đến mã được tạo ra, chỉ ảnh hưởng đến kiểm tra kiểu.

## allowJs

> Cho phép biên dịch các tệp js.

Khi được đặt thành `true`, các tệp js sẽ được tsc biên dịch, nếu không thì không. Đây là thiết lập cần thiết khi phát triển một dự án sử dụng cả js và ts.

Xem ví dụ:

```bash
# Khi đặt thành true, tệp được biên dịch sẽ bao gồm foo.js
├── lib
│   ├── foo.js
│   └── index.js
├── src
│   ├── foo.js
│   └── index.ts
├── package.json
└── tsconfig.json
```

```bash
# Khi đặt thành false, tệp được biên dịch sẽ không bao gồm foo.js
├── lib
│   └── index.js
├── src
│   ├── foo.js
│   └── index.ts
├── package.json
└── tsconfig.json
```

## allowSyntheticDefaultImports

> Cho phép sử dụng nhập mặc định cho các mô-đun không bao gồm xuất mặc định. Tùy chọn này không ảnh hưởng đến mã được tạo ra, chỉ ảnh hưởng đến kiểm tra kiểu.

`export = foo` là cú pháp do ts tạo ra để tương thích với commonjs, tương ứng với `module.exports = foo` trong commonjs.

Trong ts, nếu muốn nhập một mô-đun được xuất qua `export = foo`, cú pháp chuẩn là `import foo = require('foo')` hoặc `import * as foo from 'foo'`.

Nhưng do lịch sử, chúng ta đã quen với việc sử dụng `import foo from 'foo'`.

Tùy chọn này giải quyết vấn đề đó. Khi nó được đặt thành `true`, cho phép sử dụng `import foo from 'foo'` để nhập một mô-đun được xuất qua `export = foo`. Khi nó được đặt thành `false`, sẽ không cho phép và sẽ báo lỗi.

Tất nhiên, chúng ta thường không sử dụng `export = foo` để xuất mô-đun trong tệp ts, mà chỉ sử dụng khi [[TS Declaration Files#`export`|viết tệp khai báo cho thư viện bên thứ ba (tuân theo quy chuẩn commonjs)]], lúc đó sẽ sử dụng `export = foo` để xuất kiểu.

Ví dụ, trong tệp khai báo của React, kiểu được xuất qua `export = React`:

```ts
export = React;
export as namespace React;

declare namespace React {
    // Khai báo kiểu của React
}
```

Lúc này nếu chúng ta sử dụng `import React from 'react'` để nhập react thì sẽ báo lỗi, [xem ví dụ](https://github.com/xcatliu/typescript-tutorial/tree/master/examples/compiler-options/02-allowSyntheticDefaultImports)  
：

```ts
import React from 'react';
// Module '"typescript-tutorial/examples/compiler-options/02-allowSyntheticDefaultImports/false/node_modules/@types/react/index"' can only be default-imported using the 'esModuleInterop' flagts(1259)
```

Cách giải quyết là đặt `allowSyntheticDefaultImports` thành `true`.

