---
title: JS Lexical Scope
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Phạm vi (Scope)

Phạm vi là phạm vi áp dụng của biến (còn được gọi là các định danh), kiểm soát khả năng nhìn thấy của biến.

Phạm vi có hai chế độ chính:

- Phạm vi từ vựng/Phạm vi tĩnh (Lexical Scope)
- Phạm vi động (Dynamic Scope)

JavaScript sử dụng **phạm vi từ vựng** (Lexical Scope), còn được gọi là **phạm vi tĩnh**.

Vì JavaScript sử dụng phạm vi từ vựng, nên phạm vi của một hàm được quyết định khi hàm được định nghĩa.

Trái lại, phạm vi động quyết định phạm vi của một hàm khi hàm được gọi.

## Phạm vi từ vựng/Phạm vi tĩnh

Phần lớn các trình biên dịch ngôn ngữ lập trình tiêu chuẩn có giai đoạn làm việc đầu tiên gọi là **phân từ** (lexicalization) (còn được gọi là phân từ hóa). Quá trình phân từ hóa sẽ kiểm tra các ký tự trong mã nguồn và gán ý nghĩa từ vựng cho từng từ.

Đơn giản nói, phạm vi từ vựng là phạm vi được định nghĩa trong giai đoạn phân từ. Nói cách khác, phạm vi từ vựng được quyết định bởi cách bạn viết mã và đặt biến và phạm vi khối ở đâu, do đó khi trình phân tích từ vựng xử lý mã, nó sẽ giữ nguyên phạm vi.

🌰 **Ví dụ code**:

```js
function foo(a) {
  var b = a * 2;

  function brc(c) {
    console.log(a, b, c);
  }

  bar(b * 3);
}

foo(2); // 2, 4, 12
```

Trong ví dụ này, có ba phạm vi lồng nhau. Để dễ hiểu, bạn có thể tưởng tượng chúng như các bong bóng chứa lồng nhau.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230801191445.png)

- Bong bóng chứa toàn bộ phạm vi toàn cục, chỉ có một định danh: `foo`
- Bong bóng chứa phạm vi được tạo bởi `foo`, có ba định danh: `a`, `bar` và `b`
- Bong bóng chứa phạm vi được tạo bởi `bar`, chỉ có một định danh: `c`

Các bong bóng phạm vi được quyết định bởi vị trí mã tương ứng với phạm vi của chúng. Hãy giả sử rằng mỗi hàm sẽ tạo ra một bong bóng phạm vi mới.  

Bong bóng của `bar` được hoàn toàn chứa trong bong bóng được tạo bởi `foo`, lý do duy nhất là đó là vị trí chúng ta muốn định nghĩa hàm `bar`.

### Tìm kiếm

Cấu trúc của các bong bóng phạm vi và mối quan hệ vị trí giữa chúng cung cấp đủ thông tin vị trí cho trình thông dịch để tìm kiếm vị trí của các định danh.

Trong đoạn mã trước đó, trình thông dịch thực hiện câu lệnh `console.log` và tìm kiếm lần lượt ba biến tham chiếu `a`, `b` và `c`.

- Nó bắt đầu tìm kiếm từ phạm vi nội bộ nhỏ nhất, tức là bong bóng phạm vi của hàm `bar`.
- Trình thông dịch không tìm thấy `a` ở đây, vì vậy nó tiếp tục tìm kiếm ở phạm vi bên ngoài, tức là phạm vi của hàm `foo`. Ở đây, nó tìm thấy `a` và sử dụng tham chiếu này.
- Đối với `b`, cũng tương tự như vậy.
- Đối với `c`, trình thông dịch tìm thấy nó trong phạm vi của `bar`.

Nếu `a` và `c` đều tồn tại trong phạm vi nội bộ của `bar` và `foo`, `console.log` có thể trực tiếp sử dụng biến trong `bar` mà không cần tìm kiếm ở bên ngoài `foo`.

### Che giấu (Shadowing)

