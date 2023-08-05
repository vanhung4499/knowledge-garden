---
title: JS Constructor Pattern
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-06
date modified: 2023-08-06
---

# Mô hình hàm tạo - Contructor Pattern

Trong ECMAScript, hàm tạo được sử dụng để tạo ra các đối tượng của một loại cụ thể. Các hàm tạo nguyên bản như Object và Array sẽ tự động xuất hiện trong môi trường thực thi. Ngoài ra, bạn cũng có thể tạo ra các hàm tạo tùy chỉnh để định nghĩa các loại đối tượng tùy chỉnh với các thuộc tính và phương thức của chúng.

```js
function Person(name, age, job){
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function(){
    console.log(this.name);
  }
}

const person1 = new Person('Ben', 21, 'Student');
const person2 = new Person('Gray', 25, 'Doctor');
```

Mô hình hàm tạo khác với mô hình nhà máy trong quá trình triển khai:

- Không tạo đối tượng một cách rõ ràng
- Gán thuộc tính và phương thức trực tiếp cho đối tượng `this`
- Không có câu lệnh `return`

Theo quy ước, hàm tạo luôn bắt đầu bằng một chữ cái viết hoa, trong khi các hàm không phải là hàm tạo sẽ bắt đầu bằng một chữ cái viết thường. Quy ước này được mượn từ các ngôn ngữ hướng đối tượng khác và chủ yếu để phân biệt với các hàm khác trong ECMAScript. Vì hàm tạo cũng là một hàm, chỉ khác là nó có thể được sử dụng để tạo đối tượng.

## Sử dụng hàm tạo như một hàm

Hàm tạo khác với các hàm khác duy nhất ở chỗ cách gọi chúng. Tuy nhiên, hàm tạo cũng chỉ là một hàm và không có cú pháp đặc biệt để định nghĩa hàm tạo. Bất kỳ hàm nào, nếu được gọi bằng toán tử `new`, thì nó có thể được sử dụng như một hàm tạo; và bất kỳ hàm nào, nếu không được gọi bằng toán tử `new`, thì nó sẽ giống như một hàm thông thường.

## Vấn đề với hàm tạo

Sử dụng hàm tạo, mỗi phương thức phải được tạo lại trên mỗi thể hiện. Đừng quên rằng, trong ECMAScript, hàm là đối tượng, vì vậy mỗi khi bạn định nghĩa một hàm, bạn đang tạo một thể hiện của đối tượng.

Mặc dù hai thể hiện có cùng tên phương thức, nhưng hai hàm không phải là cùng một thể hiện của Function.

```js
function Person(name, age, job){
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = new Function('console.log(this.name)');
  // Tương đương với việc khai báo hàm
}
```

Nhìn từ góc độ này, mô hình hàm tạo trở nên dễ hiểu hơn về bản chất của việc mỗi thể hiện chứa một thể hiện Function khác nhau. Nói cách khác, việc tạo ra hai hàm hoàn toàn giống nhau là không cần thiết, đặc biệt là khi có đối tượng `this` có sẵn để gắn kết hàm vào đó. Di chuyển định nghĩa hàm ra khỏi hàm tạo để giải quyết vấn đề tạo ra nhiều thể hiện hàm giống nhau.

```js
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = sayName;
}

function sayName(){
  console.log(this.name);
}

const person1 = new Person('Ben', 21, 'Student');
const person2 = new Person('Gray', 25, 'Doctor');
```

Việc định nghĩa hàm trong phạm vi toàn cục thực tế chỉ có thể được gọi bởi một đối tượng cụ thể, điều này khiến phạm vi toàn cục trở nên không thực tế. Điều này càng không chấp nhận được hơn khi đối tượng cần định nghĩa nhiều phương thức, điều này làm cho kiểu tham chiếu tùy chỉnh của chúng ta không có tính đóng gói. Và các vấn đề này có thể được giải quyết bằng [[JS Prototype Pattern|mô hình nguyên mẫu]].

## Triển khai bằng ES6 Module

Cơ chế triển khai cơ bản giống với ES5, chỉ có cú pháp ngắn gọn hơn.

```js
class Person {
  constructor(name, age, job) {
    this.name = name;
    this.age = name;
    this.job = job;
  }

  sayName() {
    console.log(this.name);
  }
}
```
