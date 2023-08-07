---
title: JS Date
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# Date

Đối tượng Date là một kiểu dữ liệu được tích hợp sẵn trong ngôn ngữ JavaScript, được sử dụng để thao tác với ngày tháng và thời gian. Đối tượng Date dựa trên số mili giây tính từ ngày 1 tháng 1 năm 1970 (giờ chuẩn thế giới).

## Cú pháp

### Không sử dụng từ khóa new

**Cách sử dụng 1**: Khi không sử dụng từ khóa `new`, Date sẽ được gọi như một hàm. Nó sẽ bỏ qua tất cả các tham số được truyền vào và trả về một chuỗi đại diện cho ngày và giờ hiện tại.

```js
const date = Date();
console.log(date);
// 'Fri Dec 03 2021 01:13:39 GMT+0800 (China Standard Time)'
```

### Sử dụng từ khóa new

**Cách sử dụng 2**: Sử dụng từ khóa `new` mà không có tham số, sẽ tạo một đối tượng Date dựa trên thời gian và ngày hiện tại.

```js
const date = new Date();
console.log(date);
// Fri Dec 03 2021 01:13:57 GMT+0800 (China Standard Time)
```

### Tham số là số

**Cách sử dụng 3**: Có thể chấp nhận một tham số là số (kiểu dữ liệu Number), đại diện cho số mili giây tính từ ngày 1 tháng 1 năm 1970.

```js
new Date(value);
```

| Tham số | Mô tả                                                                                          | Kiểu dữ liệu |
| :------ | :-------------------------------------------------------------------------------------------- | :---------- |
| value   | Số mili giây tính từ ngày 1 tháng 1 năm 1970 (giờ chuẩn thế giới).                                | string      |

### Tham số là chuỗi

**Cách sử dụng 4**: Có thể chấp nhận một tham số là chuỗi (kiểu dữ liệu String), có cấu trúc tương tự như phương thức `Date.parse()`. Tuy nhiên, phương thức `parse()` trả về một số, trong khi hàm `Date()` trả về một đối tượng.

```js
new Date(dateString);
```

Việc xử lý các số `0` đứng đầu trong chuỗi chuẩn của ngày giờ tương tự như phương thức `Date.parse()`. Nếu có số `0` đứng đầu, nó sẽ được coi là giờ chuẩn thế giới (UTC), nếu không, nó sẽ được coi là giờ địa phương. Các trường hợp khác thường là giờ địa phương.

| Tham số     | Mô tả                                                                                                  | Kiểu dữ liệu |
| :---------- | :---------------------------------------------------------------------------------------------------- | :---------- |
| dateString | Chuỗi đại diện cho ngày tháng. Chuỗi này phải có thể được nhận dạng bởi phương thức `Date.parse()`. | string      |

### Date.UTC

- **Cách sử dụng 5**: Có thể chấp nhận các tham số tương tự như phương thức `Date.UTC()`, nhưng phương thức `Date.UTC()` trả về số mili giây và là giờ chuẩn thế giới (UTC), trong khi hàm `Date()` trả về một đối tượng và là giờ địa phương.

```js
new Date.UTC(year, month[, day[, hour [, minutes[, seconds[, milliseconds]]]]]);
```

Khi sử dụng Date như một hàm tạo và truyền nhiều tham số, nếu giá trị vượt quá giới hạn hợp lý (ví dụ: tháng là 13 hoặc phút là 70), các giá trị liền kề sẽ được điều chỉnh.

Ví dụ: `new Date(2013,12,1)` tương đương với `new Date(2014,1,1)`, cả hai đều đại diện cho ngày `2014-01-01` (lưu ý rằng tháng bắt đầu từ `0`). Các giá trị khác cũng tương tự, `new Date(2013,2,1,0,70)` tương đương với `new Date(2013,2,1,1,10)`, cả hai đều đại diện cho thời gian `2013-03-01T01:10:00`.

