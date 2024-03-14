---
title: TS Built-in Objects
tags:
  - ts
categories:
  - ts
date created: 2024-03-15
date modified: 2024-03-15
---

# Built-in Objects

JavaScript có rất nhiều buitin object, chúng có thể được sử dụng trực tiếp trong TypeScript như các loại đã được định nghĩa.

Built-in Object ở đây là những đối tượng tồn tại trong phạm vi toàn cục (Global) theo chuẩn. Chuẩn ở đây là chuẩn ECMAScript và các chuẩn khác (như DOM).

## Built-in Object của ECMAScript

Built-in Object mà chuẩn ECMAScript cung cấp bao gồm:

`Boolean`, `Error`, `Date`, `RegExp`, v.v.

Chúng ta có thể định nghĩa biến trong TypeScript như là các loại này:

```ts
let b: Boolean = new Boolean(1);
let e: Error = new Error('Error occurred');
let d: Date = new Date();
let r: RegExp = /[a-z]/;
```

Để biết thêm về các Built-in Object, bạn có thể tham khảo [tài liệu của MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects).

Và tệp định nghĩa của chúng nằm trong [tệp định nghĩa thư viện cốt lõi của TypeScript]().

## Built-in Object của DOM và BOM

Built-in Object mà DOM và BOM cung cấp bao gồm:

`Document`, `HTMLElement`, `Event`, `NodeList`, v.v.

Trong TypeScript, chúng ta thường sử dụng các loại này:

```ts
let body: HTMLElement = document.body;
let allDiv: NodeList = document.querySelectorAll('div');
document.addEventListener('click', function(e: MouseEvent) {
  // Do something
});
```

Tệp định nghĩa của chúng cũng nằm trong [tệp định nghĩa thư viện cốt lõi của TypeScript]().

## Tệp định nghĩa thư viện cốt lõi của TypeScript

[Tệp định nghĩa thư viện cốt lõi của TypeScript]() định nghĩa tất cả các loại mà môi trường trình duyệt cần sử dụng, và nó được tích hợp sẵn trong TypeScript.

Khi bạn sử dụng một số phương thức phổ biến, TypeScript thực tế đã giúp bạn thực hiện rất nhiều công việc kiểm tra loại, ví dụ:

```ts
Math.pow(10, '2');

// index.ts(1,14): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

Trong ví dụ trên, `Math.pow` phải nhận hai tham số loại `number`. Thực tế, định nghĩa loại của `Math.pow` như sau:

```ts
interface Math {
    /**
     * Returns the value of a base expression taken to a specified power.
     * @param x The base value of the expression.
     * @param y The exponent value of the expression.
     */
    pow(x: number, y: number): number;
}
```

Dưới đây là một ví dụ khác về DOM:

```ts
document.addEventListener('click', function(e) {
    console.log(e.targetCurrent);
});

// index.ts(2,17): error TS2339: Property 'targetCurrent' does not exist on type 'MouseEvent'.
```

Trong ví dụ trên, phương thức `addEventListener` được định nghĩa trong thư viện cốt lõi của TypeScript:

```ts
interface Document extends Node, GlobalEventHandlers, NodeSelector, DocumentEvent {
    addEventListener(type: string, listener: (ev: MouseEvent) => any, useCapture?: boolean): void;
}
```

Vì vậy, `e` được suy ra là `MouseEvent`, và `MouseEvent` không có thuộc tính `targetCurrent`, vì vậy nó báo lỗi.

Lưu ý, định nghĩa thư viện cốt lõi của TypeScript không bao gồm phần Node.js.

## Sử dụng TypeScript để viết Node.js

Node.js không phải là một phần của Built-in Object, nếu bạn muốn sử dụng TypeScript để viết Node.js, bạn cần nhập tệp định nghĩa của bên thứ ba:

```bash
npm install @types/node --save-dev
```
