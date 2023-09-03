---
title: Vim
tags:
  - linux
categories: linux
date created: 2023-09-03
date modified: 2023-09-03
---

# Vim

## 1. Khái niệm

### 1.1. Vim là gì?

Vim là một trình soạn thảo văn bản phát triển từ vi. Nó có nhiều tính năng hỗ trợ lập trình rất tiện lợi như tự động hoàn thành mã, biên dịch và điều hướng lỗi, và được sử dụng rộng rãi trong cộng đồng lập trình viên. Vim và Emacs được xem là hai trình soạn thảo được ưa chuộng nhất trong cộng đồng người dùng hệ điều hành Unix.

### 1.2. Các chế độ của Vim

Vim chia thành ba chế độ cơ bản, đó là **chế độ lệnh (Command mode)**, **chế độ chèn (Insert mode)** và **chế độ dòng lệnh (Last line mode)**.

#### 1.2.1. Chế độ lệnh

**Ngay khi khởi động vi/vim, bạn sẽ vào chế độ lệnh.**

Trong chế độ này, các thao tác bàn phím sẽ được Vim hiểu là các lệnh, không phải nhập ký tự.

#### 1.2.2. Chế độ chèn

**Trong chế độ lệnh, nhấn `i` để vào chế độ chèn.**

Trong chế độ chèn, bạn có thể nhập nội dung văn bản.

#### 1.2.3. Chế độ dòng lệnh

**Trong chế độ lệnh, nhấn `:` (dấu hai chấm) để vào chế độ dòng lệnh.**

Chế độ dòng lệnh cho phép bạn nhập một hoặc nhiều ký tự lệnh, có rất nhiều lệnh có sẵn để sử dụng.

## 2. Vim - Học từ từ

### 2.1. Sống sót

