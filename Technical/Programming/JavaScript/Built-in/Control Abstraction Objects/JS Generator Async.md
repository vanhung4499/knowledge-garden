---
title: JS Generator Async
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-08
date modified: 2023-08-08
---

# Ứng dụng bất đồng bộ của Generator Function

Trước khi ES6 ra đời, có khoảng bốn phương pháp để thực hiện lập trình bất đồng bộ.

- Callback function (hàm gọi lại)
- Event listener (bộ lắng nghe sự kiện)
- Publish/Subscribe (phát hành/đăng ký)
- Promise Object (đối tượng Promise)

Generator Function đã đưa lập trình bất đồng bộ trong JavaScript vào một giai đoạn mới.

## Khái niệm cơ bản

### Asynchronous

**Bất đồng bộ (Asynchronous)** đơn giản là một tác vụ không được thực hiện liên tục, có thể hiểu là tác vụ đó được chia thành hai phần và chỉ thực hiện phần thứ nhất trước, sau đó chuyển sang thực hiện các tác vụ khác. Khi đã sẵn sàng, tác vụ sẽ trở lại và thực hiện phần thứ hai.

Ví dụ, một tác vụ là đọc một tệp tin và xử lý nó. Phần thứ nhất của tác vụ là gửi yêu cầu đọc tệp tin đến hệ điều hành. Sau đó, chương trình thực hiện các tác vụ khác trong khi chờ hệ điều hành trả về tệp tin. Khi hệ điều hành trả về tệp tin, tác vụ sẽ tiếp tục thực hiện phần thứ hai (xử lý tệp tin). Đây là cách thực hiện không liên tục của tác vụ.

Ngược lại, thực hiện liên tục được gọi là **đồng bộ**. Trong thời gian hệ điều hành đọc tệp tin từ ổ đĩa cứng, chương trình không thể chạy bất kỳ tác vụ nào khác và phải chờ đợi.

### Callback

Trong JavaScript, phương pháp thực hiện lập trình bất đồng bộ là sử dụng **hàm gọi lại**. Hàm gọi lại là một cách viết riêng cho phần thứ hai của tác vụ, khi tác vụ đã sẵn sàng để tiếp tục. Khi tác vụ được thực hiện lại, chương trình sẽ gọi hàm gọi lại đó. Tên tiếng Anh của hàm gọi lại là `callback`, có nghĩa là **gọi lại**.

Ví dụ, để đọc một tệp tin và xử lý nó, ta có thể viết như sau.

```js
fs.readFile('/etc/passwd', 'utf-8', function(err, data) {
  if (err) throw err;
  console.log(data);
});
```

Trong đoạn mã trên, tham số thứ ba của hàm `readFile` chính là hàm gọi lại, cũng chính là phần thứ hai của tác vụ. Khi hệ điều hành trả về tệp tin `/etc/passwd`, hàm gọi lại sẽ được gọi để xử lý tệp tin đó.

Một câu hỏi thú vị là tại sao Node quy định rằng tham số đầu tiên của hàm gọi lại phải là đối tượng lỗi `err` (nếu không có lỗi, tham số này sẽ là `null`)?

Lý do là việc thực hiện tác vụ được chia thành hai phần. Sau khi thực hiện phần thứ nhất, ngữ cảnh thực thi của tác vụ đã kết thúc. Những lỗi xảy ra sau đó, ngữ cảnh gốc không thể bắt được, chỉ có thể truyền như một tham số vào phần thứ hai của tác vụ.

### Promise

Chính vì callback function không có vấn đề, vấn đề xảy ra khi nhiều callback function được lồng nhau. Giả sử sau khi đọc tệp tin `A`, ta lại muốn đọc tệp tin `B`, mã code như sau.

```js
fs.readFile(fileA, 'utf-8', function(err, data) {
  fs.readFile(fileB, 'utf-8', function(err, data) {
    // ...
  });
});
```

