---
title: Redis Interview Part 1
tags: [interview, db, redis]
categories: [interview, db, redis]
date created: 2023-08-19
date modified: 2023-08-19
---

# Redis Interview Part 1

## Bạn đã nghe nói về Redis chưa? nó là gì?

Redis là một cơ sở dữ liệu, tuy nhiên khác với cơ sở dữ liệu truyền thống, cơ sở dữ liệu của Redis được lưu trữ trong bộ nhớ, do đó tốc độ đọc ghi rất nhanh, vì vậy Redis được sử dụng rộng rãi trong lĩnh vực bộ nhớ đệm (cache).

Ngoài ra, Redis cũng thường được sử dụng làm khóa phân tán, Redis cung cấp nhiều loại dữ liệu để hỗ trợ các kịch bản kinh doanh khác nhau. Ngoài ra, Redis hỗ trợ ghi lại giao dịch, kịch bản LUA, sự kiện đẩy LRU, nhiều giải pháp cụm khác nhau.

## Tổng hợp năm cấu trúc dữ liệu của Redis

### **Chuỗi động đơn giản (Simple Dynamic String - SDS)**

Redis không sử dụng chuỗi truyền thống của ngôn ngữ C mà thay vào đó xây dựng một loại trừu tượng được gọi là Chuỗi động đơn giản (SDS) và sử dụng SDS làm biểu diễn chuỗi mặc định trong Redis.

Thực chất, SDS tương đương với char * trong ngôn ngữ C, nhưng nó có thể lưu trữ bất kỳ dữ liệu nhị phân nào và không thể được đánh dấu kết thúc chuỗi bằng ký tự '\0' như chuỗi C, vì vậy nó phải có một trường độ dài.

**Định nghĩa**

```c
struct sdshdr {
    // Số lượng byte đã sử dụng trong mảng buf
    // Bằng độ dài của chuỗi được lưu trữ trong SDS
    int len;
    
    // Số lượng byte chưa sử dụng trong mảng buf
    int free;
    
    // Mảng byte, được sử dụng để lưu trữ chuỗi
    char buf[];
}
```

**Ưu điểm**

- Thời gian lấy độ dài chuỗi là O(1).
- Ngăn chặn tràn bộ đệm.
- Giảm số lần phân bổ lại bộ nhớ khi thay đổi độ dài chuỗi.
- An toàn cho dữ liệu nhị phân.
- Tương thích với một số hàm chuỗi C.

SDS thường được sử dụng để lưu trữ chuỗi hoặc số trong các chức năng tính toán phức tạp của Redis.

### **Danh sách liên kết (Linked List)**

Khi một khóa danh sách chứa một số lượng lớn các phần tử hoặc tất cả các phần tử trong danh sách đều là chuỗi dài, Redis sử dụng danh sách liên kết làm cấu trúc dữ liệu cơ sở của khóa danh sách.

**Cấu trúc nút**

```c
typedef struct listNode {
    // Nút trước
    struct listNode *prev;
    // Nút sau
    struct listNode *next;
    // Giá trị của nút
    void *value;
} listNode;
```

**Cấu trúc danh sách**

```c
typedef struct list {
    // Nút đầu danh sách
    listNode *head;
    // Nút cuối danh sách
    listNode *tail;
    // Số lượng nút trong danh sách
    unsigned long len;
    // Hàm sao chép giá trị của nút
    void *(*dup)(void *ptr);
    // Hàm giải phóng giá trị của nút
    void (*free)(void *ptr);
    // Hàm so sánh giá trị của nút
    int(*match)(void *ptr, void *key);
} list;
```

**Đặc điểm**

- Danh sách liên kết được sử dụng rộng rãi trong việc triển khai các chức năng của Redis, bao gồm khóa danh sách, xuất bản và đăng ký, truy vấn chậm, giám sát, v.v.
- Mỗi nút danh sách được biểu diễn bằng một cấu trúc listNode, mỗi nút có một con trỏ trỏ đến nút trước và nút sau, vì vậy triển khai danh sách liên kết của Redis là danh sách liên kết hai chiều.
- Mỗi danh sách được biểu diễn bằng một cấu trúc list, cấu trúc này chứa con trỏ đầu danh sách, con trỏ cuối danh sách và thông tin về số lượng nút trong danh sách.
- Vì con trỏ trước của nút đầu tiên và con trỏ sau của nút cuối cùng đều trỏ đến NULL, nên triển khai danh sách liên kết của Redis là danh sách không vòng.
- Bằng cách thiết lập các hàm đặc thù cho các giá trị nút khác nhau, danh sách Redis có thể được sử dụng để lưu trữ các giá trị khác nhau.

### **Từ điển (Dictionary)**

Từ điển trong Redis được triển khai bằng cách sử dụng bảng băm, tương tự như cấu trúc dữ liệu `map` trong C++.

### **Bảng băm (Hash Table)**

```c
typedef struct dictht {
    // Mảng bảng băm
    dictEntry **table;
    // Kích thước bảng băm
    unsigned long size;
    // Mặt nạ kích thước bảng băm, được sử dụng để tính toán chỉ mục
    // Luôn bằng size - 1
    unsigned long sizemark;
    // Số lượng nút đã sử dụng trong bảng băm
    unsigned long used;
} dichht;
```

**Thuật toán băm**

Khi Redis sử dụng từ điển làm triển khai cơ sở dữ liệu hoặc triển khai khóa băm, Redis sử dụng thuật toán MurmurHash. Thuật toán này có ưu điểm là ngay cả khi khóa đầu vào là đều hoặc có quy tắc, thuật toán vẫn cho kết quả phân phối ngẫu nhiên tốt và tốc độ tính toán rất nhanh.

