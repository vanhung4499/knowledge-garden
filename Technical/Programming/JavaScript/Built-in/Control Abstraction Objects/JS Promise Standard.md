---
title: JS Promise Standard
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-08
date modified: 2023-08-08
---

# Quy tắc Promise/A+

Promise đại diện cho kết quả cuối cùng của một hoạt động bất đồng bộ, và cách tương tác với nó chủ yếu là thông qua phương thức `.then`, phương thức này đăng ký hai hàm gọi lại để nhận giá trị cuối cùng của Promise hoặc lý do không thể thực hiện Promise này.

Quy tắc này chi tiết mô tả quá trình thực thi của phương thức `.then`, tất cả các Promise tuân thủ Quy tắc Promise/A+ đều có thể thực hiện phương thức này dựa trên quy tắc này. Do đó, quy tắc này là rất ổn định. Mặc dù tổ chức Promise/A+ có thể điều chỉnh quy tắc này đôi khi, nhưng chủ yếu là để xử lý các trường hợp biên và các thay đổi này đều nhỏ và tương thích ngược. Nếu chúng ta có ý định thực hiện các cập nhật không tương thích lớn, chúng tôi sẽ cân nhắc, thảo luận chi tiết và kiểm tra nghiêm ngặt trước.

Lịch sử cho thấy, quy tắc này thực tế là chuyển các khuyến nghị từ quy tắc Promise/A trước đây thành quy tắc hành vi: chúng tôi mở rộng các hành vi đã được chấp nhận trong quy tắc gốc và loại bỏ một số trường hợp đặc biệt và các phần gây rối trong quy tắc gốc.

Cuối cùng, quy tắc Promise/A+ tập trung vào cung cấp một phương thức `.then` chung, không thiết kế cách tạo, giải quyết và từ chối Promise. Các phương pháp hoạt động trên Promise sẽ được đề cập trong các quy tắc khác trong tương lai.

## Thuật ngữ quy tắc

- **Thực hiện (fulfill)**: Đề cập đến một loạt các hoạt động được thực hiện khi một Promise thành công, bao gồm thay đổi trạng thái và thực thi các hàm gọi lại. Mặc dù quy tắc sử dụng "fulfill" để chỉ thực hiện, nhưng trong các phiên bản Promise sau này, "resolve" thường được sử dụng để thay thế.
- **Từ chối (reject)**: Đề cập đến một loạt các hoạt động được thực hiện khi một Promise thất bại.
- **Giá trị cuối cùng (eventual value)**: Giá trị cuối cùng được truyền cho hàm gọi lại thực hiện khi Promise được giải quyết. Vì Promise chỉ có một lần thực hiện, khi giá trị này được truyền, nó đánh dấu sự kết thúc của trạng thái chờ đợi của Promise, do đó được gọi là giá trị cuối cùng, đôi khi cũng được gọi là giá trị (value) trực tiếp.
- **Lý do từ chối (reason)**: Cũng gọi là lý do từ chối, đề cập đến giá trị được truyền cho hàm gọi lại từ chối khi Promise bị từ chối.

## Thuật ngữ

- **Promise**: Promise là một đối tượng hoặc hàm có phương thức `.then`, hành vi của nó tuân thủ quy tắc này.
- **thenable**: Là một đối tượng hoặc hàm xác định phương thức `.then`, trong bản dịch này được gọi là "có phương thức `.then`".
- **Giá trị (value)**: Đề cập đến bất kỳ giá trị hợp lệ nào trong JavaScript (bao gồm undefined, thenable và Promise).
- **Ngoại lệ (exception)**: Là giá trị được ném ra bằng cách sử dụng lệnh `throw`.
- **Lý do từ chối (reason)**: Đại diện cho lý do từ chối của một Promise.

## Trạng thái

Trạng thái hiện tại của một Promise phải là một trong ba trạng thái sau: trạng thái chờ đợi (Pending), trạng thái thực hiện (Fulfilled) và trạng thái từ chối (Rejected).

### Trạng thái chờ đợi (Pending)

Khi ở trạng thái chờ đợi, Promise phải đáp ứng các điều kiện sau:

- Có thể chuyển sang trạng thái thực hiện hoặc trạng thái từ chối.

### Trạng thái thực hiện (Fulfilled)

Khi ở trạng thái thực hiện, Promise phải đáp ứng các điều kiện sau:

- Không thể chuyển sang bất kỳ trạng thái nào khác.
- Phải có một giá trị cuối cùng không thể thay đổi.

### Trạng thái từ chối (Rejected)

Khi ở trạng thái từ chối, Promise phải đáp ứng các điều kiện sau:

- Không thể chuyển sang bất kỳ trạng thái nào khác.
- Phải có một lý do từ chối không thể thay đổi.

Ở đây, không thể thay đổi có nghĩa là không thể thay đổi bằng phép so sánh (sử dụng `===`), không phải là không thể thay đổi sâu hơn (chỉ yêu cầu địa chỉ tham chiếu giống nhau, nhưng giá trị thuộc tính có thể thay đổi).

## Phương thức then

