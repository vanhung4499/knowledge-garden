---
title: Java Memory Model
tags: [java, javase, concurrency]
categories: [java, javase, concurrency]
date created: 2023-07-17
date modified: 2023-07-17
---

# Mô hình bộ nhớ Java

> **Keyword**: `JMM`, `volatile`, `synchronized`, `final`, `Happens-Before`, `barrier`
>
> **Tóm tắt**: Mô hình bộ nhớ Java (Java Memory Model), viết tắt là JMM. Mục tiêu của mô hình bộ nhớ Java là giải quyết các vấn đề về an toàn đồng thời do khả năng nhìn thấy và thứ tự gây ra. Mô hình bộ nhớ Java giúp ẩn đi sự khác biệt trong việc truy cập bộ nhớ giữa các phần cứng và hệ điều hành, để đạt được hiệu suất truy cập bộ nhớ nhất quán cho chương trình Java trên các nền tảng khác nhau.

## Mô hình bộ nhớ vật lý

Vấn đề đồng thời mà máy vật lý gặp phải có nhiều điểm tương đồng với trường hợp trong máy ảo, và cách xử lý đồng thời của máy vật lý cũng có ý nghĩa tham khảo quan trọng cho việc triển khai của máy ảo.

### Hiệu suất xử lý phần cứng

Vấn đề đầu tiên của bộ nhớ vật lý là hiệu suất xử lý của phần cứng.

- Hầu hết các tác vụ tính toán không thể chỉ dựa vào "tính toán" của bộ xử lý để hoàn thành, ít nhất là bộ xử lý cần tương tác **với bộ nhớ**, chẳng hạn như đọc dữ liệu tính toán, ghi kết quả tính toán. Hoạt động I/O này rất khó loại bỏ (không thể chỉ dựa vào thanh ghi để hoàn thành tất cả các nhiệm vụ tính toán).
- **Do sự chênh lệch giữa thiết bị lưu trữ và tốc độ tính toán của bộ xử lí** , mâu thuẫn này trong tốc độ đã giảm hiệu suất xử lí phần cứng. Vì vậy, máy tính hiện đại đã phải **thêm bộ nhớ cache (Cache) làm bộ đệm giữa bộ nhớ và bộ xử lý**. Sao chép dữ liệu cần sử dụng vào cache để thực hiện tính toán nhanh chóng, sau khi hoàn thành tính toán, đồng bộ lại từ cache vào trong bộ nhớ, điều này giúp cho việc xử lí không cần phải chờ đợi quá trình ghi/đọc từ bộ nhớ chậm.

### Đồng nhất bộ nhớ cache

Bộ nhớ cache giải quyết vấn đề hiệu suất xử lý của phần cứng, nhưng đồng thời đưa ra một vấn đề mới: **đồng nhất bộ nhớ cache (Cache Coherence)**.

Trong hệ thống đa xử lý, mỗi bộ xử lý có bộ nhớ cache riêng của nó, và chúng chia sẻ cùng một bộ nhớ chính. Khi nhiều bộ xử lý có nhiệm vụ tính toán liên quan đến cùng một vùng nhớ chính, có thể dẫn đến các bản sao không nhất quán của dữ liệu trong bộ nhớ cache của mỗi bộ xử lý.

Để giải quyết vấn đề đồng nhất bộ nhớ cache, **mỗi bộ xử lý phải tuân thủ một số giao thức và thực hiện các hoạt động đọc/ghi dựa trên giao thức đó**.

![CPU Memory Model.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/CPU%20Memory%20Model.png)

### Tối ưu hóa thực thi mã không tuân thủ thứ tự

**Ngoài bộ nhớ cache, để tận dụng tối đa các đơn vị tính toán trong bên trong bộ xử lý**, bộ xử lý có thể tối ưu hóa việc thực hiện mã nhập theo thứ tự không tuần tự (Out-Of-Order Execution). Bộ xử lý sẽ tái tổ chức kết quả của việc thực hiện không tuần tự sau khi tính toán, **đảm bảo rằng kết quả này giống với kết quả của việc thực hiện theo trình tự**, nhưng không đảm bảo rằng các câu lệnh tính toán trong chương trình được thực hiện theo cùng một trình tự như trong mã ban đầu.

![CodeReorderingOptimize.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/CodeReorderingOptimize.png)

Kỹ thuật thực thi mã không tuân thủ thứ tự là một tối ưu hóa của bộ xử lý để tăng tốc độ tính toán.