**Giải quyết xung đột băm**

Redis sử dụng phương pháp giải quyết xung đột bằng cách sử dụng phương pháp liên kết chuỗi. Mỗi nút trong bảng băm có một con trỏ tiếp theo, nhiều nút trong bảng băm có thể được kết nối bằng danh sách liên kết này, giải quyết vấn đề xung đột khóa.

**Đặc điểm**

1. Từ điển được sử dụng rộng rãi trong việc triển khai các chức năng của Redis, bao gồm cơ sở dữ liệu và khóa băm.
2. Redis sử dụng bảng băm làm cấu trúc dữ liệu cơ sở triển khai từ điển, mỗi từ điển có hai bảng băm, một bảng được sử dụng thường xuyên và một bảng chỉ được sử dụng khi thực hiện rehash.
3. Redis sử dụng thuật toán MurmurHash2 để tính toán giá trị băm của khóa.
4. Bảng băm sử dụng phương pháp liên kết chuỗi để giải quyết xung đột khóa.

### **Danh sách bỏ qua (Skip List)**

Hãy xem xét biểu đồ sau:  
![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/202205220024713.png)

Như hình trên, nếu chúng ta muốn tìm một phần tử, chúng ta phải bắt đầu từ nút đầu và duyệt cho đến khi tìm thấy nút tương ứng hoặc nút đầu tiên lớn hơn phần tử cần tìm (không tìm thấy). Độ phức tạp thời gian là O(N).

Tuy nhiên, nếu chúng ta nâng cấp một số nút trong danh sách, như hình dưới đây, chẳng hạn như mỗi hai nút có một nút ở mức trên. Sau đó, số lượng nút ở mức thứ hai chỉ bằng một nửa số lượng nút ở mức thứ nhất, hiệu suất tìm kiếm cũng sẽ được cải thiện.

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/202205220024190.png)

Quá trình tìm kiếm bắt đầu từ mức cao nhất của nút đầu tiên, tìm đến nút đầu tiên lớn hơn phần tử cần tìm, sau đó quay trở lại nút trước đó và tiếp tục tìm kiếm ở mức tiếp theo.

Ví dụ, nếu chúng ta muốn tìm số 16:

1. Bắt đầu từ mức cao nhất của nút đầu tiên, đến nút 7.
2. Nút tiếp theo của 7 là 39, lớn hơn 16, vì vậy chúng ta quay trở lại 7.
3. Bắt đầu từ 7, tiếp tục tìm kiếm ở mức tiếp theo, chúng ta có thể tìm thấy số 16.

Trong ví dụ này, số lượng nút được duyệt không ít hơn danh sách một chiều, nhưng khi có nhiều nút hơn và số cần tìm lớn hơn, lợi ích của việc này sẽ được thể hiện. Ví dụ khác, nếu chúng ta muốn **tìm số 39**, chỉ cần truy cập hai nút (7, 39) là có thể tìm thấy. Điều này giảm đi một nửa số lượng nút so với danh sách một chiều.

Để tránh việc thời gian phức tạp của việc chèn là O(N), số lượng nút trên mỗi mức không tuân thủ chính xác tỷ lệ 2:1, mà là ngẫu nhiên một số mức cho mỗi phần tử cần chèn.

Quá trình tính toán số mức ngẫu nhiên như sau:

1. Mỗi nút đều có mức đầu tiên.
2. Mức thứ hai có xác suất p, mức thứ ba có xác suất p*p.
3. Không vượt quá số mức tối đa.

**zskiplistNode**

```c
typedef struct zskiplistNode {
    // Con trỏ trở lại
    struct zskiplistNode *backward;
    // Điểm số
    double score;
    // Đối tượng thành viên
    robj *obj;
    // Mức
    struct zskiplistLevel {
        // Con trỏ tiếp theo
        struct zskiplistNode *forward;
        // Khoảng cách
        unsigned int span;
    } level[];
} zskiplistNode;
```

Nói chung, số lượng mức càng nhiều, tốc độ truy cập các nút khác càng nhanh.

**zskipList**

```c
typedef struct zskiplist {
    // Nút đầu danh sách
    struct zskiplistNode *header, *tail;
    // Số lượng nút trong danh sách
    unsigned long length;
    // Mức tối đa của nút trong danh sách
    int level;
} zskiplist;
```

**Đặc điểm**

- Danh sách bỏ qua được sử dụng làm triển khai cơ sở của tập hợp có thứ tự trong Redis.
- Triển khai danh sách bỏ qua của Redis bao gồm hai cấu trúc: zskiplist và zskiplistNode. Trong đó, zskiplist được sử dụng để lưu trữ thông tin về danh sách bỏ qua (ví dụ: nút đầu, nút cuối, độ dài), trong khi zskiplistNode được sử dụng để biểu diễn các nút trong danh sách bỏ qua.
- Mỗi nút trong danh sách bỏ qua được biểu diễn bằng cấu trúc listNode, mỗi nút có một con trỏ trỏ đến nút trước và nút sau, vì vậy triển khai danh sách bỏ qua của Redis là danh sách liên kết hai chiều.
- Mỗi danh sách bỏ qua được biểu diễn bằng cấu trúc list, cấu trúc này chứa con trỏ đầu danh sách, con trỏ cuối danh sách và thông tin về số lượng nút trong danh sách.
- Vì con trỏ trước của nút đầu tiên và con trỏ sau của nút cuối cùng đều trỏ đến NULL, nên triển khai danh sách bỏ qua của Redis là danh sách không vòng.
- Bằng cách thiết lập các hàm đặc thù cho các giá trị nút khác nhau, danh sách Redis có thể được sử dụng để lưu trữ các giá trị khác nhau.

### **Danh sách nén (Ziplist)**