1. Cài đặt [vim](http://www.vim.org/)
2. Khởi động vim
3. **Đừng làm gì cả!** Hãy đọc trước

Khi bạn cài đặt một trình soạn thảo, bạn thường muốn nhập và xem nó như thế nào. Nhưng vim không hoạt động như vậy, hãy tuân theo các hướng dẫn sau:

- Sau khi khởi động Vim, bạn sẽ ở chế độ _Normal_.
- Hãy chuyển sang chế độ _Insert_ bằng cách nhấn phím i. (Lưu ý: Bạn sẽ thấy chữ -insert- ở góc dưới bên trái của vim, cho biết bạn có thể nhập văn bản)
- Bây giờ, bạn có thể nhập văn bản như khi sử dụng "Notepad".
- Để quay lại chế độ _Normal_, hãy nhấn phím ESC.

Bây giờ, bạn biết cách chuyển đổi giữa chế độ _Insert_ và _Normal_. Dưới đây là một số lệnh giúp bạn sống sót trong chế độ _Normal_:

> - `i` → Chuyển sang chế độ _Insert_, nhấn ESC để quay lại chế độ _Normal_.
> - `x` → Xóa ký tự hiện tại.
> - `:wq` → Lưu và thoát (`:w` để lưu, `:q` để thoát) (Lưu ý: Sau `:w` bạn có thể nhập tên tệp)
> - `dd` → Xóa dòng hiện tại và sao chép nó vào bộ nhớ tạm.
> - `p` → Dán nội dung từ bộ nhớ tạm.

> **Gợi ý**
>
> - `hjkl` (Đề nghị sử dụng để di chuyển con trỏ, nhưng không bắt buộc) → Bạn cũng có thể sử dụng các phím mũi tên (←↓↑→). Lưu ý: `j` tương đương với mũi tên xuống.
> - `:help <command>` → Hiển thị trợ giúp cho lệnh liên quan. Bạn cũng có thể chỉ nhập `:help` mà không cần lệnh. (Lưu ý: Để thoát khỏi trợ giúp, hãy nhập :q)

Chỉ cần nhớ 5 lệnh trên, bạn có thể chỉnh sửa văn bản và bạn nên làm cho chúng trở thành thói quen. Bây giờ bạn có thể tiến lên cấp độ thứ hai.

Khi bạn tiến lên cấp độ thứ hai, hãy nhớ rằng chế độ _Normal_ vẫn còn. Trong các trình soạn thảo thông thường, khi bạn muốn sao chép một đoạn văn bản, bạn cần sử dụng phím `Ctrl`, ví dụ: `Ctrl-C`. Điều này có nghĩa là khi bạn nhấn phím `Ctrl`, phím C không còn là C nữa, mà là một lệnh hoặc phím tắt. **Trong chế độ _Normal_ của vim, tất cả các phím đều là phím tắt**. Điều này bạn cần biết.

> **Chú thích**
>
> - Trong văn bản dưới đây, nếu tôi viết `Ctrl-λ`, tôi sẽ viết là `<C-λ>`.
> - Các lệnh bắt đầu bằng `:` yêu cầu bạn nhấn `<enter>` để xác nhận, ví dụ: Nếu tôi viết `:q`, điều đó có nghĩa bạn cần nhập `:q<enter>`.

### 2.2. Cảm thấy thoải mái

Các lệnh trước đây chỉ giúp bạn sống sót, bây giờ là lúc học thêm một số lệnh khác. Dưới đây là gợi ý của tôi: (Lưu ý: Tất cả các lệnh đều phải được sử dụng trong chế độ _Normal_. Nếu bạn không biết bạn đang ở chế độ nào, hãy nhấn phím ESC một vài lần)

1. Các chế độ chèn khác nhau

   > - `a` → Chèn sau con trỏ
   > - `o` → Chèn một dòng mới sau dòng hiện tại
   > - `O` → Chèn một dòng mới trước dòng hiện tại
   > - `cw` → Thay thế từ vị trí con trỏ đến cuối từ hiện tại

2. Di chuyển con trỏ đơn giản

   > - `0` → Số không, di chuyển đến đầu dòng
   > - `^` → Di chuyển đến vị trí đầu tiên không phải là khoảng trắng trên dòng hiện tại
   > - `$` → Di chuyển đến cuối dòng hiện tại
   > - `g_` → Di chuyển đến vị trí cuối cùng không phải là khoảng trắng trên dòng hiện tại
   > - `/pattern` → Tìm kiếm chuỗi `pattern` (Lưu ý: Nếu có nhiều kết quả, bạn có thể nhấn n để chuyển đến kết quả tiếp theo)

3. Sao chép/Dán

   (Lưu ý: p/P đều có thể, p là dán sau vị trí hiện tại, P là dán trước vị trí hiện tại)

   > - `P` → Dán
   > - `yy` → Sao chép dòng hiện tại (tương đương với `ddP`)

4. Hoàn tác/Làm lại

   > - `u` → Hoàn tác
   > - `<C-r>` → Làm lại

5. Mở/Lưu/Thoát/Thay đổi tệp tin

   (Buffer)

   > - `:e <path/to/file>` → Mở một tệp tin
   > - `:w` → Lưu
   > - `:saveas <path/to/file>` → Lưu với tên `<path/to/file>`
   > - `:x`, `ZZ` hoặc `:wq` → Lưu và thoát (`:x` chỉ lưu khi cần thiết, ZZ không cần nhập dấu hai chấm và nhấn enter)
   > - `:q!` → Thoát mà không lưu (`:qa!` thoát bỏ tất cả các tệp đang chỉnh sửa, bất kể tệp nào đã thay đổi).
   > - `:bn` và `:bp` → Bạn có thể mở nhiều tệp tin cùng một lúc, sử dụng hai lệnh này để chuyển đến tệp tin tiếp theo hoặc trước đó. (Lưu ý: Tôi thích sử dụng :n để chuyển đến tệp tin tiếp theo)

Hãy dành thời gian để làm quen với những lệnh trên, khi bạn đã nắm vững chúng, bạn sẽ có thể làm hầu hết các công việc mà các trình soạn thảo khác có thể làm. Nhưng đến bây giờ, bạn có thể cảm thấy việc sử dụng vim còn hơi vụng về, không sao, bạn có thể tiến lên cấp độ thứ ba.

### 2.3. Tốt hơn, Mạnh hơn, Nhanh hơn

Xin chúc mừng! Bạn đã làm rất tốt. Bây giờ chúng ta có thể bắt đầu với những điều thú vị hơn. Ở cấp độ thứ ba, chúng ta chỉ nói về những lệnh tương thích với vi.

#### 2.3.1. Tốt hơn

Dưới đây, chúng ta hãy xem vim làm thế nào để lặp lại một số lệnh: 1515G

1. `.` (dấu chấm) → Lặp lại lệnh trước đó.
2. `N<command>` → Lặp lại một lệnh nhiều lần.

Dưới đây là một ví dụ, hãy mở một tệp tin và thử các lệnh sau:

> - `2dd` → Xóa 2 dòng
> - `3p` → Dán văn bản 3 lần
> - `100idesu [ESC]` → Gõ "desu " 100 lần (Lưu ý: Để thoát, nhấn ESC)
> - `.` → Lặp lại lệnh trước đó - 100 "desu ".
> - `3.` → Lặp lại lệnh 3 lần - "desu" (Lưu ý: Không phải 300, bạn xem, Vim thật thông minh).

#### 2.3.2. Mạnh hơn

Để di chuyển con trỏ một cách hiệu quả, bạn cần biết các lệnh sau, **đừng bỏ qua** chúng.

1. N`G` → Đến dòng thứ N (Lưu ý: Lệnh G viết hoa, ví dụ: 1G để đến dòng đầu tiên, hoặc :1)
2. `gg` → Đến dòng đầu tiên (Lưu ý: Tương đương với 1G hoặc :1)
3. `G` → Đến dòng cuối cùng
4. Di chuyển theo từng từ:

   > 1. `w` → Đến đầu từ tiếp theo.
   > 2. `e` → Đến cuối từ tiếp theo.
   >
   > \> Nếu bạn coi từ là các ký tự không phải khoảng trắng mặc định, hãy sử dụng e và w viết thường. Mặc định, một từ bao gồm các ký tự, số và dấu gạch dưới (chẳng hạn biến trong lập trình).
   >
   > \> Nếu bạn coi từ là các từ được phân tách bằng dấu cách, bạn cần sử dụng E và W viết hoa. (chẳng hạn câu lệnh trong lập trình)
   >
   > ![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap3101171-46f752c581d79057.jpg)

Dưới đây là các lệnh di chuyển con trỏ mạnh mẽ nhất:

> - `%`: Di chuyển đến cặp dấu ngoặc tương ứng, bao gồm `(`, `{`, `[`. (Lưu ý: Bạn cần đặt con trỏ lên dấu ngoặc trước)
> - `*` và `#`: Di chuyển đến từ hiện tại của con trỏ, di chuyển đến từ khớp tiếp theo (hoặc trước đó) (dấu * là từ khớp tiếp theo, dấu # là từ khớp trước đó)

Hãy tin tôi, ba lệnh trên là rất mạnh mẽ đối với lập trình viên.

#### 2.3.3. Nhanh hơn

Hãy nhớ các lệnh di chuyển con trỏ, vì nhiều lệnh khác có thể kết hợp với các lệnh di chuyển con trỏ này. Rất nhiều lệnh có thể được sao chép như sau:

`<vị trí bắt đầu><lệnh><vị trí kết thúc>`

Ví dụ, lệnh `0y$` có nghĩa là:

- `0` → Đi đến đầu dòng
- `y` → Sao chép từ vị trí này
- `$` → Sao chép đến ký tự cuối dòng

Bạn cũng có thể nhập `ye` để sao chép từ vị trí hiện tại đến cuối từ hiện tại.

Bạn cũng có thể nhập `y2/foo` để sao chép chuỗi giữa hai từ "foo".

Có nhiều lệnh không nhất thiết phải nhấn y để sao chép, dưới đây là một số lệnh như vậy:

- `d` (xóa)
- `v` (chọn kiểu visual)
- `gU` (chuyển thành chữ hoa)
- `gu` (chuyển thành chữ thường)
- Và nhiều hơn nữa

(Lưu ý: Chế độ chọn kiểu visual là một lệnh thú vị, bạn có thể nhấn v trước đó di chuyển con trỏ, bạn sẽ thấy văn bản được chọn, sau đó, bạn có thể nhấn d để xóa, hoặc y để sao chép, hoặc thay đổi chữ hoa chữ thường, v.v.)

### 2.4. Super Vim

Sau khi bạn đã nắm vững các lệnh cơ bản, bạn có thể thoải mái sử dụng Vim. Tuy nhiên, bây giờ chúng tôi sẽ giới thiệu cho bạn những tính năng siêu việt của Vim. Dưới đây là những tính năng mà tôi sử dụng Vim.

#### 2.4.1. Di chuyển con trỏ trên dòng hiện tại: `0` `^` `$` `g_` `fa` `Ft` `T,` `;`

> - `0` → Di chuyển đến đầu dòng
> - `^` → Di chuyển đến ký tự đầu tiên không phải khoảng trắng trên dòng hiện tại
> - `$` → Di chuyển đến cuối dòng
> - `g_` → Di chuyển đến vị trí cuối cùng không phải khoảng trắng trên dòng hiện tại
> - `fa` → Di chuyển đến ký tự a tiếp theo trên dòng hiện tại, bạn cũng có thể sử dụng fs để di chuyển đến ký tự s tiếp theo.
> - `t,` → Di chuyển đến ký tự đầu tiên trước dấu phẩy. Dấu phẩy có thể thay đổi thành ký tự khác.
> - `3fa` → Tìm kiếm ký tự a thứ ba trên dòng hiện tại.
> - `F` và `T` → Tương tự như `f` và `t`, chỉ khác là di chuyển theo hướng ngược lại.  
>   ![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap3101171-00835b8316330c58.jpg)

Có một lệnh rất hữu ích khác là `dt"` → Xóa tất cả nội dung từ vị trí con trỏ đến khi gặp dấu nháy kép - `"`.

#### 2.4.2. Chọn vùng: `<action>a<object>` hoặc `<action>i<object>`

Trong chế độ visual, các lệnh này rất mạnh mẽ và có định dạng như sau:

`<action>a<object>` và `<action>i<object>`

- action có thể là bất kỳ lệnh nào như `d` (xóa), `y` (sao chép), `v` (chế độ visual).
- object có thể là: `w` (một từ), `W` (một từ được phân tách bằng khoảng trắng), `s` (một câu), `p` (một đoạn văn). Nó cũng có thể là một ký tự đặc biệt như `"`, `'`, `)`, `}`, `]`.

Giả sử bạn có một chuỗi `(map (+) ("foo"))` và con trỏ đang ở vị trí của ký tự `o` đầu tiên.

> - `vi"` → Chọn `foo`.
> - `va"` → Chọn `"foo"`.
> - `vi)` → Chọn `"foo"`.
> - `va)` → Chọn `("foo")`.
> - `v2i)` → Chọn `map (+) ("foo")`.
> - `v2a)` → Chọn `(map (+) ("foo"))`.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap3101171-0b109d66a6111c83.png)

#### 2.4.3. Thao tác khối: `<C-v>`

Thao tác khối, ví dụ: `0 <C-v> <C-d> I-- [ESC]`

- `^` → Di chuyển đến đầu dòng
- `<C-v>` → Bắt đầu thao tác khối
- `<C-d>` → Di chuyển xuống (bạn cũng có thể sử dụng hjkl để di chuyển con trỏ hoặc sử dụng % hoặc các phím khác)
- `I-- [ESC]` → I là chèn, chèn chuỗi "--", nhấn ESC để áp dụng cho mỗi dòng.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap3101171-8b093a0f65707949.gif)

