---
title: JS Async Function Definition
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-04
date modified: 2023-08-04
---

# Hàm bất đồng bộ - Async Function

Hàm `async` là một cú pháp đơn giản hơn của hàm Generator. Nó được đánh dấu bằng từ khóa `async` và sử dụng lệnh `await` để biểu thị các hoạt động bất đồng bộ.

So với Generator, hàm `async` có những cải tiến sau đây:

- **Bộ thực thi tích hợp**: Việc thực thi hàm Generator phải dựa vào bộ thực thi, trong khi hàm `async` có bộ thực thi tích hợp sẵn, và cách gọi nó giống như gọi một hàm thông thường.
- **Ý nghĩa rõ ràng hơn**: `async` và `await` có ý nghĩa rõ ràng hơn so với dấu sao (`*`) và `yield`. `async` biểu thị rằng hàm có các hoạt động bất đồng bộ, `await` biểu thị rằng biểu thức tiếp theo cần đợi kết quả.
- **Áp dụng rộng hơn**: Module `co` quy định rằng sau lệnh `yield` chỉ có thể là hàm Thunk hoặc đối tượng Promise, trong khi sau lệnh `await` của hàm `async` có thể là Promise và các giá trị nguyên thủy (Number, String và Boolean, nhưng sẽ tự động chuyển thành Promise với trạng thái `fulfilled` ngay lập tức).
- **Giá trị trả về là Promise**: Hàm `async` trả về một đối tượng Promise, điều này thuận tiện hơn so với hàm Generator trả về một đối tượng Iterator. Bạn có thể sử dụng phương thức `then` để chỉ định các bước tiếp theo.

Một cách khái quát, hàm `async` có thể coi là một tập hợp các hoạt động bất đồng bộ được đóng gói thành một đối tượng Promise, và lệnh `await` chỉ là cú pháp đơn giản của lệnh `then` bên trong.

**So sánh giữa hàm `async` và hàm Generator**

|                  | Hàm async            | Hàm Generator     |
| :--------------- | :------------------- | :--------------- |
| **Cách khai báo** | `async function(){}` | `function* (){}` |
| **Lệnh bất đồng bộ** | `await`              | `yield`          |

## Cú pháp cơ bản

### Khai báo hàm bất đồng bộ

Bất kỳ hàm nào được khai báo với từ khóa `async` đều tự động trả về một đối tượng Promise sau khi thực thi.

Hàm `async` trả về một đối tượng Promise, và bạn có thể sử dụng phương thức `then` để thêm các hàm gọi lại. Khi hàm được thực thi, nếu gặp lệnh `await`, nó sẽ tạm dừng và đợi cho đến khi hoạt động bất đồng bộ hoàn thành, sau đó tiếp tục thực thi các câu lệnh trong thân hàm.

🌰 **Ví dụ**:

```js
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function foo(arg1, ms) {
  await timeout(ms);
  return arg1;
}

foo('Hello world!', 500).then(console.log);
// 'Hello world!'
```

### Câu lệnh bất đồng bộ trong hàm

Lệnh `await` chỉ có thể được sử dụng trong hàm `async`, không thể sử dụng độc lập.

Vì hàm `async` trả về một đối tượng Promise, nên nó có thể được sử dụng làm đối số cho lệnh `await`.

### Giá trị trả về của câu lệnh bất đồng bộ

Lệnh `await` phải được theo sau bởi một Promise.

Một trong các chức năng của lệnh `await` là nhận giá trị được truyền từ trạng thái thành công của đối tượng Promise.

Lệnh `await` chỉ có thể được sử dụng trong hàm `async`, nếu không sẽ gây ra lỗi.

## Cú pháp

### Kiểu giá trị trả về

Hàm `async` trả về một đối tượng Promise.

Giá trị được trả về bởi lệnh `return` trong hàm `async` sẽ trở thành đối số của hàm gọi lại của phương thức `then`.

```js
async function foo() {
  return 'Hello world!';
}

foo().then((res) => console.log(res));
// 'Hello world!'
```

Nếu hàm `async` ném ra một ngoại lệ, đối tượng Promise trả về sẽ có trạng thái bị từ chối (`rejected`). Lỗi được ném ra sẽ được nhận bởi hàm gọi lại của phương thức `catch`.

```js
async function foo() {
  throw new Error('Error');
}

foo()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
```

### Thay đổi trạng thái giá trị trả về

Đối tượng Promise trả về từ hàm `async` chỉ thay đổi trạng thái sau khi tất cả các đối tượng Promise sau lệnh `await` trong hàm đã thực thi xong, trừ khi gặp lệnh `return` hoặc ném ra lỗi. Điều này có nghĩa là chỉ khi tất cả các hoạt động bất đồng bộ trong hàm `async` đã hoàn thành, phương thức `then` được chỉ định mới được thực thi.

🌰 **Ví dụ**:

