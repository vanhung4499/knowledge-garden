---
title: TS String Literal Type
tags:
  - ts
categories:
  - ts
date created: 2024-03-15
date modified: 2024-03-15
---

# String Literal Type

String Literal Type được sử dụng để hạn chế giá trị chỉ có thể là một trong số một số chuỗi nhất định.

## Ví dụ đơn giản

```ts
type EventNames = 'click' | 'scroll' | 'mousemove';
function handleEvent(ele: Element, event: EventNames) {
    // do something
}

handleEvent(document.getElementById('hello'), 'scroll');  // Không có vấn đề
handleEvent(document.getElementById('world'), 'dblclick'); // Báo lỗi, event không thể là 'dblclick'

// index.ts(7,47): error TS2345: Argument of type '"dblclick"' is not assignable to parameter of type 'EventNames'.
```

Trong ví dụ trên, chúng ta sử dụng `type` để định nghĩa một String Literal Type `EventNames`, nó chỉ có thể lấy một trong ba chuỗi.

Lưu ý, **Type Alias và String Literal Type đều được định nghĩa bằng `type`.**
