---
title: JS Hight Order Function
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-05
---

# Hàm cao cấp - Hight Order Function

**Hàm cao cấp** là một hàm mà có thể thao tác với các hàm khác, và thường có hai trường hợp sau:

1. Hàm có thể được truyền như một tham số.
2. Hàm có thể được trả về như một giá trị.

Trong JavaScript, hàm hoàn toàn đáp ứng các điều kiện của hàm cao cấp. Trong thực tế, dù là truyền một hàm như một tham số, hay trả về kết quả của một hàm khác, đều có nhiều ứng dụng trong phát triển.

## Truyền hàm như tham số

Truyền hàm như một tham số cho một hàm khác cho phép chúng ta trừu tượng hóa một phần logic kinh doanh dễ thay đổi và đặt phần này trong tham số của hàm. Điều này giúp tách phần thay đổi và không thay đổi trong mã logic kinh doanh.

### Hàm gọi lại

Một trong những ứng dụng phổ biến của việc truyền hàm là sử dụng hàm gọi lại.

- Trong quá trình gửi yêu cầu bất đồng bộ AJAX, hàm gọi lại được sử dụng rất phổ biến.
- Khi không chắc chắn về thời gian trả về của yêu cầu, hàm gọi lại được truyền như một tham số.
- Sau khi yêu cầu hoàn thành, hàm gọi lại được thực thi.

🌰 **Ví dụ mã**

```js
const getUserInfo = function (userId, callback) {
  $.ajax('http://example.com/getUserInfo?' + userId, function (data) {
    if (typeof callback === 'function') {
      callback(data);
    }
  });
};

getUserInfo(123, function (data) {
  console.log(data.userName);
});
```

Ứng dụng của hàm gọi lại không chỉ xuất hiện trong yêu cầu bất đồng bộ, mà còn khi một hàm không phù hợp để thực hiện một số yêu cầu, cũng có thể đóng gói các yêu cầu này thành một hàm và truyền nó như một tham số cho một hàm khác, **ủy quyền** cho hàm khác để thực hiện.

Ví dụ, muốn tạo 100 nút `div` trên trang web và ẩn chúng ngay sau khi tạo.

```js
const appendDiv = function () {
  for (let i = 0; i < 100; i++) {
    const div = document.createElement('div');
    div.innerHTML = i;
    document.body.appendChild(div);
    div.style.display = 'none';
  }
};
appendDiv();
```

Việc mã hóa logic `div.style.display = 'none'` trong `appendDiv` không hợp lý, `appendDiv` trở thành một hàm không thể tái sử dụng và không phải ai cũng muốn ẩn các nút ngay khi chúng được tạo ra.

Vì vậy, hãy tách ra dòng mã `div.style.display = 'none'`, và truyền nó dưới dạng một hàm gọi lại vào `appendDiv`:

```js
const appendDiv = function (callback) {
  for (let i = 0; i < 100; i++) {
    const div = document.createElement('div');
    div.innerHTML = i;
    document.body.appendChild(div);
    if (typeof callback === 'function') {
      callback(div);
    }
  }
};

appendDiv(function (node) {
  node.style.display = 'none';
});
```

Có thể thấy, yêu cầu ẩn nút là do khách hàng đặt ra, nhưng khách hàng không biết nút được tạo ra khi nào, vì vậy việc ẩn nút được đặt trong hàm gọi lại, **ủy quyền** cho phương thức `appendDiv`. Phương thức `appendDiv` biết chính xác khi nút được tạo ra, vì vậy khi nút được tạo ra, `appendDiv` sẽ thực thi hàm gọi lại mà khách hàng truyền vào.

### Sắp xếp mảng

Một ứng dụng khác của việc truyền hàm là hàm sắp xếp mảng `sort()`. `Array.prototype.sort` nhận một hàm làm tham số, trong đó đóng gói phương pháp sắp xếp các phần tử của mảng. Mục tiêu là sắp xếp mảng, điều này là phần không thay đổi; nhưng sử dụng quy tắc nào để sắp xếp là phần có thể thay đổi. Đóng gói phần có thể thay đổi trong tham số hàm, động cơ truyền vào `Array.prototype.sort`, làm cho `Array.prototype.sort` trở thành một phương thức rất linh hoạt.

```js
// Sắp xếp từ nhỏ đến lớn, kết quả: [ 1, 3, 4 ]
[1, 4, 3].sort(function (a, b) {
  return a - b;
});

// Sắp xếp từ lớn đến nhỏ, kết quả: [ 4, 3, 1 ]
[1, 4, 3].sort(function (a, b) {
  return b - a;
});
```

## Trả về giá trị là một hàm

