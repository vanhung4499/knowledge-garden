---
title: JS This
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-02
---

# this trong ngữ cảnh thực thi hiện tại

Không có thuật ngữ chính thức nào gọi là "ngữ cảnh thực thi hiện tại", nhưng tôi hiểu `this` là tham chiếu đến ngữ cảnh thực thi đang diễn ra.

## Vị trí gọi

Trước khi hiểu về quá trình ràng buộc `this`, trước tiên cần hiểu về **vị trí gọi** của `this`: Vị trí gọi là vị trí mà hàm được gọi trong mã (không phải vị trí khai báo).

Để hiểu vị trí gọi của `this`, điều quan trọng là phân tích **Ngăn xếp gọi hàm hàm** (call stack) (đó là tất cả các hàm được gọi để đạt được vị trí thực thi hiện tại). Chúng ta quan tâm đến vị trí gọi trong hàm hiện tại, trước khi đến vị trí gọi hiện tại.

```js
function baz() {
  // Ngăn xếp gọi hàm hiện tại là: baz
  // Vì vậy, vị trí gọi hiện tại là phạm vi toàn cục
  console.log('baz');
  bar(); // <-- Vị trí gọi của bar
}

function bar() {
  // Ngăn xếp gọi hàm hiện tại là baz -> bar
  // Vì vậy, vị trí gọi hiện tại là trong baz
  console.log('bar');
  foo(); // <-- Vị trí gọi của foo
}

function foo() {
  // Ngăn xếp gọi hàm hiện tại là baz -> bar -> foo
  // Vì vậy, vị trí gọi hiện tại là trong bar
  console.log('foo');
}

baz(); // <-- Vị trí gọi của baz
```

Lưu ý cách chúng ta phân tích vị trí gọi thực sự từ Ngăn xếp gọi hàm, vì nó quyết định việc ràng buộc `this`.

## Quy tắc ràng buộc

Trong quá trình thực thi hàm, vị trí gọi xác định đối tượng ràng buộc (`this`) theo các quy tắc sau:

Bạn phải xác định vị trí gọi và sau đó áp dụng một trong bốn quy tắc sau. Chúng ta sẽ trình bày từng quy tắc, sau đó giải thích cách xếp hạng ưu tiên khi nhiều quy tắc có thể được áp dụng.

```js
(Call Stack) => (Vị trí gọi) => (Quy tắc ràng buộc) => Ưu tiên quy tắc;
```

### Ràng buộc mặc định (Default Binding)

Đầu tiên, chúng ta sẽ giới thiệu quy tắc phổ biến nhất khi gọi hàm: **gọi hàm độc lập**. Bạn có thể coi đây là quy tắc mặc định khi không áp dụng các quy tắc khác.

🌰 **Ví dụ mã**:

```js
function foo() {
  console.log(this.a);
}

// Biến được khai báo trong phạm vi toàn cục
// Tương đương với window.a = 2
var a = 2;

// Khi gọi hàm foo, this.a được giải thích là biến toàn cục a
// Vì trong ví dụ này, hàm được gọi áp dụng quy tắc ràng buộc mặc định
// Vị trí gọi của foo được phân tích để biết foo được gọi như thế nào
// Hàm foo được gọi trực tiếp mà không có bất kỳ sự thay đổi nào, do đó chỉ có thể áp dụng quy tắc mặc định
foo();
// 2
```

Nếu sử dụng chế độ nghiêm ngặt (Strict Mode), không thể sử dụng đối tượng toàn cục cho ràng buộc mặc định và `this` sẽ được ràng buộc thành `undefined`.

```js
function foo() {
  'use strict';

  console.log(this.a);
}

var a = 2;

foo();
// TypeError: this is undefined
```

Có một chi tiết tinh tế nhưng rất quan trọng, mặc dù quy tắc ràng buộc `this` hoàn toàn phụ thuộc vào vị trí gọi, nhưng chỉ khi `foo()` chạy trong chế độ không nghiêm ngặt, ràng buộc mặc định mới có thể ràng buộc đến đối tượng toàn cục; khi gọi `foo` trong chế độ nghiêm ngặt, nó không bị ảnh hưởng bởi ràng buộc mặc định.

