---
title: JS Factory Pattern
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-06
date modified: 2023-08-06
---

# Mô hình nhà máy - Factory Pattern

**Mô hình nhà máy** là một mô hình thiết kế phổ biến nhất được sử dụng để tạo ra các đối tượng. Mô hình nhà máy không tiết lộ logic cụ thể để tạo đối tượng, mà thay vào đó đóng gói logic trong một hàm, hàm này có thể được coi là một nhà máy. Mô hình nhà máy thường được sử dụng trong các dự án lớn, ví dụ như đối tượng `$` của jQuery, việc tạo đối tượng chọn lọc không sử dụng `new selector` là vì `$()` đã là một phương thức nhà máy, các ví dụ khác như `React.createElement()` và `Vue.component()` cũng là các cài đặt của mô hình nhà máy.

Mô hình nhà máy có thể được chia thành ba loại dựa trên mức độ trừu tượng:

- Nhà máy đơn giản: Hoàn thành nhiệm vụ kết nối lỏng lẻo thông qua một lớp bên thứ ba.
- Nhà máy phức tạp: Hoàn thành nhiệm vụ khởi tạo bằng cách giao nhiệm vụ tạo đối tượng cho các lớp con, nhằm đạt được mục tiêu kết nối lỏng.
- Siêu nhà máy: Hoàn thành thông qua `eval()` để tạo ra một nhà máy thông minh.

Mục đích của nhà máy là xác định lớp nào sẽ được sử dụng để khởi tạo giao diện (do đó, nó không thể tách rời khỏi giao diện).

Việc sử dụng nhà máy cuối cùng đạt được hiệu quả đa hình và mối liên hệ lỏng lẻo giữa các lớp.

## Các trường hợp sử dụng

### Triển khai bằng ES5

```js
function createPerson(name, age, job) {
  let person = new Object();
  person.name = name;
  person.age = age;
  person.job = job;
  person.sayNam = function () {
    console.log(`I'm ${name}`);
  };

  return person;
}

const person1 = createPerson('Ben', 21, 'student');
const person2 = createPerson('Gray', 25, 'Doctor');
```

Hàm `createPerson()` có thể xây dựng một đối tượng `Person` chứa tất cả thông tin cần thiết dựa trên các tham số nhận được. Có thể gọi hàm này nhiều lần và mỗi lần nó sẽ trả về một đối tượng chứa ba thuộc tính và một phương thức. Mô hình nhà máy giải quyết vấn đề tạo nhiều đối tượng tương tự nhưng không giải quyết vấn đề nhận dạng đối tượng (tức là làm thế nào để biết loại đối tượng).

### Triển khai bằng ES6

```js
class User {
  constructor(name, auth) {
    this.name = name;
    this.auth = auth;
  }
}
class UserFactory {
  static createUser(name, auth) {
    // Nhà máy đóng gói logic tạo đối tượng bên trong:
    // Khi quyền là admin, auth = 1; khi quyền là user, auth = 2
    // Người sử dụng khi tạo đối tượng bên ngoài không cần biết các quyền tương ứng với các trường, không cần biết logic gán quyền, chỉ cần biết đã tạo một quản trị viên và người dùng
    if (auth === 'admin') return new User(name, 1);
    if (auth === 'user') return new User(name, 2);
  }
}
const admin = UserFactory.createUser('riot', 'admin');
const user = UserFactory.createUser('lol', 'user');
```