| Tham số      | Mô tả                                                                                     | Kiểu dữ liệu |
| :----------- | :--------------------------------------------------------------------------------------- | :---------- |
| year         | Giá trị số nguyên đại diện cho năm. Để tránh vấn đề về năm 2000, nên sử dụng năm 4 chữ số. | number      |
| month        | Giá trị số nguyên đại diện cho tháng từ 0 (tháng 1) đến 11 (tháng 12).                    | number      |
| day          | Giá trị số nguyên đại diện cho ngày trong tháng, bắt đầu từ 1.                            | number      |
| hour         | Giá trị số nguyên đại diện cho giờ trong ngày (theo hệ thống 24 giờ).                     | number      |
| minute       | Giá trị số nguyên đại diện cho phút.                                                     | number      |
| second       | Giá trị số nguyên đại diện cho giây.                                                      | number      |
| millisecond | Giá trị số nguyên đại diện cho phần mili giây của thời gian.                               | number      |

Lưu ý:

- Nếu không có tham số nào được truyền vào, hàm tạo Date sẽ tạo một đối tượng Date dựa trên thời gian hiện tại của hệ thống.
- Nếu cung cấp ít nhất hai tham số, các tham số còn lại sẽ được đặt mặc định là `1` (nếu không có tham số `day`) hoặc `0`.
- Thời gian trong JavaScript được tính từ ngày 1 tháng 1 năm 1970 (giờ chuẩn thế giới) và được đo bằng mili giây. Phạm vi của đối tượng Date là từ -100,000,000 ngày đến 100,000,000 ngày (tương đương với giá trị mili giây tương ứng).
- Đối tượng Date trong JavaScript cung cấp một số phương thức để làm việc với thời gian UTC và thời gian địa phương.

> UTC, còn được gọi là giờ chuẩn thế giới, đề cập đến thời gian chuẩn thế giới trong đối tượng `time`. Trong khi thời gian địa phương đề cập đến thời gian được đặt trên máy tính khách thực thi JavaScript.

## Hàm tạo

### Thuộc tính

| Thuộc tính          | Mô tả                                                                 |
| :------------------ | :------------------------------------------------------------------- |
| `Date.prototype`    | Đại diện cho nguyên mẫu của hàm tạo Date, cho phép thêm thuộc tính/phương thức vào đối tượng Date. |
| `Date.length`       | Giá trị là `7`, đại diện cho số lượng tham số mà hàm tạo này có thể nhận. |

### Phương thức

| Phương thức          | Mô tả                                                                                                                                             |
| :------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `Date.now()`        | Trả về số mili giây từ `1/1/1970 00:00:00` UTC (thời gian chuẩn toàn cầu) đến thời gian hiện tại.                                                     |
| `Date.parse()`      | Phân tích một chuỗi đại diện cho một ngày và trả về số mili giây từ `1/1/1970 00:00:00` UTC (thời gian chuẩn toàn cầu) đến ngày đó. Nếu chuỗi không hợp lệ hoặc chứa giá trị ngày không hợp lệ (ví dụ: 2015-02-31), kết quả trả về là `NaN`. |
| `Date.UTC()`        | Chấp nhận các tham số tương tự như hàm tạo Date và trả về số mili giây từ `1/1/1970 00:00:00` UTC (thời gian chuẩn toàn cầu) đến ngày được chỉ định.                                                              |

## Đối tượng nguyên mẫu

Đối tượng Date không có thuộc tính có thể đọc/ghi trực tiếp, tất cả việc truy cập vào ngày và giờ đều phải thông qua các phương thức.

Hầu hết các phương thức của đối tượng Date có hai dạng:

- Sử dụng thời gian địa phương
- Sử dụng thời gian UTC

### Nhận giá trị thời gian cụ thể

Các phương thức lấy giá trị của đối tượng Date trả về một chuỗi biểu diễn thời gian cụ thể.