```js
function foo() {
  console.log(this.a);
}

var a = 2;

(function foo() {
  'use strict';

  foo(); // 2
})();
```

⚠️ **Lưu ý**: Thông thường, bạn không nên kết hợp sử dụng chế độ nghiêm ngặt và không nghiêm ngặt trong cùng một mã. Toàn bộ chương trình phải hoặc nghiêm ngặt hoặc không nghiêm ngặt. Tuy nhiên, đôi khi bạn có thể sử dụng các thư viện bên thứ ba có mức độ nghiêm ngặt khác với mã của bạn, vì vậy hãy chú ý đến các chi tiết tương thích này.

### Ràng buộc ngầm (Implicit Binding)

Một quy tắc khác cần xem xét là liệu vị trí gọi có **đối tượng ngữ cảnh** hay không, hoặc nói cách khác, liệu nó **được sở hữu hoặc chứa bởi một đối tượng** hay không, tuy nhiên cách diễn đạt này có thể gây hiểu lầm.

🌰 **Ví dụ mã**:

```js
function foo() {
  console.log(this.a);
}

const container = {
  a: 2,
  foo: foo,
};

container.foo(); // 2
```

Điều quan trọng cần lưu ý là cách `foo` được khai báo và sau đó được thêm vào `container` như một thuộc tính tham chiếu. Tuy nhiên, dù là khai báo trực tiếp trong `container` hay khai báo trước rồi thêm vào như một thuộc tính tham chiếu, hàm này không thuộc về đối tượng `container`.

Tuy nhiên, vị trí gọi sẽ sử dụng ngữ cảnh của đối tượng `container` để gọi hàm, do đó bạn có thể nói rằng hàm được gọi khi đối tượng `container` **sở hữu** hoặc **chứa** nó.

Dù bạn gọi nó bằng cách nào, khi `foo` được gọi, nó sẽ có một tham chiếu đến `container` làm ngữ cảnh. Khi có ngữ cảnh, quy tắc ràng buộc ngầm sẽ ràng buộc `this` trong cuộc gọi hàm đến đối tượng ngữ cảnh này. Vì `foo` được gọi trong ngữ cảnh của `container`, `this.a` và `container.a` là như nhau.

💡 **Chỉ có một cấp trên hoặc cấp cuối trong chuỗi tham chiếu thuộc tính đóng vai trò trong vị trí gọi.**

```js
function foo() {
  console.log(this.a);
}

var obj2 = {
  a: 42,
  foo: foo,
};

var obj1 = {
  a: 2,
  obj2: obj2,
};

obj1.obj2.foo(); // 42
```

#### Mất ràng buộc ngầm (Implicit Binding Loss)

Một vấn đề ràng buộc `this` phổ biến nhất là **hàm bị mất ràng buộc ngầm và sẽ áp dụng ràng buộc mặc định**, có nghĩa là nó sẽ ràng buộc `this` với đối tượng toàn cục hoặc `undefined` (trong chế độ nghiêm ngặt).

🌰 **Ví dụ mã**:

```js
function foo() {
  console.log(this.a);
}

const container = {
  a: 2,
  foo: foo,
};

// Bí danh hàm
const bar = container.foo;

// a là thuộc tính của đối tượng toàn cục
const a = 'Hello world!';

bar();
// "Hello world!"
```

📍 Mặc dù `bar` là một tham chiếu của `container.foo`, nhưng thực tế, nó tham chiếu đến chính hàm `foo` nên `bar` là một cuộc gọi hàm không có bất kỳ sự thay đổi nào, do đó nó áp dụng ràng buộc mặc định.

Một tình huống tinh tế, phổ biến và đôi khi không được mong đợi xảy ra khi chúng ta truyền một hàm callback.

🌰 **Ví dụ mã**:

```js
function foo() {
  console.log(this.a);
}

function bar(fn) {
  // fn thực sự tham chiếu đến foo
  fn(); // <-- Vị trí gọi
}

var container = {
  a: 2,
  foo: foo,
};

// a là thuộc tính của đối tượng toàn cục
var a = 'Hello world!';

bar(container.foo);
// "Hello world!"
```

Thực tế là việc truyền tham số là một **gán ngầm**, vì vậy khi chúng ta truyền một hàm vào, nó cũng sẽ được gán ngầm, do đó kết quả giống với ví dụ trước.

Nếu chúng ta truyền hàm vào một hàm tích hợp sẵn trong ngôn ngữ thay vì một hàm tự định nghĩa, kết quả sẽ tương tự, không có sự khác biệt.

```js
function foo() {
  console.log(this.a);
}

const container = {
  a: 2,
  foo: foo,
};

// a là thuộc tính của đối tượng toàn cục
var a = 'Hello world!';

setTimeout(container.foo, 100);
// 'Hello world!'
```

Mất ràng buộc ngầm trong hàm callback là rất phổ biến.

Ngoài ra, có một tình huống khác khi `this` có thể hoạt động không như mong đợi: hàm gọi callback có thể thay đổi `this`. Trong một số thư viện JavaScript phổ biến, bộ xử lý sự kiện có thể ràng buộc `this` của callback với phần tử DOM gây ra sự kiện. Điều này có thể hữu ích trong một số trường hợp, nhưng đôi khi nó có thể gây khó chịu. Đáng tiếc là các công cụ này thường không cho phép bạn chọn xem liệu có nên kích hoạt hành vi này hay không.

Dù là trường hợp nào, việc thay đổi `this` là không mong đợi và thực tế là bạn không thể kiểm soát cách callback được thực thi, do đó không thể kiểm soát vị trí gọi để đạt được ràng buộc mong muốn. Trong phần tiếp theo, chúng ta sẽ tìm hiểu cách sửa chữa vấn đề này bằng cách gắn kết `this` cố định.

### Ràng buộc rõ ràng (Explicit Binding)

Giống như chúng ta đã thấy trong phân tích ràng buộc ngầm, chúng ta phải chứa một thuộc tính trỏ đến hàm bên trong một đối tượng và sử dụng thuộc tính này để gián tiếp tham chiếu đến hàm, từ đó ràng buộc `this` ngầm vào đối tượng đó.

JavaScript cung cấp các phương thức `apply`, `call` và `bind` để ràng buộc `this` của tất cả các hàm được tạo ra. Việc ràng buộc `this` của một hàm bằng cách sử dụng các phương thức này được gọi là **ràng buộc rõ ràng**.

#### Ràng buộc cứng

Ràng buộc cứng có thể giải quyết vấn đề mất ràng buộc mà chúng ta đã đề cập trước đó.

🌰 **Ví dụ mã**:

```js
function foo() {
  console.log(this.a);
}

const container = {
  a: 2,
};

var bar = function () {
  foo.call(container);
};

bar();
// 2

setTimeout(bar, 100);
// 2

// bar được ràng buộc cứng, không thể thay đổi this của nó
bar.call(window);
// 2
```

Chúng ta tạo ra hàm `bar` và trong nội bộ của nó, chúng ta gọi `foo.call(container)` để bắt buộc `this` của `foo` ràng buộc vào `container`. Bất kể sau đó chúng ta gọi hàm `bar` như thế nào, nó luôn gọi `foo` trên `container`. Ràng buộc này là một ràng buộc rõ ràng (thủ công), vì vậy chúng ta gọi nó là **ràng buộc cứng**.

#### Hàm tích hợp sẵn

Nhiều hàm của các bên thứ ba trong thư viện, cũng như nhiều hàm tích hợp sẵn mới trong JavaScript và môi trường chủ nhà, cung cấp một tham số tùy chọn thường được gọi là **bối cảnh (context)**, có tác dụng tương tự như `bind`, đảm bảo hàm gọi lại của bạn sử dụng `this` được chỉ định.

```js
function foo(item) {
  console.log(this.title, item);
}

const columns = {
  title: 'No:',
}[
  // Ràng buộc this của foo vào columns khi gọi foo
  (1, 2, 3)
].forEach(foo, columns);
// No:1 No:2 No:3
```

