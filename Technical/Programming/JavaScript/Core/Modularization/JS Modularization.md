---
title: JS Modularization
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-05
---

# Modularization

🌽 **Modularization** (tạm dịch: "module hóa") là quá trình phân tách một hệ thống phức tạp thành nhiều module để dễ dàng lập trình.

Trong lập trình module, nhà phát triển chia chương trình thành các khối chức năng riêng biệt (discrete chunks of functionality), được gọi là **module**.

- Một chương trình phức tạp được đóng gói thành các khối (tệp) theo một số quy tắc (tiêu chuẩn) nhất định và kết hợp chúng với nhau.
- Dữ liệu bên trong mỗi khối tương đối là riêng tư, chỉ tiếp xúc với bên ngoài thông qua một số giao diện để giao tiếp với các module khác bên ngoài.

Mỗi module có quan hệ tiếp xúc nhỏ hơn so với chương trình hoàn chỉnh, giúp việc kiểm tra, gỡ lỗi và kiểm thử trở nên dễ dàng. Một module được viết cẩn thận cung cấp sự trừu tượng và giới hạn đóng gói đáng tin cậy, làm cho mỗi module trong ứng dụng có thiết kế rõ ràng và mục đích rõ ràng.

## Xu hướng module hóa

### Vấn đề

Cách tổ chức mã nguồn trong quá khứ đã gặp phải các vấn đề sau:

- Xung đột không gian tên
- Không thể quản lý phụ thuộc và phiên bản dự án một cách hợp lý
- Không thể kiểm soát thứ tự tải phụ thuộc một cách dễ dàng
- Khó khăn trong việc bảo trì khi kích thước dự án tăng lên

### Lợi ích

Các lợi ích mà việc thực hiện module hóa có thể mang lại:

- Dễ dàng bảo trì mã nguồn
- Nâng cao khả năng tái sử dụng mã nguồn
- Giảm độ kết nối của mã nguồn (giải kết)
- Tư duy phân chia công việc (phân chia công việc)

## Lịch sử phát triển của Modularization

### Mô hình toàn cầu (Global Pattern)

**module1.js**

```js
// Dữ liệu
let data1 = 'dữ liệu của module một';

// Các hàm thao tác dữ liệu
function foo() {
  console.log(`foo() ${data1}`);
}
function bar() {
  console.log(`bar() ${data1}`);
}
```

**module2.js**

```js
let data2 = 'dữ liệu của module hai';

function foo() {
  // Xung đột với hàm trong module1.js
  console.log(`foo() ${data2}`);
}
```

**test.html**

```html
<!-- Được tải đồng bộ, nếu có xung đột hàm, hàm sau sẽ ghi đè lên hàm trước -->
<script type="text/javascript" src="module1.js"></script>
<script type="text/javascript" src="module2.js"></script>
<script type="text/javascript">
  foo(); // foo() dữ liệu của module hai
  bar(); // bar() dữ liệu của module một
</script>
```

**Giải thích:**

- Mô hình toàn cầu: Đóng gói các chức năng khác nhau thành các hàm toàn cầu
- Vấn đề: Biến toàn cầu bị ô nhiễm, dễ gây xung đột tên

### Mô hình Singleton

**module1.js**

```js
let moduleOne = {
  data: 'dữ liệu của module một',
  foo() {
    console.log(`foo() ${this.data}`);
  },
  bar() {
    console.log(`bar() ${this.data}`);
  },
};
```

**module2.js**

```js
let moduleTwo = {
  data: 'dữ liệu của module hai',
  foo() {
    console.log(`foo() ${this.data}`);
  },
  bar() {
    console.log(`bar() ${this.data}`);
  },
};
```

**test.html**

