---
title: JS Constructor Stealing
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-06
date modified: 2023-08-06
---

# Kế thừa bằng cách mượn hàm tạo

**Kế thừa bằng cách mượn hàm tạo (Constructor Stealing)** là việc gọi hàm tạo của lớp cha trong hàm tạo của lớp con để thực hiện việc kế thừa các thuộc tính của lớp cha.

🌰 **Ví dụ:**

```js
function Parent() {
  this.attr = {
    eye: 'blue',
    hair: 'black',
    skin: 'white',
  };
  this.sayName = function () {
    console.log('Name');
  };
}

function Child() {
  Parent.call(this);

  this.sayHi = function () {
    console.log('Hello world!');
  };
}

let boy = new Child();
boy.attr.age = 3;
console.log(boy.attr);
// { eye: 'blue', hair: 'black', skin: 'white', age: 3}

let girl = new Child();
console.log(girl.attr);
// { eye: 'blue', hair: 'black', skin: 'white'}
```

Trong hàm tạo `Child`, chúng ta sử dụng phương thức `call` (hoặc `apply`) để gọi hàm tạo của lớp cha `Parent` trong ngữ cảnh của hàm tạo `Child`.

Như vậy, các thuộc tính được khởi tạo trong hàm tạo của lớp cha `Parent` sẽ được thừa kế trong hàm tạo của lớp con `Child`.

Mỗi thực thể của `Child` sẽ có một bản sao riêng của các thuộc tính được kế thừa từ hàm tạo của lớp cha.

> ⚠️ **Lưu ý**: Hàm chỉ là một đối tượng có khả năng thực thi mã trong một môi trường cụ thể, do đó, chúng ta cũng có thể sử dụng phương thức `apply` và `call` để thực thi hàm tạo trên một đối tượng mới được tạo ra.

## Truyền tham số

So với chuỗi nguyên mẫu, kế thừa bằng cách mượn hàm tạo có một lợi điểm lớn, đó là **có thể truyền tham số từ hàm tạo của lớp cha vào hàm tạo của lớp con**.

```js
function Parent(name) {
  this.name = name;
}

function Child() {
  // Kế thừa Parent và truyền tham số
  Parent.call(this, 'Faker');

  // Thuộc tính của lớp con
  this.age = 18;
}

const child = new Child();
console.log(child.name);
// 'Faker'
console.log(child.age);
// 18
```

- Bằng cách truyền tham số vào hàm tạo của lớp cha, ta có thể tùy chỉnh các thuộc tính cần kế thừa.
- Để đảm bảo các thuộc tính hoặc phương thức được định nghĩa trong hàm tạo của lớp con không bị ghi đè bởi các thuộc tính được tạo ra bởi hàm tạo của lớp cha, có thể thêm các thuộc tính của lớp con sau khi gọi hàm tạo của lớp cha.

## Nhược điểm

- Chỉ có thể kế thừa các thuộc tính và phương thức của lớp cha **trong thực thể** và không thể kế thừa các thuộc tính và phương thức của **nguyên mẫu**.
- Không thể tái sử dụng, mỗi lớp con đều có một bản sao riêng của các hàm tạo của lớp cha, ảnh hưởng đến hiệu suất.
