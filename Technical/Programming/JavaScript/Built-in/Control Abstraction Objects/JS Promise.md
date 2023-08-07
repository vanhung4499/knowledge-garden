---
title: JS Promies
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-08
---

# Promise

Lập trình bất đồng bộ truyền thống thường gặp vấn đề "callback hell" khi mà mức lồng nhau của callback quá sâu, dẫn đến việc khó hiểu và bảo trì mã nguồn. Promise giúp chúng ta giải quyết vấn đề này bằng cách sử dụng phương thức gọi liên tiếp (chaining) để xử lý các callback.

Promise là một giải pháp cho lập trình bất đồng bộ, cho phép chúng ta xếp hàng các hoạt động bất đồng bộ và thực hiện chúng theo thứ tự mong muốn, trả về kết quả theo dự đoán. Promise có thể được truyền và xử lý giữa các đối tượng, giúp chúng ta quản lý hàng đợi.

Cú pháp:

```js
new Promise(executor);
```

Tham số `executor` của Promise là một hàm có hai tham số `resolve` và `reject`. Cả hai tham số này cũng là các hàm.

- `resolve`: Được gọi khi hoạt động bất đồng bộ thành công, chuyển trạng thái của Promise từ "đang chờ" (pending) sang "đã thực hiện" (fulfilled) và truyền kết quả của hoạt động bất đồng bộ như là tham số. Tham số của hàm này có thể là một giá trị bình thường hoặc một Promise khác.
- `reject`: Được gọi khi hoạt động bất đồng bộ thất bại, chuyển trạng thái của Promise từ "đang chờ" (pending) sang "bị từ chối" (rejected) và truyền lỗi của hoạt động bất đồng bộ như là tham số. Thông thường, tham số của hàm này là một đối tượng lỗi (Error object).

Khai báo kiểu:

```ts
constructor(executor: (resolve: (result: R) => void, reject: (error: any) => void) => void): Promise

constructor(executor: (resolve: (thenable: Thenable<R>) => void, reject: (error: any) => void) => void): Promise
```

## Mô tả

- Khi Promise được khởi tạo, hàm `executor` được **ngay lập tức gọi**, và hai hàm `resolve` và `reject` được truyền vào `executor` (hàm `executor` được gọi trước khi Promise trả về đối tượng mới).
- Thông thường, `executor` sẽ thực hiện một số hoạt động bất đồng bộ và khi hoàn thành, có thể gọi hàm `resolve` để chuyển trạng thái của Promise sang "đã thực hiện" (fulfilled), hoặc gọi hàm `reject` để chuyển trạng thái của Promise sang "bị từ chối" (rejected).
- Promise không thể bị hủy bỏ, sau khi được tạo, nó sẽ được thực thi ngay lập tức và không thể hủy giữa chừng.
- Nếu không đặt hàm callback (executor), lỗi trong Promise sẽ không được phản ánh ra bên ngoài.
- Khi ở trạng thái "đang chờ" (pending), không thể biết được tiến trình hiện tại đang ở giai đoạn nào.

Nếu một sự kiện xảy ra lặp đi lặp lại, thì việc sử dụng [Stream](https://nodejs.org/api/stream.html) thường là một lựa chọn tốt hơn so với việc triển khai Promise.

🌰 **Ví dụ mã**

```js
new Promise(
  /* executor */
  function (resolve, reject) {
    // Xử lý bất đồng bộ

    // Được gọi sau khi xử lý dữ liệu hoàn tất
    resolve();

    // Được gọi khi xử lý dữ liệu gặp lỗi
    reject();
  }
).then(
  function A() {
    /* Thành công, thực hiện bước tiếp theo */
  },
  function B() {
    /* Thất bại, xử lý tương ứng */
  }
);
```

## Quy trình làm việc của Promise

Promise là một đối tượng proxy (đại diện cho một giá trị), giá trị được đại diện có thể không được biết trước khi tạo đối tượng Promise. Nó cho phép bạn gắn kết các phương thức xử lý tương ứng cho các trạng thái **Fulfilled** (thực hiện) và **Rejected** (từ chối) của các hoạt động bất đồng bộ. Điều này cho phép các phương thức bất đồng bộ trả về giá trị giống như các phương thức đồng bộ, nhưng không trả về kết quả thực thi cuối cùng ngay lập tức, mà trả về một đối tượng Promise có thể đại diện cho kết quả xuất hiện trong tương lai.

Vì phương thức `Promise.prototype.then` và `Promise.prototype.catch` trả về đối tượng Promise, nên chúng có thể được [[JS Cascade Function|gọi liên tiếp]].

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230808003301.png)

