---
title: Hello TypeScript
tags:
  - ts
categories: ts
date created: 2023-12-28
date modified: 2023-12-28
---

# Hello TypeScript

Chúng ta bắt đầu với một ví dụ đơn giản.

Sao chép đoạn mã sau vào tệp `hello.ts`:

```ts
function sayHello(person: string) {
    return 'Hello, ' + person;
}

let user = 'Tom';
console.log(sayHello(user));
```

Sau đó, chạy lệnh:

```bash
tsc hello.ts
```

Điều này sẽ tạo ra một tệp đã biên dịch `hello.js`:

```js
function sayHello(person) {
    return 'Hello, ' + person;
}
var user = 'Tom';
console.log(sayHello(user));
```

Trong TypeScript, chúng ta sử dụng `:` để chỉ định kiểu dữ liệu của biến, không có hoặc có khoảng trắng trước và sau `:` đều được chấp nhận.

Trong ví dụ trên, chúng ta sử dụng `:` để chỉ định kiểu dữ liệu của tham số `person` là `string`. Tuy nhiên, sau khi biên dịch thành js, không có mã kiểm tra nào được chèn vào để kiểm tra kiểu dữ liệu.

Điều này xảy ra vì **TypeScript chỉ kiểm tra kiểu dữ liệu tĩnh trong quá trình biên dịch, nếu phát hiện lỗi, quá trình biên dịch sẽ báo lỗi**. Trong quá trình chạy, giống như các tệp JavaScript thông thường, không có kiểm tra kiểu dữ liệu.

Nếu chúng ta muốn đảm bảo kiểu dữ liệu tham số trong quá trình chạy, chúng ta vẫn phải kiểm tra kiểu dữ liệu thủ công:

```ts
function sayHello(person: string) {
    if (typeof person === 'string') {
        return 'Hello, ' + person;
    } else {
        throw new Error('person is not a string');
    }
}

let user = 'Tom';
console.log(sayHello(user));
```

> `let` là từ khóa của ES6, tương tự như `var`, được sử dụng để định nghĩa một biến cục bộ, bạn có thể tham khảo [[JS Block Scope#let|JS Let]].

Hãy thử biên dịch đoạn mã này:

```ts
function sayHello(person: string) {
    return 'Hello, ' + person;
}

let user = [0, 1, 2];
console.log(sayHello(user));
```

Trình biên tập sẽ cung cấp lỗi và quá trình biên dịch cũng sẽ báo lỗi:

```bash
hello.ts:6:22 - error TS2345: Argument of type 'number[]' is not assignable to parameter of type 'string'.
```

Tuy nhiên, tệp js vẫn được tạo ra:

```js
function sayHello(person) {
    return 'Hello, ' + person;
}
var user = [0, 1, 2];
console.log(sayHello(user));
```

Điều này xảy ra vì **TypeScript vẫn tạo ra kết quả biên dịch ngay cả khi có lỗi**, chúng ta vẫn có thể sử dụng tệp đã biên dịch này.

Nếu bạn muốn dừng việc tạo tệp js khi có lỗi, bạn có thể cấu hình `noEmitOnError` trong `tsconfig.json`. Về `tsconfig.json`, bạn có thể tham khảo [tài liệu chính thức](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html).