```js
const delay = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

async function foo() {
  await delay(1000);
  await delay(2000);
  await delay(3000);
  return 'done';
}

foo().then(console.log);
// 'done'
```

Trong đoạn mã trên, hàm `foo` có ba hàm trễ. Chỉ khi ba hoạt động này đã hoàn thành theo thứ tự, phương thức `console.log` trong phương thức `then` mới được thực thi.

### Giá trị trả về của câu lệnh bất đồng bộ

Thường thì lệnh `await` sẽ được theo sau bởi một đối tượng Promise và trả về kết quả của đối tượng Promise đó. Nếu không phải là một đối tượng Promise, giá trị tương ứng sẽ được trả về trực tiếp.

🌰 **Ví dụ**:

```js
async function foo(){
    return await 1
}

fn.then(res => console.log(res));
// 1
```

## Xử lý ngoại lệ

### Bắt ngoại lệ

Nếu một đối tượng Promise sau lệnh `await` trở thành trạng thái `rejected`, thì toàn bộ hàm `async` sẽ dừng lại.

🌰 **Ví dụ**:

```js
async function foo() {
  await Promise.reject('Error!');
  await Promise.resolve('Hello world!');
  // Không được thực thi
}
```

Khi một hàm `async` có một câu lệnh `await` trả về một Promise ở trạng thái `rejected`, các câu lệnh `await` sau đó sẽ không được thực thi.

**Giải pháp**: Sử dụng câu lệnh [[JS Try Statement|try-catch]] hoặc sử dụng phương thức `catch` trên Promise trả về từ câu lệnh `await` để bắt lỗi.

Đôi khi, chúng ta muốn tiếp tục thực hiện các hoạt động bất đồng bộ sau khi một hoạt động bất đồng bộ trước đó thất bại. Trong trường hợp này, bạn có thể đặt câu lệnh `await` đầu tiên trong một khối `try…catch` để đảm bảo rằng dù hoạt động bất đồng bộ đó thành công hay không, câu lệnh `await` thứ hai vẫn được thực thi.

🌰 **Ví dụ**:

```js
async function foo() {
  try {
    await Promise.reject('Error!');
  } catch (err) {
    // xử lý lỗi
  }

  return await Promise.resolve('Hello world!');
}

foo().then((res) => console.log(res));
// 'Hello world!'
```

Một phương pháp khác là gắn thêm phương thức `catch` vào đối tượng Promise trả về từ câu lệnh `await`, để xử lý lỗi có thể xảy ra trước đó.

🌰 **Ví dụ**:

```js
async function foo() {
  await Promise.reject('Error!').catch((e) => console.log(e));

  return await Promise.resolve('Hello world!');
}

foo().then((res) => console.log(res));
// 'Error!'
// 'Hello world!'
```

### Gián đoạn hoạt động

Nếu hoạt động bất đồng bộ sau lệnh `await` gặp lỗi, thì hàm `async` sẽ trả về một Promise bị từ chối (`rejected`).

Sử dụng câu lệnh `try…catch` để thực hiện nhiều lần thử lại.

🌰 **Ví dụ**:

```js
const superagent = require('superagent');
const NUM_RETRIES = 3;

async function foo() {
  let i;
  for (i = 0; i < NUM_RETRIES; i++) {
    try {
      await superagent.get('https://google.com/this-throws-an-error');
      break;
    } catch (err) {
      // xử lý lỗi
    }
  }

  console.log(i);
  // 3
}

foo();
```

Nếu hoạt động `await` thành công, sẽ sử dụng câu lệnh `break` để thoát khỏi vòng lặp; nếu thất bại, nó sẽ được bắt bởi câu lệnh `catch`, sau đó tiếp tục vòng lặp tiếp theo.

## Nguyên lý triển khai

Cách thức triển của hàm `async` là đóng gói hàm Generator và trình thực thi tự động vào trong một hàm.

🌰 **Ví dụ**:

```js
async function foo() {
  // ...
}
```

Tương đương với:

```js
function foo(args) {
  return spawn(function* () {
    // ...
  });
}
```

Tất cả các hàm `async` có thể được viết dưới dạng thứ hai như trên, trong đó `spawn` là trình thực thi tự động.

```js
function spawn(genF) {
  return new Promise(function (resolve, reject) {
    const gen = genF();
    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch (e) {
        return reject(e);
      }
      if (next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(
        function (v) {
          step(function () {
            return gen.next(v);
          });
        },
        function (e) {
          step(function () {
            return gen.throw(e);
          });
        }
      );
    }
    step(function () {
      return gen.next(undefined);
    });
  });
}
```

## Thực hành tốt nhất

### Chặn bất đồng bộ

Các yêu cầu sau luôn phụ thuộc vào dữ liệu được trả về từ yêu cầu trước đó.

🌰 **Ví dụ**:

```js
function request(time) {
  return new Promise((resolve, rejecr) => {
    setTimeout(() => {
      resolve(time);
    }, time);
  });
}

async function getResult() {
  let p1 = await request(500);
  let p2 = await request(p1 + 1000);
  let p3 = await request(p2 + 1000);
  return p3;
}

getResult()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
```

### Bất đồng bộ không chặn

Trong một số tình huống kinh doanh, bạn có thể cần xử lý nhiều bước liên tiếp, nhưng các bước này không nhất thiết phụ thuộc vào nhau. Do đó, bạn có thể tối ưu hóa các hoạt động này.

Kết hợp giữa Bất đồng bộ chặn và Bất đồng bộ không chặn, chúng ta có thể tận dụng Event Loop và thực hiện các hàm bất đồng bộ này đồng thời.

🌰 **Ví dụ**:

```js
// Chọn pizza
async function selectPizza() {
  // Lấy dữ liệu pizza bất đồng bộ
  const pizzaData = await getPizzaData();
  // Chọn pizza
  const chosenPizza = choosePizza();
  // Thêm pizza đã chọn vào giỏ hàng bất đồng bộ
  await addPizzaToCart(chosenPizza);
}

// Chọn đồ uống
async function selectDrink() {
  // Lấy dữ liệu đồ uống bất đồng bộ
  const drinkData = await getDrinkData();
  // Chọn đồ uống
  const chosenDrink = chooseDrink();
  // Thêm đồ uống đã chọn vào giỏ hàng bất đồng bộ
  await addDrinkToCart(chosenDrink);
}

(async () => {
  // Thực hiện các hàm bất đồng bộ này đồng thời
  Promise.all([selectPizza(), selectDrink()]).then(orderItems);
})();
```

Thêm một cách viết tương tự và tinh tế hơn.

```js
await Promise.all(selectPizza().then(choosePizza), selectDrink().then(chooseDrink));
```

### Bất đồng bộ đồng thời

Các yêu cầu mạng đồng thời không phụ thuộc vào nhau, tốt nhất là sử dụng phương thức `Promise.all` để cùng lúc gửi các yêu cầu.

🌰 **Ví dụ**:

```js
const [userList, orderList] = await Promise.all([getUserList(), getOrderList()]);

let userPromise = getUserList();
let orderPromise = getOrderList();

let user = await userPromise;
let order = await orderPromise;
```

Cả hai cách viết trên đều cho phép `getUserList` và `getOrderList` được gửi cùng một lúc, giúp rút ngắn thời gian thực thi chương trình.

### Bất đồng bộ đa luồng không xác định

Tiếp tục từ phương pháp thực hành trước, khi chúng ta cần giải quyết một số lượng không xác định các Promise, chúng ta chỉ cần tạo một mảng và lưu trữ chúng, sau đó sử dụng phương thức `Promise.all` để đợi đồng thời tất cả các Promise trả về kết quả.

🌰 **Ví dụ**:

```js
async function foo() {
  // Các mục cấu hình hàng loạt
  const items = await batchDisposal();
  // Mỗi mục cấu hình tương ứng với một yêu cầu bất đồng bộ
  const promises = items.map((item) => sendRequest(item));
  await Promise.all(promises);
}
```

### Vòng lặp bất đồng bộ không chờ kết quả

`await` cho mỗi tác vụ lặp lại, lưu ý rằng hàm vô danh được thực thi trong vòng lặp cũng phải được đặt là một hàm bất đồng bộ `async`.

```js
function delay() {
  return new Promise((resolve) => setTimeout(resolve, 300));
}

async function delayedLog(item) {
  // lưu ý rằng chúng ta có thể đợi một hàm trả về Promise
  await delay();
  // log item chỉ sau một khoảng thời gian chờ
  console.log(item);
}

async function execute(tasks) {
  tasks.forEach(async (item) => {
    await delayLog(item);
  });

  console.log('DONE!');
}
```

### Lặp tuần tự bất đồng bộ

Để đợi tất cả các kết quả trả về, chúng ta phải quay lại cách viết truyền thống với vòng lặp `for`:

```js
async function execute(tasks) {
  let result = [];

  for (const task of tasks) {
    try {
      result.push(await task());
    } catch (err) {
      result.push(null);
    }
  }

  return result;
}
```

Vòng lặp trên được thực hiện **tuần tự**, chúng ta cũng có thể chuyển đổi nó thành **đồng thời**.

### Lặp đồng thời bất đồng bộ

Chúng ta có thể thay đổi mã trên để thực hiện các hoạt động bất đồng bộ **đồng thời**:

```js
async function execute(tasks) {
  // ánh xạ các tác vụ thành các Promise
  const promises = tasks.map(delayLog);
  // chờ cho đến khi tất cả các Promise được giải quyết
  await Promise.all(promises);

  console.log('DONE!');
}
