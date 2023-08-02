---
title: JS Variable Object
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Đối tượng biến

Đối tượng biến (Variable Object) là phạm vi dữ liệu liên quan đến [[JS Excution Context Stack]], lưu trữ các **biến** và **khai báo hàm** được định nghĩa trong ngữ cảnh đó.

Vì đối tượng biến trong các ngữ cảnh thực thi khác nhau có một số khác biệt nhỏ, vì vậy chúng ta hãy nói về đối tượng biến trong [ngữ cảnh thực thi toàn cục](#ngữ-cảnh-thực-thi-toàn-cục) và [ngữ cảnh thực thi hàm](#ngữ-cảnh-thực-thi-hàm).

## Ngữ cảnh thực thi toàn cục

💡 **Đối tượng biến trong ngữ cảnh thực thi toàn cục chính là đối tượng toàn cục**

Trước tiên, chúng ta hãy hiểu một khái niệm gọi là đối tượng toàn cục. Nó cũng được giới thiệu trong [W3School](http://www.w3school.com.cn/jsref/jsref_obj_global.asp):

**Đối tượng toàn cục** là một đối tượng được định nghĩa trước, là một giữ chỗ cho các hàm toàn cục và các thuộc tính toàn cục của JavaScript. Bằng cách sử dụng đối tượng toàn cục, bạn có thể truy cập tất cả các đối tượng, hàm và thuộc tính được định nghĩa trước khác.

Trong mã JavaScript ở mức đỉnh, bạn có thể sử dụng từ khóa `this` để tham chiếu đến đối tượng toàn cục. Vì đối tượng toàn cục là đầu của chuỗi phạm vi, điều này có nghĩa là tất cả các biến và tên hàm không được giới hạn sẽ được tìm kiếm như là các thuộc tính của đối tượng này.

Nếu bạn không hiểu rõ, hãy để tôi giới thiệu về đối tượng toàn cục:

1. Có thể tham chiếu bằng từ khóa `this`, trong JavaScript, đối tượng toàn cục chính là đối tượng Window.

```js
console.log(this);
// Window { ... }
```

2. Đối tượng toàn cục được khởi tạo bởi đối tượng Object.

```js
console.log(this instanceof Object);
// true
```

3. Chứa các hàm và thuộc tính toàn cục được định nghĩa sẵn, có thể gọi ở bất kỳ đâu.

```js
console.log(Math.random === this.Math.random);
// true

console.log(Math.PI === this.Math.PI);
// true
```

4. Là chủ nhân của các biến toàn cục.

```js
const a = 'foo';

console.log(this.a);
// foo
```

5. Trong JavaScript, đối tượng toàn cục có thuộc tính Window trỏ đến chính nó.

```js
const a = 'foo';
console.log(window.a);
// 'foo'

this.window.b = 'foo';
console.log(this.b);
// 'foo'
```

## Ngữ cảnh thực thi hàm

Trong ngữ cảnh thực thi hàm, chúng ta sử dụng thuật ngữ **đối tượng hoạt động** (Activation Object, AO) để đại diện cho đối tượng biến.

**Đối tượng hoạt động** và **đối tượng biến** thực chất là cùng một thứ, chỉ khác nhau ở chỗ đối tượng biến là một khái niệm được quy định hoặc được hiện thực trong các quy tắc, không thể truy cập trong môi trường JavaScript, chỉ khi một ngữ cảnh thực thi được nhập vào, đối tượng biến của ngữ cảnh thực thi đó mới được kích hoạt, vì vậy mới gọi là Đối tượng Hoạt động, và chỉ có **đối tượng hoạt động** được kích hoạt, nghĩa là các thuộc tính trên đối tượng hoạt động mới có thể được truy cập.

Đối tượng hoạt động được tạo ra khi một ngữ cảnh thực thi hàm được nhập vào, nó được khởi tạo bằng thuộc tính `arguments` của hàm. Giá trị thuộc tính `arguments` là đối tượng [Arguments](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments).

## Quá trình thực thi

Mã ngữ cảnh thực thi sẽ được xử lý qua hai giai đoạn:

1. **Phân tích**: Vào ngữ cảnh thực thi
2. **Thực thi**: Thực thi mã

### Đối tượng biến trong giai đoạn vào ngữ cảnh thực thi

Khi vào ngữ cảnh thực thi, lúc này chưa thực thi mã, quá trình tạo đối tượng biến sẽ trải qua các bước sau:

1. Các tham số hàm (nếu là ngữ cảnh thực thi hàm)
   - Tạo đối tượng Arguments
   - Kiểm tra các tham số của ngữ cảnh hiện tại và tạo các thuộc tính của đối tượng biến với tên và giá trị tương ứng
   - Nếu không có đối số thực, giá trị thuộc tính được đặt là `undefined`
2. Khai báo hàm
   - Kiểm tra các khai báo hàm trong ngữ cảnh hiện tại, cũng chính là các hàm được khai báo bằng từ khóa `function`
   - Tạo một thuộc tính trên đối tượng biến với tên hàm và giá trị là một tham chiếu đến địa chỉ bộ nhớ của hàm đó
   - Nếu đối tượng biến đã tồn tại một thuộc tính cùng tên, thuộc tính đó sẽ bị ghi đè bởi tham chiếu mới
3. Khai báo biến
   - Kiểm tra các khai báo biến trong ngữ cảnh hiện tại
   - Mỗi khi tìm thấy một khai báo biến, tạo một thuộc tính trên đối tượng biến với tên biến và giá trị là `undefined`
   - Nếu tên biến trùng với các tham số hàm hoặc các hàm đã khai báo, khai báo biến sẽ không ảnh hưởng đến các thuộc tính đã tồn tại (có thể hiểu là để tránh việc ghi đè thuộc tính biến cùng tên thành `undefined`, nó sẽ bỏ qua và giữ nguyên giá trị thuộc tính ban đầu)

🌰 **Ví dụ**:

```js
function foo(a) {
  var b = 2;

  function c() {}

  var d = function () {};

  b = 3;
}
```

Sau khi vào ngữ cảnh thực thi, đối tượng hoạt động AO sẽ là:

```js
AO = {
  arguments: {
      0: 1,
      length: 1
  },
  a: 1,
  b: undefined,
  c: reference to function() {},
  d: undefined
}
```

### Đối tượng biến trong giai đoạn thực thi mã

Trong giai đoạn thực thi mã, đối tượng biến sẽ được sửa đổi giá trị dựa trên mã được thực thi.

Vẫn giữ ví dụ trên, sau khi thực thi mã, đối tượng hoạt động AO sẽ là:

```js
AO = {
  arguments: {
    0: 1,
    length: 1
  },
  a: 1,
  b: 3,
  c: reference to function c(){},
  d: reference to FunctionExpression "d"
}
```

Sau đây, chúng ta sẽ tóm tắt quá trình tạo đối tượng biến như sau:

1. Đối tượng biến của ngữ cảnh thực thi toàn cục được khởi tạo là đối tượng toàn cục
2. Đối tượng biến của ngữ cảnh thực thi hàm chỉ bao gồm đối tượng Arguments
3. Khi vào ngữ cảnh thực thi, các thuộc tính ban đầu như tham số hàm, khai báo hàm và khai báo biến được thêm vào đối tượng biến
4. Trong giai đoạn thực thi mã, đối tượng biến sẽ được sửa đổi giá trị thuộc tính

## Đối tượng biến và đối tượng hoạt động

> VO và AO có mối quan hệ gì?

Trước khi vào giai đoạn thực thi, các thuộc tính trong đối tượng biến (VO: Variable Object) không thể truy cập.

Tuy nhiên, sau khi vào giai đoạn thực thi, đối tượng hoạt động (AO: Activation Object) được kích hoạt và các thuộc tính trong đó, bao gồm VO, các tham số truyền vào khi thực thi hàm và đối tượng Arguments, đều có thể truy cập được. Sau đó, giai đoạn thực thi bắt đầu.

Quan hệ giữa chúng có thể được diễn tả bằng công thức đơn giản:

```js
AO = VO + các tham số hàm + arguments
```