So với việc truyền một hàm làm tham số, có nhiều tình huống sử dụng khi một hàm được trả về như một giá trị đầu ra. Trả về một hàm có thể tiếp tục thực hiện một quá trình tính toán.

Dưới đây là một loạt các hàm `isType` sử dụng phương thức `Object.prototype.toString` để xác định kiểu dữ liệu:

```js
let isString = function (obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
};

let isArray = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
};

let isNumber = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Number]';
};
```

Thực tế, hầu hết các hàm này có cùng một cài đặt, chỉ khác nhau ở chuỗi trả về từ `Object.prototype.toString.call(obj)`. Để tránh mã lặp thừa, có thể truyền chuỗi này như một tham số cho hàm `isType`.

```js
let isType = function (type) {
  return function (obj) {
    return Object.prototype.toString.call(obj) === '[object ' + type + ']';
  };
};

const isString = isType('String');
const isArray = isType('Array');
const isNumber = isType('Number');

console.log(isArray([1, 2, 3]));
// true
```

Thực tế, hàm `isType` được triển khai ở trên cũng thuộc loại **hàm một phần**, nghĩa là nó trả về một hàm mới chứa **tham số tiền xử lý**, để cho phần logic sau có thể gọi.

Tất nhiên, bạn cũng có thể sử dụng vòng lặp để đăng ký các hàm `isType` này:

```js
let Type = {};
for (var i = 0, type; (type = ['String', 'Array', 'Number'][i++]); ) {
  (function (type) {
    Type['is' + type] = function (obj) {
      return Object.prototype.toString.call(obj) === '[object ' + type + ']';
    };
  })(type);
}

Type.isArray([]);
// true
Type.isString('str');
// true
```

## Lập trình hướng khía cạnh (AOP)

AOP, viết tắt của lập trình hướng khía cạnh (Aspect-Oriented Programming), có tác dụng chính là **tách riêng các chức năng không liên quan đến logic chính của mô-đun**. Những chức năng không liên quan này thường bao gồm ghi nhật ký, thống kê, kiểm soát bảo mật, xử lý ngoại lệ, v.v. Sau khi tách riêng những chức năng này, chúng có thể được **chèn vào** mô-đun logic chính bằng cách **tạo động**. Lợi ích của việc này là giữ cho mô-đun logic chính sạch và có độ tương thích cao, và dễ dàng tái sử dụng các mô-đun chức năng như ghi nhật ký và thống kê.

Thường thì, khi triển khai AOP trong JavaScript, ta sẽ chèn một hàm vào một hàm khác. Dưới đây là một cách triển khai bằng cách mở rộng `Function.prototype`.

```js
Function.prototype.before = function (beforefn) {
  // Lưu trữ tham chiếu của hàm gốc
  const _this = this;

  // Trả về một hàm "đại diện" chứa cả hàm gốc và hàm mới
  return function () {
    // Thực hiện hàm mới trước, điều chỉnh this
    beforefn.apply(this, arguments);

    // Tiếp tục thực hiện hàm gốc
    return _this.apply(this, arguments);
  };
};

Function.prototype.after = function (afterfn) {
  const _this = this;

  return function () {
    // Thực hiện hàm gốc trước
    const result = _this.apply(this, arguments);

    // Tiếp tục thực hiện hàm mới
    afterfn.apply(this, arguments);

    return result;
  };
};

let fn = function () {
  console.log(2);
};

fn = fn
  .before(function () {
    console.log(1);
  })
  .after(function () {
    console.log(3);
  });

fn();
// 1 2 3
```

Chèn hai hàm, một để in ra số 1 và một để in ra số 3, vào hàm `fn` bằng cách sử dụng AOP.

Khi chạy đoạn mã trên, kết quả trên console sẽ trả về 1, 2, 3.

```js
const service = function () {
  console.log('Logic chức năng');
};

const proxyMethod = (function () {
  let startTime;

  return {
    before: function () {
      startTime = new Date();

      console.log('Bắt đầu đếm thời gian');
    },
    after: function () {
      const endTime = new Date() - startTime;

      console.log('Kết thúc đếm thời gian, thời gian sử dụng: ' + endTime);
    },
  };
})();

const aop = function (fn, proxy) {
  proxy.before && proxy.before();

  fn();

  proxy.after && proxy.after();
};

aop(service, proxyMethod);
// Bắt đầu đếm thời gian
// Logic chức năng
// Kết thúc đếm thời gian, thời gian sử dụng: 1
```

## Ứng dụng khác

- [[JS Function Currying|Function Currying]]
- [[JS Function Currying#Hàm Uncurrying|Function Uncurrying]]
- [[JS Throttle|Throttle Function]]
- [[JS Debounce|Debounce Function]]
