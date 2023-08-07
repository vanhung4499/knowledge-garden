---
title: JS Iterator
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-08
---

# Iterator

Iterator cung cấp một giao diện thống nhất để truy cập vào các cấu trúc dữ liệu khác nhau. Bất kỳ cấu trúc dữ liệu nào triển khai giao diện Iterator, không cần phải khởi tạo tập hợp hoặc biến chỉ mục, mà thay vào đó sử dụng phương thức `next` của đối tượng iterator để lấy giá trị của từng phần tử trong tập hợp, giúp xử lý từng phần tử của cấu trúc dữ liệu một cách tuần tự, phù hợp với lập trình hướng thủ tục.

**Nhược điểm của vòng lặp trong ES5**

| Phương thức lặp | Nhược điểm                                                    |
| -------------- | ------------------------------------------------------------ |
| Vòng lặp `for`  | Phần điều kiện phức tạp; Cần định nghĩa nhiều biến khi lồng nhau, độ phức tạp cao |
| Vòng lặp `for…in` | Chỉ có thể lấy được tên thuộc tính của đối tượng, cần sử dụng cú pháp dấu ngoặc vuông để lấy giá trị thuộc tính; Chỉ áp dụng cho đối tượng, không áp dụng cho các loại mảng khác |
| Phương thức `forEach` | Không thể dừng hoặc thoát khỏi vòng lặp |

## Iterator

Iterator là một đối tượng có giao diện đặc biệt. Nó có một phương thức `next()`, khi gọi nó trả về một đối tượng chứa hai thuộc tính, lần lượt là `value` (giá trị của phần tử) và `done` (xác định xem việc lặp đã hoàn thành hay chưa). Khi việc lặp kết thúc, tức là `done` có giá trị `true`, việc gọi `next()` sẽ không có tác dụng.

Mô phỏng cách triển khai Iterator (thực chất là một hàm nhà máy trả về đối tượng iterator):

```js
let iterable = [1, 2, 3]

function createIterator(array){
    let count = 0
    return {
        next: function(){
            return count < array.length ?
                {value: array[count], done: false}:
            	{value: undefined, done: true}
        }
    }
}

let myIterator = createIterator(iterable)

myIterator.next()	// {value: 1, done: false}
myIterator.next()	// {value: 2, done: false}
myIterator.next()	// {value: 3, done: false}
myIterator.next()	// {value: undefined, done: true}
```

## Giao thức Iterator

Đối tượng iterator không phải là một cú pháp mới hoặc một đối tượng mới, mà là một giao thức ([Iterator Protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol), tất cả các đối tượng tuân thủ giao thức này đều có thể được gọi là iterator. Điều này có nghĩa là đối tượng mà chúng ta đã tạo ở trên theo cách viết ES5 tuân thủ giao thức iterator, tức là bao gồm phương thức `next`, gọi `next` sẽ trả về một đối tượng `result {value, done}`.

## Đối tượng có thể lặp

Đối tượng thỏa mãn giao thức có thể lặp được được gọi là đối tượng có thể lặp.

Giao thức có thể lặp: Giá trị của thuộc tính `Symbol.iterator` của đối tượng là một hàm không tham số, hàm này trả về một đối tượng iterator.

Dưới đây là ví dụ về việc triển khai thuộc tính `Symbol.iterator` của một mảng để lặp qua các phần tử.

```js
const arr = [0, 1, 2]
const iter = arr[Symbol.iterator]()

iter.next()		// Output: {value: 0, done: false}
iter.next()		// Output: {value: 1, done: false}
iter.next()		// Output: {value: 2, done: false}
iter.next()		// Output: {value: undefined, done: true}
```

### Đối tượng có thể lặp tích hợp sẵn

Các cấu trúc dữ liệu có sẵn trong JavaScript đã triển khai giao diện Iterator:

* Array
* Map
* Set
* String
* TypedArray
* Đối tượng arguments của hàm
* Đối tượng NodeList

### Đối tượng có thể lặp tùy chỉnh

Chúng ta có thể triển khai đối tượng có thể lặp của riêng mình:

```js
let myIterable = {}

myIterable[Symbol.iterator] = function*(){
    yield 1
    yield 2
    yield 3
}

[...myIterable]		// Output: [1, 2, 3]
```

### API tích hợp sẵn nhận đối tượng có thể lặp

Nhiều API tích hợp sẵn trong JavaScript có thể nhận đối tượng có thể lặp, ví dụ: [`Map([iterable])`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Map), [`WeakMap([iterable])`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/WeakMap), [`Set([iterable])`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) và [`WeakSet([iterable])`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet):

```js
var myObj = {};
new Map([[1,"a"],[2,"b"],[3,"c"]]).get(2);               // "b"
new WeakMap([[{},"a"],[myObj,"b"],[{},"c"]]).get(myObj); // "b"
new Set([1, 2, 3]).has(3);                               // true
new Set("123").has("2");                                 // true
new WeakSet(function*() {
    yield {};
    yield myObj;
    yield {};
}()).has(myObj);
```

Cũng có [`Promise.all(iterable)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all), [`Promise.race(iterable)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) và [`Array.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from).

## Vòng lặp `for…of`

Vòng lặp `for…of` được sử dụng để duyệt qua các phần tử của một đối tượng có thể lặp (iterable), hoặc một giá trị có thể được chuyển đổi/đóng gói thành một đối tượng có thể lặp. Trong quá trình lặp, `for…of` sẽ lấy đối tượng iterable của đối tượng và gọi phương thức `[Symbol.iterator]()` để lấy iterator, sau đó lặp qua từng phần tử bằng cách gọi phương thức `next()` của iterator cho đến khi thuộc tính `done` của đối tượng trả về từ phương thức `next()` là `true`, khi đó quá trình lặp kết thúc và không xử lý phần tử đó.

Ví dụ về vòng lặp `for…of`:

```js
var a = ["a","b","c","d","e"];

for (var val of a) {
    console.log( val );
}
// "a" "b" "c" "d" "e"
```

Ví dụ tương đương với vòng lặp `for` thông thường, tương đương với vòng lặp `for…of` ở trên:

```js
var a = ["a","b","c","d","e"];

for (var val, ret, it = a[Symbol.iterator]();
    (ret = it.next()) && !ret.done;
) {
    val = ret.value;
    console.log( val );
}
// "a" "b" "c" "d" "e"
```
