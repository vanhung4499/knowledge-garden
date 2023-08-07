---
title: JS Array
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# Array

Đối tượng `Array` là đối tượng toàn cục được sử dụng để xây dựng mảng, tương tự như một đối tượng danh sách.

Đối tượng `Array` chủ yếu được sử dụng để lưu trữ nhiều mục dữ liệu, dữ liệu có thể là bất kỳ loại nào.

Tất cả các trình duyệt phổ biến đều hỗ trợ đối tượng này.

## Cú pháp

**Chữ viết tắt**

```js
[element0, element1, ..., elementN]
```

**Hàm chuyển đổi kiểu mảng**

```js
Array(element0, element1, ..., elementN)
```

**Hàm tạo**

```js
new Array(element0, element1, ..., elementN)

new Array(arrayLength)
```

Khai báo kiểu:

```ts
interface ArrayConstructor {
  new (arrayLength?: number): any[];
  new <T>(arrayLength: number): T[];
  new <T>(...items: T[]): T[];
  (arrayLength?: number): any[];
  <T>(arrayLength: number): T[];
  <T>(...items: T[]): T[];
  isArray(arg: any): arg is any[];
  readonly prototype: any[];
}

declare var Array: ArrayConstructor;
```

Giải thích các tham số:

| Tham số       | Kiểu           | Mô tả                                                                                                                                                                                                                                                                     |
| ------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `elementN`    | Bất kỳ kiểu    | Hàm tạo `Array` sẽ tạo một mảng JavaScript dựa trên các phần tử được cung cấp, trừ khi chỉ có một tham số và tham số đó là một số (xem chi tiết tham số `arrayLength` bên dưới).                                                                                              |
| `arrayLength` | Kiểu `Number`  | Một số nguyên trong khoảng từ 0 đến 2[32]-1, khi đó sẽ trả về một đối tượng mảng với giá trị `length` bằng `arrayLength` (điều này có nghĩa là mảng này không chứa bất kỳ phần tử thực tế nào, không thể tự động cho rằng nó chứa `arrayLength` phần tử có giá trị `undefined`). Nếu tham số truyền vào không phải là giá trị hợp lệ, ngoại lệ `RangeError` sẽ được ném. |

## Mô tả

Mảng là một đối tượng giống như danh sách. Về bản chất, mảng là một loại đối tượng đặc biệt (đối tượng có thứ tự), cung cấp nhiều phương thức để duyệt và thay đổi các phần tử trong mảng. Độ dài của mảng và kiểu dữ liệu của các phần tử trong mảng là không cố định. Vì độ dài của mảng có thể đọc và ghi, và đôi khi các phần tử trong mảng không nằm ở các vị trí liên tiếp, nên mảng JavaScript không nhất thiết phải là một mảng dày đặc. Thông thường, đây là một số tính năng tiện lợi; nếu những tính năng này không phù hợp với tình huống sử dụng cụ thể của bạn, bạn có thể xem xét sử dụng mảng có kiểu cố định.

```js
typeof [1, 2, 3]; // "object"
```

Đặc điểm đặc biệt của mảng là các tên khóa được sắp xếp theo thứ tự của một tập hợp các số nguyên. Vì tên khóa của các thành viên của mảng là cố định, nên mảng không cần chỉ định tên khóa cho mỗi phần tử, trong khi mỗi thành viên của đối tượng phải chỉ định tên khóa.

```js
var arr = ['a', 'b', 'c'];
console.log(Object.keys(arr)); // ["0", "1", "2"]

var obj = {
  name1: 'a',
  name2: 'b',
  name3: 'c',
};
```

Mảng là một dạng đặc biệt của đối tượng, truy cập vào các phần tử của mảng bằng cách sử dụng dấu ngoặc vuông giống như truy cập vào thuộc tính của đối tượng.

Ngôn ngữ JavaScript quy định rằng tên khóa của đối tượng luôn là chuỗi, vì vậy tên khóa của mảng cũng là chuỗi. Lý do tại sao có thể truy cập bằng số là vì tên khóa không phải là chuỗi sẽ được chuyển đổi thành chuỗi và sử dụng như tên thuộc tính.

```js
// Tạo một đối tượng thông thường
o = {};

// Sử dụng một số nguyên làm chỉ mục
o[1] = 'one';

// Tên khóa số sẽ tự động chuyển thành chuỗi
var arr = ['a', 'b', 'c'];
console.log(arr['0']);
// 'a'
console.log(arr[0]);
// 'a'
```

