---
title: JS Debounce
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-05
---

# Hàm debounce

**Hàm debounce**: Trong trường hợp có nhiều lần kích hoạt liên tục, chỉ khi có đủ thời gian rảnh rỗi, mã lệnh mới được thực thi một lần. Nếu chưa thực thi xong thì hủy bỏ và thực hiện lại logic. Đơn giản mà nói, khi kích hoạt lại sau khi đã kích hoạt trước đó, nó sẽ hủy bỏ việc thực thi kích hoạt trước đó cho đến khi đã trôi qua một khoảng thời gian được định sẵn.

🏕 **Ví dụ trong cuộc sống hàng ngày:**

Giả sử bạn đang đi thang máy lên tầng trên cùng. Trước khi cửa thang máy đóng lại, bạn nhìn thấy có người khác cũng muốn đi thang máy, để lịch sự, bạn sẽ nhấn nút mở cửa thang máy và đợi họ lên. Nếu trước khi cửa thang máy đóng lại, lại có người đến, bạn sẽ tiếp tục mở cửa. Quá trình này tiếp tục cho đến khi không còn ai đến thì bạn sẽ đóng cửa thang máy và đi lên.

Hàm debounce quy định rằng việc thực thi lại hàm cần đáp ứng hai điều kiện:

1. Khi gọi sự kiện, cần chờ một khoảng thời gian trước khi thực thi sự kiện đó.
2. Trong khoảng thời gian chờ đó, nếu gọi lại hành động này, thì thời gian chờ sẽ được tính lại.

## Nguyên lý hoạt động

Một số mã không thể được thực thi liên tục mà không có khoảng thời gian gián đoạn. Khi gọi hàm lần đầu tiên, một bộ hẹn giờ được tạo ra và mã sẽ được thực thi sau một khoảng thời gian nhất định. Khi gọi hàm lần thứ hai, nó sẽ xóa bộ hẹn giờ trước đó và thiết lập một bộ hẹn giờ mới. Nếu bộ hẹn giờ trước đó đã được thực thi, thì hành động này không có ý nghĩa gì. Tuy nhiên, nếu bộ hẹn giờ trước đó chưa được thực thi, thực tế là nó được thay thế bằng một bộ hẹn giờ mới. Mục đích là chỉ thực thi khi yêu cầu thực thi dừng lại trong một khoảng thời gian nhất định.

## Cách thực hiện

Sau khi sự kiện được kích hoạt, cần chờ một khoảng thời gian nhất định trước khi hàm gọi lại được thực thi. Nếu trong khoảng thời gian chờ đó, sự kiện được kích hoạt lại, thì thời gian chờ sẽ được tính lại, cho đến khi không có sự kích hoạt sự kiện trong khoảng thời gian chờ đã định, thì hàm cuối cùng sẽ được thực thi.

💡 **Ý tưởng thực hiện:**

Đóng gói phương thức mục tiêu (hành động) trong hàm `setTimeout`, sau đó phương thức này là một hàm gọi lại của sự kiện. Nếu hàm gọi lại này được thực thi liên tục, thì hủy bỏ hẹn giờ đang chạy bằng cách sử dụng `clearTimeout`, trong khi phương thức mục tiêu trong hẹn giờ cũng sẽ không được thực thi. Chỉ khi hàm gọi lại trong hẹn giờ được thực thi sau khoảng thời gian đã định, thì phương thức mục tiêu mới được thực thi.

