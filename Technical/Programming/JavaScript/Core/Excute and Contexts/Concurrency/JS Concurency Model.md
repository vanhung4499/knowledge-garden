---
title: JS Concurency Model
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-03
date modified: 2023-08-03
---

# Mô hình đồng thời

## Giải thích thuật ngữ

Trước khi hiểu về cơ chế đơn luồng và không chặn của JavaScript, hãy hiểu một số cặp thuật ngữ dễ nhầm lẫn.

Khái niệm và mối quan hệ giữa tiến trình và luồng:

- **Tiến trình (Process)**: Tiến trình là đơn vị phân phối và lập lịch tài nguyên hệ thống. Một chương trình đang chạy tương ứng với một tiến trình. Một tiến trình bao gồm chương trình đang chạy và bộ nhớ và tài nguyên hệ thống mà chương trình sử dụng.
- **Luồng (Thread)**: Luồng là người thực hiện trong một tiến trình, một tiến trình ít nhất có một luồng (luồng chính), cũng có thể có nhiều luồng.

Khái niệm về song song và đồng thời:

- **Song song (Parallelism)**: Đề cập đến trạng thái chạy của chương trình, trong đó có nhiều công việc đang được thực hiện cùng một lúc trong cùng một thời điểm. Vì một luồng chỉ có thể xử lý một công việc trong cùng một thời điểm, nên để có song song, cần có nhiều luồng thực hiện nhiều công việc cùng một lúc.
- **Đồng thời (Concurrency)**: Đề cập đến cấu trúc thiết kế của chương trình, trong đó nhiều công việc có thể được xử lý xen kẽ với nhau trong cùng một khoảng thời gian. Điểm chính là chỉ có một công việc được thực hiện tại một thời điểm nhưng nhiều công việc có thể được chuyển đổi và xử lý xen kẽ với nhau.

Khái niệm về chặn và không chặn:

- **Chặn (Blocking)**: Chặn đề cập đến việc một luồng bị treo trong quá trình chờ đợi (tài nguyên CPU được phân bổ cho nơi khác)
- **Không chặn (Non-blocking)**: Không chặn chỉ ra rằng trong quá trình chờ đợi, tài nguyên CPU vẫn ở trong luồng này và luồng có thể làm những công việc khác.

Tiếp theo là phân biệt giữa đơn luồng và đa luồng:

- **Đơn luồng (Single-threaded)**: Thực hiện từ đầu đến cuối, thực thi từng dòng lệnh. Nếu một dòng mã gặp lỗi, các dòng mã còn lại sẽ không được thực thi nữa. Đồng thời, có nguy cơ bị chặn mã.
- **Đa luồng (Multi-threaded)**: Môi trường chạy mã khác nhau, các luồng độc lập và không ảnh hưởng lẫn nhau, tránh tình trạng bị chặn.

Cuối cùng là phân biệt giữa đồng bộ và bất đồng bộ:

- **Đồng bộ (Synchronous)**: Khi một cuộc gọi được thực hiện, nó sẽ chờ đợi cho đến khi kết quả trả về trước khi tiếp tục thực hiện các công việc khác. Nghĩa là cuộc gọi đồng bộ sẽ chờ đợi kết quả trước khi tiếp tục thực hiện các công việc khác.
- **Bất đồng bộ (Asynchronous)**: Khi một cuộc gọi được thực hiện, nó không chờ đợi kết quả trả về và tiếp tục thực hiện các công việc khác. Kết quả của cuộc gọi sẽ được xử lý sau khi nó hoàn thành.

## Môi trường thực thi

JavaScript thường chạy trong môi trường trình duyệt, cụ thể là thông qua trình duyệt để phân tích cú pháp và thực thi mã.

### Luồng trình duyệt

Hiện nay, các trình duyệt phổ biến nhất là Chrome, IE, Safari, Firefox và Opera. Nhân của trình duyệt là đa luồng, thường bao gồm các nhóm luồng sau:

- **Luồng hiển thị (Rendering Engine Thread)**: Đảm nhận việc hiển thị trang web.
- **Luồng JavaScript Engine (JavaScript Engine Thread)**: Đảm nhận việc phân tích và thực thi mã JavaScript.
- **Luồng kích hoạt định thời (Timer Trigger Thread)**: Xử lý các sự kiện định thời như `setTimeout`, `setInterval`.
- **Luồng kích hoạt sự kiện trình duyệt (Browser Event Trigger Thread)**: Xử lý các sự kiện DOM.
- **Luồng yêu cầu HTTP bất đồng bộ (Asynchronous HTTP Request Thread)**: Xử lý các yêu cầu HTTP không đồng bộ.

⚠️ Lưu ý rằng luồng hiển thị và luồng JavaScript Engine là <strong style="color: red">loại trừ lẫn nhau</strong>. Khi luồng trình duyệt đang thực thi một tác vụ, luồng JavaScript Engine sẽ bị đình chỉ. Điều này xảy ra vì JavaScript có thể tương tác với DOM và nếu JavaScript thay đổi DOM trong quá trình hiển thị, trình duyệt có thể không biết phản ứng ra sao.

### JavaScript Engine

Thường thì khi nói đến trình duyệt, chúng ta nói về hai thành phần cốt lõi của trình duyệt: **Động cơ hiển thị** (Rendering Engine) và **Trình thông dịch JavaScript** (JavaScript Interpreter).