Trên Vim của Windows, bạn cần sử dụng `<C-q>` thay vì `<C-v>`, `<C-v>` được sử dụng để sao chép vào clipboard.

#### 2.4.4. Gợi ý tự động: `<C-n>` và `<C-p>`

Trong chế độ Insert, bạn có thể nhập một phần của từ, sau đó nhấn `<C-p>` hoặc `<C-n>` để hiển thị gợi ý tự động…

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap3101171-e2ae877e67880ff7.gif)

#### 2.4.5. Ghi lại macro: `qa` chuỗi thao tác `q`, `@a`, `@@`

- `qa` ghi lại chuỗi thao tác vào bộ ghi a.
- Sau đó, `@a` sẽ phát lại macro đã ghi lại.
- `@@` là một phím tắt để phát lại macro gần nhất đã ghi lại.

> **Ví dụ**
>
> Trong một văn bản chỉ có một dòng và chỉ có chữ "1", nhập các lệnh sau:
>
> - ```
>   qaYp<C-a>q
>   ```
>
>   →
>
>   - `qa` bắt đầu ghi lại
>   - `Yp` sao chép dòng.
>   - `<C-a>` tăng giá trị lên 1.
>   - `q` dừng ghi lại.
>
> - `@a` → Viết số 2 dưới số 1.
>
> - `@@` → Viết số 3 dưới số 2.
>
> - Bây giờ thực hiện `100@@` sẽ tạo ra 100 dòng mới và thêm dữ liệu lên đến 103.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap3101171-f1889f8bca723964.gif)

