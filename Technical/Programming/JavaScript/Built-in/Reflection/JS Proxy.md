---
title: JS Proxy
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-08
---

# Proxy

Đối tượng Proxy được sử dụng để thay đổi hành vi mặc định của một số hoạt động (như tìm kiếm thuộc tính, gán giá trị, liệt kê, gọi hàm, v.v.), tương đương với việc thay đổi ngôn ngữ lập trình ở mức độ ngôn ngữ, do đó nó thuộc về một loại **siêu lập trình** (Meta Programming), tức là lập trình cho ngôn ngữ lập trình.

Proxy có thể hiểu là một **đại diện** được đặt trước đối tượng mục tiêu, mọi truy cập từ bên ngoài vào đối tượng đó đều phải thông qua lớp đại diện này, do đó cung cấp một cơ chế để lọc và thay đổi truy cập từ bên ngoài.

Từ "Proxy" có nghĩa là **ủy quyền**, được sử dụng ở đây để đại diện cho một số hoạt động, có thể dịch là **đại diện**.

- `target`: Đối tượng được ảo hóa bởi Proxy, thường được sử dụng làm lưu trữ đại diện, kiểm tra các invariants về không thể mở rộng hoặc thuộc tính không thể cấu hình của đối tượng (duy trì ý nghĩa không thay đổi)
- `handler`: Đối tượng chứa các trình bắt (Trap), có thể dịch là đối tượng xử lý
- `traps`: Cung cấp các phương thức truy cập thuộc tính, tương tự như khái niệm trình bắt trong hệ điều hành

**Cách sử dụng:**

ES6 cung cấp Proxy constructor để tạo ra một instance của Proxy.

```js
const proxy = new Proxy(target, handler);
```

Tất cả các cách sử dụng của đối tượng Proxy đều có cùng cú pháp như trên, chỉ khác nhau ở cách viết tham số `handler`. Trong đó, `new Proxy()` đại diện cho việc tạo ra một instance của Proxy, tham số `target` đại diện cho đối tượng mục tiêu mà chúng ta muốn chặn, tham số `handler` cũng là một đối tượng, được sử dụng để tùy chỉnh hành vi chặn.

## Sử dụng cơ bản

```js
const proxy = new Proxy(
  {},
  {
    get: function (target, property, receiver) {
      console.log(`Đang truy cập ${property}!`);

      return Reflect.get(target, property, receiver);
    },
    set: function (target, property, value, receiver) {
      console.log(`Đang gán giá trị cho ${property}!`);

      return Reflect.set(target, property, value, receiver);
    },
  }
);
```

Đoạn mã trên tạo ra một lớp đại diện cho một đối tượng trống, và định nghĩa lại hành vi **đọc** (get) và **gán giá trị** (set) của thuộc tính. Ở đây tạm thời chưa giải thích cú pháp cụ thể, chỉ xem kết quả chạy. Khi đọc hoặc gán giá trị cho thuộc tính của đối tượng đại diện `proxy` đã được định nghĩa hành vi chặn, kết quả nhận được sẽ như sau:

```js
proxy.count = 1;
// Đang gán giá trị cho count!

++proxy.count;
// Đang truy cập count!
// Đang gán giá trị cho count!
// 2
```

Đoạn mã trên cho thấy, Proxy thực tế là **nạp chồng** (Overload) toán tử dấu chấm, tức là sử dụng định nghĩa của chính nó để ghi đè định nghĩa gốc của ngôn ngữ.

## Vấn đề về ngữ cảnh tham chiếu của Proxy

Mặc dù Proxy có thể đại diện cho việc truy cập vào đối tượng mục tiêu, nhưng nó không phải là một đại diện trong suốt cho đối tượng mục tiêu, tức là không thể đảm bảo hành vi tương tự với đối tượng mục tiêu khi không có bất kỳ sự chặn nào. Nguyên nhân chính là khi Proxy đại diện, từ khóa `this` bên trong đối tượng mục tiêu sẽ trỏ đến Proxy đại diện.

