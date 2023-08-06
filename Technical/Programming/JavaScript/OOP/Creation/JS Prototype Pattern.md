---
title: JS Prototype Pattern
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-06
date modified: 2023-08-06
---

# Mô hình nguyên mẫu - Prototype Pattern

Mỗi hàm mà chúng ta tạo đều có một thuộc tính `prototype` (nguyên mẫu), thuộc tính này là một con trỏ trỏ đến một đối tượng, đối tượng này chứa các thuộc tính và phương thức mà **tất cả các thể hiện của một loại cụ thể có thể chia sẻ**. Nếu hiểu theo nghĩa đen, thì `prototype` là đối tượng nguyên mẫu mà được tạo ra bằng cách gọi hàm tạo. Việc sử dụng đối tượng nguyên mẫu cho phép tất cả các thể hiện của đối tượng chia sẻ các thuộc tính và phương thức của nó. Nói cách khác, không cần định nghĩa thông tin của thể hiện trong hàm tạo, mà có thể thêm thông tin này trực tiếp vào đối tượng nguyên mẫu.

```js
function Person(){}

Person.prototype.name = 'Faker';
Person.prototype.age = 27;
Person.prototype.job = 'E-Sports Player';
Person.prototype.sayName = function(){
  console.log(this.name);
}

const faker1 = new Person();
faker1.sayName();
// 'Faker'

const faker2 = new Person();
faker2.sayName();
// 'Faker'

// Chia sẻ phương thức chung
console.log(faker1.sayName == faker2.sayName);
// true
```

Khác với hàm tạo, các thuộc tính và phương thức của đối tượng nguyên mẫu được chia sẻ bởi tất cả các thể hiện.

## Hiểu về đối tượng nguyên mẫu

Bất kỳ khi nào tạo một hàm mới, một thuộc tính `prototype` sẽ được tạo cho hàm đó theo một tập hợp quy tắc cụ thể, thuộc tính này trỏ đến đối tượng nguyên mẫu của hàm. Mặc định, tất cả các đối tượng nguyên mẫu đều tự động có một thuộc tính `constructor`, thuộc tính này là một con trỏ trỏ đến hàm chứa `prototype`.

Sau khi tạo một hàm tạo tùy chỉnh, đối tượng nguyên mẫu của nó mặc định chỉ có thuộc tính `constructor`; các phương thức khác đều được kế thừa từ đối tượng Object. Khi gọi hàm tạo để tạo một thể hiện mới, thể hiện đó sẽ chứa một con trỏ (thuộc tính nội bộ) trỏ đến đối tượng nguyên mẫu của hàm tạo. ECMAScript 5 gọi con trỏ này là `[[Prototype]]`. Mặc dù không có cách tiêu chuẩn để truy cập `[[Prototype]]` trong mã, Firefox, Safari và Chrome hỗ trợ một thuộc tính `__proto__` trên mọi đối tượng; trong các triển khai khác, thuộc tính này không được nhìn thấy trong mã. Tuy nhiên, điều quan trọng là kết nối này tồn tại giữa thể hiện và đối tượng nguyên mẫu của hàm tạo, không phải giữa thể hiện và hàm tạo.

Nguyên mẫu ban đầu chỉ chứa thuộc tính `constructor`, và thuộc tính này cũng được chia sẻ, do đó có thể truy cập thông qua thể hiện đối tượng.

Mặc dù có thể truy cập các giá trị được lưu trữ trong nguyên mẫu thông qua thể hiện đối tượng, nhưng không thể ghi đè các giá trị trong nguyên mẫu thông qua thể hiện. Nếu chúng ta thêm một thuộc tính vào thể hiện mà trùng tên với một thuộc tính trong nguyên mẫu, thì thuộc tính trong thể hiện sẽ được tạo ra và che phủ thuộc tính trong nguyên mẫu.

```js
function Person(){}

Person.prototype.name = 'Nicholas';
Person.prototype.age = 29;
Person.prototype.job = 'Software Engineer';
Person.prototype.sayName = function(){
console.log(this.name);
};

const person1 = new Person();
const person2 = new Person();

person1.name = 'Greg';
console.log(person1.name);
// 'Greg' 		// từ thể hiện
console.log(person2.name);
// 'Nicholas' 	// từ nguyên mẫu
```

Quá trình truy cập thuộc tính `name` của hai thể hiện:

