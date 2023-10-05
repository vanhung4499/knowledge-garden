---
title: Golang Commands
tags:
  - golang
  - interview
categories:
  - golang
  - interview
date created: 2023-10-05
date modified: 2023-10-05
---

# Golang: Commands

Chỉ cần thực thi lệnh sau trên terminal:

```shell
go
```

Bạn sẽ nhận được một giới thiệu ngắn gọn về lệnh go:

![go-compile-12.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/go-compile-12.png)

Các lệnh liên quan đến biên dịch chủ yếu là:

```shell
go build
go install
go run
```

## go build

`go build` được sử dụng để biên dịch các tệp mã nguồn trong các gói được chỉ định và các gói phụ thuộc của chúng. Trong quá trình biên dịch, nó tìm các tệp mã nguồn trong thư mục `$GoPath/src/package`. `go build` cũng có thể biên dịch trực tiếp các tệp mã nguồn cụ thể và có thể chỉ định nhiều tệp cùng một lúc.

Bằng cách thực thi lệnh `go help build`, bạn có thể xem cách sử dụng của `go build`:

```shell
usage: go build [-o output] [-i] [build flags] [packages]
```

Tùy chọn `-o` chỉ có thể được sử dụng khi biên dịch một gói duy nhất và nó chỉ định tên của tệp thực thi đầu ra.

Tùy chọn `-i` sẽ cài đặt các gói mà mục tiêu biên dịch phụ thuộc vào. Cài đặt có nghĩa là tạo ra các tệp `.a` tương ứng, đó là các tệp thư viện tĩnh (để tham gia vào quá trình liên kết) và đặt chúng trong thư mục pkg của không gian làm việc hiện tại. Cấu trúc thư mục của tệp thư viện sẽ giống với cấu trúc thư mục mã nguồn.

Về các cờ biên dịch, các lệnh `build, clean, get, install, list, run, test` sẽ sử dụng chung một tập hợp cờ:

| Cờ | Mô tả |
|------|-------------|
|-a|Buộc biên dịch lại tất cả các gói, bao gồm các gói trong thư viện tiêu chuẩn, điều này sẽ ghi đè lên các tệp `.a` trong thư mục /usr/local/go.|
|-n|In ra các lệnh nhưng không thực thi chúng.|
|-p n|Chỉ định số lượng lệnh thực thi song song trong quá trình biên dịch, với n mặc định là số lõi CPU.|
|-race|Phát hiện và báo cáo các vấn đề cạnh tranh dữ liệu trong chương trình.|
|-v|In ra tên các gói tham gia vào quá trình thực thi lệnh.|
|-x|In ra các lệnh tham gia vào quá trình thực thi lệnh và thực thi chúng.|
|-work|In ra thư mục tạm thời được sử dụng trong quá trình biên dịch. Thông thường, nó sẽ bị xóa sau khi biên dịch.

Chúng ta biết rằng tệp mã nguồn Go có thể được chia thành ba loại: tệp mã nguồn lệnh, tệp mã nguồn thư viện và tệp mã nguồn kiểm tra.

> Tệp mã nguồn lệnh: Đây là điểm vào của chương trình Go và chứa hàm `func main()`, với dòng đầu tiên khai báo `package main`.

> Tệp mã nguồn thư viện: Chúng chủ yếu bao gồm các hàm, giao diện và các thành phần khác, chẳng hạn như các hàm tiện ích.

> Tệp mã nguồn kiểm tra: Đó là các tệp có đuôi `_test.go` và được sử dụng để kiểm tra chức năng và hiệu suất của chương trình.

Lưu ý rằng `go build` bỏ qua các tệp `*_test.go`.

Hãy thực hiện ví dụ với lệnh `go build`. Tôi tạo một dự án `hello-world` bằng Goland (để minh họa việc nhập các gói tùy chỉnh, khác với chương trình hello-world trước đó). Cấu trúc dự án như sau:

![compile-13.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/compile-13.png)

Bên trái là cấu trúc dự án, bao gồm ba thư mục: bin, pkg, src. Trong đó, thư mục src chứa một tệp main.go, định nghĩa hàm main, là điểm vào của toàn bộ dự án, cũng được gọi là tệp mã nguồn lệnh như đã đề cập trước đó; thư mục src còn chứa một thư mục util, bên trong có tệp util.go, định nghĩa một hàm để lấy địa chỉ IP của máy cục bộ, cũng được gọi là tệp mã nguồn thư viện.