**Tìm kiếm phạm vi sẽ dừng lại khi tìm thấy định danh phù hợp đầu tiên**.

Trong các phạm vi lồng nhau, cho phép định nghĩa các định danh có cùng tên được gọi là **hiệu ứng che giấu** (định danh bên trong che giấu định danh bên ngoài).

Bỏ qua hiệu ứng che giấu, tìm kiếm phạm vi luôn bắt đầu từ phạm vi nội bộ nhỏ nhất mà mã đang chạy, tiếp tục tìm kiếm từng cấp phạm vi bên ngoài hoặc cấp phạm vi trên cùng, cho đến khi gặp định danh phù hợp đầu tiên.

Biến toàn cục sẽ tự động trở thành thuộc tính của đối tượng toàn cục (ví dụ: đối tượng Window trong trình duyệt), do đó có thể truy cập biến toàn cục không thông qua tên từ vựng của nó mà thông qua tham chiếu đến thuộc tính của đối tượng toàn cục.

🌰 **Ví dụ**:

```js
window.a;
```

Kỹ thuật này cho phép truy cập vào các biến toàn cục bị che khuất bởi các biến cùng tên. Tuy nhiên, nếu một biến không phải là biến toàn cục bị che khuất, thì không thể truy cập được vào nó dù cho có cách nào đi nữa.

Dù hàm được gọi ở đâu và được gọi như thế nào, phạm vi từ vựng của nó chỉ phụ thuộc vào vị trí nó được định nghĩa.

Tìm kiếm phạm vi từ vựng chỉ tìm kiếm các định danh cấp một, chẳng hạn như `a`, `b` và `c`. Nếu mã tham chiếu đến `foo.bar.baz`, tìm kiếm phạm vi từ vựng chỉ tìm kiếm định danh `foo`, sau đó khi tìm thấy biến này, quy tắc truy cập thuộc tính của đối tượng sẽ tiếp tục tìm kiếm thuộc tính `bar` và `baz`.

## Phạm vi động (Dynamic Scope)

Đặc điểm quan trọng nhất của phạm vi từ vựng là quá trình định nghĩa diễn ra trong giai đoạn viết mã.

> Vậy tại sao lại giới thiệu phạm vi động?

Thực tế, phạm vi động là một cơ chế quan trọng khác của JavaScript, có mối quan hệ gần gũi với cơ chế `this`. Sự nhầm lẫn về phạm vi thường xảy ra do sự nhầm lẫn giữa phạm vi từ vựng và cơ chế `this`.

**Phạm vi động** không quan tâm đến cách hàm và phạm vi được khai báo và được khai báo ở đâu, nó chỉ quan tâm đến nơi chúng được gọi từ đâu.

Nói cách khác, **chuỗi phạm vi** (scope chain) dựa trên **ngăn xếp cuộc gọi** (call stack), chứ không phải trên sự lồng nhau của phạm vi trong mã.

```js
const a = 2;

function foo() {
  console.log(a);
}

function bar() {
  const a = 3;
  foo();
}

bar();
```

- Nếu ở phạm vi từ vựng, biến `a` sẽ được tìm kiếm trước trong hàm `foo`, không tìm thấy. Sau đó, nó sẽ tiếp tục tìm kiếm trong phạm vi toàn cục, tức là phạm vi toàn cầu, và tìm thấy giá trị `2`. Do đó, kết quả trên console là `2`.
- Nếu ở phạm vi động, tương tự, biến `a` sẽ được tìm kiếm trước trong hàm `foo`, không tìm thấy. Ở đây, nó sẽ **theo dõi ngăn xếp cuộc gọi** để tìm kiếm tại điểm gọi hàm `foo`, tức là trong hàm `bar`, và tìm thấy giá trị `3`. Do đó, kết quả trên console là `3`.

Điểm khác biệt giữa hai loại phạm vi này, nói một cách đơn giản, là phạm vi từ vựng được xác định trong quá trình **định nghĩa**, trong khi phạm vi động được xác định trong quá trình **thực thi**.
