---
title: JS Return Statement
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Câu lệnh return

Câu lệnh `return` trong một hàm được sử dụng để trả về giá trị sau khi gọi hàm.

## Cú pháp

```js
return expression;
```

## Giải thích

### Đặc điểm của câu lệnh return

- Câu lệnh `return` chỉ có thể xuất hiện trong **thân hàm**, nếu không sẽ gây ra lỗi cú pháp.

```js
return 1; // SyntaxError: Illegal return statement
```

- Vì JavaScript có thể tự động chèn dấu chấm phẩy, nên không được phép có dòng mới giữa từ khóa `return` và biểu thức sau nó.

```js
var test = function fn(){
    return
    2;
};
console.log(test()); // undefined
```

- Một hàm có thể có nhiều câu lệnh `return`.

```js
function diff(iNum1, iNum2) {
  if (iNum1 > iNum2) {
    return iNum1 - iNum2;
  } else {
    return iNum2 - iNum1;
  }
}
```

### Quá trình của hàm

- Nếu không có câu lệnh `return`, cuộc gọi hàm chỉ thực hiện từng câu lệnh trong thân hàm cho đến khi hàm kết thúc, sau đó trả về kết quả cho chương trình gọi. Trong trường hợp này, kết quả của biểu thức gọi là `undefined`.

```js
var test = function fn(){}
console.log(test()); // undefined
```

- Khi gặp câu lệnh `return`, hàm dừng thực hiện và trả về giá trị của biểu thức cho chương trình gọi.

```js
var test = function fn(){
    return 2;
};
console.log(test()); // 2
```

- Câu lệnh `return` thường được sử dụng làm lệnh cuối cùng trong thân hàm để kết thúc hàm sớm. Khi câu lệnh `return` được thực hiện, hàm trực tiếp trả về và không thực hiện các câu lệnh còn lại.

```js
// Không hiển thị cảnh báo 1
var test = function fn(){
    return;
    alert(1);
};
console.log(test()); // undefined
```

- Câu lệnh `return` không ngăn chặn việc thực hiện mệnh đề `finally`. Mệnh đề `finally` sẽ được thực hiện bất kể câu lệnh `return` có được thực hiện hay không.

```js
function testFinnally(){
    try{
        return 2;
    }catch(error){
        return 1;
    }finally{
        return 0;
    }
}
testFinnally(); // 0
```

### Giá trị trả về

- Nếu hàm được gọi với tiền tố `new` và giá trị trả về không phải là một đối tượng, thì giá trị trả về sẽ là `this` (đối tượng mới được tạo).

```js
function fn(){
    this.a = 2;
    return 1;
}
var test = new fn();
console.log(test); // {a:2}
console.log(test.constructor); // fn(){this.a = 2;return 1;}
```

- Nếu giá trị trả về là một đối tượng, thì giá trị trả về sẽ là đối tượng đó.

```js
function fn(){
    this.a = 2;
    return {a:1};
}
var test = new fn();
console.log(test); // {a:1}
console.log(test.constructor); // Object() { [native code] }
```

- Câu lệnh `return` có thể được sử dụng mà không cần có biểu thức, trong trường hợp này, giá trị trả về sẽ là `undefined`.

```js
var test = function fn(){
    return;
};
console.log(test()); // undefined
```

## Tổng kết

- Câu lệnh `return` chỉ có thể xuất hiện trong thân hàm.
- Không được phép có dòng mới giữa từ khóa `return` và biểu thức sau nó.
- Một hàm có thể có nhiều câu lệnh `return`.
- Khi câu lệnh `return` được thực hiện, hàm dừng thực hiện và trả về giá trị của biểu thức.
- Câu lệnh `return` không ngăn chặn việc thực hiện mệnh đề `finally`.
- Khi hàm được gọi với tiền tố `new` và giá trị trả về không phải là một đối tượng, giá trị trả về sẽ là đối tượng mới được tạo.
- Khi giá trị trả về là một đối tượng, giá trị trả về sẽ là đối tượng đó.
- Câu lệnh `return` có thể được sử dụng mà không cần có biểu thức, trong trường hợp này, giá trị trả về sẽ là `undefined`.