- Trong môi trường **đơn nhân**, bộ xử lý đảm bảo rằng các tối ưu hóa được thực hiện không dẫn đến kết quả thực thi xa khỏi mục tiêu dự kiến, nhưng trong môi trường **đa nhân**, điều này không phải luôn đúng.
- Trong môi trường **đa nhân**, nếu có nhiệm vụ tính toán của một lõi phụ thuộc vào kết quả trung gian của nhiệm vụ tính toán của lõi khác và không có biện pháp bảo vệ cho việc đọc/ghi dữ liệu liên quan, sự tuần tự không được đảm bảo chỉ thông qua thứ tự mã.

![CodeRefactorOptMulti.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/CodeRefactorOptMulti.png)

### Mô hình bộ nhớ Java

Khái niệm **mô hình bộ nhớ** (Memory Model) có thể hiểu là: **quá trình truy cập và ghi vào bộ nhớ hoặc bộ nhớ cache cụ thể dựa trên một giao thức hoạt động**. Các máy tính vật lý khác nhau có thể có các mô hình bộ nhớ khác nhau, và JVM cũng có mô hình bộ nhớ riêng của nó.

JVM cố gắng định nghĩa một mô hình bộ nhớ Java (Java Memory Model, JMM) để **giấu đi sự khác biệt trong việc truy cập bộ nhớ giữa các phần cứng và hệ điều hành khác nhau**, nhằm đảm bảo rằng các chương trình Java có thể đạt được hiệu suất truy cập bộ nhớ nhất quán trên mọi nền tảng.

Trong [[Java Concurrency Intro]], chúng ta đã biết rằng đồng thời an toàn đòi hỏi tính nhìn thấy, tình tuần tự và tính nguyên tử. Trong đó, tính nhìn thấy bị ảnh hưởng bởi bộ nhớ cache, và tình tuần tự bị ảnh hưởng bởi tối ưu hóa biên dịch. Tuy nhiên, việc vô hiệu hóa bộ nhớ cache và tối ưu hóa biên dịch để giải quyết vấn đề này sẽ làm giảm hiệu suất.

Một giải pháp hợp lý là **vô hiệu hóa bộ nhớ cache và tối ưu hóa biên dịch theo nhu cầu**. Vậy làm thế nào để làm được điều này? JMM đã định nghĩa cách JVM cung cấp vô hiệu hóa bộ nhớ cache và tối ưu hóa biên dịch theo nhu cầu. Cụ thể, các phương pháp này bao gồm ba từ khóa quan trọng là **volatile**, **synchronized** và **final**, cùng với quy tắc **Happens-Before**.

### Bộ nhớ chính và bộ nhớ làm việc

JMM có mục tiêu chính là **định nghĩa quy tắc truy cập các biến trong chương trình, tức là lưu trữ và truy xuất biến từ bộ nhớ trong máy ảo với các chi tiết cấp thấp như vậy**. Biến ở đây (Variables) khác với biến được đề cập trong lập trình Java, nó bao gồm các trường của thể hiện, các trường tĩnh và các thành phần của đối tượng số học, nhưng không bao gồm biến cục bộ và tham số phương thức, vì sau này chỉ thuộc sở hữu riêng của luồng và không được chia sẻ, tự nhiên không có vấn đề xung đột. Để có hiệu suất thực thi tốt hơn, JMM không giới hạn việc sử dụng thanh ghi hoặc bộ nhớ cache của bộ xử lý để giao tiếp với bộ nhớ chính và không giới hạn việc tối ưu mã thông qua việc điều chỉnh thứ tự thực thi mã nguồn.

JMM quy định rằng **tất cả các biến được lưu trữ trong bộ nhớ chính (Main Memory)**.

Mỗi luồng còn có bộ nhớ làm việc riêng (Working Memory), **bộ nhớ làm việc này chứa bản sao của biến được sử dụng trong bộ nhớ chính của luồng đó**. Bộ nhớ làm việc là một khái niệm trừu tượng trong JMM và không tồn tại thực sự, nó bao gồm cache, vùng đệm ghi, thanh ghi và các tối ưu phần cứng và trình biên dịch khác.

![jmam.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/jmam.png)

