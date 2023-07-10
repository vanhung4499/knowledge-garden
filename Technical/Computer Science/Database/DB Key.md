---
categories: [database, computer-science]
title: DB Key
date created: 2023-06-03
date modified: 2023-07-10
tags: [database, computer-science]
---

## 📚 Background

### 💍 Tính toàn vẹn của cơ sở dữ liệu

- Tính toàn vẹn thực thể (**_Entity Integrity_**)
	- Điều kiện 1: Các thuộc tính cấu thành khóa chính không được có giá trị `null`.  
	- Điều kiện thứ 2: Các thuộc tính cấu thành khóa chính không được trùng lặp với các bản ghi khác.  
	- ví dụ) Trong quan hệ A có các trường `a'`, `b'` và `c'`, nếu `a'` là khóa chính thì `b'` và `c'` có thể không chứa giá trị hoặc có thể trùng giá trị với các bản ghi khác, nhưng `a'` phải có một giá trị và giá trị này không được trùng lặp với các bản ghi khác.
- Toàn vẹn tham chiếu (**_Referential Integrity_**)
	- Các thuộc tính cấu thành khóa ngoại phải giống với các giá trị khóa chính của quan hệ tham chiếu (bảng).
	- ví dụ: Nếu có một quan hệ A với các trường a1 (khóa chính), a2 và a3 và một quan hệ B với các trường b1 (khóa chính), b2 (khóa ngoại) và b3, thuộc tính b2 của quan hệ B là một giá trị không tìm thấy trong thuộc tính a1 thì không thể thêm vào quan hệ.
- Toàn vẹn tên miền (**_Domain Integrity_**)  
	- Các giá trị thuộc tính không thể vượt ra ngoài phạm vi của miền mà thuộc tính được xác định.
	- ví dụ) Trong một quan hệ cụ thể, thuộc tính thể hiện giới tính không được vượt ra ngoài giá trị `male`, `female`.

### ☝️ Tối giản và duy nhất  

- Tính duy nhất  
	- **Thuộc tính cho phép bản ghi được xác định bằng một giá trị khóa duy nhất.**  
	- Khi tồn tại nhiều bản ghi, mỗi bản ghi phải là duy nhất và cần có một thuộc tính có thể chứng minh tính duy nhất và phân biệt từng bản ghi.  
	- VD: Khi tồn tại một mối quan hệ lưu trữ Description (`serial number`, `name`, `price`, v.v.), thuộc tính `name` và `price` là các thuộc tính có thể chồng chéo. Tuy nhiên, không thể xảy ra sự trùng lặp trong thuộc tính `serial number` của sản phẩm. Ở đây, chìa khóa sẽ là `serial number` và Product Number này đảm bảo tính duy nhất để phân biệt từng bản ghi.  
- Tính tối giản
	- Để tạo khóa, một số thuộc tính có thể được nhóm lại với nhau và được chỉ định làm khóa. **Lúc này thuộc tính cấu tạo khóa chỉ với những thuộc tính cần thiết tối thiểu cấu thành khóa**.  
	- Một lần nữa, khi tồn tại một quan hệ lưu trữ Description (`serial number`, `name`, `price`, v.v.) và được chỉ định làm khóa bằng cách kết hợp `serial number` và `name`, khóa này có thể phân biệt từng bản ghi. Tuy nhiên, vì tính duy nhất của một bản ghi có thể được đảm bảo thông qua một thuộc tính nên `serial number`, khóa liên kết `serial number`, `name` không thể được coi là đáp ứng yêu cầu tối thiểu.

## 🗝️ Key

- Một thuộc tính hoặc một tập hợp các thuộc tính được sử dụng làm tiêu chí khi tìm kiếm hoặc sắp xếp các bản ghi (bộ) đáp ứng một điều kiện trong cơ sở dữ liệu.

## ✔️ Phân loại Key

Trước khi giải thích từng key, lấy Product List, thông tin khách hàng và mối quan hệ giữa giỏ hàng của `Shope` làm ví dụ.

- Danh sách sản phẩm  

|số sản phẩm|tên sản phẩm|giá bán|thông tin sản phẩm|
|---|---|---|---|
|0001|Keyboard|3,000|blah blah|
|0002|Mouse|1,000|blah blah|
|0003|Monitor|6,000|blah blah|

- Thông tin người dùng

|mã thành viên|mật khẩu|cấp thành viên|số đăng ký thường trú|
|---|---|---|---|
|faker|abc123|Silver|900101xxxxxx|
|wolf|abc123|Gold|900102xxxxxx|
|marin|sdf90djfng|Silver|900103xxxxxx|
|bang|fd900fj43n|Gold|900104xxxxxx|

- Giỏ hàng

|Số thứ tự|người đặt hàng|danh sách sản phẩm|số lượng|tổng số lượng|
|---|---|---|---|---|
|0001|faker|0001, 0002|1, 2|5,000|
|0002|marin|0003|4|24,000|

### 🪄 Siêu khoá (Super Key)

- **Tính duy nhất**
- Nếu bạn nhìn vào quan hệ Danh sách sản phẩm, có các thuộc tính như `số sản phẩm`, `tên sản phẩm`, `giá bán` và `thông tin sản phẩm`. Trong số đó, có thể tạo một thuộc tính duy nhất bằng cách kết hợp không chỉ các thuộc tính riêng lẻ mà còn cả `số sản phẩm + tên sản phẩm`, cũng có thể là `giá bán + thông tin sản phẩm`.  
- Trong trường hợp này, thuộc tính `giá bán + thông tin sản phẩm` không thể là một siêu khóa vì có thể xảy ra các giá trị trùng lặp, nhưng thuộc tính `số sản phẩm + tên sản phẩm` có thể là một siêu khóa.  
- Tóm lại, nếu mỗi bản ghi có thể được phân biệt (nếu tính duy nhất có thể được bảo đảm) bất kể có thuộc tính nào được nhóm hay không, thì thuộc tính đó có thể là siêu khóa.