Dễ dàng nhận thấy, nếu đọc hai tệp tin trở lên theo thứ tự, sẽ có nhiều lồng nhau. Mã code không phát triển theo chiều dọc mà phát triển theo chiều ngang, nhanh chóng trở nên hỗn độn và khó quản lý. Vì nhiều hoạt động bất đồng bộ tạo thành một **liên kết mạnh**, chỉ cần một hoạt động cần được sửa đổi, cả hàm gọi lại ở phía trên và hàm gọi lại ở phía dưới cũng có thể phải được sửa đổi theo. Tình huống này được gọi là **địa ngục của hàm gọi lại** (callback hell).

Promise được tạo ra để giải quyết vấn đề này. Nó không phải là một tính năng ngôn ngữ mới, mà là một cách viết mới, cho phép chuyển từ việc lồng nhau các hàm gọi lại thành việc gọi tuần tự. Bằng cách sử dụng Promise, đọc liên tiếp nhiều tệp tin có thể được viết như sau.

```js
const readFile = require('fs-readfile-promise');

readFile(fileA)
  .then(function(data) {
    console.log(data.toString());
  })
  .then(function() {
    return readFile(fileB);
  })
  .then(function(data) {
    console.log(data.toString());
  })
  .catch(function(err) {
    console.log(err);
  });
```

Trong đoạn mã trên, tôi sử dụng module `fs-readfile-promise`, nó trả về một phiên bản Promise của hàm `readFile`. Promise cung cấp phương thức `then` để tải hàm gọi lại và phương thức `catch` để bắt lỗi ném ra trong quá trình thực thi.

Có thể thấy, cách viết Promise chỉ là cải tiến của callback function, sử dụng phương thức `then` để thực hiện các hàm gọi lại liên tiếp, ngoài ra không có gì mới.

Vấn đề lớn nhất của Promise là code trở nên lặp đi lặp lại, nhiệm vụ ban đầu được bao bọc bởi Promise, bất kể hoạt động nào, nó đều trông giống một mớ `then`, ý nghĩa ban đầu trở nên không rõ ràng.

## Generator Function

### Coroutine (Hợp tác)

Trong các ngôn ngữ lập trình truyền thống, đã có các giải pháp cho lập trình bất đồng bộ (thực tế là giải pháp cho nhiều tác vụ). Một trong số đó là **coroutine** (hợp tác), có nghĩa là nhiều luồng tương tác với nhau để hoàn thành các tác vụ bất đồng bộ.

Coroutine giống hàm, nhưng cũng giống luồng. Luồng thực hiện của coroutine như sau:

- Bước 1: Coroutine `A` bắt đầu thực thi.
- Bước 2: Coroutine `A` thực thi một phần, tạm dừng và chuyển quyền thực thi cho coroutine `B`.
- Bước 3: (Sau một khoảng thời gian) Coroutine `B` trả lại quyền thực thi.
- Bước 4: Coroutine `A` tiếp tục thực thi.

Trong luồng trên, coroutine `A` là tác vụ bất đồng bộ, vì nó được chia thành hai phần (hoặc nhiều phần) để thực hiện.

Ví dụ, cách viết coroutine để đọc tệp tin và xử lý nó như sau.

```js
function* asyncJob() {
  // ...Các đoạn mã khác
  var f = yield readFile(fileA);
  // ...Các đoạn mã khác
}
```

Trong đoạn mã trên, hàm `asyncJob` là một coroutine, và điểm đặc biệt của nó là câu lệnh `yield`. Nó đại diện cho sự tạm dừng khi đến đây và chuyển quyền thực thi cho các coroutine khác. Có nghĩa là câu lệnh `yield` là ranh giới giữa hai giai đoạn bất đồng bộ.

Coroutine gặp câu lệnh `yield` sẽ tạm dừng và chờ đợi quyền thực thi trở lại, sau đó tiếp tục thực thi từ điểm tạm dừng đó. Điều này giúp coroutine trông giống như thực hiện đồng bộ, nếu loại bỏ câu lệnh `yield`, nó sẽ trông giống như thực hiện đồng bộ hoàn toàn.

### Thực hiện Coroutine bằng Generator Function

