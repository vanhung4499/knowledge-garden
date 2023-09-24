---
title: Goroutine vs Thread
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-22
date modified: 2023-09-22
---

# Goroutine vs Thread

Khi nói về goroutine, không thể tránh khỏi một chủ đề là: nó khác thread như thế nào?

Tài liệu tham khảo "How Goroutines Work" cho chúng ta biết rằng có thể phân biệt chúng từ ba khía cạnh: tiêu thụ bộ nhớ, tạo và hủy, và chuyển đổi.

- Tiêu thụ bộ nhớ

Việc tạo ra một goroutine tiêu tốn khoảng 2 KB bộ nhớ stack, và trong quá trình chạy, nếu không đủ bộ nhớ stack, nó sẽ tự động mở rộng. Trong khi đó, việc tạo ra một thread yêu cầu tiêu tốn 1 MB bộ nhớ stack và còn cần một khu vực được gọi là "a guard page" để cách ly không gian stack với các thread khác.

Đối với một máy chủ HTTP được xây dựng bằng Go, việc tạo ra một goroutine để xử lý mỗi yêu cầu là một việc rất nhẹ nhàng. Trong khi đối với một dịch vụ được xây dựng bằng một ngôn ngữ sử dụng luồng làm nguyên tố đồng thời, ví dụ như Java, việc mỗi yêu cầu tương ứng với một luồng là một lãng phí tài nguyên, và sớm hay muộn sẽ gặp lỗi OOM (OutOfMemoryError).

- Tạo và hủy

Việc tạo và hủy thread tốn rất nhiều tài nguyên, bởi vì nó liên quan đến giao tiếp với hệ điều hành, là cấp độ kernel. Thông thường, cách giải quyết là sử dụng thread pool. Trong khi đó, goroutine do Go runtime quản lý, việc tạo và hủy goroutine tiêu tốn rất ít tài nguyên, nằm ở cấp độ người dùng.

- Chuyển đổi

Khi chuyển đổi giữa các thread, cần lưu trữ các thanh ghi khá nhiều để phục hồi sau này:

> 16 general purpose registers, PC (Program Counter), SP (Stack Pointer), segment registers, 16 XMM registers, FP coprocessor state, 16 AVX registers, all MSRs etc.

Trong khi đó, chuyển đổi goroutine chỉ cần lưu trữ ba thanh ghi: Program Counter, Stack Pointer và BP.

Nhìn chung, việc chuyển đổi thread tốn khoảng 1000-1500 nanosecond, tương đương với trung bình 12-18 lệnh thực thi. Vì vậy, do chuyển đổi thread, số lệnh thực thi sẽ giảm đi 12000-18000.

Chuyển đổi goroutine tốn khoảng 200 ns, tương đương với 2400-3600 lệnh thực thi.

Do đó, chi phí chuyển đổi goroutine nhỏ hơn nhiều so với thread.