### 🖇️ Khoá dự tuyển (Candidate Key)

- Duy nhất, tối giản
- Nó không được vi phạm nguyên tắc toàn vẹn thực thể đã nêu ở trên.  
- Như đã mô tả ở trên, có các siêu khóa phân biệt một số sản phẩm và trong số đó, chỉ khóa có ít thuộc tính cấu thành khóa nhất mới có thể là khóa dự tuyển.  
- Dựa trên mối quan hệ Product List, siêu khóa bao gồm `số sản phẩm`, `tên sản phẩm`, `số sản phẩm + tên sản phẩm`, `giá bán + số sản phẩm` và `số sản phẩm + tên sản phẩm + giá bán`. Trong số đó, chỉ có thể chỉ định `số sản phẩm` hoặc `tên sản phẩm` làm khóa dự tuyển vì đảm bảo tính tối thiểu.
- Nếu người quản lý shope vô tình đăng ký `tên sản phẩm` trùng lặp, thì `tên sản phẩm` đó không thể là khóa dự tuyển.

### 🔐 Khoá chính (Primary Key)

- **Một khóa được chọn trong số các khóa dự tuyển. Khóa chính trong một quan hệ phải là duy nhất**.  
- Bây giờ chúng ta hãy nhìn vào mối quan hệ thông tin thành viên. Ở đây, khóa dự tuyển có thể là `mã thành viên` hoặc `số đăng ký thường trú` và nếu một trong số chúng được chỉ định làm khóa chính, thì khóa còn lại được chỉ định làm khóa thay thế. Tuy nhiên, nếu có luật trong nước quy định 'bạn không được thu thập số đăng ký thường trú trực tuyến' và thay đổi thông tin thành ngày sinh thay vì số đăng ký thường trú, thì ngày sinh không thỏa mãn tính duy nhất. Một vấn đề với điều này dẫn đến các vấn đề với khóa tự nhiên và khóa nhân tạo.  
- Khóa tự nhiên  
	- trong quan hệ thông tin thành viên, `mật khẩu` hoặc `cấp thành viên` không thể được sử dụng làm khóa chính. Tại thời điểm này, `mã thành viên` và `số đăng ký thường trú` vẫn là thuộc tính có thể phân biệt bản ghi một cách tự nhiên. Theo cách này, khóa được trích xuất 'tự nhiên' để phân biệt các bản ghi từ một quan hệ được gọi là khóa tự nhiên.  
- Khóa nhân tạo  
	- Trong quan hệ thông tin sản phẩm, thuộc tính `số sản phẩm` tương ứng với khóa nhân tạo vì nó là thuộc tính khóa do người quản lý trung tâm mua sắm đăng ký bản ghi tạo ra một cách giả tạo.
- **Khóa tự nhiên làm mã định danh? khóa nhân tạo?**
	- Việc chỉ định các khóa nhân tạo làm mã định danh là phù hợp.  
	- Khóa tự nhiên có thể được thay đổi.  
		- Giả sử rằng một mục `số điện thoại` được thu thập từ một quan hệ thông tin thành viên, mặc dù `số điện thoại` là duy nhất nhưng nó không phù hợp làm định danh vì nó có đủ chỗ để thay đổi theo tình huống của thành viên.  
	- Môi trường có thể thay đổi.  
		- Như đã đề cập ở trên, nếu bạn thu thập `số đăng ký cư trú` của mình và sử dụng nó làm số nhận dạng, nhưng quốc gia không cho phép bạn thu thập thuộc tính tương ứng, bạn sẽ phải chọn số nhận dạng từ một khóa thay thế khác.

### 📎 Khoá thay thế (Alternate Key)

- Tất cả các khóa dự tuyển ngoại trừ khóa chính.

### 🔑 Khoá tổng hợp (Composite Key)

- Khóa có nhiều (hai hoặc nhiều) thuộc tính
- `Số sản phẩm + tên sản phẩm`, `số sản phẩm + giá bán`, s`ố sản phẩm + tên sản phẩm + giá bán`, v.v.

### 🔨 Khoá ngoại (Foreign Key)

- **Có thể biểu diễn mối quan hệ giữa các bảng thông qua thuộc tính tham chiếu đến khóa chính của một quan hệ khác và khóa gốc.**
- Chúng ta hãy nhìn vào mối quan hệ giỏ hàng. Nó có `số thứ tự` làm khóa chính và thuộc tính `người đặt hàng` đề cập đến mã thành viên, được gọi là khóa ngoại.
- Tại sao khóa ngoại tồn tại?
	- Do tính toàn vẹn của dữ liệu để luôn giữ các giá trị chính xác
	- Ví dụ: nếu `mã thành viên` được thay đổi nhưng thuộc tính `người đặt hàng` trong quan hệ giỏ hàng không thay đổi, thì thuộc tính `người đặt hàng` không tồn tại hoặc đề cập đến giá trị sai, điều này sẽ phá vỡ tính toàn vẹn.

### 🔧 Khoá duy nhất (Unique Key)

Là một tập hợp của một hoặc nhiều thuộc tính của một quan hệ xác định bản ghi duy nhất, các khoá duy nhất không cho phép giá trị trùng lặp nhưng cho phép giá trị `null`.

### 🙋 What is null?

![Pasted image 20230604004730](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230604004730.png)