Tuy nhiên, hãy phân biệt rõ ràng giữa chỉ mục mảng và tên thuộc tính của đối tượng: tất cả các chỉ mục đều là tên thuộc tính, nhưng chỉ có các số nguyên từ 0 đến 2[32]-2 (4294967294) mới là chỉ mục.

```js
var a = [];

// Chỉ mục
a['1000'] = 'abc';
a[1000]; // 'abc'

// Chỉ mục
a[1.0] = 6;
a[1]; // 6
```

Số đơn không thể được sử dụng làm định danh (Identifier). Vì vậy, các thành viên của mảng chỉ có thể được biểu diễn bằng cách sử dụng cú pháp dấu ngoặc vuông. (Trong JavaScript, các thuộc tính bắt đầu bằng số không thể được truy cập bằng dấu chấm, mà phải sử dụng dấu ngoặc vuông)

```js
var arr = [1, 2, 3];

console.log(arr[0]);
// 1

console.log(arr.0);
// SyntaxError
```

Có thể sử dụng số âm hoặc số không phải là số nguyên để chỉ mục mảng. Tuy nhiên, vì chúng không nằm trong phạm vi từ 0 đến 2[32]-2, nên chúng chỉ là tên thuộc tính của mảng, không phải chỉ mục của mảng, đặc điểm rõ ràng là chúng không thay đổi độ dài của mảng.

```js
var a = [1, 2, 3];

// Tên thuộc tính
a[-1.23] = true;
console.log(a.length);
// 3

// Chỉ mục
a[10] = 5;
console.log(a.length);
// 11

// Tên thuộc tính
a['abc'] = 'testing';
console.log(a.length);
// 11
```

## Hàm tạo

### Thuộc tính

| Thuộc tính             | Mô tả                                                                                             |
| :--------------------- | :----------------------------------------------------------------------------------------------- |
| `Array.length`         | Thuộc tính `length` của hàm tạo `Array`, có giá trị là 1 (lưu ý rằng đây là thuộc tính tĩnh, không phải thuộc tính `length` của các mảng cụ thể). |
| `Array.prototype`      | Với đối tượng nguyên mẫu của mảng, bạn có thể thêm thuộc tính cho tất cả các đối tượng mảng.         |

### Phương thức

| Phương thức             | Mô tả                                                             |
| :--------------------- | :--------------------------------------------------------------- |
| `Array.form()`         | Tạo một mảng mới từ một đối tượng giống mảng hoặc có thể lặp lại.   |
| `Array.isArray()`      | Kiểm tra xem giá trị đã cho có phải là một mảng hay không.          |
| `Array.of()`           | Tạo một mảng mới với số lượng tham số có thể thay đổi, không quan tâm đến số lượng hoặc kiểu tham số. |

## Đối tượng nguyên mẫu

Tất cả các đối tượng mảng đều kế thừa các thuộc tính và phương thức từ `Array.prototype`. Thay đổi nguyên mẫu của `Array` sẽ ảnh hưởng đến tất cả các đối tượng mảng.

### Thuộc tính

| Thuộc tính                          | Mô tả                                                                                                    |
| :---------------------------------- | :------------------------------------------------------------------------------------------------------ |
| `Array.prototype.constructor`      | Tất cả các đối tượng mảng đều kế thừa thuộc tính này, giá trị của nó là `Array`, cho biết tất cả các mảng đều được tạo ra từ `Array`. |
| `Array.prototype.length`           | Như đã nói ở trên, vì `Array.prototype` cũng là một mảng, nên nó cũng có thuộc tính `length` với giá trị là 0, vì nó là một mảng rỗng. |

### Phương thức

#### Phương thức sửa đổi

Các phương thức sau sẽ thay đổi giá trị của đối tượng gọi chúng.

