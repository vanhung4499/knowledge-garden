---
title: JS Generator
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-08
---

# Generator

Generator function là một giải pháp cho lập trình bất đồng bộ được cung cấp bởi ES6, cú pháp và hành vi của nó hoàn toàn khác biệt so với hàm thông thường.

> Bài viết này tập trung vào cú pháp và API, để biết ứng dụng bất đồng bộ của Generator function, xem [[JS Generator Async|Ứng dụng bất đồng bộ của Generator Function]]

## Hàm Generator

Hàm Generator có nhiều cách hiểu khác nhau. Về mặt cú pháp, ban đầu chúng ta có thể hiểu rằng, hàm Generator là một máy trạng thái, đóng gói nhiều trạng thái nội bộ.

Khi thực thi hàm Generator, nó sẽ trả về một đối tượng lặp, có nghĩa là, ngoài việc là một máy trạng thái, hàm Generator cũng là một hàm tạo đối tượng lặp. Đối tượng lặp được trả về có thể lặp qua từng trạng thái nội bộ của hàm Generator.

### Đặc điểm của hàm

Về hình thức, hàm Generator là một hàm thông thường, nhưng có hai đặc điểm

- Từ khóa `function` và tên hàm có một dấu sao (`*`) ở giữa chúng.
- Bên trong thân hàm sử dụng biểu thức `yield` (nghĩa là `sản xuất`) để định nghĩa các trạng thái nội bộ khác nhau.

```js
function* helloWorldGenerator() {
  yield 'Xin chào';
  yield 'Thế giới';
  return 'Kết thúc';
}

const hw = helloWorldGenerator();
```

Đoạn mã trên định nghĩa một hàm Generator `helloWorldGenerator`, bên trong nó có hai biểu thức `yield` (`Xin chào` và `Thế giới`), có nghĩa là hàm này có ba trạng thái: `Xin chào`, `Thế giới` và câu lệnh `return` (kết thúc thực thi).

### Phương thức gọi

Cách gọi hàm Generator giống như gọi một hàm thông thường, chỉ cần thêm một cặp dấu ngoặc đơn sau tên hàm. Tuy nhiên, sau khi gọi hàm Generator, hàm này **không được thực thi**, và kết quả trả về cũng không phải là kết quả thực thi của hàm, mà là một **đối tượng con trỏ trạng thái nội bộ**, cũng chính là đối tượng lặp (Iterator Object).

Tiếp theo, chúng ta phải gọi phương thức `next` của đối tượng lặp để di chuyển con trỏ sang trạng thái tiếp theo. Nghĩa là, mỗi lần gọi phương thức `next`, con trỏ nội bộ sẽ bắt đầu thực thi từ đầu hàm hoặc từ vị trí dừng lại lần trước, cho đến khi gặp biểu thức `yield` tiếp theo (hoặc câu lệnh `return`). Nói cách khác, hàm Generator được thực thi theo từng đoạn, biểu thức `yield` là dấu hiệu tạm dừng thực thi, và phương thức `next` có thể tiếp tục thực thi.

```js
hw.next();
// { value: 'Xin chào', done: false }

hw.next();
// { value: 'Thế giới', done: false }

hw.next();
// { value: 'Kết thúc', done: true }

hw.next();
// { value: undefined, done: true }
```

Đoạn mã trên gọi phương thức `next` bốn lần.

Lần gọi đầu tiên, hàm Generator bắt đầu thực thi, cho đến khi gặp biểu thức `yield` đầu tiên. Phương thức `next` trả về một đối tượng, thuộc tính `value` của đối tượng đó là giá trị của biểu thức `yield` hiện tại (`Xin chào`), thuộc tính `done` có giá trị `false`, cho biết quá trình lặp chưa kết thúc.

Lần gọi thứ hai, hàm Generator tiếp tục thực thi từ vị trí dừng lại lần trước, cho đến khi gặp biểu thức `yield` tiếp theo. Phương thức `next` trả về đối tượng với thuộc tính `value` là giá trị của biểu thức `yield` hiện tại (`Thế giới`), thuộc tính `done` có giá trị `false`, cho biết quá trình lặp chưa kết thúc.

Lần gọi thứ ba, hàm Generator tiếp tục thực thi từ vị trí dừng lại lần trước, cho đến câu lệnh `return` (nếu không có câu lệnh `return`, thì thực thi cho đến khi hàm kết thúc). Phương thức `next` trả về đối tượng với thuộc tính `value` là giá trị của biểu thức ngay sau câu lệnh `return` (nếu không có câu lệnh `return`, thuộc tính `value` có giá trị `undefined`), thuộc tính `done` có giá trị `true`, cho biết quá trình lặp đã kết thúc.

