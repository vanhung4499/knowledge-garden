---
title: JS Prototype Chain
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-06
date modified: 2023-08-06
---

# Chuỗi nguyên mẫu - Prototype Chain

ECMAScript mô tả khái niệm về chuỗi nguyên mẫu và sử dụng chuỗi nguyên mẫu là phương pháp chính để thực hiện kế thừa. Ý tưởng cơ bản là sử dụng nguyên mẫu để cho một kiểu tham chiếu kế thừa các thuộc tính và phương thức từ một kiểu tham chiếu khác.

Để hiểu rõ về đối tượng nguyên mẫu và chuỗi nguyên mẫu, chúng ta cần hiểu mối quan hệ giữa `prototype`, `__proto__` và `constructor`.

Chúng ta sẽ giải thích mối quan hệ phức tạp này thông qua ví dụ và hình ảnh minh họa.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230806163844.png)

**Hình ảnh minh họa**

- Mũi tên màu đỏ biểu thị sự chỉ định của thuộc tính `__proto__`
- Mũi tên màu xanh lá cây biểu thị sự chỉ định của thuộc tính `prototype`
- Mũi tên màu nâu biểu thị thuộc tính `constructor` của chính đối tượng
- Hình vuông màu xanh da trời biểu thị đối tượng
- Hình vuông màu xanh lá cây nhạt biểu thị hàm

Trong JavaScript, ba thành phần này đính kèm vào các loại đối tượng khác nhau.

- **Đối tượng**: `__proto__` và `constructor` chỉ thuộc về đối tượng.
- **Hàm**: `prototype` chỉ thuộc về hàm. Nhưng hàm cũng là đối tượng, nên hàm cũng có `__proto__` và `constructor`.

## Nguyên mẫu rõ ràng - `prototype`

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230806165906.png)

Đối tượng nguyên mẫu rõ ràng `prototype` là duy nhất cho<span style="color: red;font-weight: bold"> mỗi hàm</span> và nó trỏ từ<span style="color: red;font-weight: bold"> một hàm đến một đối tượng khác</span>. Nó đại diện cho<span style="color: red;font-weight: bold"> đối tượng nguyên mẫu của hàm</span> này (thực chất, tất cả các hàm đều có thể được sử dụng như là hàm tạo). Do đó, `foo.__proto__ === Foo.prototype` và chúng hoàn toàn giống nhau.

Vậy tác dụng của thuộc tính `prototype` là gì? Tác dụng của nó là chứa các thuộc tính và phương thức được<span style="color: red;font-weight: bold"> tất cả các thể hiện của kiểu cụ thể</span> chia sẻ, cho phép các đối tượng được tạo bởi hàm này (thực chất là tất cả các hàm) có thể truy cập vào các thuộc tính và phương thức chung.

**Khi tạo một hàm, một đối tượng `prototype` của hàm cũng được tạo mặc định.**

## Nguyên mẫu ẩn - `__proto__`

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230806180209.png)

Trong JavaScript, mọi đối tượng đều có một thuộc tính `__proto__`, như được thể hiện trong hình ảnh trên. Một đối tượng trỏ đến một đối tượng khác thông qua thuộc tính `__proto__`, nghĩa là nó trỏ đến đối tượng nguyên mẫu tương ứng. Đối tượng nguyên mẫu này được gọi là<span style="color: red;font-weight: bold"> nguyên mẫu ẩn</span>.

Nguyên mẫu ẩn có tác dụng là khi truy cập vào một thuộc tính hoặc phương thức của một đối tượng, nếu thuộc tính đó không tồn tại trong đối tượng đó, nó sẽ tìm kiếm trong đối tượng nguyên mẫu (đối tượng nguyên mẫu cũng là một đối tượng và cũng có nguyên mẫu riêng của nó), nếu không tìm thấy, nó sẽ tiếp tục tìm kiếm trong nguyên mẫu của đối tượng nguyên mẫu đó, và cứ tiếp tục như vậy cho đến khi tìm thấy thuộc tính hoặc phương thức, hoặc tìm thấy nguyên mẫu đầu tiên `null`, quá trình tìm kiếm kết thúc và trả về `undefined`.

Trong quá trình tìm kiếm này, từ đối tượng hiện tại, nó sẽ tiếp tục tìm kiếm các thuộc tính và phương thức liên quan thông qua chuỗi nguyên mẫu (nguyên mẫu cũng có nguyên mẫu riêng của nó). Tất cả các đối tượng liên kết này tạo thành một chuỗi gọi là<span style="color: red;font-weight: bold"> chuỗi nguyên mẫu</span>.

## Hàm tạo - `Constrcutor`

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230806200423.png)

Thuộc tính `constructor` cũng chỉ thuộc về<span style="color: red;font-weight: bold"> đối tượng</span> và nó trỏ từ<span style="color: red;font-weight: bold"> một đối tượng đến một hàm</span>. Ý nghĩa của nó là<span style="color: red;font-weight: bold"> hàm tạo của đối tượng đó</span> và mỗi đối tượng đều có một hàm tạo (có thể là riêng của nó hoặc được kế thừa, để rõ hơn, hãy xem thuộc tính `__proto__`). Từ hình ảnh trên, ta có thể thấy rằng đối tượng đặc biệt `Function` có một hàm tạo riêng của nó (vì `Function` có thể được coi là một hàm hoặc một đối tượng), tất cả các hàm và đối tượng đều được tạo ra từ hàm tạo `Function`, do đó thuộc tính `constructor` cuối cùng là hàm `Function`.

## Đối tượng nguyên mẫu

Đối tượng nguyên mẫu là đối tượng cha của đối tượng hiện tại.

