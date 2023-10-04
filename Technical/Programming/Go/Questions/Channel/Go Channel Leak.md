---
title: Go Channel Leak
tags:
  - golang
  - interview
categories:
  - golang
  - interview
date created: 2023-10-04
date modified: 2023-10-04
---

# Go Channel: Leak

Channel có thể gây ra rò rỉ goroutine.

Nguyên nhân của rò rỉ là khi goroutine thực hiện các hoạt động trên channel và sau đó bị chặn trong trạng thái gửi hoặc nhận, trong khi channel đang ở trạng thái đầy hoặc trống và không thay đổi. Đồng thời, bộ thu gom rác không thu hồi các tài nguyên như vậy, dẫn đến goroutine bị chặn mãi mãi trong hàng đợi chờ mà không bao giờ được giải phóng.

Ngoài ra, trong quá trình chạy chương trình, nếu không có goroutine nào tham chiếu đến một channel, gc sẽ thu hồi nó và không gây ra rò rỉ bộ nhớ.