```js
/**
 * Thực hiện hàm debounce (nhằm mục đích chỉ thực thi một lần trong quá trình kích hoạt liên tục)
 * @param func {function} Hàm cần thực thi
 * @param wait {number} Thời gian kiểm tra debounce, tính bằng mili giây (ms)
 * @param immediate {boolean} Xác định xem có thực thi ngay lập tức hay không
 * @return {function} Hàm có thể gọi và thực thi
 */

function debounce(func, wait = 500, immediate = false) {
  let timer = null;

  // Trả về một hàm, hàm này sẽ thực thi hàm func sau một khoảng thời gian chờ
  return function (...args) {
    // Thực thi ngay lập tức
    if (immediate) {
      fn.apply(this, args);
    }

    // Gọi hàm, hủy bỏ hẹn giờ
    timer && clearTimeout(timer);

    // Khi hàm trả về được gọi cuối cùng (nghĩa là người dùng dừng một hoạt động liên tục nào đó)
    // Sau wait mili giây, thực thi func
    // Ở đây sử dụng hàm mũi tên để không cần lưu trữ tham chiếu ngữ cảnh thực thi
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

Các thư viện khác đã thực hiện: [Lodash](https://github.com/lodash/lodash/blob/master/debounce.js) [Underscore](https://underscorejs.org/#debounce)

## Ứng dụng thực tế

### Trường hợp sử dụng hàm debounce

Hàm debounce được sử dụng trong các trường hợp cần phản hồi cho các sự kiện liên tục chỉ một lần.

- Trường hợp nút gửi: Ngăn chặn việc nhấp nút gửi nhiều lần, chỉ thực thi lần gửi cuối cùng.
- Trường hợp xác minh từ máy chủ: Xác minh biểu mẫu yêu cầu sự phối hợp từ máy chủ, chỉ thực thi lần cuối cùng của một chuỗi sự kiện liên tục, tương tự như chức năng gợi ý từ khóa tìm kiếm.

> Tóm lại: Phù hợp cho các trường hợp một phản hồi cho nhiều sự kiện.

## Triển khai thực tế

### Xác minh đăng ký trực tiếp

Ở đây, chúng ta lấy ví dụ về việc xác minh xem tên người dùng đã được sử dụng hay chưa khi đăng ký người dùng. Hiện nay, nhiều trang web để cải thiện trải nghiệm người dùng, không kiểm tra xem tên người dùng có bị sử dụng hay không khi ô nhập mất tiêu điểm, mà là kiểm tra xem tên người dùng đã được đăng ký khi nhập.

```js
$('input.user-name').on('input', function () {
  $.ajax({
    url: `https://just.com/check`,
    method: 'post',
    data: {
      username: $(this).val(),
    },
    success(data) {
      if (data.isRegistered) {
        $('.tips').text('Tên người dùng này đã được đăng ký!');
      } else {
        $('.tips').text('Chúc mừng! Tên người dùng này chưa được đăng ký!');
      }
    },
    error(error) {
      console.log(error);
    },
  });
});
```

Rõ ràng, cách làm này không tốt là khi người dùng nhập ký tự đầu tiên, việc kiểm tra đã bắt đầu, không chỉ tăng áp lực lên máy chủ mà còn không chắc chắn liệu nó có tốt hơn trước đây hay không. Cách làm lý tưởng sẽ là, khi người dùng nhập ký tự đầu tiên, nếu vẫn có ký tự nhập vào trong một khoảng thời gian nhất định, thì tạm thời không kiểm tra xem tên người dùng đã được sử dụng hay chưa. Trong trường hợp này, việc sử dụng hàm debounce sẽ giải quyết vấn đề này một cách tốt:

```js
$('input.user-name').on(
  'input',
  debounce(function () {
    $.ajax({
      url: `https://just.com/check`,
      method: 'post',
      data: {
        username: $(this).val(),
      },
      success(data) {
        if (data.isRegistered) {
          $('.tips').text('Tên người dùng này đã được đăng ký!');
        } else {
          $('.tips').text('Chúc mừng! Tên người dùng này chưa được đăng ký!');
        }
      },
      error(error) {
        console.log(error);
      },
    });
  })
);
```

Thực tế, nguyên lý của hàm debounce cũng rất đơn giản, sử dụng closure để lưu trữ một biến đánh dấu để lưu trữ giá trị trả về của `setTimeout`, mỗi khi người dùng nhập, xóa `setTimeout` trước đó và tạo một `setTimeout` mới, điều này đảm bảo rằng nếu trong khoảng thời gian `interval` có ký tự nhập vào, hàm `fn` sẽ không được thực thi.

```js
function debounce(fn, interval = 300) {
  let timeout = null;

  return function () {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn.apply(this, arguments);
    }, interval);
  };
}
```
