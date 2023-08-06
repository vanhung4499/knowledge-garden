---
title: JS Prototypal Inheritance
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-06
date modified: 2023-08-06
---

# Kế thừa theo nguyên mẫu - Prototype Inheritance

Kế thừa theo nguyên mẫu là việc tạo ra một đối tượng mới dựa trên một đối tượng hiện có bằng cách sử dụng nguyên mẫu của nó, mà không cần tạo ra một loại tùy chỉnh.

🌰 **Ví dụ:**

```js
function Person(friendship) {
  function Creator() {}
  Creator.prototype = friendship;
  return new Creator();
}
```

Trong hàm này, trước tiên tạo ra một **hàm tạo tạm thời**, sau đó đặt nguyên mẫu của hàm tạo này là đối tượng được truyền vào, và cuối cùng trả về một thể hiện của hàm tạo tạm thời này. Theo bản chất, hàm này thực hiện một **sao chép nông** của đối tượng được truyền vào.

```js
// Được tạo dựa trên một đối tượng khác
const friendship = {
  name: 'unamed',
  friends: ['Amy', 'Ben', 'Tom'],
};

// Trả về một thể hiện mới, nguyên mẫu của thể hiện này là Person
let uzi = Person(friendship);
uzi.name = 'Uzi';
uzi.friends.push('Peter');

let kat = Person(friendship);
kat.name = 'Kat';
kat.friends.push('Sid');

// Các thuộc tính kiểu cơ bản và thuộc tính kiểu tham chiếu trong nguyên mẫu được chia sẻ bởi hai thể hiện
console.log(uzi.friends);
// ["Amy", "Ben", "Tom", "Peter", "Sid"]
```

Kế thừa theo nguyên mẫu yêu cầu có một đối tượng có thể được sử dụng làm cơ sở cho một đối tượng khác. Nếu có một đối tượng như vậy, nó có thể được truyền vào hàm tạo thể hiện và sau đó chỉnh sửa đối tượng nhận được theo nhu cầu cụ thể.

ECMAScript 5 đã chuẩn hóa kế thừa theo nguyên mẫu bằng cách thêm phương thức `Object.create()`. Phương thức này nhận hai tham số: một đối tượng được sử dụng làm nguyên mẫu cho đối tượng mới và một đối tượng khác để định nghĩa các thuộc tính bổ sung cho đối tượng mới (tùy chọn).

**Thực chất là thay thế hàm tạo Person bằng `Object.create`**

```js
const friendship = {
  name: 'unamed',
  friends: ['Amy', 'Ben', 'Tom'],
};

let uzi = Object.create(friendship);
uzi.name = 'Uzi';
uzi.friends.push('Peter');

let kat = Object.create(friendship);
kat.name = 'Kat';
kat.friends.push('Sid');

console.log(uzi.__proto__.friends);
// ["Amy", "Ben", "Tom", "Peter", "Sid"]

console.log(kat.__proto__.friends);
// ["Amy", "Ben", "Tom", "Peter", "Sid"]
```

## Nhược điểm của mô hình

Các thuộc tính của giá trị kiểu tham chiếu sẽ luôn được chia sẻ, các thay đổi của nhiều thể hiện đối tượng đối với kiểu tham chiếu sẽ bị ảnh hưởng.