Generator Function là cách thực hiện coroutine trong ES6, và đặc điểm quan trọng nhất của nó là có thể trả lại quyền thực thi của hàm (tạm dừng thực thi).

Toàn bộ Generator Function là một tác vụ bất đồng bộ, hoặc nói cách khác, một container cho tác vụ bất đồng bộ. Những nơi cần tạm dừng hoạt động bất đồng bộ được đánh dấu bằng câu lệnh `yield`. Cách thực thi Generator Function như sau.

```js
function* gen(x) {
  var y = yield x + 2;
  return y;
}

const generator = gen(1);

generator.next(); // { value: 3, done: false }
generator.next(); // { value: undefined, done: true }
```

Trong đoạn mã trên, gọi Generator Function sẽ trả về một con trỏ nội bộ (hay còn gọi là một trình lặp) `generator`. Điều này là điểm khác biệt giữa Generator Function và hàm thông thường, nghĩa là khi thực thi nó sẽ không trả về kết quả, mà trả về một đối tượng con trỏ. Gọi phương thức `next` của con trỏ sẽ di chuyển con trỏ nội bộ (tức là thực hiện phần đầu tiên của tác vụ bất đồng bộ), trỏ vào câu lệnh `yield` đầu tiên mà nó gặp phải, ví dụ là thực hiện đến `x + 2`.

Nói cách khác, phương thức `next` có tác dụng thực hiện Generator Function theo từng giai đoạn.

Mỗi lần gọi phương thức `next`, sẽ trả về một đối tượng đại diện cho thông tin giai đoạn hiện tại (`value` và `done`).

### Trao đổi dữ liệu và xử lý lỗi trong Generator Function

Generator Function có khả năng **tạm dừng thực thi** và **tiếp tục thực thi**, đó là lý do cơ bản cho việc nó có thể đóng gói các tác vụ bất đồng bộ.

Ngoài ra, nó còn có hai tính năng khác, làm cho nó trở thành một giải pháp hoàn chỉnh cho lập trình bất đồng bộ: **trao đổi dữ liệu giữa bên trong và bên ngoài hàm** và **cơ chế xử lý lỗi**.

Thuộc tính `value` của giá trị trả về từ `next` là dữ liệu được Generator Function xuất ra bên ngoài; phương thức `next` cũng có thể nhận tham số, là dữ liệu được nhập vào Generator Function.

```js
function* gen(x) {
  var y = yield x + 2;
  return y;
}

var generator = gen(1);

generator.next(); // { value: 3, done: false }
generator.next(2); // { value: 2, done: true }
```

Trong đoạn mã trên, thuộc tính `value` của phương thức `next` đầu tiên trả về giá trị của biểu thức `x + 2`, tức là `3`. Phương thức `next` thứ hai có tham số `2`, tham số này có thể được truyền vào Generator Function và được gán cho biến `y` trong cơ thể hàm. Do đó, giá trị trả về của bước này là `2` (giá trị của biến `y`).

Generator Function cũng có thể triển khai mã xử lý lỗi, bắt lỗi được ném ra từ bên ngoài cơ thể hàm.

```js
function* gen(x) {
  try {
    var y = yield x + 2;
  } catch (e) {
    console.log(e);
  }
  return y;
}

var generator = gen(1);
generator.next();
generator.throw('Lỗi');
// Lỗi
```

Dòng cuối cùng của đoạn mã, lỗi được ném ra từ bên ngoài cơ thể hàm bằng phương thức `throw` của đối tượng con trỏ, có thể được bắt bởi khối mã `try…catch` trong cơ thể hàm. Điều này có nghĩa là mã lỗi và mã xử lý lỗi đã được tách ra về mặt thời gian và không gian, điều này rõ ràng là rất quan trọng đối với lập trình bất đồng bộ.

### Đóng gói tác vụ bất đồng bộ

Dưới đây là một ví dụ về cách sử dụng hàm Generator để thực hiện một tác vụ bất đồng bộ thực tế.

```js
var fetch = require('node-fetch');

function* gen() {
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url);
  console.log(result.bio);
}
```

