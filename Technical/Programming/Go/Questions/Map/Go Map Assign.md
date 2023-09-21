---
title: Go Map Assign
tags:
  - interview
  - golang
categories: golang, interview
date created: 2023-09-21
date modified: 2023-09-21
---

# Go: Map Assign

Thông qua hợp ngữ (Assembly), chúng ta có thể thấy rằng việc chèn hoặc sửa đổi key vào map cuối cùng sẽ gọi đến hàm `mapassign`.

Thực tế, cú pháp chèn hoặc sửa đổi key là giống nhau, chỉ khác nhau ở việc key trong trường hợp chèn không tồn tại trong map, trong khi key trong trường hợp sửa đổi đã tồn tại trong map.

`mapassign` có một loạt các hàm, tùy thuộc vào loại key khác nhau, trình biên dịch sẽ tối ưu hóa chúng thành các "hàm nhanh" tương ứng.

|Loại key|Chèn|
|---|---|
|uint32|`mapassign_fast32(t *maptype, h *hmap, key uint32) unsafe.Pointer`|
|uint64|`mapassign_fast64(t *maptype, h *hmap, key uint64) unsafe.Pointer`|
|string|`mapassign_faststr(t *maptype, h *hmap, ky string) unsafe.Pointer`|

Chúng ta chỉ cần nghiên cứu hàm gán chung nhất `mapassign`.

Tổng thể, quá trình rất đơn giản: tính toán giá trị hash của key, dựa vào giá trị hash, theo quy trình trước đó, tìm vị trí để gán giá trị (có thể là chèn key mới hoặc cập nhật key cũ), và gán giá trị vào vị trí tương ứng.

Mã nguồn chính xem xét tương tự như trước đó, nhưng cốt lõi vẫn là một vòng lặp lồng nhau, vòng lặp bên ngoài duyệt qua bucket và overflow bucket của nó, vòng lặp bên trong duyệt qua các cell của bucket. Do giới hạn không thể hiển thị mã chú thích trong phần này, tôi cũng không hiển thị chúng, bạn có thể xem mã nguồn để hiểu.

Ở đầu hàm, nó sẽ kiểm tra cờ flags của map. Nếu cờ ghi được đặt thành 1, điều này có nghĩa là có một goroutine khác đang thực hiện hoạt động "ghi", dẫn đến panic. Điều này cũng cho thấy map không an toàn đối với goroutine.

Như chúng ta đã biết từ trước, quá trình mở rộng là tiến trình dần dần, nếu map đang trong quá trình mở rộng, khi key được xác định đến một bucket nào đó, cần đảm bảo bucket này đã hoàn thành quá trình di chuyển. Nghĩa là các key trong bucket cũ đã được di chuyển sang bucket mới (phân tách thành 2 bucket mới), mới có thể thực hiện hoạt động chèn hoặc cập nhật trong bucket mới.

Như bây giờ chúng ta đã đến vị trí mà key nên được đặt, việc tìm vị trí của mình rất quan trọng. Chuẩn bị hai con trỏ, một (`inserti`) trỏ đến vị trí của giá trị hash của key trong mảng tophash, và một (`insertk`) trỏ đến vị trí của cell (nơi key cuối cùng được đặt), tất nhiên, vị trí của giá trị tương ứng cũng dễ xác định. Ba trong số này thực tế là liên quan đến nhau, chỉ số vị trí trong mảng tophash quyết định vị trí của key trong toàn bộ bucket (8 key), trong khi vị trí của giá trị cần "băng qua" độ dài 8 key.

Trong quá trình lặp, inserti và insertk lần lượt trỏ đến cell trống đầu tiên tìm thấy. Nếu sau đó không tìm thấy sự tồn tại của key trong map, có nghĩa là ban đầu map không có key này, điều này có nghĩa là chèn key mới. Vì vậy, vị trí cuối cùng của key sẽ là "vị trí trống" đầu tiên được tìm thấy (tophash là trống).

Nếu 8 key trong bucket này đã được đặt đầy, sau khi thoát khỏi vòng lặp, nếu thấy inserti và insertk đều trống, điều này có nghĩa là cần gắn thêm một overflow bucket vào sau bucket hiện tại. Tất nhiên, cũng có thể là gắn thêm một overflow bucket vào sau overflow bucket. Điều này cho thấy, quá nhiều key hash đến bucket này.

Sau khi kiểm tra trạng thái của map, chúng ta cần kiểm tra xem nó có cần mở rộng hay không. Nếu đáp ứng điều kiện mở rộng, chúng ta sẽ tự động kích hoạt quá trình mở rộng một lần.

Sau đó, quá trình tìm vị trí key đã được định vị trước đó cần được thực hiện lại. Bởi vì sau khi mở rộng, phân bố key đã thay đổi.

Cuối cùng, các giá trị liên quan đến map sẽ được cập nhật, nếu chèn key mới, giá trị của trường count trong map sẽ tăng lên 1; cờ ghi `hashWriting` được đặt ở đầu hàm sẽ được xóa.

Ngoài ra, có một điểm quan trọng cần đề cập. Như đã đề cập trước đó, việc tìm vị trí key và thực hiện gán giá trị không chính xác. Chúng ta có thể tìm câu trả lời từ hợp ngữ (Assembly). Tôi sẽ tiết lộ câu trả lời, bạn có thể tìm hiểu thêm nếu quan tâm. Con trỏ trả về từ hàm `mapassign` chính là vị trí của giá trị tương ứng với key, có địa chỉ này, việc gán giá trị trở nên dễ dàng.
