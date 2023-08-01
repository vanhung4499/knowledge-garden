---
title: JS Closures
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Closure (Đóng gói)

Trước khi hiểu về closure (đóng gói), chúng ta cần hiểu một số khái niệm sau:

1. Đầu tiên, cần hiểu về môi trường thực thi (execution context), môi trường thực thi xác định các biến hoặc hàm có quyền truy cập vào dữ liệu khác.
2. Mỗi môi trường thực thi đều có một đối tượng biến (variable object) liên quan, tất cả các biến và hàm được định nghĩa trong môi trường đó được lưu trữ trong đối tượng này.
3. Mỗi hàm đều có môi trường thực thi riêng của nó, khi luồng thực thi vào một hàm, môi trường của hàm đó sẽ được đẩy vào một ngăn xếp môi trường. Khi hàm thực thi xong, ngăn xếp sẽ đẩy môi trường đó ra và trả lại quyền điều khiển cho môi trường trước đó.
4. Khi một hàm được gọi, một môi trường thực thi và chuỗi phạm vi (scope chain) tương ứng được tạo ra. Sau đó, các giá trị của tham số và các biến khác được sử dụng để khởi tạo đối tượng hoạt động của hàm. Trong hàm, đối tượng hoạt động được sử dụng như một đối tượng biến (variable object).
5. Trong chuỗi phạm vi, đối tượng biến của hàm bên ngoài luôn nằm ở vị trí thứ hai, đối tượng biến của hàm bên ngoài của hàm bên ngoài nằm ở vị trí thứ ba, và tiếp tục như vậy cho đến khi đến cuối chuỗi phạm vi là môi trường thực thi toàn cục.

## Định nghĩa

**Closure (đóng gói)**: Là một hàm có quyền truy cập vào biến trong phạm vi của một hàm khác, thông thường là khi một hàm chứa một hàm khác.

**Tác dụng của closure**: Truy cập vào biến trong phạm vi của hàm, duy trì sự tồn tại của hàm trong môi trường và không bị thu gom bởi bộ thu gom rác.

Biến được khai báo trong một hàm chỉ có phạm vi cục bộ và chỉ có thể truy cập từ bên trong hàm đó. Tuy nhiên, biến bên ngoài hàm vẫn có thể được nhìn thấy bởi hàm bên trong nếu chúng ta tạo một hàm bên trong hàm đó. Như vậy, chúng ta có thể truy cập vào biến bên ngoài từ bên trong hàm bên trong.

```js
function foo() {
  let value = 1;

  function bar() {
    console.log(value);
  }

  return bar();
}

const baz = foo();

// Đây chính là tác dụng của closure, khi gọi hàm foo, nó sẽ thực thi hàm bar bên trong nó, lúc này hàm foo sẽ truy cập vào biến bên ngoài của nó
baz();
```

`bar` chứa một closure của phạm vi nội bộ của `foo`, cho phép phạm vi này tồn tại và không bị thu gom bởi bộ thu gom rác, điều này cho phép `bar` truy cập vào biến bên ngoài của nó bất kỳ lúc nào.

## Phân tích quá trình thực thi

Chúng ta sẽ phân tích kỹ quá trình thực thi đoạn mã trên để hiểu rõ hơn về những gì xảy ra:

```js
function foo() {
  var a = 2;

  function bar() {
    console.log(a);
  }

  return bar;
}

var baz = foo();

baz();
```

1. Luồng thực thi bắt đầu từ môi trường thực thi toàn cục và thực hiện việc khai báo biến trong môi trường thực thi toàn cục.
2. Luồng thực thi thực hiện `var baz = foo()` , gọi hàm `foo`, lúc này luồng thực thi chuyển sang môi trường thực thi của `foo` và tiến hành khai báo biến trong môi trường thực thi này. Lúc này, trong ngăn xếp môi trường thực thi có hai môi trường thực thi, môi trường thực thi của hàm `foo` là môi trường thực thi hiện tại.
3. Luồng thực thi thực hiện `var a = 2` , gán giá trị 2 cho biến `a`.
4. Luồng thực thi thực hiện `return bar` , trả về hàm `bar` là giá trị trả về của `foo`. Theo lý thuyết, lúc này môi trường thực thi của `foo` đã hoàn thành và sẽ bị hủy, chờ thu gom rác. Tuy nhiên, giá trị trả về của `foo` là hàm `bar`. Trong hàm `bar`, có biến tự do `a` cần được truy cập thông qua chuỗi phạm vi của `foo`, do đó, mặc dù môi trường thực thi của `foo` bị hủy, đối tượng biến của nó không thể bị hủy, chỉ chuyển từ trạng thái hoạt động sang trạng thái không hoạt động; đối tượng biến của môi trường thực thi toàn cục trở thành hoạt động; luồng thực thi tiếp tục thực hiện `var baz = foo` , gán giá trị trả về của `foo`, tức là hàm `bar`, cho biến `baz`.
5. Luồng thực thi thực hiện `baz()` , tìm giá trị của `baz` trong môi trường thực thi toàn cục, `baz` lưu trữ giá trị trả về của `foo`, tức là hàm `bar`. Vì vậy, khi gọi `baz`, nó sẽ gọi hàm `bar`, lúc này luồng thực thi chuyển sang môi trường thực thi của `bar` và tiến hành khai báo biến trong môi trường thực thi này. Lúc này, trong ngăn xếp môi trường thực thi có ba môi trường thực thi, `bar` là môi trường thực thi hiện tại.
6. Trong quá trình khai báo biến, do `a` là biến tự do, nên nó sẽ được tìm kiếm thông qua chuỗi phạm vi của `bar` -> `foo` -> phạm vi toàn cục. Cuối cùng, trong môi trường thực thi của `foo`, tìm thấy `var a = 2` , sau đó tìm thấy giá trị của `a` là 2, nên gán giá trị 2 cho `a`.
7. Luồng thực thi thực hiện `console.log(a)` , gọi phương thức `log` của đối tượng `console` và truyền `a` làm đối số. Tìm thấy giá trị của `a` là 2 trong môi trường thực thi của `bar`, vì vậy, kết quả hiển thị trên console là 2.
8. Sau khi thực hiện xong hàm `bar`, môi trường thực thi của `bar` được loại bỏ khỏi ngăn xếp môi trường thực thi và bị hủy, chờ thu gom rác, quyền điều khiển trả về cho môi trường thực thi toàn cục.
9. Khi trang web đóng, tất cả các môi trường thực thi sẽ bị hủy.

