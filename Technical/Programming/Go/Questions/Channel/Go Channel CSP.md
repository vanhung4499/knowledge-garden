---
title: Go Channel CSP
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-21
date modified: 2023-09-21
---

# Go Channel: Communicating Sequential Processes

> Do not communicate by sharing memory; instead, share memory by communicating.

Không sử dụng chia sẻ bộ nhớ để giao tiếp, mà sử dụng giao tiếp để chia sẻ bộ nhớ.

Đây là triết lý đồng thời của Go, nó dựa trên mô hình CSP và được thực hiện thông qua channel.

CSP thường được coi là yếu tố quan trọng thành công của Go trong lập trình đồng thời. CSP viết tắt của "Communicating Sequential Processes" (Quá trình tuần tự giao tiếp), đây cũng là tên của một bài báo được Tony Hoare công bố vào năm 1978 trên ACM. Bài báo này nhấn mạnh rằng một ngôn ngữ lập trình nên coi trọng các nguyên tắc đầu vào và đầu ra, đặc biệt là trong việc viết mã đồng thời.

Vào thời điểm bài báo được công bố, con người đang nghiên cứu về ý tưởng lập trình theo mô-đun, câu hỏi về việc sử dụng lệnh goto đang là một vấn đề gây tranh cãi gay gắt. Lúc đó, ý tưởng lập trình hướng đối tượng đang trỗi dậy, hầu như không ai quan tâm đến lập trình đồng thời.

Trong bài báo, CSP cũng là một ngôn ngữ lập trình tùy chỉnh, tác giả định nghĩa các lệnh đầu vào và đầu ra để giao tiếp giữa các quá trình (processes). Quá trình được coi là cần được kích hoạt bằng đầu vào và tạo ra đầu ra để cung cấp cho các quá trình khác tiêu thụ, quá trình có thể là tiến trình, luồng hoặc thậm chí là khối mã. Lệnh đầu vào là: !, được sử dụng để ghi dữ liệu vào các quá trình; đầu ra là: ?, được sử dụng để đọc dữ liệu từ các quá trình. Kênh mà chúng ta sẽ nói về trong bài viết này chính là một thiết kế dựa trên ý tưởng này.

Hoare cũng đề xuất một lệnh ->, nếu câu lệnh bên trái của -> trả về false, thì câu lệnh bên phải của nó sẽ không được thực thi.

Thông qua các lệnh đầu vào và đầu ra này, Hoare đã chứng minh rằng nếu một ngôn ngữ lập trình coi trọng việc giao tiếp giữa các quá trình như một yếu tố quan trọng hàng đầu, thì việc lập trình đồng thời sẽ trở nên đơn giản hơn.

Go là ngôn ngữ đầu tiên giới thiệu và phát triển những ý tưởng này từ CSP. Mặc dù đồng bộ hóa truy cập bộ nhớ (memory access synchronization) có ích trong một số trường hợp, Go cũng hỗ trợ gói sync tương ứng, nhưng điều này dễ dẫn đến lỗi trong các chương trình lớn.

Go đã tích hợp triết lý của CSP vào cốt lõi của ngôn ngữ từ đầu, vì vậy lập trình đồng thời trở thành một ưu điểm độc đáo của Go và dễ hiểu.

Hầu hết các ngôn ngữ lập trình khác có mô hình lập trình đồng thời dựa trên luồng và đồng bộ hóa truy cập bộ nhớ, trong khi Go thay thế bằng goroutine và channel. Goroutine tương tự như luồng, channel tương tự như mutex (được sử dụng để đồng bộ hóa truy cập bộ nhớ).

Goroutine giải phóng người lập trình, cho phép chúng ta tập trung suy nghĩ về vấn đề kinh doanh mà không cần quan tâm đến các vấn đề cơ bản như thư viện luồng, chi phí luồng, lập lịch luồng, v.v. Goroutine đã giải quyết tất cả những vấn đề này cho bạn.

Channel cũng tự nhiên có thể kết hợp với các channel khác. Chúng ta có thể đưa các kết quả từ các hệ thống con vào một channel chung. Channel cũng có thể kết hợp với select, cancel, timeout. Trong khi mutex không có những chức năng này.

Nguyên tắc đồng thời của Go rất tuyệt vời, mục tiêu là đơn giản: sử dụng channel càng nhiều càng tốt; xem goroutine như một tài nguyên miễn phí, sử dụng thoải mái.
