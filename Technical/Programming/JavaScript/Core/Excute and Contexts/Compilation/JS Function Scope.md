---
title: JS Function Scope
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Phạm vi của hàm (Function Scope)

**Phạm vi của hàm** đề cập đến việc tất cả các biến thuộc về hàm đó có thể được sử dụng và tái sử dụng trong toàn bộ phạm vi của hàm (thậm chí trong các phạm vi lồng nhau). Điều này rất hữu ích và tận dụng được tính động của JavaScript, trong đó biến có thể thay đổi kiểu giá trị theo nhu cầu.

## Ẩn đi chi tiết bên trong

Truyền thống, chúng ta thường khai báo một hàm trước, sau đó thêm mã vào bên trong nó. Nhưng nếu nghĩ theo chiều ngược lại, nó cũng mang lại một số thông tin: chọn một đoạn mã bất kỳ từ mã đã viết, sau đó bọc nó trong một khai báo hàm, thực tế là ẩn đi đoạn mã đó.

Kết quả thực tế là tạo ra một bong bóng phạm vi xung quanh đoạn mã đó, có nghĩa là bất kỳ khai báo nào (biến hoặc hàm) trong đoạn mã đó sẽ được ràng buộc trong phạm vi của hàm mới được tạo ra, chứ không phải là phạm vi trước đó. Nói cách khác, có thể bọc biến và hàm trong phạm vi của một hàm và sử dụng phạm vi đó để ẩn chúng.

Có nhiều lý do dẫn đến phương pháp ẩn danh này dựa trên phạm vi. Hầu hết chúng xuất phát từ [Principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) trong thiết kế phần mềm.

Nguyên tắc này đề cập đến việc chỉ tiết lộ nội dung cần thiết nhất trong thiết kế API của một mô-đun hoặc đối tượng. Nguyên tắc này có thể được mở rộng để áp dụng cho cách chọn phạm vi để chứa biến và hàm. Nếu tất cả biến và hàm đều nằm trong phạm vi toàn cục, chúng có thể được truy cập từ bất kỳ phạm vi lồng nhau nào. Tuy nhiên, điều này sẽ vi phạm nguyên tắc tối thiểu quyền, vì có thể tiết lộ quá nhiều biến hoặc hàm mà thực tế nên là riêng tư. Một thiết kế tốt hơn sẽ ẩn các nội dung cụ thể này trong phạm vi của một hàm.

🌰 **Ví dụ code**:

```js
function doSomething(a) {
  b = a + doSomethingElse(a * 2);

  console.log(b * 3);
}

function doSomethingElse(a) {
  return a - 1;
}

var b;

doSomething(2);
// 15
```

Trong đoạn mã này, biến `b` và hàm `doSomethingElse` nên là các nội dung riêng tư của cài đặt cụ thể bên trong `doSomething`. Cho phép truy cập từ phạm vi bên ngoài vào `b` và `doSomethingElse` không chỉ không cần thiết mà còn có thể nguy hiểm, vì chúng có thể được sử dụng một cách không mong muốn hoặc không đúng. Một thiết kế tốt hơn sẽ ẩn các nội dung cụ thể này trong `doSomething`.

🌰 **Ví dụ code**:

```js
function doSomething(a) {
  function doSomethingElse(a) {
    return a - 1;
  }

  var b;

  b = a + doSomethingElse(a * 2);

  console.log(b * 3);
}

doSomething(2); // 15
```

Bây giờ, `b` và `doSomethingElse` không thể truy cập từ bên ngoài và chỉ có thể được kiểm soát bởi `doSomething`. Chức năng và kết quả cuối cùng không bị ảnh hưởng, nhưng thiết kế đã ẩn đi các nội dung cụ thể, điều này làm cho phần mềm có thiết kế tốt hơn.

## Tránh xung đột tên

Biến và hàm trong phạm vi ẩn có thể tránh được xung đột giữa các định danh có cùng tên nhưng có mục đích khác nhau. Hai định danh có thể có cùng tên nhưng lại có mục đích khác nhau, và điều này có thể gây ra xung đột tên không mong muốn. Xung đột có thể dẫn đến việc giá trị của biến bị ghi đè một cách không mong muốn.

🌰 **Ví dụ**:

```js
function foo() {
  function bar(a) {
    // Sửa đổi biến i trong phạm vi vòng lặp for
    i = 3;
    console.log(a + i);
  }

  for (var i = 0; i < 10; i++) {
    // Lỗi, vòng lặp vô hạn!
    bar(i * 2);
  }
}

foo();
```

### Không gian tên toàn cục

Một ví dụ điển hình về xung đột biến tồn tại trong phạm vi toàn cục. Khi chương trình tải nhiều thư viện bên thứ ba, nếu chúng không ẩn các hàm hoặc biến riêng tư bên trong một cách hợp lý, xung đột có thể xảy ra dễ dàng.

Thường thì các thư viện này sẽ khai báo một biến có tên độc đáo đủ để sử dụng làm không gian tên cho thư viện. Biến này được sử dụng như một không gian tên cho thư viện, tất cả các chức năng cần được tiết lộ cho bên ngoài đều trở thành các thuộc tính của đối tượng này (không gian tên), thay vì tiết lộ các định danh riêng lẻ trong phạm vi từ điển trên cùng.

