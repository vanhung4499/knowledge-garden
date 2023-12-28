---
title: What Is TypeScript
tags:
  - ts
categories: 
date created: 2023-12-28
date modified: 2023-12-28
---

# TypeScript là gì

> Typed JavaScript at Any Scale.  
> JavaScript có hệ thống kiểu dữ liệu, phù hợp với mọi quy mô dự án.

Đây là định nghĩa của TypeScript trên trang web chính thức.

Nó nhấn mạnh hai tính năng quan trọng nhất của TypeScript - hệ thống kiểu dữ liệu và phù hợp với mọi quy mô.

## Các tính năng của TypeScript

### Hệ thống kiểu dữ liệu

Từ tên gọi của TypeScript, chúng ta có thể thấy "Type" là tính năng quan trọng nhất của nó.

Chúng ta biết rằng JavaScript là một ngôn ngữ lập trình rất linh hoạt:

- Nó không có ràng buộc kiểu dữ liệu, một biến có thể được khởi tạo là chuỗi và sau đó lại được gán giá trị là số.
- Do sự tồn tại của việc chuyển đổi kiểu ngầm định, việc xác định kiểu của một biến trước khi chạy sẽ gặp khó.
- Lập trình hướng đối tượng dựa trên nguyên mẫu (prototype) cho phép thuộc tính hoặc phương thức trên nguyên mẫu có thể được thay đổi trong quá trình chạy.
- Hàm trong JavaScript, có thể gán cho biến, truyền vào làm tham số hoặc trả về giá trị.

Sự linh hoạt này giống như một con dao hai lưỡi, một mặt là làm cho JavaScript phát triển mạnh mẽ, không có gì là không thể, từ năm 2013 đến nay, JavaScript luôn giữ vị trí đầu tiên trong bảng xếp hạng ngôn ngữ lập trình phổ biến nhất. Mặt khác, nó cũng làm cho chất lượng mã nguồn JavaScript không đồng đều, chi phí bảo trì cao và nhiều lỗi xảy ra trong quá trình chạy.

Hệ thống kiểu dữ liệu của TypeScript, đáng chú ý là phần lớn khắc phục nhược điểm của JavaScript.

#### TypeScript là kiểu tĩnh

Hệ thống kiểu dữ liệu được phân loại dựa trên "thời điểm kiểm tra kiểu dữ liệu", có thể chia thành kiểu động (dynamic typing) và kiểu tĩnh (static typing).

Kiểu động là kiểu dữ liệu chỉ được kiểm tra khi chạy, các lỗi kiểu dữ liệu trong loại ngôn ngữ này thường dẫn đến lỗi chạy (runtime error). JavaScript là một ngôn ngữ thông dịch, không có giai đoạn biên dịch, vì vậy nó là kiểu động, đoạn mã sau chỉ báo lỗi khi chạy:

```js
let foo = 1;
foo.split(' ');
// Uncaught TypeError: foo.split is not a function
// Runtime Error (foo.split không phải là một hàm)
```

Kiểu tĩnh là kiểu dữ liệu được xác định từ giai đoạn biên dịch, lỗi kiểu dữ liệu trong loại ngôn ngữ này thường dẫn đến lỗi cú pháp (syntax error). TypeScript cần được biên dịch thành JavaScript trước khi chạy, và kiểm tra kiểu dữ liệu trong giai đoạn biên dịch, vì vậy **TypeScript là kiểu tĩnh**, đoạn mã TypeScript sau sẽ báo lỗi trong giai đoạn biên dịch:

```ts
let foo = 1;
foo.split(' ');
// Property 'split' does not exist on type 'number'.
// Compile Error (number không có phương thức split), không thể biên dịch thành công
```

Bạn có thể thấy rằng đoạn mã TypeScript này không khác gì JavaScript.

Đúng! Hầu hết mã JavaScript chỉ cần được sửa đổi một chút (hoặc không cần sửa đổi hoàn toàn) để trở thành mã TypeScript, điều này nhờ vào tính năng mạnh mẽ của TypeScript về **suy luận kiểu dữ liệu**, ngay cả khi không khai báo kiểu cho biến `foo`, nó cũng có thể tự động suy luận ra kiểu `number`.

Mã TypeScript đầy đủ như sau:

```ts
let foo: number = 1;
foo.split(' ');
// Property 'split' does not exist on type 'number'.
// Compile Error (number không có phương thức split), không thể biên dịch thành công
```

#### TypeScript là kiểu yếu

Hệ thống kiểu dữ liệu được phân loại dựa trên "có cho phép chuyển đổi kiểu ngầm định hay không", có thể chia thành kiểu mạnh (strong typing) và kiểu yếu (weak typing).

Đoạn mã sau có thể chạy đúng cả trong JavaScript và TypeScript, trong quá trình chạy, số `1` sẽ được chuyển đổi kiểu ngầm định thành chuỗi `'1'`, dấu cộng `+` được nhận dạng là phép nối chuỗi, vì vậy kết quả in ra là chuỗi `'11'`.

```js
console.log(1 + '1');
// In ra chuỗi '11'
```

