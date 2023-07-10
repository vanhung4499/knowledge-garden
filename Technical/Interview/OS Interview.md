---
title: OS Interview
date created: 2023-05-29
date modified: 2023-05-31
---

**Q. Tại sao stack được phân bổ độc lập cho mỗi luồng?**

Stack là một không gian bộ nhớ được sử dụng để lưu trữ các tham số được truyền khi gọi hàm, giá trị địa chỉ trả về và các biến được khai báo trong hàm.

Không gian bộ nhớ stack độc lập có nghĩa là có thể thực hiện các lệnh gọi hàm độc lập, bổ sung thêm luồng thực thi độc lập. Do đó, điều kiện tối thiểu để thêm một luồng thực thi độc lập theo định nghĩa luồng là cấp phát một stack độc lập.

**Q. Tại sao các PC Register được phân bổ độc lập cho từng luồng?**

Giá trị PC cho biết luồng đã thực hiện lệnh được bao xa. Một luồng được cấp phát một CPU và sau đó được bộ lập lịch ưu tiên. Do đó, các lệnh không thể được thực hiện liên tiếp và cần phải nhớ phần nào đã được thực hiện. Do đó, các PC Register được cấp phát độc lập.