| Phương thức                                  | Mô tả                                                                                      |
| :------------------------------------------ | :---------------------------------------------------------------------------------------- |
| `Date.prototype.toString()`                  | Trả về chuỗi biểu diễn ngày giờ theo múi giờ địa phương.                                    |
| `Date.prototype.toUTCString()`               | Trả về chuỗi biểu diễn ngày giờ theo múi giờ UTC.                                          |
| `Date.prototype.toISOString()`               | Trả về chuỗi biểu diễn ngày giờ theo định dạng chuẩn của đối tượng Date.                    |
| `Date.prototype.toDateString()`              | Trả về chuỗi biểu diễn ngày của đối tượng Date.                                            |
| `Date.prototype.toTimeString()`              | Trả về chuỗi biểu diễn giờ của đối tượng Date.                                             |
| `Date.prototype.toJSON()`                    | Trả về một chuỗi biểu diễn ngày giờ theo định dạng JSON, tương tự với phương thức `toISOString()`. |
| `Date.prototype.toLocaleString()`            | Chuyển đổi đối tượng Date thành chuỗi biểu diễn ngày giờ theo định dạng địa phương.         |
| `Date.prototype.toLocaleTimeString()`        | Chuyển đổi đối tượng Date thành chuỗi biểu diễn giờ theo định dạng địa phương.              |
| `Date.prototype.toLocaleDateString()`        | Chuyển đổi đối tượng Date thành chuỗi biểu diễn ngày theo định dạng địa phương.             |
| `Date.prototype.valueOf()`                   | Trả về số mili giây kể từ `1/1/1970 00:00:00` UTC (thời gian chuẩn toàn cầu).                |

### Lấy giá trị thời gian cụ thể

Đối tượng Date cung cấp một loạt các phương thức Getter để lấy giá trị của các thành phần cụ thể trong đối tượng.

| Phương thức                                  | Mô tả                                                                                      |
| :------------------------------------------ | :---------------------------------------------------------------------------------------- |
| `Date.prototype.getTime()`                   | Trả về số mili giây kể từ `1/1/1970 00:00:00` UTC (thời gian chuẩn toàn cầu), tương tự với phương thức `valueOf()`. |
| `Date.prototype.getTimezoneOffset()`         | Trả về hiệu chỉnh múi giờ hiện tại so với múi giờ UTC, tính bằng phút (ví dụ: 8\*60=480 phút). Kết quả trả về đã tính đến hiệu ứng giờ mùa hè. |
| `Date.prototype.get[UTC]FullYear()`          | Trả về năm đầy đủ của đối tượng Date (năm có 4 chữ số khi trả về).                            |
| `Date.prototype.get[UTC]Month()`             | Trả về tháng của đối tượng Date (0-11).                                                     |
| `Date.prototype.get[UTC]Date()`              | Trả về ngày trong tháng của đối tượng Date (1-31).                                           |
| `Date.prototype.get[UTC]Day()`               | Trả về ngày trong tuần của đối tượng Date (0-6).                                            |
| `Date.prototype.get[UTC]Hours()`             | Trả về giờ của đối tượng Date (0-23).                                                       |
| `Date.prototype.get[UTC]Minutes()`           | Trả về phút của đối tượng Date (0-59).                                                       |
| `Date.prototype.get[UTC]Seconds()`           | Trả về giây của đối tượng Date (0-59).                                                       |
| `Date.prototype.get[UTC]Milliseconds()`      | Trả về mili giây của đối tượng Date (0-999).                                                 |

**Lưu ý**: Các phương thức có chứa `UTC` trả về giá trị theo múi giờ thế giới (UTC).

### Đặt giá trị thời gian cụ thể

Đối tượng Date cung cấp một loạt các phương thức Setter để đặt giá trị cho các thành phần cụ thể của đối tượng.

Các phương thức Setter tương ứng với các phương thức Getter và nhận các tham số tương tự như hàm tạo Date, trả về số mili giây đã được điều chỉnh của ngày sau khi được đặt.