Mọi hoạt động của luồng đối với biến phải được thực hiện trong bộ nhớ làm việc, không thể trực tiếp đọc/ghi vào biến trong bộ nhớ chính. Các luồng khác cũng không thể truy cập trực tiếp vào bộ nhớ làm việc của luồng khác, mà cần thông qua bộ nhớ chính để truyền giá trị biến.

![jmm.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/jmm.png)

> Lưu ý:
>
> Bộ nhớ chính và bộ nhớ làm việc trong JMM không phải là cùng một cấp bậc của việc phân chia bộ nhớ trong Java như heap, stack, phần không gian phương thức, v.v.

### Vấn đề về thao tác bộ nhớ trong JMM

Tương tự như vấn đề mô hình bộ nhớ vật lý, JMM đối diện với hai vấn đề sau:

- **Tính nhất quán của dữ liệu trong bộ nhớ làm việc** - Khi các luồng khác nhau thao tác dữ liệu, chúng sẽ lưu trữ bản sao của biến chia sẻ trong bộ nhớ chính và sử dụng bản sao này. Khi nhiều luồng thực hiện các tác vụ tính toán liên quan đến cùng một biến chia sẻ, các bản sao của biến chia sẻ sẽ không nhất quán. Nếu thực sự xảy ra tình huống này, dữ liệu được đồng bộ trở lại bộ nhớ chính sẽ dựa vào bản sao dữ liệu của ai? Java Memory Model chủ yếu đảm bảo tính nhất quán của dữ liệu thông qua một loạt các giao thức và quy tắc đồng bộ dữ liệu.
- **Tối ưu hóa sắp xếp lại lệnh** - Sắp xếp lại lệnh trong Java thường là một biện pháp để tối ưu hiệu suất chương trình bằng cách sắp xếp lại thứ tự thực hiện các lệnh. Sắp xếp lại lệnh được chia thành hai loại: **sắp xếp lại lệnh trong quá trình biên dịch và sắp xếp lại lệnh trong quá trình chạy**. Tuy nhiên, sắp xếp lại lệnh không phải là việc sắp xếp lại tùy ý, nó phải đáp ứng hai điều kiện sau:
	- Trong môi trường đơn luồng, không thể thay đổi kết quả chạy của chương trình. Trình biên dịch (và bộ xử lý) cần đảm bảo chương trình có vẻ chạy tuần tự. Nghĩa là kết quả thực thi sau khi sắp xếp lại cần giống với kết quả thực thi tuần tự.
	- Không cho phép sắp xếp lại lệnh nếu có phụ thuộc dữ liệu.
	- Trong môi trường đa luồng, nếu có sự phụ thuộc giữa các logic xử lý của các luồng, có thể dẫn đến kết quả chạy khác với kết quả dự kiến do sắp xếp lại lệnh.

### Thao tác giao tiếp giữa bộ nhớ

JMM xác định 8 thao tác để hoàn thành việc giao tiếp giữa bộ nhớ chính và bộ nhớ làm việc của một luồng. JVM phải đảm bảo mỗi thao tác được mô tả dưới đây là **nguyên tử** (đối với biến kiểu double và long, các thao tác load, store, read và write có thể có ngoại lệ trên một số nền tảng).

- `lock` (khóa) - Áp dụng cho biến trong **bộ nhớ chính**, nó đánh dấu một biến là trạng thái độc quyền của một luồng.
- `unlock` (mở khóa) - Áp dụng cho biến trong **bộ nhớ chính**, nó giải phóng một biến đang bị khóa, cho phép các luồng khác khóa biến đó.
- `read` (đọc) - Áp dụng cho biến trong **bộ nhớ chính**, nó chuyển dữ liệu của một biến từ bộ nhớ chính đến bộ nhớ làm việc của luồng, để sử dụng trong các hoạt động `load` sau này.
- `write` (ghi) - Áp dụng cho biến trong **bộ nhớ chính**, nó lưu trữ giá trị của biến từ bộ nhớ làm việc của luồng vào biến trong bộ nhớ chính.
- `load` (tải) - Áp dụng cho biến trong **bộ nhớ làm việc**, nó chuyển giá trị của biến từ bộ nhớ chính đã đọc được vào bản sao biến trong bộ nhớ làm việc.
- `use` (sử dụng) - Áp dụng cho biến trong **bộ nhớ làm việc**, nó chuyển giá trị của biến từ bộ nhớ làm việc đến bộ xử lý, mỗi khi máy ảo gặp một lệnh bytecode cần sử dụng giá trị của biến.
- `assign` (gán) - Áp dụng cho biến trong **bộ nhớ làm việc**, nó gán giá trị nhận được từ bộ xử lý vào biến trong bộ nhớ làm việc, mỗi khi máy ảo gặp một lệnh bytecode gán giá trị cho biến.
- `store` (lưu trữ) - Áp dụng cho biến trong **bộ nhớ làm việc**, nó chuyển giá trị của biến từ bộ nhớ làm việc đến bộ nhớ chính, để sử dụng trong các hoạt động `write` sau này.

