---
title: Go Reflect Why
tags:
  - golang
  - interview
categories:
  - golang
  - interview
date created: 2023-10-05
date modified: 2023-10-05
---

# Tại sao cần reflection?

Có hai trường hợp phổ biến mà sử dụng reflection:

1. Không thể xác định rõ ràng gọi hàm giao diện nào, cần xác định trong quá trình chạy dựa trên tham số được truyền vào.
2. Không thể xác định rõ ràng kiểu tham số được truyền vào hàm, cần xử lý đối tượng bất kỳ trong quá trình chạy.

【Mở rộng 1】Có những lý do nào không khuyến nghị sử dụng reflection?

1. Mã liên quan đến reflection thường khó đọc. Trong kỹ thuật phần mềm, khả năng đọc của mã cũng là một tiêu chí rất quan trọng.
2. Go là một ngôn ngữ tĩnh, trong quá trình viết mã, trình biên dịch có thể phát hiện các lỗi kiểu trước, nhưng đối với mã liên quan đến reflection, trình biên dịch không thể làm gì. Do đó, mã liên quan đến reflection có thể chạy trong một thời gian dài trước khi gặp lỗi, thường dẫn đến panic, có thể gây ra hậu quả nghiêm trọng.
3. reflection ảnh hưởng đến hiệu suất khá lớn, chậm hơn tốc độ chạy của mã bình thường từ một đến hai mức độ. Do đó, đối với mã quan trọng về hiệu suất trong dự án, hãy tránh sử dụng tính năng reflection.
