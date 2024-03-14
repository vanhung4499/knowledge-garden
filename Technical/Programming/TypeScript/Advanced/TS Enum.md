---
title: TS Enum
tags:
  - ts
categories:
  - ts
date created: 2024-03-15
date modified: 2024-03-15
---

# Enum

Kiểu Enum (liệt kê) được sử dụng trong các trường hợp giá trị bị giới hạn trong một phạm vi nhất định, chẳng hạn như chỉ có bảy ngày trong một tuần, màu sắc được giới hạn là đỏ, xanh lá cây, xanh dương, v.v.

## Ví dụ đơn giản

Enum được định nghĩa bằng từ khóa `enum`:

```ts
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};
```

Các thành viên của Enum sẽ được gán giá trị từ `0` và tăng lên theo thứ tự, đồng thời cũng sẽ ánh xạ ngược từ giá trị Enum đến tên Enum:

```ts
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};

console.log(Days["Sun"] === 0); // true
console.log(Days["Mon"] === 1); // true
console.log(Days["Tue"] === 2); // true
console.log(Days["Sat"] === 6); // true

console.log(Days[0] === "Sun"); // true
console.log(Days[1] === "Mon"); // true
console.log(Days[2] === "Tue"); // true
console.log(Days[6] === "Sat"); // true
```

Thực tế, ví dụ trên sẽ được biên dịch thành:

```js
var Days;
(function (Days) {
    Days[Days["Sun"] = 0] = "Sun";
    Days[Days["Mon"] = 1] = "Mon";
    Days[Days["Tue"] = 2] = "Tue";
    Days[Days["Wed"] = 3] = "Wed";
    Days[Days["Thu"] = 4] = "Thu";
    Days[Days["Fri"] = 5] = "Fri";
    Days[Days["Sat"] = 6] = "Sat";
})(Days || (Days = {}));
```

## Gán giá trị thủ công

Chúng ta cũng có thể gán giá trị cho các mục enum một cách thủ công:

```ts
enum Days {Sun = 7, Mon = 1, Tue, Wed, Thu, Fri, Sat};

console.log(Days["Sun"] === 7); // true
console.log(Days["Mon"] === 1); // true
console.log(Days["Tue"] === 2); // true
console.log(Days["Sat"] === 6); // true
```

Trong ví dụ trên, các mục enum mà không được gán giá trị thủ công sẽ tăng theo mục enum trước đó.

Nếu các mục enum không được gán giá trị thủ công trùng với các mục đã được gán giá trị, TypeScript sẽ không nhận biết được điều này:

```ts
enum Days {Sun = 3, Mon = 1, Tue, Wed, Thu, Fri, Sat};

console.log(Days["Sun"] === 3); // true
console.log(Days["Wed"] === 3); // true
console.log(Days[3] === "Sun"); // false
console.log(Days[3] === "Wed"); // true
```

Trong ví dụ trên, khi tăng lên `3`, nó trùng với giá trị của `Sun` đã được gán trước đó, nhưng TypeScript không báo lỗi, dẫn đến giá trị của `Days[3]` ban đầu là `"Sun"`, nhưng sau đó lại bị `"Wed"` ghi đè. Kết quả biên dịch là:

```js
var Days;
(function (Days) {
    Days[Days["Sun"] = 3] = "Sun";
    Days[Days["Mon"] = 1] = "Mon";
    Days[Days["Tue"] = 2] = "Tue";
    Days[Days["Wed"] = 3] = "Wed";
    Days[Days["Thu"] = 4] = "Thu";
    Days[Days["Fri"] = 5] = "Fri";
    Days[Days["Sat"] = 6] = "Sat";
})(Days || (Days = {}));
```

Vì vậy khi sử dụng, bạn cần chú ý, tốt nhất là không nên để xảy ra tình huống ghi đè như vậy.

Các mục enum được gán giá trị thủ công có thể không phải là số, trong trường hợp này cần sử dụng type assertion để cho phép tsc bỏ qua kiểm tra kiểu (js biên dịch vẫn có thể sử dụng):

```ts
enum Days {Sun = 7, Mon, Tue, Wed, Thu, Fri, Sat = <any>"S"};
```

```js
var Days;
(function (Days) {
    Days[Days["Sun"] = 7] = "Sun";
    Days[Days["Mon"] = 8] = "Mon";
    Days[Days["Tue"] = 9] = "Tue";
    Days[Days["Wed"] = 10] = "Wed";
    Days[Days["Thu"] = 11] = "Thu";
    Days[Days["Fri"] = 12] = "Fri";
    Days[Days["Sat"] = "S"] = "Sat";
})(Days || (Days = {}));
```

