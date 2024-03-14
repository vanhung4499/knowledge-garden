---
title: TS Type Assertion
tags:
  - ts
categories:
  - ts
date created: 2023-12-30
date modified: 2024-03-15
---

# Type Assertion

Xác nhận kiểu (Type Assertion) được sử dụng để xác định một giá trị có kiểu dữ liệu cụ thể.

## Cú pháp

```ts
value as type
```

hoặc

```ts
<type>value
```

Trong cú pháp tsx (phiên bản ts của jsx trong React), chúng ta phải sử dụng cú pháp đầu tiên, tức là `value as type`.

Cú pháp dạng `<Foo>` trong tsx thường được sử dụng để đại diện cho một `ReactNode`, trong ts ngoài việc sử dụng để Xác nhận kiểu dữ liệu, cũng có thể được sử dụng để đại diện cho một [[TS Generics|generic]].

Vì vậy, chúng tôi khuyến nghị rằng khi sử dụng Xác nhận kiểu, hãy sử dụng cú pháp `value as type`, và tôi sẽ tuân thủ nguyên tắc này trong hướng dẫn này.

## Mục đích của Type Assertion

Type Assertion thường được sử dụng cho các mục đích sau:

- Chuyển đổi kiểu dữ liệu: Xác nhận kiểu cho phép chúng ta chuyển đổi một giá trị từ kiểu dữ liệu này sang kiểu dữ liệu khác.
- Gợi ý kiểu dữ liệu: Trong một số trường hợp, TypeScript không thể xác định chính xác kiểu dữ liệu của một giá trị. Xác nhận kiểu có thể được sử dụng để gợi ý kiểu dữ liệu cho TypeScript.
- Xác định kiểu dữ liệu: Trong một số trường hợp, chúng ta có thể biết chính xác kiểu dữ liệu của một giá trị và sử dụng Xác nhận kiểu để xác định kiểu dữ liệu đó.

### Chuyển đổi một kiểu liên hợp thành một kiểu cơ bản