Nếu muốn sao chép một biến từ bộ nhớ chính vào bộ nhớ làm việc, cần **thực hiện tuần tự các thao tác `read` và `load`**; nếu muốn đồng bộ hóa biến từ bộ nhớ làm việc trở lại bộ nhớ chính, cần **thực hiện tuần tự các thao tác `store` và `write`**. Tuy nhiên, Java Memory Model chỉ yêu cầu các thao tác trên phải được thực hiện theo thứ tự, không đảm bảo phải thực hiện liên tục.

JMM cũng quy định rằng 8 thao tác cơ bản trên phải tuân thủ các quy tắc sau:

- **`read` và `load` phải được thực hiện cặp với nhau**; **`store` và `write` phải được thực hiện cặp với nhau**. Điều này có nghĩa là không cho phép một biến được đọc từ bộ nhớ chính nhưng không được chấp nhận vào bộ nhớ làm việc, hoặc ghi từ bộ nhớ làm việc nhưng không được chấp nhận vào bộ nhớ chính.
- **Không cho phép một luồng bỏ qua một thao tác gán gần nhất của nó**, nghĩa là biến phải được đồng bộ trước khi nó được sử dụng.
- **Không cho phép một luồng đồng bộ hóa một biến mà không có lý do**.
- Một biến mới chỉ có thể được tạo ra trong bộ nhớ chính, không cho phép sử dụng trực tiếp một biến chưa được khởi tạo (load hoặc assign) trong bộ nhớ làm việc. Nói cách khác, trước khi thực hiện thao tác `use` và `store` trên một biến, phải đã thực hiện thao tác `load` hoặc `assign` trước đó.
- Một biến chỉ có thể được khóa bởi một luồng tại một thời điểm, nhưng khóa có thể được thực hiện nhiều lần bởi cùng một luồng. Chỉ khi thực hiện cùng số lần khóa và mở khóa, biến mới được mở khóa. Vì vậy, **`lock` và `unlock` phải được thực hiện cặp với nhau**.
- Nếu thực hiện thao tác `lock` trên một biến, bộ nhớ làm việc của biến đó sẽ bị xóa, trước khi bộ xử lý sử dụng biến đó, cần thực hiện lại thao tác `load` hoặc `assign` để khởi tạo giá trị biến.
- Nếu một biến chưa được khóa trước đó, không cho phép thực hiện thao tác `unlock` trên nó, cũng không cho phép mở khóa một biến bị khóa bởi luồng khác.
- Trước khi thực hiện thao tác `unlock` trên một biến, cần đồng bộ hóa biến đó với bộ nhớ chính (thực hiện thao tác `store` và `write`).

![jmman.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/jmman.png)

### Tính an toàn đồng thời

Trong phần trước, chúng ta đã giới thiệu 8 thao tác cơ bản để giao tiếp giữa bộ nhớ chính và bộ nhớ làm việc trong JMM. Các thao tác này tuân theo ba tính chất chính của bộ nhớ Java: tính nguyên tử, tính hiển thị và tính tuần tự.

Ba tính chất này, trong bản chất, nhằm đảm bảo **tính nhất quán của dữ liệu** trong môi trường đa luồng, tối ưu hóa sắp xếp lại lệnh và đảm bảo kết quả chạy theo dự kiến trong môi trường đa luồng.

#### Tính nguyên tử

**Tính nguyên tử đảm bảo rằng một hoặc nhiều hoạt động sẽ được thực hiện hoàn toàn (quá trình thực hiện không bị gián đoạn bởi bất kỳ yếu tố nào) hoặc không được thực hiện**. Ngay cả khi nhiều luồng cùng thực hiện, một hoạt động một khi bắt đầu, sẽ không bị can thiệp bởi các luồng khác.