```html
<script type="text/javascript" src="module1.js"></script>
<script type="text/javascript" src="module2.js"></script>
<script type="text/javascript">
  moduleOne.foo(); // foo() dữ liệu của module một
  moduleOne.bar(); // bar() dữ liệu của module một

  moduleTwo.foo(); // foo() dữ liệu của module hai
  moduleTwo.bar(); // bar() dữ liệu của module hai

  moduleOne.data = 'dữ liệu đã được cập nhật'; // Có thể trực tiếp thay đổi dữ liệu bên trong module
  moduleOne.foo(); // foo() dữ liệu đã được cập nhật
</script>
```

**Giải thích:**

- Mô hình Singleton: Đóng gói đối tượng đơn lẻ
- Tác dụng: Giảm biến toàn cầu (ví dụ: `data` trong hai module không còn là biến toàn cầu nữa, mà là một thuộc tính của đối tượng)
- Vấn đề: Không an toàn, có thể trực tiếp thay đổi dữ liệu bên trong module

### Mô hình IIFE

**module1.js**

```js
(function(window) {
  // Dữ liệu
  let data = 'Dữ liệu của module IIFE';

  // Các hàm thao tác dữ liệu
  function foo() {
    // Hàm được tiếp cận từ bên ngoài
    console.log(`foo() ${data}`);
  }

  function bar() {
    // Hàm được tiếp cận từ bên ngoài
    console.log(`bar() ${data}`);
    otherFun(); // Gọi hàm bên trong
  }

  function otherFun() {
    // Hàm bên trong riêng tư
    console.log('Hàm riêng tư được gọi từ otherFun()');
  }

  // Tiếp cận hàm foo và bar
  window.module = { foo, bar };
})(window);
```

**test.html**

```html
<script type="text/javascript" src="module1.js"></script>
<script type="text/javascript">
  module.foo(); // foo() Dữ liệu của module IIFE
  module.bar(); // bar() Dữ liệu của module IIFE    Hàm riêng tư được gọi từ otherFun()

  // module.otherFun()  // Lỗi, module.otherFun không phải là một hàm

  console.log(module.data); // undefined vì tôi không tiếp cận được với data trong module
  module.data = 'xxxx'; // Không phải thay đổi data bên trong module, mà là thêm thuộc tính data vào module
  module.foo(); // Kiểm tra xem data bên trong có thay đổi không, vẫn in ra foo() Dữ liệu của module IIFE
</script>
```

**Giải thích:**

- Mô hình IIFE: Hàm tự gọi ngay lập tức (closure)
- IIFE: Immediately-Invoked Function Expression (Biểu thức Hàm Gọi Ngay Lập Tức)
- Tác dụng: Dữ liệu là riêng tư, bên ngoài chỉ có thể truy cập thông qua các hàm được tiếp cận
- Vấn đề: Nếu một module hiện tại phụ thuộc vào một module khác thì làm sao? Xem phiên bản IIFE mạnh hơn (phụ thuộc vào jQuery)

### Mô hình IIFE Mạnh hơn

Nhúng jQuery vào dự án

**module1.js**

```js
(function(window, $) {
  // Dữ liệu
  let data = 'Dữ liệu của module IIFE Mạnh hơn';

  // Các hàm thao tác dữ liệu
  function foo() {
    // Hàm được tiếp cận từ bên ngoài
    console.log(`foo() ${data}`);
    $('body').css('background', 'red');
  }

  function bar() {
    // Hàm được tiếp cận từ bên ngoài
    console.log(`bar() ${data}`);
    otherFun(); // Gọi hàm bên trong
  }

  function otherFun() {
    // Hàm bên trong riêng tư
    console.log('Hàm riêng tư được gọi từ otherFun()');
  }

  // Tiếp cận hàm foo và bar
  window.moduleOne = { foo, bar };
})(window, jQuery);
```

**test.html**

```html
<!-- Cần tuân thủ một thứ tự khi nhúng các tệp js -->
<script type="text/javascript" src="jquery-1.10.1.js"></script>
<script type="text/javascript" src="module1.js"></script>
<script type="text/javascript">
  moduleOne.foo(); // foo() Dữ liệu của module IIFE Mạnh hơn và nền trang web sẽ thay đổi màu đỏ
</script>
```