| Nguyên mẫu rõ ràng                   | Nguyên mẫu ẩn                                                 |
| :--------------------------------- | :----------------------------------------------------------- |
| Thuộc tính `prototype`              | Thuộc tính `__proto__`                                        |
| Riêng của hàm                       | Riêng của đối tượng (đối tượng cũng có thuộc tính `__proto__` và `constructor`) |
| Được gán mặc định khi định nghĩa hàm | Được thêm tự động khi tạo đối tượng, và được gán giá trị của `prototype` của hàm tạo |
| Dùng để thực hiện kế thừa dựa trên nguyên mẫu và chia sẻ thuộc tính | Tạo thành chuỗi nguyên mẫu và dùng để thực hiện kế thừa dựa trên nguyên mẫu |

🌰 **Ví dụ mã: Truy cập đối tượng nguyên mẫu trong chuỗi nguyên mẫu**

```js
const Foo = function () {};

const foo = new Foo();

// Đối tượng tạo Foo {} là đối tượng nguyên mẫu của hàm foo
console.log(foo.__proto__);

// Đối tượng tạo Object {} là đối tượng nguyên mẫu của hàm Function
console.log(foo.__proto__.__proto__);

// Đầu chuỗi nguyên mẫu
console.log(foo.__proto__.__proto__.__proto__);
// null
```

**Sự khác biệt giữa tìm kiếm thuộc tính/phương thức trong chuỗi nguyên mẫu và truy cập đối tượng nguyên mẫu trong chuỗi nguyên mẫu**

- Khi tìm kiếm thuộc tính hoặc phương thức trong chuỗi nguyên mẫu, nếu không tìm thấy thuộc tính hoặc phương thức tương ứng, kết quả trả về là `undefined`, đồng nghĩa với việc không có thuộc tính hoặc phương thức trong chuỗi nguyên mẫu.
- Khi truy cập đối tượng nguyên mẫu trong chuỗi nguyên mẫu, đến cuối chuỗi nguyên mẫu, tức là `Object.prototype`, giá trị của nó là `null`.

## Sự chỉ định của đối tượng nguyên mẫu

`__proto__` chỉ định của đối tượng nguyên mẫu phụ thuộc vào cách tạo đối tượng.

### Tạo đối tượng bằng cách sử dụng Literal

Khi tạo đối tượng bằng cách sử dụng literal, nguyên mẫu của nó là `Object.prototype`.

Mặc dù chúng ta không thể truy cập trực tiếp vào thuộc tính `__proto__` được nhúng sẵn, nhưng chúng ta có thể sử dụng `Object.getPrototypeOf()` hoặc thuộc tính `__proto__` của đối tượng để truy cập nguyên mẫu của đối tượng.

```js
const foo = {};

console.log(foo.__proto__ === Object.prototype);
// true

console.log(Object.getPrototypeOf(foo) === Object.prototype);
// true
```

### Tạo đối tượng bằng cách sử dụng hàm tạo

```js
const Foo = function () {};

const foo = new Foo();

console.log(foo.__proto__ === Foo.prototype);
// true

console.log(Object.getPrototypeOf(foo) === Foo.prototype);
// true
```

### Tạo đối tượng bằng cách sử dụng `Object.create()`

Đối tượng được tạo bằng cách sử dụng `Object.create()` sẽ có nguyên mẫu là đối tượng được truyền vào làm đối số.

```js
const foo = {};

const bar = Object.create(foo);

console.log(bar.__proto__ === foo);
```

## Nguyên mẫu đối tượng và thể hiện

Chúng ta có thể xác định mối quan hệ giữa nguyên mẫu và thể hiện thông qua toán tử `instanceof`.

```js
// Giả sử toán tử instanceof có dạng L instanceof R
L instanceof R

// Toán tử instanceof kiểm tra xem R.prototype có tồn tại trong chuỗi nguyên mẫu của L hay không
L.__proto__.__proto__... === R.prototype
```

⚠️ Lưu ý: Toán tử instanceof sẽ kiểm tra đệ quy chuỗi nguyên mẫu của L, tức là `L.__proto__.__proto__.__proto__…` cho đến khi tìm thấy hoặc đạt đến nguyên mẫu đầu tiên làm kết thúc.

Hàm tạo Function có hàm tạo là chính nó:

```js
Function.constructor === Function; // true
```

Hàm tạo Object có hàm tạo là Function (do đó, tất cả các hàm tạo đều trỏ đến Function)

```js
Object.constructor === Function; // true
```

`[[Prototype]]` của hàm tạo Function là một hàm vô danh đặc biệt

```js
console.log(Function.__proto__); // function(){}
```

Hàm vô danh đặc biệt này trỏ đến nguyên mẫu của `Object.prototype`.

```js
Function.__proto__.__proto__ === Object.prototype; // true
```

`[[Prototype]]` của Object trỏ đến nguyên mẫu của Function, tức là hàm vô danh đặc biệt đã được đề cập ở trên.

```js
Object.__proto__ === Function.prototype; // true

Function.prototype === Function.__proto__; // true
```

Mối quan hệ giữa hàm tạo Function và Object:

```js
Function instanceof Object; // true
Object instanceof Function; // true
```

Mối quan hệ chuỗi nguyên mẫu của các đối tượng được tạo bằng từ khóa:

```js
console.log(true.__proto__.__proto__ === Object.prototype);

console.log((123).__proto__.__proto__ === Object.prototype);

console.log('String'.__proto__.__proto__ === Object.prototype);

console.log([].__proto__.__proto__ === Object.prototype);

console.log({}.__proto__ === Object.prototype);
```

**Tóm tắt:**

- Thuộc tính constructor của tất cả các hàm tạo đều trỏ đến Function.
- Thuộc tính prototype của Function trỏ đến một hàm vô danh đặc biệt, và hàm vô danh đặc biệt này trỏ đến Object.prototype.
