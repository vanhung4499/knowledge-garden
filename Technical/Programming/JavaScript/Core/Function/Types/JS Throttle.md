---
title: JS Throttle
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-05
---

# Hàm Throttle

**Hàm Throttle**: Quy định một khoảng thời gian, trong khoảng thời gian này, chỉ có một lần gọi lại hàm xử lý sự kiện được thực thi. Nếu trong cùng một khoảng thời gian một sự kiện được gọi lại nhiều lần, chỉ có một lần được thực thi. Đơn giản mà nói, hàm được thực thi ngay lập tức khi gọi, nhưng để thực thi lần tiếp theo, cần phải chờ một khoảng thời gian sau khi thực thi lần trước.

🏕 **Ví dụ trong cuộc sống hàng ngày**:

Chúng ta biết rằng hiện tại có một quan điểm là khi liên tục phát 24 khung hình trong 1 giây, trong thị giác của con người sẽ tạo thành một hoạt hình liên tục, vì vậy trong việc phát phim thường được phát với tốc độ 24 khung hình trên giây, tại sao không phải là 100 khung hình hoặc nhiều hơn, chủ yếu là vì 24 khung hình đã đáp ứng được nhu cầu thị giác của con người, trong khi 100 khung hình sẽ phí phạm tài nguyên.

## Mục đích

Từ chính nghĩa, hàm Throttle được sử dụng để giới hạn tốc độ thực thi của hàm, từ đó tối ưu hóa hiệu suất một cách đáng kể.

Ví dụ, thao tác DOM chiếm nhiều bộ nhớ hơn và tốn nhiều thời gian xử lý CPU hơn so với tương tác không phải DOM. Thử nghiệm liên tục thực hiện quá nhiều thao tác DOM có thể làm cho trình duyệt bị đơ, đôi khi thậm chí là gây sự cố. Đặc biệt khi sử dụng trình xử lý sự kiện `onresize` trong IE, khi thay đổi kích thước trình duyệt, sự kiện này sẽ được kích hoạt liên tục. Trong xử lý sự kiện `onresize`, nếu thử nghiệm thực hiện các thao tác DOM với tần suất cao, các thay đổi thường xuyên này có thể làm cho trình duyệt bị đơ.

## Cài đặt mã

```js
/**
 * Thực hiện hàm Throttle (nhằm giảm tần suất gọi hàm)
 * @param fn {Function} Hàm thực tế cần thực thi
 * @param wait {Number} Khoảng thời gian giữa các lần thực thi, tính bằng mili giây (ms), mặc định là 100ms
 * @return {Function} Hàm có thể gọi để thực thi
 */

function throttle(fn, wait = 500) {
  // Sử dụng closure để lưu trữ bộ đếm thời gian và thời gian thực thi lần cuối
  let timer = null,
    last;

  return function (...args) {
    const now = +new Date();

    if (last && now < last + timeout) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        last = now;
        fun.apply(this, args);
      }, timeout);
    } else {
      last = now;
      fn.apply(this, args);
    }
  };
}
```

## Ứng dụng thực tế

### Ứng dụng trong nguyên bản

Khi lần đầu tiên nhấp vào nút, hàm `trigger` được kích hoạt. Trong vòng 1000 mili giây, việc nhấp nút liên tục cũng không làm hàm `trigger` được thực thi lại, chỉ khi nhấp nút sau 1000 mili giây, hàm `trigger` mới được thực thi lại.

```js
const button = document.getElementById('button');

function trigger() {
  console.log('click');
}

button.addEventListener('click', throttle(trigger, 1000));
```

### Ứng dụng trong React

Trong React, lắng nghe sự kiện `resize` của cửa sổ và sự kiện `onChange` của ô nhập liệu:

```jsx
import React, { Component } from 'react';
import { throttle } from '@utils/throttle';

export default class Invoke extends Component {
  constructor() {
    super();
    this.change = throttle((e) => {
      console.log(e.target.value);
      console.log('throttle');
    }, 100);
  }
  handleWindowResize() {
    console.log('resize');
  }
  componentDidMount() {
    window.addEventListener('resize', throttle(this.handleWindowResize, 100));
  }
  componentWillUnmount() {
    window.removeEvenetListener('resize', throttle(this.handleWindowResize), 100);
  }
  handleInputChange = (e) => {
    // Lưu trữ sự kiện
    e.persist();
    this.change(e);
  };

  render() {
    return <input type="text" onChange={this.handleInputChange} />;
  }
}
```