| Tên phương thức                           | Mô tả                                                                                                        |
| :--------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| [Array.prototype.fill()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill)         | Điền một giá trị cố định vào tất cả các phần tử của mảng từ chỉ mục bắt đầu đến chỉ mục kết thúc.                 |
| [Array.prototype.pop()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)           | Xóa phần tử cuối cùng của mảng và trả về phần tử đó. Phương thức này thay đổi độ dài của mảng.                  |
| [Array.prototype.push()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push)         | Thêm một hoặc nhiều phần tử vào cuối mảng và trả về độ dài mới của mảng.                                      |
| [Array.prototype.reverse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)   | Đảo ngược thứ tự các phần tử trong mảng, tức là phần tử đầu tiên trở thành phần tử cuối cùng và ngược lại.       |
| [Array.prototype.shift()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)       | Xóa phần tử đầu tiên của mảng và trả về phần tử đó. Phương thức này thay đổi độ dài của mảng.                  |
| [Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)         | Sắp xếp các phần tử trong mảng theo một thuật toán được cung cấp và trả về mảng đã được sắp xếp.               |
| [Array.prototype.splice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)     | Thay đổi nội dung của mảng bằng cách xóa các phần tử hiện có và/hoặc thêm phần tử mới.                          |
| [Array.prototype.unshift()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift)   | Thêm một hoặc nhiều phần tử vào đầu mảng và trả về độ dài mới của mảng.                                       |

#### Phương thức truy cập

Các phương thức sau **không thay đổi giá trị của đối tượng gọi chúng**, mà chỉ trả về một mảng mới hoặc trả về một giá trị khác mà bạn mong đợi.

| Tên phương thức                                                                                                                           | Mô tả                                                                                                                            |
|:----------------------------------------------------------------------------------------------------------------------------------------- |:-------------------------------------------------------------------------------------------------------------------------------- |
| [Array.prototype.indexOf()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)               | Trả về chỉ mục của phần tử đầu tiên trong mảng có giá trị bằng giá trị đã cho. Nếu không tìm thấy, trả về -1.                    |
| [Array.prototype.lastIndexOf()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf)       | Trả về chỉ mục của phần tử cuối cùng trong mảng có giá trị bằng giá trị đã cho. Nếu không tìm thấy, trả về -1.                   |
| [Array.prototype.concat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)                 | Kết hợp mảng hiện tại với một hoặc nhiều mảng khác hoặc các giá trị không phải mảng để tạo ra một mảng mới.                      |
| [Array.prototype.includes()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)             | Kiểm tra xem mảng hiện tại có chứa giá trị đã cho hay không. Nếu có, trả về `true`, ngược lại trả về `false`.                    |
| [Array.prototype.join()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)                     | Kết hợp tất cả các phần tử trong mảng thành một chuỗi và trả về chuỗi đó.                                                        |
| [Array.prototype.slice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)                   | Trả về một mảng con mới từ một chỉ mục bắt đầu đến một chỉ mục kết thúc (không bao gồm chỉ mục kết thúc).                        |
| [Array.prototype.toString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString)             | Trả về một chuỗi biểu diễn của tất cả các phần tử trong mảng. Ghi đè phương thức `Object.prototype.toString()`.                  |
| [Array.prototype.toLocaleString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toLocaleString) | Trả về một chuỗi biểu diễn địa phương của tất cả các phần tử trong mảng. Ghi đè phương thức `Object.prototype.toLocaleString()`. |
| [Array.prototype.copyWithin()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin)         | Sao chép một chuỗi phần tử từ một vị trí bắt đầu đến một vị trí kết thúc trong mảng, ghi đè lên các phần tử hiện có.             |
| [Array.prototype.flat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)                     | Phương thức này sẽ đệ quy duyệt qua mảng và ghép tất cả các phần tử và các mảng con thành một mảng mới.                          |
| [Array.prototype.flatMap()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)               | Phương thức này sẽ áp dụng một hàm lên từng phần tử của mảng và sau đó ghép kết quả thành một mảng mới.                          |

#### Phương thức lặp

Trong các phương thức lặp dưới đây, nhiều phương thức yêu cầu một hàm gọi lại như một tham số. Trước khi hàm gọi lại được thực thi cho mỗi phần tử của mảng, thuộc tính `length` của mảng sẽ được lưu trữ ở một vị trí nào đó, vì vậy nếu bạn thêm phần tử mới vào mảng trong hàm gọi lại, những phần tử mới này sẽ không được lặp qua. Ngoài ra, nếu bạn thay đổi mảng trong hàm gọi lại, ví dụ như thay đổi giá trị của một phần tử hoặc xóa một phần tử, thì việc lặp tiếp theo có thể bị ảnh hưởng một cách không mong muốn. Tóm lại, **đừng cố gắng thay đổi mảng gốc trong quá trình lặp, mặc dù quy định đã định nghĩa rõ ràng cho việc này, nhưng vì tính đọc và tính bảo trì, hãy tránh làm điều này**.

