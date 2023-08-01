---
title: JS Conditional Operator
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Toán tử điều kiện

**Toán tử điều kiện (Conditional Operator)** là duy nhất một **toán tử ba ngôi** (có ba toán hạng) trong JavaScript, thường được gọi là toán tử ba ngôi.

```js
biến = biểu_thức_điều_kiện ? giá_trị_đúng : giá_trị_sai;
```

Cơ bản, điều này dựa trên kết quả của việc đánh giá `biểu_thức_điều_kiện` để quyết định gán giá trị gì cho biến `biến`. Nếu kết quả đánh giá là `true`, thì gán giá trị `giá_trị_đúng` cho biến `biến`; nếu kết quả đánh giá là `false`, thì gán giá trị `giá_trị_sai` cho biến `biến`.

Toán tử điều kiện có thể có bất kỳ kiểu dữ liệu nào là toán hạng, toán hạng đầu tiên được coi là giá trị boolean, nếu nó là giá trị đúng `true`, thì sẽ tính toán giá trị của toán hạng thứ hai và trả về kết quả tính toán đó. Nếu toán hạng đầu tiên là giá trị sai `false`, thì sẽ tính toán giá trị của toán hạng thứ ba và trả về kết quả tính toán đó. Một trong hai toán hạng thứ hai và thứ ba sẽ luôn được tính toán, không thể cả hai đều được thực hiện cùng một lúc.

Thực tế, việc sử dụng câu lệnh `if` cũng sẽ đạt được cùng một hiệu quả, toán tử `?:` chỉ cung cấp một cách viết ngắn gọn. Dưới đây là một ví dụ về ứng dụng điển hình của `?:`, kiểm tra xem một biến có được định nghĩa (và có giá trị đúng có ý nghĩa) hay không, nếu có thì sử dụng nó, nếu không thì sử dụng một giá trị mặc định:

```js
greeting = 'hello ' + (username ? username : 'there');
```

Đoạn mã trên tương đương với đoạn mã dưới đây sử dụng câu lệnh `if`, nhưng rõ ràng đoạn mã trên ngắn gọn hơn:

```js
greeting = 'hello ';
if (username) greeting += username;
else greeting += 'there';
```

Toán tử điều kiện (biểu thức điều kiện ba ngôi) và câu lệnh `if…else` có cùng hiệu quả biểu diễn, nhưng có một sự khác biệt quan trọng.

| Mục          | Loại   | Giá trị trả về |
| :---------- | :----- | :----- |
| `if…else` | Lệnh   | Không     |
| Toán tử điều kiện  | Biểu thức | Có     |

Do đó, trong trường hợp cần trả về giá trị, chỉ có thể sử dụng toán tử điều kiện (biểu thức điều kiện ba ngôi), không thể sử dụng `if…else`.

```js
console.log(true ? 'T' : 'F');
// 'T'
```

Trong đoạn mã trên, đối số của phương thức `console.log()` phải là một biểu thức, chỉ có thể sử dụng biểu thức điều kiện ba ngôi.
