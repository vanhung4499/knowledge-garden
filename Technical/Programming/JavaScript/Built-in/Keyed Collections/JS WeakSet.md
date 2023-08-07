---
title: JS WeakSet
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# WeakSet

Cấu trúc WeakSet tương tự như Set, là một tập hợp các giá trị không trùng lặp. Tuy nhiên, WeakSet có hai điểm khác biệt so với Set.

WeakSet là một hàm tạo và có thể nhận một mảng hoặc một đối tượng giống mảng làm tham số. (Thực tế, bất kỳ đối tượng nào có khả năng lặp qua cũng có thể được sử dụng làm tham số cho WeakSet). Tất cả các thành viên của mảng đó sẽ tự động trở thành các thành viên của đối tượng WeakSet.

Các thành viên của WeakSet chỉ có thể là các đối tượng, không thể là các kiểu dữ liệu khác.

Các đối tượng trong WeakSet đều có tác dụng yếu, có nghĩa là cơ chế thu gom rác không xem xét tham chiếu từ WeakSet đến đối tượng đó. Điều này có nghĩa là nếu không có tham chiếu khác đến đối tượng đó, cơ chế thu gom rác sẽ tự động giải phóng bộ nhớ của đối tượng đó. Nói cách khác, khi không cần thiết nữa, các đối tượng khóa và các cặp khóa/giá trị tương ứng trong WeakSet sẽ tự động biến mất, không cần phải xóa tham chiếu thủ công.

## Cú pháp

```js
new WeakSet();
```

Là một hàm tạo, WeakSet có thể nhận một mảng hoặc một đối tượng giống mảng làm tham số. Thực tế, bất kỳ đối tượng nào có khả năng lặp qua cũng có thể được sử dụng làm tham số cho WeakSet. Tất cả các thành viên của mảng đó sẽ tự động trở thành các thành viên của đối tượng WeakSet.

## Thuộc tính và phương thức của đối tượng WeakSet

### Thuộc tính

WeakSet không có thuộc tính `size` và không thể lặp qua các thành viên của nó.

WeakSet không thể lặp qua các thành viên, vì các thành viên đều có tác dụng yếu và có thể biến mất bất cứ lúc nào, do đó cơ chế lặp qua không đảm bảo rằng các thành viên sẽ tồn tại, có thể xảy ra trường hợp vừa lặp qua xong, thành viên đã không còn tồn tại. Một trong những ứng dụng của WeakSet là lưu trữ các nút DOM mà không cần lo lắng về việc các nút này bị xóa khỏi tài liệu.

### Phương thức

| Phương thức                              | Mô tả                                                                                                                      |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `WeakSet.prototype.add(value)`           | Thêm một thành viên mới vào đối tượng WeakSet.                                                                             |
| `WeakSet.prototype.delete(value)`        | Xóa thành viên cụ thể khỏi đối tượng WeakSet.                                                                              |
| `WeakSet.prototype.has(value)`           | Kiểm tra xem giá trị cụ thể có tồn tại trong đối tượng WeakSet hay không.                                                   |

## Ví dụ

```js
const a = [
  [1, 2],
  [3, 4],
];
const ws = new WeakSet(a);
// WeakSet {[1, 2], [3, 4]}
```

Trong ví dụ trên, `a` là một mảng có hai thành viên, cả hai đều là mảng. Khi `a` được sử dụng làm tham số cho hàm tạo WeakSet, các thành viên của `a` sẽ tự động trở thành các thành viên của đối tượng WeakSet.

Lưu ý: Các thành viên của WeakSet là các thành viên của mảng `a`, không phải là mảng `a` chính nó. Điều này có nghĩa là thành viên của mảng chỉ có thể là các đối tượng.

```js
// Sai
const b = [3, 4];
const ws = new WeakSet(b);
// Uncaught TypeError: Invalid value used in weak set(...)
// Các thành viên của mảng b không phải là đối tượng, vì vậy không thể thêm vào WeakSet
```