Các hàm này thực tế là sử dụng `call` hoặc `apply` để thực hiện ràng buộc rõ ràng, làm cho mã nguồn trở nên sáng sủa hơn.

### Ràng buộc hàm tạo

Trong JavaScript, hàm tạo chỉ là một hàm được gọi khi sử dụng toán tử `new`. Chúng không thuộc về một lớp nào cả, cũng không tạo ra một lớp, thực tế, chúng thậm chí không thể coi là một loại hàm đặc biệt, chúng chỉ là các hàm thông thường được gọi bằng toán tử `new`.

Ví dụ, hãy xem xét cách hành vi của `Number()` khi được sử dụng như một hàm tạo, theo mô tả trong ES5.1:

> 15.7.2 hàm tạo Number
>
> Khi Number được gọi trong biểu thức `new`, nó là một hàm tạo: nó khởi tạo đối tượng mới được tạo ra.

Vì vậy, tất cả các hàm, bao gồm cả hàm đối tượng được tích hợp sẵn, đều có thể được gọi bằng `new`, điều này được gọi là **gọi hàm tạo**. Đây là một sự khác biệt quan trọng nhưng rất nhỏ: thực tế không có hàm tạo, chỉ có **gọi hàm tạo** cho hàm.

🎉 Khi sử dụng `new` để gọi hàm, hoặc nói cách khác, khi có sự gọi hàm tạo, các thao tác sau đây sẽ tự động được thực hiện.

1. Tạo một đối tượng rỗng hoàn toàn mới.
2. Liên kết đối tượng mới với đối tượng nguyên mẫu của hàm tạo.
3. Thực thi hàm tạo của đối tượng, trong quá trình này, các thuộc tính và phương thức của đối tượng được tham chiếu bởi `this`, tức là `this` trỏ đến đối tượng mới được tạo.
4. Nếu hàm tạo không trả về một đối tượng khác, thì cuộc gọi hàm trong biểu thức `new` sẽ tự động trả về đối tượng mới này.

🎯 **Mô phỏng quá trình:**

```js
function objectFactory(constructor, ...rest) {
  // Tạo một đối tượng rỗng, đối tượng rỗng liên kết với nguyên mẫu đối tượng của hàm tạo.
  const instance = Object.create(constructor.prototype);

  // Thực thi hàm tạo của đối tượng, trong quá trình này, các thuộc tính và phương thức của đối tượng được tham chiếu bởi this, tức là this trỏ đến đối tượng mới được tạo.
  const result = constructor.apply(instance, rest);

  // Kiểm tra xem kết quả chạy của hàm tạo có phải là một kiểu đối tượng hay không.
  if (result !== null && /^(object|function)$/.test(typeof result)) {
    return result;
  }

  return instance;
}
```

Sau khi phân tích các hoạt động bên trong, chúng ta có thể kết luận rằng toán tử `new` chỉ là một **đường dẫn ngôn ngữ** để thực hiện quá trình này.

## Ưu tiên

Trong phần trước, chúng ta đã tìm hiểu về bốn quy tắc ràng buộc `this` trong cuộc gọi hàm và nhiệm vụ của bạn là tìm vị trí cuộc gọi hàm và xác định quy tắc nào được áp dụng. Tuy nhiên, nếu một vị trí cuộc gọi áp dụng nhiều quy tắc, chúng ta phải thiết lập ưu tiên cho các quy tắc đó.

Không có nghi ngờ gì, quy tắc ràng buộc mặc định có ưu tiên thấp nhất trong bốn quy tắc, vì vậy chúng ta sẽ không xem xét nó trước.

```
Ràng buộc rõ ràng > Ràng buộc xây dựng > Ràng buộc ngầm;
```

### Ràng buộc ngầm và ràng buộc rõ ràng

```js
function foo() {
  console.log(this.a);
}

const container1 = {
  a: 1,
  foo: foo,
};

const container2 = {
  a: 2,
  foo: foo,
};

container1.foo();
// 1
container2.foo();
// 2

container1.foo.call(container2);
// 2
container2.foo.call(container1);
// 1
```

