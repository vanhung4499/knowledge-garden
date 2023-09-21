---
title: Go Interface Receiver
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-21
date modified: 2023-09-21
---

# Go: Interface Reciever

## Phương thức

Phương thức cho phép thêm hành vi mới cho một kiểu dữ liệu do người dùng tự định nghĩa. Sự khác biệt giữa phương thức và hàm là phương thức có một bộ nhận (receiver), khi một hàm có một bộ nhận, nó trở thành một phương thức. bộ nhận có thể là một `bộ nhận giá trị` (value receiver) hoặc một `bộ nhận con trỏ` (pointer receiver).

Khi gọi phương thức, cả kiểu dữ liệu giá trị và con trỏ đều có thể gọi phương thức với `bộ nhận giá trị` hoặc `bộ nhận con trỏ`, không cần tuân theo chính xác kiểu dữ liệu của bộ nhận.

Hãy xem một ví dụ:

```go
package main

import "fmt"

type Person struct {
	age int
}

func (p Person) howOld() int {
	return p.age
}

func (p *Person) growUp() {
	p.age += 1
}

func main() {
	// tom là kiểu giá trị
	tom := Person{age: 18}

	// Kiểu giá trị gọi phương thức với bộ nhận là kiểu giá trị
	fmt.Println(tom.howOld())

	// Kiểu giá trị gọi phương thức với bộ nhận là kiểu con trỏ
	tom.growUp()
	fmt.Println(tom.howOld())

	// ----------------------

	// jerry là kiểu con trỏ
	jerry := &Person{age: 100}

	// Kiểu con trỏ gọi phương thức với bộ nhận là kiểu giá trị
	fmt.Println(jerry.howOld())

	// Kiểu con trỏ gọi phương thức với bộ nhận là kiểu con trỏ
	jerry.growUp()
	fmt.Println(jerry.howOld())
}
```

Kết quả của ví dụ trên là:

```shell
18
19
100
101
```

Sau khi gọi phương thức `growUp()`, dù là kiểu giá trị hay kiểu con trỏ, giá trị `age` đều thay đổi.

Thực tế, khi kiểu dữ liệu và kiểu bộ nhận không khớp nhau, trình biên dịch thực hiện một số công việc ẩn sau cùng. Bảng dưới đây mô tả cách thức hoạt động:

|-|Bộ nhận giá trị|Bộ nhận con trỏ|
|---|---|---|
|Kiểu dữ liệu gọi phương thức|Phương thức sử dụng một bản sao của người gọi, tương tự như "truyền giá trị"|Sử dụng tham chiếu của giá trị để gọi phương thức. Trong ví dụ trên, `tom.growUp()` thực tế là `(&tom).growUp()`|
|Kiểu con trỏ gọi phương thức|Con trỏ được giải tham chiếu thành giá trị. Trong ví dụ trên, `jerry.howOld()` thực tế là `(*jerry).howOld()`|Thực tế cũng là "truyền giá trị", các thao tác trong phương thức sẽ ảnh hưởng đến người gọi, tương tự như truyền con trỏ.

## Bộ nhận giá trị và bộ nhận con trỏ

Như đã đề cập trước đó, không quan trọng liệu bộ nhận của phương thức có kiểu giá trị hay con trỏ, cả hai đều có thể được gọi bằng kiểu giá trị hoặc con trỏ, điều này được thực hiện thông qua một cú pháp đặc biệt.

Đưa ra kết luận trước: Khi triển khai một phương thức với bộ nhận là kiểu giá trị, nó tự động triển khai một phương thức tương ứng với bộ nhận là kiểu con trỏ. Trong khi khi triển khai một phương thức với bộ nhận là kiểu con trỏ, nó không tự động tạo ra phương thức tương ứng với bộ nhận là kiểu giá trị.

Hãy xem một ví dụ để hiểu rõ hơn:

```go
package main

import "fmt"

type coder interface {
	code()
	debug()
}

type Gopher struct {
	language string
}

func (p Gopher) code() {
	fmt.Printf("I am coding %s language\n", p.language)
}

func (p *Gopher) debug() {
	fmt.Printf("I am debugging %s language\n", p.language)
}

func main() {
	var c coder = &Gopher{"Go"}
	c.code()
	c.debug()
}
```

Trong đoạn mã trên, chúng ta định nghĩa một giao diện `coder`, giao diện này định nghĩa hai phương thức:

```golang
code()
debug()
```

Tiếp theo, chúng ta định nghĩa một cấu trúc `Gopher`, nó triển khai hai phương thức, một với bộ nhận là kiểu giá trị và một với bộ nhận là kiểu con trỏ.

Cuối cùng, trong hàm `main`, chúng ta gọi hai phương thức thông qua biến có kiểu giao diện.

Kết quả của ví dụ trên là:

```shell
I am coding Go language
I am debugging Go language
```

