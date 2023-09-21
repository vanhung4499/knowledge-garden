---
title: Go Map Unordered
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-21
date modified: 2023-09-21
---

# Go: Map unordered

Sau khi map mở rộng, các key sẽ được di chuyển, các key trước đây nằm trong cùng một bucket sẽ được di chuyển xa nhau (số thứ tự bucket tăng thêm 2^B). Quá trình lặp lại là duyệt qua các bucket theo thứ tự và đồng thời duyệt qua các key trong bucket theo thứ tự. Sau khi di chuyển, vị trí của key đã thay đổi đáng kể, một số key đã "bay lên nhánh cao", trong khi một số key vẫn ở nguyên vị trí. Như vậy, kết quả duyệt map không thể theo thứ tự ban đầu.

Tất nhiên, nếu tôi chỉ có một map cố định được hard code, tôi sẽ không thực hiện thao tác chèn và xóa key vào map. Lý thuyết cho rằng mỗi lần duyệt qua map như vậy sẽ trả về một chuỗi key/value cố định. Thực tế là như vậy, nhưng Go đã loại bỏ cách làm này vì nó có thể gây hiểu lầm cho các lập trình viên mới, cho rằng điều này là điều chắc chắn sẽ xảy ra. Trong một số trường hợp, điều này có thể gây ra những vấn đề lớn.

Tuy nhiên, Go đã làm điều khác, khi chúng ta duyệt qua map, nó không bắt đầu duyệt từ bucket số 0 cố định, mà mỗi lần duyệt nó sẽ bắt đầu từ một bucket ngẫu nhiên và từ một cell ngẫu nhiên trong bucket đó. Điều này có nghĩa là ngay cả khi bạn có một map cố định, chỉ duyệt qua nó, cũng không thể trả về một chuỗi key/value cố định.

Một lưu ý thêm, tính năng "kết quả duyệt map không có thứ tự" đã được thêm vào từ phiên bản Go 1.0.
