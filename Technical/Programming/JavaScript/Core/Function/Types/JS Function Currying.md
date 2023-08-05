---
title: JS Function Currying
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-05
---

# Hàm Currying

> Trong khoa học máy tính, Currying, còn được gọi là phần tử hóa, là một kỹ thuật chuyển đổi một hàm sử dụng nhiều tham số thành một chuỗi các hàm sử dụng một tham số duy nhất và trả về một hàm mới nhận các tham số còn lại và trả về kết quả.

Currying là việc chuyển đổi một hàm có nhiều tham số thành một chuỗi các hàm chỉ nhận một tham số (tham số đầu tiên của hàm ban đầu) và trả về một hàm mới nhận các tham số còn lại và trả về kết quả. Ý tưởng cốt lõi là chia nhỏ hàm có nhiều tham số thành các hàm chỉ nhận một tham số (hoặc một phần) và sau đó trả về việc gọi hàm chỉ nhận một tham số (hoặc một phần) tiếp theo, tiếp tục xử lý các tham số còn lại.

```js
// Cách viết thông thường
fn(1, 2, 3, 4);

// Currying
fn(1)(2)(3)(4);
```

Giả sử hàm này được sử dụng để tính tổng, thì Currying sẽ chuyển đổi hàm ban đầu nhận nhiều tham số để tính tổng thành một chuỗi các hàm chỉ nhận một tham số và tính tổng từng tham số một. Điều này làm cho việc hiểu rõ hơn.

## Cài đặt

Triển khai từng bước một hàm Currying.

```js
const sum3(x, y, z) {
  return x + y + z
}
console.log(sum(1,2,3));
// 6
```

```js
// Currying
const sum3(x) {
  return function (y) {
    return function (z) {
      return x + y + z
    }
  }
}
console.log(sum(1)(2)(3));
// 6
```

```js
function curry(fn) {
  return function (y) {
    return function (z) {
      return fn(x, y, z);
    };
  };
}
var sum3 = curry((x, y, z) => {
  return x + y + z;
});
console.log(sum3(1)(2)(3)); // 6
```

Thêm nhiều tham số:

```js
function curryN(fn) {
  return function (a1) {
    return function (a2) {
      return function (a3) {
        //......
        return function (aN) {
          return fn(a1, a2, a3, ...aN);
        };
      };
    };
  };
}
```

Sử dụng đệ quy để đơn giản hóa cách viết này:

```js
function nest(fn) {
  return function (x) {
    return nest(fn);
  };
}
function curry(fn) {
  return nest(fn);
}
```

Ở đây thiếu một điều kiện dừng vòng lặp, vì vậy hàm `nest` trước tiên sẽ thêm một tham số mới là `i`, khi `i === N` thì đệ quy dừng lại.

```js
function nest(fn, i) {
  return function(x) {
    if (i === N) {
        return fn(...)
    }
    return nest(fn, i + 1)
  }
}
function curry(fn) {
  return nest(fn, 1)
}
```

Tiếp theo, cần một mảng để lưu trữ các tham số tùy ý, gọi mảng này là `args`, sau đó truyền vào hàm `nest`.

```js
function nest(fn, i, args) {
  return function (x) {
    args.push(x);
    if (i === fn.length) {
      return fn(...args);
    }
    return nest(fn, i + 1, args);
  };
}
function curry(fn) {
  const args = [];
  return nest(fn, 1, args);
}
```

Cuối cùng, thêm xử lý cho trường hợp không có tham số, chúng ta đã hoàn thành phiên bản cuối cùng của hàm Currying.

```js
function curry(fn) {
  if (fn.length === 0) {
    return fn;
  }
  const args = [];
  return nest(fn, 1, args);
}
```

## Ví dụ

**Ví dụ 1: Triển khai một hàm Currying tính tổng**

```js
const currying = function (fn, ...args) {
  const len = fn.length;
  args = args || [];
  return () => {
    const totalArgs = [...args].concat([...arguments]);

    return totalArgs.length >= len ? fn.call(this, totalArgs) : currying.call(this, fn, totalArgs);
  };
};

const sum = (a, b, c) => a + b + c;

const newSum = currying(sum);

newSum(1)(2)(3)(4);
// 10
```

Dường như khá tinh vi, nhưng loại bài toán này rõ ràng không phải là một câu hỏi phỏng vấn dựa trên thực tế.

**Ví dụ 2: Tìm kiếm một giá trị trong một mảng**

```js
const find = function (arr, value) {
  return arr.indexOf(value) !== -1;
};
```

Một hàm đơn giản để tìm kiếm một giá trị trong một mảng, mỗi lần sử dụng đều cần gọi như vậy.

```js
find(arr, 1);
find(arr, 2);
```

Vì `arr` là một tham số cố định, chúng ta có thể lưu trữ một hàm đã nhận `arr`, sau đó sử dụng hàm này để xử lý các tham số thay đổi.

```js
const collection = [5, 4, 3, 2, 1];
const findInCollection = currying(find)(collection);

findInCollection(1);
findInCollection(2);
```

Mục đích của việc sử dụng hàm Currying có thể hiểu là: tái sử dụng tham số. Bản chất là giảm tính chung chung và tăng tính ứng dụng.

**Triển khai Currying đơn giản**

```js
const curry = (fn) =>
  (judge = (...args) => (args.length === fn.length ? fn(...args) : (arg) => judge(...args, arg)));

// Mở rộng
const currying = (fn) => {};
```

## Hàm Uncurrying

Ngược lại với Currying.

- Currying được sử dụng để giới hạn phạm vi áp dụng, tạo ra một hàm có tính chất đặc thù hơn;
- "Không Currying" được sử dụng để mở rộng phạm vi áp dụng, tạo ra một hàm có tính chất áp dụng rộng hơn.

Chuyển đổi mã tương ứng như sau.

```js
fn(1)(2)(3)(4)  ->  fn(1, 2, 3, 4)
```

Ví dụ

```js
Array.forEach = function () {
  const fn = [].pop.call(arguments);

  const arr = arguments.length > 1 ? arguments : arguments[0];

  return [].forEach.call(arr, fn);
};

Array.forEach(1, 2, 3, function (i) {
  console.log(i);
  // 1 2 3
});

Array.forEach('123', function (i) {
  console.log(i);
  // 1 2 3
});

Array.forEach(
  {
    '0': 1,
    '1': 2,
    '2': 3,
    length: 3,
  },
  function (i) {
    console.log(i);
    // 1 2 3
  }
);
```

Việc sử dụng hàm gốc của mảng thông qua hàm `call` là một ứng dụng phổ biến. Trong ví dụ này, chúng ta sử dụng `call` để trích xuất một hàm mới, có thể nhận nhiều tham số và loại dữ liệu khác nhau, có tính ứng dụng rộng hơn.