```js
const target = {
  foo: function () {
    console.log(this === proxy);
  },
};

const handler = {};

const proxy = new Proxy(target, handler);

console.log(target.foo());
// false
console.log(proxy.foo());
// true
```

Trong đoạn mã trên, khi `proxy` đại diện cho `target.foo`, từ khóa `this` bên trong `target.foo` sẽ trỏ đến `proxy`, chứ không phải `target`.

## Hỗ trợ lồng nhau

Proxy cũng **không hỗ trợ lồng nhau**, điều này giống với `Object.defineProperty()`. Do đó, để giải quyết vấn đề này, chúng ta cần duyệt qua từng cấp độ. Cách viết Proxy là sử dụng đệ quy trong `get` và trả về một Proxy mới.

```js
// Dữ liệu cần đại diện
const data = {
  info: {
    name: 'Eason',
    blogs: ['Webpack', 'Babel', 'React'],
  },
};

// Đối tượng xử lý
const handler = {
  get(target, key, receiver) {
    console.log('GET', key);

    // Tạo và trả về đệ quy
    if (typeof target[key] === 'object' && target[key] !== null) {
      return new Proxy(target[key], handler);
    }

    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    console.log('SET', key, value);

    return Reflect.set(target, key, value, receiver);
  },
};

const proxy = new Proxy(data, handler);

// Đoạn mã dưới đây sẽ thực hiện set
proxy.info.name = 'Zoe';
proxy.info.blogs.push('proxy');
```

## Proxy và Object.defineProperty

ES5 cung cấp phương thức `Object.defineProperty`, phương thức này cho phép định nghĩa một thuộc tính mới trên một đối tượng, hoặc sửa đổi một thuộc tính hiện có trên một đối tượng và trả về đối tượng đó.

Tuy nhiên, `Object.defineProperty` có ba vấn đề chính:

- Không thể theo dõi sự thay đổi của mảng, Vue sử dụng Hack để ghi đè tám phương thức mảng để thực hiện điều này.
- Chỉ có thể can thiệp vào thuộc tính của đối tượng, do đó, các thuộc tính cần liên kết hai chiều phải được định nghĩa rõ ràng.
- Phải duyệt qua đối tượng lồng nhau một cách sâu để thực hiện can thiệp.

Khác biệt giữa Proxy và Object.defineProperty:

- Proxy có thể trực tiếp theo dõi sự thay đổi của mảng.
- Proxy có thể trực tiếp theo dõi đối tượng chứ không chỉ là thuộc tính.
- Proxy có thể can thiệp vào toàn bộ đối tượng và trả về một đối tượng mới, vượt trội so với `Object.defineProperty` cả về tính tiện lợi và chức năng cơ bản.
- Proxy có tới 13 phương thức chặn, không giới hạn ở `apply`, `ownKeys`, `deleteProperty`, `has`, v.v., trong khi `Object.defineProperty` không có.

Nhược điểm của Proxy:

Nhược điểm của Proxy là sự tương thích, không thể sử dụng Polyfill để giải quyết vấn đề tương thích.

## Ứng dụng

### Pipeline

Trong các đề xuất ECMAScript mới nhất, đã xuất hiện toán tử pipeline `|>`, có khái niệm tương tự trong RxJS và Node.js.

Sử dụng Proxy, chúng ta cũng có thể thực hiện chức năng `pipe`, chỉ cần sử dụng `get` để chặn việc truy cập thuộc tính, đặt tất cả các phương thức truy cập vào mảng `stack`, và khi truy cập cuối cùng vào `execute`, trả về kết quả.

```js
const pipe = (value) => {
  const stack = [];
  const proxy = new Proxy(
    {},
    {
      get(target, prop) {
        if (prop === 'execute') {
          return stack.reduce(function (val, fn) {
            return fn(val);
          }, value);
        }
        stack.push(window[prop]);
        return proxy;
      },
    }
  );
  return proxy;
};

const double = (n) => n * 2;
const pow = (n) => n * n;

console.log(pipe(3).double.pow.execute);
```

