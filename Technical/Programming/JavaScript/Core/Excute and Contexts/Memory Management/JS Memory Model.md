---
title: JS Memory Model
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-02
date modified: 2023-08-02
---

# Mô hình bộ nhớ

Không gian bộ nhớ của JavaScript được chia thành **ngăn xếp** (Stack), **heap** và **pool** (thường được xem như một phần của ngăn xếp). Trong đó, **ngăn xếp** lưu trữ các biến, **heap** lưu trữ các đối tượng phức tạp và **pool** lưu trữ các hằng số.

## Cấu trúc dữ liệu ngăn xếp

Khác với C / C++, JavaScript không có phân biệt rõ ràng giữa bộ nhớ ngăn xếp và bộ nhớ heap. Do đó, chúng ta có thể hiểu đơn giản rằng tất cả dữ liệu của JavaScript được lưu trữ trong bộ nhớ heap. Tuy nhiên, trong một số tình huống, chúng ta vẫn cần sử dụng tư duy dựa trên cấu trúc dữ liệu ngăn xếp để thực hiện một số chức năng, ví dụ như [[JS Excution Context Stack]]. Thứ tự thực thi của ngữ cảnh thực thi sử dụng cách lưu trữ và truy xuất dữ liệu của cấu trúc dữ liệu ngăn xếp.

Để hiểu rõ hơn về cấu trúc dữ liệu vui lòng xem: [[Stack]]

## Cấu trúc dữ liệu heap

Cấu trúc dữ liệu heap là một cấu trúc dạng cây. Cách truy xuất dữ liệu của nó tương tự như cách truy xuất sách trên kệ sách.

Mặc dù sách được sắp xếp gọn gàng trên kệ sách, nhưng chúng ta chỉ cần biết tên của cuốn sách, chúng ta có thể dễ dàng lấy ra cuốn sách mà chúng ta muốn, mà không cần phải như việc lấy bóng bàn từ hộp bóng bàn, phải lấy ra tất cả các quả bóng bàn ở trên trước mới có thể lấy được một quả bóng bàn ở giữa. Tương tự như trong dữ liệu JSON, các cặp `key-value` được lưu trữ không theo thứ tự, vì thứ tự khác nhau không ảnh hưởng đến việc sử dụng. Chúng ta chỉ quan tâm đến tên của cuốn sách.

Để hiểu rõ hơn về cấu trúc dữ liệu vui lòng xem: [[Heap]]

## Cấu trúc dữ liệu hàng đợi

Hàng đợi là một cấu trúc dữ liệu tuân thủ nguyên tắc "vào trước ra trước" (FIFO). Giống như việc xếp hàng để qua kiểm tra an ninh, người đứng trước hàng chắc chắn sẽ được kiểm tra trước.

Để hiểu rõ hơn về cấu trúc dữ liệu vui lòng xem: [[Queue]]

## Đối tượng biến và các kiểu dữ liệu cơ bản

Sau khi tạo ra  [[JS Excution Context Stack|ngữ cảnh thực thi]] của JavaScript, một đối tượng đặc biệt được tạo ra gọi là [[JS Variable Object|đối tượng biến (variable object)]]. Các kiểu dữ liệu cơ bản của JavaScript thường được lưu trữ trong đối tượng biến.

Nói một cách chính xác, đối tượng biến cũng được lưu trữ trong bộ nhớ heap, nhưng do chức năng đặc biệt của đối tượng biến, chúng ta vẫn cần phân biệt nó với bộ nhớ heap.

Các kiểu dữ liệu cơ bản của JavaScript thường được lưu trữ trong bộ nhớ stack (ngoại trừ closure). Chúng được hệ thống tự động cấp phát không gian lưu trữ. Chúng ta có thể truy cập trực tiếp vào giá trị được lưu trữ trong bộ nhớ stack, do đó các kiểu dữ liệu cơ bản trong JavaScript được truy cập theo giá trị và hoạt động tương tự như cấu trúc dữ liệu ngăn xếp (stack), tuân thủ nguyên tắc "vào sau ra trước" (LIFO - Last In First Out).

> Chúng ta tạm thời không xem xét kiểu dữ liệu Symbol

## Kiểu dữ liệu tham chiếu và bộ nhớ heap

