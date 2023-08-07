---
title: JS Reflect
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-08
---

# Reflect

Reflect là một đối tượng tích hợp sẵn trong JavaScript, nó cung cấp các phương thức để chặn các hoạt động JavaScript. Các phương thức này tương tự như các phương thức của đối tượng xử lý. Reflect không phải là một đối tượng hàm, vì vậy nó không thể được tạo bằng cách sử dụng từ khóa `new`.

Mục đích thiết kế của Reflect là:

1. Đưa các phương thức của đối tượng Object mà rõ ràng thuộc về ngôn ngữ (ví dụ: `Object.defineProperty`) vào đối tượng Reflect. Hiện tại, một số phương thức được triển khai cả trên đối tượng Object và Reflect, nhưng trong tương lai, các phương thức mới chỉ sẽ được triển khai trên đối tượng Reflect. Điều này có nghĩa là chúng ta có thể truy cập các phương thức thuộc ngôn ngữ từ đối tượng Reflect.
2. Sửa đổi kết quả trả về của một số phương thức của đối tượng Object để làm cho chúng hợp lý hơn. Ví dụ, `Object.defineProperty(obj, name, desc)` sẽ ném ra một lỗi khi không thể định nghĩa thuộc tính, trong khi `Reflect.defineProperty(obj, name, desc)` sẽ trả về `false`.
3. Chuyển các hoạt động **lệnh** của đối tượng Object thành **hành vi hàm**. Ví dụ, `name in obj` và `delete obj[name]` được chuyển thành `Reflect.has(obj, name)` và `Reflect.deleteProperty(obj, name)` để chúng trở thành hành vi hàm.
4. Các phương thức của đối tượng Reflect tương ứng một-đến-một với các phương thức của đối tượng Proxy. Điều này cho phép đối tượng Proxy dễ dàng gọi các phương thức tương ứng của Reflect để hoàn thành hành vi mặc định, đồng thời làm cơ sở cho việc sửa đổi hành vi. Nghĩa là, bất kể Proxy sửa đổi hành vi mặc định như thế nào, bạn vẫn có thể truy cập hành vi mặc định từ Reflect.

Ví dụ:

```js
Proxy(target, {
  set: function(target, name, value, receiver) {
    const success = Reflect.set(target, name, value, receiver);

    if (success) {
      console.log('property ' + name + ' on ' + target + ' set to ' + value);
    }

    return successs;
  },
});
```

Trong đoạn mã trên, phương thức Proxy chặn việc gán giá trị cho thuộc tính của đối tượng `target`. Nó sử dụng phương thức `Reflect.set` để gán giá trị cho thuộc tính của đối tượng, đảm bảo hoàn thành hành vi ban đầu, sau đó triển khai chức năng bổ sung.

```js
const proxy = new Proxy(obj, {
  get(target, name) {
    console.log('get', target, name);
    return Reflect.get(target, name);
  },
  deleteProperty(target, name) {
    console.log('delete' + name);
    return Reflect.deleteProperty(target, name);
  },
  has(target, name) {
    console.log('has' + name);
    return Reflect.has(target, name);
  },
});
```

Trong đoạn mã trên, mỗi hoạt động chặn của đối tượng Proxy (`get`, `delete`, `has`) đều gọi phương thức tương ứng của Reflect bên trong, đảm bảo thực hiện hành vi gốc. Công việc được thêm vào là ghi log mỗi hoạt động.

Có đối tượng Reflect, nhiều hoạt động trở nên dễ đọc hơn.

```js
// Cách viết cũ
Function.prototype.apply.call(Math.floor, undefined, [1.75]);
// 1

// Cách viết mới
Reflect.apply(Math.floor, undefined, [1.75]);
// 1
```

Khác với hầu hết các đối tượng toàn cục khác, Reflect không có hàm tạo, bạn không thể sử dụng nó với toán tử `new` hoặc gọi đối tượng Reflect như một hàm. Tất cả các thuộc tính và phương thức của Reflect đều là tĩnh (giống như đối tượng Math).

## Các phương thức tĩnh