Khi gọi phương thức `debug()`, dù là kiểu giá trị hay kiểu con trỏ, giá trị `language` đều được thay đổi.

Tuy nhiên, nếu chúng ta thay đổi dòng đầu tiên của hàm `main` như sau:

```go
func main() {
	var c coder = Gopher{"Go"}
	c.code()
	c.debug()
}
```

Khi chạy chương trình, sẽ gặp lỗi:

```shell
src/main.go:23:6: cannot use Gopher literal (type Gopher) as type coder in assignment:
	Gopher does not implement coder (debug method has pointer receiver)
```

Bạn đã nhận ra sự khác biệt giữa hai đoạn code này chưa? Lần đầu tiên, chúng ta gán `&Gopher` cho `coder`. Lần thứ hai, chúng ta gán `Gopher` cho `coder`.

Lỗi thứ hai cho biết rằng `Gopher` không triển khai giao diện `coder`. Rõ ràng, kiểu `Gopher` không triển khai phương thức `debug`. Dường như kiểu `*Gopher` cũng không triển khai phương thức `code`, nhưng vì kiểu `Gopher` triển khai phương thức `code`, nên kiểu `*Gopher` tự động có phương thức `code`.

Tóm lại, giải thích trên có một lý do đơn giản: phương thức với bộ nhận là con trỏ thường thực hiện các thay đổi trực tiếp trên thuộc tính của bộ nhận, ảnh hưởng đến bộ nhận. Trong khi đó, phương thức với bộ nhận là giá trị không ảnh hưởng trực tiếp đến bộ nhận.

Vì phương thức với bộ nhận là con trỏ có thể thay đổi giá trị của bộ nhận, nên khi triển khai phương thức với bộ nhận là giá trị, cũng tự động triển khai phương thức tương ứng với bộ nhận là con trỏ, vì cả hai không ảnh hưởng đến bộ nhận. Tuy nhiên, khi triển khai phương thức với bộ nhận là con trỏ, nếu tự động tạo ra phương thức tương ứng với bộ nhận là giá trị, thì sự thay đổi mong đợi đối với bộ nhận (thông qua con trỏ) sẽ không xảy ra, vì kiểu giá trị sẽ tạo ra một bản sao và không ảnh hưởng trực tiếp đến người gọi.

Cuối cùng, chỉ cần nhớ điều sau:

> Nếu triển khai phương thức với bộ nhận là giá trị, tự động triển khai phương thức tương ứng với bộ nhận là con trỏ.

## Khi nào sử dụng giá trị nhận và khi nào sử dụng con trỏ nhận?

Nếu bộ nhận của phương thức là kiểu giá trị, không quan trọng liệu người gọi là một đối tượng hay một con trỏ đến đối tượng, thay đổi chỉ ảnh hưởng đến bản sao của đối tượng, không ảnh hưởng đến người gọi. Nếu bộ nhận của phương thức là kiểu con trỏ, người gọi sẽ thay đổi trực tiếp đối tượng mà con trỏ đang trỏ tới.

Sử dụng con trỏ nhận làm bộ nhận của phương thức có các lợi ích sau:

- Phương thức có thể thay đổi giá trị mà bộ nhận đang trỏ tới.
- Tránh sao chép giá trị mỗi khi gọi phương thức, điều này làm cho việc xử lý các kiểu dữ liệu lớn trở nên hiệu quả hơn.

Việc sử dụng bộ nhận giá trị hay bộ nhận con trỏ không phụ thuộc vào việc phương thức có thay đổi bộ nhận hay không (tức là bộ nhận có được ảnh hưởng hay không), mà nên dựa trên `bản chất` của kiểu dữ liệu đó.

Nếu kiểu dữ liệu có `bản chất nguyên thủy`, có nghĩa là tất cả thành viên của nó là các kiểu dữ liệu nguyên thủy được xây dựng sẵn trong Go như chuỗi, số nguyên, v.v., thì nên định nghĩa phương thức với bộ nhận là giá trị. Đối với các kiểu dữ liệu tham chiếu như slice, map, interface, channel, các kiểu dữ liệu này đặc biệt, khi khai báo chúng, thực tế là tạo ra một `header`, và cũng nên định nghĩa phương thức với bộ nhận là giá trị. Khi gọi phương thức, chỉ cần sao chép `header` của các kiểu dữ liệu này, vì `header` đã được thiết kế để sao chép.

Nếu kiểu dữ liệu có `bản chất không phải nguyên thủy`, không thể sao chép an toàn, kiểu dữ liệu này luôn nên được chia sẻ, thì nên định nghĩa phương thức với bộ nhận là con trỏ. Ví dụ như cấu trúc tệp trong mã nguồn Go không nên được sao chép, chỉ nên có một `thực thể`.

Điều này có thể hơi phức tạp, bạn có thể tham khảo phần 5.3 trong cuốn sách 《Go In Action》 để hiểu rõ hơn.
