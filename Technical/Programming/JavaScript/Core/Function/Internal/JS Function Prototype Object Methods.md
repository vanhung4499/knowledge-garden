---
title: JS Function Prototype Object Methods
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-05
---

# Phương thức đối tượng nguyên mẫu hàm

## Function.prototype.apply()

Hàm `apply()` được sử dụng để gọi hàm hiện tại và đồng thời sử dụng đối tượng được chỉ định làm con trỏ `this` trong phạm vi của hàm khi nó được thực thi.

### Cú pháp

```js
func.apply( [thisArg [, argsArray]])
```

### Tham số

| Tham số      | Kiểu dữ liệu                           | Mô tả                                                                                                                                                                                                                                                                                                              |
| ----------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `func`      | Kiểu `Function`                        | Hàm gọi hàm `apply()` hiện tại (thường là `this`) khi nó được thực thi.                                                                                                                                                                                                                                               |
| `thisArg`   | Tùy chọn, Kiểu `Object`                 | Đối tượng được sử dụng làm con trỏ `this` trong phạm vi của hàm khi nó được thực thi. Lưu ý rằng giá trị `this` sử dụng không nhất thiết phải là giá trị `this` thực sự khi hàm được thực thi. Nếu hàm này đang chạy trong chế độ không nghiêm ngặt, nó sẽ tự động thay thế bằng đối tượng toàn cục (trong trình duyệt là đối tượng Window), và giá trị `this` là giá trị nguyên thủy (số, chuỗi, boolean) sẽ trỏ đến đối tượng bọc của giá trị nguyên thủy đó. |
| `argsArray` | Tùy chọn, Kiểu `Array` hoặc `TypedArray` | Một mảng hoặc đối tượng giống mảng, trong đó các phần tử của mảng sẽ được truyền vào hàm `func` làm các đối số riêng lẻ. Nếu giá trị của tham số này là `null` hoặc `undefined`, điều đó có nghĩa là không cần truyền bất kỳ đối số nào. Từ ECMAScript 5, bạn có thể sử dụng đối tượng giống mảng.                                                                                                                                |

### Ví dụ

#### Cách sử dụng cơ bản

```js
const a = {
    name: 'Cherry',

    func1: function(){
		console.log(this.name)
	}

	func2: function(){
		setTimeout(function(){
			this.func1()
		}.apply(a), 100)
	}
}

a.func2()		// Cherry
```

## Function.prototype.call()

Hàm `call()` được sử dụng để gọi hàm hiện tại và đồng thời sử dụng đối tượng được chỉ định làm con trỏ `this` trong phạm vi của hàm khi nó được thực thi.

### Cú pháp

```js
func.call( [thisArg [, arg1 [, arg2 [, argN...]]]] )
```

### Tham số

| Tham số             | Kiểu dữ liệu                           | Mô tả                                                                                                                                                                                                                                                                                                               |
| ------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `func`              | Kiểu `Function`                        | Hàm gọi hàm `call()` hiện tại (thường là `this`) khi nó được thực thi.                                                                                                                                                                                                                                                 |
| `thisArg`           | Tùy chọn, Kiểu `Object`                 | Giá trị `this` được sử dụng trong phạm vi của hàm khi nó được thực thi. Lưu ý rằng giá trị `this` sử dụng không nhất thiết phải là giá trị `this` thực sự khi hàm được thực thi. Nếu hàm này đang chạy trong chế độ không nghiêm ngặt, nó sẽ tự động thay thế bằng đối tượng toàn cục (trong trình duyệt là đối tượng Window), và giá trị `this` là giá trị nguyên thủy (số, chuỗi, boolean) sẽ trỏ đến đối tượng bọc của giá trị nguyên thủy đó. |
| `arg1,arg2,argN…` | Tùy chọn, Kiểu `Array` hoặc `TypedArray` | Các đối số được chỉ định.                                                                                                                                                                                                                                                                                           |

### Ví dụ

```js
const sayName = function () {
  console.log(this.name);
};

const peter = {
  name: 'peter',
};

sayName.call(peter); // peter
```

```js
function Person1() {
  this.name = 'person1';
  this.sayName = function () {
    alert(this.name);
  };
}

function Person2() {
  this.name = 'person2';
}

var sam = new Person2();

Person1.call(sam);

sam.sayName(); // person1
```

## Function.prototype.bind()