TypeScript hoàn toàn tương thích với JavaScript, nó không thay đổi các tính năng chạy của JavaScript, vì vậy **cả hai đều là kiểu yếu**.

So sánh với nó, Python là kiểu mạnh, đoạn mã sau sẽ báo lỗi khi chạy:

```python
print(1 + '1')
# TypeError: unsupported operand type(s) for +: 'int' and 'str'
```

Để sửa lỗi này, bạn cần chuyển đổi kiểu mạnh:

```python
print(str(1) + '1')
# In ra chuỗi '11'
```

> Kiểu mạnh/kiểu yếu là tương đối, Python khi cộng số nguyên và số thực sẽ chuyển đổi kiểu ngầm định từ số nguyên sang số thực, nhưng điều này không ảnh hưởng đến kết luận Python là kiểu mạnh, vì hầu hết các trường hợp Python không thực hiện chuyển đổi kiểu ngầm định. Trái lại, trong JavaScript và TypeScript, bất kể kiểu của hai toán hạng của dấu cộng là gì, nó đều có thể tính toán một kết quả - thay vì báo lỗi - điều này chứng tỏ JavaScript và TypeScript đều là kiểu yếu.

> Mặc dù TypeScript không giới hạn kiểu của hai toán hạng của dấu cộng, nhưng chúng ta có thể sử dụng hệ thống kiểu của TypeScript và chức năng kiểm tra mã nguồn của ESLint để giới hạn hai toán hạng phải cùng là số hoặc cùng là chuỗi. Điều này một phần làm cho TypeScript gần hơn với "kiểu mạnh" - tất nhiên, giới hạn này là tùy chọn.

Hệ thống kiểu như vậy phản ánh triết lý thiết kế cốt lõi của TypeScript. Trên cơ sở bảo toàn hoàn toàn hành vi chạy của JavaScript, thông qua việc giới thiệu hệ thống kiểu tĩnh để nâng cao khả năng bảo trì mã nguồn và giảm thiểu lỗi có thể xảy ra.

### Phù hợp với mọi quy mô

TypeScript rất phù hợp với các dự án lớn - điều này rõ ràng, hệ thống kiểu dữ liệu có thể mang lại tính bảo trì cao hơn và ít lỗi hơn cho các dự án lớn.

Trong các dự án nhỏ và trung bình, việc triển khai TypeScript gặp phải rào cản lớn nhất là cho rằng việc sử dụng TypeScript đòi hỏi viết thêm mã, làm giảm hiệu suất phát triển. Nhưng thực tế, với tính năng **suy luận kiểu dữ liệu**, hầu hết các kiểu không cần khai báo thủ công. Ngược lại, TypeScript cung cấp các tính năng mở rộng cho IDE, bao gồm hoàn thành mã (auto-complete), điều hướng đến định nghĩa, tái cấu trúc mã (formating), vv., Điều này tăng đáng kể hiệu suất phát triển. Hơn nữa, TypeScript có hàng trăm **tùy chọn biên dịch**, nếu bạn cho rằng kiểm tra kiểu quá nghiêm ngặt, bạn có thể giảm tiêu chuẩn kiểm tra kiểu bằng cách thay đổi các tùy chọn biên dịch.

TypeScript cũng có thể chung sống với JavaScript. Điều này có nghĩa là nếu bạn có một dự án cũ được phát triển bằng JavaScript và muốn sử dụng các tính năng của TypeScript, bạn không cần phải chuyển toàn bộ dự án sang TypeScript ngay lập tức. Bạn có thể viết các tệp mới bằng TypeScript và dần dần chuyển đổi các tệp cũ trong các bản cập nhật tiếp theo. Nếu chi phí chuyển đổi một số tệp JavaScript quá cao, TypeScript cũng cung cấp một giải pháp cho phép bạn viết **tệp khai báo kiểu** mà không cần sửa đổi các tệp JavaScript, từ đó thực hiện việc chuyển đổi dần dần cho dự án cũ.

Thực tế cho thấy, ngay cả khi bạn chưa học TypeScript bao giờ, bạn cũng có thể đã sử dụng TypeScript mà không hề biết - khi bạn viết mã JavaScript trong trình biên tập VSCode, các tính năng như hoàn thành mã và gợi ý giao diện được cung cấp bởi TypeScript Language Service:

![vscode](https://raw.githubusercontent.com/vanhung4499/images/master/snap/what-is-typescript-vscode.png)

Một số thư viện bên thứ ba hỗ trợ TypeScript ngay từ đầu, vì vậy bạn có thể nhận được tính năng hoàn thành mã ngay khi sử dụng chúng, ví dụ như Vue 3.0:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20231228184329.png)

Một số thư viện bên thứ ba không hỗ trợ TypeScript từ đầu, nhưng bạn có thể nhận được tính năng hoàn thành mã bằng cách cài đặt thư viện khai báo kiểu do cộng đồng duy trì (ví dụ: cài đặt thư viện khai báo kiểu React bằng cách chạy `npm install --save-dev @types/react`), và điều này được hỗ trợ cả trong dự án JavaScript và dự án TypeScript:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20231228184356.png)

