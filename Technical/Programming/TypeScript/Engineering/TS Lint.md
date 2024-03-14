---
title: TS Lint
tags:
  - ts
categories:
  - ts
date created: 2024-03-15
date modified: 2024-03-15
---

# Kiểm tra mã

Vào tháng 1 năm 2019, [TypeScript chính thức quyết định sử dụng hoàn toàn ESLint] như công cụ kiểm tra mã và tạo ra một dự án mới [typescript-eslint][], cung cấp bộ phân tích cú pháp cho tệp TypeScript [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/parser) và các tùy chọn cấu hình liên quan [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin) v.v. Trong khi đó, hai giải pháp lint trước đó sẽ không được sử dụng nữa:

- [typescript-eslint-parser](https://github.com/eslint/typescript-eslint-parser) đã dừng bảo dưỡng
- [TSLint](https://palantir.github.io/tslint/) sẽ cung cấp công cụ di chuyển và dừng bảo dưỡng TSLint sau khi typescript-eslint đủ tính năng (Once we consider ESLint feature-complete w.r.t. TSLint, we will deprecate TSLint and help users migrate to ESLint.

Tổng kết, giải pháp kiểm tra mã cho TypeScript hiện tại và tương lai là [typescript-eslint][].

## Kiểm tra mã là gì

Kiểm tra mã chủ yếu được sử dụng để phát hiện lỗi mã, thống nhất phong cách mã.

Trong dự án JavaScript, chúng ta thường sử dụng [ESLint][] để kiểm tra mã, nó mở rộng phạm vi ứng dụng rất lớn thông qua tính năng plug-in, kết hợp với [typescript-eslint][], thậm chí có thể được sử dụng để kiểm tra mã TypeScript.

## Tại sao cần kiểm tra mã

Có người sẽ nghĩ, JavaScript rất linh hoạt, vì vậy cần kiểm tra mã. Nhưng TypeScript đã có thể kiểm tra nhiều vấn đề trong giai đoạn biên dịch, vì sao vẫn cần kiểm tra mã?

Bởi vì TypeScript tập trung vào kiểm tra kiểu, chứ không phải phong cách mã. Khi số lượng thành viên trong nhóm tăng lên, cùng một logic có thể có sự khác biệt lớn khi được viết bởi những người khác nhau:

- Thụt lề nên là bốn khoảng trắng hay hai khoảng trắng?
- Có nên cấm sử dụng `var` không?
- Tên interface có nên bắt đầu bằng `I` không?
- Có nên ép buộc sử dụng `===` thay vì `==` không?

Những vấn đề này TypeScript không quan tâm, nhưng lại ảnh hưởng đến hiệu quả phát triển khi làm việc nhóm, tính khả hiểu và bảo dưỡng của mã.

Hãy xem một ví dụ cụ thể:

```ts
var myName = 'Tom';

console.log(`My name is ${myNane}`);
console.log(`My name is ${myName.toStrng()}`);
```

Bạn có thể nhìn thấy có lỗi gì trong mã trên không?

Sau khi biên dịch bằng tsc và kiểm tra bằng eslint, thông báo lỗi như sau:

```ts
var myName = 'Tom';
// Thông báo lỗi eslint:
// Unexpected var, use let or const instead.eslint(no-var)

console.log(`My name is ${myNane}`);
// Thông báo lỗi tsc:
// Cannot find name 'myNane'. Did you mean 'myName'?
// Thông báo lỗi eslint:
// 'myNane' is not defined.eslint(no-undef)
console.log(`My name is ${myName.toStrng()}`);
// Thông báo lỗi tsc:
// Property 'toStrng' does not exist on type 'string'. Did you mean 'toString'?
```

| Vấn đề tồn tại                               | `tsc` có báo lỗi không | `eslint` có báo lỗi không |
| -------------------------------------------- | ---------------------- | ------------------------- |
| Nên sử dụng `let` hoặc `const` thay vì `var` | ❌                      | ✅                         |
| `myName` bị viết sai thành `myNane`          | ✅                      | ✅                         |
| `toString` bị viết sai thành `toStrng`       | ✅️                     | ❌                         |

Trong ví dụ trên, chúng tôi sử dụng `var` để định nghĩa một biến, nhưng thực tế là ES6 có cú pháp tiên tiến hơn là `let` và `const`, lúc này có thể kiểm tra bằng `eslint`, nhắc nhở chúng tôi nên sử dụng `let` hoặc `const` thay vì `var`.

Đối với biến chưa được định nghĩa `myNane`, `tsc` và `eslint` đều có thể kiểm tra.

Vì `eslint` không thể nhận biết `myName` có những phương thức nào, nên không kiểm tra được lỗi chính tả của `toString`.

Từ đó có thể thấy, `eslint` có thể phát hiện ra một số lỗi mà `tsc` không quan tâm, kiểm tra ra một số vấn đề tiềm ẩn, vì vậy việc kiểm tra mã là rất quan trọng.

## Sử dụng ESLint trong TypeScript

### Cài đặt ESLint

ESLint có thể được cài đặt trong dự án hiện tại hoặc môi trường toàn cầu, bởi vì kiểm tra mã là một phần quan trọng của dự án, vì vậy chúng tôi thường sẽ cài đặt nó trong dự án hiện tại. Bạn có thể chạy lệnh sau để cài đặt:

```bash
npm install --save-dev eslint
```

Vì ESLint mặc định sử dụng [Espree](https://github.com/eslint/espree) để phân tích cú pháp, nó không thể nhận biết một số cú pháp TypeScript, vì vậy chúng tôi cần cài đặt [`@typescript-eslint/parser`](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser), để thay thế trình phân tích cú pháp mặc định, đừng quên cài đặt `typescript` cùng lúc:

```bash
npm install --save-dev typescript @typescript-eslint/parser
```

Tiếp theo, bạn cần cài đặt plugin tương ứng [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin). Nó bổ sung cho các quy tắc mặc định của eslint, cung cấp một số quy tắc bổ sung phù hợp với cú pháp ts.

```bash
npm install --save-dev @typescript-eslint/eslint-plugin
```

### Tạo tệp cấu hình

ESLint cần một tệp cấu hình để quyết định kiểm tra quy tắc nào, tên tệp cấu hình thường là `.eslintrc.js` hoặc `.eslintrc.json`.

Khi chạy ESLint để kiểm tra một tệp, nó sẽ đầu tiên cố gắng đọc tệp cấu hình trong thư mục của tệp đó, sau đó tìm kiếm từng cấp một lên trên, kết hợp các cấu hình tìm thấy, làm cấu hình cho tệp đang kiểm tra.

Chúng tôi tạo một `.eslintrc.js` trong thư mục gốc của dự án, nội dung như sau:

```js
module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules: {
        // Cấm sử dụng var
        'no-var': "error",
        // Ưu tiên sử dụng interface thay vì type
        '@typescript-eslint/consistent-type-definitions': [
            "error",
            "interface"
        ]
    }
}
```

Trong cấu hình trên, chúng tôi chỉ định hai quy tắc, trong đó `no-var` là quy tắc gốc của ESLint, `@typescript-eslint/consistent-type-definitions` là quy tắc mới của `@typescript-eslint/eslint-plugin`.

Giá trị của quy tắc thường là một mảng (như `@typescript-eslint/consistent-type-definitions` trong ví dụ trên), trong đó mục đầu tiên là `off`, `warn` hoặc `error`, tương ứng với tắt, cảnh báo và báo lỗi. Các mục sau đó là các cấu hình khác của quy tắc.

Nếu không có cấu hình khác, thì giá trị của quy tắc có thể được rút gọn thành mục đầu tiên trong mảng (như `no-var` trong ví dụ trên).

Ý nghĩa của tắt, cảnh báo và báo lỗi là:

- Tắt: vô hiệu hóa quy tắc này
- Cảnh báo: xuất thông báo lỗi khi kiểm tra mã, nhưng không ảnh hưởng đến exit code
- Báo lỗi: khi phát hiện lỗi, không chỉ xuất thông báo lỗi, mà còn đặt exit code thành 1 (thông thường, nếu exit code không phải là 0, điều này có nghĩa là đã xảy ra lỗi khi thực hiện)

### Kiểm tra một tệp ts

Sau khi tạo tệp cấu hình, chúng ta hãy tạo một tệp ts để xem liệu có thể sử dụng ESLint để kiểm tra nó hay không.

Tạo một tệp mới `index.ts` và sao chép nội dung sau vào đó:

```ts
var myName = 'Tom';

type Foo = {};
```

Sau đó thực hiện lệnh sau:

```bash
./node_modules/.bin/eslint index.ts
```

Bạn sẽ nhận được thông báo lỗi sau:

```bash
/path/to/index.ts
  1:1  error  Unexpected var, use let or const instead  no-var
  3:6  error  Use an `interface` instead of a `type`    @typescript-eslint/consistent-type-definitions

✖ 2 problems (2 errors, 0 warnings)
  2 errors and 0 warnings potentially fixable with the `--fix` option.
```

Kết quả trên cho thấy hai quy tắc mà chúng ta vừa cấu hình đều hoạt động: cấm sử dụng `var`; ưu tiên sử dụng `interface` thay vì `type`.

Lưu ý rằng chúng tôi sử dụng `./node_modules/.bin/eslint`, không phải là script `eslint` toàn cầu, bởi vì kiểm tra mã là một phần quan trọng của dự án, vì vậy chúng tôi thường sẽ cài đặt nó trong dự án hiện tại.

Tuy nhiên, việc thực hiện một đoạn script dài như vậy mỗi lần khá là bất tiện, chúng ta có thể tạo một npm script trong `package.json` để đơn giản hóa bước này:

```json
{
    "scripts": {
        "eslint": "eslint index.ts"
    }
}
```

Bây giờ, chỉ cần chạy `npm run eslint`.

### Kiểm tra tất cả các tệp ts của toàn bộ dự án

Mã nguồn của dự án thường được đặt trong thư mục `src`, vì vậy chúng ta cần thay đổi script `eslint` trong `package.json` để kiểm tra một thư mục. Vì `eslint` mặc định sẽ không kiểm tra các tệp có phần mở rộng `.ts`, nên chúng ta cần thêm tham số `--ext .ts`:

```json
{
    "scripts": {
        "eslint": "eslint src --ext .ts"
    }
}
```

Bây giờ, khi chạy `npm run eslint`, tất cả các tệp có phần mở rộng `.ts` trong thư mục `src` sẽ được kiểm tra.

### Tích hợp kiểm tra ESLint trong VSCode

Tích hợp kiểm tra ESLint trong trình biên tập có thể giúp phát hiện lỗi trong quá trình phát triển, thậm chí có thể tự động sửa lỗi khi lưu, đáng kể tăng hiệu quả phát triển.

Để tích hợp kiểm tra ESLint trong VSCode, chúng ta cần cài đặt plugin ESLint trước, nhấp vào nút "Mở rộng", tìm kiếm ESLint, sau đó cài đặt.

Plugin ESLint trong VSCode mặc định sẽ không kiểm tra các tệp có phần mở rộng `.ts`, cần thêm cấu hình sau vào "Code => Settings => Settings => Work Space" (hoặc tạo một tệp cấu hình `.vscode/settings.json` trong thư mục gốc của dự án):

```json
{
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript"
    ],
    "typescript.tsdk": "node_modules/typescript/lib"
}
```

Bây giờ, khi mở một tệp `.ts`, di chuyển chuột đến nơi có gợi ý màu đỏ.

Chúng ta cũng có thể bật tính năng tự động sửa lỗi khi lưu, thông qua cấu hình:

```json
{
    "eslint.autoFixOnSave": true,
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        {
            "language": "typescript",
            "autoFix": true
        },
    ],
    "typescript.tsdk": "node_modules/typescript/lib"
}
```

Sau đó, khi lưu tệp, nó sẽ tự động được sửa thành:

```ts
let myName = 'Tom';

interface Foo {}
```

### Sử dụng Prettier để sửa lỗi định dạng

ESLint bao gồm một số kiểm tra định dạng mã, chẳng hạn như dấu cách, dấu chấm phẩy, v.v. Tuy nhiên, trong cộng đồng front-end, có một công cụ tiên tiến hơn có thể được sử dụng để định dạng mã, đó là [Prettier](https://prettier.io/).

Prettier tập trung vào việc định dạng mã, thông qua phân tích cú pháp, tái cấu trúc định dạng của mã, để cho phép tất cả mọi người giữ cùng một phong cách mã.

Đầu tiên, bạn cần cài đặt Prettier:

```bash
npm install --save-dev prettier
```

Sau đó, tạo một tệp `prettier.config.js` chứa các tùy chọn cấu hình của Prettier. Prettier có rất ít tùy chọn cấu hình, dưới đây tôi sẽ giới thiệu một quy tắc cấu hình mà tôi khuyến nghị mọi người tham khảo:

```js
// prettier.config.js or .prettierrc.js
module.exports = {
    // Maximum 100 characters per line
    printWidth: 100,
    // Use 4 spaces for indentation
    tabWidth: 4,
    // Use spaces, not indentation characters
    useTabs: false,
    // End lines with semicolons
    semi: true,
    // Use single quotes
    singleQuote: true,
    // Only use quotes around object keys when necessary
    quoteProps: 'as-needed',
    // Do not use single quotes in jsx, use double quotes
    jsxSingleQuote: false,
    // No need for commas at the end
    trailingComma: 'none',
    // Spaces are required at the beginning and end of braces
    bracketSpacing: true,
    // The closing bracket of the jsx tag needs a line break
    jsxBracketSameLine: false,
    // Arrow functions, even when there is only one parameter, need parentheses
    arrowParens: 'always',
    // The range of each file format is the entire content of the file
    rangeStart: 0,
    rangeEnd: Infinity,
    // No need to write @prettier at the beginning of the file
    requirePragma: false,
    // No need to automatically insert @prettier at the beginning of the file
    insertPragma: false,
    // Use the default line break standard
    proseWrap: 'preserve',
    // Decide whether or not to wrap html based on display style
    htmlWhitespaceSensitivity: 'css',
    // Use lf for line breaks
    endOfLine: 'lf'
};
```

Tiếp theo, cài đặt plugin Prettier trong VSCode, sau đó chỉnh sửa `.vscode/settings.json`:

```json
{
    "files.eol": "\n",
    "editor.tabSize": 4,
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "eslint.autoFixOnSave": true,
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        {
            "language": "typescript",
            "autoFix": true
        }
    ],
    "typescript.tsdk": "node_modules/typescript/lib"
}
```

Điều này sẽ tự động định dạng và tự động sửa các lỗi ESLint khi lưu tệp.

Lưu ý rằng, vì ESLint cũng có thể kiểm tra một số vấn đề định dạng mã, khi sử dụng với Prettier, chúng ta thường sẽ tắt các quy tắc liên quan đến định dạng mã trong ESLint, nếu không sẽ có xung đột.

### Sử dụng cấu hình ESLint của AlloyTeam

Có quá nhiều quy tắc trong ESLint gốc và `@typescript-eslint/eslint-plugin`, và một số quy tắc gốc không được hỗ trợ tốt trong TypeScript và cần được tắt.

Tại đây, tôi khuyên bạn nên sử dụng [phiên bản TypeScript của quy tắc ESLint của AlloyTeam](https://github.com/AlloyTeam/eslint-config-alloy#typescript). Nó đã cung cấp cho chúng ta một bộ cấu hình quy tắc hoàn chỉnh và hoàn toàn tương thích với Prettier (eslint-config-alloy không chứa bất kỳ quy tắc định dạng mã nào, các vấn đề liên quan đến định dạng mã sẽ được Prettier chuyên nghiệp xử lý).

Cài đặt:

```bash
npm install --save-dev eslint typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-alloy
```

Tạo một tệp `.eslintrc.js` trong thư mục gốc của dự án của bạn và sao chép nội dung sau vào tệp:

```js
module.exports = {
    extends: [
        'alloy',
        'alloy/typescript',
    ],
    env: {
        // Biến môi trường của bạn (bao gồm nhiều biến toàn cục được định nghĩa trước)
        // Your environments (which contains several predefined global variables)
        //
        // browser: true,
        // node: true,
        // mocha: true,
        // jest: true,
        // jquery: true
    },
    globals: {
        // Biến toàn cục của bạn (đặt thành false có nghĩa là nó không được phép gán lại)
        // Your global variables (setting to false means it's not allowed to be reassigned)
        //
        // myGlobal: false
    },
    rules: {
        // Tùy chỉnh quy tắc của bạn
        // Customize your rules
    }
};
```

Để biết thêm cách sử dụng, vui lòng tham khảo [Quy tắc ESLint của AlloyTeam](https://github.com/AlloyTeam/eslint-config-alloy).

### Sử dụng ESLint để kiểm tra các tệp tsx

Nếu bạn cần hỗ trợ kiểm tra các tệp tsx cùng lúc, bạn cần điều chỉnh một số bước trên:

#### Cài đặt `eslint-plugin-react`

```bash
npm install --save-dev eslint-plugin-react
```

#### Thêm phần mở rộng `.tsx` vào scripts.eslint trong package.json

```json
{
    "scripts": {
        "eslint": "eslint src --ext .ts,.tsx"
    }
}
```

#### Thêm kiểm tra typescriptreact vào cấu hình của VSCode

```json
{
    "files.eol": "\\n",
    "editor.tabSize": 4,
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "eslint.autoFixOnSave": true,
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        {
            "language": "typescript",
            "autoFix": true
        },
        {
            "language": "typescriptreact",
            "autoFix": true
        }
    ],
    "typescript.tsdk": "node_modules/typescript/lib"
}
```

#### Sử dụng phiên bản TypeScript React của quy tắc ESLint của AlloyTeam

[Phiên bản TypeScript React của quy tắc ESLint của AlloyTeam](https://github.com/AlloyTeam/eslint-config-alloy#typescript-react)

## Xử lý sự cố

### Không tìm thấy module '@typescript-eslint/parser'

Bạn đang chạy eslint toàn cục, cần đổi thành chạy `./node_modules/.bin/eslint`.

### VSCode không hiển thị lỗi của ESLint

1. Kiểm tra xem bạn đã cấu hình đúng trong "File => Preferences => Settings" chưa
2. Kiểm tra xem các gói npm cần thiết đã được cài đặt chưa
3. Kiểm tra xem `.eslintrc.js` đã được cấu hình chưa
4. Kiểm tra xem tệp có nằm trong `.eslintignore` không

Nếu tất cả các bước trên đều không hiệu quả, bạn có thể cấu hình `"eslint.trace.server": "messages"` trong "File => Preferences => Settings", nhấn `Ctrl`+`Shift`+`U` để mở bảng xuất, sau đó chọn xuất ESLint để xem lỗi cụ thể.

![Xuất ESLint của VSCode](../assets/vscode-output-eslint.png)

### Tại sao một số biến được định nghĩa (ví dụ như biến được định nghĩa bằng `enum`) không được sử dụng, nhưng ESLint lại không báo lỗi?

Bởi vì không thể hỗ trợ việc kiểm tra định nghĩa biến này. Đề nghị thêm cấu hình sau vào `tsconfig.json` để quá trình biên dịch `tsc` có thể kiểm tra được các biến được định nghĩa nhưng không sử dụng:

```json
{
    "compilerOptions": {
        "noUnusedLocals": true,
        "noUnusedParameters": true
    }
}
```

### Sau khi kích hoạt noUnusedParameters, chỉ sử dụng tham số thứ hai, nhưng lại phải truyền vào tham số đầu tiên, điều này sẽ báo lỗi

Tham số đầu tiên có thể bắt đầu bằng dấu gạch dưới, xem thêm tại https://github.com/Microsoft/TypeScript/issues/9458

[ESLint]: https://eslint.org/
[typescript-eslint]: https://github.com/typescript-eslint/typescript-eslint