> Danh sách nén (ziplist) được sử dụng làm triển khai cơ sở của khóa danh sách khi khóa danh sách chỉ chứa một số lượng nhỏ các mục danh sách và mỗi mục danh sách là một số nguyên nhỏ hoặc một chuỗi ngắn, Redis sẽ sử dụng danh sách nén.

**Đặc điểm**

Tên của nó đã nói lên mục đích của nó, đó là tiết kiệm bộ nhớ.

## 3. Các cấu trúc dữ liệu phổ biến trong Redis và các trường hợp sử dụng tương ứng là gì?

### **String (Chuỗi)**

Cấu trúc dữ liệu String là một cặp key-value đơn giản, trong đó value có thể là String hoặc số. Cấu trúc này thường được sử dụng trong các ứng dụng cache key-value thông thường và các tính toán đơn giản như đếm số lượng bài viết, số lượng người theo dõi, v.v.

### **Hash (Bảng băm)**

Hash là một bảng ánh xạ giữa các trường (field) và giá trị (value) của kiểu dữ liệu String. Hash thích hợp để lưu trữ các đối tượng phức tạp như thông tin người dùng, thông tin sản phẩm, v.v. Bằng cách sử dụng Hash, bạn có thể dễ dàng chỉnh sửa giá trị của một trường trong đối tượng mà không cần thay đổi toàn bộ đối tượng.

### **List (Danh sách)**

List là một danh sách liên kết trong Redis. Cấu trúc List thường được sử dụng trong các tính năng như danh sách theo dõi, danh sách người theo dõi, danh sách tin nhắn, v.v. Với List, bạn có thể thực hiện các thao tác như thêm phần tử vào đầu hoặc cuối danh sách, lấy phần tử từ danh sách, và duyệt qua danh sách.

### **Set (Tập hợp)**

Set là một tập hợp các giá trị không trùng lặp trong Redis. Set thích hợp để lưu trữ danh sách các phần tử duy nhất và kiểm tra xem một phần tử có thuộc tập hợp hay không. Set cung cấp các phép toán tập hợp như giao, hợp, hiệu giữa các tập hợp. Ví dụ, trong ứng dụng mạng xã hội, bạn có thể sử dụng Set để lưu trữ danh sách bạn bè, danh sách người theo dõi, v.v.

### **Sorted Set (Tập hợp có thứ tự)**

Sorted Set là một tập hợp các giá trị không trùng lặp trong Redis, mỗi giá trị được gắn kèm với một điểm số (score). Sorted Set sắp xếp các giá trị theo điểm số từ thấp đến cao. Cấu trúc này thích hợp để lưu trữ các bảng xếp hạng, danh sách sản phẩm theo thứ tự, v.v. Ví dụ, trong ứng dụng trò chơi, bạn có thể sử dụng Sorted Set để lưu trữ bảng xếp hạng người chơi, điểm số cao nhất, v.v.

Các cấu trúc dữ liệu trong Redis được thiết kế để cung cấp hiệu suất cao và tính linh hoạt trong việc lưu trữ và truy xuất dữ liệu. Mỗi cấu trúc dữ liệu có ưu điểm và trường hợp sử dụng riêng, cho phép bạn lựa chọn cấu trúc phù hợp với nhu cầu của ứng dụng của mình.

## Tại sao chúng ta lại sử dụng Redis, một cơ sở dữ liệu mới, khi đã có MySQL?

Lý do chính là Redis có hiệu suất cao và hỗ trợ đồng thời nhiều kết nối.

- **Hiệu suất cao**: Khi người dùng truy cập lần đầu vào dữ liệu trong cơ sở dữ liệu, quá trình này sẽ khá chậm vì dữ liệu được đọc từ ổ cứng. Tuy nhiên, nếu lưu trữ dữ liệu mà người dùng truy cập vào trong bộ nhớ đệm, lần truy cập tiếp theo vào dữ liệu này sẽ nhanh hơn nhiều. Vì việc truy cập vào bộ nhớ đệm là trực tiếp vào bộ nhớ, nên tốc độ rất nhanh. Nếu dữ liệu tương ứng trong cơ sở dữ liệu thay đổi, chỉ cần cập nhật dữ liệu tương ứng trong bộ nhớ đệm là được!
- **Hỗ trợ đồng thời nhiều kết nối**: Trực tiếp truy cập vào bộ nhớ đệm có thể chịu được nhiều yêu cầu hơn so với truy cập trực tiếp vào cơ sở dữ liệu.

## Trong C++, Map cũng là một cấu trúc dữ liệu đệm, tại sao không sử dụng Map mà lại chọn Redis làm đệm?

Nói một cách chính xác, đệm có thể được chia thành hai loại: **đệm cục bộ** và **đệm phân tán**.

Ví dụ với ngôn ngữ C++, chúng ta có thể sử dụng cấu trúc dữ liệu map có sẵn trong STL để triển khai đệm, nhưng chỉ có thể triển khai đệm cục bộ. Điều quan trọng là đối tượng đệm chỉ tồn tại trong suốt thời gian chạy của chương trình và kết thúc khi chương trình kết thúc. Nếu có nhiều phiên bản của chương trình, mỗi phiên bản sẽ có một bản sao riêng của đệm và không đồng bộ với nhau.

Sử dụng Redis hoặc Memcached, được gọi là đệm phân tán, trong trường hợp có nhiều phiên bản của chương trình, các phiên bản này sẽ chia sẻ cùng một bản sao của dữ liệu đệm. Điều này đảm bảo tính nhất quán của dữ liệu đệm giữa các phiên bản và giúp tăng hiệu suất.

## Lợi ích của việc sử dụng Redis là gì?

