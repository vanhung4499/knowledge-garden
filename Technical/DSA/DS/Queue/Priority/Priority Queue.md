---
title: Priority Queue
tags:
  - dsa
  - data-structure
categories:
  - dsa
  - data-structure
date created: 2023-09-29
date modified: 2023-09-29
---

## 1. Giới thiệu hàng đợi ưu tiên

> **Hàng đợi ưu tiên (Priority Queue)**: Là một loại hàng đợi đặc biệt. Trong hàng đợi ưu tiên, các phần tử được gán mức ưu tiên và khi truy cập các phần tử trong hàng đợi, phần tử có mức ưu tiên cao nhất được xóa trước.

Hàng đợi ưu tiên khác biệt lớn nhất so với hàng đợi thông thường là **thứ tự xóa phần tử**.

- Thứ tự xóa phần tử trong hàng đợi thông thường phụ thuộc vào thứ tự thêm phần tử vào hàng đợi, tuân theo quy tắc "đầu tiên vào, đầu tiên ra".
- Thứ tự xóa phần tử trong hàng đợi ưu tiên không phụ thuộc vào thứ tự thêm phần tử vào hàng đợi, mà được xác định bởi mức ưu tiên của phần tử. Phần tử có mức ưu tiên cao nhất được xóa trước, phần tử có mức ưu tiên thấp hơn sẽ xóa sau. Hàng đợi ưu tiên tuân theo quy tắc **"phần tử có mức ưu tiên cao nhất ra trước (First in, Largest out)"**.

## 2. Các trường hợp sử dụng hàng đợi ưu tiên

Hàng đợi ưu tiên được sử dụng rất nhiều trong các trường hợp, ví dụ:

- **Nén dữ liệu**: Thuật toán mã hóa Huffman.
- **Thuật toán tìm đường đi ngắn nhất**: Thuật toán Dijkstra.
- **Thuật toán xây cây khung nhỏ nhất**: Thuật toán Prim.
- **Lập lịch công việc**: Thực hiện các công việc hệ thống theo mức ưu tiên.
- **Mô phỏng dựa trên sự kiện**: Thuật toán xếp hàng khách hàng.
- **Vấn đề sắp xếp**: Tìm kiếm phần tử thứ k nhỏ nhất.

Nhiều ngôn ngữ cung cấp cài đặt hàng đợi ưu tiên. Ví dụ, trong Java có `PriorityQueue`, trong C++ có `priority_queue`, v.v. Trong Python, chúng ta cũng có thể sử dụng `heapq` để cài đặt hàng đợi ưu tiên. Dưới đây chúng ta sẽ tìm hiểu cách cài đặt hàng đợi ưu tiên.

## 3. Cách cài đặt hàng đợi ưu tiên

Các hoạt động cơ bản liên quan đến hàng đợi ưu tiên tương tự như hàng đợi thông thường, chủ yếu là **"hoạt động thêm phần tử"** và **"hoạt động xóa phần tử"**.

Cách cài đặt hàng đợi ưu tiên cũng có nhiều cách, ngoài cách sử dụng "cài đặt mảng (lưu trữ tuần tự)" và "cài đặt danh sách liên kết", cách phổ biến nhất mà chúng ta thường sử dụng là sử dụng **"cấu trúc heap nhị phân"** để cài đặt hàng đợi ưu tiên. Dưới đây là giới thiệu và tổng kết về ba phương pháp.

