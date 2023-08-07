---
title: JS Function Apply
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# Function.prototype.apply

Phương thức `Function.prototype.apply` được sử dụng để chỉ định con trỏ `this` của hàm và cung cấp một danh sách các tham số dạng mảng như là các tham số của hàm được chỉ định.

## Cú pháp

Cú pháp:

```ts
apply(thisArg: any, argArray?: any): any;
```

Tham số:

| Tham số    | Mô tả                                       | Kiểu                   |
| ---------- | ------------------------------------------- | ---------------------- |
| thisArg    | Tham số tùy chọn. Con trỏ `this` của hàm.    | /                      |
| argArray   | Tham số tùy chọn. Danh sách các tham số.     | Array \| TypedArray    |

## Mô tả

`Function.prototype.apply` tương tự như `Function.prototype.call`, khác biệt duy nhất là nó nhận danh sách tham số dưới dạng một mảng thay vì một danh sách các tham số.

Bạn có thể sử dụng đối tượng `arguments` làm đối số `argArray`. `arguments` là một biến cục bộ của hàm, nó có thể được sử dụng để truyền tất cả các tham số chưa được chỉ định của đối tượng được gọi. Điều này cho phép bạn không cần biết tất cả các tham số của đối tượng được gọi khi sử dụng phương thức `apply`. Bạn có thể sử dụng `arguments` để truyền tất cả các tham số cho đối tượng được gọi. Đối tượng được gọi sau đó sẽ xử lý các tham số này.

## Ví dụ

### Thêm phần tử vào mảng

Sử dụng phương thức [Array.prototype.push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) để thêm phần tử vào mảng và phương thức này có thể nhận một số lượng tham số không xác định.

Tuy nhiên, nếu chúng ta muốn truyền một mảng để thêm vào mảng, nó sẽ được thêm vào như một phần tử duy nhất thay vì thêm từng phần tử riêng lẻ, do đó chúng ta sẽ có một mảng trong một mảng.

Trong trường hợp này, mặc dù chúng ta có thể sử dụng [Array.prototype.concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) để đạt được hành vi mong muốn, nhưng nó không thêm vào mảng ban đầu mà tạo và trả về một mảng mới.

Thay vào đó, chúng ta có thể sử dụng `Function.prototype.apply` để đạt được yêu cầu này.

```js
const foo = [];
const bar = [1, 2, 3, 4];

foo.push.apply(foo, bar);

console.log(foo);
// [1, 2, 3, 4]
```

### Sử dụng hàm tích hợp

Chúng ta có thể sử dụng `Function.prototype.apply` để thực hiện các nhiệm vụ mà ban đầu yêu cầu lặp qua một mảng biến.

Ví dụ dưới đây sử dụng `Math.max` và `Math.min` để tìm giá trị lớn nhất / nhỏ nhất trong một mảng.

```js
const foo = [2, 4, 6, 8, 10];

const max = Math.max.apply(null, foo);
const min = Math.min.apply(null, foo);
```

⚠️ **Lưu ý**: Sử dụng `Function.prototype.apply` như trên có thể gặp rủi ro vượt quá giới hạn độ dài tham số của JavaScript Engine. Khi truyền một số lượng lớn tham số cho một hàm (ví dụ: 10.000), có nguy cơ vượt quá giới hạn và gây ra lỗi. Giới hạn này được xác định bởi JavaScript Engine cụ thể và có thể khác nhau (JavaScript Core đã cố định giới hạn số lượng tham số là 65.536). Điều tồi tệ hơn là một số JavaScript Engine khác có thể giới hạn số lượng tham số được truyền vào một phương thức, dẫn đến mất mát tham số.

Nếu mảng tham số có thể rất lớn, bạn có thể xử lý như sau: chia nhỏ mảng tham số và lặp lại việc truyền vào phương thức đích.

```js
function minOfArray(arr) {
  var min = Infinity;
  var QUANTUM = 32768;

  for (var i = 0, len = arr.length; i < len; i += QUANTUM) {
    var submin = Math.min.apply(null, arr.slice(i, Math.min(i + QUANTUM, len)));
    min = Math.min(submin, min);
  }

  return min;
}

var min = minOfArray([5, 6, 2, 3, 7]);
```

## Cài đặt tương thích

Cài đặt:

1. Đảm bảo người gọi `call` là một hàm.
2. Tham số: Chuyển đổi mảng tham số thành một mảng. ❗️ (Quan trọng)
3. Ngữ cảnh thực thi: Đảm bảo ngữ cảnh `context` thực thi, sử dụng biến toàn cục `window` nếu không có.
4. Gán `this` (hàm người gọi) cho ngữ cảnh thực thi, sử dụng `Symbol` để tạo tên thuộc tính duy nhất.
5. Thực thi hàm người gọi và lưu kết quả thực thi. ❗️ (Quan trọng)
6. Xóa cặp khóa giá trị của người gọi (ngữ cảnh thực thi).
7. Trả về kết quả.

Khác biệt so với [[JS Function Call|Function.prototype.call]] chỉ là cách truyền tham số.

```js
Function.prototype.call = function (context) {
  // context là tham số đầu tiên trong cuộc gọi của call

  // Đầu tiên, hãy đảm bảo rằng người gọi call là một hàm
  if (typeof this !== 'function') {
    throw new TypeError('Người gọi phương thức call không phải là một hàm.');
  }

  // Lưu trữ các tham số được cung cấp bởi người gọi
  const args = arguments[1];

  // Xác định kiểu của ngữ cảnh thực thi, vì có thể truyền null và undefined
  context = context || window;

  // Gán nội dung của người gọi là một thuộc tính của ngữ cảnh thực thi, để đảm bảo không xung đột với các khóa trong ngữ cảnh thực thi
  const fn = Symbol('fn');

  context[fn] = this;

  // Thực thi hàm đã lưu, lúc này phạm vi sẽ được thực thi trong ngữ cảnh của đối tượng gọi, thay đổi con trỏ `this`
  const result = context[fn](...args);

  // Xóa thuộc tính vừa thêm
  delete context[fn];

  // Trả về kết quả thực thi
  return result;
};
```