| Phương thức tĩnh                   | Mô tả                                                                                   |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| `Reflect.apply`                   | Thực hiện gọi một hàm và truyền một mảng làm tham số, tương tự như `Function.prototype.apply` |
| `Reflect.construct`               | Thực hiện việc tạo một đối tượng từ một hàm tạo, tương đương với việc thực hiện `new target(…args)` |
| `Reflect.defineProperty`          | Tương tự như `Object.defineProperty`                                                   |
| `Reflect.deleteProperty`          | Thực hiện việc xóa một thuộc tính của đối tượng, tương đương với việc thực hiện `delete target[name]` |
| `Reflect.get`                     | Lấy giá trị của một thuộc tính của đối tượng                                            |
| `Reflect.getOwnPropertyDescriptor` | Tương tự như `Object.getOwnPropertyDescriptor`                                        |
| `Reflect.getPrototypeOf`          | Tương tự như `Object.getPrototypeOf`                                                  |
| `Reflect.has`                     | Kiểm tra xem một thuộc tính có tồn tại trong đối tượng hay không, tương đương với `in` |
| `Reflect.isExtensible`            | Tương tự như `Object.isExtensible`                                                     |
| `Reflect.ownKeys`                 | Trả về một mảng chứa tất cả các thuộc tính riêng của đối tượng (không bao gồm thuộc tính kế thừa) |
| `Reflect.preventExtensions`       | Tương tự như `Object.preventExtensions`                                               |
| `Reflect.set`                     | Gán giá trị cho một thuộc tính của đối tượng, trả về Boolean, nếu thành công, trả về `true` |
| `Reflect.setPrototypeOf`          | Tương tự như `Object.setPrototypeOf`                                                  |

## Ưu điểm so với các phương pháp truyền thống

Việc sử dụng Reflect để thao tác với đối tượng phù hợp hơn với hướng đối tượng, tất cả các phương thức thao tác với đối tượng đều được đặt trên đối tượng Reflect.

|                        | Thao tác với Reflect                                                                                        | Các phương pháp truyền thống để thao tác với đối tượng                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Hướng đối tượng        | Tất cả các phương thức đều được đặt trên đối tượng `Reflect`, phù hợp với hướng đối tượng                   | Các phương thức chỉ định, ` = `, `in`, `delete`                                                            |
| Hàm số                 | Tất cả các phương thức đều là hàm số                                                                        | Kết hợp giữa các lệnh, gán giá trị, và hàm số                                                              |
| Báo lỗi theo quy chuẩn | `defineProperty` trả về `false` nếu không thành công, các phương thức khác báo lỗi nếu tham số không hợp lệ | `defineProperty` báo lỗi nếu không thành công, các phương thức khác không báo lỗi nếu tham số không hợp lệ |
| Mở rộng phương thức    | Tham số `receiver` xác định `this`                                                                          | Không thể mở rộng                                                                                          |

## Ví dụ

### Mô hình Quan sát

Mô hình Quan sát (Observer Pattern) đề cập đến việc tự động quan sát đối tượng dữ liệu, khi đối tượng có sự thay đổi, các hàm sẽ tự động được thực thi.

```js
const person = observerable({
  name: 'Tom',
  age: 10,
});

function print() {
  console.log(`${person.name}, ${person.age}`);
}

observe(print);

person.name = 'Jerry';
// Jerry, 10
```

Trong đoạn mã trên, đối tượng dữ liệu `person` là đối tượng được quan sát, hàm `print` là người quan sát. Khi đối tượng dữ liệu thay đổi, hàm `print` sẽ tự động được thực thi.

Dưới đây, chúng ta sử dụng Proxy để viết một phiên bản đơn giản nhất của mô hình Quan sát, tức là triển khai hai hàm `observable` và `observe`. Ý tưởng là hàm `observable` trả về một đối tượng Proxy của đối tượng gốc, chặn các hoạt động gán giá trị và kích hoạt các hàm đóng vai trò là người quan sát.

```js
const queuedObservers = new Set();

const observe = fn => queuedObservers.add(fn);

const observable = obj => new Proxy(obj, { set });

function set(target, key, value, receiver) {
  const result = Reflect.set(target, key, value, receiver);

  queuedObservers.forEach(observer => observer());

  return result;
}
```

### Lấy và đặt thuộc tính bằng Reflect

```js
const Ironman = {
  firstName: 'Tony',
  lastName: 'Stark',
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
};

// Lấy thuộc tính riêng, cả hai phương pháp cũ và mới đều có thể thực hiện
Reflect.get(Ironman, 'firstName');
// Tony
Reflect.get(Ironman, 'lastName');
// Tony
Reflect.get(Ironman, 'fullName');
// Tony Stark

const Spiderman = {
  firstName: 'Peter',
  lastName: 'Parker',
};

// Lấy thuộc tính thông qua Reflect, chỉ Reflect mới có thể thực hiện
Reflect.get(Ironman, 'fullName', Spiderman);
// Peter Parker
```
