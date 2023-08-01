---
title: JS Hoisting
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Hoisting

Quá trình chạy chương trình JavaScript được chia thành hai giai đoạn: **giai đoạn biên dịch** và **giai đoạn thực thi**.

Trong giai đoạn biên dịch, trình thông dịch JavaScript sẽ thực hiện một công việc, đó là đọc `khai báo biến` và `xác định phạm vi hoạt động` của chúng.

- **Khai báo biến**
    
    - Biến được khai báo bằng từ khóa `var` hoặc `let`, nếu chưa gán giá trị, giá trị của biến sẽ là `undefined`.
    - Nếu biến được khai báo bằng từ khóa `const` nhưng không được gán giá trị, sẽ gây ra lỗi.
- **Phạm vi biến**
    
    - Biến toàn cục có phạm vi trên toàn bộ chương trình.
    - Biến cục bộ chỉ có phạm vi trong hàm và các hàm lồng nhau.

Trong JavaScript, việc sử dụng biến hoặc hàm mà chưa được khai báo sẽ gây ra lỗi.

```js
console.log(a);
// Uncaught ReferenceError: a is not defined
```

**Hoisting được sinh ra để giải quyết vấn đề này**

**Khai báo được nâng lên (hoisting)** bao gồm **khai báo biến được nâng lên** và **khai báo hàm được nâng lên**:

- **Khai báo biến được nâng lên**: Biến được khai báo bằng từ khóa `var`, `let` và `const` sẽ được trình thông dịch JavaScript nâng lên đầu phạm vi hiện tại trước khi thực thi mã.
    
- **Khai báo hàm được nâng lên**: Hàm được khai báo bằng cách sử dụng khai báo hàm (không phải biểu thức hàm) sẽ được trình thông dịch JavaScript nâng lên đầu phạm vi hiện tại trước khi thực thi mã, và **khai báo hàm được nâng lên ưu tiên hơn khai báo biến được nâng lên**.

Mã JavaScript được biên dịch trước khi thực thi, trong quá trình biên dịch, trình thông dịch JavaScript sẽ tìm tất cả các khai báo và thiết lập phạm vi cho chúng, do đó, tất cả các khai báo trong **phạm vi hiện tại** bao gồm cả biến và hàm sẽ được xử lý trước bất kỳ mã nào được thực thi.

Lưu ý rằng chỉ có **khai báo** được nâng lên, **gán giá trị** không được nâng lên, khai báo được thực hiện trong giai đoạn biên dịch, trong khi gán giá trị được thực hiện trong giai đoạn thực thi. Điều này có nghĩa là khai báo được nâng lên, trong khi gán giá trị vẫn ở nguyên chỗ, chờ đợi thực thi.

## Khai báo biến được nâng lên

Dưới đây là ví dụ về khai báo biến được nâng lên theo chuẩn.

```js
console.log(a);
var a = 2;
console.log(a);
```

Tương đương với:

```js
var a;
// Khai báo biến, mặc định gán giá trị là undefined

console.log(a);
// In ra giá trị của biến a là undefined

a = 2;
// Gán giá trị 2 cho biến a

console.log(a);
// In ra giá trị của biến a là 2
```

Ở đây, chúng ta sử dụng được khai báo biến được nâng lên, trong khi việc gán giá trị vẫn giữ nguyên tại chỗ, chờ đợi thực thi.

## Khai báo hàm được nâng lên

Có hai cách tạo hàm trong JavaScript:

- Khai báo hàm
- Biểu thức hàm

🌰 **Ví dụ mã: Khai báo hàm**

```js
foo();
// In ra 'bar'

function foo() {
  console.log('bar');
}
```

🌰 **Ví dụ mã: Biểu thức hàm**

```js
foo();
// Lỗi: foo không phải là một hàm

var foo = function () {
  console.log('bar');
};
```

Giải thích: Dù cả hai ví dụ đều gọi hàm trước khi tạo hàm, kết quả lại khác nhau. Nguyên nhân là khi sử dụng khai báo hàm, **khai báo hàm** (bao gồm cả định nghĩa) sẽ được nâng lên đến đầu phạm vi, trong khi cách tạo biểu thức chỉ nâng lên biến `foo` đến đầu phạm vi và tại thời điểm đó, `foo` có giá trị là `undefined`, do đó gọi `foo` sẽ gây ra lỗi: `foo` không phải là một hàm.

Hãy xem ví dụ khác:

```js
var foo = function () {
  console.log('1');
};

function foo() {
  console.log('2');
}

foo();
// '1'
```

Sau khi được nâng lên trong giai đoạn biên dịch, kết quả của đoạn mã trên tương đương với:

```js
// Khai báo biến được nâng lên
const foo;

// Khai báo hàm được nâng lên
function foo(){
  console.log('2');
}

// Gán giá trị biến vẫn giữ nguyên tại chỗ, hàm foo bị ghi đè
foo = function(){
  console.log('1');
};

foo();
// '1'
```

Tóm lại:

- Khai báo hàm được nâng lên, đưa cả khai báo và định nghĩa hàm lên đầu phạm vi.
- Khai báo biến được nâng lên, chỉ nâng lên phần khai báo (trạng thái chưa gán giá trị), phần gán giá trị vẫn giữ nguyên tại chỗ.

## Ghi đè hàm

Khai báo hàm và khai báo biến đều được nâng lên. Tuy nhiên, **khai báo hàm sẽ ghi đè lên khai báo biến**.

🌰 **Ví dụ mã:**

```js
var a;

function a() {}

console.log(a);
// 'function a(){}'
```

Tuy nhiên, nếu biến đã được gán giá trị, giá trị cuối cùng sẽ là giá trị của biến.

```js
var a = 1;
function a() {}
console.log(a);
// 'function a(){}'

var a;
function a() {}
console.log(a);
// 'function a(){}'

a = 1;
console.log(a);
// 1
```

**Việc khai báo biến lặp lại là vô ích**, nhưng **khai báo hàm lặp lại sẽ ghi đè lên khai báo trước đó** (bất kể là khai báo biến hay khai báo hàm).

### Khai báo lặp lại vô hiệu

```js
var a = 1;
var a;
console.log(a);
```

Kết quả là 1, đoạn mã trên tương đương với:

```js
// Khai báo biến được nâng lên
const a;

a = 1;

console.log(a);
// 1
```

### Ưu tiên khai báo hàm

Do khai báo hàm được nâng lên trước khai báo biến, nên khai báo biến sẽ không có hiệu lực.

```js
var a;

function a() {
  console.log(1);
}

a();
// 1
```

### Ghi đè khai báo hàm

Khai báo hàm sau sẽ ghi đè lên khai báo hàm trước đó.

```js
a();
// 2

function a() {
  console.log(1);
}

function a() {
  console.log(2);
}
```

Vì vậy, tránh khai báo lặp lại trong cùng một phạm vi.
