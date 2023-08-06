---
title: JS Parasitic Inheritance
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-06
date modified: 2023-08-06
---

# Kế thừa dựa trên nguyên mẫu - Parasitic Inheritance

**Kế thừa dựa trên nguyên mẫu (Parasitic Inheritance)**: Tạo ra một hàm chỉ để đóng gói quá trình kế thừa, và trong hàm này, tăng cường đối tượng theo một cách nào đó.

```js
function creator(origin) {
  // Tạo một đối tượng mới dựa trên origin làm nguyên mẫu
  let clone = Object.create(origin);

  // Tăng cường đối tượng theo một cách nào đó
  clone.sayHi = function () {
    console.log('Hello world!');
  };

  // Trả về đối tượng này
  return clone;
}

let friendship = {
  name: 'Uzi',
  friends: ['Amy', 'Ben', 'Tom'],
};

// Có tất cả các thuộc tính và phương thức của nguyên mẫu person, cũng như một phương thức riêng
let uzi = creator(friendship);

uzi.sayHi();
// Hello world!
```

Khi chỉ quan tâm đến đối tượng mà **không phải là loại tùy chỉnh và hàm tạo**, kế thừa dựa trên nguyên mẫu cũng là một mô hình hữu ích. Hàm `Object` được sử dụng trong ví dụ trước không bắt buộc, bất kỳ hàm nào trả về một đối tượng mới cũng có thể được sử dụng trong mô hình này.

> ⚠️ **Lưu ý**: Sử dụng kế thừa dựa trên nguyên mẫu để thêm hàm vào đối tượng sẽ làm giảm hiệu suất do không thể tái sử dụng hàm; điều này tương tự như mô hình mượn hàm tạo.