Một Promise phải cung cấp một phương thức `then` để truy cập vào **giá trị hiện tại**, **giá trị cuối cùng** và **lý do từ chối** của nó.

Phương thức then của Promise nhận hai tham số:

```js
Promise.then(onFulfilled, onRejected);
```

### Tham số tùy chọn

Cả onFulfilled và onRejected đều là tham số tùy chọn.

- Nếu onFulfilled không phải là một hàm, nó phải được bỏ qua.
- Nếu onRejected không phải là một hàm, nó phải được bỏ qua.

### Thuộc tính onFulfilled

Nếu onFulfilled là một hàm:

- Nó phải được gọi sau khi Promise kết thúc thực thi, với tham số đầu tiên là giá trị cuối cùng của Promise.
- Nó không được gọi trước khi Promise kết thúc thực thi.
- Nó chỉ được gọi một lần.

### Thuộc tính onRejected

Nếu onRejected là một hàm:

- Nó phải được gọi sau khi Promise bị từ chối thực thi, với tham số đầu tiên là lý do từ chối của Promise.
- Nó không được gọi trước khi Promise bị từ chối thực thi.
- Nó chỉ được gọi một lần.

### Thời điểm gọi

onFulfilled và onRejected chỉ được gọi khi ngăn xếp thực thi chỉ chứa mã nguồn của nền tảng. [Chú thích 1](#chú-thích-1)

### Yêu cầu gọi

onFulfilled và onRejected phải được gọi như là một hàm (nghĩa là không có giá trị this). [Chú thích 2](#chú-thích-2)

### Gọi nhiều lần

Phương thức `then` có thể được gọi nhiều lần trên cùng một Promise

- Khi Promise thực thi thành công, tất cả các onFulfilled phải được gọi theo thứ tự đăng ký của chúng.
- Khi Promise bị từ chối thực thi, tất cả các onRejected phải được gọi theo thứ tự đăng ký của chúng.

### Trả về

Phương thức `then` phải trả về một đối tượng Promise. [Chú thích 3](#chú-thích-3)

```js
promise2 = promise1.then(onFulfilled, onRejected);
```

- Nếu onFulfilled hoặc onRejected trả về một giá trị `x`, thì quá trình giải quyết Promise sẽ được chạy như sau: `[[Resolve]](Promise2, x)`
- Nếu onFulfilled hoặc onRejected ném ra một ngoại lệ `e`, thì promise2 phải bị từ chối và trả về lý do từ chối `e`
- Nếu onFulfilled không phải là một hàm và promise1 thực thi thành công, promise2 phải được thực thi thành công và trả về cùng một giá trị.
- Nếu onRejected không phải là một hàm và promise1 bị từ chối thực thi, promise2 phải bị từ chối và trả về cùng một lý do.

**Chú thích của người dịch**: Hiểu phần "trả về" trên là rất quan trọng, tức là: **Dù promise1 bị từ chối hay được giải quyết, promise2 đều sẽ được giải quyết, chỉ khi có ngoại lệ mới bị từ chối.**

## Quy trình giải quyết

**Quy trình giải quyết Promise** là một hoạt động trừu tượng, nhận đầu vào là một Promise và một giá trị, chúng ta ký hiệu là `[[Resolve]](Promise, x)`. Nếu `x` có phương thức `then` và có vẻ giống một Promise, quy trình giải quyết sẽ cố gắng làm cho Promise chấp nhận trạng thái của `x`; nếu không, nó sẽ thực thi Promise với giá trị của `x`.

Tính năng thenable này làm cho việc triển khai Promise trở nên linh hoạt hơn: chỉ cần nó tiết lộ một phương thức `then` tuân theo giao thức Promise/A+, và điều này cũng cho phép triển khai tuân theo quy tắc Promise/A+ có thể hoạt động tốt với các triển khai không tuân theo quy tắc nhưng vẫn có thể sử dụng được.

Quy trình `[[Resolve]](Promise, x)` được thực hiện theo các bước sau:

### X bằng Promise

Nếu `Promise` và `x` trỏ đến cùng một đối tượng, Promise sẽ bị từ chối với lý do là TypeError.

### X là một Promise

Nếu `x` là một Promise, Promise sẽ chấp nhận trạng thái của `x` [Chú thích 4](#chú-thích-4):

- Nếu `x` đang ở trạng thái chờ đợi, Promise sẽ duy trì trạng thái chờ đợi cho đến khi `x` được thực thi hoặc từ chối.
- Nếu `x` đang ở trạng thái thực thi, Promise sẽ được thực thi với cùng một giá trị.
- Nếu `x` đang ở trạng thái từ chối, Promise sẽ bị từ chối với cùng một lý do.

### X là một đối tượng hoặc hàm

Nếu `x` là một đối tượng hoặc hàm:

- Gán `x.then` cho `then` [Chú thích 5](#chú-thích-5).
- Nếu việc truy cập vào `x.then` gây ra lỗi `e`, Promise sẽ bị từ chối với lý do là `e`.
- Nếu `then` là một hàm, gọi nó với `x` là giá trị `this` của hàm. Truyền hai hàm gọi lại làm tham số, hàm đầu tiên được gọi là `resolvePromise`, hàm thứ hai được gọi là `rejectPromise`:
  - Nếu `resolvePromise` được gọi với giá trị `y`, thực hiện [[Resolve]](Promise, y).
  - Nếu `rejectPromise` được gọi với lý do từ chối `r`, từ chối Promise với lý do `r`.
  - Nếu cả `resolvePromise` và `rejectPromise` đã được gọi, hoặc đã được gọi nhiều lần với cùng một tham số, chỉ sử dụng lần gọi đầu tiên và bỏ qua các lần gọi còn lại.
  - Nếu việc gọi phương thức `then` gây ra ngoại lệ `e`:
    - Nếu `resolvePromise` hoặc `rejectPromise` đã được gọi, bỏ qua ngoại lệ.
    - Nếu không, từ chối Promise với lý do là `e`.
  - Nếu `then` không phải là một hàm, thực thi Promise với giá trị `x`.
- Nếu `x` không phải là một đối tượng hoặc hàm, thực thi Promise với giá trị `x`.

Nếu một Promise được giải quyết bởi một chuỗi thenable trong một vòng lặp và `[[Resolve]](Promise, thenable)` được gọi đệ quy, điều này có thể dẫn đến vòng lặp vô hạn. Mặc dù quy tắc không yêu cầu điều này, nhưng nó khuyến khích triển khai kiểm tra xem liệu vòng lặp vô hạn như vậy có tồn tại hay không, và nếu phát hiện, từ chối Promise với lý do TypeError có thể nhận biết được [Chú thích 6](#chú-thích-6).

## Chú thích

### Chú thích 1

Ở đây, **mã nguồn nền tảng** đề cập đến trình duyệt, môi trường và mã triển khai của Promise. Trong thực tế, cần đảm bảo rằng các hàm onFulfilled và onRejected được thực thi bất đồng bộ và nên được thực thi trong một ngăn xếp thực thi mới sau vòng lặp sự kiện mà phương thức then được gọi. Hàng đợi sự kiện này có thể được triển khai bằng cơ chế **macro-task** hoặc **micro-task**. Vì mã triển khai của Promise chính nó là mã nguồn nền tảng (JavaScript), nó có thể đã bao gồm một hàng đợi lập lịch nhiệm vụ khi xử lý các tác vụ.

**Chú thích của người dịch**: Ở đây đề cập đến hai khái niệm `macrotask` và `microtask`, đây là hai loại phân loại công việc bất đồng bộ. Khi một tác vụ bất đồng bộ được lên lịch, trình duyệt sẽ phân loại tất cả các tác vụ thành hai hàng đợi này, trước tiên lấy ra tác vụ đầu tiên trong hàng đợi `macrotask` (đôi khi còn được gọi là hàng đợi `task queue`), thực hiện xong rồi mới lấy ra tất cả các tác vụ trong hàng đợi `microtask` và thực hiện chúng theo thứ tự; sau đó lại lấy tác vụ trong hàng đợi `macrotask`, và lặp lại quá trình này cho đến khi cả hai hàng đợi đều rỗng.

Cụ thể, phân loại công việc như sau:

- **macro-task**: script (toàn bộ mã), `setTimeout`, `setInterval`, `setImmediate`, I/O, UI rendering
- **micro-task**: process.nextTick, Promise (Promise nguyên gốc được cài đặt trong trình duyệt), Object.observe, MutationObserver

### Chú thích 2

Trong chế độ nghiêm ngặt (`strict`), giá trị `this` của hàm sẽ là `undefined`; trong chế độ không nghiêm ngặt, giá trị `this` sẽ là đối tượng toàn cục.

### Chú thích 3

Các triển khai có thể cho phép `promise2 === promise1` nếu đáp ứng tất cả các yêu cầu. Mỗi triển khai phải có tài liệu mô tả liệu liệu nó cho phép và trong trường hợp nào `promise2 === promise1` được phép.

### Chú thích 4

Nói chung, chỉ khi `x` đáp ứng các yêu cầu của triển khai hiện tại, chúng ta mới coi nó là một Promise thực sự. Quy tắc này cho phép các triển khai đặc biệt chấp nhận trạng thái của Promise mà đáp ứng các yêu cầu đã biết.

### Chú thích 5

Ở bước này, chúng ta lưu trữ một tham chiếu đến `x.then`, sau đó kiểm tra và gọi tham chiếu đó để tránh truy cập vào thuộc tính `x.then` nhiều lần. Biện pháp phòng ngừa này đảm bảo tính nhất quán của thuộc tính này, vì giá trị của nó có thể thay đổi khi truy xuất.

### Chú thích 6

Triển khai không nên giới hạn độ sâu của chuỗi thenable và cho rằng việc đệ quy vượt quá giới hạn này là một vòng lặp vô hạn. Chỉ khi có sự lặp lại đích thực mới có thể gây ra ngoại lệ TypeError; nếu một chuỗi thenable vô hạn như vậy không có sự lặp lại, việc đệ quy vô hạn là hành vi chính xác.