Trong Java, để đảm bảo tính nguyên tử, chúng ta sử dụng hai chỉ thị bytecode cao cấp là `monitorenter` và `monitorexit`. Hai chỉ thị bytecode này tương ứng với từ khóa `synchronized` trong Java.

Do đó, trong Java, chúng ta có thể sử dụng `synchronized` để đảm bảo các hoạt động trong phương thức và khối mã là nguyên tử.

#### Tính hiển thị

**Tính hiển thị đề cập đến việc khi nhiều luồng truy cập vào cùng một biến, nếu một luồng thay đổi giá trị của biến, các luồng khác sẽ có thể nhìn thấy giá trị đã thay đổi ngay lập tức**.

JMM đạt được tính hiển thị bằng cách sử dụng **"đồng bộ dữ liệu từ bộ nhớ chính trở lại bộ nhớ làm việc trước khi đọc biến"** và **"đồng bộ dữ liệu từ bộ nhớ làm việc trở lại bộ nhớ chính trước khi ghi biến"**.

Java cung cấp các cách để đạt được tính hiển thị trong môi trường đa luồng:

- `volatile`
- `synchronized`
- `final`

#### Tính tuần tự

Tính tuần tự xuất hiện trong hai tình huống: trong một luồng và giữa các luồng.

- Trong một luồng - Xem xét việc thực thi một phương thức từ quan điểm của một luồng, các chỉ thị sẽ được thực hiện theo cách gọi là "tuần tự" (`as-if-serial`). Điều này đã được áp dụng trong các ngôn ngữ lập trình tuần tự.
- Giữa các luồng - Khi một luồng "quan sát" các luồng khác thực thi các mã không đồng bộ, do sự tối ưu hóa sắp xếp lại lệnh, bất kỳ mã nào cũng có thể được thực thi xen kẽ. Điều duy nhất có hiệu lực là ràng buộc đối với các phương thức đồng bộ, khối đồng bộ (`synchronized`) và trường `volatile`.

Trong Java, chúng ta có thể sử dụng `synchronized` và `volatile` để đảm bảo tính tuần tự giữa các hoạt động đa luồng. Cách thực hiện có một số khác biệt:

- Từ khóa `volatile` sẽ ngăn chặn sắp xếp lại lệnh.
- Từ khóa `synchronized` sử dụng khóa để đảm bảo chỉ có một luồng được thực hiện tại một thời điểm.

## Happens-Before

JMM đã định nghĩa một quan hệ bán tự nhiên cho tất cả các hoạt động trong chương trình, được gọi là **`Nguyên tắc Xảy ra Trước (Happens-Before)`**.

**Happens-Before** có nghĩa là **kết quả của một hoạt động trước đó có thể được nhìn thấy bởi các hoạt động sau đó**.

**Happens-Before** rất quan trọng, nó là cơ sở chính để xác định xem dữ liệu có xung đột hay không, và xem liệu luồng có an toàn hay không. Dựa vào nguyên tắc này, chúng ta có thể giải quyết tất cả các vấn đề liên quan đến xung đột giữa hai hoạt động trong môi trường đồng thời bằng một tập hợp các quy tắc.

- **Quy tắc thứ tự chương trình** - Trong một luồng, theo thứ tự mã, một hoạt động được viết trước xảy ra trước hoạt động được viết sau đó.
- **Quy tắc khóa** - Một hoạt động `unLock` xảy ra trước hoạt động `lock` tiếp theo trên cùng một khóa.
- **Quy tắc biến volatile** - Một hoạt động ghi vào biến `volatile` xảy ra trước hoạt động đọc từ biến đó tiếp theo.
- **Quy tắc khởi động luồng** - Phương thức `start()` của đối tượng `Thread` xảy ra trước mọi hoạt động của luồng đó.
- **Quy tắc kết thúc luồng** - Tất cả các hoạt động trong luồng xảy ra trước việc kiểm tra kết thúc của luồng, chúng ta có thể kiểm tra kết thúc luồng bằng cách sử dụng phương thức `Thread.join()` hoặc kiểm tra giá trị trả về của `Thread.isAlive()`.
- **Quy tắc gián đoạn luồng** - Cuộc gọi phương thức `interrupt()` của luồng xảy ra trước khi mã kiểm tra sự gián đoạn xảy ra trong luồng, chúng ta có thể kiểm tra xem có gián đoạn xảy ra hay không bằng cách sử dụng phương thức `Thread.interrupted()`.
- **Quy tắc kết thúc đối tượng** - Việc khởi tạo một đối tượng hoàn thành xảy ra trước khi phương thức `finalize()` của đối tượng bắt đầu.
- **Quy tắc truyền thông** - Nếu hoạt động A xảy ra trước hoạt động B, và hoạt động B xảy ra trước hoạt động C, thì có thể kết luận rằng hoạt động A xảy ra trước hoạt động C.

