---
title: JS Event Loop
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-03
date modified: 2023-08-03
---

# Vòng lặp sự kiện (Event Loop)

Để điều phối sự kiện, tương tác người dùng, script, hiển thị giao diện người dùng và yêu cầu mạng, trình duyệt phải sử dụng **cơ chế vòng lặp sự kiện (Event Loop)**.

Cơ chế vòng lặp sự kiện này được thực hiện bởi môi trường chạy JavaScript, trong môi trường trình duyệt, nó được thực hiện bởi engine nhân trình duyệt, trong NodeJS, nó được thực hiện bởi engine [libuv](https://github.com/libuv/libuv).

Khi tiến trình chính chạy, nó tạo ra Heap và Stack. Các mã trong Stack gọi các API bên ngoài và chúng được thêm vào hàng đợi sự kiện. Chỉ cần mã trong Stack thực thi xong, tiến trình chính sẽ đọc hàng đợi sự kiện thông qua cơ chế vòng lặp sự kiện và thực thi các hàm gọi lại tương ứng với các sự kiện đó.

Cơ chế hoạt động như sau:

1. Tất cả các tác vụ đồng bộ được thực thi trên tiến trình chính, tạo thành một **Ngăn xếp thực thi** (Execution Context Stack).
2. Bên ngoài tiến trình chính, có một **Hàng đợi tác vụ** (Task Queue). Khi các tác vụ bất đồng bộ có kết quả, chúng được đặt vào Hàng đợi tác vụ.
3. Khi tất cả các tác vụ đồng bộ trong Stack thực thi được thực hiện, hệ thống sẽ đọc Hàng đợi tác vụ để xem có sự kiện nào đang chờ thực thi. Các tác vụ bất đồng bộ tương ứng với các sự kiện đó sẽ kết thúc chờ đợi và được đưa vào Stack thực thi để bắt đầu thực hiện.
4. Tiến trình chính lặp lại bước 3 liên tục.

## Môi trường trình duyệt

Các tác vụ bất đồng bộ trong JavaScript được phân loại thành hai loại dựa trên sự kiện: MacroTask (Tác vụ lớn) và MicroTask (Tác vụ nhỏ).

- **MacroTask**: main script, setTimeout, setInterval, setImmediate (Node.js), I/O (Mouse Events, Keyboard Events, Network Events), UI Rendering (HTML Parsing), MessageChannel.
- **MicroTask**: Promise.then (không phải new Promise), process.nextTick (Node.js), MutationObserver.

Sự khác biệt giữa MacroTask và MicroTask nằm ở mức độ ưu tiên thực thi các sự kiện trong hàng đợi. Khi tiến trình chạy vào mã chính (MacroTask), bắt đầu vòng lặp sự kiện lần đầu, sau khi Stack thực thi được làm trống, cơ chế vòng lặp sự kiện sẽ ưu tiên kiểm tra hàng đợi MicroTask và đẩy các sự kiện đó vào luồng chính để thực thi. Sau khi hàng đợi MicroTask trống, cơ chế vòng lặp sự kiện mới kiểm tra hàng đợi MacroTask và đẩy các sự kiện đó vào luồng chính để thực thi. Khi Stack thực thi trống lần nữa, cơ chế vòng lặp sự kiện lại kiểm tra hàng đợi MicroTask và tiếp tục lặp lại quá trình trên.

**Ưu tiên của MacroTask và MicroTask**

- MacroTask có ưu tiên hơn MicroTask.
- Sau khi thực hiện xong mỗi MacroTask, hàng đợi MicroTask phải được làm trống.
- Đoạn mã đầu tiên của thẻ `<script>` là MacroTask đầu tiên.
- `process.nextTick` có ưu tiên hơn `Promise.then`.

🌰 **Ví dụ**:

```js
console.log(1);

setTimeout(() => {
  console.log(2);
}, 0);

let promise = new Promise((resolve) => {
  console.log(3);
  resolve();
})
  .then(() => {
    console.log(4);
  })
  .then(() => {
    console.log(5);
  });

console.log(6);

// Kết quả: 1 3 6 4 5 2
```

## Môi trường Node

Trong Node, trạng thái vòng lặp sự kiện tương tự như trong trình duyệt. Tuy nhiên, Node có mô hình riêng của mình. Trong Node, vòng lặp sự kiện được thực hiện bởi engine [libuv](https://github.com/libuv/libuv). Chúng ta biết rằng Node chọn Chrome V8 engine làm trình thông dịch JavaScript, V8 engine phân tích mã JavaScript và gọi các API tương ứng từ Node, và các API này cuối cùng được thực thi bởi engine libuv, thực thi các nhiệm vụ tương ứng và đặt các sự kiện khác nhau vào các hàng đợi khác nhau để chờ luồng chính thực thi. Do đó, về thực tế, vòng lặp sự kiện trong Node tồn tại trong engine libuv.

```js
   ┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<──connections───     │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
```

- Dữ liệu đầu vào từ bên ngoài
- Giai đoạn bỏ phiếu (Poll): chờ sự kiện I/O mới, Node có thể bị chặn ở đây trong một số trường hợp đặc biệt
- Giai đoạn kiểm tra (Check): các callback của `setImmediate` được thực hiện ở đây
- Giai đoạn đóng callback (Close Callback)
- Giai đoạn kiểm tra bộ hẹn giờ (Timer): thực hiện các callback trong hàng đợi timer
- Giai đoạn callback I/O (I/O Callbacks): thực hiện hầu hết các callback, ngoại trừ sự kiện `close`, timer và `setImmediate()`
- Giai đoạn rảnh rỗi (Idle Prepare): chỉ được sử dụng nội bộ, không cần quan tâm

Khi một tin nhắn mất quá nhiều thời gian để xử lý, ứng dụng Web sẽ không thể xử lý tương tác của người dùng, ví dụ như nhấp chuột hoặc cuộn. Trình duyệt sử dụng hộp thoại chạy quá lâu để giảm thiểu vấn đề này. Một cách làm tốt là rút ngắn việc xử lý tin nhắn và trong trường hợp có thể, chia một tin nhắn thành nhiều tin nhắn.
