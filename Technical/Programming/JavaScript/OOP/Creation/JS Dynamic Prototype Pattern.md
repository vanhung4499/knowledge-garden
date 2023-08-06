---
title: JS Dynamic Prototype Pattern
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-06
date modified: 2023-08-06
---

# Mô hình nguyên mẫu động

Mô hình nguyên mẫu động đóng gói tất cả thông tin trong hàm tạo và khởi tạo nguyên mẫu trong hàm tạo (chỉ khởi tạo nguyên mẫu khi đối tượng đầu tiên được tạo). Điều này có thể được thực hiện bằng cách kiểm tra xem phương thức có hiệu lực hay không và chỉ khởi tạo nguyên mẫu khi cần thiết.

```js
function Person(name, age, job) {
  // Thuộc tính
  this.name = name;
  this.age = age;
  this.job = job;

  // Phương thức (động thêm phương thức vào nguyên mẫu)
  if (typeof this.sayName != 'function'){
    Person.prototype.sayName = function(){
      console.log(`I'm ${this.name}`);
    }
  }
}

const groot = new Person('Groot', 2, 'Tree');

groot.sayName();
// I'm Groot
```

Ở đây, chỉ khi phương thức `sayName()` không tồn tại, nó mới được thêm vào nguyên mẫu. Đoạn mã này chỉ được thực thi khi hàm tạo được gọi lần đầu tiên. Sau đó, nguyên mẫu đã được khởi tạo và không cần thay đổi gì thêm. Tuy nhiên, hãy nhớ rằng các thay đổi được thực hiện trên nguyên mẫu sẽ ngay lập tức phản ánh trong tất cả các thực thể.

Khi sử dụng mô hình nguyên mẫu động, không thể sử dụng đối tượng chữ ký để ghi đè nguyên mẫu. Nếu ghi đè nguyên mẫu khi đã tạo các thực thể, thì sẽ làm mất liên kết giữa các thực thể hiện có và nguyên mẫu mới.
