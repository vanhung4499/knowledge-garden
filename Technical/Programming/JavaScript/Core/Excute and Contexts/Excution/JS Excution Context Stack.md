---
title: JS Excution Context Stack
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Ngăn xếp ngữ cảnh thực thi

![JS Excution Context Lifecycle.excalidraw](https://raw.githubusercontent.com/vanhung4499/images/master/snap/JS%2520Excution%2520Context%2520Lifecycle.excalidraw.png)

Khi chúng ta gọi một hàm (kích hoạt), một ngữ cảnh thực thi mới sẽ được tạo ra.

Vòng đời của một ngữ cảnh thực thi có thể chia thành hai giai đoạn: **giai đoạn tạo** và **giai đoạn thực thi mã**.

**Giai đoạn khởi tạo**: Trong giai đoạn này, ngữ cảnh thực thi sẽ thực hiện các hoạt động sau đây:

- Tạo đối tượng biến
- Thiết lập chuỗi phạm vi
- Xác định đối tượng `this` trỏ đến

**Giai đoạn thực thi mã**: Sau khi hoàn thành giai đoạn tạo, mã sẽ được thực thi và hoàn thành các bước sau đây:

- Gán giá trị biến
- Tham chiếu hàm
- Thực thi mã khác

![Excution Context.excalidraw](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Excution%20Context.excalidraw.png)

## Mã có thể thực thi (Excutable Code)

Mỗi khi bộ điều khiển chuyển đến mã có thể thực thi, một ngữ cảnh thực thi sẽ được tạo ra.

Ngữ cảnh thực thi có thể hiểu là môi trường thực thi của mã hiện tại, nó sẽ tạo thành một phạm vi.

Môi trường chạy JavaScript chủ yếu bao gồm ba trường hợp:

- **Môi trường toàn cục**: Mã JavaScript sẽ trước tiên đi vào môi trường này khi chạy
- **Môi trường hàm**: Khi hàm được gọi để thực thi, nó sẽ vào môi trường hàm hiện tại để thực thi mã
- **eval** (Không khuyến nghị sử dụng, có thể bỏ qua)

Do đó, trong một chương trình JavaScript, sẽ tạo ra nhiều ngữ cảnh thực thi và Trình thông dịch JavaScript sẽ xử lý chúng theo cách của một ngăn xếp, ngăn xếp này được gọi là **ngăn xếp gọi hàm (Call Stack)**. Đáy ngăn xếp luôn là ngữ cảnh toàn cục và đỉnh ngăn xếp là ngữ cảnh đang thực thi hiện tại.

Khi mã đang thực thi, gặp ba trường hợp trên, sẽ tạo ra một ngữ cảnh thực thi và đẩy vào ngăn xếp, và khi ngữ cảnh đang ở đỉnh ngăn xếp hoàn thành, nó sẽ tự động bị đẩy ra khỏi ngăn xếp.

## Phân tích cài đặt ngăn xếp và heap

Trình thông dịch JavaScript sử dụng **ngăn xếp ngữ cảnh thực thi (Execution Context Stack, ECS)** để quản lý các ngữ cảnh thực thi.

🎯 Để mô phỏng hành vi của ngăn xếp ngữ cảnh thực thi, hãy tưởng tượng rằng nó là một mảng.

```js
ECStack = [];
```

Khi JavaScript bắt đầu thực thi mã, điều đầu tiên gặp phải là mã toàn cục, vì vậy khi khởi tạo, một ngữ cảnh thực thi toàn cục sẽ được đẩy vào ngăn xếp ngữ cảnh thực thi, chúng ta sử dụng `globalContext` để đại diện cho nó, và chỉ khi toàn bộ ứng dụng kết thúc, ECStack mới được xóa, vì vậy **trước khi chương trình kết thúc**, ECStack luôn có một `globalContext` ở đáy.

```js
ECStack = [globalContext];
```

Bây giờ JavaScript gặp mã dưới đây:

```js
function fun3() {
  console.log('fun3');
}

function fun2() {
  fun3();
}

function fun1() {
  fun2();
}

fun1();
```

Khi thực thi một hàm, một ngữ cảnh thực thi sẽ được tạo ra và đẩy vào ngăn xếp ngữ cảnh thực thi, khi hàm thực thi xong, ngữ cảnh thực thi của hàm đó sẽ được loại bỏ khỏi ngăn xếp.

Sau khi hiểu được quá trình này, chúng ta hãy xem cách xử lý mã trên:

```js
// fun1()
ECStack.push(<fun1> functionContext);

// fun1 gọi fun2, nên cần tạo ngữ cảnh thực thi cho fun2
ECStack.push(<fun2> functionContext);

// Wow, fun2 còn gọi fun3 nữa!
ECStack.push(<fun3> functionContext);

// fun3 thực thi xong
ECStack.pop();

// fun2 thực thi xong
ECStack.pop();

// fun1 thực thi xong
ECStack.pop();

// JavaScript tiếp tục thực thi mã dưới đây, nhưng ECStack luôn có một globalContext ở đáy
```

Sau khi hiểu rõ quá trình này, chúng ta có thể rút ra một số kết luận về **ngăn xếp ngữ cảnh thực thi**.

- Trình thông dịch JavaScript là đơn luồng
- Thực thi đồng bộ, chỉ có ngữ cảnh thực thi đang ở đỉnh ngăn xếp mới được thực thi, các ngữ cảnh khác phải chờ đợi
- Chỉ có một ngữ cảnh thực thi toàn cục, nó được loại bỏ khỏi ngăn xếp khi trình thông dịch kết thúc
- Số lượng ngữ cảnh thực thi của hàm không có giới hạn
- Mỗi lần gọi một hàm, một ngữ cảnh thực thi mới được tạo ra cho nó, ngay cả khi gọi đệ quy cũng vậy
