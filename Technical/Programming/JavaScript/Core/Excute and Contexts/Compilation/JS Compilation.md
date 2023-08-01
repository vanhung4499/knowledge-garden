---
title: JS Compilation
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Quá trình biên dịch

## Nguyên lý biên dịch

JavaScript là một ngôn ngữ biên dịch. Tuy nhiên, khác với các ngôn ngữ biên dịch truyền thống, JavaScript không được biên dịch trước và kết quả biên dịch không thể được di chuyển trong các hệ thống phân tán.

Trong quá trình biên dịch của ngôn ngữ biên dịch truyền thống, một đoạn mã nguồn sẽ trải qua ba bước, gọi chung là **biên dịch**.

1. Phân tích thành phần / Phân tích từ vựng
2. Phân tích cú pháp
3. Tạo mã

### Phân tích thành phần và phân tích từ vựng

**Phân tích từ vựng** (Tokenizing / Lexing) là quá trình chia nhỏ một chuỗi các ký tự thành các khối mã có ý nghĩa (đối với ngôn ngữ lập trình), các khối mã này được gọi là **đơn vị từ vựng** (Token).

🌰 **Ví dụ mã**:

```js
const a = 2;
```

Đoạn chương trình này thường được chia thành các đơn vị từ vựng sau: `const`, `a`, ` = `, `2`, `;`.

Có thể có sự khác biệt trong việc xem xét xem dấu cách có được coi là một đơn vị từ vựng hay không, điều này phụ thuộc vào việc dấu cách có ý nghĩa trong ngôn ngữ lập trình đó hay không.

Sự khác biệt giữa phân tích thành phần (Tokenizing) và phân tích từ vựng (Lexing) là cách nhận dạng đơn vị từ vựng được thực hiện có trạng thái hay không. Nói một cách đơn giản, nếu trình tạo đơn vị từ vựng trong quá trình xác định xem `a` có phải là một đơn vị từ vựng độc lập hay là một phần của đơn vị từ vựng khác, thì quá trình này được gọi là **phân tích từ vựng**.

### Phân tích cú pháp