| Tên phương thức                                      | Mô tả                                                                                                        |
| :-------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| [Array.prototype.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)             | Thực thi một hàm gọi lại cho mỗi phần tử của mảng.                                                            |
| [Array.prototype.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries)              | Trả về một đối tượng lặp qua mảng, chứa tất cả các cặp khóa/giá trị cho các phần tử trong mảng.               |
| [Array.prototype.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)                  | Kiểm tra xem tất cả các phần tử của mảng có thỏa mãn một hàm gọi lại đã cho hay không.                         |
| [Array.prototype.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)                    | Kiểm tra xem một số phần tử của mảng có thỏa mãn một hàm gọi lại đã cho hay không.                             |
| [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)                | Tạo một mảng mới chứa tất cả các phần tử của mảng gốc mà thỏa mãn một hàm gọi lại đã cho.                      |
| [Array.prototype.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)                    | Trả về giá trị của phần tử đầu tiên trong mảng mà thỏa mãn một hàm gọi lại đã cho. Nếu không tìm thấy, trả về `undefined`. |
| [Array.prototype.findIndex()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)         | Trả về chỉ mục của phần tử đầu tiên trong mảng mà thỏa mãn một hàm gọi lại đã cho. Nếu không tìm thấy, trả về -1. |
| [Array.prototype.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys)                    | Trả về một đối tượng lặp qua mảng, chứa tất cả các chỉ mục của các phần tử trong mảng.                        |
| [Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)                      | Tạo một mảng mới chứa kết quả của việc thực thi một hàm gọi lại cho mỗi phần tử của mảng gốc.                 |
| [Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)                | Thực thi một hàm gọi lại cho từng phần tử của mảng, lưu trữ kết quả trong một bộ nhớ tạm và trả về kết quả cuối cùng. |
| [Array.prototype.reduceRight()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight)     | Thực thi một hàm gọi lại cho từng phần tử của mảng từ phải sang trái, lưu trữ kết quả trong một bộ nhớ tạm và trả về kết quả cuối cùng. |
| [Array.prototype.values()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/values)                           | Trả về một đối tượng lặp qua mảng, chứa tất cả các giá trị của các phần tử trong mảng.                         |
| [Array.prototype[@@iterator]()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/@@iterator)                      | Tương tự như phương thức `values()`.                                                                         |

## Ví dụ

### Tạo mảng

- Không có tham số, tạo một mảng rỗng

```js
// Phương thức này tạo ra một mảng rỗng không có phần tử nào, tương đương với mảng trực tiếp []
var car = new Array();
```

- Có một tham số số, tham số này chỉ định độ dài của mảng

```js
var car = new Array(10);

console.log(car); // trả về []
console.log(car[0], car.length); // trả về undefined và 10
```

- Nếu có một tham số khác kiểu số, một mảng chỉ chứa một phần tử với giá trị đó sẽ được tạo ra

```js
var car = new Array('10');

console.log(car); // trả về ['10']
console.log(car[0], car.length); // trả về 10 và 1
```

- Khi có nhiều tham số, các tham số đó sẽ được biểu thị là các phần tử cụ thể của mảng

```js
var car = new Array(1, 2, 3);
console.log(car); // trả về [1,2,3]
console.log(car[0], car[1], car[2]); // trả về 1 2 3
```

### Mảng thưa thớt

Mảng thưa thớt là một mảng có các chỉ mục không liên tục bắt đầu từ 0.

- Cách đơn giản nhất để tạo một mảng thưa thớt là sử dụng toán tử delete.

```js
var car = [1, 2, 3, 4, 5];
delete car[1];

console.log(car[1]); // undefined
console.log(1 in car); // false
```

- Các giá trị phần tử trong mảng có thể bị bỏ qua bằng cách bỏ qua giá trị phần tử. Điều này cũng có thể tạo ra một mảng thưa thớt.

```js
var a = [1, , 3, 4, 5];

console.log(a[1]); // undefined
console.log(1 in a); // false
```

