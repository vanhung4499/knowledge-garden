---
title: JS Sleep Function
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-05
---

# Hàm ngủ - Sleep Function

Đề xuất sai, luồng JavaScript không thể tạm dừng, nhưng có thể tạo hiệu ứng tương tự giấc ngủ bằng cách sử dụng các phương thức bất đồng bộ.

## Cách triển khai

### Sử dụng hàm gọi lại (Callback Function)

```js
const sleep = (cb, time) => setTimeout(cb, time);

sleep(() => {
  console.log('Xin chào thế giới!');
}, 1000);
```

### Sử dụng Promise

```js
function sleep(time) {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, time);
  });
}

const promise = new Promise(function(resolve) {
  console.log('Làm một số công việc');
  resolve();
})
  .then(sleep(2000))
  .then(function() {
    console.log('Sau khi ngủ 2000ms');
  });
```

- Ưu điểm: Phương pháp này thực tế sử dụng `setTimeout`, không tạo ra tình trạng chặn tiến trình, không gây tải nặng và không ảnh hưởng đến hiệu suất.
- Nhược điểm: Mặc dù không như việc lồng nhau nhiều lớp như `callback`, nhưng vẫn không được trực quan và khi cần dừng thực hiện trong quá trình (hoặc trả về giá trị sai giữa chừng), vẫn phải kiểm tra và thoát từng lớp, rất phiền phức và không thân thiện, và không phải là bất đồng bộ hoàn toàn, vẫn cảm thấy lạ lẫm.

### Sử dụng Generator

```js
function* sleep(time) {
  yield new Promise(function(resolve, reject) {
    setTimeout(resolve, time);
  });
}

sleep(1000)
  .next()
  .value.then(() => {
    console.log('Xin chào thế giới!');
  });
```

- Ưu điểm: Tương tự như Promise, nhưng mã code trở nên rất đơn giản và sạch sẽ, không có `then` khó nhìn và khó chịu.
- Nhược điểm: Nhược điểm là phải gọi `next` mỗi lần, mặc dù có thể giải quyết bằng `co` (gói bên thứ ba), nhưng vẫn tạo thêm một lớp không tốt và không đẹp mắt, và lỗi vẫn phải được xử lý theo quy tắc của `co`, không thoải mái.

### Sử dụng Async/Await

```js
function sleep(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
}

async function test() {
  const res = await sleep(1000);

  console.log('Xin chào thế giới!');
  return res;
}
// Trì hoãn 1000ms và in ra "Xin chào thế giới!"
```

- Ưu điểm: Tương tự như Promise và Generator, Async/Await có thể coi là cú pháp đường dẫn của Generator, Async và Await so với `*` và `yield` có ý nghĩa ngữ nghĩa hơn, ngoài ra các hàm đều là phẳng, không có lồng nhau thừa thãi, mã code trở nên sạch sẽ và dễ đọc hơn.
- Nhược điểm: Cú pháp ES7 này có vấn đề về tương thích, nhưng không phải là vấn đề khi sử dụng Babel để tương thích.

### Sử dụng node-sleep

```js
const sleep = requir('node-sleep');
const sec = 10;

sleep.sleep(sec);
// Ngủ trong sec giây
sleep.msleep(sec);
// Ngủ trong sec mili giây
sleep.usleep(sec);
// Ngủ trong sec micro giây (1 giây = 1000000 micro giây)
```
