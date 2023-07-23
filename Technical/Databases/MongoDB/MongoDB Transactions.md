---
title: MongoDB Transactions
tags: [db, mongodb, nosql]
categories: [db, mongodb, nosql]
date created: 2023-07-24
date modified: 2023-07-24
---

# Giao dịch trong MongoDB

writeConcern có thể xác định số lượng node cần xác nhận để ghi thành công.

- Mặc định: Không có thiết lập nào cho replica set nhiều node, do đó có thể mất dữ liệu.
- `w: "majority"`: Được coi là ghi thành công nếu hầu hết các node xác nhận.
- `w: "all"`: Chỉ được coi là ghi thành công nếu tất cả các node xác nhận.

journal xác định cách xem ghi thành công. Có các giá trị sau:

- `true`: Chỉ được coi là ghi thành công khi hoạt động ghi được lưu vào tập tin nhật ký (journal).
- `false`: Chỉ được coi là ghi thành công khi hoạt động ghi được lưu trong bộ nhớ.

【Ví dụ】Sử dụng tham số writeConcern trong một cụm

```javascript
db.transaction.insert({ count: 1 }, { writeConcern: { w: 'majoriy' } })
db.transaction.insert({ count: 1 }, { writeConcern: { w: '4' } })
db.transaction.insert({ count: 1 }, { writeConcern: { w: 'all' } })
```

【Ví dụ】Cấu hình node trễ để mô phỏng độ trễ mạng

```
conf=rs.conf()
conf.memebers[2].slaveDelay=5
conf.memebers[2].priority=0
rs.reconfig(conf)
```