## Trạng thái

Đối tượng Promise được khởi tạo bằng từ khóa `new` có ba trạng thái sau:

| Trạng thái | Ý nghĩa | Mô tả                               |
| --------- | ------- | ----------------------------------- |
| Pending   | Đang chờ | Trạng thái ban đầu                   |
| Fulfilled | Đã thực hiện | Thành công, gọi `onFulfilled` |
| Rejected  | Bị từ chối | Thất bại, gọi `onRejected`  |

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230808001210.png)

⚠️ **Lưu ý**: Khi trạng thái của Promise chuyển từ <span style="font-weight:bold;color:red">Pending</span> sang <span style="font-weight:bold;color:red">Fulfilled</span> hoặc <span style="font-weight:bold;color:red">Rejected</span>, trạng thái của đối tượng Promise sẽ không thay đổi nữa.

Khi trạng thái của Promise thay đổi, các hàm phản hồi trong `.then()` sẽ được gọi để xử lý các bước tiếp theo.

Tuy nhiên, chỉ có một trong hai hàm trong tham số của `.then()` sẽ được gọi, hàm nào được gọi phụ thuộc vào trạng thái của Promise.

Ngoài ra, trạng thái **Fulfilled** và **Rejected** có thể được gọi là **Settled** (ổn định).

## Phương thức tĩnh

| Phương thức | Mô tả |
| ---------- | ----- |
| [Promise.all(iterable)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) | Đóng gói nhiều đối tượng Promise thành một đối tượng Promise mới. Gọi lại được kích hoạt khi tất cả các thành viên đều Fulfilled hoặc một thành viên bị Rejected |
| [Promise.race(iterable)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) | Đóng gói nhiều đối tượng Promise thành một đối tượng Promise mới. Gọi lại được kích hoạt khi một thành viên thay đổi trạng thái |
| [Promise.reject(reason)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject) | Trả về một đối tượng Promise mới với trạng thái Rejected |
| [Promise.resolve(value)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve) | Trả về một đối tượng Promise mới với trạng thái Fulfilled |

## Đối tượng nguyên mẫu

### Thuộc tính

|Thuộc tính nguyên mẫu|Mô tả|
|---|---|
|`Promise.prototype.constructor`|Trả về hàm tạo ra đối tượng Promise mặc định|

### Phương thức

|Phương thức nguyên mẫu|Mô tả|
|---|---|
|[Promise.prototype.catch(onRejected)](app://obsidian.md/properties-of-the-promise-prototype-object/catch)|Tương đương với `.then(null, rejection)` và được sử dụng để chỉ định hàm xử lý khi xảy ra lỗi|
|[Promise.prototype.then(onFulfilled, onRejected)](app://obsidian.md/properties-of-the-promise-prototype-object/then)|Thêm các hàm xử lý `fulfillment` và `rejection` vào Promise hiện tại và trả về một Promise mới với giá trị trả về của hàm|
|`Promise.prototype.finally(onFinally)`|Được sử dụng để chỉ định một hành động sẽ được thực hiện dù Promise có trạng thái cuối cùng như thế nào|

## Thực hành tốt nhất

### Chuỗi nhiều tác vụ

```js
const Task = function (result, isSuccess = true) {
  return () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (isSuccess) {
          resolve(result);
        } else {
          reject(result);
        }
      }, 1000);
    });
};

execute([Task('A'), Task('B'), Task('C', false), Task('D')]).then((resultList) => {
  // làm gì đó
});
```

Lưu ý:

1. Mỗi Task, thành công hay thất bại, không thể ngăn chặn việc thực thi Task tiếp theo
2. `then` cuối cùng cần `resolve` kết quả thực thi của mỗi Task

Ý tưởng thực hiện:

1. Bọc mỗi Task trong một Promise để bắt lỗi `rejected` của Task
2. Có thể sử dụng biến trung gian để lưu trữ kết quả đầu ra của mỗi Task, sau đó trong `then` cuối cùng của Promise, `resolve` biến trung gian đó

```js
function execute(tasks) {
  return tasks.reduce(
    (previousPromise, currentPromise) =>
      previousPromise.then((resultList) => {
        return new Promise((resolve) => {
          currentPromise()
            .then((result) => {
              resolve(resultList.concat(result));
            })
            .catch(() => {
              resolve(resultList.concat(null));
            });
        });
      }),
    []
  );
}
```

### Đồng thời đồng bộ

### Đồng thời bất đồng bộ