Khác với các ngôn ngữ khác, các kiểu dữ liệu tham chiếu trong JavaScript, như mảng (Array), có kích thước không cố định. Giá trị của các kiểu dữ liệu tham chiếu được lưu trữ trong bộ nhớ heap. JavaScript không cho phép truy cập trực tiếp vào vị trí trong bộ nhớ heap, do đó chúng ta không thể trực tiếp thao tác trên không gian bộ nhớ của đối tượng. Khi thao tác với đối tượng, chúng ta thực tế đang thao tác với tham chiếu của đối tượng chứ không phải đối tượng thực tế. Do đó, giá trị của các kiểu dữ liệu tham chiếu được truy cập theo tham chiếu. Ở đây, tham chiếu có thể được hiểu đơn giản là một **địa chỉ tham chiếu** được lưu trữ trong bộ nhớ stack, liên kết với giá trị thực tế trong bộ nhớ heap. Cách truy cập và lấy dữ liệu từ bộ nhớ heap tương tự như việc lấy sách từ kệ sách. Mặc dù sách được sắp xếp theo thứ tự trên kệ sách, nhưng chúng ta chỉ cần biết tên của sách, chúng ta có thể dễ dàng lấy sách mà không cần lấy ra tất cả các quả bóng bàn từ hộp bóng bàn để lấy quả bóng bàn ở giữa. Tương tự, trong dữ liệu được lưu trữ dưới dạng JSON, các cặp `key-value` có thể không có thứ tự, vì thứ tự không ảnh hưởng đến việc sử dụng, chúng ta chỉ quan tâm đến tên sách.

Để hiểu rõ hơn về đối tượng biến và bộ nhớ heap trong JavaScript, chúng ta có thể kết hợp ví dụ và hình ảnh sau để hiểu.

```js
// Đối tượng biến
var a1 = 0;
// Đối tượng biến
var a2 = 'Bingo!';
// Đối tượng biến
var a3 = null;

// Biến b tồn tại trong đối tượng biến, {m: 20} tồn tại trong bộ nhớ heap
var b = { m: 20 };
// Biến c tồn tại trong đối tượng biến, [1, 2, 3] tồn tại trong bộ nhớ heap
var c = [1, 2, 3];
```

![variable-heap.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/variable-heap.png)

Do đó, khi chúng ta truy cập vào kiểu dữ liệu tham chiếu trong bộ nhớ heap, thực tế chúng ta trước tiên lấy **địa chỉ tham chiếu** của đối tượng đó từ đối tượng biến, sau đó lấy dữ liệu cần thiết từ bộ nhớ heap.

Sau khi hiểu về không gian bộ nhớ của JavaScript, chúng ta có thể sử dụng các tính chất của không gian bộ nhớ để xác minh các đặc điểm của kiểu dữ liệu.

## Sao chép dữ liệu

### Kiểu dữ liệu cơ bản

🌰 **Ví dụ mã**:

```js
const a = 10;
const b = a;
b = 20;
```

Khi sao chép dữ liệu trong đối tượng biến, hệ thống sẽ tự động cấp phát một giá trị mới cho biến mới. Sau khi thực hiện phép gán `const b = a`, mặc dù biến `a` và biến `b` đều có giá trị `100`, nhưng thực tế chúng đã là hai giá trị độc lập không ảnh hưởng lẫn nhau.

Cụ thể như hình ảnh dưới đây:  

![js-basic-type-copy.excalidraw.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/js-basic-type-copy.excalidraw.png)

### Kiểu dữ liệu tham chiếu

🌰 **Ví dụ mã**:

```js
const m = { a: 10, b: 20 };
const n = m;
n.a = 15;
```

Sao chép kiểu dữ liệu tham chiếu cũng sẽ tự động cấp phát một giá trị mới cho biến mới trong đối tượng biến, nhưng khác biệt là giá trị mới này chỉ là một **địa chỉ tham chiếu** của kiểu dữ liệu tham chiếu. Khi địa chỉ tham chiếu giống nhau, mặc dù chúng độc lập nhau, nhưng trong đối tượng biến, chúng thực tế là cùng một đối tượng.

![js-reference-copy.excalidraw.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/js-reference-copy.excalidraw.png)

## Tổng kết

| Bộ nhớ stack                                  | Bộ nhớ heap                                                        |
|:--------------------------------------------- |:------------------------------------------------------------------ |
| Lưu trữ kiểu dữ liệu cơ bản                   | Lưu trữ kiểu dữ liệu tham chiếu                                    |
| Truy cập theo giá trị                         | Truy cập theo tham chiếu                                           |
| Kích thước giá trị cố định                    | Kích thước giá trị không cố định, có thể điều chỉnh động           |
| Hệ thống tự động cấp phát không gian lưu trữ  | Phân bổ không gian lưu trữ bởi người phát triển thông qua mã       |
| Chủ yếu được sử dụng để thực thi chương trình | Chủ yếu được sử dụng để lưu trữ đối tượng                          |
| Kích thước nhỏ, hiệu suất cao                 | Kích thước lớn, hiệu suất tương đối thấp                           |
| Vào trước ra sau, vào sau ra trước            | Không có thứ tự lưu trữ, có thể truy cập trực tiếp bằng tham chiếu |