| Trình duyệt       | Động cơ hiển thị     | Trình thông dịch JavaScript (Engine)     |
|:----------------- |:-------------------- |:---------------------------------------- |
| Chrome            | Webkit => Blink      | V8                                       |
| Safari            | Webkit               | Nitro                                    |
| Firefox           | Gecko                | SpiderMonky / TraceMonkey / JaegerMonkey |
| Opera             | Presto => Blink      | Linear A / Linear B / Futhark / Carakan  |
| Internet Explorer | Trident => EdgeHTML  | JScript / Chakra (9+)                    |
| Edge              | EdgeHTML => Chromium | Chakra                                   |

> Chú ý: Webkit engine bao gồm trình định dạng WebCore và trình phân tích cú pháp JavaScript Core.

Các động cơ hiển thị khác nhau thực hiện cùng một tác vụ với cách thức khác nhau, điều này dẫn đến vấn đề tương thích về kiểu dáng của trình duyệt.

Trình thông dịch JavaScript có thể coi là máy ảo JavaScript, chịu trách nhiệm phân tích và thực thi mã JavaScript. Giai đoạn biên dịch được giải thích chi tiết ở [[JS Compilation]].

## Đơn luồng

JavaScript là đơn luồng, điều này liên quan đến mục đích sử dụng của nó. Là một ngôn ngữ kịch bản trong trình duyệt, mục đích chính của JavaScript là tương tác với người dùng và thao tác DOM. Điều này quyết định JavaScript chỉ có thể là đơn luồng, nếu không sẽ gây ra vấn đề đồng bộ phức tạp. Ví dụ, giả sử JavaScript có nhiều luồng cùng một lúc, một luồng đang thêm nội dung vào một nút DOM, một luồng khác xóa nút đó, lúc này trình duyệt sẽ không biết luồng nào là đúng.

Vì vậy, để tránh sự phức tạp, từ khi ra đời, môi trường thực thi JavaScript đã được thiết kế là đơn luồng, và điều này đã trở thành đặc điểm cốt lõi của ngôn ngữ này và sẽ không thay đổi trong tương lai.

Để tận dụng khả năng tính toán đa nhân CPU, HTML5 đã đưa ra tiêu chuẩn Web Worker, cho phép mã JavaScript tạo ra nhiều luồng, nhưng các luồng con hoàn toàn bị kiểm soát bởi luồng chính và không được phép thao tác DOM. Vì vậy, tiêu chuẩn mới này không thay đổi bản chất đơn luồng của JavaScript.

⚠️ **Lưu ý**: Cần lưu ý rằng đơn luồng trong JavaScript chỉ đề cập đến một luồng thực thi JavaScript duy nhất trong một tiến trình chương trình (trong môi trường trình duyệt, tiến trình này là tiến trình trình duyệt), chỉ có một đoạn mã JavaScript được thực thi trong cùng một thời điểm. Cơ chế bất đồng bộ được thực hiện bởi hai hoặc nhiều luồng cố định trong môi trường chạy.

## Hàng đợi công việc

Các tác vụ trong JavaScript có thể được chia thành hai loại:

- **Tác vụ đồng bộ (Synchronous Task)**: Tác vụ đồng bộ được gọi trên luồng chính và phải chờ đợi cho đến khi kết quả trả về trước khi tiếp tục thực hiện các tác vụ khác.
- **Tác vụ bất đồng bộ (Asynchronous Task)**: Tác vụ bất đồng bộ được gọi trên luồng chính và tiếp tục thực hiện các tác vụ khác trong khi chờ kết quả. Khi tác vụ bất đồng bộ đã sẵn sàng, nó sẽ được đẩy vào hàng đợi công việc (Task Queue), và khi luồng chính trống rỗng, trình thông dịch JavaScript sẽ thực hiện một vòng lặp sự kiện (Event Loop) để đẩy tác vụ từ hàng đợi công việc vào luồng chính để thực thi.

Cụ thể về cơ chế thực thi bất đồng bộ như sau:

1. Tất cả các tác vụ đồng bộ và bất đồng bộ được thực thi trên luồng chính theo [[JS Compilation#Nguyên lý biên dịch|nguyên lý biên dịch]] và tạo ra một [[JS Excution Context Stack|ngăn xếp ngữ cảnh thực thi]](Execution Context Stack).
2. Khi tất cả các tác vụ đồng bộ hoàn thành và trả về kết quả, chúng sẽ rời khỏi ngăn xếp ngữ cảnh thực thi.
3. Các tác vụ bất đồng bộ sẽ thực hiện một phần trên luồng chính, rồi rời khỏi ngăn xếp ngữ cảnh thực thi và tiếp tục thực hiện trên luồng đặc biệt của môi trường thực thi.
4. Khi tác vụ bất đồng bộ đã sẵn sàng, nó sẽ được đẩy vào hàng đợi công việc và chờ đợi.
5. Khi ngăn xếp ngữ cảnh thực thi trên luồng chính trống rỗng, trình thông dịch JavaScript sẽ thực hiện một vòng lặp sự kiện để lấy tác vụ từ hàng đợi công việc và đưa vào ngăn xếp ngữ cảnh thực thi trên luồng chính để thực thi.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230803001555.png)

Để hình dung trực quan hơn, hãy xem video sau: [What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ)
