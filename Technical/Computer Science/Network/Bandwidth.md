---
categories: [network, computer-science]
title: Bandwidth
date created: 2023-05-29
date modified: 2023-07-10
tags: [network, computer-science]
---

## 📌 Băng thông (Bandwidth)

Trong kỹ thuật, băng thông được định nghĩa **là độ rộng của một dải tần số mà một chức năng cụ thể** có thể được thực hiện.  

Nó không liên quan gì đến tần số tín hiệu cao hay thấp.  

**Băng thông trong mạng** có nghĩa là lượng dữ liệu tối đa có thể được truyền trong một đơn vị thời gian.  

Cũng có thể giải thích là dung lượng truyền trên một đơn vị thời gian liên quan đến tốc độ mạng.

## Đơn vị bps

- **`bps`** bits per second bit/s

> - `bps` khác BPS hay Bps, nên lưu ý
> - BPS, Bps là Bytes per second

Một ví dụ thực là các nhà mạng cung cấp cái gói internet tính theo Mbps (Megabit per second) như là 80Mbps. Khi download thì các phần mềm thường tính theo MBps (Mega-byte per second) thì tốc độ đo download là khoảng 10MBps.

## 2. Băng thông trên internet wired/wireless

- Băng thông tần số trong mạng có dây  
	- Gói Internet loại 150Mbps khi ký hợp đồng với nhà mạng, thể hiện băng thông truyền dữ liệu
	- Ngay cả khi sử dụng Ethernet 10Gbit, hiệu suất có thể giảm đi tùy thuộc vào điều kiện mạng.  
- Băng thông tần số trong mạng không dây  
	- Wifi thông dụng thường sử dụng hai tần số: 2.4GHz (2.4~2.462GHz) và 5GHz (5.180~5.850GHz).  
	- Đôi khi nó được thể hiện dưới dạng băng thông 2,4 GHz hoặc băng thông 5 GHz trong phương tiện truyền thông hoặc cuộc sống hàng ngày, nhưng đây là cách diễn đạt không chính xác.

## 3. Thông lượng mạng và mối quan hệ với băng thông

- Thông lượng (Throughput) đề cập đến lượng dữ liệu thực sự được xử lý trên một đơn vị thời gian và không thể vượt quá dung lượng băng thông.  
- Giả sử rằng có một đường ống mà nước chảy từ bể chứa nước đến nguồn cấp nước thông qua máy bơm, lượng nước chảy là thông lượng và lượng nước tối đa có thể chảy qua đường ống là băng thông.
- Giống như khi bạn sử dụng hết 100% của một đường ống, đường kính trong của đường ống càng lớn thì nước chảy càng nhiều nhưng không phải lúc nào cũng đầy 100%.

## 4. Khả năng tắc nghẽn theo băng thông  

- Trong trường hợp nút có 100 đầu ra mạng, sử dụng đường truyền có băng thông là 1. Khi truyền dữ liệu với số đầu ra tối đa -> nghẽn  
- Khi lưu lượng tập trung vào một nút từ nhiều nút vượt quá băng thông đường truyền, v.v.