Như vậy, sự phát triển của TypeScript đã lan rộng vào mọi khía cạnh của cộng đồng phát triển frontend, và các dự án có mọi quy mô đều được hỗ trợ ít nhiều bởi TypeScript.

### Đồng bộ với tiêu chuẩn

Tính năng quan trọng khác của TypeScript là duy trì đồng bộ với tiêu chuẩn ECMAScript.

ECMAScript là tiêu chuẩn cú pháp JavaScript, kể từ năm 2015, mỗi năm sẽ có một phiên bản mới được phát hành, bao gồm một số cú pháp mới.

Một cú pháp mới từ giai đoạn đề xuất đến trở thành tiêu chuẩn chính thức cần trải qua các giai đoạn sau:

- Giai đoạn 0: Giai đoạn trình bày, chỉ là ý tưởng và thảo luận, chưa được đề xuất chính thức.
- Giai đoạn 1: Giai đoạn thăm dò ý kiến, cung cấp mô tả API trừu tượng, thảo luận về khả năng, thuật toán quan trọng, vv.
- Giai đoạn 2: Giai đoạn bản thảo, mô tả cú pháp và ngữ nghĩa chính thức bằng ngôn ngữ quy định chính thức.
- Giai đoạn 3: Giai đoạn ứng cử viên, công việc thiết kế cú pháp đã hoàn thành, cần hỗ trợ trình duyệt, Node.js và thu thập phản hồi từ người dùng.
- Giai đoạn 4: Giai đoạn chốt, đã sẵn sàng để thêm vào tiêu chuẩn ECMAScript chính thức.

Khi một cú pháp vào giai đoạn 3, TypeScript sẽ triển khai nó. Một mặt, điều này cho phép chúng ta sử dụng cú pháp mới nhất càng sớm càng tốt, giúp nó tiến vào giai đoạn tiếp theo; mặt khác, cú pháp ở giai đoạn 3 đã khá ổn định, ít có thay đổi cú pháp, cho phép chúng ta sử dụng nó một cách an toàn.

Ngoài việc triển khai tiêu chuẩn ECMAScript, nhóm TypeScript cũng đóng góp vào nhiều đề xuất cú pháp khác, chẳng hạn như toán tử tùy chọn (`?.`), toán tử gộp giá trị rỗng (`??`), biểu thức Throw, chỉ mục khớp với biểu thức chính quy(regex), v.v.

## Tóm lại

TypeScript là gì?

- TypeScript là JavaScript có hệ thống kiểu dữ liệu, phù hợp với mọi quy mô dự án.
- TypeScript là ngôn ngữ tĩnh, yếu.
- TypeScript hoàn toàn tương thích với JavaScript, không thay đổi tính năng chạy của JavaScript.
- TypeScript có thể biên dịch thành JavaScript và chạy trên bất kỳ môi trường nào hỗ trợ JavaScript, chẳng hạn như trình duyệt, Node.js, v.v.
- TypeScript có nhiều tùy chọn biên dịch, bạn có thể quyết định mức độ kiểm tra kiểu dữ liệu.
- TypeScript có thể chung sống với JavaScript, cho phép dự án JavaScript chuyển dần sang TypeScript.
- TypeScript cung cấp các tính năng mở rộng cho trình biên tập (IDE), bao gồm hoàn thành mã, gợi ý giao diện, điều hướng đến định nghĩa, tái cấu trúc mã, v.v.
- TypeScript có cộng đồng sôi nổi, hầu hết các thư viện bên thứ ba phổ biến đều cung cấp khai báo kiểu.
- TypeScript đồng bộ với tiêu chuẩn ECMAScript (giai đoạn 3).

## Phụ lục: Lịch sử phát triển TypeScript

- 2012-10: Microsoft phát hành phiên bản đầu tiên của TypeScript (0.8), đã được phát triển trong hai năm trước đó trong Microsoft.
- 2014-04: TypeScript phát hành phiên bản 1.0.
- 2014-10: Angular phát hành phiên bản 2.0, một framework frontend được phát triển bằng TypeScript.
- 2015-01: ts-loader được phát hành, cho phép webpack biên dịch các tệp TypeScript.
- 2015-04: Microsoft phát hành Visual Studio Code, hỗ trợ ngôn ngữ TypeScript và được phát triển bằng TypeScript.
- 2016-05: `@types/react` được phát hành, cho phép phát triển ứng dụng React bằng TypeScript.
- 2016-05: `@types/node` được phát hành, cho phép phát triển ứng dụng Node.js bằng TypeScript.
- 2016-09: TypeScript phát hành phiên bản 2.0.
- 2018-06: TypeScript phát hành phiên bản 3.0.
- 2019-02: TypeScript thông báo rằng nhóm chính thức sẽ duy trì typescript-eslint để hỗ trợ kiểm tra ESLint trong các tệp TypeScript.
- 2020-05: Deno phát hành phiên bản 1.0, một runtime JavaScript và TypeScript.
- 2020-08: TypeScript phát hành phiên bản 4.0.
- 2020-09: Vue phát hành phiên bản 3.0, hỗ trợ TypeScript chính thức.