| Phương thức                                  | Mô tả                                                                                      |
| :------------------------------------------ | :---------------------------------------------------------------------------------------- |
| `Date.prototype.setTime()`                   | Đặt thời gian của đối tượng Date bằng số mili giây tính từ `1/1/1970 00:00:00` UTC (thời gian chuẩn toàn cầu). Có thể sử dụng giá trị âm cho thời gian trước `1/1/1970 00:00:00` UTC. |
| `Date.prototype.setYear()`                   | Được sử dụng để đặt giá trị năm. Hãy sử dụng phương thức `Date.prototype.set[UTC]FullYear()` thay thế. |
| `Date.prototype.set[UTC]FullYear()`          | Đặt giá trị năm đầy đủ cho đối tượng Date (năm có 4 chữ số).                                 |
| `Date.prototype.set[UTC]Month()`             | Đặt giá trị tháng cho đối tượng Date.                                                       |
| `Date.prototype.set[UTC]Date()`              | Đặt giá trị ngày trong tháng cho đối tượng Date (1-31).                                      |
| `Date.prototype.set[UTC]Hours()`             | Đặt giá trị giờ cho đối tượng Date.                                                          |
| `Date.prototype.set[UTC]Minutes()`           | Đặt giá trị phút cho đối tượng Date.                                                          |
| `Date.prototype.set[UTC]Seconds()`           | Đặt giá trị giây cho đối tượng Date.                                                          |
| `Date.prototype.set[UTC]Milliseconds()`      | Đặt giá trị mili giây cho đối tượng Date.                                                     |

**Lưu ý**: Ngày trong tuần chỉ có thể lấy giá trị, không thể đặt giá trị.

## Ví dụ ứng dụng

### Cách sử dụng cơ bản

Gọi hàm như một hàm thông thường:

```js
Date();
// 'Mon Aug 07 2023 18:41:35 GMT+0700 (Indochina Time)'

Date('2023/4/4');
// 'Mon Aug 07 2023 18:42:19 GMT+0700 (Indochina Time)'

typeof Date();
// 'string'
```

Hàm tạo không có tham số:

```js
new Date();
// 2023-08-07T11:42:35.834Z
new Date();
// 2023-08-07T11:43:02.538Z

typeof new Date();
// 'object'
```

Hàm tạo với tham số là số:

```js
new Date(0);
// 1970-01-01T00:00:00.000Z
new Date(86400000);
// 1970-01-02T00:00:00.000Z

typeof new Date(0);
// "object"
```

Hàm tạo với tham số là chuỗi:

```js
new Date('4/4/2023');
// 2023-04-03T17:00:00.000Z
Date.parse('4/4/2023');
// 1680541200000

typeof new Date(4 / 4 / 2023);
// "object"
typeof Date.parse(4 / 4 / 2023);
// "number"
```

Đối với chuỗi đại diện cho ngày giờ theo định dạng chuẩn, nếu có số 0 đứng đầu, thì đại diện cho múi giờ UTC, nếu không có, thì đại diện cho múi giờ địa phương. Các trường hợp khác thường đại diện cho múi giờ địa phương.

```js
new Date('04/04/2023');
// 2023-04-03T17:00:00.000Z
new Date('2023-4-4');
// 2023-04-03T17:00:00.000Z
new Date('2023-04-04');
// 023-04-04T00:00:00.000Z
```

Hàm tạo với tham số là múi giờ UTC:

```js
new Date(2016, 7, 12);
// 2016-08-11T17:00:00.000Z
+new Date(2016, 7, 12);
// 1470934800000
typeof new Date(2016, 7, 12);
// "object"

Date.UTC(2016, 7, 12);
// 1470960000000
typeof Date.UTC(2016, 7, 12);
// "number"
```

- Khi sử dụng các phương thức giống với phương thức `Date.parse()`, nếu đối tượng ngày vượt quá phạm vi, trình duyệt sẽ tự động tính toán lại ngày để nằm trong phạm vi.
- Khi sử dụng các phương thức giống với phương thức `Date.UTC()`, nếu đối tượng ngày vượt quá phạm vi, trình duyệt sẽ hiển thị thông báo `Invalid Date`.

```js
new Date(2018, 7, 32);
// 2018-08-31T17:00:00.000Z
new Date(2018, 8, 1);
// 2018-08-31T17:00:00.000Z
new Date('2018-8-32');
// Invalid Date
new Date('2018-9-1');
// 2018-08-31T17:00:00.000Z
```

### Định dạng timestamp

```js
function formatTimestamp(timestamp, format) {
  const date = new Date(timestamp + 8 * 3600 * 1000);
  return date.toJSON().substr(0, 19).replace('T', '');
}
```