- `person1` ==> Truy cập thuộc tính `name` trong thể hiện ==> Truy cập thành công thuộc tính `name` trong thể hiện
- `person2` ==> Truy cập thuộc tính `name` trong thể hiện ==> Không có thuộc tính `name` trong thể hiện ==> Truy cập thuộc tính `name` trong nguyên mẫu ==> Truy cập thành công

Khi thêm một thuộc tính vào một thể hiện, thuộc tính này chỉ che phủ thuộc tính cùng tên trong nguyên mẫu. Nói cách khác, việc thêm thuộc tính chỉ ngăn chúng ta truy cập vào giá trị thuộc tính trong nguyên mẫu, nhưng không thay đổi thuộc tính đó. Ngay cả khi thuộc tính này được đặt thành `null`, nó chỉ tạo ra thuộc tính trong thể hiện, không khôi phục kết nối với nguyên mẫu. Tuy nhiên, sử dụng toán tử `delete` có thể xóa hoàn toàn thuộc tính của thể hiện, cho phép chúng ta truy cập lại thuộc tính trong nguyên mẫu.

> Phương thức `Object.getOwnPropertyDescriptor()` của ECMAScript 5 chỉ hoạt động cho thuộc tính của thể hiện, để lấy mô tả thuộc tính của nguyên mẫu, phải gọi trực tiếp phương thức `Object.getOwnPropertyDescriptor()` trên đối tượng nguyên mẫu.

## Kiểm tra thuộc tính của nguyên mẫu và thực thể

Có hai cách sử dụng toán tử `in`: sử dụng độc lập và sử dụng trong vòng lặp `for-in`. Khi sử dụng độc lập, toán tử `in` sẽ trả về `true` khi đối tượng có thể truy cập vào thuộc tính cụ thể, **bất kể thuộc tính đó có tồn tại trong thực thể hay nguyên mẫu**.

Bằng cách sử dụng phương thức `hasOwnProperty()` và toán tử `in` cùng nhau, chúng ta có thể xác định xem thuộc tính đó tồn tại trong đối tượng hay trong nguyên mẫu.

Vì toán tử `in` chỉ cần đối tượng có thể truy cập vào thuộc tính thì trả về `true`, `hasOwnProperty()` chỉ trả về `true` khi thuộc tính tồn tại trong thực thể, do đó chỉ cần toán tử `in` trả về `true` và `hasOwnProperty()` trả về `false`, chúng ta có thể xác định thuộc tính đó là thuộc tính trong nguyên mẫu.

## Cú pháp nguyên mẫu đơn giản hơn

Trong ví dụ trước, mỗi khi thêm một thuộc tính hoặc phương thức, chúng ta phải nhập `Person.prototype` một lần. Để giảm sự nhập không cần thiết và để đóng gói chức năng của nguyên mẫu một cách tốt hơn từ mặt hình thức, cách thường thấy hơn là sử dụng một đối tượng chứa tất cả các thuộc tính và phương thức bằng cách ghi đè toàn bộ đối tượng nguyên mẫu.

```js
function Person(){}

Person.prototype = {
  name: 'Nicholas',
  age: 29,
  job: 'Software Engineer',
  sayName: function (){
    console.log(this.name);
  }
}
```

Như đã giới thiệu trước đó, mỗi khi tạo một hàm, một đối tượng nguyên mẫu của nó cũng được tạo ra tự động và đối tượng này tự động nhận được thuộc tính `constructor`. Nhưng với cú pháp này, chúng ta thực sự ghi đè đối tượng nguyên mẫu của thể hiện, và tương ứng với điều này, thuộc tính `constructor` trong đối tượng nguyên mẫu cũng bị ghi đè và không còn trỏ đến hàm `Person` nữa. Trong trường hợp này, mặc dù toán tử `instanceof` vẫn trả về kết quả đúng, nhưng không thể xác định loại đối tượng thông qua thuộc tính `constructor` nữa.

Tất nhiên, chúng ta có thể thiết lập lại giá trị phù hợp cho nó bằng cách thủ công. Tuy nhiên, việc đặt lại thuộc tính `constructor` này sẽ làm cho thuộc tính `[[Enumerable]]` của nó được đặt thành `true`. Mặc định, thuộc tính `constructor` của đối tượng nguyên mẫu là không thể liệt kê.