#### 2.4.6. Chọn vùng: `v`, `V`, `<C-v>`

Trước đây, chúng ta đã xem qua ví dụ của `<C-v>` (trên Vim của Windows, nó sẽ là `<C-q>`), chúng ta cũng có thể sử dụng `v` và `V`. Sau khi đã chọn, bạn có thể làm những việc sau:

- `J` → Kết hợp tất cả các dòng lại thành một dòng (nối dòng)
- `<` hoặc `>` → Thụt lề sang trái hoặc phải
- `=` → Tự động thụt lề (chức năng này rất mạnh mẽ, tôi rất thích nó)

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap3101171-fe1e19983fca213f.gif)

Thêm một số nội dung vào sau tất cả các dòng đã chọn:

- `<C-v>`
- Chọn các dòng liên quan (có thể sử dụng `j` hoặc `<C-d>` hoặc `/pattern` hoặc `%` v.v…)
- `$` đến cuối dòng
- `A`, nhập chuỗi, nhấn `ESC`.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap3101171-b192601247334c4e.gif)

#### 2.4.7. Chia màn hình: `:split` và `:vsplit`

Dưới đây là các lệnh chính, bạn có thể xem trợ giúp của Vim bằng cách sử dụng `:help split`. Bạn có thể tham khảo bài viết trước đây của trang web này về chia màn hình trong Vim.

