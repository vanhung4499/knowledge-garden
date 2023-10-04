---
title: Go Channel Principal
tags:
  - golang
  - interview
categories:
  - golang
  - interview
date created: 2023-10-04
date modified: 2023-10-04
---

# Go Channel: Principal

Bản chất của các yếu tố gửi và nhận trên channel là gì?

> All transfer of value on the go channels happens with the copy of value.

Điều này có nghĩa là việc gửi và nhận trên channel đều là sao chép giá trị, bất kể là từ sender goroutine đến chan buf, từ chan buf đến reviever goroutine, hoặc trực tiếp từ sender goroutine đến reviever goroutine.

Ví dụ:

```go
type user struct {
	name string
	age  int8
}

var u = user{name: "Ankur", age: 25}
var g = &u

func modifyUser(pu *user) {
	fmt.Println("modifyUser Received Value", pu)
	pu.name = "Anand"
}

func printUser(u <-chan *user) {
	time.Sleep(2 * time.Second)
	fmt.Println("printUser goRoutine called", <-u)
}

func main() {
	c := make(chan *user, 5)
	c <- g
	fmt.Println(g)
	// modify g
	g = &user{name: "Ankur Anand", age: 100}
	go printUser(c)
	go modifyUser(g)
	time.Sleep(5 * time.Second)
	fmt.Println(g)
}
```

Kết quả chạy:

```shell
&{Ankur 25}
modifyUser Received Value &{Ankur Anand 100}
printUser goRoutine called &{Ankur 25}
&{Anand 100}
```

Đây là một ví dụ tốt về `share memory by communicating`.

![channel12.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/channel12.png)

Ban đầu, chúng ta tạo một cấu trúc user với địa chỉ 0x56420, phía trên địa chỉ là nội dung của nó. Tiếp theo, chúng ta gán giá trị `&u` cho con trỏ `g`, địa chỉ của `g` là 0x565bb0, nội dung của nó là một địa chỉ trỏ đến `u`.

Trong chương trình chính, chúng ta gửi `g` vào `c`, dựa trên bản chất `copy value`, giá trị được gửi vào chan buf là `0x56420`, đó là giá trị của con trỏ `g` (không phải nội dung mà nó trỏ đến), vì vậy khi in ra phần tử nhận được từ channel, nó là `&{Ankur 25}`. Do đó, không phải là gửi con trỏ `g` vào channel, chỉ là sao chép giá trị của nó.

Hãy nhớ rằng:

> Remember all transfer of value on the go channels happens with the copy of value.
