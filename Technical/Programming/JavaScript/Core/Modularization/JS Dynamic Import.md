---
title: JS Dynamic Import
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-05
---

# Tải động

Lệnh `import` được phân tích tĩnh bởi trình thông dịch JavaScript, được thực thi trước các lệnh khác trong module (lệnh `import` được gọi là **liên kết**). Do đó, mã dưới đây sẽ gây lỗi.

```js
// Lỗi
if (x === 2) {
  import module from './module';
}
```

⚠️ **Lưu ý**: Trình thông dịch xử lý lệnh `import` trong giai đoạn biên dịch, không phân tích hoặc thực thi câu lệnh `if`, vì vậy việc đặt lệnh `import` trong khối mã `if` không có ý nghĩa và sẽ gây lỗi cú pháp, không phải lỗi thời gian chạy. Điều này có nghĩa là lệnh `import` và `export` chỉ có thể ở đầu module và không thể trong khối mã.

Thiết kế như vậy tuy có lợi cho trình biên dịch tăng hiệu suất, nhưng cũng làm cho việc tải module trong thời gian chạy không thể thực hiện. Về mặt cú pháp, không thể thực hiện tải có điều kiện. Nếu lệnh `import` muốn thay thế phương thức `require` của Node, điều này tạo ra một rào cản. Vì `require` là tải module trong thời gian chạy, trong khi lệnh `import` không thể thực hiện chức năng tải **động**.

```js
const path = './' + fileName;

const myModual = require(path);
```

Trên đây là một ví dụ về tải động, `require` chỉ biết tải module nào chỉ khi thực thi. Lệnh `import` không thể làm được điều này.

Do đó, có một [đề xuất](https://github.com/tc39/proposal-dynamic-import) để giới thiệu hàm `import()` để thực hiện tải động.

```js
import(module);
```

Tham số `module` đại diện cho vị trí của module cần tải. Hàm `import()` có thể chấp nhận bất kỳ tham số nào, tương tự như lệnh `import()`, sự khác biệt chủ yếu là hàm này cho phép tải động.

`import()` trả về một đối tượng **Promise**.

```js
const main = document.querySelector('main');

import(`./section-modules/${someVariable}.js`)
  .then((module) => {
    module.loadPageInto(main);
  })
  .catch((err) => {
    main.textContent = err.message;
  });
```

Hàm `import()` có thể được sử dụng ở bất kỳ đâu, không chỉ trong module, mà còn trong các tệp không phải là module. Nó được thực thi trong thời gian chạy, có nghĩa là khi nào đến lệnh đó, module được tải. Hơn nữa, hàm `import()` không có mối quan hệ liên kết tĩnh với module được tải, điều này khác với lệnh `import`. Hàm `import()` tương tự như phương thức `require` của Node, sự khác biệt chủ yếu là hàm này tải động và phương thức `require` tải đồng bộ.

# Các trường hợp sử dụng

### Tải theo nhu cầu

`import()` có thể được sử dụng để tải module khi cần thiết.

```js
button.addEventListener('click', (event) => {
  import('./dialogBox.js')
    .then((dialogBox) => {
      dialogBox.open();
    })
    .catch((error) => {
      /* Xử lý lỗi */
    });
});
```

Trong đoạn mã trên, phương thức `import()` được đặt trong hàm lắng nghe sự kiện `click`, chỉ khi người dùng nhấp vào nút, module đó mới được tải.

### Tải theo điều kiện

`import()` có thể được đặt trong khối mã `if`, tải các module khác nhau dựa trên các điều kiện khác nhau.

```js
if (condition) {
    import('moduleA').then(...)
} else {
    import('moduleB').then(...)
}
```

Trong đoạn mã trên, nếu điều kiện đúng, module A sẽ được tải, ngược lại, module B sẽ được tải.

### Đường dẫn module động

`import()` cho phép tạo đường dẫn module theo cách động.

```js
import(fn()).then(() => {});
```

Trong đoạn mã trên, module sẽ được tải dựa trên kết quả trả về của hàm `fn`.

# Lưu ý

### Gán giá trị từ module nhập bằng cú pháp phân rã đối tượng

Sau khi `import()` tải module thành công, module đó sẽ được coi như một đối tượng và được truyền vào như tham số của phương thức `then`. Do đó, bạn có thể sử dụng cú pháp phân rã đối tượng để lấy các giao diện xuất.

```js
import('./module.js').then(({ export1, export2 }) => {
  // làm gì đó
});
```

Trong đoạn mã trên, `export1` và `export2` đều là các giao diện được xuất từ `module.js`, và bạn có thể lấy chúng bằng cú pháp phân rã đối tượng.

### Nhập module mặc định

Nếu module có giao diện xuất mặc định, bạn có thể nhận nó trực tiếp thông qua tham số.

```js
import('./module.js').then((module) => {
  console.log(module.default);
});
```

### Nhập giao diện đặt tên

Mã trên cũng có thể sử dụng cú pháp **đặt tên giao diện**.

```js
import('./module.js').then(({ default: defaultInterface }) => {
  console.log(defaultInterface);
});
```

### Tải đồng thời nhiều module

Nếu bạn muốn **tải đồng thời nhiều module**, bạn có thể sử dụng cú pháp sau.

```js
Promise.all([import('./module1.js'), import('./module2.js'), import('./module3.js')]).then(
  ([module1, module2, module3]) => {
    // làm gì đó
  }
);
```

### Nhập module trong hàm async

`import()` cũng có thể được sử dụng trong **hàm async**.

```js
async function main() {
  const module = await import('./module.js');

  const { export1, export2 } = await import('./module.js');

  const [module1, module2, module3] = await Promise.all([
    import('./module1.js'),
    import('./module2.js'),
    import('./module3.js'),
  ]);
}

main();
```