Có thể thấy rằng ràng buộc rõ ràng có ưu tiên cao hơn, có nghĩa là chúng ta nên xem xét ràng buộc rõ ràng trước khi xem xét ràng buộc ngầm.

### Ràng buộc hàm tạo và ràng buộc ngầm

```js
function foo(something) {
  this.a = something;
}

const container1 = {
  foo: foo,
};

const container2 = {};

container1.foo(2);
console.log(container1.a);
// 2

container1.foo.call(container2, 3);
console.log(container2.a);
// 3

var bar = new container1.foo(4);
console.log(container1.a);
// 2
console.log(bar.a);
// 4
```

Có thể thấy rằng ràng buộc `new` có ưu tiên cao hơn ràng buộc ngầm. Nhưng ràng buộc `new` và ràng buộc rõ ràng có ưu tiên cao hơn nhau?

Chúng ta không thể sử dụng `new` và `call/apply` cùng nhau, vì vậy không thể kiểm tra trực tiếp bằng cách sử dụng `new foo.call(obj1)`. Nhưng chúng ta có thể sử dụng ràng buộc cứng để kiểm tra ưu tiên của chúng.

Trước khi xem mã, hãy nhớ lại cách ràng buộc cứng hoạt động. `Function.prototype.bind` sẽ tạo ra một hàm bao bọc mới, hàm này bỏ qua ràng buộc `this` hiện tại (bất kể đối tượng ràng buộc là gì) và ràng buộc đối tượng mà chúng ta cung cấp vào `this`.

Dựa trên điều này, ràng buộc cứng (cũng là một ràng buộc rõ ràng) có vẻ có ưu tiên cao hơn ràng buộc `new`, không thể sử dụng `new` để kiểm soát ràng buộc `this`.

```js
function foo(something) {
  this.a = something;
}

var container1 = {};

var bar = foo.bind(container1);
bar(2);
console.log(container1.a);
// 2

var baz = new bar(3);
console.log(container1.a);
// 2
console.log(baz.a);
// 3
```

## Ngoại lệ về ràng buộc

### Bỏ qua ràng buộc

Nếu bạn truyền `null` hoặc `undefined` như một đối tượng ràng buộc `this` vào `call`, `apply` hoặc `bind`, các giá trị này sẽ được bỏ qua và quy tắc ràng buộc mặc định sẽ được áp dụng khi gọi hàm.

```js
function foo() {
  console.log(this.a);
}

const a = 2;

foo.call(null);
// 2
```

Cách viết như vậy thường được sử dụng trong `apply` để mở rộng một mảng và truyền nó như là các đối số vào một hàm. Tương tự, `bind` cũng có thể được sử dụng để thực hiện currying (đặt trước một số đối số).

```js
function foo(a, b) {
  console.log('a:' + a + ',b:' + b);
}

// Mở rộng mảng thành các đối số
foo.apply(null, [2, 3]);
// a:2, b:3

// Currying bằng cách sử dụng bind
var bar = foo.bind(null, 2);
bar(3);
// a:2, b:3
```

Cả hai phương pháp này đều yêu cầu một đối số để ràng buộc `this`. Nếu hàm không quan tâm đến `this`, bạn vẫn cần truyền một giá trị giữ chỗ và trong trường hợp này, `null` có thể là một lựa chọn tốt.

### Ràng buộc mềm

Ràng buộc cứng có thể buộc `this` vào một đối tượng cụ thể (ngoại trừ khi sử dụng `new`), ngăn chặn việc áp dụng quy tắc ràng buộc mặc định trong cuộc gọi hàm. Tuy nhiên, vấn đề là ràng buộc cứng làm giảm tính linh hoạt của hàm, không thể sử dụng ràng buộc ngụ ý hoặc ràng buộc rõ ràng để thay đổi `this`.