**Phân tích cú pháp** (Parsing) là quá trình chuyển đổi luồng đơn vị từ vựng thành một cây biểu diễn cấu trúc ngữ pháp của chương trình. Cây này được gọi là [cây cú pháp trừu tượng](https://zh.wikipedia.org/wiki/%E6%8A%BD%E8%B1%A1%E8%AA%9E%E6%B3%95%E6%A8%B9) (Abstract Syntax Tree, AST), và nó đại diện cho cấu trúc ngữ pháp của chương trình.

### Tạo mã

Quá trình chuyển đổi AST thành mã thực thi được gọi là **tạo mã**. Quá trình này phụ thuộc vào ngôn ngữ, nền tảng mục tiêu, v.v. Tóm lại, có một cách để chuyển đổi AST của `var a = 2;` thành một tập hợp các **hướng dẫn máy** (machine instructions): tạo một biến có tên là `a` (bao gồm việc **cấp phát bộ nhớ** v.v.), và lưu giá trị vào biến `a`.

Qua ba bước trên, trình duyệt có thể chạy mã thực thi mà chúng ta đã tạo ra, ba bước này còn được gọi là **quá trình biên dịch**. Quá trình thực thi mã đã được biên dịch được gọi là **quá trình chạy**.  
Quá trình biên dịch

## Quá trình biên dịch

Các vai trò quan trọng trong quá trình biên dịch:

- **Trình thông dịch**: Chịu trách nhiệm cho quá trình biên dịch và thực thi toàn bộ chương trình JavaScript.
- **Trình biên dịch**: Chịu trách nhiệm cho việc phân tích cú pháp và tạo mã code.
- **Phạm vi**: Chịu trách nhiệm thu thập và duy trì một tập hợp các biến (các định danh) được khai báo và thực hiện một tập hợp các quy tắc rất nghiêm ngặt để xác định quyền truy cập của mã hiện tại đối với các định danh này.

### Chi tiết quá trình biên dịch

```js
const a = 2;
```

Dựa trên những gì đã trình bày ở trên, trình biên dịch sẽ đầu tiên phân tích câu lệnh này thành các đơn vị từ vựng, sau đó phân tích các đơn vị từ vựng này thành một cấu trúc cây (AST). Tuy nhiên, khi trình biên dịch bắt đầu tạo mã, cách xử lý câu lệnh này sẽ khác so với dự kiến.

Khi chúng ta nhìn vào đoạn mã này và mô tả nó bằng mã giả với người khác, có thể mô tả như sau: Cấp phát bộ nhớ cho một biến và đặt tên biến là `a`, sau đó lưu giá trị `2` vào biến (bộ nhớ) này.

Tuy nhiên, điều này không hoàn toàn chính xác.

Thực tế, trình biên dịch sẽ thực hiện các thao tác sau:

1. Khi quá trình thực thi gặp `var a`, trình biên dịch sẽ hỏi phạm vi xem đã có một biến có tên này tồn tại trong tập hợp các biến của phạm vi hiện tại chưa. Nếu có, trình biên dịch sẽ bỏ qua khai báo này và tiếp tục biên dịch; nếu không, nó sẽ yêu cầu phạm vi khai báo một biến mới với tên `a` trong tập hợp biến của phạm vi hiện tại.
2. Tiếp theo, trình biên dịch sẽ tạo mã cần thiết cho trình thông dịch để xử lý phép gán `a = 2`. Khi thực thi, trình thông dịch sẽ đầu tiên hỏi phạm vi xem trong tập hợp biến của phạm vi hiện tại có một biến có tên là `a` không. Nếu có, trình thông dịch sẽ sử dụng biến này; nếu không, trình thông dịch sẽ tiếp tục tìm kiếm biến này.

Tóm lại:

- Trình biên dịch khai báo biến trong phạm vi (nếu chưa có).
- Trình thông dịch tìm kiếm biến khi thực thi mã, nếu biến này có trong phạm vi thì thực hiện phép gán.

Trong bước thứ hai ở trên, trình thông dịch sẽ thực hiện truy vấn LHS cho biến `a`. Tuy nhiên, cũng có một loại truy vấn RHS.

> Vậy LHS và RHS truy vấn là gì?

Ở đây, L đại diện cho bên trái, R đại diện cho bên phải. Một cách diễn giải không chính xác nhưng dễ hiểu về LHS và RHS là: **Khi biến xuất hiện ở phía trái của phép gán, chúng ta thực hiện truy vấn LHS, khi biến xuất hiện ở phía phải, chúng ta thực hiện truy vấn RHS**.

Tuy nhiên, mô tả LHS và RHS chỉ là "trái" và "phải" của phép gán không hoàn toàn chính xác.

Phép gán cũng có một số dạng khác, vì vậy trong khái niệm, tốt nhất là hiểu rằng **mục tiêu của phép gán là gì** (LHS) và **nguồn của phép gán là gì** (RHS).

Từ góc độ này, RHS không phải là "phía phải của phép gán" mà chính xác hơn là "không phải là phía trái". Do đó, chúng ta có thể hiểu RHS là Retrieve his source value (lấy giá trị nguồn của nó), điều này có nghĩa là "lấy giá trị của biến nào đó".

Hãy xem xét đoạn mã sau để hiểu rõ hơn về LHS và RHS.

```js
function foo(a) {
  console.log(a);
}

foo(2);
```

- Trong `console.log(a)`, tham chiếu biến `a` là một tham chiếu RHS, vì chúng ta đang lấy giá trị của `a` và truyền giá trị này cho phương thức `console.log(…)`.
- Trái lại, ví dụ: `a = 2`, khi gọi `foo(2)`, phép gán này được thực hiện một cách ngầm định. Ở đây, tham chiếu đến `a` là một tham chiếu LHS, vì chúng ta thực sự không quan tâm giá trị hiện tại của `a` là gì, chỉ cần tìm một mục tiêu cho phép gán `=2`.

LHS và RHS không chỉ xuất hiện một lần trong đoạn mã trên:

```js
function foo(a) {
  // Đây là một tham chiếu LHS ngầm định đến tham số hình thức a.
  
  // Đây là một tham chiếu RHS đến phương thức log(), kiểm tra xem đối tượng console có phương thức log() hay không.
  // Đây là một tham chiếu RHS đến biến a bên trong phương thức log(a), lấy giá trị của a.
  console.log(a);
  // 2
}

// Gọi foo() ở đây, cần thực hiện một tham chiếu RHS đến foo. Điều này có nghĩa là "hãy tìm giá trị của foo và trả về cho tôi".
foo(2);
```

Cần lưu ý rằng chúng ta thường chuyển đổi khai báo hàm `function foo(a) {…}` thành một phép gán biến thông thường (`var foo = function(a) {…}`), nếu hiểu theo cách này, hàm được khai báo sẽ trở thành một truy vấn LHS và gán giá trị cho `foo`, nhưng có một sự khác biệt nhỏ. Trình biên dịch có thể xử lý khai báo và định nghĩa giá trị cùng một lúc trong quá trình tạo mã, ví dụ khi thực thi mã, không có một luồng riêng biệt để "gán một giá trị cho" `foo`, do đó, hiểu hàm được khai báo là một truy vấn LHS và gán giá trị không phù hợp với việc thảo luận trước đây về LHS và RHS.

> 💡 Tóm lại, phạm vi là một tập hợp các **quy tắc tìm kiếm** (lưu ý từ này là **quy tắc**, không phải **quyền truy cập**) cho các định danh (biến) được khai báo. Khi thực thi mã, trình biên dịch thực hiện truy vấn LHS và RHS dựa trên mục đích tìm kiếm (LHS, RHS). Quy tắc tìm kiếm này xác định nơi mà định danh nằm (phạm vi hiện tại, phạm vi cha hoặc phạm vi toàn cục) và cách thức tìm kiếm (LHS, RHS).
