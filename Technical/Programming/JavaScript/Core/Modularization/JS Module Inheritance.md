---
title: JS Module Inheritance
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-05
---

# Kế thừa module

Các module cũng có thể kế thừa lẫn nhau.

Giả sử có một module `children`, kế thừa từ module `parent`.

```js
// children.js
export * from 'parent'

export var name = 'child'

export function cry(){
  // làm gì đó
}
```

Trong đoạn mã trên, `export *` có nghĩa là xuất tất cả các module và phương thức từ module `parent`. Sau đó, đoạn mã trên cũng xuất thuộc tính tùy chỉnh `name` và phương thức mặc định `cry`.

Đồng thời, cũng có thể đổi tên thuộc tính hoặc phương thức của `parent` trước khi xuất chúng.

```js
// children.js
export { work as job } from 'parent'
```

Đoạn mã trên có nghĩa là chỉ xuất phương thức `work` của module `parent` và đổi tên thành `job`.

Cách tải module trên được thực hiện như sau:

```js
// main.js
import * as child from 'children'
import cry from 'children'

console.log(cry(child.name))
```

Đoạn mã trên với `import cry from 'children'` có nghĩa là tải phương thức mặc định của module `children` và gán cho phương thức `cry`.
