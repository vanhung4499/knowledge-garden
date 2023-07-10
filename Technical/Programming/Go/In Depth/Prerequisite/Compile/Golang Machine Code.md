---
title: Golang Machine Code
date created: 2023-06-07
date modified: 2023-07-08
tags: [golang]
dg-publish: true
---

Giai đoạn cuối cùng của quá trình biên dịch ngôn ngữ Go là tạo mã máy dựa trên mã trung gian SSA. Mã máy được đề cập ở đây là mã nhị phân có thể chạy trên kiến ​​trúc CPU mục tiêu. Phần tạo mã trung gian giới thiệu trong [[Golang IR SSA]]. Trong quá trình tạo, một số bước trong số gần 50 bước tạo mã trung gian hoàn toàn thuộc về giai đoạn tạo mã máy.

Quá trình tạo mã máy thực chất là một quá trình hạ cấp mã trung gian SSA. Trong quá trình hạ cấp mã trung gian SSA, trình biên dịch sẽ viết lại một số giá trị thành các giá trị cụ thể của kiến ​​trúc CPU đích. Quá trình hạ cấp xử lý tất cả các máy, cụ thể: Mã được tối ưu hóa ở một mức độ nhất định bằng các quy tắc viết lại; ở cuối giai đoạn tạo mã trung gian SSA, mã của thân hàm Go sẽ được chuyển đổi thành struct [`cmd/compile/internal/obj.Prog`](https://draveness.me/golang/tree/cmd/compile/internal/obj.Prog).

## 1. Kiến trúc tập lệnh

Điều đầu tiên cần được giới thiệu là kiến ​​trúc tập lệnh. Mặc dù chúng ta đã giải thích về kiến ​​trúc tập lệnh trong phần đầu tiên [[Spaces/2-Area/Techinal/Programming/Go/In Depth/Prerequisite/Compile/Golang Compile Intro]].

![Pasted image 20230607221650](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230607221650.png)

[Kiến trúc tập lệnh](https://en.wikipedia.org/wiki/Instruction_set_architecture) là một mô hình trừu tượng của máy tính, còn được gọi là kiến ​​trúc hoặc kiến ​​trúc máy tính trong nhiều trường hợp, nó là giao diện và cầu nối giữa phần mềm máy tính và phần cứng. Một chương trình ứng dụng được viết cho một kiến ​​trúc tập lệnh cụ thể có thể chạy trên tất cả các máy được hỗ trợ với kiến ​​trúc tập lệnh này, nghĩa là nếu ứng dụng hiện tại hỗ trợ tập lệnh x86, nó có thể chạy trên tất cả các máy sử dụng tập lệnh x86. Cấu trúc dữ liệu được hỗ trợ, thanh ghi, hỗ trợ phần cứng để quản lý bộ nhớ chính (chẳng hạn như tính nhất quán của bộ nhớ, mô hình địa chỉ và bộ nhớ ảo), tập lệnh được hỗ trợ và mô hình IO. Phần giới thiệu của nó thực sự giới thiệu một sự trừu tượng hóa giữa lớp phần mềm và phần cứng để cho phép cùng một hệ nhị phân để chạy trên các phiên bản phần cứng khác nhau.

Nếu một ngôn ngữ lập trình muốn chạy trên tất cả các máy, ngôn ngữ lập trình đó có thể chuyển đổi mã trung gian thành mã máy bằng cách sử dụng kiến ​​trúc tập lệnh khác, điều này đơn giản hơn nhiều so với việc chuyển riêng rẽ cho các phần cứng khác nhau.

![Pasted image 20230607221831](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230607221831.png)

Phương pháp phân loại kiến ​​trúc tập lệnh phổ biến nhất là chia nó thành tập lệnh phức tạp (CISC) và tập lệnh rút gọn (RISC) theo độ phức tạp của lệnh. Nó sẽ được chương trình sử dụng và tập lệnh rút gọn chỉ thực hiện các lệnh được sử dụng thường xuyên và các thao tác không được sử dụng phổ biến được thực hiện bằng cách kết hợp các lệnh đơn giản.

Đặc điểm của [Tập lệnh phức tạp](https://en.wikipedia.org/wiki/Complex_instruction_set_computer) là số lượng lệnh lớn và phức tạp, độ dài byte của mỗi lệnh không bằng nhau, x86 là bộ xử lý tập lệnh phức tạp phổ biến và độ dài lệnh của nó nằm trong khoảng từ 1 đến 15 byte, cho lệnh có độ dài không cố định, máy tính phải đánh giá thêm lệnh, điều này cần phải trả thêm tổn thất hiệu suất.

[Tập lệnh rút gọn](https://en.wikipedia.org/wiki/Reduced_instruction_set_computer) giúp đơn giản hóa số lượng lệnh và phương pháp đánh địa chỉ, giúp giảm đáng kể số lượng lệnh và dễ thực thi hơn. Mỗi lệnh trong tập lệnh sử dụng độ dài byte tiêu chuẩn và thời gian thực hiện ít hơn nhiều so với lệnh phức tạp. Bộ xử lý cũng có thể thực hiện thực thi đường ống khi xử lý các lệnh, giúp cải thiện khả năng hỗ trợ song song. Là một bộ xử lý tập lệnh rút gọn phổ biến, arm sử dụng 4 byte làm độ dài cố định của lệnh, bỏ qua việc mất hiệu suất của lệnh phán đoán. Tập lệnh rút gọn thực sự sử dụng nguyên tắc 20/80 mà chúng ta quen thuộc, và sự kết hợp của chúng để giải quyết vấn đề.

Các máy tính đầu tiên sử dụng các tập lệnh phức tạp vì hiệu suất và bộ nhớ của máy tính tương đối hạn chế vào thời điểm đó, ngành công nghiệp cần giảm các lệnh mà máy cần thực thi càng nhiều càng tốt, vì vậy nó nghiêng về các lệnh có mã hóa cao hơn, độ dài khác nhau và nhiều toán hạng. Tuy nhiên, với sự cải thiện về hiệu suất máy tính, đã có một thiết kế tập lệnh được đơn giản hóa, hy sinh mật độ mã để thực hiện đơn giản, ngoài ra, sự cải tiến nhanh chóng của phần cứng cũng mang lại nhiều thanh ghi hơn và tần số xung nhịp cao hơn. Mã hợp ngữ, nhưng tạo ra các hướng dẫn thông qua trình biên dịch và trình hợp dịch. Trình biên dịch khó sử dụng các lệnh máy phức tạp, vì vậy các lệnh đơn giản hóa sẽ phù hợp hơn trong trường hợp này.

Việc sử dụng các tập lệnh phức tạp và tập lệnh rút gọn là một sự đánh đổi trong thiết kế. Sau nhiều năm phát triển, hai tập lệnh cũng đã học hỏi lẫn nhau, điều này hoàn toàn khác so với khi chúng được thiết kế lần đầu. Các thiết bị phần cứng phức tạp đã là ba cấp độ kiến ​​​​thức trong lĩnh vực này đối với chúng tôi, thực tế không cần phải nắm vững quá nhiều nhưng những độc giả quan tâm đến kiến ​​trúc tập lệnh có thể tìm thấy một số thông tin để mở rộng tầm nhìn của mình.

## 2. Tạo mã máy

Việc tạo mã máy trong trình biên dịch Go chủ yếu bao gồm hai phần hoạt động cùng nhau, một phần chịu trách nhiệm hạ cấp mã trung gian SSA [`cmd/compile/internal/ssa`](https://github.com/golang/go/tree/master/src/cmd/compile/internal/ssa) và gói [`cmd/internal/obj`](https://github.com/golang/go/tree/master/src/cmd/internal/obj)

- [`cmd/compile/internal/ssa`](https://github.com/golang/go/tree/master/src/cmd/compile/internal/ssa)chịu trách nhiệm chính về việc hạ cấp mã trung gian SSA, thực hiện viết lại và tối ưu hóa theo kiến ​​trúc cụ thể, đồng thời tạo lệnh [`cmd/compile/internal/obj.Prog`](https://draveness.me/golang/tree/cmd/compile/internal/obj.Prog);
- Vì trình hợp dịch [`cmd/internal/obj`](https://github.com/golang/go/tree/master/src/cmd/internal/obj) sẽ chuyển đổi các lệnh này thành mã máy để hoàn thành quá trình biên dịch này;

### Hạ cấp SSA

Việc hạ cấp SSA được thực hiện trong quá trình sinh mã trung gian, trong đó có gần 50 vòng xử lý, `lower` và các công đoạn tiếp theo thuộc về quá trình hạ cấp SSA, nhiều vòng xử lý sẽ chuyển SSA thành các thao tác dành riêng cho máy:

```go
var passes = [...]pass{
	...
	{name: "lower", fn: lower, required: true},
	{name: "lowered deadcode for cse", fn: deadcode}, // deadcode immediately before CSE avoids CSE making dead values live again
	{name: "lowered cse", fn: cse},
	...
	{name: "trim", fn: trim}, // remove empty blocks
}
```

Giai đoạn đầu tiên của quá trình thực thi hạ cấp SSA là `lower`, phương thức nhập của giai đoạn này là hàm [`cmd/compile/internal/ssa.lower`](https://draveness.me/golang/tree/cmd/compile/internal/ssa.lower), chuyển đổi mã trung gian SSA thành các lệnh dành riêng cho máy:

```go
func lower(f *Func) {
	applyRewrite(f, f.Config.lowerBlock, f.Config.lowerValue)
}
```

Hai hàm và [`cmd/compile/internal/ssa.applyRewrite`](https://draveness.me/golang/tree/cmd/compile/internal/ssa.applyRewrite)được chuyển đến được xác định khi cấu hình SSA được khởi tạo trong giai đoạn tạo mã trung gian và hai hàm này lần lượt chuyển đổi khối mã trong hàm `lowerBlock` và giá trị trong khối mã `lowerValue`.

Giả sử rằng máy mục tiêu sử dụng kiến ​​trúc x86, hai hàm [`cmd/compile/internal/ssa.rewriteBlock386`](https://draveness.me/golang/tree/cmd/compile/internal/ssa.rewriteBlock386)và [`cmd/compile/internal/ssa.rewriteValue386`](https://draveness.me/golang/tree/cmd/compile/internal/ssa.rewriteValue386) là hai câu lệnh chuyển đổi khổng lồ. Cái trước có tổng cộng hơn 2.000 dòng và cái sau là gần 700 dòng, đó là dùng để xử lý các hàm được viết lại bởi kiến ​​trúc x86. Tổng cộng có gần 30.000 dòng mã, bạn có thể tìm thấy toàn bộ nội dung của tệp tại [`cmd/compile/internal/ssa/rewrite386.go`](https://github.com/golang/go/blob/master/src/cmd/compile/internal/ssa/rewrite386.go), chúng tôi chỉ chọn lọc một phần để hiển thị:

```go
func rewriteValue386(v *Value) bool {
	switch v.Op {
	case Op386ADCL:
		return rewriteValue386_Op386ADCL_0(v)
	case Op386ADDL:
		return rewriteValue386_Op386ADDL_0(v) || rewriteValue386_Op386ADDL_10(v) || rewriteValue386_Op386ADDL_20(v)
	...
	}
}

func rewriteValue386_Op386ADCL_0(v *Value) bool {
	// match: (ADCL x (MOVLconst [c]) f)
	// cond:
	// result: (ADCLconst [c] x f)
	for {
		_ = v.Args[2]
		x := v.Args[0]
		v_1 := v.Args[1]
		if v_1.Op != Op386MOVLconst {
			break
		}
		c := v_1.AuxInt
		f := v.Args[2]
		v.reset(Op386ADCLconst)
		v.AuxInt = c
		v.AddArg(x)
		v.AddArg(f)
		return true
	}
	...
}
```

Quá trình viết lại sẽ chuyển đổi mã trung gian SSA chung thành các lệnh dành riêng cho kiến ​​trúc đích. Hàm `rewriteValue386_Op386ADCL_0` sẽ sử dụng các lệnh Thay thế `ADCL` và  `MOVLconst` bằng `ADCLconst`, có thể giảm thời gian và thời gian cần thiết để thực thi trên phần cứng đích bằng cách nén và tối ưu hóa các lệnh tài nguyên.

Chúng tôi đã giới thiệu quy trình thực hiện lệnh gọi [`cmd/compile/internal/gc.buildssa`](https://draveness.me/golang/tree/cmd/compile/internal/gc.buildssa) trong  [`cmd/compile/internal/gc.compileSSA`](https://draveness.me/golang/tree/cmd/compile/internal/gc.compileSSA) trong phần trước về tạo mã trung gian và chúng tôi sẽ tiếp tục giới thiệu logic sau khi hàm [`cmd/compile/internal/gc.buildssa`](https://draveness.me/golang/tree/cmd/compile/internal/gc.buildssa):

```go
func compileSSA(fn *Node, worker int) {
	f := buildssa(fn, worker)
	pp := newProgs(fn, worker)
	defer pp.Free()
	genssa(f, pp)

	pp.Flush()
}
```

Hàm [`cmd/compile/internal/gc.genssa`](https://draveness.me/golang/tree/cmd/compile/internal/gc.genssa) sẽ tạo một struct [`cmd/compile/internal/gc.Progs`](https://draveness.me/golang/tree/cmd/compile/internal/gc.Progs) và lưu trữ mã trung gian SSA đã tạo trong struct mới được tạo. Tệp `ssa.html` mà chúng ta đã thu được trong phần trước chứa mã trung gian được tạo cuối cùng:

![thị tộc](https://img.draveness.me/2019-12-26-15773759175909-genssa.png)

Đầu ra ở trên rất giống với mã hợp ngữ được tạo cuối cùng và lệnh gọi tiếp theo tới [`cmd/compile/internal/gc.Progs.Flush`](https://draveness.me/golang/tree/cmd/compile/internal/gc.Progs.Flush)sẽ sử dụng trình hợp dịch mã trong gói [`cmd/internal/obj`](https://github.com/golang/go/tree/master/src/cmd/internal/obj) để chuyển đổi SSA thành mã hợp ngữ:

```go
func (pp *Progs) Flush() {
	plist := &obj.Plist{Firstpc: pp.Text, Curfn: pp.curfn}
	obj.Flushplist(Ctxt, plist, pp.NewProg, myimportpath)
}
```

Các giai đoạn `lower` và các giai đoạn tiếp theo trong [`cmd/compile/internal/gc.buildssa`](https://draveness.me/golang/tree/cmd/compile/internal/gc.buildssa) sẽ chuyển đổi, kiểm tra và tối ưu hóa SSA, tạo mã trung gian dành riêng cho máy, sau đó xuất mã qua [`cmd/compile/internal/gc.genssa`](https://draveness.me/golang/tree/cmd/compile/internal/gc.genssa) thông qua đối tượng  [`cmd/compile/internal/gc.Progs`](https://draveness.me/golang/tree/cmd/compile/internal/gc.Progs), đây là bước cuối cùng trước khi mã đi vào trình biên dịch mã.

### Trình biên dịch

Assembler là một chương trình dịch hợp ngữ sang ngôn ngữ máy. Trình hợp dịch của ngôn ngữ Go được thiết kế dựa trên kiểu đầu vào của trình hợp dịch Plan 9. Ngôn ngữ Go có rất ít thông tin về hợp ngữ Plan 9 và trình hợp dịch. Thông tin có thể tìm thấy trên Internet Hầu hết chúng đều mơ hồ và các chi tiết triển khai chính thức của trình hợp dịch mã trên các kiến ​​trúc bộ xử lý khác nhau không được xác định rõ ràng:

> The details vary with architecture, and we apologize for the imprecision; the situation is **not well-defined**

Khi học hợp ngữ và hợp ngữ chúng ta không nên đi sâu vào tiểu tiết mà chỉ cần hiểu logic thực thi của hợp ngữ sẽ giúp chúng ta nhanh chóng hiểu được mã hợp ngữ. Khi chúng ta biên dịch đoạn mã sau thành lệnh hợp ngữ, chúng ta sẽ nhận được nội dung như sau:

```bash
$ cat hello.go
package hello

func hello(a int) int {
	c := a + 2
	return c
}
$ GOOS=linux GOARCH=amd64 go tool compile -S hello.go
"".hello STEXT nosplit size=15 args=0x10 locals=0x0
	0x0000 00000 (main.go:3)	TEXT	"".hello(SB), NOSPLIT, $0-16
	0x0000 00000 (main.go:3)	FUNCDATA	$0, gclocals·33cdeccccebe80329f1fdbee7f5874cb(SB)
	0x0000 00000 (main.go:3)	FUNCDATA	$1, gclocals·33cdeccccebe80329f1fdbee7f5874cb(SB)
	0x0000 00000 (main.go:3)	FUNCDATA	$3, gclocals·33cdeccccebe80329f1fdbee7f5874cb(SB)
	0x0000 00000 (main.go:4)	PCDATA	$2, $0
	0x0000 00000 (main.go:4)	PCDATA	$0, $0
	0x0000 00000 (main.go:4)	MOVQ	"".a+8(SP), AX
	0x0005 00005 (main.go:4)	ADDQ	$2, AX
	0x0009 00009 (main.go:5)	MOVQ	AX, "".~r1+16(SP)
	0x000e 00014 (main.go:5)	RET
	0x0000 48 8b 44 24 08 48 83 c0 02 48 89 44 24 10 c3     H.D$.H...H.D$..
...
```

Tất cả mã lắp ráp ở trên đều được tạo bởi hàm [`cmd/internal/obj.Flushplist`](https://draveness.me/golang/tree/cmd/internal/obj.Flushplist), hàm này gọi các phương thức `Preprocess` và `Assemble` dành riêng cho kiến ​​trúc cụ thể:

```go
func Flushplist(ctxt *Link, plist *Plist, newprog ProgAlloc, myimportpath string) {
	...

	for _, s := range text {
		mkfwd(s)
		linkpatch(ctxt, s, newprog)
		ctxt.Arch.Preprocess(ctxt, s, newprog)
		ctxt.Arch.Assemble(ctxt, s, newprog)
		linkpcln(ctxt, s)
		ctxt.populateDWARF(plist.Curfn, s, myimportpath)
	}
}
```

Trình biên dịch Go sẽ xác định phương thức `Preprocess` và `Assemble` và trình biên dịch sẽ khởi tạo cấu hình được sử dụng bởi kiến ​​trúc hiện tại theo phần cứng đích được đề cập trong  [`cmd/compile.archInits`](https://draveness.me/golang/tree/cmd/compile.archInits).

Nếu kiến ​​trúc của máy đích là x86, thì hai hàm này cuối cùng sẽ sử dụng [`cmd/internal/obj/x86.preprocess`](https://draveness.me/golang/tree/cmd/internal/obj/x86.preprocess)và [`cmd/internal/obj/x86.span6`](https://draveness.me/golang/tree/cmd/internal/obj/x86.span6). Tác giả sẽ không giới thiệu hai hàm cơ bản đặc biệt phức tạp này ở đây, bạn đọc quan tâm có thể tìm vị trí của hàm đích thông qua liên kết để hiểu quá trình tiền xử lý quá trình gia công, lắp ráp và tạo mã máy cũng được hoàn thành nhờ sự kết hợp của hai chức năng này.

## 3. Tóm tắt

Là bước cuối cùng của quá trình biên dịch ngôn ngữ Go, việc tạo mã máy đã thực sự đạt đến trình độ phần cứng và hướng dẫn máy, việc xử lý bộ nhớ và thanh ghi rất phức tạp và khó đọc, phải mất rất nhiều công sức mới thực sự nắm vững các bước xử lý và nguyên tắc ở đây.

Là một kỹ sư phần mềm, nếu bạn không phải là nhà phát triển trình biên dịch ngôn ngữ Go hoặc cần thường xuyên xử lý hợp ngữ và hướng dẫn máy, thì lợi tức đầu tư để nắm vững kiến ​​thức này là quá thấp, chúng ta chỉ cần hiểu quy trình này và điền vào những điểm mù về kiến ​​thức và bạn có thể nhanh chóng xác định vấn đề khi gặp phải.