Trong đoạn mã trên, hàm Generator đóng gói một hoạt động bất đồng bộ, hoạt động này đầu tiên đọc một giao diện từ xa, sau đó phân tích thông tin từ dữ liệu định dạng JSON. Giống như đã nói trước đó, đoạn mã này rất giống với hoạt động đồng bộ, chỉ có sự xuất hiện của câu lệnh `yield`.

Cách thực thi đoạn mã này như sau.

```js
var g = gen();
var result = g.next();

result.value
  .then(function(data) {
    return data.json();
  })
  .then(function(data) {
    g.next(data);
  });
```

Trong đoạn mã trên, trước tiên chúng ta thực thi hàm Generator để nhận đối tượng trình lặp, sau đó sử dụng phương thức `next` (dòng thứ hai) để thực hiện giai đoạn đầu tiên của tác vụ bất đồng bộ. Vì module `Fetch` trả về một đối tượng Promise, nên chúng ta sử dụng phương thức `then` để gọi phương thức `next` tiếp theo.

Có thể thấy, mặc dù hàm Generator biểu diễn các hoạt động bất đồng bộ một cách ngắn gọn, nhưng quản lý luồng điều khiển lại không thuận tiện (tức là khi nào thực hiện giai đoạn đầu tiên, khi nào thực hiện giai đoạn thứ hai).

## Thunk function

Thunk function là một phương pháp tự động thực thi Generator function.

### Chiến lược đánh giá tham số

Thunk function đã được ra đời từ những năm 60 của thế kỷ trước.

Lúc đó, ngôn ngữ lập trình mới chỉ mới bắt đầu, các nhà khoa học máy tính đang nghiên cứu cách viết trình biên dịch tốt nhất. Một trong những vấn đề tranh luận là **chiến lược đánh giá** tham số, tức là tham số của hàm nên được đánh giá khi nào.

```js
var x = 1;

function f(m) {
  return m * 2;
}

f(x + 5);
```

Đoạn mã trên đầu tiên định nghĩa hàm `f`, sau đó truyền biểu thức `x + 5` vào nó. Vậy câu hỏi đặt ra là, biểu thức này nên được đánh giá khi nào?

Một quan điểm là **gọi theo giá trị** (call by value), tức là tính toán giá trị của `x + 5` trước khi vào thân hàm (bằng 6), sau đó truyền giá trị này vào hàm `f`. Ngôn ngữ C sử dụng chiến lược này.

```js
f(x + 5);
// Khi gọi theo giá trị, tương đương với
f(6);
```

Một quan điểm khác là **gọi theo tên** (call by name), tức là truyền biểu thức `x + 5` trực tiếp vào thân hàm và chỉ đánh giá khi cần sử dụng. Ngôn ngữ Haskell sử dụng chiến lược này.

```js
f(x + 5)(
  // Khi gọi theo tên, tương đương với
  x + 5
) * 2;
```

Gọi theo giá trị và gọi theo tên, phương pháp nào tốt hơn?

Câu trả lời là cả hai có ưu điểm và nhược điểm riêng. Gọi theo giá trị đơn giản hơn, nhưng khi đánh giá tham số, thực tế chưa sử dụng đến tham số đó, có thể gây mất hiệu năng.

```js
function f(a, b) {
  return b;
}

f(3 * x * x - 2 * x - 1, x);
```

Trong đoạn mã trên, tham số đầu tiên của hàm `f` là một biểu thức phức tạp, nhưng thực tế trong thân hàm không sử dụng đến nó. Đánh giá tham số này là không cần thiết. Do đó, một số nhà khoa học máy tính thiên về "gọi theo tên", tức chỉ đánh giá khi thực hiện.

### Ý nghĩa của Thunk function

Cách thực hiện "gọi theo tên" của trình biên dịch thường là đặt tham số vào một hàm tạm thời, sau đó truyền hàm tạm thời này vào thân hàm. Hàm tạm thời này được gọi là Thunk function.

