---
title: JS Function Accessor
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-05
---

# Trình truy cập hàm

## Hàm truy xuất giá trị

Cú pháp `getter` liên kết một hàm sẽ được gọi khi truy vấn thuộc tính của đối tượng.

### Cú pháp

```js
{get prop() {
  // làm gì đó
}}

{get [expression]() {
  // làm gì đó
}}
```

**Tham số:**

| Tham số      | Mô tả                         |
| :----------- | :---------------------------- |
| `prop`       | Tên thuộc tính được liên kết với hàm đã cho |
| `expression` | Một biểu thức tính tên thuộc tính |

### Mô tả

Đôi khi cần cho phép truy cập vào một thuộc tính trả về giá trị được tính toán động, hoặc có thể cần phản ánh trạng thái của biến nội bộ mà không cần sử dụng cuộc gọi phương thức rõ ràng. Trong JavaScript, có thể sử dụng `getter` để thực hiện điều này. Mặc dù có thể sử dụng `getter` và `setter` để tạo ra một loại thuộc tính giả, nhưng không thể đồng thời liên kết một `getter` với một thuộc tính và thực sự có một giá trị cho thuộc tính đó.

Cần lưu ý các vấn đề sau khi sử dụng cú pháp `get`:

- Có thể sử dụng số hoặc chuỗi làm định danh
- Không được có tham số
- Nó không thể xuất hiện cùng một lúc với một `get` khác hoặc một mục dữ liệu có cùng thuộc tính trong một literal

Có thể xóa `getter` bằng toán tử `delete`.

### Ví dụ

#### Cách sử dụng cơ bản

```js
const foo = {
  arr: [0, 1, 2, 3, 4],
  get num(){
    // Chỉ khi độ dài mảng là 5, lấy giá trị của phần tử có chỉ số 1 trong mảng
    if (this.arr.length === 5) {
      return this.arr[1]
    }
  }
}

console.log(foo.num)
// 1
```

#### Xóa hàm truy xuất giá trị của đối tượng

```js
const foo = {
  get name() {
    return 'BINGO!'
  }
}

console.log(foo.name)
// Output: 'BINGO!'

delete foo.name
// true

console.log(foo.name)
// Output: undefined
```

#### Định nghĩa hàm truy xuất giá trị trên đối tượng hiện có

Có thể sử dụng phương thức `defineProperty` để định nghĩa hàm truy xuất giá trị trên đối tượng hiện có.

```js
let foo = {
  a: 0
};

Object.definedProperty(foo, "b", {
  get: function () {
    return this.a + 1;
  }
});

console.log(foo.b);
// Chạy hàm truy xuất giá trị, trả về a + 1 (là 1)
```

#### Tên thuộc tính được tính toán

```js
const expr = 'foo';

const obj = {
  get [expr]() { return 'bar'; }
}

console.log(obj.foo)
// 'bar'
```

## Hàm gán giá trị

Khi cố gắng thiết lập một thuộc tính, cú pháp `set` sẽ ràng buộc thuộc tính của đối tượng với hàm được gọi.

### Cú pháp

```js
{set prop(val) { . . . }}
{set [expression](val) { . . . }}
```

**Tham số:**

| Tham số      | Mô tả                                                         |
| :---------- | :------------------------------------------------------------ |
| `prop`       | Giá trị thuộc tính được ràng buộc với hàm cho trước              |
| `val`        | Bí danh của biến để lưu giữ giá trị cố gắng gán cho `prop`       |
| `expression` | Từ ECMAScript 2015 trở đi, bạn có thể sử dụng một biểu thức tính toán tên thuộc tính để ràng buộc với hàm cho trước |

### Mô tả

Trong JavaScript, khi bạn cố gắng thay đổi giá trị của một thuộc tính, `setter` tương ứng sẽ được thực thi. `setter` thường được sử dụng cùng với `getter` để tạo ra một thuộc tính giả. Không thể có cùng một `setter` trên một thuộc tính có giá trị thực.

Khi sử dụng cú pháp `set`, hãy lưu ý:

- Định danh có thể là số hoặc chuỗi
- Nó phải có một tham số rõ ràng
- Trong đối tượng chữ, không thể sử dụng `set` cho một biến đã có giá trị thực, và không thể thiết lập nhiều `set` cho một thuộc tính

### Ví dụ

#### Cách sử dụng cơ bản

```js
const foo = {
  set current(name) {
    this.log.push(name)
  },
  log: []
}

foo.current = 'EN'

console.log(foo.log)
// ['EN']

foo.current = 'ZN'

console.log(foo.log)
// ['EN', 'ZN']
```