- **Cài đặt hàng đợi ưu tiên bằng mảng (lưu trữ tuần tự)**: Hoạt động thêm phần tử bằng cách chèn trực tiếp vào cuối mảng, độ phức tạp thời gian là $O(1)$. Hoạt động xóa phần tử cần duyệt qua toàn bộ mảng, tìm phần tử có mức ưu tiên cao nhất, trả về và xóa phần tử đó, độ phức tạp thời gian là $O(n)$.
- **Cài đặt hàng đợi ưu tiên bằng danh sách liên kết**: Các phần tử trong danh sách liên kết được sắp xếp theo mức ưu tiên, hoạt động thêm phần tử cần tạo nút cho phần tử cần chèn và tìm vị trí chèn phù hợp trong danh sách liên kết, độ phức tạp thời gian là $O(n)$. Hoạt động xóa phần tử trả về phần tử đầu danh sách liên kết và xóa phần tử đó, độ phức tạp thời gian là $O(1)$.
- **Cài đặt hàng đợi ưu tiên bằng cấu trúc heap nhị phân**: Xây dựng một cấu trúc heap nhị phân, heap nhị phân được sắp xếp theo mức ưu tiên. Hoạt động thêm phần tử là chèn phần tử vào vị trí phù hợp trong heap nhị phân, độ phức tạp thời gian là $O(\log_2n)$. Hoạt động xóa phần tử trả về phần tử có mức ưu tiên cao nhất trong heap nhị phân và xóa phần tử đó, độ phức tạp thời gian cũng là $O(\log n)$.

Dưới đây là tổng kết về độ phức tạp thời gian của hoạt động thêm phần tử và hoạt động xóa phần tử trong ba cách cài đặt.

|      | Độ phức tạp thời gian hoạt động thêm phần tử | Độ phức tạp thời gian hoạt động xóa phần tử (lấy phần tử có mức ưu tiên cao nhất) |
| ---- | ----------------------------------------- | -------------------------------------------------------------------------------- |
| Heap | $O(\log n)$                               | $O(\log n)$                                                                      |
| Mảng | $O(1)$                                    | $O(n)$                                                                           |
| Danh sách liên kết | $O(n)$                             | $O(1)$                                                                           |

Từ bảng trên, chúng ta có thể thấy rằng sử dụng **"cấu trúc heap nhị phân"** để cài đặt hàng đợi ưu tiên là hiệu quả nhất. Dưới đây chúng ta sẽ tìm hiểu cách cài đặt hàng đợi ưu tiên bằng cấu trúc heap nhị phân.

## 4. Cài đặt hàng đợi ưu tiên bằng cấu trúc heap nhị phân

Chúng ta đã từng giới thiệu về heap nhị phân trong [[Heap Sort]]. Ở đây, chúng ta sẽ giới thiệu một lần nữa.

### 4.1 Định nghĩa heap nhị phân

Heap nhị phân: Là một cây nhị phân hoàn chỉnh thỏa mãn một trong hai điều kiện sau:

- Max Heap: Giá trị của nút gốc ≥ giá trị của các nút con.
- Min Heap: Giá trị của nút gốc ≤ giá trị của các nút con.

### 4.2 Các hoạt động cơ bản của heap nhị phân

Heap nhị phân chủ yếu liên quan đến hai hoạt động cơ bản: "Phương pháp điều chỉnh heap" và "Phương pháp xây dựng mảng thành heap nhị phân".

- **Phương pháp điều chỉnh heap `heapAdjust`**: Tạo một heap mới từ các phần tử còn lại sau khi di chuyển phần tử có giá trị lớn nhất. Cụ thể như sau:
  - Bắt đầu từ nút gốc, điều chỉnh vị trí của các nút từ trên xuống dưới để tạo thành một heap. Đó là, hoán đổi nút có chỉ số `i` với nút con trái (chỉ số `2 * i`) hoặc nút con phải (chỉ số `2 * i + 1`) có giá trị lớn nhất.
  - Vì đã hoán đổi vị trí, các tính chất heap của cây con trái và cây con phải của nút hiện tại đã bị phá vỡ. Do đó, tiếp tục điều chỉnh từ các nút con trái và phải của nút hiện tại từ trên xuống dưới.
  - Tiếp tục quá trình này cho đến khi toàn bộ cây nhị phân hoàn chỉnh trở thành một Max Heap.
- **Phương pháp xây dựng mảng thành heap nhị phân (phương pháp xây dựng heap ban đầu) `heapify`**:
  - Nếu cây nhị phân tương ứng với mảng gốc (không nhất thiết là heap) có độ sâu `d`, bắt đầu từ nhánh cuối cùng của tầng `d - 1` (chỉ số là ⌊n/2⌋), ban đầu đặt `i = ⌊n/2⌋`, và gọi phương pháp điều chỉnh heap.
  - Mỗi lần gọi phương pháp điều chỉnh heap, giảm `i` đi một đơn vị, cho đến khi `i == 1`, và sau đó gọi một lần nữa, mảng gốc đã được xây dựng thành một heap nhị phân.

