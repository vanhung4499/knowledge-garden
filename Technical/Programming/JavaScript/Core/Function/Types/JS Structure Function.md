---
title: JS Structure Function
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-05
---

# Hàm tạo

Trong các ngôn ngữ hướng đối tượng (OOP) điển hình như Java, có khái niệm về lớp, lớp là mẫu của đối tượng, và đối tượng là một thể hiện của lớp. Tuy nhiên, trong JavaScript không có khái niệm về lớp, JavaScript không dựa trên lớp, mà thay vào đó sử dụng hàm tạo (constructor) và chuỗi nguyên mẫu (prototype chains) để thực hiện. Tuy nhiên, trong ES6 đã giới thiệu khái niệm lớp (class), là mẫu của đối tượng, cú pháp `class` mới chỉ làm cho cách viết đối tượng nguyên mẫu trở nên rõ ràng hơn, nhưng không tập trung vào điều này.

## Đặc điểm

Các đặc điểm của hàm tạo:

1. Chữ cái đầu tiên của hàm tạo phải viết hoa, để phân biệt với hàm thông thường.
2. Sử dụng đối tượng `this` bên trong để trỏ đến đối tượng thực sự sẽ được tạo ra.
3. Sử dụng từ khóa `new` để tạo ra đối tượng thực thể.

```js
function Person(name, age){
  this.name = name;
  this.age = age;
  this.sayHello = function(){
    console.log(this.name + " say hello");
  }
}

const foo = new Person('Bella', 23);

foo.sayHello();
// Bella say hello
```

## Nhược điểm

Nhược điểm của hàm tạo:

1. Tất cả các thực thể đều được tham chiếu đến `prototype` thông qua chuỗi nguyên mẫu.
2. `prototype` tương đương với một bộ chứa công cộng mà tất cả các thực thể của một loại cụ thể có thể truy cập.
3. Vì vậy, chúng ta có thể đặt những thứ lặp lại vào bộ chứa công cộng này.

## Tác dụng

Tác dụng của thuộc tính `constructor`:

1. Phân biệt đối tượng nguyên mẫu là của lớp nào.

```js
function Person(){};

const person1 = new Person();

console.log(person1.constructor === Person);
// true
```

2. Tạo một thực thể khác từ một thực thể đã có.

```js
function Person(){};

const person1 = new Person(){};
const person2 = new person1.constructor();

console.log(person2 instanceof Person);
// true
```

3. Vì thuộc tính `constructor` là một mối quan hệ giữa đối tượng nguyên mẫu và hàm tạo, nên khi thay đổi đối tượng nguyên mẫu, cần chú ý đến việc chỉ định `constructor` để tránh làm mất tính chính xác của `instanceof`.

## So sánh với hàm thông thường

Về quy tắc đặt tên, hàm tạo thường viết hoa chữ cái đầu tiên, trong khi hàm thông thường tuân theo quy tắc viết thường chữ cái đầu tiên.

Khi gọi hàm:

| Hàm tạo                                         | Hàm thông thường                                              |
| :---------------------------------------------- | :------------------------------------------------------------ |
| `new Fn()`                                     | `fn()`                                                       |
| Bên trong hàm tạo sẽ tạo ra một đối tượng mới, tức là thực thể của `Fn` | Không tạo ra đối tượng mới trong bên trong hàm                 |
| `this` bên trong hàm trỏ đến thực thể mới tạo ra của `Fn` | `this` bên trong hàm trỏ đến đối tượng gọi hàm (nếu không có đối tượng gọi, mặc định là `window`) |
| Giá trị trả về mặc định là thực thể mới của `Fn` | Giá trị trả về được quyết định bởi câu lệnh `return`             |

Giá trị trả về của hàm tạo:

Mặc định là một thực thể mới được tạo ra.

Khi thêm giá trị trả về thủ công (`return` statement):

1. Nếu giá trị trả về là kiểu dữ liệu cơ bản, thì giá trị trả về thực sự vẫn là thực thể mới được tạo ra.
2. Nếu giá trị trả về là kiểu dữ liệu phức tạp (đối tượng), thì giá trị trả về thực sự là đối tượng đó.