> - `:split` → Tạo một cửa sổ mới (`:vsplit` tạo cửa sổ dọc)
> - `<C-w><dir>`: dir là hướng, có thể là `hjkl` hoặc một trong các phím ←↓↑→, được sử dụng để chuyển đổi giữa các cửa sổ.
> - `<C-w>_` (hoặc `<C-w>|`): Tối đa hóa kích thước (<C-w>| tối đa hóa cửa sổ dọc)
> - `<C-w>+` (hoặc `<C-w>-`): Tăng kích thước

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap3101171-f329d01e299cb366.gif)

## 3. Vim Cheat Sheet

### 3.1. Phiên bản cổ điển

Bảng phím dưới đây là phiên bản cổ điển mà bạn thường thấy. Thực tế, phiên bản này là kết quả của việc kết hợp nhiều bảng phím hướng dẫn cơ bản. Để xem bảng phím cho các chế độ chỉnh sửa khác nhau, bạn có thể xem và tải xuống [tại đây](http://www.viemu.com/a_vi_vim_graphical_cheat_sheet_tutorial.html).

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap20230903133656.png)

### 3.2. Phiên bản cơ bản

Bảng phím dưới đây là phiên bản cơ bản cho các hoạt động cơ bản. [Nguồn gốc](https://github.com/ahrencode/Miscellaneous) cung cấp phiên bản keynote để tùy chỉnh và các bảng phím hướng dẫn hữu ích khác.

![img](https://raw.githubusercontent.com/dunwu/images/dev/cs/os/linux/vim/basic-vim-cheat-sheet.png)

### 3.3. Phiên bản nâng cao

Bảng phím dưới đây là phiên bản 300 DPI siêu nét. Ngoài ra, [xem bản gốc](http://michael.peopleofhonoronly.com/vim/) còn có nhiều phiên bản khác như đen trắng, độ phân giải thấp, màu cho người mù màu, v.v.

![img](https://raw.githubusercontent.com/dunwu/images/dev/cs/os/linux/vim/vim-cheat-sheet-for-programmers.png)

### 3.4. Phiên bản nâng cao

Bảng phím dưới đây là phiên bản hiện đại và cập nhật gần đây hơn, cung cấp thông tin phong phú hơn. [Liên kết gốc](http://vimcheatsheet.com/)

![img](https://raw.githubusercontent.com/dunwu/images/dev/cs/os/linux/vim/vim-cheat-sheet-02.png)

### 3.5. Phiên bản văn bản

[Liên kết gốc](http://tnerual.eriogerg.free.fr/vimqrc.pdf)

![img](https://raw.githubusercontent.com/dunwu/images/dev/cs/os/linux/vim/vim-cheat-sheet-text-01.png)

![img](https://raw.githubusercontent.com/dunwu/images/dev/cs/os/linux/vim/vim-cheat-sheet-text-02.png)
