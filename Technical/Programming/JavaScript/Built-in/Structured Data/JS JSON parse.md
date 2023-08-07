---
title: JS JSON parse
tags: [js, programming, json]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# JSON.parse()

Phương thức `JSON.parse()` được sử dụng để phân tích cú pháp chuỗi JSON và tạo ra giá trị hoặc đối tượng JavaScript từ chuỗi đó. Nó cung cấp một hàm `reviver` tùy chọn để thực hiện các biến đổi hoặc thao tác trên đối tượng trước khi nó được trả về.

## Cú pháp

```js
JSON.parse( text [, reviver] )
```

| Tham số    | Kiểu dữ liệu      | Mô tả                                                         |
| ---------- | ----------------- | ------------------------------------------------------------ |
| `text`     | Kiểu `String`     | Chuỗi JSON sẽ được phân tích cú pháp thành giá trị JavaScript. |
| `reviver`  | Kiểu `Function`, tùy chọn | Một hàm được chỉ định để biến đổi (thay đổi) giá trị gốc trước khi nó được trả về. |

## Ví dụ

### Ví dụ mã

```js
JSON.parse('{}'); // {}
JSON.parse('true'); // true
JSON.parse('"foo"'); // "foo"
JSON.parse('[1, 5, "false"]'); // [1, 5, "false"]
JSON.parse('null'); // null
JSON.parse('1'); //  1
```

### Tham số `reviver`

Nếu chỉ định hàm `reviver`, giá trị JavaScript được phân tích cú pháp (giá trị phân tích) sẽ được biến đổi trước khi nó được trả về (giá trị trả về).

Cụ thể hơn, giá trị phân tích cú pháp và tất cả các thuộc tính của nó sẽ được gọi lần lượt bằng hàm `reviver` theo một thứ tự nhất định (bắt đầu từ các thuộc tính ở mức sâu nhất, từng cấp độ một, cho đến giá trị phân tích cú pháp chính). Trong quá trình gọi, đối tượng chứa thuộc tính hiện tại sẽ được sử dụng làm giá trị `this`, tên thuộc tính hiện tại và giá trị thuộc tính hiện tại sẽ được truyền lần lượt làm tham số thứ nhất và thứ hai vào hàm `reviver`. Nếu `reviver` trả về `undefined`, thuộc tính hiện tại sẽ bị xóa khỏi đối tượng chứa nó, nếu trả về giá trị khác, giá trị trả về sẽ trở thành giá trị mới của thuộc tính hiện tại.

Khi duyệt đến giá trị chính (giá trị phân tích cú pháp), các tham số được truyền vào hàm `reviver` sẽ là một chuỗi rỗng `""` (vì không còn thuộc tính thực sự nào), và giá trị `this` hiện tại sẽ là `{"": giá trị đã được thay đổi}`. Khi viết hàm `reviver`, cần lưu ý đến trường hợp đặc biệt này. (Thứ tự duyệt qua các thuộc tính của hàm này là từ cấp sâu nhất, theo thứ tự từng cấp độ ra ngoài, cuối cùng là giá trị chính)

```js
JSON.parse('{"p": 5}', function (k, v) {
  if (k === '') return v; // Nếu đến cấp độ cao nhất, trả về giá trị thuộc tính,
  return v * 2; // Nếu không, nhân giá trị thuộc tính với 2.
}); // { p: 10 }

JSON.parse('{"1": 1, "2": 2,"3": {"4": 4, "5": {"6": 6}}}', function (k, v) {
  console.log(k); // In ra tên thuộc tính hiện tại, để biết thứ tự duyệt qua từ sâu vào ngoài,
  // Tên thuộc tính cuối cùng sẽ là chuỗi rỗng.
  return v; // Trả về giá trị thuộc tính gốc, tương đương không sử dụng tham số reviver.
});

// 1
// 2
// 4
// 6
// 5
// 3
// ""
```

### Không cho phép dấu phẩy ở cuối

```js
// Cả hai đều sẽ gây ra lỗi cú pháp
JSON.parse('[1, 2, 3, 4, ]');
JSON.parse('{"foo" : 1, }');
```
