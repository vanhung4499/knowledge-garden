---
title: TS Type Aliases
tags:
  - ts
categories:
  - ts
date created: 2024-03-15
date modified: 2024-03-15
---

# Type Alias

Type Alias được sử dụng để đặt tên mới cho một kiểu.

## Ví dụ đơn giản

```ts
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n;
    } else {
        return n();
    }
}
```

Trong ví dụ trên, chúng ta sử dụng `type` để tạo Type Alias.

Type Alias thường được sử dụng trong kiểu kết hợp.
