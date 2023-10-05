---
title: Go Context What
tags:
  - golang
  - interview
categories:
  - golang
  - interview
date created: 2023-10-05
date modified: 2023-10-05
---

# Context là gì?

Go 1.7 giới thiệu gói context, được dịch là "ngữ cảnh" trong tiếng Việt. Chính xác thì nó là ngữ cảnh của goroutine, bao gồm trạng thái chạy, môi trường và thông tin ngữ cảnh của goroutine.

Context chủ yếu được sử dụng để truyền thông tin ngữ cảnh giữa các goroutine, bao gồm tín hiệu hủy bỏ, thời gian chờ, thời hạn, cặp khóa-giá trị và nhiều hơn nữa.

Với việc giới thiệu gói context, nhiều giao diện trong thư viện chuẩn bây giờ đều có thêm tham số context, ví dụ như gói database/sql. Context đã trở thành phương pháp tiêu chuẩn để kiểm soát đồng thời và kiểm soát thời gian chờ.

> Giá trị của kiểu context.Context có thể điều phối hoạt động "hủy bỏ" giữa nhiều goroutine và có thể lưu trữ các cặp khóa-giá trị. Quan trọng nhất, nó an toàn đồng thời.

> Các API làm việc với context có thể được điều khiển từ bên ngoài để thực hiện hoạt động "hủy bỏ", ví dụ như hủy thực hiện một yêu cầu HTTP.