```js
// Ngăn xếp các ngữ cảnh thực thi
ECStack = [
  globalContext
]

// Ngữ cảnh thực thi toàn cục
global = {
  VO: [global],
  Scope: [globalContext.VO],
  this: globalContext.VO
}

// Hàm foo được tạo và lưu trữ chuỗi phạm vi vào thuộc tính nội bộ [[Scopes]]
foo.[[Scopes]] = [
  globalContext.VO
]
```

```js
// Ngữ cảnh thực thi của hàm foo
fooContext = {
  AO: {
    a: undefined,
    bar: function () {
      console.log(a);
    },
    arguments: [],
  },
  Scope: [AO, globalContext.VO],
  this: undefined,
};
```

```js
// Ngữ cảnh thực thi của hàm bar
barContext = {
  AO: {
    a: undefined,
    arguments: [],
  },
  Scope: [AO, globalContext.VO],
  this: undefined,
};
```

Khi hàm `bar` được thực thi, ngữ cảnh thực thi của hàm `foo` đã bị hủy (nghĩa là bị loại khỏi ngăn xếp ngữ cảnh thực thi), vậy làm sao nó vẫn có thể đọc giá trị `a` trong phạm vi của `foo`?

Khi đã hiểu rõ quá trình thực thi cụ thể, chúng ta biết rằng ngữ cảnh thực thi của hàm `bar` duy trì một chuỗi phạm vi:

```js
barContext = {
  Scope: [AO, fooContext.AO, globalContext.VO],
};
```

Đúng vậy, chính là do chuỗi phạm vi này, hàm `bar` vẫn có thể đọc giá trị của `fooContext.AO`, cho thấy khi hàm `bar` tham chiếu đến giá trị trong `fooContext.AO`, ngay cả khi `fooContext` đã bị hủy, JavaScript vẫn giữ cho `fooContext.AO` tồn tại trong bộ nhớ, và hàm `bar` vẫn có thể tìm thấy nó thông qua chuỗi phạm vi của hàm `bar`. Đúng vì điều này, JavaScript đã triển khai khái niệm closure.

## Ứng dụng

Các ứng dụng phổ biến của closure:

- **Hàm lồng nhau**: Hàm trong hàm đảm bảo rằng phạm vi của hàm bên ngoài không bị hủy, do đó, bất kỳ hàm nào trong hàm cũng có thể truy cập vào phạm vi của hàm bên ngoài. Cách thực hiện cụ thể là trả về hàm bên trong và sau đó gọi hàm bên trong thông qua cặp dấu ngoặc kép.
- **Hàm gọi lại**: Hàm gọi lại giữ lại phạm vi bên ngoài hiện tại và sau đó gọi lại ở một nơi khác để thực thi. Khi thực thi, nó sẽ tạo ra một closure.
- **Tự thực thi hàm vô danh**: Mặc dù không phải lúc nào cũng là closure, nhưng `(function(){})()` là một ví dụ. Hàm vô danh tự thực thi này tạo ra một closure trong quá trình thực thi.

```js
function hoc(a, b) {
  return function () {
    console.log(a, b);
  };
}

const fn = hoc(1, 2);

setTimeout(fn, 3000);
```

Thường thì tham số đầu tiên của `setTimeout` là một hàm, nhưng không thể truyền giá trị vào. Nếu muốn truyền giá trị vào, có thể gọi một hàm và trả về một cuộc gọi hàm bên trong, sau đó truyền cuộc gọi hàm bên trong vào `setTimeout`. Các tham số cần thiết cho việc thực thi hàm bên trong được truyền từ hàm bên ngoài và có thể truy cập từ `setTimeout`.

## Ưu điểm và nhược điểm

- Ưu điểm: Cho phép biến muốn tồn tại lâu dài trong bộ nhớ, tránh ô nhiễm biến toàn cục và cho phép tồn tại thành viên riêng tư.
- Nhược điểm: Việc tồn tại lâu dài trong bộ nhớ sẽ tăng sử dụng bộ nhớ và sử dụng không đúng cách có thể dẫn đến rò rỉ bộ nhớ.

Nếu không cần thiết sử dụng closure cho một nhiệm vụ cụ thể, việc tạo ra hàm trong hàm trong các hàm khác không phải lúc nào cũng là một quyết định sáng suốt, vì closure có tác động tiêu cực đến hiệu suất của mã, bao gồm tốc độ xử lý và sử dụng bộ nhớ.