1. Tốc độ truy cập nhanh: Do dữ liệu được lưu trữ trong bộ nhớ, tương tự như HashMap trong Java hoặc bảng băm trong C++, việc truy cập dữ liệu trở nên rất nhanh.
2. Đa dạng về kiểu dữ liệu: Redis hỗ trợ nhiều kiểu dữ liệu như String, List, Set, Sorted Set và Hash.
3. Hỗ trợ giao dịch: Redis hỗ trợ giao dịch, các thao tác trên dữ liệu đều được thực hiện theo nguyên tắc "tất cả hoặc không có gì".
4. Các tính năng phong phú: Redis có thể được sử dụng làm bộ nhớ đệm, hệ thống tin nhắn, đặt thời gian hết hạn cho khóa, v.v.

## Sự khác biệt giữa Memcached và Redis là gì?

1. Phương thức lưu trữ:
	- Memcached lưu trữ toàn bộ dữ liệu trong bộ nhớ, do đó nếu có mất điện, dữ liệu sẽ bị mất. Memcached không có chức năng lưu trữ dữ liệu lâu dài và dữ liệu không thể vượt quá kích thước bộ nhớ.
	- Redis lưu trữ một phần dữ liệu trong bộ nhớ và một phần trên đĩa, đảm bảo tính nhất quán và khả năng phục hồi dữ liệu sau khi mất điện.

2. Hỗ trợ kiểu dữ liệu:
	- Memcached chỉ hỗ trợ kiểu dữ liệu đơn giản như chuỗi (string).
	- Redis hỗ trợ nhiều kiểu dữ liệu phức tạp hơn, bao gồm danh sách (list), tập hợp (set), tập hợp có thứ tự (sorted set) và bảng băm (hash).

3. Triển khai và giao tiếp:
	- Memcached và Redis có cách triển khai và giao tiếp khác nhau với khách hàng.
	- Redis tự xây dựng cơ chế máy ảo VM, vì nếu sử dụng các hàm hệ thống thông thường, sẽ mất thời gian di chuyển và yêu cầu.

4. Chế độ cụm (cluster mode):
	- Memcached không có chế độ cụm tích hợp sẵn, việc triển khai cụm phải dựa vào khách hàng để phân chia dữ liệu vào các nút khác nhau.
	- Redis hỗ trợ chế độ cụm (cluster mode) tích hợp sẵn, cho phép mở rộng dễ dàng và đảm bảo khả năng chịu tải cao.

5. Mô hình mạng:
	- Memcached sử dụng mô hình đa luồng và không chặn IO (non-blocking IO).
	- Redis sử dụng mô hình đơn luồng và IO đa kênh (multiplexing IO).

6. Kích thước giá trị:
	- Redis cho phép giá trị lên đến 512MB.
	- Memcached chỉ cho phép giá trị lên đến 1MB.

## Ưu điểm của Redis so với Memcached là gì?

1. Tất cả các giá trị trong Memcached đều là chuỗi đơn giản, trong khi Redis là sự thay thế của nó và hỗ trợ các loại dữ liệu phong phú hơn.
2. Tốc độ của Redis nhanh hơn rất nhiều so với Memcached.
3. Redis có khả năng lưu trữ dữ liệu lâu dài.

## Dữ liệu nóng và dữ liệu lạnh trong bộ nhớ đệm là gì?  

Thực tế là như tên gọi, dữ liệu nóng là dữ liệu được truy cập nhiều lần, trong khi dữ liệu lạnh là dữ liệu ít hoặc không bao giờ được truy cập.

Cần lưu ý rằng chỉ có dữ liệu nóng, bộ nhớ đệm mới có giá trị. Đối với dữ liệu lạnh, phần lớn dữ liệu có thể đã bị đẩy ra khỏi bộ nhớ trước khi được truy cập lại, không chỉ chiếm dụng bộ nhớ mà còn không có giá trị lớn.

Dữ liệu cần được đọc ít nhất hai lần trước khi cập nhật, bộ nhớ đệm mới có ý nghĩa. Đây là chiến lược cơ bản nhất, nếu bộ nhớ đệm không hoạt động trước khi nó hết hiệu lực, thì nó sẽ không có giá trị lớn.

## Tại sao Redis lại sử dụng mô hình đơn luồng thay vì đa luồng?

Điều này chủ yếu được xem xét dựa trên một lý do khách quan. Vì Redis hoạt động trên bộ nhớ, CPU không phải là rào cản của Redis, rào cản có thể nằm ở kích thước bộ nhớ máy tính hoặc băng thông mạng. Với việc triển khai đơn luồng dễ dàng và CPU không gây ra rào cản, việc sử dụng mô hình đơn luồng là điều tự nhiên (vì cuối cùng việc sử dụng đa luồng sẽ gây ra nhiều phiền toái!).

## Tại sao Redis đơn luồng lại nhanh như vậy?

Có ba lý do chính:

1. Tất cả các hoạt động của Redis đều là hoạt động trên bộ nhớ.
2. Redis sử dụng đơn luồng, hiệu quả tránh được sự chuyển đổi ngữ cảnh thường xuyên.
3. Sử dụng cơ chế I/O không chặn và đa kênh.

## Bạn có hiểu về mô hình luồng của Redis không? Có thể nói sơ lược không?

Nếu bạn đã xem mã nguồn của Redis, bạn sẽ thấy rằng Redis sử dụng bộ xử lý sự kiện tệp file (file event handler), đây là mô hình đơn luồng. Nó sử dụng cơ chế đa kênh I/O để lắng nghe đồng thời nhiều socket và dựa trên sự kiện của socket để chọn bộ xử lý sự kiện tương ứng để xử lý.

Bộ xử lý sự kiện tệp tin bao gồm 4 phần:

