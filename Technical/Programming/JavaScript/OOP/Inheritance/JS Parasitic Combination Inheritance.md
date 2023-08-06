---
title: JS Parasitic Combination Inheritance
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-06
date modified: 2023-08-06
---

# Kế thừa kết hợp qua trung gian - Parasitic Combination Inheritance

**Kế thừa kết hợp qua trung gian (Parasitic Combination Inheritance)** là một phương pháp kế thừa kết hợp việc sử dụng hàm tạo để kế thừa các thuộc tính không thể chia sẻ và sử dụng kết hợp của chuỗi nguyên mẫu để kế thừa các phương thức và thuộc tính có thể chia sẻ.

Ý tưởng cơ bản của phương pháp này là: **không cần gọi hàm tạo của lớp cha để chỉ định nguyên mẫu cho lớp con, chúng ta chỉ cần một bản sao của nguyên mẫu của lớp cha.** Thực chất, chúng ta sử dụng kế thừa dựa trên nguyên mẫu để kế thừa nguyên mẫu của lớp cha, sau đó gán kết quả này cho nguyên mẫu của lớp con.

```js
function inherit(child, parent) {
  // Tạo một bản sao của nguyên mẫu
  let prototype = Object.create(parent.prototype);

  // Gán thuộc tính constructor cho bản sao
  prototype.constructor = child;

  // Gán bản sao cho nguyên mẫu của lớp con
  child.prototype = prototype;
}
```

Trong ví dụ này, hàm này triển khai một phiên bản đơn giản nhất của kế thừa kết hợp qua trung gian. Hàm này nhận hai tham số: **hàm tạo của lớp con** và **hàm tạo của lớp cha**.

- Bước đầu tiên là tạo một bản sao của nguyên mẫu của lớp cha.
- Bước thứ hai là gán thuộc tính `constructor` cho bản sao này để khắc phục việc ghi đè thuộc tính `constructor` mặc định khi ghi đè nguyên mẫu.
- Cuối cùng, gán bản sao này cho nguyên mẫu của lớp con.

```js
function inherit(child, parent) {
  let prototype = Object.create(parent.prototype);
  prototype.constructor = child;
  child.prototype = prototype;
}

function Parent(name) {
  this.name = name;
  this.num = [0, 1, 2];
}

Parent.prototype.sayName = function() {
  console.log(this.name);
};

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

inherit(Child, Parent);

Child.prototype.sayAge = function() {
  console.log(this.age);
};
```

Giải pháp để khắc phục việc gọi hai lần là sử dụng kế thừa kết hợp qua trung gian.

Kế thừa kết hợp qua trung gian tương tự như kế thừa kết hợp, cả hai đều sử dụng việc mượn hàm tạo để kế thừa các thuộc tính không thể chia sẻ, và sử dụng sự kết hợp của chuỗi nguyên mẫu để kế thừa phương thức và các thuộc tính có thể chia sẻ. Điểm khác biệt duy nhất là kế thừa kết hợp qua trung gian sử dụng kế thừa trung gian thay vì kế thừa nguyên mẫu.

Sử dụng kế thừa kết hợp qua trung gian, chúng ta không cần gọi hàm tạo của lớp cha để chỉ định nguyên mẫu của lớp con, điều này có nghĩa là kế thừa kết hợp chỉ kế thừa các thuộc tính nguyên mẫu của lớp cha, trong khi các thuộc tính của lớp cha được khởi tạo thông qua việc mượn hàm tạo.

Dưới đây là một ví dụ chi tiết về kế thừa kết hợp qua trung gian:

```js
function Parent(name) {
  this.name = name;
  this.num = [0, 1, 2];
}

Parent.prototype.sayName = function() {
  return this.name;
};

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

Child.prototype = Object.create(Parent.prototype);

Child.prototype.constructor = Child;

// Thể hiện đầu tiên
const boy = new Child('Jothan', 22);

boy.num.push(3);
console.log(boy.num);
// [0, 1, 2, 3]

boy.sayName();
// 'Jothan'

// Thể hiện thứ hai
const girl = new Child('Kat', 18);

console.log(girl.num);
// [0, 1, 2]

girl.sayName();
// 'Kat'
```

Điểm mạnh của ví dụ này là chỉ gọi hàm tạo Parent một lần, và do đó tránh việc tạo ra các thuộc tính không cần thiết và dư thừa trên `Child.prototype`. Đồng thời, chuỗi nguyên mẫu vẫn được giữ nguyên.