**Giải thích:**

- Mô hình IIFE Mạnh hơn: Nhúng phụ thuộc
- Đây là nền tảng của việc triển khai module hiện đại. Thực sự khá giống nhau, có hai khía cạnh: nhúng và tiếp cận.
- Vấn đề: Một trang web cần nhúng nhiều tệp JS?

## Các giải pháp Modularization

### CommonJS

CommonJS là một quy chuẩn cho module trên máy chủ, và Node.js sử dụng quy chuẩn này. Tuy nhiên, hiện nay nó cũng có thể được sử dụng trên trình duyệt, nhưng cần sử dụng công cụ Browserify để biên dịch và đóng gói trước.

Cách nhập module trong CommonJS sử dụng `require`, và cách xuất module sử dụng `module.exports` hoặc `exports`.

**Đặc điểm**

- Tải các module phụ thuộc đồng bộ
- Có thể sử dụng lại trong môi trường Node
- Cộng đồng module bên thứ ba phát triển mạnh mẽ

> **Giải thích sự khác biệt giữa `module.exports` và `exports` một cách rõ ràng:**

Trong Node.js, `module` là một biến toàn cục, tương tự như cách `window` là một biến toàn cục trong trình duyệt.

Ban đầu, `module.exports` được gán một đối tượng rỗng, và `exports` cũng trỏ đến đối tượng rỗng này.

Mã bên trong:

```js
var module = {
  id: 'xxxx',
  exports: {},
};

var exports = module.exports;
// exports là một tham chiếu đến module.exports
// Nghĩa là exports và module.exports đều trỏ đến cùng một vùng nhớ
```

Trong đoạn mã trên, ta có thể thấy rằng `exports` mà chúng ta thường sử dụng là một tham chiếu đến `module.exports`, cả hai đều trỏ đến cùng một đối tượng.

Một cách ngắn gọn để giải thích là, `require` của module chỉ có thể nhìn thấy `module.exports`, nó không thể nhìn thấy đối tượng `exports`, trong khi chúng ta sử dụng đối tượng `exports` khi viết module.

```js
exports = module.exports;
```

Chúng ta có thể sử dụng `exports.a = 'xxx'` hoặc `exports.b = function() {}` để thêm phương thức hoặc thuộc tính, thực chất chúng ta đang thêm vào đối tượng mà `module.exports` trỏ đến.

Tuy nhiên, chúng ta không thể gán trực tiếp `exports = { a: 'xxx' }`, điều này sẽ gán lại `exports` để trỏ đến một đối tượng mới, khiến cho `exports` và `module.exports` không còn trỏ đến cùng một đối tượng nữa. Và trong Node.js, `require` chỉ có thể nhìn thấy đối tượng mà `module.exports` trỏ đến.

Vì vậy, chúng ta thường sử dụng:

```js
module.exports;
```

Ví dụ khác để giải thích sự khác biệt giữa hai:

```js
function foo() {
  console.log('foo');
}

function bar() {
  console.log('bar');
}
```

Để xuất hai hàm này, chúng ta có thể sử dụng `exports` trực tiếp:

```js
exports.foo = foo;
exports.bar = bar;
```

Hoặc gán cho `module.exports`:

```js
module.exports = {
  foo: foo,
  bar: bar,
};
```

Nhưng không thể gán trực tiếp cho `exports`:

```js
// Sai
exports = {
  foo: foo,
  bar: bar,
};
```

Vì điều này chỉ thay đổi tham chiếu của `exports`, mà không thay đổi `module.exports`.

**Tóm tắt**

**Đặc điểm**: Tải đồng bộ, có bộ nhớ cache

**Sử dụng**: Quan trọng là cách nhập và xuất module

