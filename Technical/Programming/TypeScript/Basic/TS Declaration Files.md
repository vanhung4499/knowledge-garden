---
title: TS Declaration Files
tags:
  - ts
categories:
  - ts
date created: 2024-03-15
date modified: 2024-03-15
---

# File khai báo

Khi sử dụng thư viện của bên thứ ba, chúng ta cần tham chiếu đến file khai báo của nó để nhận được các tính năng như tự động hoàn thiện mã, gợi ý giao diện, v.v.

## Chỉ mục cú pháp mới

Vì chương này liên quan đến nhiều cú pháp mới, nên ở đầu chương này, chúng tôi liệt kê chỉ mục cú pháp mới để bạn có thể nhanh chóng tìm kiếm giải thích tương ứng khi sử dụng cú pháp mới này:

- [`declare var`](#declare-var) khai báo biến toàn cục
- [`declare function`](#declare-function) khai báo hàm toàn cục
- [`declare class`](#declare-class) khai báo lớp toàn cục
- [`declare enum`](#declare-enum) khai báo kiểu liệt kê toàn cục
- [`declare namespace`](#declare-namespace) khai báo đối tượng toàn cục (có thuộc tính con)
- [`interface` và `type`](#interface-va-type) khai báo kiểu toàn cục
- [`export`](#export) xuất biến
- [`export namespace`](#export-namespace) xuất đối tượng (có thuộc tính con)
- [`export default`](#export-default) xuất mặc định ES6
- [`export =`](#export-1) xuất module commonjs
- [`export as namespace`](#export-as-namespace) khai báo biến toàn cục cho thư viện UMD
- [`declare global`](#declare-global) mở rộng biến toàn cục
- [`declare module`](#declare-module) mở rộng module
- [`/// <reference />`](#san-xie-xian-zhi-ling) chỉ dẫn ba dấu gạch chéo

## Câu lệnh khai báo là gì

Giả sử chúng ta muốn sử dụng thư viện jQuery của bên thứ ba, một cách phổ biến là chúng ta sẽ thêm jQuery vào html thông qua thẻ `<script>`, sau đó chúng ta có thể sử dụng biến toàn cục `$` hoặc `jQuery`.

Chúng ta thường lấy một phần tử có `id` là `foo` như sau:

```js
$('#foo');
// or
jQuery('#foo');
```

Nhưng trong ts, trình biên dịch không biết `$` hoặc `jQuery` là gì:

```ts
jQuery('#foo');
// LỖI: Không tìm thấy tên 'jQuery'.
```

Lúc này, chúng ta cần sử dụng `declare var` để định nghĩa kiểu của nó:

```ts
declare var jQuery: (selector: string) => any;

jQuery('#foo');
```

Trong ví dụ trên, `declare var` không thực sự định nghĩa một biến, chỉ định nghĩa kiểu của biến toàn cục `jQuery`, chỉ được sử dụng cho kiểm tra khi biên dịch, sẽ bị xóa trong kết quả biên dịch. Kết quả biên dịch của nó là:

```js
jQuery('#foo');
```

Ngoài `declare var`, còn có nhiều câu lệnh khai báo khác, sẽ được giới thiệu chi tiết sau.

## File khai báo là gì

Thường thì chúng ta sẽ đặt các câu lệnh khai báo vào một file riêng (như `jQuery.d.ts`), đây là file khai báo:

```ts
// src/jQuery.d.ts

declare var jQuery: (selector: string) => any;
```

```ts
// src/index.ts

jQuery('#foo');
```

File khai báo phải có đuôi là `.d.ts`.

Thông thường, ts sẽ phân tích tất cả các file `*.ts` trong dự án, bao gồm cả các file có đuôi là `.d.ts`. Vì vậy, khi chúng ta đặt `jQuery.d.ts` vào dự án, tất cả các file `*.ts` khác đều có thể nhận được định nghĩa kiểu của `jQuery`.

```plain
/path/to/project
├── src
|  ├── index.ts
|  └── jQuery.d.ts
└── tsconfig.json
```

Nếu vẫn không thể phân tích, bạn có thể kiểm tra cấu hình `files`, `include` và `exclude` trong `tsconfig.json` để đảm bảo nó bao gồm file `jQuery.d.ts`.

Ở đây chỉ trình bày file khai báo cho biến toàn cục, nếu bạn sử dụng thư viện của bên thứ ba thông qua phương thức nhập module, thì việc nhập file khai báo sẽ là một cách khác, sẽ được giới thiệu chi tiết sau.

### File khai báo của bên thứ ba

Tất nhiên, file khai báo jQuery không cần chúng ta định nghĩa, cộng đồng đã giúp chúng ta định nghĩa: [jQuery trong DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/jquery/index.d.ts).

Chúng ta có thể tải xuống và sử dụng ngay, nhưng chúng tôi khuyên bạn nên sử dụng `@types` để quản lý file khai báo của bên thứ ba.

Cách sử dụng `@types` rất đơn giản, chỉ cần sử dụng npm để cài đặt module khai báo tương ứng là được, ví dụ với jQuery:

```bash
npm install @types/jquery --save-dev
```

Bạn có thể tìm kiếm file khai báo bạn cần trên [trang này](https://microsoft.github.io/TypeSearch/).

## Viết file khai báo

Khi một thư viện của bên thứ ba không cung cấp file khai báo, chúng ta cần tự viết file khai báo. Phần trước chỉ giới thiệu nội dung đơn giản nhất của file khai báo, nhưng việc thực sự viết một file khai báo không phải là một việc dễ dàng, phần sau sẽ giới thiệu chi tiết cách viết file khai báo.

Trong các tình huống khác nhau, nội dung và cách sử dụng file khai báo sẽ khác nhau.

Các tình huống sử dụng thư viện chủ yếu gồm:

- [Biến toàn cục](#quan-ju-bian-liang): Thêm thư viện của bên thứ ba thông qua thẻ `<script>`, chèn biến toàn cục
- [Gói npm](#npm-bao): Nhập thông qua `import foo from 'foo'`, tuân thủ quy chuẩn module ES6
- [Thư viện UMD](#umd-ku): Có thể thêm thông qua thẻ `<script>` hoặc nhập thông qua `import`
- [Mở rộng biến toàn cục trực tiếp](#zhi-jie-kuo-zhan-quan-ju-bian-liang): Thêm thông qua thẻ `<script>`, thay đổi cấu trúc của một biến toàn cục
- [Mở rộng biến toàn cục trong gói npm hoặc thư viện UMD](#zai-npm-bao-huo-umd-ku-zhong-kuo-zhan-quan-ju-bian-liang): Sau khi tham chiếu đến gói npm hoặc thư viện UMD, thay đổi cấu trúc của một biến toàn cục
- [Plugin module](#mo-kuai-cha-jian): Thêm thông qua `<script>` hoặc `import` sau đó thay đổi cấu trúc của một module khác

### Biến toàn cục

Biến toàn cục là tình huống đơn giản nhất, ví dụ trước đây đã nói về việc thêm jQuery thông qua thẻ `<script>`, chèn biến toàn cục `$` và `jQuery`.

Khi sử dụng file khai báo biến toàn cục, nếu bạn cài đặt bằng `npm install @types/xxx --save-dev`, thì không cần cấu hình gì cả. Nếu bạn lưu trữ file khai báo trực tiếp trong dự án hiện tại, khuyến nghị đặt nó cùng với mã nguồn khác trong thư mục `src` (hoặc thư mục mã nguồn tương ứng):

```plain
/path/to/project
├── src
|  ├── index.ts
|  └── jQuery.d.ts
└── tsconfig.json
```

Nếu nó không hoạt động, bạn có thể kiểm tra cấu hình `files`, `include` và `exclude` trong `tsconfig.json` để đảm bảo nó bao gồm file `jQuery.d.ts`.

File khai báo biến toàn cục chủ yếu có các cú pháp sau:

- [`declare var`](#declare-var) khai báo biến toàn cục
- [`declare function`](#declare-function) khai báo hàm toàn cục
- [`declare class`](#declare-class) khai báo lớp toàn cục
- [`declare enum`](#declare-enum) khai báo kiểu liệt kê toàn cục
- [`declare namespace`](#declare-namespace) khai báo đối tượng toàn cục (có thuộc tính con)
- [`interface` và `type`](#interface-va-type) khai báo kiểu toàn cục

#### `declare var`

Trong tất cả các câu lệnh khai báo, `declare var` là đơn giản nhất, như đã học trước đó, nó có thể được sử dụng để xác định kiểu của một biến toàn cục. Tương tự với nó, còn có `declare let` và `declare const`, sử dụng `let` không khác gì sử dụng `var`:

```ts
// src/jQuery.d.ts

declare let jQuery: (selector: string) => any;
```

```ts
// src/index.ts

jQuery('#foo');
// Sử dụng declare let để xác định kiểu jQuery, cho phép thay đổi biến toàn cục này
jQuery = function(selector) {
    return document.querySelector(selector);
};
```

Khi chúng ta sử dụng `const` để xác định, điều này ngụ ý rằng biến toàn cục hiện tại là một hằng số, không được phép thay đổi giá trị của nó nữa:

```ts
// src/jQuery.d.ts

declare const jQuery: (selector: string) => any;

jQuery('#foo');
// Sử dụng declare const để xác định kiểu jQuery, không được phép thay đổi biến toàn cục này
jQuery = function(selector) {
    return document.querySelector(selector);
};
// LỖI: Cannot assign to 'jQuery' because it is a constant or a read-only property.
```

Nhìn chung, biến toàn cục thường là hằng số không được phép thay đổi, vì vậy hầu hết các trường hợp nên sử dụng `const` thay vì `var` hoặc `let`.

Cần lưu ý rằng, trong câu lệnh khai báo chỉ có thể xác định kiểu, không nên xác định cụ thể hành vi trong câu lệnh khai báo:

```ts
declare const jQuery = function(selector) {
    return document.querySelector(selector);
};
// LỖI: An implementation cannot be declared in ambient contexts.
```

#### `declare function`

`declare function` được sử dụng để xác định kiểu của hàm toàn cục. jQuery thực ra cũng là một hàm, vì vậy cũng có thể sử dụng `function` để xác định:

```ts
// src/jQuery.d.ts

declare function jQuery(selector: string): any;
```

```ts
// src/index.ts

jQuery('#foo');
```

Trong câu lệnh khai báo kiểu hàm, nó cũng hỗ trợ quá tải hàm:

```ts
// src/jQuery.d.ts

declare function jQuery(selector: string): any;
declare function jQuery(domReadyCallback: () => any): any;
```

```ts
// src/index.ts

jQuery('#foo');
jQuery(function() {
    alert('Dom Ready!');
});
```

#### `declare class`

Khi biến toàn cục là một lớp, chúng ta sử dụng `declare class` để xác định kiểu của nó:

```ts
// src/Animal.d.ts

declare class Animal {
    name: string;
    constructor(name: string);
    sayHi(): string;
}
```

```ts
// src/index.ts

let cat = new Animal('Tom');
```

Tương tự, câu lệnh `declare class` chỉ có thể được sử dụng để xác định kiểu, không thể được sử dụng để xác định cụ thể hành vi, ví dụ xác định cụ thể hành vi của phương thức `sayHi` sẽ báo lỗi:

```ts
// src/Animal.d.ts

declare class Animal {
    name: string;
    constructor(name: string);
    sayHi() {
        return `My name is ${this.name}`;
    };
    // LỖI: An implementation cannot be declared in ambient contexts.
}
```

#### `declare enum`

Kiểu liệt kê được xác định bằng `declare enum` cũng được gọi là liệt kê ngoại vi (Ambient Enums), ví dụ như sau:

```ts
// src/Directions.d.ts

declare enum Directions {
    Up,
    Down,
    Left,
    Right
}
```

```ts
// src/index.ts

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

Giống như khai báo kiểu biến toàn cục khác, `declare enum` chỉ dùng để xác định kiểu, không phải giá trị cụ thể.

`Directions.d.ts` chỉ được sử dụng cho kiểm tra khi biên dịch, nội dung trong tệp khai báo sẽ bị xóa trong kết quả biên dịch. Kết quả biên dịch của nó là:

```js
var directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

Trong đó `Directions` là biến toàn cục được xác định bởi thư viện bên thứ ba.

#### `declare namespace`

`namespace` là từ khóa được tạo ra trong thời kỳ sớm của TypeScript để giải quyết vấn đề về modularization, được gọi là không gian tên trong tiếng Trung.

Do lịch sử, trong thời kỳ chưa có ES6, TypeScript đã cung cấp một giải pháp modularization, sử dụng từ khóa `module` để chỉ đến các module nội bộ. Tuy nhiên, vì sau này ES6 cũng sử dụng từ khóa `module`, TypeScript đã thay thế `module` của mình bằng `namespace` để tương thích với ES6, đổi tên thành không gian tên.

Với sự phổ biến của ES6, hiện nay không còn khuyến nghị sử dụng `namespace` trong TypeScript, thay vào đó khuyến nghị sử dụng giải pháp modularization của ES6, vì vậy chúng ta không cần phải học cách sử dụng `namespace` nữa.

`namespace` đã bị loại bỏ, nhưng trong tệp khai báo, `declare namespace` vẫn rất phổ biến, nó được sử dụng để chỉ ra rằng biến toàn cục là một đối tượng, chứa nhiều thuộc tính con.

Ví dụ, `jQuery` là một biến toàn cục, nó là một đối tượng, cung cấp một phương thức `jQuery.ajax` có thể gọi, vì vậy chúng ta nên sử dụng `declare namespace jQuery` để khai báo biến toàn cục này có nhiều thuộc tính con.

```ts
// src/jQuery.d.ts

declare namespace jQuery {
    function ajax(url: string, settings?: any): void;
}
```

```ts
// src/index.ts

jQuery.ajax('/api/get_something');
```

Lưu ý, trong `declare namespace`, chúng ta sử dụng trực tiếp `function ajax` để khai báo hàm, thay vì sử dụng `declare function ajax`. Tương tự, chúng ta cũng có thể sử dụng các câu lệnh như `const`, `class`, `enum`, v.v.:

```ts
// src/jQuery.d.ts

declare namespace jQuery {
    function ajax(url: string, settings?: any): void;
    const version: number;
    class Event {
        blur(eventType: EventType): void
    }
    enum EventType {
        CustomClick
    }
}
```

```ts
// src/index.ts

jQuery.ajax('/api/get_something');
console.log(jQuery.version);
const e = new jQuery.Event();
e.blur(jQuery.EventType.CustomClick);
```

##### Không gian tên lồng nhau

Nếu đối tượng có cấu trúc phân cấp sâu, bạn cần sử dụng `namespace` lồng nhau để khai báo kiểu của các thuộc tính ở cấp độ sâu:

```ts
// src/jQuery.d.ts

declare namespace jQuery {
    function ajax(url: string, settings?: any): void;
    namespace fn {
        function extend(object: any): void;
    }
}
```

```ts
// src/index.ts

jQuery.ajax('/api/get_something');
jQuery.fn.extend({
    check: function() {
        return this.each(function() {
            this.checked = true;
        });
    }
});
```

Giả sử `jQuery` chỉ có thuộc tính `fn` (không có `ajax` hoặc các thuộc tính hoặc phương thức khác), thì không cần phải lồng `namespace`:

```ts
// src/jQuery.d.ts

declare namespace jQuery.fn {
    function extend(object: any): void;
}
```

```ts
// src/index.ts

jQuery.fn.extend({
    check: function() {
        return this.each(function() {
            this.checked = true;
        });
    }
});
```

#### `interface` và `type`

Ngoài các biến toàn cục, có thể có một số kiểu mà chúng ta cũng muốn tiết lộ. Trong tệp khai báo kiểu, chúng ta có thể sử dụng trực tiếp `interface` hoặc `type` để khai báo một giao diện hoặc kiểu toàn cục:

```ts
// src/jQuery.d.ts

interface AjaxSettings {
    method?: 'GET' | 'POST'
    data?: any;
}
declare namespace jQuery {
    function ajax(url: string, settings?: AjaxSettings): void;
}
```

Như vậy, trong các tệp khác cũng có thể sử dụng giao diện hoặc kiểu này:

```ts
// src/index.ts

let settings: AjaxSettings = {
    method: 'POST',
    data: {
        name: 'foo'
    }
};
jQuery.ajax('/api/post_something', settings);
```

`type` tương tự như `interface`, không cần giải thích thêm.

##### Tránh xung đột tên

Các `interface` hoặc `type` tiết lộ ở cấp độ cao nhất sẽ hoạt động như các kiểu toàn cục trong toàn bộ dự án, chúng ta nên giảm thiểu số lượng biến toàn cục hoặc kiểu toàn cục. Vì vậy, tốt nhất là đặt chúng vào `namespace`:

```ts
// src/jQuery.d.ts

declare namespace jQuery {
    interface AjaxSettings {
        method?: 'GET' | 'POST'
        data?: any;
    }
    function ajax(url: string, settings?: AjaxSettings): void;
}
```

Lưu ý, khi sử dụng `interface` này, cũng nên thêm tiền tố `jQuery`:

```ts
// src/index.ts

let settings: jQuery.AjaxSettings = {
    method: 'POST',
    data: {
        name: 'foo'
    }
};
jQuery.ajax('/api/post_something', settings);
```

#### Kết hợp khai báo

Giả sử jQuery vừa là một hàm, có thể được gọi trực tiếp `jQuery('#foo')`, vừa là một đối tượng, có các thuộc tính con `jQuery.ajax()` (thực tế cũng vậy), thì chúng ta có thể kết hợp nhiều câu khai báo, chúng sẽ được kết hợp mà không gây xung đột:

```ts
// src/jQuery.d.ts

declare function jQuery(selector: string): any;
declare namespace jQuery {
    function ajax(url: string, settings?: any): void;
}
```

```ts
// src/index.ts

jQuery('#foo');
jQuery.ajax('/api/get_something');
```

Để biết thêm về cách sử dụng kết hợp khai báo, bạn có thể xem phần [[TS Declaration Merging|Kết hợp khai báo]].

### Gói npm

Chúng ta thường import một gói npm bằng cách `import foo from 'foo'`, đây là cách tuân theo quy chuẩn module ES6.

Trước khi chúng ta thử tạo một tệp khai báo cho một gói npm, cần xem trước xem tệp khai báo của nó đã tồn tại chưa. Nói chung, tệp khai báo của gói npm có thể tồn tại ở hai nơi:

1. Được liên kết với gói npm đó. Cách xác định là trong `package.json` có trường `types`, hoặc có một tệp khai báo `index.d.ts`. Cách này không cần cài đặt thêm gói khác, được khuyến nghị nhất, vì vậy sau này khi chúng ta tạo gói npm của riêng mình, tốt nhất cũng nên liên kết tệp khai báo với gói npm.
2. Được phát hành vào `@types`. Chúng ta chỉ cần thử cài đặt gói `@types` tương ứng để biết tệp khai báo đó có tồn tại hay không, lệnh cài đặt là `npm install @types/foo --save-dev`. Cách này thường do người duy trì gói npm không cung cấp tệp khai báo, vì vậy người khác phải phát hành tệp khai báo vào `@types`.

Nếu không tìm thấy tệp khai báo ở cả hai cách trên, thì chúng ta sẽ cần tự viết tệp khai báo cho nó. Do đây là mô-đun được import bằng câu lệnh `import`, vì vậy vị trí lưu trữ tệp khai báo cũng có ràng buộc, thường có hai phương án:

1. Tạo một tệp `node_modules/@types/foo/index.d.ts`, chứa tệp khai báo của mô-đun `foo`. Cách này không cần cấu hình thêm, nhưng thư mục `node_modules` không ổn định, mã không được lưu trong kho, không thể quay lại phiên bản, có nguy cơ bị xóa tình cờ, vì vậy không khuyến nghị sử dụng cách này, thường chỉ dùng cho kiểm tra tạm thời.
2. Tạo một thư mục `types`, dành riêng để quản lý các tệp khai báo mà chúng ta viết, đặt tệp khai báo của `foo` vào `types/foo/index.d.ts`. Cách này cần cấu hình trường `paths` và `baseUrl` trong `tsconfig.json`.

Cấu trúc thư mục:

```plain
/path/to/project
├── src
|  └── index.ts
├── types
|  └── foo
|     └── index.d.ts
└── tsconfig.json
```

Nội dung `tsconfig.json`:

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "baseUrl": "./",
        "paths": {
            "*": ["types/*"]
        }
    }
}
```

Sau khi cấu hình như vậy, khi import `foo`, nó cũng sẽ tìm tệp khai báo của mô-đun tương ứng trong thư mục `types`.

Lưu ý cấu hình `module` có rất nhiều tùy chọn, các tùy chọn khác nhau sẽ ảnh hưởng đến cách import và export mô-đun. Ở đây chúng ta sử dụng `commonjs`, tùy chọn phổ biến nhất, các bài học sau cũng mặc định sử dụng tùy chọn này.

Dù chọn cách nào trong hai cách trên, tôi **khuyến nghị mạnh mẽ** mọi người phát hành tệp khai báo đã viết (thông qua pull request cho thư viện bên thứ ba, hoặc trực tiếp gửi vào `@types`) lên cộng đồng mã nguồn mở, đã tận hưởng nhiều tài nguyên tuyệt vời của cộng đồng, thì nên đóng góp lại khi có thể. Chỉ khi mọi người đều tham gia, cộng đồng ts mới thịnh vượng hơn.

Tệp khai báo gói npm chủ yếu có các cú pháp sau:

- [`export`](#export) Xuất biến
- [`export namespace`](#export-namespace) Xuất đối tượng (có thuộc tính con)
- [`export default`](#export-default) Xuất mặc định ES6
- [`export =`](#export-1) Xuất mô-đun commonjs

#### `export`

Tệp khai báo gói npm khác rất nhiều so với tệp khai báo biến toàn cục. Trong tệp khai báo gói npm, việc sử dụng `declare` không còn khai báo một biến toàn cục, mà chỉ khai báo một biến cục bộ trong tệp hiện tại. Chỉ khi sử dụng `export` để xuất trong tệp khai báo, sau đó `import` ở nơi sử dụng, các khai báo kiểu mới được áp dụng.

Cú pháp `export` tương tự như trong ts thông thường, khác biệt duy nhất là trong tệp khai báo không cho phép định nghĩa cụ thể:

```ts
// types/foo/index.d.ts

export const name: string;
export function getName(): string;
export class Animal {
    constructor(name: string);
    sayHi(): string;
}
export enum Directions {
    Up,
    Down,
    Left,
    Right
}
export interface Options {
    data: any;
}
```

Việc import và sử dụng mô-đun tương ứng nên như sau:

```ts
// src/index.ts

import { name, getName, Animal, Directions, Options } from 'foo';

console.log(name);
let myName = getName();
let cat = new Animal('Tom');
let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
let options: Options = {
    data: {
        name: 'foo'
    }
};
```

##### Kết hợp `declare` và `export`

Chúng ta cũng có thể sử dụng `declare` để khai báo nhiều biến trước, sau đó sử dụng `export` để xuất tất cả một lần. Tệp khai báo trong ví dụ trên có thể được viết lại tương đương như sau:

```ts
// types/foo/index.d.ts

declare const name: string;
declare function getName(): string;
declare class Animal {
    constructor(name: string);
    sayHi(): string;
}
declare enum Directions {
    Up,
    Down,
    Left,
    Right
}
interface Options {
    data: any;
}

export { name, getName, Animal, Directions, Options };
```

Lưu ý, giống như tệp khai báo biến toàn cục, `interface` không cần `declare` phía trước.

#### `export namespace`

Tương tự như `declare namespace`, `export namespace` được sử dụng để xuất một đối tượng có thuộc tính con:

```ts
// types/foo/index.d.ts

export namespace foo {
    const name: string;
    namespace bar {
        function baz(): string;
    }
}
```

```ts
// src/index.ts

import { foo } from 'foo';

console.log(foo.name);
foo.bar.baz();
```

#### `export default`

Trong hệ thống module ES6, sử dụng `export default` có thể xuất một giá trị mặc định, người sử dụng có thể `import foo from 'foo'` thay vì `import { foo } from 'foo'` để nhập giá trị mặc định này.

Trong tệp khai báo kiểu, `export default` được sử dụng để xuất kiểu của giá trị mặc định:

```ts
// types/foo/index.d.ts

export default function foo(): string;
```

```ts
// src/index.ts

import foo from 'foo';

foo();
```

Lưu ý, chỉ có `function`, `class` và `interface` có thể xuất mặc định trực tiếp, các biến khác cần được định nghĩa trước, sau đó xuất mặc định[:

```ts
// types/foo/index.d.ts

export default enum Directions {
// ERROR: Expression expected.
    Up,
    Down,
    Left,
    Right
}
```

Trong ví dụ trên, `export default enum` là cú pháp không chính xác, cần sử dụng `declare enum` để định nghĩa trước, sau đó sử dụng `export default` để xuất:

```ts
// types/foo/index.d.ts

declare enum Directions {
    Up,
    Down,
    Left,
    Right
}

export default Directions;
```

Đối với loại xuất mặc định này, chúng tôi thường đặt câu lệnh xuất ở đầu tệp khai báo:

```ts
// types/foo/index.d.ts

export default Directions;

declare enum Directions {
    Up,
    Down,
    Left,
    Right
}
```

#### `export =`

Trong chuẩn commonjs, chúng ta sử dụng cách sau để xuất một module:

```js
// Xuất toàn bộ
module.exports = foo;
// Xuất từng phần
exports.bar = bar;
```

Trong ts, đối với loại xuất mô-đun này, có nhiều cách để nhập, cách đầu tiên là `const … = require`:

```js
// Nhập toàn bộ
const foo = require('foo');
// Nhập từng phần
const bar = require('foo').bar;
```

Cách thứ hai là `import … from`, lưu ý rằng đối với việc xuất toàn bộ, bạn cần sử dụng `import * as` để nhập:

```ts
// Nhập toàn bộ
import * as foo from 'foo';
// Nhập từng phần
import { bar } from 'foo';
```

Cách thứ ba là `import … require`, đây cũng là cách mà ts khuyên dùng:

```ts
// Nhập toàn bộ
import foo = require('foo');
// Nhập từng phần
import bar = require('foo').bar;
```

Đối với thư viện sử dụng chuẩn commonjs, nếu bạn muốn viết tệp khai báo kiểu cho nó, bạn sẽ cần sử dụng cú pháp `export =`:

```ts
// types/foo/index.d.ts

export = foo;

declare function foo(): string;
declare namespace foo {
    const bar: number;
}
```

Cần lưu ý là, sau khi sử dụng `export =` trong ví dụ trên, bạn không thể xuất từng phần `export { bar }` nữa. Vì vậy, chúng tôi sử dụng kỹ thuật hợp nhất khai báo, sử dụng `declare namespace foo` để hợp nhất `bar` vào `foo`.

Nói chính xác hơn, `export =` không chỉ có thể được sử dụng trong tệp khai báo, mà còn có thể được sử dụng trong tệp ts thông thường. Thực tế, `import … require` và `export =` đều là cú pháp mới mà ts tạo ra để tương thích với chuẩn AMD và commonjs, vì nó không phổ biến và không được khuyến nghị sử dụng, nên tôi sẽ không giới thiệu chi tiết ở đây, nếu bạn quan tâm, bạn có thể xem [tài liệu chính thức](https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require).

Do nhiều thư viện bên thứ ba tuân theo chuẩn commonjs, nên tệp khai báo cũng buộc phải sử dụng cú pháp `export =`. Tuy nhiên, tôi muốn nhấn mạnh lại, so với `export =`, chúng tôi khuyên dùng chuẩn ES6 `export default` và `export`.

### Thư viện UMD

Các thư viện có thể được nạp vào thông qua thẻ `<script>` cũng như thông qua lệnh `import` được gọi là thư viện UMD. So với các tệp khai báo kiểu của gói npm, chúng ta cần khai báo thêm một biến toàn cục. Để thực hiện cách này, ts cung cấp một cú pháp mới `export as namespace`.

#### `export as namespace`

Thông thường khi sử dụng `export as namespace`, trước tiên chúng ta đã có tệp khai báo của gói npm, sau đó dựa vào nó để thêm một câu lệnh `export as namespace`, từ đó có thể khai báo một biến đã khai báo trước đó như một biến toàn cục. Ví dụ như sau:

```ts
// types/foo/index.d.ts

export as namespace foo;
export = foo;

declare function foo(): string;
declare namespace foo {
    const bar: number;
}
```

Tất nhiên, nó cũng có thể được sử dụng cùng với `export default`:

```ts
// types/foo/index.d.ts

export as namespace foo;
export default foo;

declare function foo(): string;
declare namespace foo {
    const bar: number;
}
```

### Mở rộng trực tiếp biến toàn cục

Có một số thư viện bên thứ ba mở rộng một biến toàn cục, nhưng kiểu của biến toàn cục này lại không được cập nhật tương ứng, điều này sẽ dẫn đến lỗi biên dịch ts. Trong trường hợp này, chúng ta cần mở rộng kiểu của biến toàn cục. Ví dụ, mở rộng kiểu `String`:

```ts
interface String {
    prependHello(): string;
}

'foo'.prependHello();
```

Thông qua việc hợp nhất khai báo, sử dụng `interface String` có thể thêm thuộc tính hoặc phương thức cho `String`.

Bạn cũng có thể sử dụng `declare namespace` để thêm khai báo kiểu cho không gian tên hiện có:

```ts
// types/jquery-plugin/index.d.ts

declare namespace JQuery {
    interface CustomOptions {
        bar: string;
    }
}

interface JQueryStatic {
    foo(options: JQuery.CustomOptions): string;
}
```

```ts
// src/index.ts

jQuery.foo({
    bar: ''
});
```

### Phụ thuộc trong tệp khai báo

Một tệp khai báo đôi khi sẽ phụ thuộc vào các kiểu trong tệp khai báo khác. Ví dụ, trong ví dụ về `declare module` trước đây, chúng ta đã nhập `moment` trong tệp khai báo và sử dụng kiểu `moment.CalendarKey`:

```ts
// types/moment-plugin/index.d.ts

import * as moment from 'moment';

declare module 'moment' {
    export function foo(): moment.CalendarKey;
}
```

Ngoài việc có thể nhập các kiểu từ một tệp khai báo khác trong tệp khai báo thông qua `import`, cũng có một cú pháp khác có thể được sử dụng để nhập một tệp khai báo khác, đó là chỉ thị ba gạch chéo.

#### Chỉ thị ba gạch chéo

Giống như `namespace`, chỉ thị ba gạch chéo cũng là một cú pháp mà ts tạo ra trong các phiên bản sớm để mô tả mối quan hệ phụ thuộc giữa các mô-đun. Với sự phổ biến của ES6, ngày nay người ta không còn khuyến nghị sử dụng chỉ thị ba gạch chéo trong ts để khai báo mối quan hệ phụ thuộc giữa các mô-đun.

Tuy nhiên, trong tệp khai báo, nó vẫn có một số ứng dụng.

Tương tự như `import` trong tệp khai báo, nó có thể được sử dụng để nhập một tệp khai báo khác. Sự khác biệt so với `import` là, chỉ khi và chỉ khi trong các tình huống sau, chúng ta mới cần sử dụng chỉ thị ba gạch chéo thay thế cho `import`:

- Khi chúng ta **viết** một tệp khai báo biến toàn cục
- Khi chúng ta cần **phụ thuộc** vào một tệp khai báo biến toàn cục

##### **Viết** một tệp khai báo biến toàn cục

Những tình huống này nghe có vẻ khó hiểu, nhưng thực tế rất dễ hiểu - trong tệp khai báo biến toàn cục, không được phép xuất hiện các từ khóa `import`, `export`. Một khi chúng xuất hiện, tệp đó sẽ được coi là một gói npm hoặc thư viện UMD, không còn là tệp khai báo biến toàn cục nữa. Do đó, khi chúng ta viết một tệp khai báo biến toàn cục, nếu cần sử dụng một kiểu từ thư viện khác, thì chúng ta phải sử dụng chỉ thị ba gạch chéo :

```ts
// types/jquery-plugin/index.d.ts

/// <reference types="jquery" />

declare function foo(options: JQuery.AjaxSettings): string;
```

```ts
// src/index.ts

foo({});
```

Cú pháp của chỉ thị ba gạch chéo như trên, sau `///`, chúng ta sử dụng định dạng xml để thêm phụ thuộc vào kiểu `jquery`, từ đó có thể sử dụng kiểu `JQuery.AjaxSettings` trong tệp khai báo.

Lưu ý, chỉ thị ba gạch chéo phải đặt ở đầu tệp, chỉ có thể có các bình luận đơn dòng hoặc đa dòng ở trước chỉ thị ba gạch chéo.

##### **Phụ thuộc** vào một tệp khai báo biến toàn cục

Trong một tình huống khác, khi chúng ta cần phụ thuộc vào một tệp khai báo biến toàn cục, do biến toàn cục không hỗ trợ nhập thông qua `import`, chúng ta cũng phải sử dụng chỉ thị ba gạch chéo để nhập:

```ts
// types/node-plugin/index.d.ts

/// <reference types="node" />

export function foo(p: NodeJS.Process): string;
```

```ts
// src/index.ts

import { foo } from 'node-plugin';

foo(global.process);
```

Trong ví dụ trên, chúng ta đã nhập kiểu `node` thông qua chỉ thị ba gạch chéo, sau đó sử dụng kiểu `NodeJS.Process` trong tệp khai báo. Cuối cùng, khi sử dụng `foo`, chúng ta truyền vào biến toàn cục `process` của `node`.

Do các kiểu được nhập từ `node` đều là kiểu của biến toàn cục, chúng không thể được nhập thông qua `import`, vì vậy trong tình huống này, chúng ta cũng chỉ có thể sử dụng chỉ thị ba gạch chéo để nhập.

Trong hai tình huống sử dụng trên, cả hai đều do cần viết hoặc cần phụ thuộc vào tệp khai báo biến toàn cục, nên chúng ta phải sử dụng chỉ thị ba gạch chéo. Trong các tình huống khác không cần phải sử dụng chỉ thị ba gạch chéo, chúng ta nên sử dụng `import` để nhập.

##### Tách tệp khai báo

Khi tệp khai báo biến toàn cục của chúng ta quá lớn, chúng ta có thể tách nó thành nhiều tệp, sau đó nhập chúng một cách tuần tự trong một tệp đầu vào, để cải thiện khả năng bảo dưỡng mã nguồn. Ví dụ, tệp khai báo của `jQuery` cũng như vậy:

```ts
// node_modules/@types/jquery/index.d.ts

/// <reference types="sizzle" />
/// <reference path="JQueryStatic.d.ts" />
/// <reference path="JQuery.d.ts" />
/// <reference path="misc.d.ts" />
/// <reference path="legacy.d.ts" />

export = jQuery;
```

Trong đó, chúng ta đã sử dụng hai chỉ thị ba gạch chéo khác nhau. Sự khác biệt giữa chúng là: `types` được sử dụng để khai báo phụ thuộc vào một thư viện khác, trong khi `path` được sử dụng để khai báo phụ thuộc vào một tệp khác.

Trong ví dụ trên, `sizzle` là một thư viện khác song song với `jquery`, vì vậy chúng ta cần sử dụng `types="sizzle"` để khai báo phụ thuộc vào nó. Còn các chỉ thị ba gạch chéo khác thì đã tách khai báo của `jquery` thành các tệp khác nhau, sau đó sử dụng `path="foo"` để nhập chúng một cách tuần tự trong tệp đầu vào.

##### Chỉ thị ba gạch chéo khác

Ngoài hai chỉ thị ba gạch chéo trên, còn có các chỉ thị ba gạch chéo khác, như `/// <reference no-default-lib="true"/>`, `/// <amd-module />` vv, nhưng chúng đều là cú pháp đã bị loại bỏ, vì vậy tôi sẽ không giới thiệu ở đây, chi tiết xem [trang chủ](http://www.typescriptlang.org/docs/handbook/triple-slash-directives.html).

### Tự động tạo tệp khai báo

Nếu mã nguồn của thư viện được viết bằng ts, thì khi sử dụng script `tsc` để biên dịch ts thành js, thêm tùy chọn `declaration`, bạn cũng có thể tạo ra tệp khai báo `.d.ts` cùng lúc.

Bạn có thể thêm `--declaration` (viết tắt `-d`) vào dòng lệnh, hoặc thêm tùy chọn `declaration` vào `tsconfig.json`. Dưới đây là ví dụ về `tsconfig.json`:

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "outDir": "lib",
        "declaration": true,
    }
}
```

Trong ví dụ trên, chúng tôi đã thêm tùy chọn `outDir`, xuất kết quả biên dịch của tệp ts vào thư mục `lib`, sau đó thêm tùy chọn `declaration`, đặt thành `true`, có nghĩa là sẽ tự động tạo tệp khai báo `.d.ts` từ tệp ts, cũng sẽ được xuất vào thư mục `lib`.

Sau khi chạy `tsc`, cấu trúc thư mục như sau:

```plain
/path/to/project
├── lib
|  ├── bar
|  |  ├── index.d.ts
|  |  └── index.js
|  ├── index.d.ts
|  └── index.js
├── src
|  ├── bar
|  |  └── index.ts
|  └── index.ts
├── package.json
└── tsconfig.json
```

Trong ví dụ này, có hai tệp ts trong thư mục `src`, đó là `src/index.ts` và `src/bar/index.ts`, chúng được biên dịch vào thư mục `lib` và cũng tạo ra hai tệp khai báo tương ứng `lib/index.d.ts` và `lib/bar/index.d.ts`. Nội dung của chúng như sau:

```ts
// src/index.ts

export * from './bar';

export default function foo() {
    return 'foo';
}
```

```ts
// src/bar/index.ts

export function bar() {
    return 'bar';
}
```

```ts
// lib/index.d.ts

export * from './bar';
export default function foo(): string;
```

```ts
// lib/bar/index.d.ts

export declare function bar(): string;
```

Như bạn thấy, tệp khai báo được tạo tự động cơ bản giữ nguyên cấu trúc của mã nguồn, nhưng loại bỏ cụ thể triển khai và tạo ra khai báo kiểu tương ứng.

Khi sử dụng `tsc` để tự động tạo tệp khai báo, mỗi tệp ts sẽ tương ứng với một tệp khai báo `.d.ts`. Lợi ích của việc này là người sử dụng không chỉ có thể nhận được gợi ý về kiểu khi sử dụng `import foo from 'foo'` để nhập mô-đun mặc định, mà còn có thể nhận được gợi ý về kiểu khi sử dụng `import bar from 'foo/lib/bar'` để nhập một mô-đun con.

Ngoài tùy chọn `declaration`, còn có một số tùy chọn khác liên quan đến việc tự động tạo tệp khai báo, tôi chỉ đơn giản liệt kê ở đây, không thực hiện chi tiết:

- `declarationDir` thiết lập thư mục để tạo tệp `.d.ts`
- `declarationMap` tạo tệp `.d.ts.map` (sourcemap) tương ứng cho mỗi tệp `.d.ts`
- `emitDeclarationOnly` chỉ tạo tệp `.d.ts`, không tạo tệp `.js`

### Xuất bản tệp khai báo

Sau khi chúng ta đã viết xong tệp khai báo cho một thư viện, bước tiếp theo là xuất bản nó.

Hiện tại có hai phương án:

1. Đặt tệp khai báo và mã nguồn cùng nhau
2. Xuất bản tệp khai báo vào `@types`

Trong hai phương án này, nên ưu tiên chọn phương án thứ nhất. Giữ tệp khai báo cùng với mã nguồn, khi sử dụng không cần phải thêm phụ thuộc vào thư viện khai báo riêng biệt, và cũng đảm bảo phiên bản của tệp khai báo phù hợp với phiên bản mã nguồn.

Chỉ khi chúng ta thêm tệp khai báo cho kho lưu trữ của người khác, nhưng tác giả gốc không muốn hợp nhất pull request, thì mới cần sử dụng phương án thứ hai, xuất bản tệp khai báo vào `@types`.

### Đặt tệp khai báo và mã nguồn cùng nhau

Nếu tệp khai báo được tạo ra tự động bằng `tsc`, thì không cần cấu hình gì thêm, chỉ cần xuất bản các tệp đã biên dịch vào npm, người sử dụng sẽ nhận được gợi ý về kiểu.

Nếu là tệp khai báo viết thủ công, thì cần đáp ứng một trong các điều kiện sau, mới có thể được nhận dạng đúng:

- Đặt địa chỉ của một tệp khai báo vào trường `types` hoặc `typings` trong `package.json`
- Tạo một tệp `index.d.ts` trong thư mục gốc của dự án
- Tạo một tệp `.d.ts` cùng tên với tệp nhập (tệp mà trường `main` trong `package.json` chỉ đến)

Cách đầu tiên là đặt địa chỉ của một tệp khai báo vào trường `types` hoặc `typings` trong `package.json`. Ví dụ:

```json
{
    "name": "foo",
    "version": "1.0.0",
    "main": "lib/index.js",
    "types": "foo.d.ts",
}
```

Sau khi chỉ định `types` là `foo.d.ts`, khi nhập thư viện này, nó sẽ tìm `foo.d.ts` và xem đó là tệp khai báo cho thư viện này.

`typings` giống như `types`, chỉ là cách viết khác.

Nếu không chỉ định `types` hoặc `typings`, nó sẽ tìm tệp `index.d.ts` trong thư mục gốc, và xem nó là tệp khai báo cho thư viện này.

Nếu không tìm thấy tệp `index.d.ts`, nó sẽ tìm xem có tệp `.d.ts` cùng tên với tệp nhập (tệp mà trường `main` trong `package.json` chỉ đến) hay không.

Ví dụ, khi `package.json` như sau:

```json
{
    "name": "foo",
    "version": "1.0.0",
    "main": "lib/index.js"
}
```

Nó sẽ kiểm tra xem có trường `types` hoặc `typings` trong `package.json` hay không. Nếu không, nó sẽ tìm xem có tệp `index.d.ts` hay không. Nếu vẫn không tìm thấy, nó sẽ tìm xem có tệp `lib/index.d.ts` hay không. Nếu không tìm thấy tệp `lib/index.d.ts`, nó sẽ coi đó là thư viện không cung cấp tệp khai báo.

Đối với một số thư viện hỗ trợ nhập mô-đun con, ví dụ `import bar from 'foo/lib/bar'`, cần viết thêm một tệp khai báo `lib/bar.d.ts` hoặc `lib/bar/index.d.ts`. Điều này giống như việc tự động tạo tệp khai báo, một thư viện có thể chứa nhiều tệp khai báo.

### Xuất bản tệp khai báo vào `@types`

Nếu chúng ta đang thêm tệp khai báo cho kho lưu trữ của người khác, nhưng tác giả gốc không muốn hợp nhất pull request, thì cần xuất bản tệp khai báo vào `@types`.

Khác với mô-đun npm thông thường, `@types` được quản lý chung bởi [DefinitelyTyped][]. Để xuất bản tệp khai báo vào `@types`, bạn cần tạo một pull-request cho [DefinitelyTyped][], bao gồm tệp khai báo, mã kiểm tra, và `tsconfig.json`, v.v.

Pull-request cần tuân thủ quy tắc của họ và vượt qua kiểm tra, mới có thể được hợp nhất, sau đó sẽ tự động được xuất bản vào `@types`.

Để tạo một tệp khai báo mới trong [DefinitelyTyped][], bạn cần sử dụng một số công cụ, tài liệu của [DefinitelyTyped][] đã có [hướng dẫn chi tiết](https://github.com/DefinitelyTyped/DefinitelyTyped#create-a-new-package), tôi sẽ không giải thích chi tiết ở đây, hãy xem tài liệu chính thức.
