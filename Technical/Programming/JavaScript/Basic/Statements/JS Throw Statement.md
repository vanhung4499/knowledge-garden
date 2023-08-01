---
title: JS Throw Statement
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Câu lệnh throw

Câu lệnh `throw` được sử dụng để ném một ngoại lệ do người dùng tự định nghĩa. Việc thực thi của hàm hiện tại sẽ bị dừng lại (các câu lệnh sau câu lệnh `throw` sẽ không được thực thi), và điều khiển sẽ được chuyển đến khối `catch` đầu tiên trong ngăn xếp gọi. Nếu không có khối `catch` trong hàm gọi, chương trình sẽ bị dừng lại.

## Cú pháp

```js
throw expression;
```

### Tham số

| Tham số      | Mô tả           |
| ------------ | -------------- |
| `expression` | Biểu thức ném ra |

## Ví dụ

### Ví dụ mã

Bạn có thể ném bất kỳ biểu thức nào, không chỉ là một loại biểu thức cụ thể.

```js
throw 'Error2'; // Loại chuỗi
throw 42; // Loại số
throw true; // Loại boolean
throw {
  toString: function () {
    return "I'm an object";
  },
};
```

### Ném một đối tượng

Bạn có thể chỉ định một đối tượng khi ném ngoại lệ. Sau đó, bạn có thể tham chiếu các thuộc tính của đối tượng trong khối `catch`. Ví dụ dưới đây tạo một đối tượng có kiểu `UserException` và sử dụng nó trong câu lệnh `throw`.

```js
function UserException(message){
    this.message = message;
    this.name = "UserException";
}

function getMonthName(mo) {
    mo = mo - 1;	//	Chỉnh sửa số tháng thành chỉ mục mảng (1 = Jan, 12 = Dec)
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if(months[mo] !== undefined) {
       return months[mo];
    } else {
        throw new UserException("InvalidMonthNo");
    }
}

try {
   // Các câu lệnh cần thử
    var myMonth = 15;	//	Vượt quá giới hạn và ném ngoại lệ
    var monthName = getMonthName(myMonth);
} catch (e) {
    var monthName = "unknown";
    console.log(e.message, e.name);		// Truyền đối tượng ngoại lệ vào xử lý lỗi
}
```

Kết quả:

```
InvalidMonthNo UserException
```

Trong ví dụ này, với giá trị `myMonth` là 15, câu lệnh `throw` sẽ được sử dụng để ném một đối tượng `UserException`. Trong khối `catch`, biến `monthName` được gán giá trị là "unknown" và thông báo lỗi và tên của đối tượng ngoại lệ được in ra.
