---
title: JS Lazy Function
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-05
---

# Hàm lười biếng

**Hàm lười biếng (Lazy Function)** là một hàm chỉ thực hiện các nhánh của nó khi hàm được gọi lần đầu tiên. Trong quá trình gọi lần đầu tiên, hàm này sẽ được ghi đè bằng một hàm khác được thực thi theo cách thích hợp, điều này đồng nghĩa với việc không cần phải đi qua các nhánh thực thi của hàm gốc khi gọi hàm.

## Giải quyết vấn đề

Trong một phương thức, có thể có một số vấn đề liên quan đến tính tương thích, các trình duyệt khác nhau có các phương thức khác nhau. Lần đầu tiên chúng ta duyệt qua các phương thức này để tìm phương thức phù hợp nhất và ghi đè phương thức này lên hàm duyệt qua nó, đây chính là hàm lười biếng, chỉ duyệt qua một lần để tìm phương án tốt nhất, lần sau khi tìm phương án đó không cần duyệt qua nữa, cải thiện hiệu suất.

🌰 **Ví dụ: Hàm thêm sự kiện cho các phần tử DOM**

```js
function addEvent(type, element, func) {
  if (element.addEventListener) {
    element.addEventListener(type, func, false);
  } else if(element.attachEvent){
    element.attachEvent('on' + type, func);
  } else{
    element['on' + type] = func;
  }
}
```

Mỗi lần gọi hàm `addEvent`, nó sẽ kiểm tra khả năng hỗ trợ của trình duyệt, trước tiên kiểm tra xem trình duyệt có hỗ trợ phương thức `addEventListener` không, nếu không hỗ trợ, kiểm tra xem có hỗ trợ phương thức `attachEvent` không, nếu vẫn không hỗ trợ, sử dụng phương thức DOM0 để thêm sự kiện. Quá trình này được thực hiện mỗi lần gọi hàm, thực tế, nếu trình duyệt hỗ trợ một trong các phương thức này, nó sẽ tiếp tục hỗ trợ, không cần phải kiểm tra các nhánh khác, điều này có nghĩa là câu lệnh `if` không cần phải thực hiện mỗi lần, mã có thể chạy nhanh hơn. Giải pháp cho vấn đề này được gọi là kỹ thuật **tải lười biếng**.

## Ghi đè hàm

Trước khi giới thiệu về hàm lười biếng (hoặc gọi là tải lười biếng), trước tiên hãy giới thiệu về kỹ thuật ghi đè hàm.

Vì một hàm có thể trả về một hàm khác, nên có thể sử dụng một hàm mới để ghi đè lên hàm cũ.

```js
function foo(){
  console.log('foo');

  foo = function(){
    console.log('bar');
  }
}
```

Với cách làm này, khi gọi hàm lần đầu tiên, `console.log('foo')` sẽ được thực hiện, biến toàn cục `foo` được định nghĩa lại và gán cho một hàm mới. Khi gọi hàm lần thứ hai, `console.log('bar')` sẽ được thực hiện.

## Tải lười biếng

Tải lười biếng thực chất là ghi đè hàm. Ý tưởng của **tải lười biếng** là chỉ thực hiện nhánh thích hợp khi hàm được gọi lần đầu tiên, sau đó các lần gọi hàm tiếp theo sẽ trực tiếp vào mã nhánh được hỗ trợ.

Có hai cách để thực hiện tải lười biếng, cách thứ nhất là khi hàm được gọi lần đầu tiên, xử lý hàm một lần nữa, hàm này sẽ được ghi đè bằng một hàm thích hợp, điều này đồng nghĩa với việc không cần phải đi qua các nhánh thực thi của hàm gốc khi gọi hàm. Chúng ta có thể sử dụng cách sau để sử dụng tải lười biếng để viết lại `addEvent()`.

### Xử lý hàm khi được gọi

Khi hàm được gọi lần đầu tiên, hàm này sẽ được ghi đè bằng một hàm khác được thực thi theo cách thích hợp, điều này đồng nghĩa với việc không cần phải đi qua các nhánh thực thi của hàm gốc khi gọi hàm. Viết lại mã như sau:

```js
function addEvent(type, element, func) {
  if (element.addEventListener) {
    addEvent = function (type, element, func) {
      element.addEventListener(type, func, false);
    }
  } else if(element.attachEvent){
    addEvent = function (type, element, func) {
      element.attachEvent('on' + type, func);
    }
  } else{
    addEvent = function (type, element, func) {
      element['on' + type] = func;
    }
  }

  return addEvent(type, element, func);
}
```

Trong hàm tải lười biếng `addEvent()` này, mỗi nhánh của câu lệnh `if` sẽ gán giá trị cho biến `addEvent`, ghi đè hàm gốc. Bước cuối cùng là gọi hàm đã ghi đè. Lần gọi `addEvent()` tiếp theo sẽ trực tiếp gọi hàm mới được gán, điều này đồng nghĩa với việc không cần phải thực hiện câu lệnh `if` nữa.

Tuy nhiên, phương pháp này có một nhược điểm, nếu tên hàm thay đổi, việc sửa đổi sẽ khá phức tạp.

### Xác định hàm thích hợp khi khai báo

Di chuyển việc kiểm tra trình duyệt lên trước khi mã được tải, để khi mã được tải, nó sẽ ngay lập tức kiểm tra một lần và trả về một hàm bao bọc mã logic chính xác.

```js
var addEvent = (function () {
  if (document.addEventListener) {
    return function (type, element, func) {
      element.addEventListener(type, func, false);
    }
  }
  else if (document.attachEvent) {
    return function (type, element, func) {
      element.attachEvent('on' + type, func);
    }
  }
  else {
    return function (type, element, func) {
      element['on' + type] = func;
    }
  }
})();
```
