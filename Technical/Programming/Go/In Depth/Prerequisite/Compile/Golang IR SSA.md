---
title: Golang IR SSA
date created: 2023-06-07
date modified: 2023-07-01
tags: [golang]
dg-publish: true
---

Hai phần đầu [[Golang Lexer and Parser]]và [[Golang Type Check]] giới thiệu giai đoạn thuộc về frontend của trình biên dịch. Chúng chịu trách nhiệm phân tích mã nguồn và kiểm tra các lỗi ngữ pháp và cú pháp tồn tại trong đó, Abstract Syntax Tree ra sau hai giai đoạn này đã không còn lỗi ngữ pháp, phần này sẽ tiếp tục giới thiệu công việc backend của trình biên dịch - tạo mã trung gian.

## 1. Tổng quan

Mã trung gian ([Itermediate Representation](https://en.wikipedia.org/wiki/Intermediate_representation)) là ngôn ngữ được sử dụng bởi trình biên dịch hoặc máy ảo có thể giúp chúng tôi phân tích các chương trình máy tính. Trong quá trình biên dịch, trước tiên trình biên dịch sẽ chuyển đổi mã nguồn thành một biểu diễn trung gian, hay là mã trung gian, trong quá trình chuyển đổi mã nguồn sang mã máy.

![Pasted image 20230607144547](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230607144547.png)

Nhiều độc giả có thể nghĩ rằng mã trung gian không có nhiều giá trị, chúng ta có thể dịch mã nguồn trực tiếp sang ngôn ngữ mục tiêu. Cách tiếp cận dường như khả thi này thực sự có rất nhiều vấn đề, quan trọng nhất là: nó bỏ qua các vấn đề phức tạp mà trình biên dịch phải đối mặt. Nhiều trình biên dịch cần phải dịch mã nguồn sang nhiều loại mã máy, dịch trực tiếp ngôn ngữ lập trình bậc cao tương đối khó khăn.

Việc chia quá trình từ ngôn ngữ lập trình sang mã máy thành hai bước đơn giản là tạo mã trung gian và tạo mã máy có thể đơn giản hóa vấn đề. Mã trung gian là một biểu diễn gần với ngôn ngữ máy hơn. So với phân tích trực tiếp, việc tối ưu hóa và phân tích mã trung gian các ngôn ngữ lập trình bậc cao dễ dàng hơn.

Mã trung gian của trình biên dịch ngôn ngữ Go có tính năng **Single Static Assignment (SSA)**, và chúng tôi đã giới thiệu **Single Static Assignment (SSA)** trong phần đầu tiên  [[Spaces/2-Area/Techinal/Programming/Go/In Depth/Prerequisite/Compile/Golang Compile Intro]].

Hãy nhớ lại phần tạo mã trung gian trong [`cmd/compile/internal/gc.Main`](https://draveness.me/golang/tree/cmd/compile/internal/gc.Main), mã này sẽ khởi tạo cấu hình do SSA tạo và hàm biên dịch [`cmd/compile/internal/gc.funccompile`](https://draveness.me/golang/tree/cmd/compile/internal/gc.funccompile) sẽ được gọi sau khi quá trình khởi tạo cấu hình hoàn tất:

```go
func Main(archInit func(*Arch)) {
	...

	initssaconfig()

	for i := 0; i < len(xtop); i++ {
		n := xtop[i]
		if n.Op == ODCLFUNC {
			funccompile(n)
		}
	}

	compileFunctions()
}
```

Quá trình khởi tạo cấu hình SSA là công việc chuẩn bị trước khi tạo mã trung gian, trong quá trình này chúng ta sẽ cache các con trỏ kiểu có thể được sử dụng, khởi tạo cấu hình SSA và một số hàm runtime sẽ được gọi sau, ví dụ: [`runtime.deferproc`](https://draveness.me/golang/tree/runtime.deferproc) để xử lý từ khóa `defer` ,  [`runtime.newproc`](https://draveness.me/golang/tree/runtime.newproc) để tạo Goroutines, và  [`runtime.growslice`](https://draveness.me/golang/tree/runtime.growslice)để mở rộng slice, v.v. Ngoài ra, một ABI (App) cụ thể sẽ được khởi tạo theo thiết bị đích hiện tại . Chúng tôi bắt đầu bằng cách phân tích quá trình khởi tạo cấu hình [`cmd/compile/internal/gc.initssaconfig`](https://draveness.me/golang/tree/cmd/compile/internal/gc.initssaconfig)như một điểm vào.

## 2. Khởi tạo cấu hình SSA

Quá trình khởi tạo cấu hình SSA là chuẩn bị trước khi mã trung gian được tạo ra. Trong quá trình, đó chúng tôi lưu trữ lại kiểu con trỏ mà chúng tôi có lẽ sẽ sử dụng, khởi tạo cấu hình SSA và một số hàm runtime được gọi sau, chẳng hạn như [`runtime.deferproc`](https://draveness.me/golang/tree/runtime.deferproc) để xử lý từ khóa `defer`, [`runtime.newproc`](https://draveness.me/golang/tree/runtime.newproc) được sử dụng để tạo ra Goroutine và [`runtime.growslice`](https://draveness.me/golang/tree/runtime.growslice) để mở rộng slice, v.v.. Ngoài ra, một [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) cụ thể sẽ được khởi tạo dựa trên thiết bị mục tiêu hiện tại. Chúng tôi bắt đầu quá trình khởi tạo cấu hình với [`cmd/compile/internal/gc.initssaconfig`](https://draveness.me/golang/tree/cmd/compile/internal/gc.initssaconfig) làm điểm bắt đầu.

```go
func initssaconfig() {
	types_ := ssa.NewTypes()

	_ = types.NewPtr(types.Types[TINTER])                             // *interface{}
	_ = types.NewPtr(types.NewPtr(types.Types[TSTRING]))              // **string
	_ = types.NewPtr(types.NewPtr(types.Idealstring))                 // **string
	_ = types.NewPtr(types.NewSlice(types.Types[TINTER]))             // *[]interface{}
	..
	_ = types.NewPtr(types.Errortype)                                 // *error
```

Toàn bộ quá trình thực thi hàm này có thể được chia thành ba phần. Đầu tiên là gọi [`cmd/compile/internal/ssa.NewTypes`](https://draveness.me/golang/tree/cmd/compile/internal/ssa.NewTypes)để khởi tạo srtuct [`cmd/compile/internal/ssa.Types`](https://draveness.me/golang/tree/cmd/compile/internal/ssa.Types) và gọi thông tin loại bộ đệm của hàm[`cmd/compile/internal/types.NewPtr`](https://draveness.me/golang/tree/cmd/compile/internal/types.NewPtr). [`cmd/compile/internal/ssa.Types`](https://draveness.me/golang/tree/cmd/compile/internal/ssa.Types)nơi lưu trữ tất cả các con trỏ tương ứng với các kiểu cơ bản trong ngôn ngữ Go, chẳng hạn như `Bool`, `Int8`, `String`, v.v.

![Pasted image 20230607172128](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230607172128.png)

[`cmd/compile/internal/types.NewPtr`](https://draveness.me/golang/tree/cmd/compile/internal/types.NewPtr) là sinh ra các con trỏ tới các kiểu này theo các kiểu, đồng thời sẽ cache các kiểu con trỏ được tạo ra ở kiểu hiện tại theo cấu hình của trình biên dịch, tối ưu hóa hiệu quả lấy các kiểu con trỏ:

```go
func NewPtr(elem *Type) *Type {
	if t := elem.Cache.ptr; t != nil {
		if t.Elem() != elem {
			Fatalf("NewPtr: elem mismatch")
		}
		return t
	}

	t := New(TPTR)
	t.Extra = Ptr{Elem: elem}
	t.Width = int64(Widthptr)
	t.Align = uint8(Widthptr)
	if NewPtrCacheEnabled {
		elem.Cache.ptr = t
	}
	return t
}
```

Bước thứ hai của quá trình khởi tạo cấu hình là khởi tạo cấu hình SSA theo kiến ​​trúc CPU hiện tại. Chúng tôi sẽ truyền kiến ​​trúc CPU của máy mục tiêu,  struct[`cmd/compile/internal/ssa.Types`](https://draveness.me/golang/tree/cmd/compile/internal/ssa.Types) được khởi tạo bởi đoạn mã trên, thông tin ngữ cảnh và cấu hình Gỡ lỗi cho hàm [`cmd/compile/internal/ssa.NewConfig`](https://draveness.me/golang/tree/cmd/compile/internal/ssa.NewConfig):

```go
	ssaConfig = ssa.NewConfig(thearch.LinkArch.Name, *types_, Ctxt, Debug['N'] == 0)
```

Hàm [`cmd/compile/internal/ssa.NewConfig`](https://draveness.me/golang/tree/cmd/compile/internal/ssa.NewConfig) được sử dụng để tạo mã trung gian và mã máy. Con trỏ, kích thước thanh ghi, danh sách thanh ghi khả dụng, mặt nạ và các tùy chọn biên dịch khác được trình biên dịch hiện tại sử dụng sẽ được đặt theo kiến ​​trúc CPU sắp tới:

```go
func NewConfig(arch string, types Types, ctxt *obj.Link, optimize bool) *Config {
	c := &Config{arch: arch, Types: types}
	c.useAvg = true
	c.useHmul = true
	switch arch {
	case "amd64":
		c.PtrSize = 8
		c.RegSize = 8
		c.lowerBlock = rewriteBlockAMD64
		c.lowerValue = rewriteValueAMD64
		c.registers = registersAMD64[:]
		...
	case "arm64":
	...
	case "wasm":
	default:
		ctxt.Diag("arch %s not implemented", arch)
	}
	c.ctxt = ctxt
	c.optimize = optimize

	...
	return c
}
```

Khi tất cả các mục cấu hình được tạo, chúng ở chế độ chỉ đọc trong toàn bộ thời gian biên dịch và được chia sẻ bởi tất cả các giai đoạn biên dịch, tức là cả tạo mã trung gian và tạo mã máy sẽ sử dụng cấu hình này để hoàn thành công việc của chúng. Khi kết thúc cuộc gọi phương thức [`cmd/compile/internal/gc.initssaconfig`](https://draveness.me/golang/tree/cmd/compile/internal/gc.initssaconfig), một số hàm runtime ngôn ngữ Go có thể được trình biên dịch sử dụng được khởi tạo:

```go
	assertE2I = sysfunc("assertE2I")
	assertE2I2 = sysfunc("assertE2I2")
	assertI2I = sysfunc("assertI2I")
	assertI2I2 = sysfunc("assertI2I2")
	deferproc = sysfunc("deferproc")
	Deferreturn = sysfunc("deferreturn")
	...
```

Hàm [`cmd/compile/internal/ssa.sysfunc`](https://draveness.me/golang/tree/cmd/compile/internal/ssa.sysfunc) sẽ tạo một symbol mới trong [`cmd/compile/internal/types.Pkg`](https://draveness.me/golang/tree/cmd/compile/internal/types.Pkg), [`cmd/compile/internal/obj.LSym`](https://draveness.me/golang/tree/cmd/compile/internal/obj.LSym) cho biết rằng phương thức đã được đăng ký trong gói runtime. Các phương thức này được sử dụng trực tiếp trong giai đoạn tạo mã trung gian tiếp theo. Ví dụ: [`runtime.deferproc`](https://draveness.me/golang/tree/runtime.deferproc)và [`runtime.deferreturn`](https://draveness.me/golang/tree/runtime.deferreturn)là các hàm runtime được ngôn ngữ Go sử dụng để triển khai từ khóa defer. Bạn có thể tìm hiểu thêm về nó trong các chương sau.

## 3. Di chuyển và thay thế

Trước khi tạo mã trung gian, trình biên dịch cũng cần phải thay thế một số phần tử của các nút trong Abstract Syntax Tree. Quá trình thay thế này được thực hiện thông qua [`cmd/compile/internal/gc.walk`](https://draveness.me/golang/tree/cmd/compile/internal/gc.walk)và với các hàm liên quan. Dưới đây là chữ ký của một số hàm:

```go
func walk(fn *Node)
func walkappend(n *Node, init *Nodes, dst *Node) *Node
...
func walkrange(n *Node) *Node
func walkselect(sel *Node)
func walkselectcases(cases *Nodes) []*Node
func walkstmt(n *Node) *Node
func walkstmtlist(s []*Node)
func walkswitch(sw *Node)
```

Các hàm này được sử dụng để đi qua Abstract Syntax Tree chuyển đổi một số từ khóa và hàm tích hợp thành lệnh gọi hàm, ví dụ: hàm trên chuyển đổi hai hàm tích hợp `panic`, `recover` thành hai hàm runtime  [`runtime.gopanic`](https://draveness.me/golang/tree/runtime.gopanic) và [`runtime.gorecover`](https://draveness.me/golang/tree/runtime.gorecover), và từ khóa `new` cũng được chuyển đổi thành hàm [`runtime.newobject`](https://draveness.me/golang/tree/runtime.newobject).

![Pasted image 20230607172109](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230607172109.png)

Hình trên là ánh xạ từ khoá hoặc hàm tích hợp sang hàm runtime, liên quan đến Channel, hash map, `make`, `new`, `select`, v.v. Tất cả các hàm được chuyển đổi thuộc về runtime package và chúng ta có thể tìm thấy chữ ký và định nghĩa tương ứng của hàm trong tệp [`src/cmd/compile/internal/gc/builtin/runtime.go`](https://github.com/golang/go/blob/master/src/cmd/compile/internal/gc/builtin/runtime.go).

```go
func makemap64(mapType *byte, hint int64, mapbuf *any) (hmap map[any]any)
func makemap(mapType *byte, hint int, mapbuf *any) (hmap map[any]any)
func makemap_small() (hmap map[any]any)
func mapaccess1(mapType *byte, hmap map[any]any, key *any) (val *any)
...
func makechan64(chanType *byte, size int64) (hchan chan any)
func makechan(chanType *byte, size int) (hchan chan any)
...
```

Các định nghĩa ở đây chỉ dành cho ngôn ngữ Go để hoàn thành quá trình biên dịch và việc triển khai chúng nằm trong gói [`runtime`](https://github.com/golang/go/tree/master/src/runtime). Tóm lại, trình biên dịch sẽ chuyển đổi các từ khóa ngôn ngữ Go thành các hàm trong gói runtime, có nghĩa là các chức năng của từ khóa và hàm tích hợp được trình biên dịch và runtime cùng hoàn thành.

Chúng ta hãy hiểu ngắn gọn về cách một số thao tác Channel được chuyển đổi thành các phương thức tương ứng trong runtime khi duyệt qua các nút. Đầu tiên, chúng tôi sẽ giới thiệu hai thao tác gửi tin nhắn đến Channel hoặc nhận tin nhắn từ Channel. Trình biên dịch sẽ sử dụng `OSEND` và `ORECV`. Trong hàm [`cmd/compile/internal/gc.walkexpr`](https://draveness.me/golang/tree/cmd/compile/internal/gc.walkexpr) sẽ truy cập các nhánh khác nhau tùy theo các loại nút khác nhau:

```go
func walkexpr(n *Node, init *Nodes) *Node {
	...
	case OSEND:
		n1 := n.Right
		n1 = assignconv(n1, n.Left.Type.Elem(), "chan send")
		n1 = walkexpr(n1, init)
		n1 = nod(OADDR, n1, nil)
		n = mkcall1(chanfn("chansend1", 2, n.Left.Type), nil, init, n.Left, n1)
	...
}
```

Khi gặp phải thao tác `OSEND`, gọi hàm [`cmd/compile/internal/gc.mkcall1`](https://draveness.me/golang/tree/cmd/compile/internal/gc.mkcall1) với tham số là hàm [`runtime.chansend1`](https://draveness.me/golang/tree/runtime.chansend1)và tham số khác trả về nút `OCALL`. Sau đó nút `OCALL` sẽ thay thế nút `OSEND` hiện tại, nút này sẽ hoàn thành việc viết lại cây con `OSEND`.

![Pasted image 20230607172057](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230607172057.png)

Khi gặp thao tác `ORECV`, xử lý của trình biên dịch gần giống như khi gặp `OSEND`, ta chỉ thay [`runtime.chansend1`](https://draveness.me/golang/tree/runtime.chansend1) bằng [`runtime.chanrecv1`](https://draveness.me/golang/tree/runtime.chanrecv1), còn các tham số khác không thay đổi nhiều:

```go
		n = mkcall1(chanfn("chanrecv1", 2, n.Left.Type), nil, &init, n.Left, nodnil())
```

Các thao tác `OCLOSE` sử dụng với từ khóa `close` cũng được dịch thành các nút `OCALL` gọi hàm [`runtime.closechan`](https://draveness.me/golang/tree/runtime.closechan) trong [`cmd/compile/internal/gc.walkexpr`](https://draveness.me/golang/tree/cmd/compile/internal/gc.walkexpr)

```go
func walkexpr(n *Node, init *Nodes) *Node {
	...
	case OCLOSE:
		fn := syslook("closechan")

		fn = substArgTypes(fn, n.Left.Type)
		n = mkcall1(fn, nil, init, n.Left)
	...
}
```

Trình biên dịch sẽ chuyển đổi các toán tử tích hợp sẵn này của Channel thành một số hàm runtime trong quá trình biên dịch. Nhiều người muốn hiểu cách triển khai cơ bản của Cannel nhưng họ không biết điểm bắt đầu hàm. Thông qua phân tích trong phần này, chúng tôi biết [`runtime.chanrecv1`](https://draveness.me/golang/tree/runtime.chanrecv1)và [`runtime.chansend1`](https://draveness.me/golang/tree/runtime.chansend1)và [`runtime.closechan`](https://draveness.me/golang/tree/runtime.closechan) Mỗi hàm thực hiện các hoạt động nhận, gửi và đóng Channel tương ứng.

## 4. Xây dựng SSA

Sau khi được xử lý bởi một loạt hàm `walk`, Abstract Syntax Tree sẽ không thay đổi, trình biên dịch của ngôn ngữ Go sẽ sử dụng hàm [`cmd/compile/internal/gc.compileSSA`](https://draveness.me/golang/tree/cmd/compile/internal/gc.compileSSA) để chuyển đổi Abstract Syntax Tree thành mã trung gian, trước tiên chúng ta có thể xem sơ lược cách thực hiện hàm này:

```go
func compileSSA(fn *Node, worker int) {
	f := buildssa(fn, worker)
	pp := newProgs(fn, worker)
	genssa(f, pp)

	pp.Flush()
}
```

[`cmd/compile/internal/gc.buildssa`](https://draveness.me/golang/tree/cmd/compile/internal/gc.buildssa)chịu trách nhiệm tạo mã trung gian với các tính năng SSA, chúng ta có thể sử dụng các công cụ dòng lệnh để quan sát quá trình tạo mã trung gian, giả sử chúng ta có mã nguồn ngôn ngữ Go sau, mã này chỉ chứa một hàm `hello`

```go
package hello

func hello(a int) int {
	c := a + 2
	return c
}
```

Chúng ta có thể sử dụng biến môi trường `GOSSAFUNC` để xây dựng đoạn mã trên và nhận hàng tá lần lặp lại từ mã nguồn đến mã trung gian cuối cùng, nơi tất cả dữ liệu được lưu trữ trong tệp `ssa.html`:

```go
$ GOSSAFUNC=hello go build hello.go
# command-line-arguments
dumped SSA to ./ssa.html
```

Tệp trên chứa Abstract Syntax Tree tương ứng với mã nguồn, hàng chục phiên bản của mã trung gian và SSA được tạo cuối cùng. Ở đây, tệp được cắt một phần để người đọc dễ hiểu nội dung của tệp:

![ssa-htm](https://img.draveness.me/2019-12-23-15771129929852-ssa-html.png)

Như thể hiện trong hình trên, mã nguồn ở ngoài cùng bên trái, Abstract Syntax Tree do mã nguồn tạo ra ở giữa và vòng mã trung gian đầu tiên được tạo ở ngoài cùng bên phải và có hàng chục vòng để theo dõi, bạn đọc quan tâm có thể thử tự biên dịch một lần. Abstract Syntax Tree tương ứng với hàm sẽ chứa ba thuộc tính của hàm `hello` hiện tại `Enter`, và `NBody` và `Exit`, hàm [`cmd/compile/internal/gc.buildssa`](https://draveness.me/golang/tree/cmd/compile/internal/gc.buildssa) sẽ xuất các thuộc tính này. Bạn có thể thấy bóng của đầu ra ở trên từ logic đơn giản hóa này:

```go
func buildssa(fn *Node, worker int) *ssa.Func {
	name := fn.funcname()
	var astBuf *bytes.Buffer
	var s state

	fe := ssafn{
		curfn: fn,
		log:   printssa && ssaDumpStdout,
	}
	s.curfn = fn

	s.f = ssa.NewFunc(&fe)
	s.config = ssaConfig
	s.f.Type = fn.Type
	s.f.Config = ssaConfig

	...

	s.stmtList(fn.Func.Enter)
	s.stmtList(fn.Nbody)

	ssa.Compile(s.f)
	return s.f
}
```

`ssaConfig` là struct mà chúng ta đã khởi tạo trong phần đầu tiên ở đây, chứa các hàm và cấu hình liên quan đến kiến trúc CPU. Việc tạo mã trung gian tiếp theo thực sự được chia thành hai giai đoạn. Giai đoạn đầu tiên sử dụng [`cmd/compile/internal/gc.state.stmtList`](https://draveness.me/golang/tree/cmd/compile/internal/gc.state.stmtList) tạo mã trung gian. Giai đoạn thứ hai gọi [`cmd/compile/internal/ssa.Compile`](https://draveness.me/golang/tree/cmd/compile/internal/ssa.Compile) tạo mã trung gian SSA của gói [`cmd/compile/internal/ssa`](https://github.com/golang/go/tree/master/src/cmd/compile/internal/ssa) thông qua nhiều lần lặp lại.

### AST to SSA

Phương thức [`cmd/compile/internal/gc.state.stmt`](https://draveness.me/golang/tree/cmd/compile/internal/gc.state.stmt) sẽ được gọi cho mỗi nút trong mảng đến [`cmd/compile/internal/gc.state.stmtList`](https://draveness.me/golang/tree/cmd/compile/internal/gc.state.stmtList) và trình biên dịch sẽ chuyển đổi nút AST hiện tại thành mã trung gian tương ứng theo các toán tử nút khác nhau:

```go
func (s *state) stmt(n *Node) {
	...
	switch n.Op {
	case OCALLMETH, OCALLINTER:
		s.call(n, callNormal)
		if n.Op == OCALLFUNC && n.Left.Op == ONAME && n.Left.Class() == PFUNC {
			if fn := n.Left.Sym.Name; compiling_runtime && fn == "throw" ||
				n.Left.Sym.Pkg == Runtimepkg && (fn == "throwinit" || fn == "gopanic" || fn == "panicwrap" || fn == "block" || fn == "panicmakeslicelen" || fn == "panicmakeslicecap") {
				m := s.mem()
				b := s.endBlock()
				b.Kind = ssa.BlockExit
				b.SetControl(m)
			}
		}
		s.call(n.Left, callDefer)
	case OGO:
		s.call(n.Left, callGo)
	...
	}
}
```

Từ đoạn mã được trích dẫn ở trên, chúng ta sẽ thấy rằng khi một lệnh gọi hàm [`cmd/compile/internal/gc.state.callResult`](https://draveness.me/golang/tree/cmd/compile/internal/gc.state.callResult), lệnh gọi phương thức  [`cmd/compile/internal/gc.state.call`](https://draveness.me/golang/tree/cmd/compile/internal/gc.state.call), từ khóa defer hoặc go được sử dụng và gọi hàm đó sẽ được thực thi. Các khái niệm khác nhau này theo quan điểm của nhà phát triển sẽ xuất hiện trong trình biên dịch. Được triển khai như một lệnh gọi hàm tĩnh, các từ khóa và phương thức cấp cao hơn chỉ là đường dẫn cú pháp do ngôn ngữ cung cấp:

```go
func (s *state) callResult(n *Node, k callKind) *ssa.Value {
	return s.call(n, k, false)
}

func (s *state) call(n *Node, k callKind) *ssa.Value {
	...
	var call *ssa.Value
	switch {
	case k == callDefer:
		call = s.newValue1A(ssa.OpStaticCall, types.TypeMem, deferproc, s.mem())
	case k == callGo:
		call = s.newValue1A(ssa.OpStaticCall, types.TypeMem, newproc, s.mem())
	case sym != nil:
		call = s.newValue1A(ssa.OpStaticCall, types.TypeMem, sym.Linksym(), s.mem())
	..
	}
	...
}
```

Đầu tiên, trong quá trình chuyển đổi từ AST sang SSA, trình biên dịch sẽ tạo ra đoạn mã trung gian đưa các tham số của lệnh gọi hàm vào stack, sau khi xử lý các tham số, nó sẽ sinh ra lệnh chạy hàm `ssa.OpStaticCall`:

1. Khi sử dụng từ khóa defer, hãy chèn kí hiệu hàm [`runtime.deferproc`](https://draveness.me/golang/tree/runtime.deferproc) ;
2. Khi sử dụng từ khóa go, hãy chèn ký hiệu hàm [`runtime.newproc`](https://draveness.me/golang/tree/runtime.newproc) ;
3. Trong các trường hợp khác, các ký hiệu tương ứng với các hàm thông thường sẽ được chèn vào;

Tệp [`cmd/compile/internal/gc/ssa.go`](https://github.com/golang/go/blob/master/src/cmd/compile/internal/gc/ssa.go) này với gần 7.000 dòng mã chứa nhiều phương thức xử lý các nút khác nhau. Trình biên dịch sẽ xử lý các tình huống khác nhau trong một câu lệnh chuyển đổi khổng lồ tùy thuộc vào loại nút. Đây là những gì chúng ta có thể làm trong kịch bản độc đáo này của trình biên dịch.

```go
compiling hello
hello func(int) int
  b1:
    v1 = InitMem <mem>
    v2 = SP <uintptr>
    v3 = SB <uintptr> DEAD
    v4 = LocalAddr <*int> {a} v2 v1 DEAD
    v5 = LocalAddr <*int> {~r1} v2 v1
    v6 = Arg <int> {a}
    v7 = Const64 <int> [0] DEAD
    v8 = Const64 <int> [2]
    v9 = Add64 <int> v6 v8 (c[int])
    v10 = VarDef <mem> {~r1} v1
    v11 = Store <mem> {int} v5 v9 v10
    Ret v11
```

Mã trên được tạo ra trong quá trình này và bạn có thể thấy rằng mỗi dòng trong thân mã trung gian xác định một biến mới, đây là mã trung gian mà chúng tôi đã đề cập trước đó với các tính năng Single Static Assignment (SSA), và nếu bạn biên dịch mã trung gian bằng cách sử dụng lệnh `GOSSAFUNC=hello go build hello.go`.

### ### Nhiều vòng chuyển đổi

Mặc dù chúng ta đã tạo các mã trung gian SSA trong [`cmd/compile/internal/gc.state.stmt`](https://draveness.me/golang/tree/cmd/compile/internal/gc.state.stmt)và các phương thức liên quan, các mã trung gian này vẫn cần được trình biên dịch tối ưu hóa để loại bỏ các mã vô dụng và đơn giản hóa các toán hạng. Quá trình tối ưu hóa các mã trung gian bởi trình biên dịch được thực hiện bởi hàm [`cmd/compile/internal/ssa.Compile`](https://draveness.me/golang/tree/cmd/compile/internal/ssa.Compile):

```go
func Compile(f *Func) {
	if f.Log() {
		f.Logf("compiling %s\n", f.Name)
	}

	phaseName := "init"

	for _, p := range passes {
		f.pass = &p
		p.fn(f)
	}

	phaseName = ""
}
```

Hàm trên xóa rất nhiều mã để in nhật ký và phân tích hiệu suất, nhiều vòng xử lý mà SSA cần trải qua cũng được lưu trong biến `passes` của từng vòng xử lý, hàm được sử dụng và trường `required` cho biết liệu nó có cần thiết hay không:

```go
var passes = [...]pass{
	{name: "number lines", fn: numberLines, required: true},
	{name: "early phielim", fn: phielim},
	{name: "early copyelim", fn: copyelim},
	...
	{name: "loop rotate", fn: loopRotate},
	{name: "stackframe", fn: stackframe, required: true},
	{name: "trim", fn: trim},
}
```

Trình biên dịch hiện tại giới thiệu tổng cộng gần 50 quy trình cần được thực thi. Chúng ta có thể thấy mã trung gian sau mỗi vòng xử lý trong tệp `GOSSAFUNC=hello go build hello.go`do lệnh . Ví dụ `trim`: mã SSA sau được tạo trong giai đoạn cuối:

```go
  pass trim begin
  pass trim end [738 ns]
hello func(int) int
  b1:
    v1 = InitMem <mem>
    v10 = VarDef <mem> {~r1} v1
    v2 = SP <uintptr> : SP
    v6 = Arg <int> {a} : a[int]
    v8 = LoadReg <int> v6 : AX
    v9 = ADDQconst <int> [2] v8 : AX (c[int])
    v11 = MOVQstore <mem> {~r1} v2 v9 v10
    Ret v11
```

Sau gần 50 vòng xử lý mã trung gian so với trước khi xử lý đã có những thay đổi rất lớn, hiệu quả thực hiện sẽ được cải thiện đáng kể, nhiều vòng xử lý đã bao gồm một số sửa đổi máy cụ thể, bao gồm cả việc viết lại mã theo kiến trúc mục tiêu, nhưng ở đây sẽ không mở ra để giới thiệu nội dung của mỗi vòng xử lý.

## 5. Tóm tắt

Quá trình tạo mã trung gian là quá trình chuyển đổi từ AST sang mã trung gian SSA. Trong giai đoạn này, các từ khóa trong cây cú pháp sẽ được viết lại và cây cú pháp viết lại sẽ được chuyển đổi thành cây trung gian SSA cuối cùng sau nhiều vòng xử lý. Mã có liên quan bao gồm một số lượng lớn các câu lệnh chuyển đổi, các hàm phức tạp và call stack, đồng thời nó cũng rất khó đọc và phân tích.

Nhiều từ khóa và hàm tích hợp trong ngôn ngữ Go được chuyển đổi thành các phương thức trong gói runtime ở giai đoạn này. Và các chương tiếp theo của tác giả giới thiệu một số cấu trúc dữ liệu và triển khai hàm tích hợp từ các từ khóa ngôn ngữ cụ thể và hàm tích hợp.
