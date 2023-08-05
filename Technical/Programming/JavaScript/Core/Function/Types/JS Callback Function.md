---
title: JS Callback Function
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-05
---

# Hàm gọi lại - Callback

Hàm gọi lại là một đoạn mã thực thi được truyền vào như một tham số cho một đoạn mã khác, nó được sử dụng để gọi đoạn mã (hàm gọi lại) này khi cần thiết.

Trong JavaScript, hàm cũng là một loại đối tượng, do đó đối tượng có thể được truyền như một tham số cho một hàm khác, và hàm này được gọi là hàm gọi lại.

**Hàm gọi lại**

```js
function add(num1, num2, callback) {
  const sum = num1 + num2;

  // Sau khi thực hiện phép cộng, truyền tổng vào hàm gọi lại làm tham số
  callback(sum);
}

function print(num) {
  console.log(num);
}

add(1, 2, print);
// 3
```

**Hàm gọi lại ẩn danh**

```js
function add(num1, num2, callback) {
  const sum = num1 + num2;

  // Sau khi thực hiện phép cộng, truyền tổng vào hàm gọi lại làm tham số
  callback(sum);
}

add(1, 2, function(sum) {
  console.log(sum);
  // 3
});
```

## Đặc điểm của hàm gọi lại

### Không thực thi ngay lập tức

Khi một hàm gọi lại được truyền như một tham số cho một hàm khác, chỉ có định nghĩa của hàm được truyền và không thực thi ngay lập tức. Tương tự như các hàm thông thường, hàm gọi lại cũng cần được gọi bằng toán tử `()` để thực thi.

### Là một closure (hàm đóng)

Hàm gọi lại là một closure, có nghĩa là nó có thể truy cập vào các biến bên ngoài phạm vi của nó.

### Kiểm tra kiểu trước khi thực thi

```js
function add(num1, num2, callback) {
  var sum = num1 + num2;
  if (typeof callback === 'function') {
    callback(sum);
  }
}
```

### Sử dụng `this`

Lưu ý rằng trong quá trình gọi hàm gọi lại, ngữ cảnh thực thi của `this` không phải là ngữ cảnh khi hàm gọi lại được định nghĩa, mà là ngữ cảnh nơi hàm gọi nó được đặt.

```js
var obj = {
  sum: 0,
  add: function(num1, num2) {
    this.sum = num1 + num2;
  },
};

function add(num1, num2, callback) {
  callback(num1, num2);
}

add(1, 2, obj.add);

console.log(obj.sum);
// 0

console.log(window.sum);
// 3
```

Trong đoạn mã trên, việc gọi hàm gọi lại xảy ra trong ngữ cảnh toàn cục, do đó `this` trỏ đến `window`, vì vậy giá trị của `sum` được gán cho `window`.

Vấn đề về ngữ cảnh thực thi `this` có thể được giải quyết bằng cách sử dụng phương thức `apply`.

```js
const obj = {
  sum: 0,
  add: function(num1, num2) {
    this.sum = num1 + num2;
  },
};

function add(num1, num2, callbackObj, callback) {
  callback.apply(callbackObj, [num1, num2]);
}

add(1, 2, obj, obj.add);

console.log(obj.sum);
// 3

console.log(window.sum);
// undefined
```

### Cho phép truyền nhiều hàm gọi lại

```js
// Một hàm có thể truyền nhiều hàm gọi lại, ví dụ như trong jQuery

function beforeCallback() {
  // Thực hiện các tác vụ trước khi gửi
}

function successCallback() {
  // Thực hiện các tác vụ khi nhận được thông báo thành công
}

function completeCallback() {
  // Thực hiện các tác vụ khi hoàn thành
}

function errorCallback() {
  // Thực hiện các tác vụ khi nhận được lỗi
}

$.ajax({
  url: 'https://example.com/api/collect',
  before: beforeCallback,
  success: successCallback,
  complete: completeCallback,
  error: errorCallback,
});
```

### Hàm lồng nhau

Một hàm gọi lại có thể chứa một hàm gọi lại khác. Khi có nhiều lớp lồng nhau, mã sẽ trở nên khó đọc và bảo trì, trong trường hợp này, có thể sử dụng hàm gọi lại có tên hoặc quản lý hàm theo cách modulized, hoặc sử dụng Promise để lập trình.

## Ưu điểm và Các trường hợp sử dụng

**Ưu điểm**

- DRY (Don't Repeat Yourself): Tránh việc lặp lại mã code.
- Cho phép trừu tượng hóa logic chung.
- Cải thiện khả năng bảo trì mã.
- Cải thiện khả năng đọc mã.
- Tách biệt các chức năng chuyên môn.

**Các trường hợp sử dụng**

- Lập trình bất đồng bộ.
- Lắng nghe và xử lý sự kiện.
- Sử dụng các phương thức `setTimeout` và `setInterval`.
- Xử lý các chức năng chung để đơn giản hóa logic.
- Các tác vụ đa luồng và đồng bộ.