```js
function f(m) {
  return m * 2;
}

f(x + 5);

// Tương đương với

var thunk = function() {
  return x + 5;
};

function f(thunk) {
  return thunk() * 2;
}
```

Trong đoạn mã trên, tham số `x + 5` của hàm `f` đã được thay thế bằng một hàm. Ở bất kỳ nơi nào sử dụng tham số gốc, chỉ cần đánh giá Thunk function là được.

Đây chính là định nghĩa của Thunk function, nó là một chiến lược thực hiện "gọi theo tên", được sử dụng để thay thế một biểu thức nào đó.

### Thunk function trong JavaScript

Trong ngôn ngữ JavaScript, thực hiện theo cách gọi theo giá trị (call by value), nên ý nghĩa của Thunk function có chút khác biệt. Trong JavaScript, Thunk function không thay thế biểu thức mà thay thế một hàm có nhiều tham số bằng một hàm chỉ nhận một hàm callback làm tham số.

```js
// Phiên bản thông thường của hàm readFile (phiên bản nhiều tham số)
fs.readFile(fileName, callback);

// Phiên bản Thunk của hàm readFile (phiên bản một tham số)
var Thunk = function(fileName) {
  return function(callback) {
    return fs.readFile(fileName, callback);
  };
};

var readFileThunk = Thunk(fileName);
readFileThunk(callback);
```

Trong đoạn mã trên, phương thức `readFile` của module `fs` là một hàm có nhiều tham số, hai tham số lần lượt là tên tệp và hàm callback. Sau khi được chuyển đổi, nó trở thành một hàm chỉ nhận một hàm callback làm tham số. Phiên bản hàm chỉ nhận một tham số này được gọi là Thunk function.

Bất kỳ hàm nào có tham số là một hàm callback đều có thể được viết dưới dạng Thunk function. Dưới đây là một ví dụ đơn giản về trình chuyển đổi Thunk function.

```js
// Phiên bản ES5
var Thunk = function(fn) {
  return function() {
    var args = Array.prototype.slice.call(arguments);
    return function(callback) {
      args.push(callback);
      return fn.apply(this, args);
    };
  };
};

// Phiên bản ES6
const Thunk = function(fn) {
  return function(...args) {
    return function(callback) {
      return fn.call(this, ...args, callback);
    };
  };
};
```

Sử dụng trình chuyển đổi trên, ta có Thunk function của `fs.readFile`.

```js
var readFileThunk = Thunk(fs.readFile);

readFileThunk(fileA)(callback);
```

Dưới đây là một ví dụ hoàn chỉnh khác.

```js
function f(a, cb) {
  cb(a);
}
const ft = Thunk(f);

ft(1)(console.log); // 1
```

### Module Thunkify

Trong môi trường sản xuất, khuyến nghị sử dụng module Thunkify để chuyển đổi.

Trước tiên, cài đặt module.

```bash
$ npm install thunkify
```

Cách sử dụng như sau.

```js
var thunkify = require('thunkify');
var fs = require('fs');

var read = thunkify(fs.readFile);
read('package.json')(function(err, str) {
  // ...
});
```

Mã nguồn của Thunkify rất giống với trình chuyển đổi đơn giản trong phần trước.

```js
function thunkify(fn) {
  return function() {
    var args = new Array(arguments.length);
    var ctx = this;

    for (var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }

    return function(done) {
      var called;

      args.push(function() {
        if (called) return;
        called = true;
        done.apply(null, arguments);
      });

      try {
        fn.apply(ctx, args);
      } catch (err) {
        done(err);
      }
    };
  };
}
```

Mã nguồn chủ yếu thêm một cơ chế kiểm tra, biến `called` đảm bảo hàm callback chỉ được thực thi một lần. Thiết kế này liên quan đến Generator function được đề cập bên dưới. Hãy xem ví dụ sau.

```js
function f(a, b, callback) {
  var sum = a + b;
  callback(sum);
  callback(sum);
}

var ft = thunkify(f);
var print = console.log.bind(console);
ft(1, 2)(print);
// 3
```

Trong đoạn mã trên, do Thunkify chỉ cho phép hàm callback được thực thi một lần, nên chỉ có một dòng kết quả được in ra.