Các thư viện khác cũng cung cấp cách thực hiện:

- [Lodash - throttle](https://github.com/lodash/lodash/blob/master/throttle.js)
- [Underscore - throttle](https://underscorejs.org/#throttle)

### Các tình huống ứng dụng

Các tình huống phổ biến mà thường xảy ra sự kiện lắng nghe với tần suất cao:

- Tình huống hoạt hình: tránh việc kích hoạt hoạt hình quá nhiều lần trong khoảng thời gian ngắn gây ra vấn đề về hiệu suất.
- Tình huống kéo thả: chỉ thực thi một lần trong khoảng thời gian cố định, tránh việc thay đổi vị trí liên tục với tần suất cao (sự kiện `mousemove`).
- Tình huống thu phóng: theo dõi kích thước cửa sổ trình duyệt (sự kiện `resize`).
- Tình huống cuộn: sự kiện cuộn chuột (sự kiện `wheel`).
- Chức năng vẽ trên Canvas.

> Tóm lại: Thích hợp cho việc phân phối sự kiện theo thời gian trong trường hợp có nhiều sự kiện xảy ra.

## Ví dụ thực tế

### Sự kiện cuộn trang

Ở đây, chúng ta lấy ví dụ về việc xác định xem trang đã cuộn đến cuối chưa. Phương pháp thông thường là lắng nghe sự kiện `scroll` của đối tượng Window, sau đó viết mã logic để kiểm tra xem trang đã cuộn đến cuối chưa.

```js
$(window).on('scroll', function () {
  // Mã logic kiểm tra xem trang đã cuộn đến cuối chưa
  let pageHeight = $('body').height(),
    scrollTop = $(window).scrollTop(),
    winHeight = $(window).height(),
    thresold = pageHeight - scrollTop - winHeight;

  if (thresod > -100 && thresold <= 20) {
    console.log('Cuối trang');
  }
});
```

Một điểm hạn chế của cách làm này là nó tốn nhiều tài nguyên, vì khi cuộn trang, trình duyệt sẽ liên tục tính toán và kiểm tra mã logic xem trang đã cuộn đến cuối chưa. Trong thực tế, chúng ta không cần làm như vậy. Trong thực tế, có thể như sau: trong quá trình cuộn, chỉ cần tính toán mã logic kiểm tra sau mỗi khoảng thời gian. Và điều mà hàm throttle làm là thực hiện hàm cần thiết sau mỗi khoảng thời gian. Vì vậy, việc sử dụng hàm throttle trong sự kiện cuộn là một ứng dụng tốt.

```js
$(window).on(
  'scroll',
  throttle(function () {
    // Mã logic kiểm tra xem trang đã cuộn đến cuối chưa
    let pageHeight = $('body').height(),
      scrollTop = $(window).scrollTop(),
      winHeight = $(window).height(),
      thresold = pageHeight - scrollTop - winHeight;
    if (thresold > -100 && thresold <= 20) {
      console.log('Cuối trang');
    }
  }, 300)
);
```

Sau khi áp dụng hàm throttle, khi trang cuộn, chỉ có thể thực hiện mã logic kiểm tra sau mỗi 300ms.

Đơn giản mà nói, hàm throttle sử dụng closure để lưu trữ một biểu thức (thường là biểu thức định danh thời gian) và kiểm tra xem biểu thức này có giá trị là `true` hay không ở đầu hàm. Nếu giá trị là `true`, hàm tiếp tục thực thi, ngược lại, hàm sẽ `return`. Sau khi kiểm tra biểu thức, biểu thức này sẽ được đặt thành `false` ngay lập tức, sau đó, hàm được gọi từ bên ngoài sẽ được bao bọc trong một `setTimeout`, cuối cùng, sau khi `setTimeout` thực thi xong, biểu thức sẽ được đặt lại thành `true` (điều này rất quan trọng), đại diện cho việc có thể thực hiện vòng lặp tiếp theo. Khi `setTimeout` chưa được thực thi, biểu thức `canRun` luôn là `false`, và sẽ được `return` ở đầu hàm.

```js
function throttle(fn, interval = 300) {
  let canRun = true;
  return function () {
    if (!canRun) return;
    canRun = false;
    setTimeout(() => {
      fn.apply(this.arguments);
      canRun = true;
    }, interval);
  };
}
```