Dĩ nhiên, các mục enum được gán giá trị thủ công cũng có thể là số thập phân hoặc số âm, trong trường hợp này bước tăng của các mục sau đó không được gán giá trị vẫn là `1`:

```ts
enum Days {Sun = 7, Mon = 1.5, Tue, Wed, Thu, Fri, Sat};

console.log(Days["Sun"] === 7); // true
console.log(Days["Mon"] === 1.5); // true
console.log(Days["Tue"] === 2.5); // true
console.log(Days["Sat"] === 6.5); // true
```

## Các mục hằng số và mục tính toán

Các mục của enum có hai loại: mục hằng số (constant member) và mục tính toán (computed member).

Các ví dụ trước đây mà chúng ta đã nêu đều là mục hằng số, một ví dụ điển hình về mục tính toán là:

```ts
enum Color {Red, Green, Blue = "blue".length};
```

Trong ví dụ trên, `"blue".length` là một mục tính toán.

Ví dụ trên sẽ không báo lỗi, nhưng **nếu một mục không được gán giá trị thủ công nằm ngay sau một mục tính toán, nó sẽ báo lỗi do không thể lấy giá trị khởi tạo**:

```ts
enum Color {Red = "red".length, Green, Blue};

// index.ts(1,33): error TS1061: Enum member must have initializer.
// index.ts(1,40): error TS1061: Enum member must have initializer.
```

Dưới đây là định nghĩa đầy đủ của các mục hằng số và mục tính toán:

Một mục của enum được coi là hằng số khi đáp ứng các điều kiện sau:

- Không có hàm khởi tạo và mục enum trước đó là hằng số. Trong trường hợp này, giá trị của mục enum hiện tại là giá trị của mục enum trước đó cộng thêm `1`. Tuy nhiên, mục đầu tiên của enum là một ngoại lệ. Nếu nó không có hàm khởi tạo, thì giá trị khởi tạo của nó sẽ là `0`.
- Mục enum được khởi tạo bằng biểu thức enum hằng số. Biểu thức enum hằng số là một tập con của biểu thức TypeScript, nó có thể được tính toán ở giai đoạn biên dịch. Khi một biểu thức đáp ứng một trong các điều kiện sau, nó sẽ là một biểu thức enum hằng số:
  - Literal số
  - Tham chiếu đến mục enum hằng số được định nghĩa trước đó (có thể được định nghĩa trong các loại enum khác nhau) Nếu mục này được định nghĩa trong cùng một loại enum, bạn có thể sử dụng tên không quy định để tham chiếu
  - Biểu thức enum hằng số có dấu ngoặc
  - `+`, `-`, `~` các toán tử một ngôi áp dụng cho biểu thức enum hằng số
  - `+`, `-`, `*`, `/`, `%`, `<<`, `>>`, `>>>`, `&`, `|`, `^` các toán tử hai ngôi, biểu thức enum hằng số là một trong các toán hạng của nó. Nếu biểu thức enum hằng số được đánh giá là NaN hoặc Infinity, nó sẽ báo lỗi ở giai đoạn biên dịch

Tất cả các trường hợp khác của mục enum được coi là cần phải được tính toán để lấy giá trị.

## Enum hằng số

Enum hằng số là loại enum được định nghĩa bằng `const enum`:

```ts
const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

Sự khác biệt giữa enum hằng số và enum thông thường là enum hằng số sẽ bị xóa trong quá trình biên dịch, và không thể chứa các mục tính toán.

Kết quả biên dịch của ví dụ trên là:

```js
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
```

Nếu chứa các mục tính toán, nó sẽ báo lỗi trong quá trình biên dịch:

```ts
const enum Color {Red, Green, Blue = "blue".length};

// index.ts(1,38): error TS2474: In 'const' enum declarations member initializer must be constant expression.
```

## Enum bên ngoài

Enum bên ngoài (Ambient Enums) là loại enum được định nghĩa bằng `declare enum`:

```ts
declare enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

Như đã đề cập trước đó, loại định nghĩa `declare` chỉ được sử dụng cho kiểm tra trong quá trình biên dịch, kết quả biên dịch sẽ bị xóa.

Kết quả biên dịch của ví dụ trên là:

```js
var directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

Enum bên ngoài giống như các câu lệnh khai báo, thường xuất hiện trong các tệp khai báo.

Cũng có thể sử dụng `declare` và `const` cùng một lúc:

```ts
declare const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

Kết quả biên dịch:

```js
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
```

> Khái niệm về loại enum của TypeScript [có nguồn gốc từ C#]().
