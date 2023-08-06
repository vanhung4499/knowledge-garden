---
title: JS Combination Inheritance
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-06
date modified: 2023-08-06
---

# Kế thừa kết hợp

Kế thừa kết hợp (Combination Inheritance) (còn được gọi là kế thừa giả cổ điển) là một mô hình kế thừa kết hợp giữa chuỗi nguyên mẫu và sử dụng hàm tạo để kế thừa các thuộc tính và phương thức.

Ý tưởng đằng sau đó là sử dụng chuỗi nguyên mẫu để kế thừa các thuộc tính và phương thức của đối tượng nguyên mẫu, trong khi sử dụng hàm tạo để kế thừa các thuộc tính của đối tượng thể hiện. Như vậy, chúng ta không chỉ sử dụng lại các phương thức thông qua việc định nghĩa trên nguyên mẫu, mà còn đảm bảo mỗi thể hiện đều có các thuộc tính riêng của nó.

Ví dụ:

```js
function Parent(name) {
  this.name = name;
  this.attr = {
    eye: 'blue',
    hair: 'black',
    skin: 'white',
  };
}

Parent.prototype.sayName = function() {
  console.log(this.name);
};

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

Child.prototype = new Parent();
Child.prototype.constructor = Child;
Child.prototype.sayAge = function() {
  console.log(this.age);
};

let faker = new Child('Faker', 3);

faker.attr.height = 80;

console.log(faker.attr);
// { eye: 'blue', hair: 'black', skin: 'white', height: 80 }
faker.sayName();
// 'Faker'
faker.sayAge();
// 3

let wolf = new Child('Wolf', 1);

console.log(wolf.colors);
// { eye: 'blue', hair: 'black', skin: 'white' }
kat.sayName();
// 'Wolf'
kat.sayAge();
// 1
```

Các bước thực hiện:

- Định nghĩa thuộc tính của lớp cha trong hàm tạo của lớp cha (hàm tạo `Parent` định nghĩa thuộc tính `name` và `attr`).
- Định nghĩa phương thức trên nguyên mẫu của lớp cha (nguyên mẫu `Parent` định nghĩa một phương thức `sayName`).
- Lớp con gọi hàm tạo của lớp cha, truyền tham số và kế thừa thuộc tính của lớp cha, sau đó định nghĩa thuộc tính riêng của nó (hàm tạo `Child` gọi hàm tạo `Parent` với tham số `name`, sau đó định nghĩa thuộc tính `height`).
- Nguyên mẫu của lớp con trỏ đến một thể hiện của lớp cha (gán một thể hiện của `Parent` cho nguyên mẫu của `Child`).
- Định nghĩa phương thức trên nguyên mẫu của lớp con (định nghĩa phương thức `sayAge` trên nguyên mẫu của `Child`).
- Như vậy, hai thể hiện của lớp con có thể có các thuộc tính riêng của chúng và sử dụng các phương thức chung.

## Nhược điểm

Trong mọi trường hợp, **sẽ gọi hai lần hàm tạo của lớp cha**: lần đầu tiên là khi **tạo nguyên mẫu của lớp con**, lần thứ hai là trong **hàm tạo của lớp con**. Đối tượng của lớp con cuối cùng sẽ chứa tất cả các thuộc tính của đối tượng lớp cha, nhưng phải ghi đè lên các thuộc tính này khi gọi hàm tạo của lớp con.

## Tối ưu hóa kế thừa kết hợp

Tối ưu hóa kế thừa kết hợp ví dụ một:

```js
// Trước đó
Child.prototype = new Parent();

// Sau đó
Child.prototype = Parent.prototype;
```

Nhược điểm của phương pháp tối ưu này là hàm tạo của đối tượng lớp con không thể phân biệt được là hàm tạo của lớp con hay lớp cha.

📌 **Cách viết hoàn hảo: Kế thừa kết hợp thông qua đối tượng trung gian**

Tối ưu hóa kế thừa kết hợp ví dụ hai: Sử dụng đối tượng trung gian để kế thừa nguyên mẫu đối tượng cha và tạo sự cách ly giữa lớp con và lớp cha.

```js
function Parent() {
  this.name = 'Parent';
  this.num = [0, 1, 2];
}

function Child() {
  Parent.call(this);
  this.type = 'Child';
}

Child.prototype = Object.create(Parent.prototype);

Child.prototype.constructor = Child;