### Nạp chồng toán tử

Toán tử `in` được sử dụng để kiểm tra xem một thuộc tính cụ thể có trong một đối tượng cụ thể hoặc chuỗi nguyên mẫu của nó hay không, nhưng nó cũng là toán tử được nạp chồng tinh vi nhất về cú pháp. Ví dụ này định nghĩa một hàm `range` để so sánh các số trong một khoảng liên tục.

```js
const range = (min, max) => {
  return new Proxy(Object.create(null), {
    has: (_, prop) => +prop >= min && +prop <= max,
  });
};
```

Khác với Python, Python sử dụng các generator để so sánh với các chuỗi số nguyên hữu hạn, phương pháp này hỗ trợ so sánh số thập phân và có thể mở rộng để hỗ trợ các khoảng số khác.

```js
const num = 11;
const data = [1, 5, num, 50, 100];

if (num in range(1, 100)) {
  // làm gì đó
}

data.filter((n) => n in range(1, 10));
// [1, 5]
```

Mặc dù trường hợp sử dụng này có thể không giải quyết các vấn đề phức tạp, nhưng nó cung cấp mã nguồn sạch, dễ đọc và có thể tái sử dụng.

Ngoài toán tử `in`, chúng ta cũng có thể nạp chồng `delete` và `new`.

### Tìm kiếm đối tượng cụ thể trong mảng thông qua thuộc tính

Đoạn mã dưới đây mở rộng một số tiện ích cho một mảng thông qua Proxy. Như bạn có thể thấy, với Proxy, chúng ta có thể linh hoạt định nghĩa các thuộc tính mà không cần sử dụng phương thức `Object.defineProperties`. Ví dụ dưới đây có thể được sử dụng để tìm kiếm một hàng trong bảng dựa trên một ô cụ thể.

```js
const data = [
  { name: 'Firefox', type: 'browser' },
  { name: 'SeaMonkey', type: 'browser' },
  { name: 'Thunderbird', type: 'mailer' },
];

const products = new Proxy(data, {
  get: function (target, prop) {
    // Hành vi mặc định là trả về giá trị thuộc tính
    if (prop in target) {
      return target[prop];
    }

    // Lấy số lượng sản phẩm, đó là đồng nghĩa với target.length
    if (typeof prop === 'number') {
      return target.length;
    }

    let result,
      types = {};

    for (let item of target) {
      if (item.name === prop) {
        result = item;
      }
      if (types[item.type]) {
        types[item.type].push(item);
      } else {
        types[item.type] = [item];
      }
    }

    // Lấy item dựa trên tên
    if (result) return result;

    // Lấy item dựa trên loại
    if (prop in types) return types[prop];

    // Lấy danh sách loại sản phẩm
    if (prop === 'types') {
      return Object.keys(types);
    }

    return undefined;
  },
});

console.log(products[0]);
// { name: 'Firefox', type: 'browser' }

console.log(products['Firefox']);
// { name: 'Firefox', type: 'browser' }

console.log(products['Chrome']);
// undefined

console.log(products.browser);
// [
//   { name: 'Firefox', type: 'browser' },
//   { name: 'SeaMonkey', type: 'browser' }
// ]

console.log(products.types);
// ['browser', 'mailer']

console.log(products.number);
// 3
```

### Mở rộng hàm khởi tạo

Phương thức đại diện có thể dễ dàng mở rộng một hàm khởi tạo hiện có thông qua một hàm khởi tạo mới.

```js
const extend = function (sup, base) {
  const descriptor = Object.getOwnPropertyDescriptor(base.prototype, 'constructor');

  base.prototype = Object.create(sup.prototype);

  const handler = {
    construct: function (target, args) {
      const obj = Object.create(base.prototype);

      this.apply(target, obj, args);

      return obj;
    },
    apply: function (target, context, args) {
      sup.apply(context, args);
      base.apply(context, args);
    },
  };

  const proxy = new Proxy(base, handler);

  descriptor.value = proxy;

  Object.defineProperty(base.prototype, 'constructor', descriptor);

  return proxy;
};
```

