---
tags: 
categories: 
date created: 2022-06-09
date modified: 2023-07-10
title: Home
---

## Ghi chú được chỉnh sửa gần đây

```dataview
table WITHOUT ID file.link AS "Title",file.mtime as "Time"
from ""
sort file.mtime desc
limit 10
```

## Ghi chú được tạo trong vòng 7 ngày

```dataview
table file.ctime as Time
from ""
where date(today) - file.ctime <=dur(7 days)
sort file.ctime desc
limit 10
```