Lần gọi thứ tư, lúc này hàm Generator đã thực thi xong, phương thức `next` trả về đối tượng với thuộc tính `value` có giá trị `undefined`, thuộc tính `done` có giá trị `true`. Từ đây trở đi, mỗi lần gọi phương thức `next`, giá trị trả về sẽ luôn là giá trị này.

Tóm lại, gọi hàm Generator sẽ trả về một đối tượng lặp, đại diện cho con trỏ nội bộ của hàm Generator. Sau đó, mỗi lần gọi phương thức `next` của đối tượng lặp, sẽ trả về một đối tượng có hai thuộc tính `value` và `done`. Thuộc tính `value` đại diện cho giá trị trạng thái nội bộ hiện tại, là giá trị của biểu thức `yield` sau đó. Thuộc tính `done` là một giá trị boolean, cho biết quá trình lặp đã kết thúc hay chưa.

## Biểu thức yield

Vì đối tượng lặp trả về bởi hàm Generator chỉ duyệt qua các trạng thái nội bộ khi gọi phương thức `next`, nên hàm Generator cung cấp một cách để tạm dừng thực thi. Biểu thức `yield` chính là dấu hiệu tạm dừng đó.

Phương thức `next` của đối tượng lặp hoạt động như sau:

1. Gặp biểu thức `yield`, thực thi tạm dừng và trả về giá trị của biểu thức ngay sau `yield` làm giá trị của thuộc tính `value` trong đối tượng trả về.
2. Khi gọi phương thức `next` lần tiếp theo, tiếp tục thực thi từ vị trí tạm dừng trước đó, cho đến khi gặp biểu thức `yield` tiếp theo.
3. Nếu không còn gặp biểu thức `yield` mới, tiếp tục thực thi cho đến khi hàm kết thúc, hoặc gặp câu lệnh `return`, và trả về giá trị của biểu thức ngay sau câu lệnh `return` làm giá trị của thuộc tính `value` trong đối tượng trả về.
4. Nếu hàm không có câu lệnh `return`, giá trị của thuộc tính `value` trong đối tượng trả về sẽ là `undefined`.

Cần lưu ý rằng, biểu thức ngay sau `yield` chỉ được tính toán khi gọi phương thức `next` và con trỏ nội bộ trỏ đến câu lệnh đó. Điều này có nghĩa là JavaScript cung cấp cú pháp "đánh giá lười biếng" (Lazy Evaluation) để tính toán giá trị chỉ khi cần thiết.

```js
function* gen() {
  yield 123 + 456;
}
```

Trong đoạn mã trên, biểu thức `yield` là `123 + 456`, không được tính toán ngay lập tức, mà chỉ được tính toán khi con trỏ nội bộ di chuyển đến câu lệnh đó.

### yield và return

Biểu thức `yield` và câu lệnh `return` có những điểm tương đồng và khác nhau.

- Tương đồng
  - Cả hai đều có thể trả về giá trị của biểu thức ngay sau câu lệnh hoặc biểu thức.
- Khác nhau
  - **Ghi nhớ vị trí**: Mỗi khi gặp biểu thức `yield`, hàm tạm dừng thực thi và tiếp tục từ vị trí đó khi gọi `next` lần tiếp theo, trong khi câu lệnh `return` không có khả năng ghi nhớ vị trí.
  - **Số lần thực thi**: Một hàm chỉ có thể thực thi một lần (hoặc một câu lệnh) `return`, nhưng có thể thực thi nhiều lần (hoặc nhiều biểu thức) `yield`.
  - **Số lần trả về**: Hàm thông thường chỉ có thể trả về một giá trị, vì chỉ có thể thực thi một câu lệnh `return`; trong khi đó, hàm Generator có thể trả về một chuỗi giá trị, vì có thể có nhiều biểu thức `yield`. Từ một góc độ khác, cũng có thể nói rằng Generator tạo ra một chuỗi giá trị, đó cũng là nguồn gốc của tên gọi của nó.

### Hàm tạm dừng thực thi

Hàm Generator có thể không có biểu thức `yield`, khi đó nó trở thành một hàm tạm dừng thực thi đơn thuần.

```js
function* fn() {
  console.log('Đã thực thi!');
}

var generator = fn();

setTimeout(function() {
  generator.next();
}, 2000);
```

