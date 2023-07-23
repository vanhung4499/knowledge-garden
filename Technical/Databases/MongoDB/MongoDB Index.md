---
title: MongoDB Index
tags: [db, mongodb, nosql]
categories: [db, mongodb, nosql]
date created: 2023-07-24
date modified: 2023-07-24
---

# MongoDB Index

## Giới thiệu về Index trong MongoDB

### Tác dụng của Index

**MongoDB định nghĩa các chỉ mục trên cấp dữ liệu của collection**.

Chỉ mục thường có thể cải thiện đáng kể hiệu suất của truy vấn. Nếu **không có chỉ mục**, MongoDB sẽ phải quét qua từng tài liệu trong collection và chọn ra những bản ghi phù hợp với điều kiện truy vấn.

Việc quét toàn bộ collection như vậy là không hiệu quả, đặc biệt khi xử lý lượng dữ liệu lớn. Truy vấn có thể mất vài chục giây hoặc thậm chí vài phút, điều này là không chấp nhận được về hiệu suất.

Chỉ mục là một cấu trúc dữ liệu đặc biệt, được lưu trữ trong một tập hợp dữ liệu dễ dàng duyệt và đọc. Chỉ mục sắp xếp các giá trị của một cột hoặc nhiều cột trong bảng cơ sở dữ liệu.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200921210621.svg)

### Phương thức createIndex()

**MongoDB sử dụng phương thức `createIndex()` để tạo chỉ mục**.

Cú pháp của `createIndex()` như sau:

```javascript
db.collection.createIndex( <key and index type specification>, <options> )
```

Danh sách các tham số tùy chọn của `createIndex()` như sau:

| Tham số            | Kiểu dữ liệu | Mô tả                                                                                                                                           |
| :----------------- | :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| background         | Boolean      | Quá trình tạo chỉ mục sẽ chặn các hoạt động cơ sở dữ liệu khác. Đặt giá trị "background" thành true để tạo chỉ mục ở chế độ nền. Giá trị mặc định là **false**.             |
| unique             | Boolean      | Xác định xem chỉ mục có duy nhất hay không. Đặt giá trị true để tạo chỉ mục duy nhất. Giá trị mặc định là **false**.                                                                                 |
| name               | string       | Tên của chỉ mục. Nếu không chỉ định, MongoDB sẽ tạo tên chỉ mục dựa trên tên trường và thứ tự sắp xếp.                                                               |
| dropDups           | Boolean      | **Đã bị loại bỏ từ phiên bản 3.0 trở đi**. Xác định xem có xóa các bản ghi trùng lặp trong quá trình tạo chỉ mục duy nhất hay không. Đặt giá trị true để tạo chỉ mục duy nhất. Giá trị mặc định là **false**. |
| sparse             | Boolean      | Không kích hoạt chỉ mục cho các trường không tồn tại trong tài liệu; tham số này cần được chú ý đặc biệt, nếu đặt thành true, chỉ mục sẽ không trả về tài liệu không chứa trường tương ứng. Giá trị mặc định là **false**. |
| expireAfterSeconds | integer      | Xác định thời gian sống của collection theo giây.                                                                                                 |
| v                  | index version| Phiên bản chỉ mục. Phiên bản chỉ mục mặc định phụ thuộc vào phiên bản MongoDB được chạy khi tạo chỉ mục.                                                                                 |
| weights            | document     | Giá trị trọng số chỉ mục, giá trị từ 1 đến 99.999, đại diện cho trọng số điểm của chỉ mục so với các trường chỉ mục khác.                                                                    |
| default_language   | string       | Đối với chỉ mục văn bản, tham số này xác định danh sách các quy tắc từ bỏ, từ gốc và bộ phân loại. Giá trị mặc định là tiếng Anh.                                                                            |
| language_override  | string       | Đối với chỉ mục văn bản, tham số này chỉ định tên trường chứa ngôn ngữ ghi đè lên ngôn ngữ mặc định. Giá trị mặc định là ngôn ngữ.                                                      |

【Ví dụ】Sử dụng trường name làm chỉ mục và sắp xếp theo thứ tự giảm dần

```
db.collection.createIndex( { name: -1 } )
```