```js
const MyReallyCoolLibrary = {
  awesome: 'stuff',
  doSomething: function () {
    // ...
  },
  doAnotherThing: function () {
    // ...
  },
};
```

### Quản lý module

Một cách khác để tránh xung đột là sử dụng một trong nhiều công cụ quản lý module hiện đại. Bằng cách sử dụng các công cụ này, thư viện không cần phải thêm các định danh vào phạm vi toàn cục, mà thay vào đó sẽ nhập các định danh của thư viện một cách rõ ràng vào một phạm vi cụ thể khác.

Rõ ràng là các công cụ này không thể vi phạm quy tắc phạm vi từ điển. Chúng chỉ sử dụng quy tắc phạm vi để buộc tất cả các định danh không được chèn vào phạm vi chia sẻ, mà thay vào đó giữ chúng trong phạm vi riêng tư, không xung đột,

Vì vậy, nếu bạn muốn, bạn có thể đạt được hiệu quả tránh xung đột mà không cần sử dụng bất kỳ công cụ quản lý phụ thuộc nào.

Thêm một hàm bao ngoài đoạn mã bất kỳ sẽ "ẩn" các biến và hàm bên trong định nghĩa của nó, và bên ngoài phạm vi không thể truy cập bất kỳ nội dung nào của hàm bao ngoài.

```js
const a = 2;

function foo() {
  // <-- Thêm dòng này
  const a = 3;
  console.log(a); // 3
} // <-- Và dòng này
foo(); // <-- Và dòng này

console.log(a); // 2
```

Mặc dù kỹ thuật này có thể giải quyết một số vấn đề, nhưng nó không phải là lựa chọn lý tưởng vì nó gây ra một số vấn đề bổ sung. Trước tiên, phải khai báo một hàm có tên `foo()`, có nghĩa là tên `foo` này "lây nhiễm" vào phạm vi chứa nó (trong ví dụ này là phạm vi toàn cục). Thứ hai, phải gọi hàm `foo()` một cách rõ ràng bằng tên hàm để chạy mã bên trong nó.

Nếu hàm không cần tên (hoặc ít nhất là tên hàm không làm ô nhiễm phạm vi chứa nó) và có thể tự động chạy, điều này sẽ lý tưởng hơn.

## Hàm vô danh và hàm có tên

Cả hàm vô danh và hàm có tên đều áp dụng cho **biểu thức hàm**. Khai báo hàm phải có tên, nếu không sẽ bị lỗi.

```js
// Khai báo hàm
function foo() {
  // làm gì đó
}
```

Trong khi đó, biểu thức hàm có thể có hoặc không có tên.

**Biểu thức hàm vô danh:**

```js
let foo = function () {
  // làm gì đó
};
console.log(foo.name);
// foo
```

**Biểu thức hàm có tên:**

```js
// Không nên viết như này
let bar = function foobar() {
  // làm gì đó
};
console.log(bar.name);
// foobar
```

Một trong những tình huống mà chúng ta quen thuộc nhất với biểu thức hàm có lẽ là sử dụng chúng như là các tham số callback.

```js
setTimeout(function () {
  console.log('Tôi đã chờ 1 giây!');
}, 1000);
```

Đây được gọi là **biểu thức hàm vô danh**, vì `function(){}` không có tên định danh.

⚠️ **Lưu ý**: Biểu thức hàm có thể là vô danh, trong khi **khai báo hàm** không thể bỏ qua tên hàm.

Nhược điểm của biểu thức hàm vô danh:

- Hàm vô danh không hiển thị tên hàm có ý nghĩa trong theo dõi ngăn xếp, làm cho việc gỡ lỗi trở nên khó khăn
- Nếu không có tên hàm, khi hàm cần tham chiếu đến chính nó, chỉ có thể sử dụng tham chiếu `arguments.callee` đã bị lỗi. Ví dụ, trong đệ quy, một hàm khác cần tham chiếu đến chính nó, ví dụ là khi bộ lắng nghe sự kiện cần hủy bỏ bộ lắng nghe của chính nó
- Hàm vô danh bỏ qua tên hàm, làm mất đi tính dễ đọc / hiểu được của mã. Một tên mô tả có thể làm cho mã trở nên rõ ràng

Biểu thức hàm có tên rất mạnh mẽ và hữu ích - sự khác biệt giữa vô danh và có tên không ảnh hưởng đến điều này. Đặt tên cho biểu thức hàm có thể giải quyết hiệu quả các vấn đề trên. Luôn đặt tên cho biểu thức hàm là một quy tắc tốt nhất.

## Biểu thức hàm thực thi ngay lập tức IIFE

Biểu thức hàm thực thi ngay lập tức, còn được gọi là **hàm tự thực thi**, được đặt tên là **IIFE** (Immediately Invoked Function Expression).

🌰 **Ví dụ**:

```js
(function () {
  // làm gì đó
  console.log('IIFE');
})();
```

Một ứng dụng tiên tiến khá phổ biến của IIFE là sử dụng chúng như một cuộc gọi hàm và truyền tham số vào.

```js
var a = 2;

(function IIFE(global) {
  var a = 3;
  console.log(a);
  // 3
  console.log(global.a);
  // 2
})(window);

console.log(a);
// 2
```