Sử dụng ví dụ:

```js
const Person = function (name) {
  this.name = name;
};

const Boy = extend(Person, function (name, age) {
  this.age = age;
});

Boy.prototype.sex = 'Male';

const Peter = new Boy('Peter', 20);

console.log(Peter.sex);
// 'Male'
console.log(Peter.name);
// 'Peter'
console.log(Peter.age);
// 20
```

### Hiệu ứng phụ

Chúng ta có thể sử dụng Proxy để tạo ra hiệu ứng phụ khi đọc và ghi thuộc tính. Ý tưởng là khi truy cập hoặc ghi vào một số thuộc tính cụ thể, chúng ta có thể kích hoạt một số hàm.

```js
const dosomething = () => {
  console.log('Thực hiện một số công việc sau khi hoàn thành');
};

const handler = {
  set: function (target, prop, value) {
    if (prop === 'status' && value === 'complete') {
      dosomething();
    }

    target[prop] = value;
  },
};

const tasks = new Proxy({}, handler);

tasks.status = 'complete';
```

Khi thuộc tính `status` được ghi và giá trị là `'complete'`, hàm hiệu ứng phụ `dosomething()` sẽ được kích hoạt.

### Bộ nhớ cache

Tận dụng khả năng can thiệp vào việc đọc và ghi thuộc tính của đối tượng, chúng ta có thể tạo ra một bộ nhớ cache dựa trên bộ nhớ, chỉ trả về giá trị khi nó chưa hết hạn:

```js
const cacheTarget = (target, ttl = 60) => {
  const CREATED_AT = Date.now();
  const isExpired = () => (Date.now() - CREATED_AT) > (ttl * 1000);
  const handler = {
    get: (target, prop) => isExpired() ? undefined : target[prop],
  };

  return new Proxy(target, handler);
};

const cache = cacheTarget({ age: 25 }, 5);

console.log(cache.age);

setTimeout(() => {
  console.log(cache.age);
}, 6 * 1000);
```

Ở đây, chúng ta tạo một hàm và trả về một Proxy. Trước khi truy cập vào thuộc tính của `target`, `handler` của Proxy này sẽ kiểm tra xem đối tượng `target` có hết hạn không, và dựa trên điều này, chúng ta có thể thiết lập kiểm tra hết hạn cho mỗi khóa giá trị bằng cách sử dụng TTLs hoặc cơ chế khác.

### Đối tượng Cookie

Nếu bạn đã từng làm việc với Cookie, bạn sẽ phải làm việc với `document.cookie`. Đây là một API khá đặc biệt, vì API này là một chuỗi, nó đọc tất cả các Cookie và phân tách chúng bằng dấu chấm phẩy.

`document.cookie` là một chuỗi có dạng như sau:

```js
_octo=GH1.2.2591.47507; _ga=GA1.1.62208.4087; has_recent_activity=1
```

Đơn giản mà nói, việc xử lý `document.cookie` khá phức tạp và dễ gây lỗi. Một cách để làm việc với nó là sử dụng một framework Cookie đơn giản, có thể được thực hiện bằng cách sử dụng Proxy.

```js
const getCookie = () => {
  const cookies = document.cookie.split(';').reduce((acc, item) => ({
    [item.substr(0, item.indexOf('=')).trim()]: item.substr(item.indexOf('=') + 1),
    ...acc,
  }));

  const setCookie = (name, val) => (document.cookie = `${name}=${val}`);

  const deleteCookie = (name) =>
    (document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`);

  return new Proxy(cookies, {
    set: (obj, prop, val) => (setCookie(prop, val), Reflect.set(obj, prop, val)),
    deleteProperty: (obj, prop) => (deleteCookie(prop), Reflect.deleteProperty(obj, prop)),
  });
};
```

Hàm này trả về một đối tượng key-value, nhưng Proxy sẽ xử lý tất cả các thay đổi về Cookie.

```js
let docCookies = getCookies();