### Quản lý luồng của Generator function

Bạn có thể đặt câu hỏi, Thunk function có tác dụng gì? Câu trả lời là trước đây nó không có nhiều tác dụng, nhưng với ES6, có Generator function, Thunk function có thể được sử dụng để quản lý luồng tự động của Generator function.

Generator function có thể tự động thực thi.

```js
function* gen() {
  // ...
}

var g = gen();
var res = g.next();

while (!res.done) {
  console.log(res.value);
  res = g.next();
}
```

Trong đoạn mã trên, Generator function `gen` sẽ tự động thực hiện tất cả các bước.

Tuy nhiên, điều này không phù hợp cho các hoạt động bất đồng bộ. Nếu phải đảm bảo bước trước thực hiện xong mới thực hiện bước sau, việc tự động thực thi như trên không khả thi. Lúc này, Thunk function sẽ có ích. Lấy việc đọc tệp làm ví dụ. Dưới đây là một Generator function đóng gói hai hoạt động bất đồng bộ.

```js
var fs = require('fs');
var thunkify = require('thunkify');
var readFileThunk = thunkify(fs.readFile);

var gen = function*() {
  var r1 = yield readFileThunk('/etc/fstab');
  console.log(r1.toString());
  var r2 = yield readFileThunk('/etc/shells');
  console.log(r2.toString());
};
```

Trong đoạn mã trên, lệnh `yield` được sử dụng để chuyển quyền thực thi của chương trình ra khỏi Generator function, vì vậy cần một phương pháp để trả lại quyền thực thi cho Generator function.

Phương pháp đó chính là Thunk function, vì nó có thể trả lại quyền thực thi cho Generator function trong hàm callback. Để dễ hiểu, trước tiên chúng ta hãy xem cách thực hiện Generator function này thủ công.

```js
var g = gen();

var r1 = g.next();
r1.value(function(err, data) {
  if (err) throw err;
  var r2 = g.next(data);
  r2.value(function(err, data) {
    if (err) throw err;
    g.next(data);
  });
});
```

Trong đoạn mã trên, biến `g` là con trỏ nội bộ của Generator function, đại diện cho bước đang thực thi. Phương thức `next` đảm nhiệm di chuyển con trỏ đến bước tiếp theo và trả về thông tin của bước đó (`value` và `done`).

Xem xét kỹ mã trên, bạn có thể nhận thấy quá trình thực thi của Generator function thực chất là lặp lại việc truyền cùng một hàm callback vào thuộc tính `value` của phương thức `next`. Điều này cho phép chúng ta sử dụng đệ quy để tự động hoàn thành quá trình này.

### Quản lý luồng tự động của Thunk function

Sức mạnh thực sự của Thunk function nằm ở việc nó có thể tự động thực thi Generator function. Dưới đây là một trình thực thi Generator dựa trên Thunk function.

```js
function run(fn) {
  var gen = fn();

  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    result.value(next);
  }

  next();
}

function* g() {
  // ...
}

run(g);
```

Hàm `run` trong đoạn mã trên là một trình thực thi tự động của Generator function. Hàm `next` bên trong là hàm callback của Thunk function. Hàm `next` trước tiên di chuyển con trỏ đến bước tiếp theo của Generator function (`gen.next`), sau đó kiểm tra xem Generator function đã kết thúc chưa (`result.done`), nếu chưa kết thúc, hàm `next` sẽ được truyền vào Thunk function (`result.value`) để tiếp tục thực thi, nếu đã kết thúc thì thoát khỏi hàm.

Có trình thực thi này, việc thực thi Generator function dễ dàng hơn nhiều. Bất kể có bao nhiêu hoạt động bất đồng bộ bên trong, chỉ cần truyền Generator function vào hàm `run`. Tất nhiên, điều kiện tiên quyết là mỗi hoạt động bất đồng bộ phải là Thunk function, nghĩa là phải theo sau lệnh `yield`.