### 4.3 Các hoạt động cơ bản của hàng đợi ưu tiên

Trong "3. Cách cài đặt hàng đợi ưu tiên", chúng ta đã đề cập đến các hoạt động cơ bản của hàng đợi ưu tiên, chủ yếu là **"hoạt động thêm phần tử"** và **"hoạt động xóa phần tử"**.

- **Hoạt động thêm phần tử `heappush`**:
  - Đầu tiên, chèn phần tử `value` cần thêm vào cuối mảng `nums`.
  - Nếu độ sâu của cây nhị phân hoàn chỉnh là `d`, bắt đầu từ nhánh cuối cùng của tầng `d - 1` (chỉ số là ⌊n/2⌋), ban đầu đặt `i = ⌊n/2⌋`, và tìm vị trí chèn phù hợp từ dưới lên.
  - Nếu gặp phần tử `value` nhỏ hơn nút gốc hiện tại, chèn `value` vào vị trí hiện tại. Ngược lại, tiếp tục tìm vị trí chèn phù hợp từ dưới lên.
  - Khi tìm thấy vị trí chèn phù hợp hoặc đạt đến vị trí gốc, chèn `value` vào vị trí đó.
- **Hoạt động xóa phần tử `heappop`**:
  - Hoán đổi phần tử đầu và phần tử cuối của mảng `nums`. Lúc này, phần tử cuối của `nums` là phần tử có giá trị lớn nhất (mức ưu tiên cao nhất), loại bỏ phần tử này khỏi `nums` và lưu trữ nó.
  - Sau khi loại bỏ, gọi phương pháp điều chỉnh heap cho các phần tử còn lại trong `nums`, biến chúng thành một Max Heap.

### 4.4 Cài đặt hàng đợi ưu tiên bằng cấu trúc heap nhị phân

Chúng ta sẽ cài đặt hàng đợi ưu tiên bằng cách sử dụng cấu trúc heap nhị phân. Chúng ta sẽ triển khai năm phương thức chính:

- `heapAdjust`: Điều chỉnh cây nhị phân thành Max Heap.
- `heapify`: Xây dựng mảng thành heap nhị phân (phương pháp xây dựng heap ban đầu).
- `heappush`: Thêm một phần tử vào heap, cũng là phương thức enqueue của hàng đợi ưu tiên.
- `heappop`: Xóa phần tử đầu heap, cũng là phương thức dequeue của hàng đợi ưu tiên, trả về phần tử có mức ưu tiên cao nhất trong hàng đợi.
- `heapSort`: Sắp xếp mảng bằng heap.

```python
class PriorityQueue:
    def heapAdjust(self, nums: List[int], index: int, end: int) -> None:
        left = index * 2 + 1
        right = left + 1
        while left <= end:
            max_index = index
            if nums[left] > nums[max_index]:
                max_index = left
            if right <= end and nums[right] > nums[max_index]:
                max_index = right
            if index == max_index:
                break
            nums[index], nums[max_index] = nums[max_index], nums[index]
            index = max_index
            left = index * 2 + 1
            right = left + 1

    def heapify(self, nums: List[int]) -> None:
        size = len(nums)
        for i in range((size - 2) // 2, -1, -1):
            self.heapAdjust(nums, i, size - 1)

    def heappush(self, nums: List[int], value: int) -> None:
        nums.append(value)
        size = len(nums)
        i = size - 1
        while (i - 1) // 2 >= 0:
            cur_root = (i - 1) // 2
            if nums[cur_root] > value:
                break
            nums[i] = nums[cur_root]
            i = cur_root
        nums[i] = value

    def heappop(self, nums: List[int]) -> int:
        size = len(nums)
        nums[0], nums[-1] = nums[-1], nums[0]
        top = nums.pop()
        if size > 0:
            self.heapAdjust(nums, 0, size - 2)
        return top

    def heapSort(self, nums: List[int]) -> List[int]:
        self.heapify(nums)
        size = len(nums)
        for i in range(size):
            nums[0], nums[size - i - 1] = nums[size - i - 1], nums[0]
            self.heapAdjust(nums, 0, size - i - 2)
        return nums
```