[[TS Union Types#Truy cập thuộc tính hoặc phương thức của kiểu liên hợp|Như đã đề cập trước đó]], khi TypeScript không chắc chắn biến của một kiểu liên hợp thuộc loại nào, chúng ta **chỉ có thể truy cập các thuộc tính hoặc phương thức chung của tất cả các kiểu trong kiểu liên hợp đó**:

```ts
interface Cat {
    name: string;
    run(): void;
}
interface Fish {
    name: string;
    swim(): void;
}

function getName(animal: Cat | Fish) {
    return animal.name;
}
```

Tuy nhiên, đôi khi chúng ta thực sự cần truy cập vào một thuộc tính hoặc phương thức đặc biệt của một trong các kiểu khi kiểu vẫn chưa xác định, ví dụ:

```ts
interface Cat {
    name: string;
    run(): void;
}
interface Fish {
    name: string;
    swim(): void;
}

function isFish(animal: Cat | Fish) {
    if (typeof animal.swim === 'function') {
        return true;
    }
    return false;
}

// index.ts:11:23 - error TS2339: Property 'swim' does not exist on type 'Cat | Fish'.
//   Property 'swim' does not exist on type 'Cat'.
```

Trong ví dụ trên, khi truy cập `animal.swim` sẽ gây ra lỗi.

Trong trường hợp này, chúng ta có thể sử dụng Type Assertion để Xác nhận `animal` là `Fish`:

```ts
interface Cat {
    name: string;
    run(): void;
}
interface Fish {
    name: string;
    swim(): void;
}

function isFish(animal: Cat | Fish) {
    if (typeof (animal as Fish).swim === 'function') {
        return true;
    }
    return false;
}
```

Điều này giúp giải quyết vấn đề lỗi khi truy cập `animal.swim`.

Tuy nhiên, Type Assertion chỉ có thể "lừa dối" trình biên dịch TypeScript, không thể tránh được runtime error, thậm chí việc sử dụng Type Assertion sai cũng có thể gây ra runtime error:

```ts
interface Cat {
    name: string;
    run(): void;
}
interface Fish {
    name: string;
    swim(): void;
}

function swim(animal: Cat | Fish) {
    (animal as Fish).swim();
}

const tom: Cat = {
    name: 'Tom',
    run() { console.log('run') }
};
swim(tom);
// Uncaught TypeError: animal.swim is not a function`
```

Ví dụ trên không báo lỗi khi biên dịch, nhưng gặp runtime error:

```text
Uncaught TypeError: animal.swim is not a function`
```

Lý do là `(animal as Fish).swim()` đã ẩn đi trường hợp `animal` có thể là `Cat`, và chúng ta đã Xác nhận trực tiếp `animal` là `Fish`, trình biên dịch TypeScript tin tưởng vào Xác nhận của chúng ta, vì vậy không có lỗi biên dịch khi gọi `swim()`.

Tuy nhiên, hàm `swim` chấp nhận tham số là `Cat | Fish`, nếu tham số được truyền vào là biến kiểu `Cat`, vì `Cat` không có phương thức `swim`, điều này sẽ gây ra runtime error.

Tóm lại, khi sử dụng Type Assertion, chúng ta phải cẩn thận và tránh sử dụng phương thức hoặc truy cập thuộc tính sâu, để giảm thiểu runtime error không cần thiết.

### Chuyển đổi một lớp cha thành lớp con cụ thể hơn

Khi có mối quan hệ kế thừa giữa các lớp, việc chuyển đổi kiểu cũng là rất phổ biến:

```ts
class ApiError extends Error {
    code: number = 0;
}
class HttpError extends Error {
    statusCode: number = 200;
}

function isApiError(error: Error) {
    if (typeof (error as ApiError).code === 'number') {
        return true;
    }
    return false;
}
```

Trong ví dụ trên, chúng tôi đã khai báo hàm `isApiError`, nó dùng để xác định tham số truyền vào có phải là kiểu `ApiError` hay không, để thực hiện hàm như vậy, kiểu của tham số chắc chắn phải là lớp cha trừu tượng `Error`, như vậy hàm này mới có thể nhận `Error` hoặc lớp con của nó làm tham số.

Tuy nhiên, do lớp cha `Error` không có thuộc tính `code`, nên việc trực tiếp lấy `error.code` sẽ báo lỗi, cần sử dụng chuyển đổi kiểu để lấy `(error as ApiError).code`.

Có lẽ bạn sẽ chú ý rằng, trong ví dụ này có một cách thích hợp hơn để xác định liệu có phải là `ApiError` không, đó là sử dụng `instanceof`:

```ts
class ApiError extends Error {
    code: number = 0;
}
class HttpError extends Error {
    statusCode: number = 200;
}

function isApiError(error: Error) {
    if (error instanceof ApiError) {
        return true;
    }
    return false;
}
```

Trong ví dụ trên, việc sử dụng `instanceof` thực sự phù hợp hơn, bởi vì `ApiError` là một lớp trong JavaScript, có thể sử dụng `instanceof` để xác định liệu `error` có phải là một thể hiện của nó không.

Tuy nhiên, trong một số trường hợp `ApiError` và `HttpError` không phải là một lớp thực sự, mà chỉ là một giao diện trong TypeScript (`interface`), giao diện là một kiểu, không phải là một giá trị thực sự, nó sẽ bị xóa trong kết quả biên dịch, rõ ràng không thể sử dụng `instanceof` để thực hiện kiểm tra thời gian chạy:

```ts
interface ApiError extends Error {
    code: number;
}
interface HttpError extends Error {
    statusCode: number;
}

function isApiError(error: Error) {
    if (error instanceof ApiError) {
        return true;
    }
    return false;
}

// index.ts:9:26 - error TS2693: 'ApiError' only refers to a type, but is being used as a value here.
```

Lúc này, chỉ có thể sử dụng chuyển đổi kiểu, thông qua việc kiểm tra xem thuộc tính `code` có tồn tại không, để xác định tham số truyền vào có phải là `ApiError` không:

```ts
interface ApiError extends Error {
    code: number;
}
interface HttpError extends Error {
    statusCode: number;
}

function isApiError(error: Error) {
    if (typeof (error as ApiError).code === 'number') {
        return true;
    }
    return false;
}
```

### Chuyển đổi bất kỳ kiểu nào thành `any`

Trong tình huống lý tưởng, hệ thống kiểu của TypeScript hoạt động tốt, mỗi giá trị đều có kiểu cụ thể và chính xác.

Khi chúng ta tham chiếu đến một thuộc tính hoặc phương thức không tồn tại trên kiểu này, sẽ báo lỗi:

```ts
const foo: number = 1;
foo.length = 1;

// index.ts:2:5 - error TS2339: Property 'length' does not exist on type 'number'.
```

Trong ví dụ trên, biến kiểu số `foo` không có thuộc tính `length`, do đó TypeScript đã đưa ra thông báo lỗi tương ứng.

Rõ ràng, thông báo lỗi này rất hữu ích.

Nhưng đôi khi, chúng ta rất chắc chắn rằng đoạn mã này sẽ không bị lỗi, như trong ví dụ dưới đây:

```ts
window.foo = 1;

// index.ts:1:8 - error TS2339: Property 'foo' does not exist on type 'Window & typeof globalThis'.
```

Trong ví dụ trên, chúng tôi cần thêm một thuộc tính `foo` vào `window`, nhưng TypeScript sẽ báo lỗi khi biên dịch, cho rằng `window` không có thuộc tính `foo`.

Lúc này, chúng tôi có thể sử dụng `as any` để tạm thời chuyển đổi `window` thành kiểu `any`:

```ts
(window as any).foo = 1;
```

Trên một biến kiểu `any`, việc truy cập bất kỳ thuộc tính nào đều được cho phép.

Cần lưu ý rằng, chuyển đổi một biến thành `any` có thể coi là phương pháp cuối cùng để giải quyết vấn đề kiểu trong TypeScript.

**Nó có thể che giấu lỗi kiểu thực sự, vì vậy nếu không chắc chắn, bạn không nên sử dụng `as any`.**

Trong ví dụ trên, chúng tôi cũng có thể giải quyết lỗi này bằng cách [mở rộng kiểu của window (TODO)][] , tuy nhiên, nếu chỉ tạm thời thêm thuộc tính `foo`, `as any` sẽ tiện lợi hơn.

Nói chung, **một mặt không nên lạm dụng `as any`, mặt khác cũng không nên phủ nhận hoàn toàn tác dụng của nó, chúng ta cần cân nhắc giữa tính nghiêm ngặt của kiểu và sự tiện lợi của việc phát triển** (đây cũng là một trong những [triết lý thiết kế của TypeScript][]), để phát huy tối đa giá trị của TypeScript.

### Chuyển đổi `any` thành một kiểu cụ thể

Trong quá trình phát triển hàng ngày, chúng tôi không thể tránh khỏi việc xử lý các biến kiểu `any`, chúng có thể do thư viện bên thứ ba không định rõ kiểu của mình, cũng có thể là mã cũ hoặc mã tồi do người khác viết, hoặc là do hạn chế của hệ thống kiểu TypeScript mà không thể định rõ kiểu.

Khi gặp biến kiểu `any`, chúng ta có thể chọn bỏ qua nó, để nó tạo ra thêm nhiều `any` hơn.

Chúng tôi cũng có thể chọn cải tiến nó, thông qua chuyển đổi kiểu đúng thời điểm để chuyển `any` thành kiểu chính xác, sửa sai lầm, làm cho mã của chúng tôi phát triển theo hướng có thể duy trì được.

Ví dụ, trong mã cũ có một `getCacheData`, giá trị trả về của nó là `any`:

```ts
function getCacheData(key: string): any {
    return (window as any).cache[key];
}
```

Vì vậy, khi chúng tôi sử dụng nó, chúng tôi nên chuyển đổi giá trị trả về sau khi gọi nó thành một kiểu chính xác, điều này sẽ thuận tiện cho các hoạt động sau này:

```ts
function getCacheData(key: string): any {
    return (window as any).cache[key];
}

interface Cat {
    name: string;
    run(): void;
}

const tom = getCacheData('tom') as Cat;
tom.run();
```

Trong ví dụ trên, sau khi gọi `getCacheData`, chúng tôi đã ngay lập tức chuyển nó thành kiểu `Cat`. Điều này làm rõ kiểu của `tom`, khi truy cập `tom` sau này, chúng tôi có gợi ý mã, tăng khả năng duy trì mã.

### Giới hạn của chuyển đổi kiểu

Từ các ví dụ trên, chúng ta có thể tổng kết:

- Kiểu kết hợp có thể được chuyển đổi thành một trong các kiểu của nó
- Lớp cha có thể được chuyển đổi thành lớp con
- Bất kỳ kiểu nào cũng có thể được chuyển đổi thành any
- Any có thể được chuyển đổi thành bất kỳ kiểu nào

Vậy chuyển đổi kiểu có bất kỳ giới hạn nào không? Có phải bất kỳ kiểu nào cũng có thể được chuyển đổi thành bất kỳ kiểu khác không?

Câu trả lời là không - không phải bất kỳ kiểu nào cũng có thể được chuyển đổi thành bất kỳ kiểu khác.

Cụ thể, nếu `A` tương thích với `B`, thì `A` có thể được chuyển đổi thành `B`, và `B` cũng có thể được chuyển đổi thành `A`.

Dưới đây, chúng tôi sẽ thông qua một ví dụ đơn giản để hiểu rõ hơn về giới hạn của chuyển đổi kiểu:

```ts
interface Animal {
    name: string;
}
interface Cat {
    name: string;
    run(): void;
}

let tom: Cat = {
    name: 'Tom',
    run: () => { console.log('run') }
};
let animal: Animal = tom;
```

Chúng ta biết rằng, TypeScript là hệ thống kiểu cấu trúc, so sánh giữa các kiểu chỉ so sánh cấu trúc cuối cùng của chúng, và sẽ bỏ qua mối quan hệ của chúng khi được định nghĩa.

Trong ví dụ trên, `Cat` bao gồm tất cả các thuộc tính trong `Animal`, ngoài ra, nó còn có một phương thức bổ sung `run`. TypeScript không quan tâm đến mối quan hệ giữa `Cat` và `Animal` khi định nghĩa, mà chỉ xem cấu trúc cuối cùng của chúng có mối quan hệ gì - vì vậy nó tương đương với `Cat extends Animal`:

```ts
interface Animal {
    name: string;
}
interface Cat extends Animal {
    run(): void;
}
```

Vì vậy, không khó hiểu tại sao biến kiểu `Cat` `tom` có thể được gán cho biến kiểu `Animal` `animal` - giống như trong lập trình hướng đối tượng, chúng ta có thể gán một thể hiện của lớp con cho một biến kiểu lớp cha.

Chúng tôi sẽ sử dụng cách nói chuyên nghiệp hơn trong TypeScript, tức là: `Animal` tương thích với `Cat`.

Khi `Animal` tương thích với `Cat`, chúng có thể chuyển đổi kiểu cho nhau:

```ts
interface Animal {
    name: string;
}
interface Cat {
    name: string;
    run(): void;
}

function testAnimal(animal: Animal) {
    return (animal as Cat);
}
function testCat(cat: Cat) {
    return (cat as Animal);
}
```

Thiết kế này thực sự dễ hiểu:

- Cho phép `animal as Cat` vì "lớp cha có thể được chuyển đổi thành lớp con", điều này đã được học ở trên
- Cho phép `cat as Animal` vì nếu lớp con có các thuộc tính và phương thức của lớp cha, thì khi được chuyển đổi thành lớp cha, việc lấy các thuộc tính của lớp cha, gọi các phương thức của lớp cha, sẽ không gặp bất kỳ vấn đề gì, vì vậy "lớp con có thể được chuyển đổi thành lớp cha"

Cần lưu ý rằng, ở đây chúng tôi sử dụng mối quan hệ cha-con đơn giản để biểu thị tương thích giữa các kiểu, nhưng thực tế, khi TypeScript xác định tương thích giữa các kiểu, nó phức tạp hơn nhiều so với trường hợp này.

Nói chung, nếu `A` tương thích với `B`, thì `A` có thể được chuyển đổi thành `B`, và `B` cũng có thể được chuyển đổi thành `A`.

Tương tự, nếu `B` tương thích với `A`, thì `A` có thể được chuyển đổi thành `B`, và `B` cũng có thể được chuyển đổi thành `A`.

Vì vậy, cũng có thể nói theo cách khác:

Để làm cho `A` có thể được chuyển đổi thành `B`, chỉ cần `A` tương thích với `B` hoặc `B` tương thích với `A` là đủ, điều này cũng nhằm mục đích an toàn khi chuyển đổi kiểu, rõ ràng, chuyển đổi kiểu mà không có cơ sở nào là rất nguy hiểm.

Tóm lại:

- Kiểu kết hợp có thể được chuyển đổi thành một trong các kiểu của nó
- Lớp cha có thể được chuyển đổi thành lớp con
- Bất kỳ kiểu nào cũng có thể được chuyển đổi thành any
- Any có thể được chuyển đổi thành bất kỳ kiểu nào
- Để làm cho `A` có thể được chuyển đổi thành `B`, chỉ cần `A` tương thích với `B` hoặc `B` tương thích với `A` là đủ

Thực ra, bốn trường hợp đầu tiên đều là trường hợp đặc biệt của cái cuối cùng.

## Chuyển đổi kép

Vì:

- Bất kỳ kiểu nào cũng có thể được chuyển đổi thành any
- Any có thể được chuyển đổi thành bất kỳ kiểu nào

Vậy chúng ta có thể sử dụng chuyển đổi kép `as any as Foo` để chuyển đổi bất kỳ kiểu nào thành bất kỳ kiểu khác không?

```ts
interface Cat {
    run(): void;
}
interface Fish {
    swim(): void;
}

function testCat(cat: Cat) {
    return (cat as any as Fish);
}
```

Trong ví dụ trên, nếu sử dụng trực tiếp `cat as Fish` chắc chắn sẽ báo lỗi, vì `Cat` và `Fish` không tương thích với nhau.

Nhưng nếu sử dụng chuyển đổi kép, thì có thể phá vỡ giới hạn "để `A` có thể được chuyển đổi thành `B`, chỉ cần `A` tương thích với `B` hoặc `B` tương thích với `A` là đủ", và chuyển đổi bất kỳ kiểu nào thành bất kỳ kiểu khác.

Nếu bạn sử dụng chuyển đổi kép này, thì hầu như chắc chắn là sai, nó có thể gây ra lỗi thời gian chạy.

**Trừ khi không còn cách nào khác, hãy tránh sử dụng chuyển đổi kép.**

## Xác nhận kiểu vs Chuyển đổi kiểu

Xác nhận kiểu chỉ ảnh hưởng đến kiểu của TypeScript tại thời điểm biên dịch, câu lệnh xác nhận kiểu sẽ bị xóa trong kết quả biên dịch:

```ts
function toBoolean(something: any): boolean {
    return something as boolean;
}

toBoolean(1);
// Giá trị trả về là 1
```

Trong ví dụ trên, việc chuyển đổi `something` thành `boolean` có thể vượt qua biên dịch, nhưng không có ích lợi gì, mã sau khi biên dịch sẽ trở thành:

```js
function toBoolean(something) {
    return something;
}

toBoolean(1);
// Giá trị trả về là 1
```

Vì vậy, xác nhận kiểu không phải là chuyển đổi kiểu, nó không thực sự ảnh hưởng đến kiểu của biến.

Nếu bạn muốn chuyển đổi kiểu, bạn cần gọi trực tiếp phương thức chuyển đổi kiểu:

```ts
function toBoolean(something: any): boolean {
    return Boolean(something);
}

toBoolean(1);
// Giá trị trả về là true
```

## Xác nhận kiểu vs Khai báo kiểu

Trong ví dụ này:

```ts
function getCacheData(key: string): any {
    return (window as any).cache[key];
}

interface Cat {
    name: string;
    run(): void;
}

const tom = getCacheData('tom') as Cat;
tom.run();
```

Chúng tôi sử dụng `as Cat` để xác nhận kiểu `any` thành kiểu `Cat`.

Nhưng thực tế, có những cách khác để giải quyết vấn đề này:

```ts
function getCacheData(key: string): any {
    return (window as any).cache[key];
}

interface Cat {
    name: string;
    run(): void;
}

const tom: Cat = getCacheData('tom');
tom.run();
```

Trong ví dụ trên, chúng tôi đã sử dụng cách khai báo kiểu, khai báo `tom` là kiểu `Cat`, sau đó gán giá trị `getCacheData('tom')` kiểu `any` cho `tom` kiểu `Cat`.

Điều này rất giống với xác nhận kiểu, và kết quả tạo ra cũng gần như giống nhau - `tom` trong các đoạn mã tiếp theo đều trở thành kiểu `Cat`.

Sự khác biệt giữa chúng có thể được hiểu thông qua ví dụ sau:

```ts
interface Animal {
    name: string;
}
interface Cat {
    name: string;
    run(): void;
}

const animal: Animal = {
    name: 'tom'
};
let tom = animal as Cat;
```

Trong ví dụ trên, do `Animal` tương thích với `Cat`, nên có thể xác nhận `animal` thành `Cat` và gán cho `tom`.

Nhưng nếu khai báo trực tiếp `tom` là kiểu `Cat`:

```ts
interface Animal {
    name: string;
}
interface Cat {
    name: string;
    run(): void;
}

const animal: Animal = {
    name: 'tom'
};
let tom: Cat = animal;

// index.ts:12:5 - error TS2741: Property 'run' is missing in type 'Animal' but required in type 'Cat'.
```

Thì sẽ báo lỗi, không cho phép gán `animal` cho `tom` kiểu `Cat`.

Điều này dễ hiểu, `Animal` có thể coi là lớp cha của `Cat`, rõ ràng không thể gán một thể hiện của lớp cha cho một biến kiểu lớp con.

Để nói sâu hơn, sự khác biệt cốt lõi giữa chúng là:

- `animal` xác nhận thành `Cat`, chỉ cần `Animal` tương thích với `Cat` hoặc `Cat` tương thích với `Animal` là đủ
- `animal` được gán cho `tom`, cần `Cat` tương thích với `Animal`

Nhưng `Cat` không tương thích với `Animal`.

Trong ví dụ trước, do `getCacheData('tom')` là kiểu `any`, `any` tương thích với `Cat`, và `Cat` cũng tương thích với `any`, vì vậy

```ts
const tom = getCacheData('tom') as Cat;
```

tương đương với

```ts
const tom: Cat = getCacheData('tom');
```

Biết được sự khác biệt cốt lõi giữa chúng, chúng ta biết được rằng khai báo kiểu là nghiêm ngặt hơn so với xác định kiểu.

Vì vậy, để tăng chất lượng mã, chúng ta nên ưu tiên sử dụng khai báo kiểu, điều này cũng tốt hơn cú pháp `as` của chuyển đổi kiểu.

## Xác nhận kiểu vs tham số kiểu

Vẫn là ví dụ này:

```ts
function getCacheData(key: string): any {
    return (window as any).cache[key];
}

interface Cat {
    name: string;
    run(): void;
}

const tom = getCacheData('tom') as Cat;
tom.run();
```

Chúng ta có cách thứ ba để giải quyết vấn đề này, đó là sử dụng tham số kiểu (generics):

```ts
function getCacheData<T>(key: string): T {
    return (window as any).cache[key];
}

interface Cat {
    name: string;
    run(): void;
}

const tom = getCacheData<Cat>('tom');
tom.run();
```

Bằng cách thêm generics `<T>` vào hàm `getCacheData`, chúng ta có thể thực hiện ràng buộc trả về của `getCacheData` một cách chính quy hơn, điều này cũng đồng thời loại bỏ `any` khỏi mã, là giải pháp tốt nhất.