- Giá trị phần tử bị bỏ qua và giá trị phần tử là `undefined` có sự khác biệt.

```js
var a = [1, , 3, 4, 5];

console.log(a[1]); // trả về undefined
console.log(1 in a); // trả về false

var a = [1, undefined, 3, 4, 5];

console.log(a[1]); // trả về undefined
console.log(1 in a); // trả về true
```

- Nếu sử dụng dấu phẩy ở cuối mảng, các trình duyệt có thể có sự khác biệt. Trình duyệt chuẩn sẽ bỏ qua dấu phẩy đó, trong khi trình duyệt IE8sẽ thêm giá trị `undefined` vào cuối mảng.

```js
// Trình duyệt chuẩn trả về [1,2], trong khi trình duyệt IE8- trả về [1,2,undefined]
var a = [1, 2];
console.log(a);

// Trình duyệt chuẩn trả về 2, trong khi trình duyệt IE8- trả về 3
var a = [, ,];
console.log(a.length);
```

Mảng thưa thớt thường chậm hơn mảng dày đặc trong việc triển khai và sử dụng bộ nhớ hiệu quả hơn. Thời gian tìm kiếm phần tử trong mảng thưa thớt tương đương với thời gian tìm kiếm thuộc tính đối tượng thông thường.

### Độ dài của mảng

Mỗi mảng có một thuộc tính `length`, và đây là thuộc tính đặc biệt của mảng so với các đối tượng JavaScript thông thường. Đối với mảng dày đặc (không thưa thớt), giá trị của thuộc tính `length` đại diện cho số lượng các phần tử trong mảng, nó lớn hơn chỉ số lớn nhất trong mảng 1.

```js
[].length; // return 0: mảng không có phần tử, độ dài là 0
['a', 'b', 'c'].length; // return 3: chỉ số lớn nhất là 2, độ dài là 3
```

- Khi mảng là mảng thưa thớt, giá trị của thuộc tính `length` lớn hơn số lượng các phần tử, tương tự, nó lớn hơn chỉ số lớn nhất trong mảng 1.

```js
[, , ,].length; // return 3
Array(10).length; // return 10

var a = [1, 2, 3];
console.log(a.length); // return 3
delete a[1];
console.log(a.length); // return 3
```

Một đặc điểm đặc biệt của mảng là độ dài của nó có thể thay đổi động:

- Khi gán một giá trị cho một phần tử của mảng và chỉ số `i` lớn hơn hoặc bằng độ dài hiện tại của mảng, giá trị của thuộc tính `length` sẽ được đặt là `i + 1`.

```js
var arr = ['a', 'b'];
arr.length; // return 2

arr[2] = 'c';
arr.length; // return 3

arr[9] = 'd';
arr.length; // return 10

arr[1000] = 'e';
arr.length; // return 1001
```

- Khi đặt giá trị của thuộc tính `length` là một số nguyên không âm `n` nhỏ hơn độ dài hiện tại của mảng, các phần tử trong mảng có chỉ số lớn hơn hoặc bằng `n` sẽ bị xóa.

```js
a = [1, 2, 3, 4, 5]; // bắt đầu với một mảng có 5 phần tử
a.length = 3; // giờ a là [1,2,3]
a.length = 0; // xóa tất cả các phần tử. a là []
a.length = 5; // độ dài là 5, nhưng không có phần tử, giống như new Array(5)
```

- **Xóa mảng**: Một cách hiệu quả để xóa tất cả các phần tử của mảng là đặt giá trị của thuộc tính `length` là 0.

```js
var arr = ['a', 'b', 'c'];
arr.length = 0;
arr; // return []
```

Khi đặt giá trị của thuộc tính `length` là một số lớn hơn độ dài hiện tại của mảng, thực tế là không thêm phần tử mới vào mảng, mà chỉ tạo ra một vùng trống ở cuối mảng.

```js
var a = ['a'];
a.length = 3;
console.log(a[1]); // undefined
console.log(1 in a); // false
```

Nếu đặt giá trị không hợp lệ cho thuộc tính `length` (tức là từ 0 đến 2^32-2 ngoại trừ), JavaScript sẽ báo lỗi.

```js
// Đặt giá trị âm
[].length = -1; // RangeError: Invalid array length

// Số lượng phần tử trong mảng lớn hơn hoặc bằng 2^32
[].length = Math.pow(2, 32); // RangeError: Invalid array length

// Đặt giá trị là một chuỗi
[].length = 'abc'; // RangeError: Invalid array length
```