```js
function Person(){}

Person.prototype = {
  constructor: Person,
  name: 'Nicholas',
  age: 29,
  job: 'Software Engineer',
  sayName: function (){
    console.log(this.name);
  }
}
```

Việc đặt lại hàm tạo chỉ áp dụng cho các trình duyệt tương thích với ECMAScript 5.

```js
Object.defineProperty(Person, 'constructor', {
  enumerable: false,
  value: Person
})
```

## Tính động của nguyên mẫu

Do quá trình tìm kiếm giá trị trong nguyên mẫu chỉ là một quá trình tìm kiếm duy nhất, nên bất kỳ thay đổi nào chúng ta thực hiện trên đối tượng nguyên mẫu cũng sẽ được phản ánh ngay lập tức trên thể hiện, ngay cả khi tạo thể hiện trước và sau khi thay đổi nguyên mẫu.

Mối quan hệ giữa thể hiện và nguyên mẫu là một mối quan hệ lỏng lẻo,

```js
function Person(){}

const friend = new Person();

Person.prototype = {
  constructor: Person,
  name: 'Nicholas',
  age: 29,
  job: 'Software Engineer',
  sayName: function (){
    console.log(this.name);
  }
};

friend.sayName();
// lỗi
```

Việc ghi đè đối tượng nguyên mẫu đã cắt đứt mọi liên kết giữa nguyên mẫu hiện có và bất kỳ thể hiện đối tượng nào đã tồn tại trước đó, và chúng vẫn tham chiếu đến nguyên mẫu ban đầu.

## Nguyên mẫu của đối tượng nguyên mẫu

Tầm quan trọng của mô hình nguyên mẫu không chỉ nằm ở việc tạo ra các loại tùy chỉnh, mà còn nằm ở việc tạo ra tất cả các loại tham chiếu nguyên thủy. Tất cả các loại tham chiếu nguyên thủy (Object, Array, String, v.v.) đều được tạo ra bằng cách sử dụng mô hình này. Tất cả các loại tham chiếu nguyên thủy đều định nghĩa các phương thức trên nguyên mẫu của hàm tạo của chúng.

Thông qua nguyên mẫu của đối tượng nguyên thủy, không chỉ có thể truy cập vào tất cả các phương thức mặc định, mà còn có thể định nghĩa các phương thức mới. Có thể thay đổi nguyên mẫu của đối tượng nguyên thủy giống như thay đổi nguyên mẫu của đối tượng tùy chỉnh, do đó có thể thêm phương thức bất cứ lúc nào.

Mặc dù có thể làm như vậy, nhưng chúng tôi không khuyến nghị sửa đổi nguyên mẫu của đối tượng nguyên thủy trong các ứng dụng thực tế. Nếu thêm một phương thức vào nguyên mẫu của đối tượng nguyên thủy chỉ vì một triển khai thiếu phương thức, thì khi chạy mã trong một triển khai khác hỗ trợ phương thức đó, có thể dẫn đến xung đột tên. Ngoài ra, điều này cũng có thể ghi đè phương thức nguyên thủy một cách không đáng kể.

## Vấn đề với đối tượng nguyên mẫu

Mô hình nguyên mẫu bỏ qua bước truyền tham số khởi tạo cho hàm tạo, kết quả là tất cả các thể hiện mặc định sẽ có cùng giá trị thuộc tính.

Tất cả các thuộc tính trong nguyên mẫu đều được chia sẻ bởi nhiều thể hiện, điều này khá hợp lý đối với các phương thức. Đối với các thuộc tính chứa giá trị nguyên thủy, điều này cũng chấp nhận được, vì bằng cách thêm một thuộc tính cùng tên vào thể hiện, có thể ẩn đi thuộc tính tương ứng trong nguyên mẫu. Tuy nhiên, vấn đề trở nên rõ ràng hơn đối với các thuộc tính chứa giá trị tham chiếu.

```js
function Person(){}

Person.prototype = {
  name: 'Nicholas',
  age: 29,
  job: 'Software Engineer',
  friends: ['Shelby', 'Court'],
  sayName: function (){
    console.log(this.name);
  }
}

const person1 = new Person();
const person2 = new Person();

person1.friends.push('Van');

console.log(person1.friends);
// 'Shelby,Court,Van'
console.log(person2.friends);
// 'Shelby,COurt,Van'
console.log(person1.friends == person2.friends);
// true
```