## Rào cản bộ nhớ (Memory Barrier)

Làm thế nào để đảm bảo tính tuần tự và tính hiển thị của các hoạt động cơ bản trong Java? Điều này có thể được thực hiện thông qua rào cản bộ nhớ (memory barrier).

Rào cản bộ nhớ là một lệnh được chèn giữa hai lệnh CPU, được sử dụng để ngăn chặn việc tái sắp xếp các lệnh xử lý (giống như một rào cản), từ đó đảm bảo tính tuần tự của chúng. Ngoài ra, để đạt được hiệu quả của rào cản, nó cũng sẽ đẩy giá trị từ bộ nhớ chính vào bộ nhớ cache trước khi ghi hoặc đọc giá trị, từ đó đảm bảo tính hiển thị.

Ví dụ:

```
Store1;
Store2;
Load1;
StoreLoad;  // Rào cản bộ nhớ
Store3;
Load2;
Load3;
```

Đối với một tập hợp các lệnh CPU như trên (Store đại diện cho lệnh ghi, Load đại diện cho lệnh đọc), các lệnh Store trước rào cản StoreLoad không thể hoán đổi vị trí với các lệnh Load sau rào cản StoreLoad, tức là không thể tái sắp xếp. Tuy nhiên, các lệnh trước và sau rào cản StoreLoad có thể hoán đổi vị trí, ví dụ Store1 có thể hoán đổi với Store2, Load2 có thể hoán đổi với Load3.

Có 4 loại rào cản thông thường:

- Rào cản LoadLoad - Đối với câu lệnh như `Load1; LoadLoad; Load2`, đảm bảo rằng Load1 đã đọc xong dữ liệu trước khi Load2 đọc dữ liệu.
- Rào cản StoreStore - Đối với câu lệnh như `Store1; StoreStore; Store2`, đảm bảo rằng Store1 đã được ghi vào bộ nhớ chính trước khi các lệnh Store2 khác có thể nhìn thấy nó.
- Rào cản LoadStore - Đối với câu lệnh như `Load1; LoadStore; Store2`, đảm bảo rằng Load1 đã đọc xong dữ liệu trước khi các lệnh Store2 ghi dữ liệu.
- Rào cản StoreLoad - Đối với câu lệnh như `Store1; StoreLoad; Load2`, đảm bảo rằng Store1 đã được ghi vào bộ nhớ chính trước khi các lệnh Load2 và các lệnh đọc khác được thực hiện. Đây là rào cản mạnh nhất (đẩy dữ liệu từ bộ đệm ghi, xóa hàng đợi không hợp lệ). Trên hầu hết các nền tảng, rào cản này có thể thực hiện tất cả các chức năng của ba rào cản khác.

Trong Java, việc sử dụng rào cản bộ nhớ không dễ thấy trong mã thông thường. Cách sử dụng phổ biến bao gồm việc sử dụng từ khóa `volatile` và khối mã được đánh dấu bằng `synchronized` (sẽ được giải thích sau), và cũng có thể sử dụng rào cản bộ nhớ thông qua lớp `Unsafe`.

## volatile

`volatile` là cơ chế đồng bộ nhẹ nhất được cung cấp bởi JVM.

`volatile` có nghĩa là không ổn định, dễ biến đổi. Sử dụng từ khóa `volatile` để đánh dấu một biến nhằm đảm bảo tính hiển thị của biến trong môi trường đa luồng.

#### Đặc điểm của biến volatile

Biến `volatile` có hai đặc điểm:

- Đảm bảo tính hiển thị của biến đối với tất cả các luồng.
- Ngăn chặn việc tái sắp xếp các lệnh.

##### Đảm bảo tính hiển thị của biến đối với tất cả các luồng

Tính hiển thị ở đây có nghĩa là khi một luồng thay đổi giá trị của biến `volatile`, giá trị mới sẽ được các luồng khác nhìn thấy ngay lập tức. Trong khi đó, biến thông thường không thể đạt được điều này, giá trị của biến thông thường cần được truyền qua bộ nhớ chính giữa các luồng.