Do mảng thực chất là một đối tượng, nên có thể thêm thuộc tính cho mảng, nhưng điều này không ảnh hưởng đến giá trị của thuộc tính `length`.

```js
var a = [];

a['p'] = 'abc';
console.log(a.length); // 0

a[2.1] = 'abc';
console.log(a.length); // 0
```

### Lặp qua mảng

- Phương pháp phổ biến nhất để lặp qua các phần tử của một mảng là sử dụng vòng lặp `for`.

```js
var a = [1, 2, 3];
for (var i = 0; i < a.length; i++) {
  console.log(a[i]);
}
```

- Tất nhiên, bạn cũng có thể sử dụng vòng lặp `while`.

```js
var a = [1, 2, 3];
var i = 0;
while (i < a.length) {
  console.log(a[i]);
  i++;
}

var l = a.length;
while (l--) {
  console.log(a[l]);
}
```

- Tuy nhiên, khi mảng là một mảng thưa thớt, bạn cần thêm một số điều kiện khi sử dụng vòng lặp `for`.

```js
// Bỏ qua các phần tử không tồn tại
var a = [1, , , 2];
for (var i = 0; i < a.length; i++) {
  if (!(i in a)) continue;
  console.log(a[i]);
}
```

Cũng có thể sử dụng vòng lặp `for/in` để xử lý mảng thưa thớt. Mỗi lần lặp, một tên thuộc tính có thể lặp được (bao gồm cả chỉ số mảng) sẽ được gán cho biến lặp. **Các chỉ mục không tồn tại sẽ không được lặp qua.**

```js
var a = [1, , , 2];
for (var i in a) {
  console.log(a[i]);
}
```

Vì vòng lặp `for/in` có thể liệt kê các thuộc tính được thừa kế, như các phương thức được thêm vào `Array.prototype`. Vì lý do này, không nên sử dụng vòng lặp `for/in` trên mảng trừ khi sử dụng các phương pháp kiểm tra bổ sung để lọc các thuộc tính không mong muốn.

```js
var a = [1, , , 2];
a.b = 'b';
for (var i in a) {
  console.log(a[i]); // 1 2 'b'
}
```

```js
// Bỏ qua các chỉ mục không phải là số nguyên không âm i
var a = [1, , , 2];
a.b = 'b';
for (var i in a) {
  if (String(Math.floor(Math.abs(Number(i)))) !== i) continue;
  console.log(a[i]); // 1 2
}
```

Quy tắc JavaScript cho phép vòng lặp `for/in` lặp qua các thuộc tính của đối tượng theo thứ tự khác nhau. Thông thường, việc lặp qua các phần tử của mảng được thực hiện theo thứ tự tăng dần, nhưng không đảm bảo rằng sẽ luôn như vậy. Đặc biệt, nếu mảng có cả thuộc tính đối tượng và các phần tử mảng, tên thuộc tính trả về có thể theo thứ tự tạo ra chứ không phải theo thứ tự của giá trị số. **Nếu thuật toán phụ thuộc vào thứ tự lặp qua, thì nên tránh sử dụng vòng lặp `for/in` và sử dụng vòng lặp `for` thông thường.**

### Xáo trộn mảng

Xáo trộn mảng trong tiếng Anh được gọi là "shuffle", cũng được gọi là "đảo bài". Thông thường, có hai cách để xáo trộn mảng:

- Truyền một hàm vào phương thức `sort()` của mảng, hàm này sẽ trả về ngẫu nhiên 1 hoặc -1, để đạt được mục đích xáo trộn các phần tử của mảng.

```js
var array = [1, 2, 3, 4, 5];
array.sort(function () {
  return Math.random() - 0.5;
});
// trả về [2,1,5,4,3]
```

- Lặp qua từng phần tử của mảng và hoán đổi giá trị của phần tử đó với một phần tử ngẫu nhiên trong mảng (hiệu suất cao hơn phương pháp thứ nhất)

```js
var arr = [1, 2, 3, 4, 5];
for (var i = 0; i < arr.length; i++) {
  var randomIndex = Math.floor(Math.random() * arr.length);
  [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
}
console.log(arr); // trả về [2, 3, 1, 4, 5]
```
