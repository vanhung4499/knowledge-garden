---
title: JS OOP
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-05
---

# Lập trình hướng đối tượng

**Lập trình hướng đối tượng** (Object Oriented Programming) là một phương pháp trong lập trình, bản chất của nó là quá trình tư duy trừu tượng và phương pháp hướng đối tượng được thể hiện thông qua việc xây dựng mô hình. Mô hình là một sự trừu tượng để phản ánh các đặc điểm của các đối tượng trong thế giới thực. Không thể có một mô hình nào phản ánh tất cả các đặc điểm cụ thể của các đối tượng khách quan, chỉ có thể trừu tượng một cách mô tả chung, tập trung và sâu sắc hơn về các đặc điểm của đối tượng trong phạm vi mà nó liên quan. Việc xây dựng mô hình dẫn đến sự trừu tượng sâu sắc hơn về nhận thức của con người về đối tượng.

## Giải thích các thuật ngữ

Các khái niệm chính trong lập trình hướng đối tượng bao gồm: đối tượng (Object), lớp (Class), trừu tượng dữ liệu, kế thừa, ràng buộc động, đóng gói dữ liệu (Encapsulation), đa hình, truyền thông điệp. Thông qua các khái niệm này, ý tưởng hướng đối tượng được thể hiện cụ thể.

* **Đối tượng**: Điều gì đó mà bạn có thể làm việc với nó. Một đối tượng có ba thuộc tính: trạng thái, hành vi và định danh.
* **Lớp**: Một tập hợp các đối tượng chia sẻ cùng một cấu trúc và hành vi. Lớp định nghĩa các đặc điểm trừu tượng của một đối tượng. Thông thường, lớp xác định các thuộc tính và hành vi của một đối tượng. Ví dụ, lớp "Chó" sẽ chứa tất cả các đặc điểm cơ bản của chó, như sự sinh sản, màu lông và khả năng sủa. Lớp có thể cung cấp một mẫu và cấu trúc cho chương trình. Các phương thức và thuộc tính của một lớp được gọi là "thành viên".
* **Đóng gói**: Đóng gói dữ liệu và thao tác vào một đơn vị duy nhất. Đóng gói giúp tách biệt giao diện và triển khai, bảo vệ dữ liệu và cung cấp sự trừu tượng.
* **Kế thừa**: Mối quan hệ giữa các lớp, trong đó một lớp chia sẻ cấu trúc và hành vi của một hoặc nhiều lớp khác. Kế thừa mô tả mối quan hệ "là một" giữa các lớp. Lớp con có thể mở rộng, ghi đè hoặc định nghĩa lại hành vi của lớp cha.
* **Tổ hợp**: Mối quan hệ giữa các lớp hoặc đối tượng, trong đó một lớp hoặc đối tượng chứa một hoặc nhiều lớp hoặc đối tượng khác. Tổ hợp mô tả mối quan hệ "có" giữa các lớp hoặc đối tượng.
* **Đa hình**: Một khái niệm trong lý thuyết loại học, một tên có thể đại diện cho nhiều đối tượng khác nhau của các lớp khác nhau, có quan hệ với một lớp cha chung. Do đó, tên đó có thể phản ứng với một tập hợp các hoạt động chung.
* **Ràng buộc động**: Cũng được gọi là kiểu động, chỉ định rằng kiểu của một đối tượng hoặc biểu thức chỉ được xác định trong thời gian chạy. Thông thường, trình biên dịch sẽ chèn mã đặc biệt để thực hiện điều này. Ngược lại, kiểu tĩnh chỉ định kiểu của một đối tượng hoặc biểu thức được xác định trong thời gian biên dịch.
* **Ràng buộc tĩnh**: Cũng được gọi là kiểu tĩnh, chỉ định rằng kiểu của một đối tượng hoặc biểu thức được xác định trong thời gian biên dịch.
* **Truyền thông điệp**: Đối tượng gọi một phương thức (hoặc còn gọi là hàm thành viên) của một đối tượng khác.

## So sánh giữa các ngôn ngữ khác nhau

| Java                                                         | JavaScript                             |
| :------------------------------------------------------------ | :-------------------------------------- |
| Kiểu tĩnh                                                     | Kiểu động                               |
| Sử dụng lớp, giao diện và enum để định nghĩa kiểu               | Sử dụng hàm và nguyên mẫu để định nghĩa kiểu |
| Kiểu không thay đổi trong thời gian chạy                       | Kiểu có thể thay đổi trong thời gian chạy |
| Cần khai báo kiểu cho tất cả các biến (kiểm tra kiểu mạnh)      | Không cần khai báo kiểu cho biến (kiểm tra kiểu yếu) |
| Constructor là một loại phương thức đặc biệt                    | Constructor cũng là một hàm, không khác biệt với các hàm khác |
| Lớp và đối tượng là hai thực thể khác nhau                     | Mọi thứ, bao gồm cả constructor và nguyên mẫu hàm, đều là đối tượng |
| Hỗ trợ phương thức tĩnh và phương thức thể hiện                | Không hỗ trợ trực tiếp phương thức tĩnh và phương thức thể hiện |
| Hỗ trợ kiểu trừu tượng và giao diện                            | Không hỗ trợ kiểu trừu tượng và giao diện |
| Định nghĩa phạm vi của đối tượng bằng `private`, `package`, `protected`, `public` | Chỉ hỗ trợ thành viên `public`           |
| Cung cấp cơ chế kế thừa phong phú                              | Sử dụng nguyên mẫu để thực hiện kế thừa   |
| Hỗ trợ việc ghi đè và nạp chồng phương thức                    | Không hỗ trợ ghi đè và nạp chồng phương thức trực tiếp |
| Cung cấp tính năng phản chiếu phong phú                         | Có một số tính năng phản chiếu           |
| Cung cấp hỗ trợ cho gói để hỗ trợ mô-đun                       | Không có hỗ trợ mô-đun trực tiếp         |