```js
var g = function*() {
  var f1 = yield readFileThunk('fileA');
  var f2 = yield readFileThunk('fileB');
  // ...
  var fn = yield readFileThunk('fileN');
};

run(g);
```

Trong đoạn mã trên, hàm `g` đóng gói `n` hoạt động bất đồng bộ đọc tệp, chỉ cần thực thi hàm `run`, các hoạt động này sẽ tự động hoàn thành. Như vậy, hoạt động bất đồng bộ không chỉ có thể viết giống như hoạt động đồng bộ, mà còn có thể thực hiện chỉ với một dòng mã.

Thunk function không phải là giải pháp duy nhất để tự động thực thi Generator function. Vì quá trình thực hiện tự động quan trọng là phải có một cơ chế để tự động điều khiển luồng của Generator function, nhận và trả lại quyền thực thi của chương trình. Hàm callback và đối tượng Promise cũng có thể làm được điều này.

## Module co

### Cách sử dụng cơ bản

Module co là một công cụ nhỏ được phát hành vào tháng 6 năm 2013 bởi nhà lập trình nổi tiếng TJ Holowaychuk, được sử dụng để tự động thực thi Generator function.

Dưới đây là một Generator function, được sử dụng để đọc lần lượt hai tệp.

```js
var gen = function*() {
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

Module co cho phép bạn không cần viết trình thực thi cho Generator function.

```js
var co = require('co');
co(gen);
```

Trong đoạn mã trên, chỉ cần truyền Generator function vào hàm `co`, nó sẽ tự động thực thi.

Hàm `co` trả về một đối tượng `Promise`, do đó bạn có thể sử dụng phương thức `then` để thêm hàm callback.

```js
co(gen).then(function() {
  console.log('Hoàn thành thực thi Generator function');
});
```

Trong đoạn mã trên, khi Generator function thực thi xong, sẽ in ra một dòng thông báo.

### Nguyên lý hoạt động của module co

Tại sao co có thể tự động thực thi Generator function?

Như đã đề cập trước đó, Generator function là một container cho các hoạt động bất đồng bộ. Để tự động thực thi, nó cần một cơ chế để khi hoạt động bất đồng bộ có kết quả, có thể tự động trả lại quyền thực thi.

Có hai phương pháp có thể làm được điều này.

1. Hàm callback. Đóng gói hoạt động bất đồng bộ thành Thunk function, và trả lại quyền thực thi trong hàm callback.
2. Đối tượng Promise. Đóng gói hoạt động bất đồng bộ thành đối tượng Promise, và sử dụng phương thức `then` để trả lại quyền thực thi.

Module co thực chất là đóng gói hai trình thực thi tự động này (Thunk function và đối tượng Promise) thành một module. Điều kiện tiên quyết để sử dụng co là lệnh `yield` trong Generator function chỉ có thể là Thunk function hoặc đối tượng Promise. Nếu các thành viên của mảng hoặc đối tượng là đối tượng Promise, cũng có thể sử dụng co, chi tiết xem ví dụ ở phần sau.

### Tự động thực thi dựa trên đối tượng Promise

Tiếp tục với ví dụ trước. Đầu tiên, đóng gói phương thức `readFile` của module `fs` thành một đối tượng Promise.

```js
var fs = require('fs');

var readFile = function(fileName) {
  return new Promise(function(resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};

var gen = function*() {
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

Sau đó, thực hiện Generator function thủ công.

```js
var g = gen();

g.next().value.then(function(data) {
  g.next(data).value.then(function(data) {
    g.next(data);
  });
});
```

Thực hiện thủ công thực chất là sử dụng phương thức `then`, lồng nhau các hàm callback. Hiểu được điều này, bạn có thể viết một trình thực thi tự động.

```js
function run(gen) {
  var g = gen();

  function next(data) {
    var result = g.next(data);
    if (result.done) return result.value;
    result.value.then(function(data) {
      next(data);
    });
  }

  next();
}

run(gen);
```

Trong đoạn mã trên, chỉ cần Generator function chưa thực hiện xong, hàm `next` sẽ gọi chính nó để tự động thực thi.