- Nhiều socket
- Chương trình đa kênh I/O
- Bộ phân phối sự kiện tệp tin
- Bộ xử lý sự kiện (bộ xử lý phản hồi kết nối, bộ xử lý yêu cầu lệnh, bộ xử lý phản hồi lệnh)

Sử dụng chương trình đa kênh I/O để lắng nghe đồng thời nhiều socket và chuyển sự kiện của socket đó cho bộ phân phối sự kiện tệp tin. Khi socket được lắng nghe sẵn sàng để thực hiện các hoạt động như phản hồi kết nối (accept), đọc (read), ghi (write), đóng (close), sự kiện tương ứng sẽ xảy ra và bộ xử lý sự kiện đã được gắn kết với socket sẽ được gọi để xử lý sự kiện đó.

Tóm lại, "Chương trình đa kênh I/O đảm nhiệm việc lắng nghe đồng thời nhiều socket và chuyển sự kiện của socket đã xảy ra cho bộ phân phối sự kiện tệp tin".

## Redis có hai phương pháp để đặt thời gian hết hạn, đó là gì?

Redis có khả năng đặt thời gian hết hạn cho các giá trị được lưu trữ trong cơ sở dữ liệu Redis.

Để làm việc như một cơ sở dữ liệu cache, điều này rất hữu ích, ví dụ như một số mã thông báo hoặc thông tin đăng nhập, đặc biệt là mã xác minh qua tin nhắn văn bản có thời hạn. Trong cách tiếp cận truyền thống của cơ sở dữ liệu, chúng ta thường phải tự kiểm tra xem một khóa đã hết hạn chưa, điều này sẽ ảnh hưởng nghiêm trọng đến hiệu suất dự án.

Khi chúng ta đặt khóa trong Redis, chúng ta có thể đặt thời gian hết hạn cho nó, thông qua thời gian hết hạn, chúng ta có thể chỉ định thời gian mà khóa có thể tồn tại, chủ yếu có hai phương pháp để làm điều này:

- Xóa định kỳ: Redis mặc định kiểm tra xem có khóa nào đã hết hạn mỗi 100ms và xóa nó. Cần lưu ý rằng Redis không kiểm tra tất cả các khóa mỗi 100ms, mà chỉ ngẫu nhiên chọn một số khóa đã đặt thời gian hết hạn để kiểm tra (nếu mỗi 100ms kiểm tra tất cả các khóa, Redis sẽ bị treo!). Do đó, nếu chỉ sử dụng phương pháp xóa định kỳ, sẽ có nhiều khóa không bị xóa khi hết hạn.
- Xóa lười biếng: Khi bạn truy cập một khóa nào đó, Redis sẽ kiểm tra xem khóa đó có thời gian hết hạn không. Nếu hết hạn, Redis sẽ xóa khóa đó. Điều này được gọi là xóa lười biếng, vì Redis chỉ xóa khóa khi bạn truy cập nó.

## Có chắc chắn rằng việc xóa dữ liệu sẽ được đảm bảo bởi việc xóa định kỳ và xóa lười không? Nếu không, Redis sẽ có biện pháp ứng phó nào?

Không chắc chắn rằng việc xóa dữ liệu sẽ được đảm bảo bởi việc xóa định kỳ và xóa lười. Trong trường hợp này, Redis sử dụng cơ chế xóa bộ nhớ Redis để đảm bảo dữ liệu được xóa.

Việc xóa định kỳ là quá trình Redis kiểm tra xem có key nào đã hết hạn không và xóa chúng. Tuy nhiên, Redis không kiểm tra tất cả các key mỗi 100ms, mà chỉ kiểm tra ngẫu nhiên một số key (nếu kiểm tra tất cả key, Redis có thể bị treo). Do đó, nếu chỉ sử dụng việc xóa định kỳ, có thể dẫn đến việc nhiều key không được xóa khi hết hạn.

Do đó, việc xóa lười được sử dụng. Khi bạn truy cập một key, Redis sẽ kiểm tra xem key đó có hết hạn không và xóa nếu cần. Tuy nhiên, nếu việc xóa định kỳ không xóa key và bạn không truy cập key đó kịp thời, việc xóa lười cũng không có hiệu lực. Điều này dẫn đến tình trạng Redis tiếp tục tăng bộ nhớ.

Để giải quyết vấn đề này, Redis sử dụng cơ chế xóa bộ nhớ Redis.

Trong tệp cấu hình Redis (redis.conf), có một cấu hình `maxmemory-policy` để đặt chiến lược xóa bộ nhớ. Có sáu chiến lược chính:

- `volatile-lru`: Chọn dữ liệu đã đặt thời gian hết hạn gần đây nhất để xóa.
- `volatile-ttl`: Chọn dữ liệu đã đặt thời gian hết hạn sắp hết để xóa.
- `volatile-random`: Chọn dữ liệu đã đặt thời gian hết hạn ngẫu nhiên để xóa.
- `allkeys-lru`: Chọn dữ liệu từ tất cả các key để xóa dữ liệu đã được sử dụng ít nhất gần đây nhất.
- `allkeys-random`: Chọn dữ liệu từ tất cả các key để xóa dữ liệu ngẫu nhiên.
- `noeviction`: Không xóa dữ liệu, các thao tác ghi mới sẽ bị lỗi.

Lưu ý rằng nếu một key không có thời gian hết hạn, thì các chiến lược `volatile-lru`, `volatile-random` và `volatile-ttl` sẽ hoạt động tương tự như chiến lược `noeviction`.

Bằng cách cấu hình chiến lược xóa bộ nhớ phù hợp, Redis đảm bảo rằng dữ liệu sẽ được xóa khi không đủ bộ nhớ, đảm bảo hoạt động bình thường của hệ thống.

