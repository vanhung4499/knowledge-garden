---
title: DSA Intro
tags:
  - dsa
  - algorithm
  - data-structure
categories:
  - dsa
  - algorithm
  - data-structure
date created: 2023-09-23
date modified: 2023-09-24
---

# Cấu trúc dữ liệu và giải thuật

> Giải thuật là cốt lõi của chương trình, trong khi cấu trúc dữ liệu là linh hồn của chương trình.

**Algorithm + Data Structure = Program** là một cuốn sách rất nổi tiếng do [Niklaus Wirth](https://vi.wikipedia.org/wiki/Niklaus_Wirth), cha đẻ của ngôn ngữ Pascal, viết. Câu này cũng trở thành một câu nói kinh điển trong lĩnh vực khoa học máy tính. Điều này cho thấy mối quan hệ mật thiết giữa giải thuật và cấu trúc dữ liệu trong lập trình.

Trước khi học, chúng ta cần hiểu rõ giải thuật là gì và cấu trúc dữ liệu là gì? Tại sao chúng ta cần học giải thuật và cấu trúc dữ liệu?

Đơn giản, **giải thuật** là phương pháp hoặc quy trình để giải quyết vấn đề. Nếu chúng ta coi vấn đề như một hàm, thì giải thuật là quá trình chuyển đổi đầu vào thành đầu ra. **Cấu trúc dữ liệu** là cách biểu diễn dữ liệu và tập hợp các hoạt động tương ứng. **Chương trình** là sự thực hiện cụ thể của giải thuật và cấu trúc dữ liệu.

Nếu chúng ta so sánh **thiết kế chương trình** với việc nấu ăn, thì **cấu trúc dữ liệu** tương ứng với nguyên liệu và gia vị, trong khi **giải thuật** tương ứng với các phương pháp nấu ăn khác nhau, hoặc có thể coi là công thức nấu ăn. Cùng một nguyên liệu và gia vị, nhưng khi được nấu bởi các người khác nhau, hương vị sẽ khác nhau.

Vậy tại sao chúng ta cần học giải thuật và cấu trúc dữ liệu?

Tiếp tục với ví dụ nấu ăn. Chúng ta muốn món ăn của mình có **màu sắc, mùi thơm và hương vị đầy đủ**. Trong lập trình, chúng ta cũng tìm kiếm: lựa chọn cấu trúc dữ liệu phù hợp hơn, sử dụng giải thuật tốn ít thời gian và chiếm ít không gian.

Chúng ta học giải thuật và cấu trúc dữ liệu để có thể suy nghĩ về giải pháp từ khía cạnh độ phức tạp về thời gian và không gian, rèn luyện tư duy logic của mình, từ đó viết ra mã nguồn chất lượng cao, từ đó nâng cao kỹ năng lập trình của mình và đạt được phần thưởng công việc cao hơn.

Tất nhiên, điều này giống như việc nấu ăn, nắm vững nguyên liệu và gia vị, học cách nấu ăn, không có nghĩa là bạn sẽ nấu ra một món ăn ngon. Tương tự, việc nắm vững giải thuật và cấu trúc dữ liệu không có nghĩa là bạn sẽ biết viết chương trình. Điều này đòi hỏi sự suy nghĩ và học hỏi liên tục, để trở thành một lập trình viên xuất sắc.

## 1. Cấu trúc dữ liệu

> **Cấu trúc dữ liệu (Data Structure)**: Tập hợp các phần tử dữ liệu có tính chất cấu trúc.

Đơn giản mà nói, **"cấu trúc dữ liệu"** là cách tổ chức và lưu trữ dữ liệu.

Cụ thể hơn, cấu trúc dữ liệu nghiên cứu về cấu trúc logic và cấu trúc vật lý của dữ liệu, cũng như mối quan hệ giữa chúng. Nó định nghĩa các phép toán tương ứng và thiết kế các thuật toán tương ứng, đồng thời đảm bảo rằng cấu trúc mới sau các phép toán vẫn giữ nguyên loại cấu trúc ban đầu.

Cấu trúc dữ liệu có vai trò quan trọng trong việc tối ưu hóa việc sử dụng phần cứng máy tính. Ví dụ, hệ điều hành muốn tìm vị trí lưu trữ của ứng dụng `Microsoft Word` trên đĩa cứng. Nếu quét toàn bộ đĩa cứng, hiệu suất sẽ rất kém. Tuy nhiên, nếu sử dụng cây B+ làm chỉ mục, việc tìm kiếm từ `Microsoft Word` sẽ dễ dàng hơn và sau đó chỉ cần tìm vị trí của ứng dụng trong thông tin tệp để xác định vị trí trên đĩa cứng.

Học cấu trúc dữ liệu giúp chúng ta hiểu và nắm vững cách dữ liệu được tổ chức và lưu trữ trong máy tính.

---

Về cấu trúc dữ liệu, chúng ta có thể phân loại theo **"cấu trúc logic"** và **"cấu trúc vật lý"** của dữ liệu.

### 1.1. Cấu trúc logic của dữ liệu

> **Cấu trúc logic (Logical Structure)**: Mối quan hệ giữa các phần tử dữ liệu.

Dựa trên mối quan hệ khác nhau giữa các phần tử, thông thường chúng ta có thể chia cấu trúc logic của dữ liệu thành bốn loại sau:

#### 1. Cấu trúc tập hợp

> **Cấu trúc tập hợp**: Các phần tử dữ liệu thuộc cùng một tập hợp mà không có mối quan hệ khác.

Trong cấu trúc tập hợp, các phần tử dữ liệu không có thứ tự và mỗi phần tử là duy nhất trong tập hợp. Cấu trúc tập hợp tương tự như "tập hợp" trong toán học.

#### 2. Cấu trúc tuyến tính

> **Cấu trúc tuyến tính**: Các phần tử dữ liệu có mối quan hệ "một một" với nhau.

Trong cấu trúc tuyến tính, các phần tử dữ liệu (ngoại trừ phần tử đầu tiên và cuối cùng) chỉ có một phần tử bên trái và một phần tử bên phải. Cấu trúc tuyến tính bao gồm mảng, danh sách liên kết và các cấu trúc dữ liệu phát sinh như ngăn xếp, hàng đợi, bảng băm.

#### 3. Cấu trúc cây

> **Cấu trúc cây**: Các phần tử dữ liệu có mối quan hệ "một nhiều" theo cấp bậc.

Cấu trúc cây đơn giản nhất là cây nhị phân. Cấu trúc này có thể được biểu diễn dễ dàng như: gốc, cây con trái, cây con phải. Cả cây con trái và cây con phải đều có cây con riêng của chúng. Ngoài cây nhị phân, cấu trúc cây còn bao gồm cây nhiều nhánh, cây từ điển, v.v.

#### 4. Cấu trúc đồ thị

> **Cấu trúc đồ thị**: Các phần tử dữ liệu có mối quan hệ "nhiều nhiều".

Cấu trúc đồ thị là một cấu trúc phi tuyến phức tạp hơn cấu trúc cây. Nó được sử dụng để biểu diễn mối quan hệ giữa các đối tượng. Một đồ thị bao gồm các đỉnh (gọi là "nút") và các cạnh (gọi là "đường") nối các đỉnh với nhau.

### 1.2. Cấu trúc vật lý của dữ liệu

> **Cấu trúc vật lý (Physical Structure)**: Cách lưu trữ cấu trúc logic của dữ liệu trong máy tính.

Có nhiều cấu trúc lưu trữ trong máy tính, nhưng hai cấu trúc phổ biến nhất là: **"cấu trúc lưu trữ tuần tự"** và **"cấu trúc lưu trữ liên kết"**.

#### 1. Cấu trúc lưu trữ tuần tự

> **Cấu trúc lưu trữ tuần tự (Sequential Storage Structure)**: Lưu trữ các phần tử dữ liệu trong các đơn vị lưu trữ liên tiếp, mối quan hệ logic giữa các phần tử dữ liệu được phản ánh trực tiếp qua địa chỉ lưu trữ của chúng.

Trong cấu trúc lưu trữ tuần tự, các phần tử dữ liệu liên tiếp về mặt logic cũng sẽ liên tiếp về mặt vật lý.

Ưu điểm của cấu trúc này là: đơn giản, dễ hiểu và sử dụng ít không gian lưu trữ nhất. Nhược điểm là: cần phải cấp phát không gian lưu trữ trước, và một số thao tác có hiệu suất thấp (di chuyển, xóa phần tử).

#### 2. Cấu trúc lưu trữ liên kết

> **Cấu trúc lưu trữ liên kết (Linked Storage Structure)**: Lưu trữ các phần tử dữ liệu trong các đơn vị lưu trữ tùy ý, mối quan hệ logic giữa các phần tử dữ liệu được phản ánh thông qua con trỏ lưu trữ trong các đơn vị.

Trong cấu trúc lưu trữ liên kết, các phần tử dữ liệu có thể liên tiếp về mặt logic hoặc không liên tiếp về mặt vật lý. Mỗi đơn vị lưu trữ không chỉ lưu trữ thông tin dữ liệu mà còn lưu trữ địa chỉ của đơn vị lưu trữ tiếp theo trong mối quan hệ logic. Địa chỉ này được gọi là con trỏ.

Ưu điểm của cấu trúc này là: không cần phải cấp phát không gian lưu trữ trước, và một số thao tác có hiệu suất cao hơn (chèn, di chuyển, xóa phần tử). Nhược điểm là: ngoài thông tin dữ liệu, còn cần lưu trữ thông tin con trỏ, do đó cấu trúc lưu trữ liên kết tốn nhiều không gian hơn cấu trúc lưu trữ tuần tự.

## 2. Thuật toán

> **Thuật toán hay giải thuật (Algorithm)**: Mô tả chính xác và đầy đủ các bước để giải quyết một vấn đề cụ thể, biểu diễn trong máy tính dưới dạng một tập hợp các chỉ thị, thuật toán đại diện cho cách mô tả hệ thống để giải quyết vấn đề.

Đơn giản mà nói, **"Thuật toán"** là phương pháp giải quyết vấn đề.

Cụ thể hơn, thuật toán là một chuỗi các bước tính toán, nó biểu thị phương pháp chung để giải quyết một loại vấn đề tính toán. Đối với mọi đầu vào của loại vấn đề đó, nó có thể tính toán từng bước một và cuối cùng cho ra kết quả. Thuật toán không phụ thuộc vào bất kỳ ngôn ngữ nào, có thể được mô tả bằng **ngôn ngữ tự nhiên, ngôn ngữ lập trình (Python, C, C++, Java, v.v.)**, hoặc có thể được biểu diễn bằng **mã giả, sơ đồ luồng**.

Dưới đây là một số ví dụ để minh họa ý nghĩa của thuật toán.

- Ví dụ 1:

> **Mô tả vấn đề**:
>
> - Làm thế nào để đi từ Thành phố Hồ Chí Minh đến Hà Nội?
>
> **Phương pháp giải quyết**:
>
> 1. Chọn đi bằng máy bay, đi bằng máy bay mất ít thời gian nhất, nhưng chi phí cao nhất.
> 2. Chọn đi bằng xe buýt dài hạn, đi bằng xe buýt chi phí thấp, nhưng mất nhiều thời gian.
> 3. Chọn đi bằng tàu cao tốc hoặc tàu hỏa, mất ít thời gian và giá cả không quá cao.

- Ví dụ 2:

> **Mô tả vấn đề**:
>
> - Làm thế nào để tính tổng của $1 + 2 + 3 + … + 100$?
>
> **Phương pháp giải quyết**:
>
> 1. Sử dụng máy tính từ $1$ bắt đầu, tiếp tục cộng thêm $2$, sau đó cộng thêm $3$, …, tiếp tục cộng cho đến $100$, kết quả là $5050$.
> 2. Sử dụng công thức tổng của Gauss: **Tổng = (Số đầu + Số cuối) * Số phần tử / 2**, tính toán trực tiếp kết quả là: $\frac{(1+100) * 100}{2} = 5050$.

- Ví dụ 3:

> **Mô tả vấn đề**:
>
> - Làm thế nào để sắp xếp một mảng gồm $n$ số nguyên theo thứ tự tăng dần?
>
> **Phương pháp giải quyết**:
>
> 1. Sử dụng thuật toán sắp xếp nổi bọt để sắp xếp mảng gồm $n$ số nguyên theo thứ tự tăng dần.
> 2. Chọn thuật toán sắp xếp chèn, sắp xếp trộn, sắp xếp nhanh, v.v. khác để sắp xếp mảng gồm $n$ số nguyên theo thứ tự tăng dần.

Các phương pháp giải quyết trong $3$ ví dụ trên đều có thể coi là thuật toán. Phương pháp giải quyết để đi từ Thành phố Hồ Chí Minh đến Hà Nội có thể coi là thuật toán, phương pháp tính tổng của $1 \sim 100$ cũng có thể coi là thuật toán. Phương pháp sắp xếp mảng cũng có thể coi là thuật toán. Và từ $3$ ví dụ này, chúng ta có thể thấy rằng đối với một vấn đề cụ thể, thường có nhiều thuật toán khác nhau để giải quyết.

### 2.1. Các đặc điểm cơ bản của thuật toán

Thuật toán thực chất là một chuỗi các bước tính toán, các bước này có thể giải quyết một vấn đề cụ thể. Ngoài ra, **thuật toán** cần phải có những đặc điểm cơ bản sau:

1. **Đầu vào**: Đối với mỗi vấn đề cần giải quyết, nó phải được truyền cho thuật toán theo một cách nào đó. Những tham số ban đầu được gán cho thuật toán được gọi là đầu vào. Ví dụ, đầu vào trong ví dụ $1$ là các tham số địa điểm xuất phát và đích đến (Hà Nội, Thành phố Hồ Chí Minh), đầu vào trong ví dụ $3$ là mảng gồm $n$ số nguyên.
2. **Đầu ra**: Thuật toán được tạo ra để giải quyết vấn đề, vì vậy nó phải trả về một kết quả. Ít nhất, thuật toán cần có một hoặc nhiều tham số là đầu ra. Ví dụ, đầu ra trong ví dụ $1$ là phương tiện giao thông cuối cùng được chọn, đầu ra trong ví dụ $2$ là tổng của dãy số, đầu ra trong ví dụ $3$ là mảng đã được sắp xếp.
3. **Hữu hạn**: Thuật toán phải kết thúc trong một số bước hữu hạn và nên hoàn thành trong một khoảng thời gian chấp nhận được. Ví dụ, trong ví dụ $1$, nếu chúng ta chọn đi du lịch từ Thành phố Hồ Chí Minh đến Hà Nội vào ngày lễ 30/4, và sau đó suy nghĩ ba ngày mà không quyết định được cách nào để đi Hà Nội, thì kế hoạch du lịch này sẽ bị hủy bỏ và thuật toán này sẽ không hợp lý.
4. **Xác định**: Mỗi chỉ thị trong thuật toán phải có ý nghĩa rõ ràng và không gây hiểu lầm hoặc nhiều nghĩa. Nghĩa là mỗi bước của thuật toán phải được định nghĩa chính xác và không có sự mơ hồ hoặc nhiều ý nghĩa.
5. **Khả thi**: Mỗi bước của thuật toán phải có khả năng thực hiện, có thể thực hiện trong một số lần thực hiện hữu hạn và có thể chuyển đổi thành chương trình chạy trên máy tính để đạt được kết quả chính xác.

### 2.2. Mục tiêu của thuật toán

Nghiên cứu thuật toán nhằm tạo ra các phương pháp giải quyết vấn đề hiệu quả hơn. Đối với một vấn đề cụ thể, thường có nhiều thuật toán khác nhau để giải quyết. Và các thuật toán khác nhau có **chi phí** khác nhau. Nói cách khác, một thuật toán tốt ít nhất nên đạt được hai mục tiêu sau:

1. **Thời gian chạy ngắn hơn (độ phức tạp thời gian thấp hơn)**;
2. **Chiếm ít không gian bộ nhớ hơn (độ phức tạp không gian thấp hơn)**.

Giả sử máy tính thực hiện một lệnh trong $1$ nanosecond (không thực tế), thuật toán thứ nhất mất $100$ nanosecond để thực hiện, thuật toán thứ hai mất $3$ nanosecond để thực hiện. Nếu không xem xét việc sử dụng bộ nhớ, rõ ràng thuật toán thứ hai tốt hơn thuật toán thứ nhất.

Giả sử kích thước của một đơn vị bộ nhớ trong máy tính là một byte, thuật toán thứ nhất sử dụng $3$ byte bộ nhớ, thuật toán thứ hai sử dụng $100$ byte bộ nhớ. Nếu không xem xét thời gian chạy, rõ ràng thuật toán thứ nhất tốt hơn thuật toán thứ hai.

Tuy nhiên, thực tế là thuật toán thường cần xem xét cả thời gian chạy và việc sử dụng bộ nhớ. Khi thời gian chạy càng ít, việc sử dụng bộ nhớ càng nhỏ, thuật toán càng tốt. Tuy nhiên, luôn có nhiều yếu tố khác nhau ảnh hưởng đến thời gian chạy và việc sử dụng bộ nhớ. Ví dụ, khi thời gian chạy quá lớn, chúng ta có thể xem xét việc sử dụng bộ nhớ để đổi lấy thời gian chạy ngắn hơn. Hoặc trong trường hợp yêu cầu thời gian chạy không cao, nhưng bộ nhớ hạn chế, chúng ta có thể chọn thuật toán sử dụng ít bộ nhớ hơn, nhưng tốn thời gian chạy hơn.

Ngoài ra, một thuật toán tốt cũng nên đạt được các mục tiêu sau:

1. **Đúng đắn**: Đúng đắn có nghĩa là thuật toán đáp ứng yêu cầu cụ thể của vấn đề, chương trình chạy đúng, không có lỗi cú pháp, và có thể vượt qua kiểm tra phần mềm tiêu chuẩn để đạt được yêu cầu dự kiến.
2. **Dễ đọc**: Dễ đọc có nghĩa là thuật toán tuân theo quy tắc đặt tên biến, dễ hiểu, có các câu chú thích phù hợp, dễ đọc và dễ hiểu cho chính bạn và người khác, dễ dàng sửa đổi và gỡ lỗi sau này.
3. **Robustness**: Robustness có nghĩa là thuật toán có phản ứng và xử lý tốt với dữ liệu và hoạt động không hợp lệ.