**Quá trình ghi biến `volatile` của một luồng:**

1. Thay đổi giá trị của biến `volatile` trong bộ nhớ làm việc của luồng.
2. Đẩy giá trị đã thay đổi từ bộ nhớ làm việc vào bộ nhớ chính.

**Quá trình đọc biến `volatile` của một luồng:**

1. Đọc giá trị mới nhất của biến `volatile` từ bộ nhớ chính vào bộ nhớ làm việc của luồng.
2. Đọc giá trị của biến `volatile` từ bộ nhớ làm việc.

> Lưu ý: **Đảm bảo tính hiển thị không đồng nghĩa với đảm bảo tính an toàn của hoạt động đồng thời trên biến `volatile`**
>
> Trong các tình huống không đáp ứng hai điều kiện sau, vẫn cần sử dụng khóa để đảm bảo tính nguyên tử:
>
> - Kết quả tính toán không phụ thuộc vào giá trị hiện tại của biến hoặc chỉ có một luồng duy nhất thay đổi giá trị của biến.
> - Biến không cần tham gia vào ràng buộc không thay đổi cùng với các biến trạng thái khác.

Tuy nhiên, nếu nhiều luồng cùng cập nhật giá trị biến `volatile` cùng một lúc, có thể dẫn đến việc nhận được giá trị không như mong đợi:

Ví dụ: Định nghĩa `volatile int count = 0`, 2 luồng thực hiện đồng thời hoạt động count++ mỗi luồng thực hiện 500 lần, kết quả cuối cùng nhỏ hơn 1000. Nguyên nhân là mỗi luồng thực hiện count++ bao gồm 3 bước sau:

1. Luồng đọc giá trị count mới nhất từ bộ nhớ chính.
2. Bộ xử lý tăng giá trị count lên 1 và gán lại cho bộ nhớ làm việc của luồng.
3. Luồng lưu giá trị count vào bộ nhớ chính. Có thể xảy ra tình huống 2 luồng cùng đọc giá trị 100 tại một thời điểm, sau đó tăng giá trị lên 101 và cuối cùng lưu 2 lần 101 vào bộ nhớ chính.

##### Đặc điểm 2: Cấm tái sắp xếp lệnh

Cụ thể, các quy tắc cấm tái sắp xếp như sau:

- Khi chương trình thực hiện phép đọc hoặc ghi biến `volatile`, tất cả các thay đổi của các hoạt động trước đó đã được thực hiện và kết quả đã được nhìn thấy bởi các hoạt động sau đó; các hoạt động sau đó chưa được thực hiện.
- Trong quá trình tối ưu hóa lệnh, không thể đặt các lệnh truy cập biến `volatile` sau các lệnh trước đó, cũng không thể đặt các lệnh sau biến `volatile` trước các lệnh trước đó.

Biến thông thường chỉ đảm bảo rằng tất cả các điểm phụ thuộc vào kết quả gán trong quá trình thực thi phương thức đều nhận được kết quả chính xác, nhưng không đảm bảo thứ tự gán giữa các lệnh và thứ tự thực thi trong mã chương trình.

Ví dụ:

```java
volatile boolean initialized = false;

// Mã chạy trong luồng A
// Đọc thông tin cấu hình, sau khi đọc xong, đặt initialized thành true để thông báo cho các luồng khác rằng cấu hình đã sẵn sàng
doSomethingReadConfg();
initialized = true;

// Mã chạy trong luồng B
// Đợi initialized trở thành true, cho biết luồng A đã khởi tạo xong cấu hình
while (!initialized) {
     sleep();
}
// Sử dụng thông tin cấu hình đã được khởi tạo bởi luồng A
doSomethingWithConfig();
```

Trong đoạn mã trên, nếu biến `initialized` không được đánh dấu là `volatile`, có thể xảy ra trường hợp lệnh cuối cùng của luồng A "initialized = true" được thực hiện trước lệnh "doSomethingReadConfg()", điều này có thể dẫn đến lỗi khi luồng B sử dụng thông tin cấu hình. Tuy nhiên, bằng cách sử dụng từ khóa `volatile`, ta có thể đảm bảo rằng các lệnh sẽ không bị tái sắp xếp theo cách này.

#### Nguyên lý hoạt động của từ khóa `volatile`