### 4.5 Cài đặt hàng đợi ưu tiên bằng module heapq

Trong Python, module `heapq` cung cấp thuật toán hàng đợi ưu tiên. Hàm `heapq.heappush()` được sử dụng để chèn một phần tử vào hàng đợi `queue`. Hàm `heapq.heappop()` được sử dụng để xóa một phần tử khỏi hàng đợi `queue`.

Cần lưu ý rằng: Hàm `heapq.heappop()` luôn trả về phần tử "nhỏ nhất". Vì vậy, khi sử dụng `heapq.heappush()`, chúng ta đặt mức ưu tiên là số âm để các phần tử được sắp xếp theo thứ tự từ cao đến thấp. Điều này ngược lại với việc sắp xếp các phần tử theo thứ tự từ thấp đến cao trong thuật toán heap thông thường. Mục đích của việc này là để `heapq.heappop()` luôn trả về phần tử có mức ưu tiên cao nhất.

```python
import heapq

class PriorityQueue:
    def __init__(self):
        self.queue = []
        self.index = 0

    def push(self, item, priority):
        heapq.heappush(self.queue, (-priority, self.index, item))
        self.index += 1

    def pop(self):
        return heapq.heappop(self.queue)[-1]
```

## 5. Ứng dụng của hàng đợi ưu tiên

### 5.1 Cửa sổ trượt và giá trị lớn nhất

#### 5.1.1 Liên kết đề bài

- [239. Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)

#### 5.1.2 Đề bài

**Mô tả**: Cho một mảng số nguyên `nums` và một số nguyên `k`, đại diện cho kích thước của cửa sổ trượt. Cửa sổ trượt di chuyển từ trái sang phải qua mảng và chỉ hiển thị `k` số nguyên trong cửa sổ tại mỗi vị trí. Chúng ta chỉ có thể nhìn thấy các số nguyên trong cửa sổ trượt. Cửa sổ trượt di chuyển một vị trí sang phải sau mỗi lần trượt.

**Yêu cầu**: Trả về mảng chứa các giá trị lớn nhất trong cửa sổ trượt tại mỗi vị trí.

**Ghi chú**:

- Độ dài của mảng `nums` không vượt quá $10^5$.
- Giá trị của mảng `nums` nằm trong khoảng $-10^4$ đến $10^4$.
- Kích thước của cửa sổ trượt `k` nằm trong khoảng từ 1 đến độ dài của mảng `nums`.

**Ví dụ**:

```python
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [3,3,5,5,6,7]
Explanation:
Cửa sổ trượt              Giá trị lớn nhất
---------------           -----
[1  3  -1] -3  5  3  6  7   3
 1 [3  -1  -3] 5  3  6  7   3
 1  3 [-1  -3  5] 3  6  7   5
 1  3  -1 [-3  5  3] 6  7   5
 1  3  -1  -3 [5  3  6] 7   6
 1  3  -1  -3  5 [3  6  7]  7
 
Input: nums = [1], k = 1
Output: [1]
```

#### 5.1.3 Ý tưởng giải quyết

Giải pháp brute force sẽ sử dụng hai vòng lặp lồng nhau, có độ phức tạp thời gian là $O(n \times k)$. Dựa trên phạm vi dữ liệu đã cho, nó chắc chắn sẽ vượt quá giới hạn thời gian.

Chúng ta có thể sử dụng hàng đợi ưu tiên để giải quyết vấn đề này.

##### Ý tưởng 1: Hàng đợi ưu tiên