Nếu có thể chỉ định một đối tượng ràng buộc mặc định khác với `undefined` và giá trị toàn cục, chúng ta có thể đạt được cùng hiệu quả với ràng buộc cứng, đồng thời vẫn giữ được khả năng sử dụng ràng buộc ngụ ý hoặc ràng buộc rõ ràng để thay đổi `this`.

```js
if (!Function.prototype.softBind) {
  Function.prototype.softBind = function (obj) {
    var fn = this;
    // Ghi lại tất cả các đối số curried
    var curried = [].slice.call(arguments, 1);
    var bound = function () {
      return fn.apply(
        (!this || this === (window || global)) ? obj : this,
        curried.concat.apply(curried, arguments)
      );
    };
    bound.prototype = Object.create(fn.prototype);
    return bound;
  };
}
```

### Thay đổi đối tượng ràng buộc

Dưới đây là bốn cách để thay đổi đối tượng `this` trong mã:

- Sử dụng hàm mũi tên trong ES6
- Sử dụng `_this = this` trong hàm
- Sử dụng `apply`, `call` và `bind`
- Sử dụng `new` để tạo một đối tượng mới

### Hàm mũi tên

Hàm mũi tên không được định nghĩa bằng từ khóa `function`, mà được định nghĩa bằng toán tử mũi tên ` => `. Hàm mũi tên không sử dụng 4 quy tắc chuẩn của `this`, mà thay vào đó, nó dựa vào phạm vi bên ngoài (hàm hoặc toàn cục) để xác định giá trị của `this`. Hơn nữa, hàm mũi tên có ngữ cảnh tĩnh, nghĩa là sau khi được gán một lần, nó không thể thay đổi.

Sự cố định của `this` không phải do hàm mũi tên có cơ chế ràng buộc `this`, mà nguyên nhân thực tế là hàm mũi tên không có `this` riêng của nó, dẫn đến việc `this` bên trong là `this` của khối mã bên ngoài. Chính vì nó không có `this`, nên nó cũng không thể được sử dụng như một hàm tạo.

```js
function foo() {
  // Trả về một hàm mũi tên
  return (a) => {
    // this kế thừa từ foo()
    console.log(this.a);
  };
}
const container1 = { a: 1 };

const container2 = { a: 2 };

const bar = foo.call(container1);

bar.call(container2);
// 1
```

Hàm mũi tên được tạo bên trong `foo` sẽ bắt chước `this` của `foo` khi được gọi. Vì `this` của `foo` được ràng buộc với `container1`, `this` của `bar` (tham chiếu đến hàm mũi tên) cũng sẽ được ràng buộc với `container1`, và ràng buộc của hàm mũi tên không thể thay đổi.

Hàm mũi tên có thể đảm bảo rằng `this` của hàm được ràng buộc với đối tượng chỉ định giống như `bind`, ngoài ra, tính quan trọng của nó còn thể hiện trong việc nó thay thế cơ chế `this` truyền thống bằng phạm vi từ vựng. Trên thực tế, trước ES6, chúng ta đã sử dụng một mô hình gần như hoàn toàn giống với hàm mũi tên.

Mặc dù `const self = this` và hàm mũi tên có vẻ có thể thay thế `bind`, nhưng về bản chất, chúng đều muốn thay thế cơ chế `this`.

Nếu bạn thường xuyên viết mã theo phong cách `this`, nhưng hầu hết thời gian bạn sẽ sử dụng `const self = this` hoặc hàm mũi tên để phủ nhận cơ chế `this` sai, thì có lẽ bạn nên:

- Chỉ sử dụng phạm vi từ vựng và hoàn toàn bỏ qua mã theo phong cách `this` sai
- Hoàn toàn sử dụng mã theo phong cách `this`, sử dụng `bind` khi cần thiết và tránh sử dụng `const self = this` và hàm mũi tên trong tất cả trường hợp

## Tổng kết các tình huống áp dụng

1. Gọi hàm thông thường
2. Gọi hàm như một phương thức của đối tượng
3. Gọi hàm như một hàm tạo
4. Gọi hàm thông qua `call`, `apply`, `bind`
5. Gọi hàm mũi tên