## Redis xử lý số lượng lớn yêu cầu như thế nào?

1. Redis là một chương trình đơn luồng, điều đó có nghĩa là cùng một thời điểm nó chỉ có thể xử lý một yêu cầu từ một khách hàng.
2. Redis sử dụng IO multiplexing (select, epoll, kqueue, tùy thuộc vào nền tảng) để xử lý nhiều yêu cầu từ nhiều khách hàng.

Điều này cho phép Redis xử lý đồng thời nhiều yêu cầu từ các khách hàng khác nhau, giúp tăng hiệu suất và khả năng đáp ứng của hệ thống.

## Cache Avalanche, Cache Penetration, Cache Warm-up, Cache Update, Cache Breakdown, Cache Degradation!

### **Cache Avalanche (Sự sụp đổ của bộ nhớ cache)**

Cache Avalanche là hiện tượng khi một lúc nào đó, một lượng lớn cache bị hết hạn cùng một thời điểm, dẫn đến tất cả các yêu cầu sau đó đều truy vấn vào cơ sở dữ liệu, gây ra tải nặng cho cơ sở dữ liệu và có thể gây sự cố.

**Giải pháp:**

- Trước sự cố: Đảm bảo tính khả dụng cao cho cụm Redis, phát hiện và khắc phục sự cố máy chủ càng sớm càng tốt, chọn chiến lược xóa bộ nhớ phù hợp.
- Trong sự cố: Sử dụng bộ nhớ cache cục bộ (local cache) + giới hạn tốc độ và giảm chất lượng (throttling & degradation) bằng cách sử dụng hystrix để tránh quá tải cơ sở dữ liệu, sử dụng khóa hoặc hàng đợi để kiểm soát số lượng luồng đọc cơ sở dữ liệu và ghi vào bộ nhớ cache. Ví dụ: chỉ cho phép một luồng truy vấn và ghi dữ liệu từ cơ sở dữ liệu vào bộ nhớ cache, các luồng khác phải chờ đợi.
- Sau sự cố: Khôi phục dữ liệu từ cơ sở dữ liệu bằng cơ chế lưu trữ bền vững của Redis càng sớm càng tốt.

### **Cache Penetration (Xuyên thủng bộ nhớ cache)**

Cache Penetration là hiện tượng khi một yêu cầu truy vấn một dữ liệu không tồn tại trong bộ nhớ cache, dẫn đến mọi truy vấn sau đó đều truy cập vào cơ sở dữ liệu, gây ra tải nặng cho cơ sở dữ liệu.

**Giải pháp:**

1. **Bộ lọc Bloom (Bloom Filter):** Sử dụng Bloom Filter để kiểm tra trước các yêu cầu truy vấn. Bloom Filter là một cấu trúc dữ liệu cho phép kiểm tra một phần tử có thuộc một tập hợp hay không một cách xấp xỉ. Nếu một yêu cầu truy vấn không tồn tại trong Bloom Filter, ta có thể từ chối truy vấn đó ngay lập tức mà không cần truy cập vào cơ sở dữ liệu.
2. **Cache dữ liệu rỗng (Cache Empty Data):** Khi một yêu cầu truy vấn không tìm thấy dữ liệu trong cơ sở dữ liệu, ta vẫn có thể lưu trữ kết quả trống vào bộ nhớ cache với thời gian hết hạn ngắn. Khi các yêu cầu truy vấn sau đó đến, ta có thể trả về kết quả trống từ bộ nhớ cache mà không cần truy cập vào cơ sở dữ liệu.

### **Cache Warm-up (Khởi động bộ nhớ cache)**

Cache Warm-up là quá trình tải trước dữ liệu liên quan vào hệ thống cache sau khi hệ thống được triển khai. Điều này giúp tránh trường hợp yêu cầu đầu tiên gặp phải cache miss và phải truy vấn vào cơ sở dữ liệu, từ đó cải thiện hiệu suất của hệ thống.

**Giải pháp:**

1. **Trang web hoặc trang API đặc biệt:** Tạo một trang web hoặc trang API đặc biệt để tải trước dữ liệu vào cache. Khi truy cập vào trang này, hệ thống sẽ tự động tải trước dữ liệu vào cache.
2. **Tải trước dữ liệu trong quá trình khởi động:** Trong quá trình khởi động hệ thống, ta có thể tải trước dữ liệu từ cơ sở dữ liệu vào cache. Điều này có thể được thực hiện bằng cách chạy các tác vụ nền (background tasks) hoặc các công cụ quản lý dữ liệu.

### **Cache Update (Cập nhật bộ nhớ cache)**

Cache Update là quá trình cập nhật dữ liệu trong bộ nhớ cache khi dữ liệu trong cơ sở dữ liệu thay đổi. Điều này đảm bảo rằng dữ liệu trong cache luôn được cập nhật và đồng bộ với dữ liệu trong cơ sở dữ liệu.

**Giải pháp:**

1. **Thời gian hết hạn (Expiration Time):** Đặt thời gian hết hạn cho các mục trong bộ nhớ cache. Khi dữ liệu hết hạn, nó sẽ được tự động xóa khỏi cache. Khi có yêu cầu truy vấn mới, dữ liệu mới sẽ được truy vấn từ cơ sở dữ liệu và cập nhật vào cache.
2. **Ghi đè hoặc xóa cache khi dữ liệu thay đổi:** Khi dữ liệu trong cơ sở dữ liệu thay đổi, ta có thể ghi đè hoặc xóa các mục tương ứng trong bộ nhớ cache. Điều này đảm bảo rằng dữ liệu trong cache luôn được cập nhật và đồng bộ với dữ liệu trong cơ sở dữ liệu.