Ở giữa là mã nguồn của main.go, tham chiếu hai gói, một là gói fmt của thư viện tiêu chuẩn, một là gói util, đường dẫn nhập của util là `util`. Đường dẫn nhập là đường dẫn tương đối đến thư mục mã nguồn Go `$GoRoot/src` hoặc `$GoPath/src`. Ví dụ, đường dẫn mã nguồn của gói fmt được tham chiếu trong gói main là `/usr/local/go/src/fmt`, trong khi đường dẫn mã nguồn của gói util là `/Users/qcrao/hello-world/src/util`, chính xác là `$GoPath` của chúng ta được đặt là `/Users/qcrao/hello-world`.

Bên phải là mã nguồn của hàm thư viện, thực hiện việc lấy địa chỉ IP của máy cục bộ.

Trong thư mục src, thực thi lệnh `go build` trực tiếp, tạo ra một tệp thực thi cùng cấp, tên tệp là `src`, và thực thi `./src`, kết quả là:

```shell
hello world!
Local IP: 192.168.1.3
```

Chúng ta cũng có thể chỉ định tên của tệp thực thi được tạo ra:

```shell
go build -o bin/hello
```

Điều này sẽ tạo ra một tệp thực thi trong thư mục bin, kết quả chạy tương tự như `src` ở trên.

Thực tế, gói util có thể được biên dịch độc lập. Chúng ta có thể thực thi lệnh sau trong thư mục gốc của dự án:

```shell
go build util
```

Trình biên dịch sẽ tìm gói util trong đường dẫn `$GoPath/src` (thực chất là tìm thư mục). Bạn cũng có thể thực thi `go build` trong thư mục `./src/util` để biên dịch.

Tuy nhiên, việc biên dịch trực tiếp các tệp mã nguồn thư viện sẽ không tạo ra tệp .a, vì:

> Khi lệnh go build biên dịch một gói mã nguồn chỉ chứa các tệp mã nguồn thư viện (hoặc biên dịch nhiều gói mã nguồn cùng một lúc), nó chỉ thực hiện biên dịch kiểm tra mà không tạo ra bất kỳ tệp kết quả nào.

Để hiển thị quá trình biên dịch và liên kết toàn bộ, chúng ta có thể thực thi lệnh sau trong thư mục gốc của dự án:

```shell
go build -v -x -work -o bin/hello src/main.go
```

`-v` sẽ in ra tên các gói đã được biên dịch, `-x` in ra các lệnh được thực thi trong quá trình biên dịch, `-work` in ra đường dẫn thư mục tạm thời được sử dụng trong quá trình biên dịch và không bị xóa sau khi biên dịch hoàn tất.

Kết quả thực thi:

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/go-compile-14.png)

Kết quả cho thấy, hình vẽ đã đánh dấu mũi tên cho quá trình biên dịch liên quan đến 2 gói: util và command-line-arguments. Gói thứ hai có vẻ khá kỳ lạ, vì không có tên như vậy trong mã nguồn, phải không? Thực tế, đây là một gói ảo được tạo ra bởi lệnh `go build` khi [packages] được điền là một tệp `.go`, do đó tạo ra một gói ảo có tên command-line-arguments.

Đồng thời, hình vẽ đã khoanh tròn màu đỏ cho phần compile, link, tức là trước tiên biên dịch gói util và tệp main.go, mỗi cái tạo ra một tệp `.a`, sau đó liên kết cả hai để tạo ra tệp thực thi cuối cùng và di chuyển nó vào thư mục bin và đổi tên thành hello.

Ngoài ra, dòng đầu tiên hiển thị thư mục làm việc trong quá trình biên dịch, cấu trúc thư mục của nó là:

![go-compile-15.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/go-compile-15.png)

Có thể thấy rằng cấu trúc thư mục này tương tự với cấu trúc thư mục của thư mục hello-world. command-line-arguments là gói ảo tương ứng với tệp main.go. Các tệp thực thi trong thư mục exe đã được di chuyển vào thư mục bin trong bước cuối cùng, vì vậy thư mục này trống rỗng.

Tổng thể, khi thực thi `go build`, nó sẽ đệ quy tìm các gói phụ thuộc của main.go và các gói phụ thuộc của chúng, cho đến khi đến gói không phụ thuộc nào. Điều này có thể được thực hiện theo cách duyệt theo chiều sâu hoặc duyệt theo chiều rộng. Nếu phát hiện sự phụ thuộc lặp lại, quá trình biên dịch sẽ dừng ngay lập tức, đây cũng là lỗi biên dịch phụ thuộc lặp lại thường xảy ra.

