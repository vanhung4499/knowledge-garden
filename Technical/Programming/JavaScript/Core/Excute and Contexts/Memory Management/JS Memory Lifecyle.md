---
title: JS Memory Lifecyle
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-02
date modified: 2023-08-02
---

# Vòng đời của bộ nhớ

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230802230357.png)

Trong môi trường JavaScript, bộ nhớ được cấp phát thường có vòng đời như sau:

1. **Cấp phát bộ nhớ**: Khi chúng ta khai báo biến, hàm, đối tượng, hệ thống sẽ tự động cấp phát bộ nhớ cho chúng.
2. **Sử dụng bộ nhớ**: Đọc và ghi bộ nhớ, tức là sử dụng biến, hàm, v.v.
3. **Thu hồi bộ nhớ**: Khi không còn sử dụng, bộ nhớ không còn được sử dụng sẽ được thu hồi tự động bởi [[JS Garbage Collection|cơ chế thu gom rác]].

🌰 **Ví dụ**:

```js
// Cấp phát không gian bộ nhớ cho biến số
var a = 20;

// Sử dụng bộ nhớ
console.log(a + 80);

// Khi sử dụng xong, giải phóng không gian bộ nhớ
a = null;
```

## Cấp phát bộ nhớ

### Khởi tạo giá trị

Để không làm phiền nhà phát triển trong việc cấp phát bộ nhớ, JavaScript đã thực hiện cấp phát bộ nhớ khi khai báo biến.

```js
// Cấp phát bộ nhớ cho biến số
var a = 123;

// Cấp phát bộ nhớ cho chuỗi
var b = 'Xin chào';

// Cấp phát bộ nhớ cho đối tượng và các giá trị liên quan
var c = {
  a: 1,
  b: null,
};

// Cấp phát bộ nhớ cho mảng và các giá trị liên quan
var d = [0, null, undefined, 'Xin chào'];

// Cấp phát bộ nhớ cho hàm
function e() {
  return 1;
}

// Cấp phát bộ nhớ cho biểu thức hàm
someElement.addEventListener(
  'click',
  function () {
    someElement.style.backgroundColor = 'blue';
  },
  false
);
```

### Cấp phát khi gọi hàm

Kết quả của việc gọi hàm sẽ được cấp phát bộ nhớ.

```js
// Cấp phát đối tượng Date
var f = new Date();

// Cấp phát phần tử DOM
var g = document.createElement('div');
```

Cấp phát biến hoặc đối tượng mới.

```js
var s = 'bingo';
var q = s.substr(0, 3);
// q là một chuỗi mới
// Vì chuỗi là một biến không thể thay đổi
// JavaScript có thể quyết định không cấp phát bộ nhớ
// Chỉ lưu trữ phạm vi [0-3]

var x = ['a', 'b'];
var y = ['c', 'd'];
var z = x.concat(y);
// Mảng mới có bốn phần tử là kết quả của việc nối x và y
```

## Sử dụng bộ nhớ

Quá trình sử dụng giá trị thực tế là hoạt động đọc và ghi vào bộ nhớ đã được cấp phát. Đọc và ghi có thể là ghi vào một biến hoặc một giá trị thuộc tính của một đối tượng, thậm chí là truyền đối số cho một hàm.

## Thu hồi bộ nhớ

Hầu hết các vấn đề quản lý bộ nhớ đều xảy ra ở giai đoạn này. Nhiệm vụ khó khăn nhất ở đây là xác định xem bộ nhớ đã được cấp phát thực sự không còn cần thiết nữa. Điều này đòi hỏi nhà phát triển phải xác định xem trong chương trình, bộ nhớ nào không còn cần thiết và giải phóng nó.

Trình thông dịch ngôn ngữ cao cấp đã tích hợp cơ chế [[JS Garbage Collection|thu gom rác]], nhiệm vụ chính của nó là theo dõi việc cấp phát và sử dụng bộ nhớ, để khi bộ nhớ đã được cấp phát không còn sử dụng, nó sẽ tự động giải phóng. Đây chỉ là một quá trình gần đúng, vì việc xác định xem một bộ nhớ còn cần thiết hay không là [điều không thể quyết định](http://en.wikipedia.org/wiki/Decidability_%28logic%29) (không thể giải quyết bằng một thuật toán).
