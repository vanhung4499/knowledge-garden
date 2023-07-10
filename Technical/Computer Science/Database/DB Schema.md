---
tags: [database, computer-science]
categories: [database, computer-science]
date created: 2023-06-27
date modified: 2023-07-10
title: DB Schema
---

### 📕 Schema là gì?

Schema là tập hợp các siêu dữ liệu (metadata) mô tả cấu trúc và ràng buộc của cơ sở dữ liệu.

> Metadata là dữ liệu về dữ liệu, được tạo ra với mục đích cụ thể.

Cụ thể hơn, schema định nghĩa tổng quan về các thực thể (entity), thuộc tính (attribute), mối quan hệ (relationship) và các ràng buộc dữ liệu của cơ sở dữ liệu.

Khi nghe định nghĩa trên, chúng ta có thể nghĩ đến ERD có cùng tính chất.

ERD (Entity Relationship Diagram) mô tả các mối quan hệ giữa các bảng trong cơ sở dữ liệu. Nó cũng có thể hiển thị chi tiết các thuộc tính của bảng.

> **Sự khác biệt giữa Schema và ERD là gì?**  
>
> Nói một cách đơn giản, ERD là một bản thiết kế, trong khi schema là sự thực hiện của nó. Trước khi tạo cơ sở dữ liệu, chúng ta cần suy nghĩ về thiết kế trước. Đó là khi chúng ta tạo ERD. Khi tạo cơ sở dữ liệu từ đó, điều đó được gọi là Schema trong DBMS.

## Đặc điểm của Schema

Schema được lưu trữ trong từ điển dữ liệu (Data Dictionary) và còn được gọi là metadata (siêu dữ liệu).

> Data Dictionary là một tập hợp thông tin tóm tắt về dữ liệu được lưu trữ trong cơ sở dữ liệu, nhằm hỗ trợ việc sử dụng hệ quản trị cơ sở dữ liệu (DBMS) một cách hiệu quả.

Schema có tính không thay đổi theo thời gian.

Nó đại diện cho các đặc điểm cấu trúc của dữ liệu và được xác định bởi các phiên bản của các thực thể (entities) trong cơ sở dữ liệu.

## Cấu trúc ba lớp của Schema

Hệ thống quản lý cơ sở dữ liệu (DBMS) chuyển đổi yêu cầu của người dùng được chỉ định bởi mô hình ngoại vi (external schema), thành một hình thức phù hợp với mô hình khái niệm (conceptual schema), và sau đó chuyển đổi thành một hình thức phù hợp với mô hình nội bộ (internal schema).

Nó được thiết kế từ quan điểm của người dùng trong 3 tầng của mô hình. Mô hình ngoại vi là quan điểm của người dùng, mô hình khái niệm là cách mà toàn bộ cấu trúc của cơ sở dữ liệu được định nghĩa theo mặt logic, và mô hình nội bộ là cách mà máy tính đại diện cho vị trí lưu trữ dữ liệu và các yếu tố khác.

![Pasted image 20230630210140](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230630210140.png)

### External Schema = View = Sub Schema

- Mô hình ngoại vi là việc định nghĩa cấu trúc logic của cơ sở dữ liệu mà người dùng hoặc nhà phát triển ứng dụng cần trong góc nhìn của mỗi cá nhân.
- Mô hình ngoại vi có thể coi là một phần logic của toàn bộ cơ sở dữ liệu, do đó còn được gọi là mô hình phụ (Sub Schema).
- Một hệ thống cơ sở dữ liệu có thể có nhiều mô hình ngoại vi và một mô hình ngoại vi có thể được chia sẻ bởi nhiều ứng dụng hoặc người dùng.
- Nó cho phép định nghĩa các góc nhìn khác nhau về cùng một cơ sở dữ liệu.
- Người dùng thông thường có thể sử dụng ngôn ngữ truy vấn (SQL) để dễ dàng truy cập vào cơ sở dữ liệu.
- Developer sử dụng các ngôn ngữ như C, Java để truy cập vào cơ sở dữ liệu.

### Conceptual Schema = View

- Mô hình khái niệm (Conceptual Schema) là cấu trúc logic tổng thể của cơ sở dữ liệu, chỉ có một mô hình duy nhất tồn tại cho toàn bộ dữ liệu mà tất cả các ứng dụng hoặc người dùng cần.
- Mô hình khái niệm mô tả mối quan hệ giữa các đối tượng và ràng buộc trong cơ sở dữ liệu, đồng thời định nghĩa quyền truy cập, bảo mật và quy tắc về tính toàn vẹn của cơ sở dữ liệu.
- Nó đại diện cho hình thức dữ liệu được lưu trữ trong tệp cơ sở dữ liệu, và khi chỉ nói đến "schema" thì thường đề cập đến mô hình khái niệm.
- Nó được định nghĩa từ quan điểm của tổ chức hoặc tổ chức.
- Nó được xây dựng bởi người quản trị cơ sở dữ liệu (DBA).

### Internal Schema = Storage Schema

- Mô hình nội bộ là một tầng gần gũi với thiết bị lưu trữ vật lý (máy tính) trong cấu trúc cơ sở dữ liệu.
- Mô hình nội bộ định nghĩa cấu trúc vật lý của bản ghi sẽ được lưu trữ trong cơ sở dữ liệu, cách biểu diễn các mục dữ liệu lưu trữ, thứ tự vật lý của mã nội bộ và các yếu tố khác liên quan đến lưu trữ.
- Đây là quan điểm của các nhà phát triển hệ thống hoặc thiết kế hệ thống.