Trong trường hợp bình thường, các mối quan hệ phụ thuộc này sẽ tạo thành một cây ngược, với gốc là tệp main.go và các lá không có phụ thuộc khác. Trình biên dịch sẽ bắt đầu biên dịch từ nút bên trái nhất đại diện cho gói và sau đó tiếp tục biên dịch các gói cấp trên.

Đến đây, bạn có thể nhận thấy rằng thư mục pkg trong thư mục hello-world dường như không được liên quan đến quá trình biên dịch.

Thực tế, thư mục pkg nên chứa các gói được biên dịch từ các tệp mã nguồn thư viện, tức là các tệp `.a`. Tuy nhiên, trong quá trình thực thi `go build`, các tệp `.a` này được đặt trong thư mục tạm thời và sau khi biên dịch hoàn tất, chúng sẽ bị xóa ngay lập tức, vì vậy thường không được sử dụng.

Như đã đề cập trước đó, việc thêm cờ `-i` vào lệnh go build sẽ cài đặt các gói được biên dịch từ các tệp mã nguồn thư viện này, tức là các tệp `.a` này sẽ được đặt trong thư mục pkg.

Sau khi thực thi `go build -i src/main.go` trong thư mục gốc của dự án, thư mục pkg đã có tệp util.a:

![go-compile-17.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/go-compile-17.png)

`darwin_amd64` đại diện cho:

> GOOS và GOARCH. Hai biến môi trường này không cần chúng ta thiết lập, mặc định của hệ thống.

> GOOS là loại hệ điều hành mà Go đang chạy, GOARCH là kiến trúc máy tính mà Go đang chạy.

> Trên nền tảng Mac, tên thư mục này là darwin_amd64.

Sau khi tạo tệp util.a, khi biên dịch lại, util.go sẽ không được biên dịch lại, giúp tăng tốc quá trình biên dịch.

Đồng thời, một tệp thực thi có tên main được tạo ra trong thư mục gốc, được đặt theo tên tệp main.go.

Dự án hello-world đã được tải lên dự án GitHub "Go-Questions", dự án này được tạo ra từ các câu hỏi, cố gắng liên kết tất cả các khía cạnh của Go và đang được hoàn thiện. Rất mong được bạn đánh dấu sao (star). Xem địa chỉ trong tài liệu tham khảo [Go-Questions hello-world project].

## go install

`go install` được sử dụng để biên dịch và cài đặt các gói mã nguồn cụ thể và các gói phụ thuộc của chúng. So với `go build`, nó chỉ có một bước thêm là "cài đặt tệp kết quả biên dịch vào thư mục chỉ định".

Vẫn sử dụng ví dụ dự án hello-world trước đó, trước tiên hãy xóa thư mục pkg, sau đó thực thi lệnh sau trong thư mục gốc của dự án:

```shell
go install src/main.go

hoặc

go install util
```

Cả hai lệnh sẽ tạo một thư mục `pkg` mới trong thư mục gốc và tạo một tệp `util.a`.

Ngoài ra, khi thực thi lệnh đầu tiên, một tệp thực thi có tên main sẽ được tạo ra trong thư mục GOBIN.

Vì vậy, khi chạy lệnh `go install`, các tệp `.a` tương ứng với mã nguồn thư viện sẽ được đặt trong thư mục `pkg`, và các tệp thực thi tạo ra từ mã nguồn lệnh sẽ được đặt trong thư mục GOBIN.

`go install` có một số vấn đề khi sử dụng với nhiều thư mục trong GoPath, bạn có thể xem hướng dẫn "Go Command Tutorial" của giáo sư Hào Lâm để biết thêm chi tiết.

## go run

`go run` được sử dụng để biên dịch và chạy mã nguồn lệnh.

Trong thư mục gốc của dự án hello-world, thực thi lệnh go run:

```shell
go run -x -work src/main.go
```

Tùy chọn -x sẽ in ra toàn bộ quá trình thực hiện các lệnh, -work sẽ hiển thị thư mục làm việc tạm thời:

![go-compile-18.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/go-compile-18.png)

Từ hình trên, chúng ta có thể thấy rằng quá trình biên dịch trước, sau đó là quá trình liên kết và cuối cùng là thực thi trực tiếp, và kết quả được in ra.

Dòng đầu tiên in ra thư mục làm việc, và tệp thực thi cuối cùng được tạo ra trong thư mục này:

![compile-19.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/compile-19.png)

Tệp main là tệp thực thi cuối cùng được tạo ra.
