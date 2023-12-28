---
title: TS Type Of Function
tags:
  - ts
categories: ts
date created: 2023-12-28
date modified: 2023-12-28
---

# Kiểu dữ liệu của hàm

## Khai báo hàm

Trong JavaScript, có hai cách thông thường để định nghĩa một hàm - Khai báo hàm (Function Declaration) và Biểu thức hàm (Function Expression):

```js
// Khai báo hàm (Function Declaration)
function sum(x, y) {
    return x + y;
}

// Biểu thức hàm (Function Expression)
let mySum = function (x, y) {
    return x + y;
};
```

Một hàm có đầu vào và đầu ra, để ràng buộc nó trong TypeScript, chúng ta cần xem xét cả đầu vào và đầu ra. Trong đó, định nghĩa kiểu dữ liệu cho khai báo hàm khá đơn giản:

```ts
function sum(x: number, y: number): number {
    return x + y;
}
```

Chú ý, **không được phép có thêm tham số (hoặc thiếu tham số) không cần thiết**:

```ts
function sum(x: number, y: number): number {
    return x + y;
}
sum(1, 2, 3);

// index.ts(4,1): error TS2346: Supplied parameters do not match any signature of call target.
```

```ts
function sum(x: number, y: number): number {
    return x + y;
}
sum(1);

// index.ts(4,1): error TS2346: Supplied parameters do not match any signature of call target.
```

## Biểu thức hàm

Nếu chúng ta muốn viết một định nghĩa kiểu dữ liệu cho biểu thức hàm (Function Expression), có thể viết như sau:

```ts
let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
    return x + y;
};
```

Lưu ý không nhầm lẫn giữa ` => ` trong TypeScript và ` => ` trong ES6.

Trong định nghĩa kiểu dữ liệu của TypeScript, ` => ` được sử dụng để định nghĩa hàm, phía bên trái là kiểu dữ liệu đầu vào, được bao bọc bởi dấu ngoặc đơn, phía bên phải là kiểu dữ liệu đầu ra.

Trong ES6, ` => ` được gọi là hàm mũi tên (arrow function), được sử dụng rộng rãi, có thể tham khảo [[JS Arrow Function Definition]].

## Sử dụng interface để định nghĩa hàm

Chúng ta cũng có thể sử dụng interface để mô tả dạng mà một hàm cần phải tuân thủ:

```ts
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
}
```

Khi sử dụng biểu thức hàm hoặc interface để định nghĩa hàm, việc giới hạn kiểu dữ liệu cho phần bên trái của dấu ` = ` đảm bảo số lượng tham số, kiểu dữ liệu của tham số và kiểu dữ liệu trả về không thay đổi khi gán cho tên hàm.

## Tham số còn lại

Trong ES6, chúng ta có thể sử dụng cú pháp `…rest` để lấy các tham số còn lại trong một hàm (rest params):

```js
function push(array, ...items) {
    items.forEach(function(item) {
        array.push(item);
    });
}

let a: any[] = [];
push(a, 1, 2, 3);
```

Thực tế, `items` là một mảng. Vì vậy, chúng ta có thể định nghĩa kiểu dữ liệu của nó là một mảng:

```ts
function push(array: any[], ...items: any[]) {
    items.forEach(function(item) {
        array.push(item);
    });
}

let a = [];
push(a, 1, 2, 3);
```

Lưu ý, tham số rest chỉ có thể là tham số cuối cùng, về rest parameters, bạn có thể tham khảo [[JS Rest Parameters]].

## Overload (Nạp chồng)

Overload cho phép một hàm có thể xử lý các tham số có số lượng hoặc kiểu dữ liệu khác nhau.

Ví dụ, chúng ta cần triển khai một hàm `reverse`, khi đầu vào là số `123`, đầu ra là số đảo ngược `321`, khi đầu vào là chuỗi `'hello'`, đầu ra là chuỗi đảo ngược `'olleh'`.

Sử dụng kiểu liên hợp, chúng ta có thể triển khai như sau:

```ts
function reverse(x: number | string): number | string | void {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```

**Tuy nhiên, cách triển khai này có một nhược điểm, đó là không thể biểu diễn chính xác rằng khi đầu vào là số, đầu ra cũng phải là số, khi đầu vào là chuỗi, đầu ra cũng phải là chuỗi.**

Lúc này, chúng ta có thể sử dụng overload để định nghĩa nhiều kiểu hàm cho `reverse`:

```ts
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string | void {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```

Trong ví dụ trên, chúng ta đã định nghĩa nhiều lần hàm `reverse`, các lần đầu tiên chỉ là định nghĩa hàm, lần cuối cùng là triển khai hàm. Trong trình biên dịch, bạn sẽ thấy các gợi ý đúng cho các lần định nghĩa đầu tiên.

Lưu ý, TypeScript sẽ ưu tiên so khớp từ định nghĩa hàm đầu tiên, vì vậy nếu có mối quan hệ chứa trong các định nghĩa hàm, bạn nên đặt định nghĩa chính xác trước.