Cách thức cụ thể là trong quá trình biên dịch mã byte, sẽ chèn các rào cản bộ nhớ để đảm bảo tính không tái sắp xếp. Dưới đây là chiến lược chèn rào cản bộ nhớ dựa trên chiến lược bảo thủ của JMM:

- Chèn một rào cản `StoreStore` trước mỗi lệnh ghi `volatile`. Rào cản này không chỉ đảm bảo rằng các lệnh ghi trước rào cản và các lệnh ghi sau rào cản không thể tái sắp xếp, mà còn đảm bảo rằng trước lệnh ghi `volatile`, mọi hoạt động đọc và ghi đều phải được thực hiện trước khi `volatile` được gửi đi.
- Chèn một rào cản `StoreLoad` sau mỗi lệnh ghi `volatile`. Rào cản này không chỉ ngăn chặn việc tái sắp xếp lệnh ghi `volatile` với các lệnh đọc sau đó, mà còn làm cập nhật bộ nhớ đệm của bộ xử lý, đảm bảo rằng các giá trị ghi vào biến `volatile` sẽ được nhìn thấy bởi các luồng khác.
- Chèn một rào cản `LoadLoad` sau mỗi lệnh đọc `volatile`. Rào cản này không chỉ ngăn chặn việc tái sắp xếp lệnh đọc `volatile` với các lệnh trước đó, mà còn làm cập nhật bộ nhớ đệm của bộ xử lý, đảm bảo rằng các giá trị đọc từ biến `volatile` là giá trị mới nhất.
- Chèn một rào cản `LoadStore` sau mỗi lệnh đọc `volatile`. Rào cản này không chỉ cấm tái sắp xếp lệnh đọc `volatile` với bất kỳ lệnh ghi nào sau đó, mà còn làm cập nhật bộ nhớ đệm của bộ xử lý, đảm bảo rằng các luồng khác có thể nhìn thấy các giá trị ghi vào biến `volatile` bởi các luồng khác.

#### Các trường hợp sử dụng của từ khóa `volatile`

Tóm lại, từ khóa `volatile` được sử dụng để "ghi một lần, đọc ở nhiều nơi", một luồng đảm nhận việc cập nhật biến, các luồng khác chỉ đọc biến (không cập nhật) và thực hiện các logic tương ứng dựa trên giá trị mới của biến. Ví dụ: cập nhật trạng thái, phát hành giá trị biến trong mô hình quan sát.

## synchronized

### Quy tắc đặc biệt cho biến kiểu long và double

JMM yêu cầu các hoạt động lock, unlock, read, load, assign, use, store, write (8 loại hoạt động này) đều có tính nguyên tử, nhưng đối với kiểu dữ liệu 64 bit (long và double), JMM định nghĩa một quy tắc đặc biệt và linh hoạt hơn: cho phép máy ảo chia hoạt động đọc và ghi dữ liệu 64 bit thành 2 hoạt động 32 bit, có nghĩa là máy ảo có thể không đảm bảo tính nguyên tử của các hoạt động load, store, read và write (4 loại hoạt động này) đối với kiểu dữ liệu 64 bit chưa được đánh dấu là `volatile`. Do tính không nguyên tử này, có thể xảy ra trường hợp các luồng khác đọc giá trị "một nửa biến" chưa hoàn thành đồng bộ.

Tuy nhiên, trong thực tế, Java Memory Model (JMM) khuyến nghị mạnh mẽ rằng máy ảo nên đảm bảo tính nguyên tử của hoạt động đọc và ghi dữ liệu 64 bit. Hiện nay, các máy ảo thương mại trên các nền tảng khác nhau đều chọn xem xét hoạt động đọc và ghi dữ liệu 64 bit là hoạt động nguyên tử. Do đó, khi viết mã, chúng ta không cần phải đánh dấu biến long và double là `volatile`.

### Quy tắc đặc biệt cho biến final

Chúng ta biết rằng, biến thành viên final phải được khởi tạo khi khai báo hoặc trong constructor, nếu không sẽ bị lỗi biên dịch. Tính hiệu quả của từ khóa `final` là: khi biến được đánh dấu là `final` và đã được khởi tạo hoàn tất trong quá trình khai báo hoặc constructor, thì trong các luồng khác không cần đồng bộ hóa, giá trị của biến `final` có thể được nhìn thấy đúng. Điều này xảy ra vì khi khởi tạo hoàn tất, giá trị của biến `final` được ghi ngay lập tức vào bộ nhớ chính.