1. Ban đầu, chèn `k` phần tử đầu tiên vào hàng đợi ưu tiên, sử dụng mảng `nums` và chỉ số tạo thành một cặp giá trị. Hàng đợi ưu tiên sẽ sắp xếp các phần tử dựa trên giá trị của mảng.
2. Tiếp theo, duyệt cửa sổ trượt từ phần tử thứ `k` và thêm cặp giá trị hiện tại vào hàng đợi ưu tiên.
3. Khi chỉ số của phần tử đầu hàng đợi ưu tiên không còn trong phạm vi cửa sổ trượt (`q[0][1] <= i - k`), lặp đi lặp lại việc xóa phần tử đầu hàng đợi ưu tiên cho đến khi chỉ số của phần tử có giá trị lớn nhất trong hàng đợi ưu tiên nằm trong phạm vi cửa sổ trượt.
4. Thêm giá trị lớn nhất vào mảng kết quả và tiếp tục trượt sang phải.
5. Khi kết thúc quá trình trượt, trả về mảng kết quả.

##### Ý tưởng 1: Mã giả

```python
class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        size = len(nums)
        q = [(-nums[i], i) for i in range(k)]
        heapq.heapify(q)
        res = [-q[0][0]]

        for i in range(k, size):
            heapq.heappush(q, (-nums[i], i))
            while q[0][1] <= i - k:
                heapq.heappop(q)
            res.append(-q[0][0])
        return res
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \log n)$.
- **Độ phức tạp không gian**: $O(k)$.

### 5.2 Các phần tử có tần suất cao nhất

#### 5.2.1 Liên kết đề bài

- [347. Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)

#### 5.2.2 Đề bài

**Mô tả**: Cho một mảng số nguyên `nums` và một số nguyên `k`.

**Yêu cầu**: Trả về `k` phần tử có tần suất xuất hiện cao nhất trong mảng `nums`. Có thể trả về kết quả theo bất kỳ thứ tự nào.

**Ghi chú**:

- Độ dài của mảng `nums` không vượt quá $10^5$.
- Giá trị của mảng `nums` nằm trong khoảng $-10^4$ đến $10^4$.
- Giá trị của `k` nằm trong khoảng từ 1 đến số lượng phần tử khác nhau trong mảng `nums`.

**Ví dụ**:

```python
Input: nums = [1,1,1,2,2,3], k = 2
Output: [1,2]


Input: nums = [1], k = 1
Output: [1]
```

#### 5.2.3 Ý tưởng giải quyết

##### Ý tưởng 1: Bảng băm + hàng đợi ưu tiên

1. Sử dụng bảng băm để đếm tần suất xuất hiện của các phần tử trong mảng `nums`.
2. Sau đó, chuyển bảng băm thành một mảng mới, loại bỏ các phần tử trùng lặp. Độ phức tạp thời gian và không gian là $O(n)$.
3. Sử dụng hàng đợi ưu tiên để xây dựng một hàng đợi ưu tiên, với mức ưu tiên là tần suất xuất hiện của các phần tử. Lúc này, phần tử có mức ưu tiên cao nhất chính là phần tử có tần suất xuất hiện cao nhất. Độ phức tạp thời gian và không gian là $O(n)$.
4. Thêm phần tử có mức ưu tiên cao nhất vào mảng kết quả và thực hiện thao tác dequeue. Độ phức tạp thời gian là $O(\log_2 n)$.
   - Thao tác dequeue: Hoán đổi phần tử đầu hàng đợi ưu tiên với phần tử cuối hàng đợi, loại bỏ phần tử cuối khỏi hàng đợi. Tiếp tục điều chỉnh thành Max Heap.
5. Lặp lại bước 4 cho đến khi kết thúc `k` lần. Độ phức tạp thời gian của `k` lần là $O(n\log_2 n)$.

##### Ý tưởng 1: Mã giả

```python
class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:

    	# Đếm tần suất xuất hiện của các phần tử
        nums_dict = defaultdict(int)
        for num in nums:
            nums_dict[num] += 1

        # Chuyển bảng băm thành mảng mới
        new_nums = list(set(nums))
        size = len(new_nums)

        # Xây dựng hàng đợi ưu tiên
        queue = []
        for num in new_nums:
            heapq.heappush(queue, (-nums_dict[num], num))
        
        res = []
        for _ in range(k):
            res.append(heapq.heappop(queue)[1])
        return res
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \log n)$.
- **Độ phức tạp không gian**: $O(n)$.

###