Phương thức `bind()` tạo ra một hàm mới, khi được gọi, hàm mới này có giá trị `this` được thiết lập thành giá trị đã được cung cấp và một chuỗi tham số được cung cấp trước bất kỳ tham số nào được cung cấp khi gọi hàm mới.

### Cú pháp

```js
func.bind(thisArg [, arg1 [, arg2 [, ...]]])
```

### Tham số

| Tham số             | Kiểu dữ liệu                           | Mô tả                                                                                                      |
| ------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `func`              | Kiểu `Function`                        | Hàm gọi phương thức `bind()` (thường là `this`) khi nó được thực thi.                                                                                                 |
| `thisArg`           | Tùy chọn, Kiểu `Object`                 | Giá trị `this` được sử dụng trong phạm vi của hàm khi nó được thực thi. Lưu ý rằng giá trị `this` sử dụng không nhất thiết phải là giá trị `this` thực sự khi hàm được thực thi. Nếu hàm này đang chạy trong chế độ không nghiêm ngặt, nó sẽ tự động thay thế bằng đối tượng toàn cục (trong trình duyệt là đối tượng Window), và giá trị `this` là giá trị nguyên thủy (số, chuỗi, boolean) sẽ trỏ đến đối tượng bọc của giá trị nguyên thủy đó. |
| `arg1,arg2,argN…` | Tùy chọn, Kiểu `Array` hoặc `TypedArray` | Các đối số được chỉ định.                                                                                                                                                |

### Mô tả

Phương thức `bind()` tạo ra một hàm mới có cùng thân hàm như hàm gốc, nhưng có giá trị `this` được thiết lập thành giá trị đã được cung cấp. Khi hàm mới được gọi, giá trị `this` sẽ được chuyển đến hàm gốc, cùng với các tham số được cung cấp trước bất kỳ tham số nào được cung cấp khi gọi hàm mới.

Phương thức `bind()` thường được sử dụng để tạo ra một hàm mới có giá trị `this` được ràng buộc với một đối tượng cụ thể, đặc biệt là trong các trường hợp sử dụng callback hoặc khi cần truyền một phương thức có giá trị `this` nhất định như một tham số.

### Ví dụ

#### Ví dụ mã

Phương thức `bind()` thường được sử dụng để tạo ra một hàm mới có giá trị `this` được ràng buộc với một đối tượng cụ thể. Điều này giúp đảm bảo rằng `this` trong hàm mới luôn trỏ đến đối tượng đã chỉ định.

```js
this.x = 9;

var module = {
  x: 8,
  getX: function () {
    return this.x;
  },
};

module.getX(); // Trả về 8

var retrieveX = module.getX;
retrieveX(); // Trả về 9

var boundGetX = retrieveX.bind(module);
boundGetX(); // Trả về 8
```

#### Hàm phụ

Phương thức `bind()` cũng có thể được sử dụng để tạo ra một hàm phụ với các tham số được thiết lập sẵn. Các tham số này sẽ được chèn vào đầu danh sách tham số của hàm gốc khi hàm mới được gọi.

```js
function list() {
  return Array.prototype.slice.call(arguments);
}

var list1 = list(1, 2, 3); // [1, 2, 3]

// Tạo ra một hàm với một tham số đầu tiên được thiết lập sẵn
var defaultsList = list.bind(undefined, 10);

var list2 = defaultsList(); // [10]
var list3 = defaultsList(1, 2, 3); // [10, 1, 2, 3]
```

#### Kết hợp với hẹn giờ

Mặc định, khi sử dụng `window.setTimeout()`, từ khóa `this` sẽ trỏ đến đối tượng `window` (hoặc toàn cục). Tuy nhiên, khi sử dụng phương thức của một lớp, bạn cần `this` trỏ đến một thể hiện của lớp đó. Để làm điều này, bạn có thể ràng buộc `this` với hàm phụ để tiếp tục sử dụng thể hiện.

```js
function LateBloomer() {
  this.petalCount = Math.ceil(Math.random() * 12) + 1;
}

// Khai báo hàm bloom sau một khoảng thời gian 1 giây
LateBloomer.prototype.bloom = function () {
  window.setTimeout(this.declare.bind(this), 1000);
};

LateBloomer.prototype.declare = function () {
  console.log('I am a beautiful flower with ' + this.petalCount + ' petals!');
};

var flower = new LateBloomer();
flower.bloom(); // Sau 1 giây, gọi phương thức 'declare'
```