Trong đoạn mã trên, hàm `fn` sẽ không được thực thi khi gán cho biến `generator`. Nhưng vì `fn` là một hàm Generator, nên nó chỉ được thực thi khi gọi phương thức `next`.

### Quy tắc biểu thức

Ngoài ra, cần lưu ý rằng **biểu thức `yield` chỉ có thể được sử dụng trong hàm Generator**, sử dụng ở bất kỳ đâu khác đều sẽ gây lỗi cú pháp.

```js
(function (){
  yield 1;
})()
// SyntaxError: Unexpected number
```

Đoạn mã trên sử dụng biểu thức `yield` trong một hàm thông thường, kết quả là gây ra lỗi cú pháp.

### Biểu thức lồng nhau

Biểu thức `yield` nếu được sử dụng trong một biểu thức khác, phải được đặt trong dấu ngoặc đơn.

```js
function* demo() {
  console.log('Xin chào' + yield); // Lỗi cú pháp
  console.log('Xin chào' + yield 123); // Lỗi cú pháp

  console.log('Xin chào' + (yield)); // Đúng
  console.log('Xin chào' + (yield 123)); // Đúng
}
```

Biểu thức `yield` nếu được sử dụng làm **tham số hàm** hoặc nằm bên phải của **biểu thức gán**, không cần dùng dấu ngoặc đơn.

```js
function* demo() {
  foo(yield 'a', yield 'b'); // Đúng
  let input = yield; // Đúng
}
```

## Phương thức nguyên mẫu

- [Generator.prototype.next](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/next)
- [Generator.prototype.return](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/return)
- [Generator.prototype.throw](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/throw)

**Điểm chung của các phương thức nguyên mẫu**

Cả ba phương thức đều có chức năng là cho phép hàm Generator tiếp tục thực thi và thay thế biểu thức `yield` bằng các câu lệnh khác.

`next()` thay thế biểu thức `yield` bằng một giá trị.

```js
const generator = function*(x, y) {
  let result = yield x + y;
  return result;
};

const gen = generator(1, 2);

gen.next(); // Object {value: 3, done: false}

gen.next(1); // Object {value: 1, done: true}

// Tương đương với việc thay thế let result = yield x + y
// bằng let result = 1;
```

Trong đoạn mã trên, lời gọi `next(1)` thực chất là thay thế biểu thức `yield` bằng giá trị `1`. Nếu không có đối số cho phương thức `next`, nó sẽ được thay thế bằng `undefined`.

`throw()` thay thế biểu thức `yield` bằng một câu lệnh `throw`.

```js
gen.throw(new Error('Lỗi')); // Uncaught Error: Lỗi

// Tương đương với việc thay thế let result = yield x + y
// bằng let result = throw(new Error('Lỗi'));
```

`return()` thay thế biểu thức `yield` bằng một câu lệnh `return`.

```js
gen.return(2); // Object {value: 2, done: true}

// Tương đương với việc thay thế let result = yield x + y
// bằng let result = return 2;
```

## Hàm là thuộc tính của đối tượng

Nếu một thuộc tính của một đối tượng là một hàm Generator, có thể viết gọn như sau.

```js
let obj = {
  *generator() {
    // ···
  },
};
```

Trong đoạn mã trên, thuộc tính `generator` có một dấu sao `*` phía trước, đó là cách viết gọn cho một hàm Generator.

Đây là cách viết đầy đủ tương đương.

```js
let obj = {
  myGeneratorMethod: function*() {
    // ···
  },
};
```

## Phương thức kiểm tra

**Phương thức kiểm tra cho đối tượng Generator**

```js
function isGenerator(obj) {
  return obj && typeof obj.next === 'function' && typeof obj.throw === 'function';
}
```

**Phương thức kiểm tra cho hàm Generator**

```js
function isGeneratorFunction() {
  var constructor = obj.constructor;
  if (!constructor) return false;
  if ('GeratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName)
    return true;
  return isGenerator(constructor.prototype);
}
```

Phương thức kiểm tra trên sử dụng thuộc tính `constructor` của hàm để kiểm tra. Để tương thích với các trình duyệt khác nhau, sử dụng hai thuộc tính `name` và `displayName` để kiểm tra tên của hàm. Việc sử dụng đệ quy để kiểm tra nguyên mẫu của `constructor` là vì có thể có trường hợp sử dụng trình lặp tùy chỉnh.