### **Cache Breakdown (Sự sụp đổ của bộ nhớ cache)**

Cache Breakdown là hiện tượng khi một mục trong bộ nhớ cache bị hết hạn hoặc bị xóa, và cùng lúc có một lượng lớn yêu cầu truy vấn đến mục đó. Điều này dẫn đến tất cả các yêu cầu sau đó truy cập vào cơ sở dữ liệu, gây ra tải nặng cho cơ sở dữ liệu.

**Giải pháp:**

1. **Thời gian hết hạn ngẫu nhiên (Random Expiration Time):** Đặt thời gian hết hạn ngẫu nhiên cho các mục trong bộ nhớ cache. Khi các mục hết hạn, chúng sẽ không cùng lúc bị xóa khỏi cache, giúp phân tán tải trọng truy vấn vào cơ sở dữ liệu.
2. **Ghi đè hoặc xóa cache khi dữ liệu thay đổi:** Khi dữ liệu trong cơ sở dữ liệu thay đổi, ta có thể ghi đè hoặc xóa các mục tương ứng trong bộ nhớ cache. Điều này đảm bảo rằng dữ liệu trong cache luôn được cập nhật và đồng bộ với dữ liệu trong cơ sở dữ liệu.

### **Cache Degradation (Sự suy giảm của bộ nhớ cache)**

Cache Degradation là quá trình giảm chất lượng hoặc hiệu suất của bộ nhớ cache để đảm bảo tính khả dụng của hệ thống khi gặp phải tải nặng hoặc sự cố.

**Giải pháp:**

1. **Giới hạn tốc độ và giảm chất lượng (Throttling & Degradation):** Sử dụng các công cụ như Hystrix để giới hạn tốc độ và giảm chất lượng của các yêu cầu truy vấn vào bộ nhớ cache. Điều này giúp tránh quá tải cơ sở dữ liệu và đảm bảo tính khả dụng của hệ thống.
2. **Sử dụng bộ nhớ cache cục bộ (Local Cache):** Sử dụng bộ nhớ cache cục bộ để lưu trữ các mục quan trọng và giảm tải cho bộ nhớ cache chính. Bộ nhớ cache cục bộ có thể được triển khai trên các nút hoặc máy chủ riêng biệt để giảm tải cho bộ nhớ cache chính.
3. **Sử dụng các chiến lược xóa bộ nhớ phù hợp:** Sử dụng các chiến lược xóa bộ nhớ như LRU (Least Recently Used) hoặc LFU (Least Frequently Used) để xóa các mục không cần thiết khỏi bộ nhớ cache và giải phóng tài nguyên.

**Lưu ý:** Các giải pháp trên chỉ là một số ví dụ và có thể được điều chỉnh hoặc kết hợp để phù hợp với yêu cầu và môi trường cụ thể của hệ thống.

## Nếu có 10 triệu dữ liệu trong MySQL và sử dụng Redis làm bộ nhớ cache trung gian, làm thế nào để đảm bảo rằng dữ liệu trong Redis đều là dữ liệu hot?

Có thể sử dụng **chiến lược loại bỏ dữ liệu** của Redis. Khi kích thước tập hợp dữ liệu trong bộ nhớ của Redis tăng lên một mức nhất định, chiến lược này sẽ được áp dụng. Có tổng cộng 6 chiến lược loại bỏ dữ liệu chính:

- voltile-lru: Loại bỏ các phần tử ít được sử dụng gần đây nhất từ tập hợp đã thiết lập thời gian hết hạn (server.db[i].expires).
- volatile-ttl: Loại bỏ các phần tử chuẩn bị hết hạn từ tập hợp đã thiết lập thời gian hết hạn (server.db[i].expires).
- volatile-random: Loại bỏ ngẫu nhiên các phần tử từ tập hợp đã thiết lập thời gian hết hạn (server.db[i].expires).
- allkeys-lru: Loại bỏ các phần tử ít được sử dụng gần đây nhất từ toàn bộ tập tin (server.db[i].dict).
- allkeys-random: Loại bỏ ngẫu nhiên các phần tử từ toàn bộ tập tin (server.db[i].dict).
- no-eviction: Ngăn không cho việc loại bỏ dữ liệu.

## Redis có cơ chế bền vững không?

Redis là một cơ sở dữ liệu trong bộ nhớ hỗ trợ tính bền vững. Cơ chế bền vững của Redis cho phép lưu trữ dữ liệu trong bộ nhớ và đồng bộ dữ liệu từ bộ nhớ vào ổ đĩa thông qua cơ chế bền vững. Khi Redis khởi động lại, dữ liệu được tải lại từ tệp trên ổ đĩa vào bộ nhớ để khôi phục dữ liệu.

Trong nhiều trường hợp, chúng ta cần lưu trữ dữ liệu vào ổ đĩa để sử dụng lại dữ liệu sau này (ví dụ: khởi động lại máy chủ, khắc phục sự cố máy chủ) hoặc sao lưu dữ liệu đến một vị trí từ xa để đảm bảo không mất dữ liệu trong trường hợp máy chủ gặp sự cố.

Redis có hai cơ chế bền vững sau đây:

### Cơ chế bền vững thông qua tạo bản chụp (snapshotting) (RDB bền vững)

Redis có thể tạo bản chụp của dữ liệu được lưu trữ trong bộ nhớ tại một thời điểm cụ thể. Sau khi tạo bản chụp, Redis có thể sao lưu bản chụp này, sao chép bản chụp đến các máy chủ khác để tạo bản sao máy chủ có cùng dữ liệu (cấu trúc Redis chủ-đồng bộ, được sử dụng chủ yếu để tăng hiệu suất Redis) hoặc giữ bản chụp tại chỗ để sử dụng khi khởi động lại máy chủ.