- Nhập module
  - `require(url)` (với `url` là tham số đường dẫn)
  - Đường dẫn: Đường dẫn tùy chỉnh của module phải bắt đầu bằng `./` hoặc `../`
  - Module bên thứ ba/Module tích hợp/Module cốt lõi: Đường dẫn sử dụng tên module
- Xuất module
  - `exports`
  - `module.exports`

Phổ biến trong môi trường máy chủ, nhưng cũng có thể chạy trên trình duyệt, cần sử dụng công cụ [Browserify](https://github.com/browserify/browserify) để biên dịch.

### AMD

> Quy chuẩn CommonJS tải module theo cách đồng bộ, có nghĩa là chỉ khi nào tải xong thì mới thực hiện các hoạt động tiếp theo. Vì Node.js chủ yếu được sử dụng cho lập trình máy chủ, các tệp module thường đã tồn tại trên ổ cứng cục bộ, nên việc tải nhanh, do đó việc tải đồng bộ không gây vấn đề. Tuy nhiên, nếu là trình duyệt, việc tải đồng bộ có thể dễ dàng gây chặn, và đó là lý do tại sao quy chuẩn AMD ra đời. Quy chuẩn AMD cho phép tải module theo cách không đồng bộ và cho phép chỉ định hàm gọi lại. Do đó, trình duyệt thường sử dụng quy chuẩn AMD.

[AMD](https://github.com/amdjs/amdjs-api/wiki) là một quy chuẩn định nghĩa module trong quá trình quảng bá của [require.js](https://github.com/requirejs/requirejs).

**Đặc điểm:**

- Tải module phụ thuộc bất đồng bộ
- Có thể chạy trực tiếp trên trình duyệt mà không cần chuyển đổi mã
- Tải nhiều module song song
- Có thể chạy trên trình duyệt và môi trường Node

**Sử dụng:**

- Xuất module
  - Trong module, sử dụng `return`
- Định nghĩa module
  - `define(['tên module'], function (nội dung xuất module) {})`
  - `require(['tên module'], function (nội dung xuất module) {})`
  - Trong module, có thể sử dụng `require` để định nghĩa module bất đồng bộ
- Module chính:
  - `requirejs.config({})` cấu hình đường dẫn module sử dụng
  - `requirejs(['tên module'], function (nội dung xuất module) {})`
- HTML file sử dụng thẻ `<script>`
  - `<script data-main='app.js' src='require.js'></script>`

AMD (Asynchronous Module Definition - Định nghĩa module bất đồng bộ) chủ yếu được sử dụng trong trình duyệt.

### CMD

CMD (Common Module Definition - Định nghĩa module thông thường) được đề xuất dựa trên cả quy chuẩn CommonJS và AMD.

CMD và AMD khá tương đồng.

`require.js` tuân thủ quy chuẩn AMD (Asynchronous Module Definition - Định nghĩa module bất đồng bộ), trong khi [`sea.js`](https://github.com/seajs/seajs) tuân thủ quy chuẩn CMD (Common Module Definition - Định nghĩa module thông thường).

**Đặc điểm:**

- Tải module bất đồng bộ, có bộ nhớ cache

**Sử dụng:**

- Định nghĩa module
  - `define(function (require, exports, module) {})`
- Nhập module
  - Tải đồng bộ `require()`
  - Tải bất đồng bộ `require.async(['tên module'], function (nội dung xuất module) {})`
- Xuất module
  - `exports`
  - `module.exports`
- HTML file sử dụng thẻ `<script>`
  - `<script src='sea.js'></script>`
  - `<script>seajs.use('app.js')</script>`

`sea.js` và `require.js` đều được sử dụng chủ yếu trong trình duyệt. Tuy nhiên, thực tế ít được sử dụng. Thay vào đó, người ta thường sử dụng `CommonJS` và module ES6 sẽ được giới thiệu ngay sau đây.

### ES6 Module

**Đặc điểm:**

- Nhập module động (tải theo nhu cầu), không có bộ nhớ cache

**Sử dụng:**

- Nhập module sử dụng `import`
  - Xuất chung: `import {nội dung xuất module} from 'đường dẫn module'`
  - Xuất riêng: `import * as m1 from './module1'`
    - Cả hai đều xuất module dưới dạng đối tượng, nên khi nhận giá trị, chỉ có thể sử dụng cú pháp giải nén đối tượng
  - Xuất mặc định: Sử dụng trực tiếp `import nội dung xuất module from 'đường dẫn module'`. Xuất mặc định, có thể xuất bất kỳ kiểu dữ liệu nào, và khi nhận giá trị, sẽ nhận kiểu dữ liệu tương ứng.
- Xuất module sử dụng `export`
  - Xuất riêng (hiếm khi sử dụng)
  - Xuất chung (xuất nhiều nội dung)
  - Xuất mặc định (xuất một nội dung)

Chủ yếu được sử dụng trong trình duyệt, nhưng cũng được sử dụng trong môi trường máy chủ. Tuy nhiên, hiện tại cả trình duyệt và máy chủ đều không hỗ trợ cú pháp module ES6, vì vậy cần sử dụng công cụ để biên dịch và chạy.

- [Babel](https://github.com/babel/babel) để chuyển đổi ES6+ thành ES5- (biên dịch cú pháp module ES6 thành `CommonJS`)
- Browserify để biên dịch cú pháp CommonJS thành cú pháp có thể được trình duyệt nhận dạng

## Chế độ nghiêm ngặt (Strict Mode)

Các module trong ES6 mặc định sử dụng chế độ nghiêm ngặt, bất kể bạn có thêm `'use strict'` ở đầu module hay không.

Chế độ nghiêm ngặt (Strict Mode) có các hạn chế sau:

- Biến phải được khai báo trước khi sử dụng
- Tham số của hàm không được có các thuộc tính trùng tên, nếu có sẽ báo lỗi
- Không được sử dụng câu lệnh `with`
- Không thể gán giá trị cho thuộc tính chỉ đọc (read-only), nếu có sẽ báo lỗi
- Không được sử dụng tiền tố 0 để biểu diễn số hệ bát phân (octal), nếu có sẽ báo lỗi
- Không thể xóa thuộc tính không thể xóa, nếu có sẽ báo lỗi
- Không thể xóa biến (`delete prop`), chỉ có thể xóa thuộc tính của đối tượng (`delete global[prop]`)
- `eval` không đưa biến vào phạm vi bên ngoài của nó
- `eval` và `arguments` không thể gán lại giá trị
- `arguments` không tự động cập nhật khi thay đổi tham số của hàm
- Không thể sử dụng `arguments.callee`
- Không thể sử dụng `arguments.caller`
- Cấm `this` trỏ đến đối tượng toàn cục
- Không thể sử dụng `fn.caller` và `fn.arguments` để lấy ngăn xếp gọi hàm
- Thêm các từ khóa bị cấm (như `protected`, `static` và `interface`)

Trong đó, cần lưu ý đặc biệt về giới hạn của `this`. Trong module ES6, `this` ở mức đỉnh (top-level) sẽ trỏ đến `undefined`, nghĩa là không nên sử dụng `this` ở mức đỉnh của module.

## Modularization và Componentization

Sau khi nói về Modularization, tôi muốn nói về Componentization. Hai khái niệm này đã trở nên phổ biến trong lĩnh vực phát triển front-end.

Trước có Modularization sau có Componentization. Componentization là một sự tiến hóa dựa trên tư duy Modularization, một biến thể của nó. Vì vậy, chúng ta có thể thấy câu nói trong hệ thống kỹ thuật phần mềm: **Modularization là nền tảng của Componentization**.

Componentization và Modularization đều là tư duy **chia để trị**. Tuy nhiên, chúng có điểm nhấn khác nhau.

Componentization tập trung hơn vào mặt giao diện người dùng (UI), nó là một "khối xây dựng" có thể hiển thị nội dung độc lập, ví dụ: một thành phần tiêu đề của trang, bao gồm cấu trúc HTML, kiểu CSS, logic JavaScript và tài nguyên tĩnh hình ảnh. Một trang web được tạo thành từ nhiều thành phần, giống như một "lâu đài" được xây từ nhiều "khối xây dựng".

Hãy tham khảo cách hiểu về Componentization:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230805173649.png)

Ví dụ về thành phần `title` này bao gồm cấu trúc HTML, kiểu CSS, logic JavaScript và tài nguyên tĩnh. Thư mục `header` này có thể được sử dụng trong các dự án khác, nó có tính chất có thể hiển thị nội dung độc lập.

Kết hợp với Modularization đã được đề cập trước đó, toàn bộ dự án front-end có thể được chia thành các khái niệm phát triển như sau:

| Tên     | Mô tả                                            | Ví dụ                                                                                                                   |
| ------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Module JS  | Đơn vị độc lập của thuật toán và dữ liệu                              | Kiểm tra môi trường trình duyệt (detect), yêu cầu mạng (ajax), cấu hình ứng dụng (config), thao tác DOM (dom), các hàm tiện ích (utils) và các đơn vị JS trong thành phần |
| Module CSS | Đơn vị độc lập của kiểu dáng                            | Hệ thống lưới (grid), biểu tượng font (icon-fonts), kiểu dáng hoạt hình (animate) và các đơn vị CSS trong thành phần                                     |
| Trang     | Trạng thái giao diện của phần mềm, là bao gồm các thành phần UI | Trang chủ (index), trang danh sách (list), quản lý người dùng (user)                                                                        |
| Ứng dụng     | Toàn bộ dự án hoặc toàn bộ trang web được gọi là ứng dụng, bao gồm nhiều trang  |                                                                                                                        |

Mối quan hệ giữa chúng được minh họa trong hình dưới đây, một ứng dụng được tạo thành từ nhiều trang như hình dưới đây. Mỗi trang được tạo thành từ nhiều thành phần. Các thành phần có thể phụ thuộc vào các module JS.

Vì vậy, phát triển front-end không chỉ là "vẽ trang web và thực hiện một số hiệu ứng", mà nó là việc xây dựng giao diện người dùng (GUI) cho phần mềm, đó là một kỹ sư phần mềm. Hiện nay, phát triển front-end dựa trên Modularization và Componentization, có thể coi là một dự án kỹ thuật. Từ ứng dụng đơn trang (SPA), chúng ta có thể thấy JavaScript đã cải thiện đáng kể trải nghiệm người dùng của ứng dụng web. Từ việc Google đưa ra PWA (Progressive Web Apps), chúng ta có thể thấy sự phát triển của front-end trong lĩnh vực đa nền tảng.

Tuy nhiên, nếu nhìn từ quan điểm của toàn bộ kỹ thuật phần mềm, chúng ta sẽ nhận ra một sự thật đau lòng: vị trí của lập trình viên front-end trong toàn bộ hệ thống phần mềm quá thấp. Front-end nằm ở tầng trên cùng của hệ thống phần mềm (đầu vào người dùng), do đó không có hệ thống nào khác sẽ sử dụng dịch vụ của hệ thống front-end. Trong khi đó, back-end nằm ở tầng dưới cùng của hệ thống, vừa phục vụ giao diện người dùng, vừa yêu cầu dịch vụ từ trung tâm quản lý và lấy dữ liệu từ tầng dữ liệu, vì vậy vị trí của nó cao hơn. Điều này dẫn đến việc cảm thấy rằng việc đánh giá yêu cầu của front-end thường là bước cuối cùng, vì upstream phụ thuộc vào downstream, nên downstream phải tiến trước, tổng thể sẽ có cảm giác rằng độ tham gia của front-end vào kinh doanh là quá thấp.
