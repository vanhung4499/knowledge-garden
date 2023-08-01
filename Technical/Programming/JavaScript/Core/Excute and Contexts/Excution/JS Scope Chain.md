---
title: JS Scope Chain
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Chuỗi phạm vi (Scope Chain)

Như đã đề cập trong [[JS Variable Object]], khi tìm kiếm biến, trước tiên sẽ tìm trong đối tượng biến của ngữ cảnh thực thi hiện tại. Nếu không tìm thấy, nó sẽ tiếp tục tìm trong đối tượng biến của ngữ cảnh thực thi cha (theo mặt từ vựng). Quá trình này sẽ tiếp tục cho đến khi tìm thấy đối tượng biến của ngữ cảnh thực thi toàn cục, nghĩa là đối tượng toàn cục. Chuỗi các đối tượng biến này, được tạo bởi nhiều ngữ cảnh thực thi, được gọi là chuỗi phạm vi (scope chain).

Dưới đây, chúng ta sẽ phân tích cách chuỗi phạm vi được tạo và thay đổi từ giai đoạn tạo hàm đến giai đoạn kích hoạt.

## Tạo hàm

Phạm vi hàm được xác định khi hàm được định nghĩa.

Điều này xảy ra vì hàm có một thuộc tính nội bộ `[[Scopes]]`, khi hàm được tạo, tất cả các đối tượng biến của phạm vi cha sẽ được lưu trữ trong thuộc tính này. Bạn có thể hiểu `[[Scopes]]` là một chuỗi các đối tượng biến của phạm vi cha, nhưng lưu ý rằng `[[Scopes]]` không đại diện cho toàn bộ chuỗi phạm vi.

🌰 **Ví dụ mã**:

```js
function foo() {
  function bar() {
    // làm gì đó
  }
}
```

Khi hàm được tạo, `[[Scopes]]` tương ứng của chúng là:

```js
console.dir(foo);
// [[Scopes]]: Scopes[2]
// 0: Scripts {...}
// 1: Global {...}

foo.[[Scopes]] = [
  globalContext.VO
];

bar.[[Scopes]] = [
  fooContext.AO,
  globalContext.VO
];
```

## Kích hoạt hàm

Khi hàm được kích hoạt (thực thi), khi vào ngữ cảnh thực thi hàm, đối tượng hoạt động (AO: Activation Object) sẽ được thêm vào đầu chuỗi phạm vi.

Lúc này, chuỗi phạm vi của ngữ cảnh thực thi sẽ được gán cho biến Scopes:

```js
Scopes = [AO].concat([[Scopes]]);
```

Đến đây, chuỗi phạm vi đã được tạo thành công.

## Phân tích ví dụ

Lấy ví dụ dưới đây làm ví dụ, kết hợp với những gì đã nói về đối tượng biến và ngăn xếp ngữ cảnh thực thi, chúng ta sẽ tóm tắt quá trình **tạo ra** chuỗi phạm vi và đối tượng biến trong ngữ cảnh thực thi của hàm:

```js
const scope = 'global scope';
function checkscope() {
  var scope2 = 'local scope';
  return scope2;
}
checkscope();
```

Quá trình **thực thi** như sau:

1. Hàm `checkscope` được tạo ra, lưu trữ chuỗi phạm vi vào thuộc tính nội bộ `[[Scopes]]`

```js
checkscope.[[Scopes]] = [
  globalContext.VO
];
```

2. Thực thi hàm `checkscope`, tạo ngữ cảnh thực thi của hàm `checkscope`, đẩy ngữ cảnh thực thi của hàm `checkscope` vào ngăn xếp ngữ cảnh thực thi

```js
ECStack = [checkscopeContext, globalContext];
```

3. Hàm `checkscope` không được thực thi ngay lập tức, bắt đầu chuẩn bị, bước đầu tiên: sao chép thuộc tính `[[Scopes]]` để tạo chuỗi phạm vi

```js
checkscopeContext = {
  Scopes: checkscope.[[Scopes]],
}
```

4. Tạo đối tượng hoạt động (AO) bằng `arguments`, sau đó khởi tạo AO, thêm các tham số hình thức, khai báo hàm và khai báo biến

```js
checkscopeContext = {
  AO: {
    arguments: {
      length: 0
    },
    scope2: undefined
  },
  Scopes: checkscope.[[Scopes]],
}
```

5. Đẩy đối tượng hoạt động (AO) vào đầu chuỗi phạm vi của hàm `checkscope`

```js
checkscopeContext = {
  AO: {
    arguments: {
      length: 0,
    },
    scope2: undefined,
  },
  Scopes: [AO, [[Scopes]]],
};
```

6. Chuẩn bị hoàn tất, bắt đầu thực thi hàm, khi thực thi hàm, thay đổi giá trị thuộc tính của AO

```js
checkscopeContext = {
  AO: {
    arguments: {
      length: 0,
    },
    scope2: 'local scope',
  },
  Scopes: [AO, [[Scopes]]],
};
```

7. Tìm giá trị của `scope2`, trả về và kết thúc thực thi hàm, ngữ cảnh thực thi của hàm được loại bỏ khỏi ngăn xếp ngữ cảnh thực thi

```js
ECStack = [globalContext];
```