docCookies.has_recent_activity;
// 1
docCookies.has_recent_activity = '2';
// 2
delete docCookies['has_recent_activity'];
// true
```

Trong 11 dòng mã này, việc sửa đổi Cookie được thực hiện một cách tốt hơn, mặc dù trong môi trường sản xuất, bạn cần thêm các tính năng bổ sung như chuẩn hóa chuỗi.

### Nhật ký và thống kê

Trong việc phát triển phía máy chủ, chúng ta có thể sử dụng Proxy để làm proxy cho các hàm và nhật ký số lần gọi trong một khoảng thời gian nhất định.

Điều này có thể hữu ích khi phân tích hiệu năng sau này:

```js
function noop() {}

const proxyFunction = new Proxy(noop, {
  apply(target, context, args) {
    logger();

    return target.apply(context, args);
  },
});
```

Hoặc:

```js
const data = {
  name: 'Jerry',
  author: 'Lauren Weisberger'
}

const proxy = new Proxy(data, {
  set(target, key, value) {
    console.log('Đặt', key, ':', target[key], '->', value);

    target[key] = value;
  }
})

proxy.name = 'Notebook';
// Đặt name : The Devil wears prada -> Notebook
proxy.name = 'asdf';
// Đặt name : Notebook -> asdf
```

Như ví dụ trên, bạn có thể xác định chính xác khi nào thuộc tính của một đối tượng đã được thay đổi và bạn cũng có thể sử dụng các phương thức như `console.trace` để xác định nơi nó đã được thay đổi.

Mở rộng đến các loại handler khác, sau khi bạn bọc một đối tượng trong một Proxy, bạn có thể biết khi nào và ở đâu thuộc tính của nó được đọc, được gọi, được khởi tạo, bị xóa, được truy cập vào thuộc tính, v.v.

Nghe có vẻ việc xác định vấn đề với các loại động có thể trở nên đơn giản hơn. Nếu có một thư viện giám sát đối tượng phổ biến, nhà phát triển chỉ cần nhập thư viện đó và bọc đối tượng cần giám sát để có thể in ra toàn bộ lịch sử hoạt động của đối tượng đó.

### Đại diện động

Đại diện đơn giản:

```js
const axios = require('axios');

const instance = axios.create({ baseURL: 'http://localhost:3000/api' });
const METHODS = ['get', 'post', 'patch'];

// proxy api
const api = new Proxy(
  {},
  {
    // proxy api.${name}
    get: (_, name) =>
      new Proxy(
        {},
        {
          // proxy api.${name}.${method}
          get: (_, method) =>
            METHODS.includes(method) &&
            new Proxy(() => {}, {
              // proxy api.${name}.${method}()
              apply: (_, self, [config]) =>
                instance.request({
                  url: name, // /api/${name}
                  method, // ${method}
                  ...config,
                }),
            }),
        }
      ),
  }
);
```

Cách sử dụng có thể là:

```js
// GET /api/user?id=12
api.user
  .get({ params: { id: 12 } })
  .then((user) => console.log(user))
  .catch(console.error);

// POST /api/register
api.register
  .post({ body: { username: 'xxx', passworld: 'xxxx' } })
  .then((res) => console.log(res))
  .catch(console.error);
```

Trong design pattern, có một mô hình trung gian gọi là mô hình trung gian (Mediator pattern), trong mô hình này, Proxy có thể được coi là trung gian trong giao tiếp giữa các đối tượng. Trong trường hợp này, chúng ta không cần xác định quan hệ giữa các đối tượng khác nhau, chỉ cần Proxy đảm bảo trải nghiệm nhất quán với bên ngoài.

Một ví dụ khác là trong tương lai, thông qua Proxy, chúng ta cũng có thể triển khai các kịch bản nạp lại nóng, chúng ta có thể thay thế phiên bản cũ bằng mã mới được yêu cầu bằng cách chỉ định Proxy để ẩn điều này khỏi nhà phát triển.
