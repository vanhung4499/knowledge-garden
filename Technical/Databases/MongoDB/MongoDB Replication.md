---
title: MongoDB Replication
tags: [db, mongodb, nosql]
categories: [db, mongodb, nosql]
date created: 2023-07-24
date modified: 2023-07-24
---

# Sao lưu trong MongoDB

Sao lưu có thể **cung cấp tính sẵn có dự phòng và tăng cường khả năng sẵn có của dữ liệu**. Sử dụng nhiều bản sao dữ liệu trên các máy chủ cơ sở dữ liệu khác nhau có thể cung cấp khả năng chống lỗi trong trường hợp một máy chủ cơ sở dữ liệu bị sự cố và dữ liệu bị mất.

Trong một số trường hợp, sao lưu cũng có thể **cung cấp khả năng xử lý đọc lớn hơn**. Vì khách hàng có thể gửi các hoạt động đọc đến các máy chủ khác nhau. Việc duy trì các bản sao dữ liệu trên các trung tâm dữ liệu khác nhau cũng có thể cải thiện tính cục bộ của dữ liệu và khả năng sẵn có của ứng dụng phân tán. Bạn cũng có thể duy trì các bản sao khác nhau cho mục đích đặc biệt như phục hồi sau thảm họa, báo cáo hoặc sao lưu.

## Bản sao dữ liệu MongoDB

Bản sao dữ liệu trong MongoDB là một nhóm quy trình mongod duy trì cùng một tập hợp dữ liệu. Một bản sao dữ liệu bao gồm nhiều thành viên dữ liệu và một thành viên trọng tâm (tùy chọn). Trong các thành viên dữ liệu, chỉ có một thành viên được coi là chính và các thành viên khác được coi là phụ.

**Thành viên chính chịu trách nhiệm nhận tất cả các hoạt động ghi**. Một bản sao dữ liệu chỉ có thể có một thành viên chính và có thể xác nhận rằng các hoạt động ghi trên các nút trong cụm bằng cách sử dụng [`{ w: "majority" }`](https://docs.mongodb.com/manual/reference/write-concern/#writeconcern."majority").

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200920165054.svg)

**Các thành viên phụ sao chép nhật ký hoạt động của thành viên chính và áp dụng các hoạt động này vào tập dữ liệu của mình** để đồng bộ dữ liệu với thành viên chính. Nếu thành viên chính không khả dụng, một thành viên phụ đủ điều kiện sẽ được bầu làm thành viên chính mới.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200920165055.svg)

Trong một số trường hợp (ví dụ: chỉ có một thành viên chính và một thành viên phụ do hạn chế về chi phí), bạn có thể chọn thêm một quy trình mongod làm thành viên trọng tâm trong bản sao dữ liệu. Thành viên trọng tâm tham gia vào quá trình bầu cử nhưng không lưu trữ dữ liệu (không cung cấp dự phòng dữ liệu).

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200920165053.svg)

Thành viên trọng tâm luôn là thành viên trọng tâm. Trong quá trình bầu cử, thành viên chính có thể bị giáng cấp thành thành viên phụ và thành viên phụ có thể được thăng cấp thành thành viên chính.

## Sao lưu không đồng bộ

### Hoạt động chậm

Các thành viên phụ sao chép nhật ký hoạt động của thành viên chính và áp dụng các hoạt động này vào tập dữ liệu của mình. Bằng cách đồng bộ hóa dữ liệu từ thành viên chính, ngay cả khi một hoặc nhiều thành viên gặp sự cố, bản sao dữ liệu (cụm MongoDB) vẫn có thể tiếp tục hoạt động.

Từ phiên bản 4.2 trở đi, các thành viên phụ trong bản sao dữ liệu ghi lại các hoạt động chậm (thời gian hoạt động dài hơn ngưỡng được đặt). Những hoạt động chậm này được ghi lại trong [nhật ký chẩn đoán](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-logpath) của [REPL](https://docs.mongodb.com/manual/reference/log-messages/#REPL) và được ghi nhận trong thông báo nhật ký văn bản với văn bản `op: <oplog entry>` đã mất `<num>ms`. Những mục nhật ký hoạt động chậm này chỉ phụ thuộc vào ngưỡng hoạt động chậm và không phụ thuộc vào cấp độ nhật ký (cấp độ hệ thống hoặc cấp độ thành phần), cấu hình hoặc tỷ lệ mẫu hoạt động chậm. Các bộ thu thập không ghi lại các mục nhật ký hoạt động chậm.

### Độ trễ và kiểm soát luồng

Độ trễ sao lưu (Replication lag) là thời gian mất để sao chép các hoạt động ghi từ thành viên chính sang thành viên phụ. Thời gian trễ ngắn là chấp nhận được, nhưng với độ trễ sao lưu tăng lên, có thể gặp vấn đề nghiêm trọng, ví dụ như áp lực bộ nhớ đệm trên thành viên chính.

Từ MongoDB 4.2 trở đi, quản trị viên có thể giới hạn tốc độ ghi của thành viên chính để giữ cho hầu hết thời gian trễ dưới ngưỡng tối đa được cấu hình [`flowControlTargetLagSeconds`](https://docs.mongodb.com/manual/reference/parameters/#param.flowControlTargetLagSeconds).

Mặc định, kiểm soát luồng được bật.

Khi kiểm soát luồng được kích hoạt, khi thời gian trễ tiến đến [`flowControlTargetLagSeconds`](https://docs.mongodb.com/manual/reference/parameters/#param.flowControlTargetLagSeconds), các hoạt động ghi trên thành viên chính phải nhận được mã thông báo trước khi khóa và thực hiện hoạt động ghi. Bằng cách giới hạn số lượng mã thông báo được phát ra mỗi giây, cơ chế kiểm soát luồng cố gắng giữ cho thời gian trễ dưới mục tiêu.

## Chuyển đổi lỗi

Khi thời gian giao tiếp giữa thành viên chính và các thành viên khác trong cụm vượt quá [`electionTimeoutMillis`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.settings.electionTimeoutMillis) được cấu hình (mặc định là 10 giây), các thành viên phù hợp sẽ yêu cầu một cuộc bầu cử và đề cử chính mình làm thành viên chính mới. Cụm cố gắng hoàn thành cuộc bầu cử và khôi phục hoạt động bình thường.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200920175429.svg)

Trước khi hoàn thành cuộc bầu cử, bản sao dữ liệu không thể xử lý các hoạt động ghi. Nếu bản sao dữ liệu được cấu hình để chạy khi thành viên chính không khả dụng, nó có thể tiếp tục cung cấp truy vấn đọc.

Nếu cấu hình bản sao dữ liệu mặc định là chạy khi thành viên chính không khả dụng, nó sẽ tiếp tục đáp ứng các truy vấn đọc trong khi chờ cuộc bầu cử và sau đó tiếp tục ghi lại hoạt động ghi từ thành viên chính mới.

Ứng dụng kết nối nên bao gồm xử lý lỗi tự động và tái thử lại cho việc chuyển đổi lỗi tự động và cuộc bầu cử tiếp theo. Từ MongoDB 3.6 trở đi, các trình điều khiển MongoDB có thể phát hiện sự mất kết nối với thành viên chính và có thể tự động thử lại một số hoạt động ghi.

Từ MongoDB 4.4 trở đi, MongoDB cung cấp đọc gương: nó sẽ nói trước dữ liệu gần đây của thành viên có thể bầu cử (thành viên ưu tiên lớn hơn 0). Việc nói trước bộ nhớ đệm của thành viên có thể bầu cử có thể giúp khôi phục nhanh hơn sau cuộc bầu cử.