Cơ chế bền vững thông qua tạo bản chụp là cơ chế mặc định của Redis và có thể cấu hình trong tệp cấu hình Redis.conf:

```shell
save 900 1 # Sau 900 giây (15 phút), nếu ít nhất 1 khóa thay đổi, Redis sẽ tự động kích hoạt lệnh BGSAVE để tạo bản chụp.

save 300 10 # Sau 300 giây (5 phút), nếu ít nhất 10 khóa thay đổi, Redis sẽ tự động kích hoạt lệnh BGSAVE để tạo bản chụp.

save 60 10000 # Sau 60 giây (1 phút), nếu ít nhất 10000 khóa thay đổi, Redis sẽ tự động kích hoạt lệnh BGSAVE để tạo bản chụp.
```

### Cơ chế bền vững thông qua tệp AOF (append-only file)

So với cơ chế bền vững thông qua tạo bản chụp, cơ chế bền vững thông qua tệp AOF có tính thời gian thực tốt hơn và đã trở thành cơ chế bền vững chủ đạo. Mặc định, Redis không bật cơ chế bền vững thông qua tệp AOF, nhưng có thể bật bằng cách sử dụng tham số appendonly trong tệp cấu hình: `appendonly yes`

Sau khi bật cơ chế bền vững thông qua tệp AOF, mỗi khi thực hiện một lệnh thay đổi dữ liệu trong Redis, Redis sẽ ghi lệnh này vào tệp AOF trên ổ đĩa. Vị trí lưu trữ tệp AOF và tệp RDB là giống nhau, được cấu hình thông qua tham số dir và tên tệp mặc định là appendonly.aof.

Trong tệp cấu hình Redis, có ba cách khác nhau để cấu hình cơ chế bền vững thông qua tệp AOF:

```shell
appendfsync always # Mỗi khi có sự thay đổi dữ liệu, Redis sẽ ghi vào tệp AOF, điều này sẽ làm giảm hiệu suất Redis đáng kể.

appendfsync everysec # Đồng bộ hóa tệp AOF mỗi giây, ghi nhiều lệnh ghi vào ổ đĩa một cách rõ ràng.

appendfsync no # Để hệ điều hành quyết định khi nào thực hiện đồng bộ hóa.
```

Để đảm bảo cả dữ liệu và hiệu suất ghi, người dùng có thể xem xét sử dụng tùy chọn appendfsync everysec, cho phép Redis đồng bộ hóa tệp AOF mỗi giây. Điều này giúp Redis hoạt động gần như không bị ảnh hưởng bởi việc ghi và chỉ mất tối đa một giây dữ liệu trong trường hợp máy chủ gặp sự cố. Khi ổ đĩa bận rộn với các hoạt động ghi, Redis sẽ tự động điều chỉnh tốc độ để phù hợp với tốc độ ghi tối đa của ổ đĩa.

**Tối ưu hóa cơ chế bền vững của Redis 4.0**

Redis 4.0 đã tối ưu hóa cơ chế bền vững bằng cách hỗ trợ kết hợp RDB và AOF (mặc định là tắt, có thể bật thông qua cấu hình aof-use-rdb-preamble).

Khi bật kết hợp bền vững, khi thực hiện việc ghi lại AOF, Redis sẽ ghi nội dung RDB vào đầu tệp AOF. Điều này kết hợp lợi ích của RDB và AOF, giúp tải nhanh và tránh mất nhiều dữ liệu. Tuy nhiên, một nhược điểm là phần RDB trong tệp AOF sẽ không còn định dạng AOF, khó đọc.

## Bạn có hiểu viết lại AOF không? Bạn có thể nói ngắn gọn về nó?

AOF rewrite là quá trình tạo ra một tập tin AOF mới, tương tự như tập tin AOF hiện có, nhưng có kích thước nhỏ hơn.

AOF rewrite là một tên gọi có thể gây hiểu lầm, chức năng này được thực hiện bằng cách đọc các cặp khóa-giá trị trong cơ sở dữ liệu để tạo ra tập tin AOF mới, không cần phải đọc, phân tích hoặc ghi vào tập tin AOF hiện có.

Khi thực hiện lệnh BGREWRITEAOF, máy chủ Redis sẽ duy trì một bộ đệm tái viết AOF, bộ đệm này sẽ ghi lại tất cả các lệnh ghi mà máy chủ thực hiện trong quá trình tạo ra tập tin AOF mới. **Sau khi quá trình tạo tập tin AOF mới của tiến trình con hoàn thành, máy chủ sẽ ghi tất cả nội dung trong bộ đệm tái viết vào cuối tập tin AOF mới, làm cho trạng thái cơ sở dữ liệu được lưu trữ trong hai tập tin AOF cũ và mới trở nên nhất quán**. Cuối cùng, máy chủ sẽ thay thế tập tin AOF cũ bằng tập tin AOF mới để hoàn thành quá trình tái viết tập tin AOF.

## Bạn đã sử dụng Redis Cluster chưa? Nguyên lý hoạt động của Redis Cluster là gì?

Redis Sentinel (Sentinel) tập trung vào tính sẵn có cao, khi máy chủ master gặp sự cố, nó sẽ tự động thăng cấp máy chủ slave thành master để tiếp tục cung cấp dịch vụ.

Sentinel có thể lắng nghe các máy chủ trong cụm và tự động bầu ra máy chủ master mới khi máy chủ chính vào trạng thái offline.

Redis Cluster (Cụm) tập trung vào khả năng mở rộng, khi bộ nhớ Redis đơn lẻ không đủ, nó sử dụng Cluster để lưu trữ dữ liệu theo phân đoạn.
