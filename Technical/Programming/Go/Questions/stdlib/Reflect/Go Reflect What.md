---
title: Go Reflect What
tags:
  - golang
  - interview
categories:
  - golang
  - interview
date created: 2023-10-05
date modified: 2023-10-05
---

# Go Reflection là gì?

Định nghĩa về reflection trên Wikipedia như sau:

> Trong khoa học máy tính, reflection (phản chiếu) là khả năng của một chương trình máy tính để truy cập, phát hiện và thay đổi cấu trúc và hành vi của chính nó trong thời gian chạy (Run Time). Nói cách khác, reflection cho phép một chương trình "quan sát" và thay đổi hành vi của nó trong quá trình thực thi.

Vậy có nghĩa là chúng ta không thể truy cập, phát hiện và thay đổi trạng thái và hành vi của một chương trình trong thời gian chạy mà không sử dụng reflection à?

Câu trả lời cho câu hỏi này thực ra phụ thuộc vào việc hiểu rõ ý nghĩa của việc truy cập, phát hiện và thay đổi trạng thái và hành vi của một chương trình trong thời gian chạy, và bản chất của nó là gì.

Trên thực tế, bản chất của khả năng này là chương trình có thể khám phá thông tin về kiểu dữ liệu và cấu trúc bộ nhớ của các đối tượng trong quá trình chạy. Liệu chúng ta có thể đạt được điều này mà không sử dụng reflection? Có, điều này hoàn toàn có thể! Bằng cách sử dụng ngôn ngữ assembly và tương tác trực tiếp với các lớp dưới, chúng ta có thể thu được bất kỳ thông tin nào. Tuy nhiên, khi lập trình bằng ngôn ngữ cấp cao, điều này không thể thực hiện được. Chúng ta chỉ có thể đạt được khả năng này thông qua "reflection".

Mô hình reflection trong các ngôn ngữ khác nhau khác nhau, và một số ngôn ngữ thậm chí không hỗ trợ reflection. Trong "Ngôn ngữ lập trình Go", reflection được định nghĩa như sau:

> Ngôn ngữ Go cung cấp cơ chế để cập nhật các biến, kiểm tra giá trị và gọi các phương thức của chúng trong thời gian chạy mà không cần biết kiểu cụ thể của chúng vào thời điểm biên dịch. Cơ chế này được gọi là reflection.
