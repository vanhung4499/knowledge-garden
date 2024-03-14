---
title: TS Class and Interface
tags:
  - ts
categories:
  - ts
date created: 2024-03-15
date modified: 2024-03-15
---

# Class and Interface

[[TS Type Of Object Interfaces|Như đã học trước đây]], interface có thể được sử dụng để mô tả "hình dạng (Shape)" của một đối tượng.

Chương này chủ yếu giới thiệu một ứng dụng khác của interface, đó là để trừu tượng hóa một phần hành vi của class.

## Class triển khai interface

Triển khai (implements) là một khái niệm quan trọng trong lập trình hướng đối tượng. Nói chung, một class chỉ có thể kế thừa từ một class khác, đôi khi các class khác nhau có thể có một số đặc điểm chung, lúc này chúng ta có thể trích xuất các đặc điểm này thành các interface (interfaces), và sử dụng từ khóa `implements` để triển khai chúng. Tính năng này đã tăng cường đáng kể tính linh hoạt của lập trình hướng đối tượng.

Ví dụ, cửa là một class, cửa an ninh là một class con của cửa. Nếu cửa an ninh có một tính năng báo động, chúng ta có thể đơn giản thêm một phương thức báo động cho cửa an ninh. Lúc này, nếu có một class khác, xe hơi, cũng có tính năng báo động, chúng ta có thể xem xét việc trích xuất báo động ra, làm một interface, cửa an ninh và xe hơi đều triển khai nó:

```ts
interface Alarm {
    alert(): void;
}

class Door {
}

class SecurityDoor extends Door implements Alarm {
    alert() {
        console.log('SecurityDoor alert');
    }
}

class Car implements Alarm {
    alert() {
        console.log('Car alert');
    }
}
```

Một class có thể triển khai nhiều interface:

```ts
interface Alarm {
    alert(): void;
}

interface Light {
    lightOn(): void;
    lightOff(): void;
}

class Car implements Alarm, Light {
    alert() {
        console.log('Car alert');
    }
    lightOn() {
        console.log('Car light on');
    }
    lightOff() {
        console.log('Car light off');
    }
}
```

Trong ví dụ trên, `Car` triển khai cả `Alarm` và `Light` interface, vừa có thể báo động, vừa có thể bật/tắt đèn xe.

## interface kế thừa interface

interface và interface có thể có mối quan hệ kế thừa:

```ts
interface Alarm {
    alert(): void;
}

interface LightableAlarm extends Alarm {
    lightOn(): void;
    lightOff(): void;
}
```

Điều này dễ hiểu, `LightableAlarm` kế thừa từ `Alarm`, ngoài việc có phương thức `alert`, nó còn có thêm hai phương thức mới `lightOn` và `lightOff`.

## interface kế thừa class

Trong các ngôn ngữ lập trình hướng đối tượng phổ biến, interface không thể kế thừa từ class, nhưng trong TypeScript lại có thể:

```ts
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```

Tại sao TypeScript lại hỗ trợ interface kế thừa class?

Thực tế, khi chúng ta khai báo `class Point`, ngoài việc tạo ra một class có tên là `Point`, chúng ta cũng tạo ra một kiểu có tên là `Point` (kiểu của thể hiện).

Vì vậy, chúng ta có thể xem `Point` như một class để sử dụng (sử dụng `new Point` để tạo thể hiện của nó):

```ts
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

const p = new Point(1, 2);
```

Chúng ta cũng có thể xem `Point` như một kiểu để sử dụng (sử dụng `: Point` để biểu thị kiểu của tham số):

```ts
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

function printPoint(p: Point) {
    console.log(p.x, p.y);
}

printPoint(new Point(1, 2));
```

Ví dụ này thực tế có thể tương đương với:

```ts
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

interface PointInstanceType {
    x: number;
    y: number;
}

function printPoint(p: PointInstanceType) {
    console.log(p.x, p.y);
}

printPoint(new Point(1, 2));
```

Trong ví dụ trên, kiểu `PointInstanceType` mới chúng ta khai báo, tương đương với kiểu `Point` được tạo khi khai báo `class Point`.

Vì vậy, quay lại ví dụ `Point3d`, chúng ta có thể dễ dàng hiểu tại sao TypeScript lại hỗ trợ interface kế thừa class:

```ts
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

interface PointInstanceType {
    x: number;
    y: number;
}

// tương đương với interface Point3d extends PointInstanceType
interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```

Khi chúng ta khai báo `interface Point3d extends Point`, `Point3d` kế thừa thực tế là kiểu của thể hiện của class `Point`.

Nói cách khác, có thể hiểu là chúng ta đã định nghĩa một interface `Point3d` kế thừa interface khác là `PointInstanceType`.

Vì vậy, "interface kế thừa class" và "interface kế thừa interface" không có sự khác biệt về bản chất.

Đáng chú ý là, `PointInstanceType` so với `Point`, thiếu phương thức `constructor`, đó là bởi vì khi khai báo `Point` class tạo ra kiểu `Point` không bao gồm phương thức khởi tạo. Ngoài ra, thuộc tính tĩnh hoặc phương thức tĩnh cũng không được bao gồm (kiểu của thể hiện tất nhiên không nên bao gồm phương thức khởi tạo, thuộc tính tĩnh hoặc phương thức tĩnh).

Nói cách khác, khi khai báo `Point` class tạo ra kiểu `Point` chỉ bao gồm thuộc tính thể hiện và phương thức thể hiện:

```ts
class Point {
    /** Thuộc tính tĩnh, gốc của hệ tọa độ */
    static origin = new Point(0, 0);
    /** Phương thức tĩnh, tính khoảng cách đến gốc */
    static distanceToOrigin(p: Point) {
        return Math.sqrt(p.x * p.x + p.y * p.y);
    }
    /** Thuộc tính thể hiện, giá trị của trục x */
    x: number;
    /** Thuộc tính thể hiện, giá trị của trục y */
    y: number;
    /** Phương thức khởi tạo */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    /** Phương thức thể hiện, in điểm này */
    printPoint() {
        console.log(this.x, this.y);
    }
}

interface PointInstanceType {
    x: number;
    y: number;
    printPoint(): void;
}

let p1: Point;
let p2: PointInstanceType;
```

Trong ví dụ trên, kiểu `Point` và kiểu `PointInstanceType` cuối cùng là tương đương.

Tương tự, khi interface kế thừa class, nó chỉ kế thừa thuộc tính thể hiện và phương thức thể hiện.
