---
title: Two Pointers Problems
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-27
date modified: 2023-09-27
---

# Các bài toán về con trỏ kép

#### Bài toán về con trỏ đối đầu

| Số thứ tự | Tiêu đề | Giải pháp | Nhãn | Độ khó |
| :------ | :------ | :------ | :------ | :------ |
| 0167 | [Tổng hai số II - Mảng đã được sắp xếp](https://leetcode-cn.com/problems/two-sum-ii-input-array-is-sorted/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0167.%20T%E1%BB%95ng%20hai%20s%E1%BB%91%20II%20-%20M%E1%BA%A3ng%20%C4%91%C3%A3%20%C4%91%C6%B0%E1%BB%A3c%20s%E1%BA%AFp%20x%E1%BA%BFp.md) | Mảng, con trỏ kép, tìm kiếm nhị phân | Trung bình |
| 0344 | [Đảo ngược chuỗi](https://leetcode-cn.com/problems/reverse-string/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0344.%20%C4%90%E1%BA%A3o%20ng%C6%B0%E1%BB%A3c%20chu%E1%BB%97i.md) | Con trỏ kép, chuỗi | Dễ |
| 0345 | [Đảo ngược các nguyên âm trong chuỗi](https://leetcode-cn.com/problems/reverse-vowels-of-a-string/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0345.%20%C4%90%E1%BA%A3o%20ng%C6%B0%E1%BB%A3c%20c%C3%A1c%20nguy%C3%AAn%20%C3%A2m%20trong%20chu%E1%BB%97i.md) | Con trỏ kép, chuỗi | Dễ |
| 0125 | [Xác định xem một chuỗi có phải là chuỗi đối xứng hay không](https://leetcode-cn.com/problems/valid-palindrome/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0125.%20X%C3%A1c%20%C4%91%E1%BB%8Bnh%20xem%20m%E1%BB%99t%20chu%E1%BB%97i%20c%C3%B3%20ph%E1%BA%A3i%20l%C3%A0%20chu%E1%BB%97i%20%C4%91%E1%BB%91i%20x%E1%BB%A9ng%20hay%20kh%C3%B4ng.md) | Con trỏ kép, chuỗi | Dễ |
| 0011 | [Chứa nước nhiều nhất](https://leetcode-cn.com/problems/container-with-most-water/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0011.%20Ch%E1%BB%A9a%20n%C6%B0%E1%BB%9Bc%20nhi%E1%BB%81u%20nh%E1%BA%A5t.md) | Tham lam, mảng, con trỏ kép | Trung bình |
| 0611 | [Số tam giác hợp lệ](https://leetcode-cn.com/problems/valid-triangle-number/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0611.%20S%E1%BB%91%20tam%20gi%C3%A1c%20h%E1%BB%A3p%20l%E1%BB%87.md) | Tham lam, mảng, con trỏ kép, tìm kiếm nhị phân, sắp xếp | Trung bình |
| 0015 | [Tổng ba số](https://leetcode-cn.com/problems/3sum/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0015.%20T%E1%BB%95ng%20ba%20s%E1%BB%91.md) | Mảng, con trỏ kép, sắp xếp | Trung bình |
| 0016 | [Tổng ba số gần nhất](https://leetcode-cn.com/problems/3sum-closest/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0016.%20T%E1%BB%95ng%20ba%20s%E1%BB%91%20g%E1%BA%A7n%20nh%E1%BA%A5t.md) | Mảng, con trỏ kép, sắp xếp | Trung bình |
| 0018 | [Tổng bốn số](https://leetcode-cn.com/problems/4sum/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0018.%20T%E1%BB%95ng%20b%E1%BB%91n%20s%E1%BB%91.md) | Mảng, con trỏ kép, sắp xếp | Trung bình |
| 0259 | [Tổng số tam giác nhỏ hơn](https://leetcode-cn.com/problems/3sum-smaller/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0259.%20T%E1%BB%95ng%20s%E1%BB%91%20tam%20gi%C3%A1c%20nh%E1%BB%8F%20h%C6%A1n.md) | Mảng, con trỏ kép, tìm kiếm nhị phân, sắp xếp | Trung bình |
| 0658 | [Tìm K số gần nhất](https://leetcode-cn.com/problems/find-k-closest-elements/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0658.%20T%C3%ACm%20K%20s%E1%BB%91%20g%E1%BA%A7n%20nh%E1%BA%A5t.md) | Mảng, con trỏ kép, tìm kiếm nhị phân, sắp xếp, cửa sổ trượt, hàng đợi ưu tiên | Trung bình |
| 1099 | [Tổng hai số nhỏ hơn K](https://leetcode-cn.com/problems/two-sum-less-than-k/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/1099.%20T%E1%BB%95ng%20hai%20s%E1%BB%91%20nh%E1%BB%8F%20h%C6%A1n%20K.md) | Mảng, con trỏ kép, tìm kiếm nhị phân, sắp xếp | Dễ |
| 0075 | [Phân loại màu sắc](https://leetcode-cn.com/problems/sort-colors/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0075.%20Ph%C3%A2n%20lo%E1%BA%A1i%20m%C3%A0u%20s%E1%BA%AFc.md) | Mảng, con trỏ kép, sắp xếp | Trung bình |
| 0360 | [Chuyển đổi mảng thành mảng tăng dần](https://leetcode-cn.com/problems/sort-transformed-array/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0360.%20Chuy%E1%BB%83n%20%C4%91%E1%BB%95i%20m%E1%BA%A3ng%20th%C3%A0nh%20m%E1%BA%A3ng%20t%C4%83ng%20d%E1%BA%A7n.md) | Mảng, toán học, con trỏ kép, sắp xếp | Trung bình |
| 0977 | [Bình phương mảng đã được sắp xếp](https://leetcode-cn.com/problems/squares-of-a-sorted-array/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0977.%20B%C3%ACnh%20ph%C6%B0%C6%A1ng%20m%E1%BA%A3ng%20%C4%91%C3%A3%20%C4%91%C6%B0%E1%BB%A3c%20s%E1%BA%AFp%20x%E1%BA%BFp.md) | Mảng, con trỏ kép, sắp xếp | Dễ |
| 0881 | [Cứu sống](https://leetcode-cn.com/problems/boats-to-save-people/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0881.%20C%E1%BB%A9u%20s%E1%BB%91ng.md) | Tham lam, mảng, con trỏ kép, sắp xếp | Trung bình |
| 0042 | [Hứng nước mưa](https://leetcode-cn.com/problems/trapping-rain-water/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0042.%20H%E1%BB%A9ng%20n%C6%B0%E1%BB%9Bc%20m%C6%B0a.md) | Ngăn xếp, mảng, con trỏ kép, quy hoạch động, ngăn xếp đơn điệu | Khó |
| 0443 | [Nén chuỗi](https://leetcode-cn.com/problems/string-compression/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0443.%20N%C3%A9n%20chu%E1%BB%97i.md) | Con trỏ kép, chuỗi | Dễ |
| 1229 | [Lên lịch họp](https://leetcode-cn.com/problems/meeting-scheduler/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/1229.%20L%C3%AAn%20l%E1%BB%8Bch%20h%E1%BB%8Dp.md) | Mảng, con trỏ kép, sắp xếp | Trung bình |
| 0415 | [Cộng hai chuỗi](https://leetcode-cn.com/problems/add-strings/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0415.%20C%E1%BB%99ng%20hai%20chu%E1%BB%97i.md) | Toán học, chuỗi, mô phỏng | Dễ |

#### Bài toán về con trỏ nhanh và chậm

| Số thứ tự | Tiêu đề | Giải pháp | Nhãn | Độ khó |
| :------ | :------ | :------ | :------ | :------ |
| 0026 | [Xóa các phần tử trùng lặp trong mảng đã được sắp xếp](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-array/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0026.%20X%C3%B3a%20c%C3%A1c%20ph%E1%BA%A7n%20t%E1%BB%AD%20tr%C3%B9ng%20l%E1%BA%B7p%20trong%20m%E1%BA%A3ng%20%C4%91%C3%A3%20%C4%91%C6%B0%E1%BB%A3c%20s%E1%BA%AFp%20x%E1%BA%BFp.md) | Mảng, con trỏ nhanh và chậm | Dễ |
| 0080 | [Xóa các phần tử trùng lặp trong mảng đã được sắp xếp II](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-array-ii/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0080.%20X%C3%B3a%20c%C3%A1c%20ph%E1%BA%A7n%20t%E1%BB%AD%20tr%C3%B9ng%20l%E1%BA%B7p%20trong%20m%E1%BA%A3ng%20%C4%91%C3%A3%20%C4%91%C6%B0%E1%BB%A3c%20s%E1%BA%AFp%20x%E1%BA%BFp%20II.md) | Mảng, con trỏ nhanh và chậm | Trung bình |
| 0027 | [Xóa phần tử khỏi mảng](https://leetcode-cn.com/problems/remove-element/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0027.%20X%C3%B3a%20ph%E1%BA%A7n%20t%E1%BB%AD%20kh%E1%BB%8Fi%20m%E1%BA%A3ng.md) | Mảng, con trỏ nhanh và chậm | Dễ |
| 0283 | [Dịch chuyển số 0 trong mảng](https://leetcode-cn.com/problems/move-zeroes/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0283.%20D%E1%BB%8Bch%20chuy%E1%BB%83n%20s%E1%BB%91%200%20trong%20m%E1%BA%A3ng.md) | Mảng, con trỏ nhanh và chậm | Dễ |
| 0845 | [Tìm dãy con dài nhất](https://leetcode-cn.com/problems/longest-mountain-in-array/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0845.%20T%C3%ACm%20d%C3%A3y%20con%20d%C3%A0i%20nh%E1%BA%A5t.md) | Mảng, con trỏ nhanh và chậm, quy hoạch động, liệt kê | Trung bình |
| 0088 | [Hợp nhất hai mảng đã được sắp xếp](https://leetcode-cn.com/problems/merge-sorted-array/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0088.%20H%E1%BB%A3p%20nh%E1%BA%A5t%20hai%20m%E1%BA%A3ng%20%C4%91%C3%A3%20%C4%91%C6%B0%E1%BB%A3c%20s%E1%BA%AFp%20x%E1%BA%BFp.md) | Mảng, con trỏ nhanh và chậm, sắp xếp | Dễ |
| 0719 | [Tìm khoảng cách nhỏ nhất thứ K](https://leetcode-cn.com/problems/find-k-th-smallest-pair-distance/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0719.%20T%C3%ACm%20kho%E1%BA%A3ng%20c%C3%A1ch%20nh%E1%BB%8F%20nh%E1%BA%A5t%20th%E1%BB%A9%20K.md) | Mảng, con trỏ nhanh và chậm, tìm kiếm nhị phân, sắp xếp | Khó |
| 0334 | [Dãy con tam giác tăng dần](https://leetcode-cn.com/problems/increasing-triplet-subsequence/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0334.%20D%C3%A3y%20con%20tam%20gi%C3%A1c%20t%C4%83ng%20d%E1%BA%A7n.md) | Tham lam, mảng | Trung bình |
| 0978 | [Dãy con dài nhất có tính chất sóng](https://leetcode-cn.com/problems/longest-turbulent-subarray/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0978.%20D%C3%A3y%20con%20d%C3%A0i%20nh%E1%BA%A5t%20c%C3%B3%20t%C3%ADnh%20ch%E1%BA%A5t%20s%C3%B3ng.md) | Mảng, con trỏ nhanh và chậm, trượt cửa sổ, động kế | Trung bình |

#### Bài toán về con trỏ kép tách rời

| Số thứ tự | Tiêu đề | Giải pháp | Nhãn | Độ khó |
| :------ | :------ | :------ | :------ | :------ |
| 0350 | [Hợp nhất hai mảng II](https://leetcode-cn.com/problems/intersection-of-two-arrays-ii/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0350.%20H%E1%BB%A3p%20nh%E1%BA%A5t%20hai%20m%E1%BA%A3ng%20II.md) | Mảng, bảng băm, con trỏ kép, tìm kiếm nhị phân, sắp xếp | Dễ |
| 0925 | [Nhấn phím lâu](https://leetcode-cn.com/problems/long-pressed-name/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0925.%20Nh%E1%BA%A5n%20ph%C3%ADm%20l%C3%A2u.md) | Con trỏ kép, chuỗi | Dễ |
| 0844 | [So sánh hai chuỗi có chứa ký tự xóa](https://leetcode-cn.com/problems/backspace-string-compare/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0844.%20So%20s%C3%A1nh%20hai%20chu%E1%BB%97i%20c%C3%B3%20ch%E1%BB%A9a%20k%C3%BD%20t%E1%BB%B1%20x%C3%B3a.md) | Ngăn xếp, con trỏ kép, chuỗi, mô phỏng | Dễ |
| 1229 | [Lịch họp](https://leetcode-cn.com/problems/meeting-scheduler/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/1229.%20L%E1%BB%8Bch%20h%E1%BB%8Dp.md) | Mảng, con trỏ kép, sắp xếp | Trung bình |
| 0415 | [Cộng hai chuỗi](https://leetcode-cn.com/problems/add-strings/) | [Python](https://github.com/itcharge/LeetCode-Py/blob/main/Solutions/0415.%20C%E1%BB%99ng%20hai%20chu%E1%BB%97i.md) | Toán học, chuỗi, mô phỏng | Dễ |
