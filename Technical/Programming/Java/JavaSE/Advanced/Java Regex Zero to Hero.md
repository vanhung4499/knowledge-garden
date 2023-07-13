---
title: Java Regex Zero to Hero
tags: [java, javase, regex]
categories: [java, javase, regex]
date created: 2023-07-13
date modified: 2023-07-14
---

# Hiểu sâu về Regular Expression trong Java

> Từ khóa: Pattern, Matcher, Capturing và Non-capturing, Backreference, Zero-width assertions, Greedy và Lazy, Metacharacters, DFA, NFA

## Giới thiệu về Regular Expression

### Regular Expression là gì?

Regular Expression (Biểu thức chính quy) là một công thức được viết bằng các ký hiệu chính quy, chương trình sẽ phân tích cú pháp của công thức này, xây dựng một cây phân tích cú pháp, sau đó dựa trên cây phân tích cú pháp và công cụ biểu thức chính quy để tạo ra một chương trình thực thi (chúng ta gọi nó là máy trạng thái, còn được gọi là máy tự động trạng thái), được sử dụng để so khớp các ký tự.

### Làm thế nào để học Regular Expression

Biểu thức chính quy là một công cụ mạnh mẽ để so khớp văn bản, nhưng cú pháp của nó rất phức tạp và khó hiểu, dễ làm cho người ta nản lòng.

Khi mới tiếp xúc với biểu thức chính quy, tôi đã đọc nhiều giải thích về ý nghĩa của biểu thức chính quy, nhưng vẫn không hiểu gì cả. Sau đó, tôi tiếp xúc với nhiều ví dụ ứng dụng của biểu thức chính quy và dần hiểu hơn, kết hợp với giải thích ý nghĩa, cuối cùng tôi đã có sự nhận thức. Tôi nghĩ biểu thức chính quy giống như việc luyện võ công, trước hết là luyện các kỹ năng (ví dụ cơ bản của biểu thức chính quy), sau đó luyện công pháp (cú pháp của biểu thức chính quy). Nếu chỉ nhớ một số động tác cơ bản (các ví dụ cơ bản của biểu thức chính quy), bạn sẽ trở thành một cao thủ, không chỉ nhớ thuộc lòng một số động tác cơ bản. Giống như Trương Tam Phong đã dạy cho Trương Vô Kỵ Thái Cực Quyền, nếu hiểu tâm pháp và thuần thục thì sẽ có thể chiến thắng không cần thủ đoạn và trở thành cao thủ huyền thoại.

**Những lời lẽ trên có thể tóm tắt thành một câu: Học biểu thức chính quy từ ví dụ thực tế.**

## Lớp công cụ Regular Expression

Gói `java.util.regex` trong JDK cung cấp hỗ trợ cho biểu thức chính quy.

`java.util.regex` có ba lớp chính:

- **Lớp Pattern:** `Pattern` là biểu diễn biên dịch của biểu thức chính quy.
- **Lớp Matcher:** `Matcher` là trình thông dịch và khớp chuỗi đầu vào.
- **PatternSyntaxException:** `PatternSyntaxException` là một lớp ngoại lệ không bắt buộc, nó đại diện cho lỗi cú pháp trong mẫu biểu thức chính quy.

**Lưu ý:** Cần lưu ý rằng khi sử dụng ký tự gạch chéo ngược `"\"` trong Java, bạn phải viết thành `"\\"`. Vì vậy, mã trong bài viết này có dạng `String regex = "\\\\$\\\\{.*?\\\\}"` thực tế là `\\$\\{.*?\\}`.

### Lớp Pattern

Lớp `Pattern` không có phương thức khởi tạo công khai. Để tạo một đối tượng `Pattern`, bạn phải trước tiên gọi phương thức **tĩnh** `compile`, tải chuỗi quy tắc chính quy và sau đó trả về một đối tượng Pattern.

Tương tự như lớp `Pattern`, lớp `Matcher` cũng không có phương thức khởi tạo công khai. Bạn cần gọi phương thức `matcher` của đối tượng `Pattern` để nhận một đối tượng `Matcher`.

【Ví dụ】Khởi tạo Pattern và Matcher

```java
Pattern p = Pattern.compile(regex);
Matcher m = p.matcher(content);
```

### Lớp Matcher

Lớp `Matcher` có thể coi là lớp trung tâm trong `java.util.regex`, nó có ba chức năng: kiểm tra, tìm kiếm và thay thế.

#### Kiểm tra

Để kiểm tra xem văn bản có khớp với quy tắc chính quy hay không, `Matcher` cung cấp một số phương thức trả về giá trị `boolean`.

| **STT** | Phương thức | Mô tả|
| -------- | --------------------------------------------------------------------------------------------------------------- | --- |
| 1        | **public boolean lookingAt()** | Thử khớp chuỗi đầu vào từ vị trí bắt đầu của khu vực với mẫu này.                   |
| 2        | **public boolean find()** | Thử tìm chuỗi con tiếp theo của chuỗi đầu vào khớp với mẫu này.                         |
| 3        | **public boolean find(int start)** | Đặt lại Matcher này và thử tìm chuỗi con tiếp theo của chuỗi đầu vào khớp với mẫu này, bắt đầu từ chỉ mục đã cho. |
| 4        | **public boolean matches()** | Thử khớp toàn bộ khu vực với mẫu này.                                               |

Nếu bạn không thể phân biệt các phương thức tìm kiếm trên, ví dụ dưới đây sẽ giúp bạn hiểu ngay.

【Ví dụ】lookingAt, find, matches

```java
public static void main(String[] args) {
	checkLookingAt("hello", "helloworld");
	checkLookingAt("world", "helloworld");

	checkFind("hello", "helloworld");
	checkFind("world", "helloworld");

	checkMatches("hello", "helloworld");
	checkMatches("world", "helloworld");
	checkMatches("helloworld", "helloworld");
}

private static void checkLookingAt(String regex, String content) {
	Pattern p = Pattern.compile(regex);
	Matcher m = p.matcher(content);
	if (m.lookingAt()) {
		System.out.println(content + "\tlookingAt: " + regex);
	} else {
		System.out.println(content + "\tnot lookingAt: " + regex);
	}
}

private static void checkFind(String regex, String content) {
	Pattern p = Pattern.compile(regex);
	Matcher m = p.matcher(content);
	if (m.find()) {
		System.out.println(content + "\tfind: " + regex);
	} else {
		System.out.println(content + "\tnot find: " + regex);
	}
}

private static void checkMatches(String regex, String content) {
	Pattern p = Pattern.compile(regex);
	Matcher m = p.matcher(content);
	if (m.matches()) {
		System.out.println(content + "\tmatches: " + regex);
	} else {
		System.out.println(content + "\tnot matches: " + regex);
	}
}
```

Kết quả:

```
helloworld	lookingAt: hello
helloworld	not lookingAt: world
helloworld	find: hello
helloworld	find: world
helloworld	not matches: hello
helloworld	not matches: world
helloworld	matches: helloworld
```

**Giải thích**

`regex = "world"` đại diện cho quy tắc chính quy là chuỗi bắt đầu bằng "world", `regex = "hello"` và `regex = "helloworld"` cũng tương tự.

- Phương thức `lookingAt` kiểm tra xem chuỗi con của content khớp với quy tắc chính quy hay không, bắt đầu từ đầu chuỗi.
- Phương thức `find` kiểm tra xem chuỗi con của content khớp với quy tắc chính quy hay không, không quan tâm vị trí của chuỗi.
- Phương thức `matches` kiểm tra xem toàn bộ chuỗi content có khớp với quy tắc chính quy hay không.

#### Tìm kiếm

Để tìm vị trí của văn bản khớp với quy tắc chính quy, `Matcher` cung cấp các phương thức sau:

| **STT** | **Phương thức** | **Mô tả** |  
| -------- | --- | --- |  
| 1 | **public int start()** | Trả về chỉ mục bắt đầu của sự khớp trước đó. |  
| 2 | **public int start(int group)** | Trả về chỉ mục bắt đầu của chuỗi con được bắt trong quá trình khớp trước đó, thuộc nhóm đã cho. |  
| 3 | **public int end()** | Trả về chỉ mục kết thúc của ký tự cuối cùng được khớp. |  
| 4 | **public int end(int group)** | Trả về chỉ mục kết thúc của ký tự sau ký tự cuối cùng được khớp trong quá trình khớp trước đó, thuộc nhóm đã cho. |  
| 5 | **public String group()** | Trả về chuỗi con khớp trước đó. |  
| 6 | **public String group(int group)** | Trả về chuỗi con khớp trước đó theo nhóm đã cho. |

【Ví dụ】Sử dụng start(), end(), group() để tìm tất cả các chuỗi con khớp với biểu thức chính quy

```java
public static void main(String[] args) {
	final String regex = "world";
	final String content = "helloworld helloworld";
	Pattern p = Pattern.compile(regex);
	Matcher m = p.matcher(content);
	System.out.println("content: " + content);

	int i = 0;
	while (m.find()) {
		i++;
		System.out.println("[" + i + "th] found");
		System.out.print("start: " + m.start() + ", ");
		System.out.print("end: " + m.end() + ", ");
		System.out.print("group: " + m.group() + "\n");
	}
}
```

**Kết quả**

```
content: helloworld helloworld
[1th] found
start: 5, end: 10, group: world
[2th] found
start: 16, end: 21, group: world
```

**Giải thích**

Ví dụ rất rõ ràng, không cần giải thích thêm.

#### Thay thế

Phương thức thay thế được sử dụng để thay thế văn bản trong chuỗi đầu vào:

| **STT** | **Phương thức** | **Mô tả**                                                                                                                                                                    |
| -------- | --- | --- |
| 1        | **public Matcher appendReplacement(StringBuffer sb, String replacement)** | Thực hiện bước thêm và thay thế không kết thúc.|
| 2        | **public StringBuffer appendTail(StringBuffer sb)** | Thực hiện bước thêm và thay thế kết thúc.|
| 3        | **public String replaceAll(String replacement)** | Thay thế mỗi chuỗi con của chuỗi đầu vào khớp với mẫu bằng chuỗi thay thế đã cho.|
| 4        | **public String replaceFirst(String replacement)** | Thay thế chuỗi con đầu tiên của chuỗi đầu vào khớp với mẫu bằng chuỗi thay thế đã cho. |
| 5        | **public static String quoteReplacement(String s)** | Trả về chuỗi thay thế chính xác của chuỗi đã cho. Phương thức này trả về một chuỗi, hoạt động giống như việc truyền một chuỗi chính xác cho phương thức appendReplacement của lớp Matcher. |

【Ví dụ】replaceFirst và replaceAll

```java
public static void main(String[] args) {
    String regex = "can";
    String replace = "can not";
    String content = "I can because I think I can.";

    Pattern p = Pattern.compile(regex);
    Matcher m = p.matcher(content);

    System.out.println("content: " + content);
    System.out.println("replaceFirst: " + m.replaceFirst(replace));
    System.out.println("replaceAll: " + m.replaceAll(replace));
}
```

**Kết quả**

```
content: I can because I think I can.
replaceFirst: I can not because I think I can.
replaceAll: I can not because I think I can not.
```

**Giải thích**

replaceFirst: Thay thế chuỗi con đầu tiên khớp với biểu thức chính quy.

replaceAll: Thay thế tất cả các chuỗi con khớp với biểu thức chính quy.

【Ví dụ】appendReplacement, appendTail và replaceAll

```java
public static void main(String[] args) {
    String regex = "can";
    String replace = "can not";
    String content = "I can because I think I can.";
    StringBuffer sb = new StringBuffer();

    System.out.println("content: " + content);
    Pattern p = Pattern.compile(regex);
    Matcher m = p.matcher(content);
    while (m.find()) {
        m.appendReplacement(sb, replace);
    }
    System.out.println("appendReplacement: " + sb);
    m.appendTail(sb);
    System.out.println("appendTail: " + sb);
}
```

**Kết quả**

```
content: I can because I think I can.
appendReplacement: I can not because I think I can not
appendTail: I can not because I think I can not.
```

**Giải thích**

Từ kết quả, ta thấy rằng việc kết hợp phương thức appendReplacement và appendTail có cùng chức năng với phương thức replaceAll.

Nếu bạn xem mã nguồn của phương thức replaceAll, bạn sẽ thấy rằng nó thực chất là sử dụng kết hợp của phương thức appendReplacement và appendTail để thực hiện.

【Ví dụ】quoteReplacement và replaceAll, giải quyết vấn đề thay thế ký tự đặc biệt

```java
public static void main(String[] args) {
    String regex = "\\$\\{.*?\\}";
    String replace = "${product}";
    String content = "product is ${productName}.";

    Pattern p = Pattern.compile(regex);
    Matcher m = p.matcher(content);
    String replaceAll = m.replaceAll(replace);

    System.out.println("content: " + content);
    System.out.println("replaceAll: " + replaceAll);
}
```

**Kết quả**

```
Exception in thread "main" java.lang.IllegalArgumentException: No group with name {product}
    at java.util.regex.Matcher.appendReplacement(Matcher.java:849)
    at java.util.regex.Matcher.replaceAll(Matcher.java:955)
    at org.zp.notes.javase.regex.RegexDemo.wrongMethod(RegexDemo.java:42)
    at org.zp.notes.javase.regex.RegexDemo.main(RegexDemo.java:18)
    at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
    at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
    at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
    at java.lang.reflect.Method.invoke(Method.java:498)
    at com.intellij.rt.execution.application.AppMain.main(AppMain.java:147)
```

**Giải thích**

Dòng mã `String regex = "\\$\\{.*?\\}";` đại diện cho việc khớp với chuỗi `${name}`. Vì `$`, `{` và `}` đều là các ký tự đặc biệt, cần sử dụng ký tự thoát `\` để xử lý chúng như một ký tự chuỗi.

Ví dụ trên muốn thay thế `${productName}` bằng `${product}`, nhưng phương thức replaceAll lại xử lý ký tự `$` trong chuỗi đầu vào như một ký tự đặc biệt. Kết quả là ngoại lệ được ném ra.

Làm thế nào để giải quyết vấn đề này?

JDK1.5 đã giới thiệu phương thức `quoteReplacement`. Nó được sử dụng để chuyển đổi các ký tự đặc biệt. Thực tế, mã nguồn rất đơn giản, chỉ cần kiểm tra xem chuỗi có chứa `\` hoặc `$` không, nếu có thì thêm ký tự thoát `\` vào.

Chúng ta chỉ cần điều chỉnh mã nguồn trên một chút:

`m.replaceAll(replace)` thay bằng `m.replaceAll(Matcher.quoteReplacement(replace))`, mã mới như sau:

```java
public static void main(String[] args) {
    String regex = "\\$\\{.*?\\}";
    String replace = "${product}";
    String content = "product is ${productName}.";

    Pattern p = Pattern.compile(regex);
    Matcher m = p.matcher(content);
    String replaceAll = m.replaceAll(Matcher.quoteReplacement(replace));

    System.out.println("content: " + content);
    System.out.println("replaceAll: " + replaceAll);
}
```

**Kết quả**

```
content: product is ${productName}.
replaceAll: product is ${product}.
```

**Giải thích**

Vấn đề không thể phân tích chuỗi chứa `\` hoặc `$` đã được giải quyết.

## Các ký tự đặc biệt

Các ký tự đặc biệt (metacharacters) trong biểu thức chính quy là các ký tự có ý nghĩa đặc biệt và được sử dụng để xác định các quy tắc và mẫu trong chuỗi.

### Các ký tự đặc biệt cơ bản

Các ký tự đặc biệt trong biểu thức chính quy không dễ nhớ, đặc biệt là do có nhiều ký tự tương đương được sử dụng để rút gọn biểu thức. Tuy nhiên, thực tế là chỉ có một số ký tự đặc biệt cơ bản và chúng có thể đáp ứng hầu hết các tình huống. Hãy khám phá sự kỳ diệu của biểu thức chính quy từng bước một thông qua các ví dụ.

#### Lựa chọn nhiều mục ( `|` )

【Ví dụ】Khớp với một chuỗi cụ thể

```java
checkMatches("abc", "abc");
```

Nếu bạn muốn khớp với một chuỗi cụ thể, điều này rất đơn giản, như ví dụ 1 đã cho thấy. Nhưng nếu bạn không chắc chắn về chuỗi bạn muốn khớp và muốn có nhiều lựa chọn, bạn sẽ làm gì? Câu trả lời là: sử dụng ký tự đặc biệt `|`, có nghĩa là hoặc.

【Ví dụ】Khớp với nhiều chuỗi tùy chọn

```java
// Kiểm tra ký tự đặc biệt trong biểu thức chính quy: |
Assert.assertTrue(checkMatches("yes|no", "yes"));
Assert.assertTrue(checkMatches("yes|no", "no"));
Assert.assertFalse(checkMatches("yes|no", "right"));

// Kết quả
// yes	khớp: yes|no
// no	khớp: yes|no
// right	không khớp: yes|no
```

#### Nhóm các mục ( `()` )

Nếu bạn muốn biểu thức chính quy bao gồm nhiều biểu thức con, bạn có thể sử dụng `()`.

【Ví dụ】Khớp với chuỗi kết hợp

```java
Assert.assertTrue(checkMatches("(play|end)(ing|ed)", "ended"));
Assert.assertTrue(checkMatches("(play|end)(ing|ed)", "ending"));
Assert.assertTrue(checkMatches("(play|end)(ing|ed)", "playing"));
Assert.assertTrue(checkMatches("(play|end)(ing|ed)", "played"));

// Kết quả
// ended	khớp: (play|end)(ing|ed)
// ending	khớp: (play|end)(ing|ed)
// playing	khớp: (play|end)(ing|ed)
// played	khớp: (play|end)(ing|ed)
```

#### Xác định phạm vi của một ký tự duy nhất ( `[]` )

Trước đây, chúng ta đã thấy cách khớp với chuỗi. Tuy nhiên, trong nhiều trường hợp, bạn cần khớp chính xác một ký tự duy nhất, và đó là lúc bạn sử dụng `[]`.

【Ví dụ】Ký tự trong phạm vi chỉ định

```java
// Kiểm tra ký tự đặc biệt trong biểu thức chính quy: []
Assert.assertTrue(checkMatches("[abc]", "b"));  // Ký tự chỉ có thể là a, b, c
Assert.assertTrue(checkMatches("[a-z]", "m")); // Ký tự chỉ có thể là a - z
Assert.assertTrue(checkMatches("[A-Z]", "O")); // Ký tự chỉ có thể là A - Z
Assert.assertTrue(checkMatches("[a-zA-Z]", "K")); // Ký tự chỉ có thể là a - z và A - Z
Assert.assertTrue(checkMatches("[a-zA-Z]", "k"));
Assert.assertTrue(checkMatches("[0-9]", "5")); // Ký tự chỉ có thể là 0 - 9

// Kết quả
// b	khớp: [abc]
// m	khớp: [a-z]
// O	khớp: [A-Z]
// K	khớp: [a-zA-Z]
// k	khớp: [a-zA-Z]
// 5	khớp: [0-9]
```

#### Xác định phạm vi không hợp lệ của một ký tự duy nhất ( `[^]` )

【Ví dụ】Ký tự không nằm trong phạm vi chỉ định

Nếu bạn muốn khớp với ký tự ngược lại, tức là ký tự không nằm trong phạm vi chỉ định, bạn có thể sử dụng `[^]`.

```java
// Kiểm tra ký tự đặc biệt trong biểu thức chính quy: [^]
Assert.assertFalse(checkMatches("[^abc]", "b")); // Ký tự không thể là a, b, c
Assert.assertFalse(checkMatches("[^a-z]", "m")); // Ký tự không thể là a - z
Assert.assertFalse(checkMatches("[^A-Z]", "O")); // Ký tự không thể là A - Z
Assert.assertFalse(checkMatches("[^a-zA-Z]", "K")); // Ký tự không thể là a - z và A - Z
Assert.assertFalse(checkMatches("[^a-zA-Z]", "k"));
Assert.assertFalse(checkMatches("[^0-9]", "5")); // Ký tự không thể là 0 - 9

// Kết quả
// b	không khớp: [^abc]
// m	không khớp: [^a-z]
// O	không khớp: [^A-Z]
// K	không khớp: [^a-zA-Z]
// k	không khớp: [^a-zA-Z]
// 5	không khớp: [^0-9]
```

#### Giới hạn số lượng ký tự ( `{}` )

Nếu bạn muốn kiểm soát số lần xuất hiện của ký tự, bạn có thể sử dụng `{}`.

| Ký tự    | Mô tả                                                             |
| ------- | ---------------------------------------------------------------- |
| `{n}`   | n là một số nguyên không âm. Khớp chính xác n lần.                              |
| `{n,}`  | n là một số nguyên không âm. Khớp ít nhất n lần.                                |
| `{n,m}` | m và n đều là số nguyên không âm, trong đó n <= m. Khớp ít nhất n lần và nhiều nhất m lần. |

【Ví dụ】Giới hạn số lần xuất hiện của ký tự

```java
// {n}: n là một số nguyên không âm. Khớp chính xác n lần.
checkMatches("ap{1}", "a");
checkMatches("ap{1}", "ap");
checkMatches("ap{1}", "app");
checkMatches("ap{1}", "apppppppppp");

// {n,}: n là một số nguyên không âm. Khớp ít nhất n lần.
checkMatches("ap{1,}", "a");
checkMatches("ap{1,}", "ap");
checkMatches("ap{1,}", "app");
checkMatches("ap{1,}", "apppppppppp");

// {n,m}: m và n đều là số nguyên không âm, trong đó n <= m. Khớp ít nhất n lần và nhiều nhất m lần.
checkMatches("ap{2,5}", "a");
checkMatches("ap{2,5}", "ap");
checkMatches("ap{2,5}", "app");
checkMatches("ap{2,5}", "apppppppppp");

// Kết quả
// a	không khớp: ap{1}
// ap	khớp: ap{1}
// app	không khớp: ap{1}
// apppppppppp	không khớp: ap{1}
// a	không khớp: ap{1,}
// ap	khớp: ap{1,}
// app	khớp: ap{1,}
// apppppppppp	khớp: ap{1,}
// a	không khớp: ap{2,5}
// ap	không khớp: ap{2,5}
// app	khớp: ap{2,5}
// apppppppppp	không khớp: ap{2,5}
```

#### Ký tự thoát ( `\` )

Nếu bạn muốn tìm ký tự đặc biệt chính nó, bạn cần sử dụng ký tự thoát để cho trình thông dịch biểu thức chính quy xem nó như một ký tự thông thường, không phải một ký tự đặc biệt.

```
Ký tự thoát của *: \*
Ký tự thoát của +: \+
Ký tự thoát của ?: \?
Ký tự thoát của ^: \^
Ký tự thoát của $: \$
Ký tự thoát của .: \.
```

Nếu bạn muốn tìm ký tự thoát `\` chính nó, bạn cần sử dụng `\\`.

#### Xác định chuỗi biểu thức chính quy bắt đầu (`^`) và kết thúc (`$`)

Nếu bạn muốn chuỗi khớp phải bắt đầu bằng một chuỗi cụ thể, bạn có thể sử dụng `^`.

> Lưu ý: Hãy chú ý rằng `^` ở đây phải được phân biệt với `^` trong `[^]`.

【Ví dụ】Giới hạn đầu chuỗi

```java
Assert.assertTrue(checkMatches("^app[a-z]{0,}", "apple")); // Chuỗi phải bắt đầu bằng app
Assert.assertFalse(checkMatches("^app[a-z]{0,}", "aplause"));

// Kết quả
// apple	khớp: ^app[a-z]{0,}
// aplause	không khớp: ^app[a-z]{0,}
```

Nếu bạn muốn chuỗi khớp phải kết thúc bằng một chuỗi cụ thể, bạn có thể sử dụng `$`.

【Ví dụ】Giới hạn cuối chuỗi

```java
Assert.assertTrue(checkMatches("[a-z]{0,}ing$", "playing")); // Chuỗi phải kết thúc bằng ing
Assert.assertFalse(checkMatches("[a-z]{0,}ing$", "long"));

// Kết quả
// playing	khớp: [a-z]{0,}ing$
// long	không khớp: [a-z]{0,}ing$
```

### Ký tự tương đương

Ký tự tương đương, như tên gọi, là một cách đơn giản hóa việc biểu thị các ký tự cơ bản (các ký tự tương đương này có thể được thay thế bằng các ký tự cơ bản).

Trước khi nắm vững các ký tự cơ bản, bạn có thể bỏ qua phần này, vì nó có thể làm bạn bối rối.

Lợi ích của ký tự tương đương là giúp đơn giản hóa cách viết các ký tự cơ bản.

#### Biểu thị các loại ký tự tương đương

Bảng dưới đây liệt kê các ký tự tương đương biểu thị một loại ký tự nào đó.

| Ký tự    | Mô tả                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------- |
| **`.`**  | Khớp với bất kỳ ký tự đơn nào, trừ ký tự xuống dòng (“\n”).                                         |
| **`\d`** | Khớp với một ký tự số. Tương đương với [0-9].                                                       |
| **`\D`** | Khớp với một ký tự không phải số. Tương đương với [^0-9].                                          |
| **`\w`** | Khớp với bất kỳ ký tự từ, bao gồm cả dấu gạch dưới. Tương tự nhưng không tương đương với “[A-Za-z0-9_]”. Ở đây, ký tự từ chỉ đề cập đến bộ ký tự Unicode. |
| **`\W`** | Khớp với bất kỳ ký tự không phải từ nào.                                                           |
| **`\s`** | Khớp với bất kỳ ký tự không hiển thị nào, bao gồm cả khoảng trắng, tab, trang mới và v.v. Tương đương với [ \f\n\r\t\v].                           |
| **`\S`** | Khớp với bất kỳ ký tự hiển thị nào. Tương đương với [ \f\n\r\t\v].                                 |

【Ví dụ】Cách sử dụng ký tự tương đương cơ bản

```java
// Khớp với bất kỳ ký tự đơn nào, trừ ký tự xuống dòng (“\n”)
Assert.assertTrue(checkMatches(".{1,}", "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_"));
Assert.assertTrue(checkMatches(".{1,}", "~!@#$%^&*()+`-=[]{};:<>,./?|\\"));
Assert.assertFalse(checkMatches(".", "\n"));
Assert.assertFalse(checkMatches("[^\n]", "\n"));

// Khớp với một ký tự số. Tương đương với [0-9]
Assert.assertTrue(checkMatches("\\d{1,}", "0123456789"));
// Khớp với một ký tự không phải số. Tương đương với [^0-9]
Assert.assertFalse(checkMatches("\\D{1,}", "0123456789"));

// Khớp với bất kỳ ký tự từ, bao gồm cả dấu gạch dưới. Tương tự nhưng không tương đương với “[A-Za-z0-9_]”. Ở đây, ký tự từ chỉ đề cập đến bộ ký tự Unicode
Assert.assertTrue(checkMatches("\\w{1,}", "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_"));
Assert.assertFalse(checkMatches("\\w{1,}", "~!@#$%^&*()+`-=[]{};:<>,./?|\\"));
// Khớp với bất kỳ ký tự không phải từ nào
Assert.assertFalse(checkMatches("\\W{1,}", "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_"));
Assert.assertTrue(checkMatches("\\W{1,}", "~!@#$%^&*()+`-=[]{};:<>,./?|\\"));

// Khớp với bất kỳ ký tự không hiển thị nào, bao gồm cả khoảng trắng, tab, trang mới và v.v. Tương đương với [ \f\n\r\t\v]
Assert.assertTrue(checkMatches("\\s{1,}", " \f\r\n\t"));
// Khớp với bất kỳ ký tự hiển thị nào. Tương đương với [^ \f\n\r\t\v]
Assert.assertFalse(checkMatches("\\S{1,}", " \f\r\n\t"));

// Output
// ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_	matches： .{1,}
// ~!@#$%^&*()+`-=[]{};:<>,./?|\\	matches： .{1,}
// \n	not matches： .
// \n	not matches： [^\n]
// 0123456789	matches： \\d{1,}
// 0123456789	not matches： \\D{1,}
// ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_	matches： \\w{1,}
// ~!@#$%^&*()+`-=[]{};:<>,./?|\\	not matches： \\w{1,}
// ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_	not matches： \\W{1,}
// ~!@#$%^&*()+`-=[]{};:<>,./?|\\	matches： \\W{1,}
// \f\r\n\t	matches： \\s{1,}
// \f\r\n\t	not matches： \\S{1,}
```

#### Ký tự tương đương giới hạn số lượng ký tự

Trong phần cơ bản về ký tự, chúng ta đã tìm hiểu về ký tự giới hạn số lượng - `{}`.

Ngoài ra, còn có 3 ký tự tương đương là `*`, `+`, `?` được tạo ra để đơn giản hóa cách viết, chúng ta hãy tìm hiểu.

| Ký tự | Mô tả                                                            |
| ----- | --------------------------------------------------------------- |
| `*`   | Khớp với biểu thức con trước nó 0 lần hoặc nhiều lần. Tương đương với {0,}.   |
| `+`   | Khớp với biểu thức con trước nó 1 lần hoặc nhiều lần. Tương đương với {1,}.   |
| `?`   | Khớp với biểu thức con trước nó 0 lần hoặc 1 lần. Tương đương với {0,1}. |

**Ví dụ** Ký tự tương đương giới hạn số lượng

```java
// *: Khớp với biểu thức con trước nó 0 lần hoặc nhiều lần. * tương đương với {0,}.
checkMatches("ap*", "a");
checkMatches("ap*", "ap");
checkMatches("ap*", "app");
checkMatches("ap*", "apppppppppp");

// +: Khớp với biểu thức con trước nó 1 lần hoặc nhiều lần. + tương đương với {1,}.
checkMatches("ap+", "a");
checkMatches("ap+", "ap");
checkMatches("ap+", "app");
checkMatches("ap+", "apppppppppp");

// ?: Khớp với biểu thức con trước nó 0 lần hoặc 1 lần. ? tương đương với {0,1}.
checkMatches("ap?", "a");
checkMatches("ap?", "ap");
checkMatches("ap?", "app");
checkMatches("ap?", "apppppppppp");

// Output
// a	matches： ap*
// ap	matches： ap*
// app	matches： ap*
// apppppppppp	matches： ap*
// a	not matches： ap+
// ap	matches： ap+
// app	matches： ap+
// apppppppppp	matches： ap+
// a	matches： ap?
// ap	matches： ap?
// app	not matches： ap?
// apppppppppp	not matches： ap?
```

#### Thứ tự ưu tiên của ký tự

Biểu thức chính quy được tính toán từ trái sang phải và tuân theo thứ tự ưu tiên, tương tự như biểu thức số học.

Bảng dưới đây mô tả thứ tự ưu tiên của các toán tử biểu thức chính quy từ cao nhất đến thấp nhất:

| Toán tử                               | Mô tả         |
| ------------------------------------- | ------------ |
| `\`                                   | Ký tự thoát   |
| `()`、`(?:)`、`(?=)`、`[]`            | Dấu ngoặc và dấu ngoặc vuông |
| `*`、`+`、`?`、`{n}`、`{n,}`、`{n,m}` | Ký tự giới hạn |
| `^`、`$`、`*bất kỳ ký tự*`、`bất kỳ ký tự*`    | Điểm đặt và chuỗi |
| `|`                                   | Thay thế         |

Ký tự có độ ưu tiên cao hơn toán tử thay thế, cho phép `m|food` khớp với `m` hoặc `food`. Để khớp với `mood` hoặc `food`, hãy sử dụng dấu ngoặc để tạo ra biểu thức con, ví dụ `(m|f)ood`.

## Cấu trúc nhóm

Trong phần cơ bản về ký tự, đã đề cập đến ký tự `()` để nhóm các biểu thức. Trên thực tế, nhóm còn có nhiều ứng dụng phức tạp hơn.

Nhóm xây dựng là cách mô tả các biểu thức con trong biểu thức chính quy, được sử dụng để bắt các chuỗi con trong chuỗi đầu vào.

### Bắt và không bắt

Bảng dưới đây phân loại các nhóm xây dựng thành nhóm bắt và không bắt.

| Biểu thức         | Mô tả                 | Bắt hay không bắt |
| ---------------- | -------------------- | ---------------- |
| `(exp)`          | Nhóm con khớp        | Bắt              |
| `(?<name>exp)`   | Tham chiếu ngược có tên | Bắt              |
| `(?:exp)`        | Nhóm không bắt        | Không bắt        |
| `(?=exp)`        | Kiểm tra xem có phía trước không | Không bắt        |
| `(?!exp)`        | Kiểm tra xem không có phía trước | Không bắt        |
| `(?<=exp)`       | Kiểm tra xem có phía sau không | Không bắt        |
| `(?<!exp)`       | Kiểm tra xem không có phía sau | Không bắt        |

> Lưu ý: Java không hỗ trợ nhóm cân bằng.

### Tham chiếu ngược

##### Tham chiếu ngược có số thứ tự

Tham chiếu ngược có số thứ tự được sử dụng với cú pháp sau: `\number`

Trong đó *number* là vị trí số thứ tự của nhóm bắt trong biểu thức chính quy. Ví dụ, \4 sẽ khớp với nội dung của nhóm bắt thứ tư. Nếu không có *number* được xác định trong biểu thức chính quy, sẽ xảy ra lỗi phân tích.

**【Ví dụ】Khớp với các từ lặp lại và từ đứng ngay sau mỗi từ lặp lại (nhóm con không được đặt tên)**

```java
// (\w+)\s\1\W(\w+) khớp với các từ lặp lại và từ đứng ngay sau mỗi từ lặp lại
Assert.assertTrue(findAll("(\\w+)\\s\\1\\W(\\w+)",
		"He said that that was the the correct answer.") > 0);

// Output
// regex = (\w+)\s\1\W(\w+), content: He said that that was the the correct answer.
// [1th] start: 8, end: 21, group: that that was
// [2th] start: 22, end: 37, group: the the correct
```

Giải thích:

- `(\w+)`: Khớp với một hoặc nhiều ký tự từ.
- `\s`: Khớp với ký tự khoảng trắng.
- `\1`: Khớp với nhóm thứ nhất, tức là (\w+).
- `\W`: Khớp với một ký tự không phải từ, bao gồm cả khoảng trắng và dấu câu. Điều này ngăn chặn mẫu biểu thức chính quy khớp với từ bắt đầu từ nhóm bắt thứ nhất.

#### Tham chiếu ngược có tên

Tham chiếu ngược có tên được xác định bằng cú pháp sau: `\k<name>`

**【Ví dụ】Khớp với các từ lặp lại và từ đứng ngay sau mỗi từ lặp lại (nhóm con được đặt tên)**

```java
// (?<duplicateWord>\w+)\s\k<duplicateWord>\W(?<nextWord>\w+) khớp với các từ lặp lại và từ đứng ngay sau mỗi từ lặp lại
Assert.assertTrue(findAll("(?<duplicateWord>\\w+)\\s\\k<duplicateWord>\\W(?<nextWord>\\w+)",
		"He said that that was the the correct answer.") > 0);

// Output
// regex = (?<duplicateWord>\w+)\s\k<duplicateWord>\W(?<nextWord>\w+), content: He said that that was the the correct answer.
// [1th] start: 8, end: 21, group: that that was
// [2th] start: 22, end: 37, group: the the correct
```

Giải thích:

- `(?<duplicateWord>\w+)`: Khớp với một hoặc nhiều ký tự từ. Đặt tên nhóm bắt này là duplicateWord.
- `\s`: Khớp với ký tự khoảng trắng.
- `\k<duplicateWord>`: Khớp với nhóm bắt có tên là duplicateWord.
- `\W`: Khớp với một ký tự không phải từ, bao gồm cả khoảng trắng và dấu câu. Điều này ngăn chặn mẫu biểu thức chính quy khớp với từ bắt đầu từ nhóm bắt thứ nhất.
- `(?<nextWord>\w+)`: Khớp với một hoặc nhiều ký tự từ. Đặt tên nhóm bắt này là nextWord.

### Nhóm không bắt

`(?:exp)` được sử dụng khi một quantifier được áp dụng cho một nhóm, nhưng không muốn nhóm bắt các chuỗi con khớp. Thay vào đó, nhóm không bắt được sử dụng.

**【Ví dụ】Khớp với các câu kết thúc bằng dấu chấm**

```java
// Khớp với các câu kết thúc bằng dấu chấm.
Assert.assertTrue(findAll("(?:\\b(?:\\w+)\\W*)+\\.", "This is a short sentence. Never end") > 0);

// Output
// regex = (?:\b(?:\w+)\W*)+\., content: This is a short sentence. Never end
// [1th] start: 0, end: 25, group: This is a short sentence.
```

### Khẳng định và phủ định độ dài không

Khẳng định và phủ định độ dài không được sử dụng để tìm kiếm những thứ xuất hiện trước hoặc sau một nội dung nhất định mà không bao gồm nội dung đó trong kết quả khớp. Chúng cũng được gọi là các khẳng định và phủ định độ dài không.

| Biểu thức     | Mô tả                             |
| ------------ | -------------------------------- |
| `(?=exp)`    | Khớp với vị trí trước exp         |
| `(?<=exp)`   | Khớp với vị trí sau exp           |
| `(?!exp)`    | Khớp với vị trí không phải exp    |
| `(?<!exp)`   | Khớp với vị trí không sau exp     |

#### Khớp với vị trí trước exp

`(?=exp)` đại diện cho chuỗi đầu vào phải khớp với mẫu biểu thức chính quy *con* trong chuỗi trước nó, mặc dù chuỗi khớp không được bao gồm trong kết quả khớp.

```java
// \b\w+(?=\sis\b) đại diện cho việc bắt từ trước "is"
Assert.assertTrue(findAll("\\b\\w+(?=\\sis\\b)", "The dog is a Malamute.") > 0);
Assert.assertFalse(findAll("\\b\\w+(?=\\sis\\b)", "The island has beautiful birds.") > 0);
Assert.assertFalse(findAll("\\b\\w+(?=\\sis\\b)", "The pitch missed home plate.") > 0);
Assert.assertTrue(findAll("\\b\\w+(?=\\sis\\b)", "Sunday is a weekend day.") > 0);

// Output
// regex = \b\w+(?=\sis\b), content: The dog is a Malamute.
// [1th] start: 4, end: 7, group: dog
// regex = \b\w+(?=\sis\b), content: The island has beautiful birds.
// not found
// regex = \b\w+(?=\sis\b), content: The pitch missed home plate.
// not found
// regex = \b\w+(?=\sis\b), content: Sunday is a weekend day.
// [1th] start: 0, end: 6, group: Sunday
```

Giải thích:

- `\b`: Bắt đầu khớp tại ranh giới từ.
- `\w+`: Khớp với một hoặc nhiều ký tự từ.
- `(?=\sis\b)`: Xác định xem ký tự từ tiếp theo có phải là một khoảng trắng và chuỗi "is" kết thúc từ. Nếu đúng, khớp thành công.

#### Khớp với vị trí sau exp

`(?<=exp)` đại diện cho chuỗi đầu vào phải khớp với mẫu biểu thức chính quy *con* trong chuỗi sau nó, mặc dù chuỗi khớp không được bao gồm trong kết quả khớp. Khẳng định sau không thể quay lại.

```java
// (?<=\b20)\d{2}\b đại diện cho việc bắt phần sau của số bắt đầu bằng 20
Assert.assertTrue(findAll("(?<=\\b20)\\d{2}\\b", "2010 1999 1861 2140 2009") > 0);

// Output
// regex = (?<=\b20)\d{2}\b, content: 2010 1999 1861 2140 2009
// [1th] start: 2, end: 4, group: 10
// [2th] start: 22, end: 24, group: 09
```

Giải thích:

- `\d{2}`: Khớp với hai chữ số thập phân.
- `(?<=\b20)`: Nếu hai chữ số thập phân bắt đầu bằng "20", tiếp tục khớp.
- `\b`: Kết thúc khớp tại ranh giới từ.

#### Khớp với vị trí không phải exp

`(?!exp)` đại diện cho chuỗi đầu vào không được khớp với mẫu biểu thức chính quy *con* trong chuỗi sau nó, mặc dù chuỗi không khớp không được bao gồm trong kết quả khớp.

【Ví dụ】Bắt các từ không bắt đầu bằng "un"

```java
// \b(?!un)\w+\b bắt các từ không bắt đầu bằng "un"
Assert.assertTrue(findAll("\\b(?!un)\\w+\\b", "unite one unethical ethics use untie ultimate") > 0);

// Output
// regex = \b(?!un)\w+\b, content: unite one unethical ethics use untie ultimate
// [1th] start: 6, end: 9, group: one
// [2th] start: 20, end: 26, group: ethics
// [3th] start: 27, end: 30, group: use
// [4th] start: 37, end: 45, group: ultimate
```

Giải thích:

- `\b`: Bắt đầu khớp tại ranh giới từ.
- `(?!un)`: Xác định xem hai ký tự tiếp theo không phải là "un". Nếu đúng, khớp thành công.
- `\w+`: Khớp với một hoặc nhiều ký tự từ.
- `\b`: Kết thúc khớp tại ranh giới từ.

#### Khớp với vị trí không sau exp

`(?<!exp)` đại diện cho chuỗi đầu vào không được khớp với mẫu biểu thức chính quy *con* trong chuỗi trước nó, mặc dù chuỗi không khớp không được bao gồm trong kết quả khớp.

【Ví dụ】Bắt các ngày làm việc bất kỳ

```java
// (?<!(Saturday|Sunday) )\b\w+ \d{1,2}, \d{4}\b bắt các ngày làm việc (tức là từ thứ hai đến thứ sáu)
Assert.assertTrue(findAll("(?<!(Saturday|Sunday) )\\b\\w+ \\d{1,2}, \\d{4}\\b", "Monday February 1, 2010") > 0);
Assert.assertTrue(findAll("(?<!(Saturday|Sunday) )\\b\\w+ \\d{1,2}, \\d{4}\\b", "Wednesday February 3, 2010") > 0);
Assert.assertFalse(findAll("(?<!(Saturday|Sunday) )\\b\\w+ \\d{1,2}, \\d{4}\\b", "Saturday February 6, 2010") > 0);
Assert.assertFalse(findAll("(?<!(Saturday|Sunday) )\\b\\w+ \\d{1,2}, \\d{4}\\b", "Sunday February 7, 2010") > 0);
Assert.assertTrue(findAll("(?<!(Saturday|Sunday) )\\b\\w+ \\d{1,2}, \\d{4}\\b", "Monday, February 8, 2010") > 0);

// Output
// regex = (?<!(Saturday|Sunday) )\b\w+ \d{1,2}, \d{4}\b, content: Monday February 1, 2010
// [1th] start: 7, end: 23, group: February 1, 2010
// regex = (?<!(Saturday|Sunday) )\b\w+ \d{1,2}, \d{4}\b, content: Wednesday February 3, 2010
// [1th] start: 10, end: 26, group: February 3, 2010
// regex = (?<!(Saturday|Sunday) )\b\w+ \d{1,2}, \d{4}\b, content: Saturday February 6, 2010
// not found
// regex = (?<!(Saturday|Sunday) )\b\w+ \d{1,2}, \d{4}\b, content: Sunday February 7, 2010
// not found
// regex = (?<!(Saturday|Sunday) )\b\w+ \d{1,2}, \d{4}\b, content: Monday, February 8, 2010
// [1th] start: 8, end: 24, group: February 8, 2010
```

### Tham lam và sự lười biếng

Khi một biểu thức chính quy chứa một quantifier có thể lặp lại, hành vi thông thường là khớp với **càng nhiều ký tự càng tốt** (miễn là biểu thức chính quy vẫn khớp với chuỗi đầu vào). Ví dụ, với biểu thức a.\*b, nó sẽ khớp với chuỗi dài nhất bắt đầu bằng a và kết thúc bằng b. Nếu áp dụng nó để tìm kiếm trong chuỗi aabab, nó sẽ khớp với toàn bộ chuỗi aabab. Điều này được gọi là khớp tham lam.

Đôi khi, chúng ta cần khớp **ít ký tự càng tốt**. Các quantifier trước đó có thể được chuyển thành chế độ khớp ít ký tự nhất bằng cách thêm một dấu chấm hỏi ? vào sau nó. Ví dụ, .\*? có nghĩa là khớp với bất kỳ số lần lặp lại nào, nhưng sử dụng ít ký tự nhất để đảm bảo khớp thành công.

| Biểu thức   | Mô tả                                   |
| ---------- | -------------------------------------- |
| `*?`       | Lặp lại bất kỳ số lần, nhưng sử dụng ít ký tự nhất |
| `+?`       | Lặp lại 1 lần trở lên, nhưng sử dụng ít ký tự nhất |
| `??`       | Lặp lại 0 hoặc 1 lần, nhưng sử dụng ít ký tự nhất |
| `{n,m}?`   | Lặp lại từ n đến m lần, nhưng sử dụng ít ký tự nhất |
| `{n,}?`    | Lặp lại từ n lần trở lên, nhưng sử dụng ít ký tự nhất |

【Ví dụ】Ví dụ về sự tham lam và sự lười biếng trong Java Regex

```java
// Khớp tham lam
Assert.assertTrue(findAll("a\\w*b", "abaabaaabaaaab") > 0);

// Khớp lười biếng
Assert.assertTrue(findAll("a\\w*?b", "abaabaaabaaaab") > 0);
Assert.assertTrue(findAll("a\\w+?b", "abaabaaabaaaab") > 0);
Assert.assertTrue(findAll("a\\w??b", "abaabaaabaaaab") > 0);
Assert.assertTrue(findAll("a\\w{0,4}?b", "abaabaaabaaaab") > 0);
Assert.assertTrue(findAll("a\\w{3,}?b", "abaabaaabaaaab") > 0);

// Output
// regex = a\w*b, content: abaabaaabaaaab
// [1th] start: 0, end: 14, group: abaabaaabaaaab
// regex = a\w*?b, content: abaabaaabaaaab
// [1th] start: 0, end: 2, group: ab
// [2th] start: 2, end: 5, group: aab
// [3th] start: 5, end: 9, group: aaab
// [4th] start: 9, end: 14, group: aaaab
// regex = a\w+?b, content: abaabaaabaaaab
// [1th] start: 0, end: 5, group: abaab
// [2th] start: 5, end: 9, group: aaab
// [3th] start: 9, end: 14, group: aaaab
// regex = a\w??b, content: abaabaaabaaaab
// [1th] start: 0, end: 2, group: ab
// [2th] start: 2, end: 5, group: aab
// [3th] start: 6, end: 9, group: aab
// [4th] start: 11, end: 14, group: aab
// regex = a\w{0,4}?b, content: abaabaaabaaaab
// [1th] start: 0, end: 2, group: ab
// [2th] start: 2, end: 5, group: aab
// [3th] start: 5, end: 9, group: aaab
// [4th] start: 9, end: 14, group: aaaab
// regex = a\w{3,}?b, content: abaabaaabaaaab
// [1th] start: 0, end: 5, group: abaab
// [2th] start: 5, end: 14, group: aaabaaaab
```

Giải thích:

Trong ví dụ này, chúng ta sử dụng các chiến lược tham lam và lười biếng khác nhau để tìm kiếm tất cả các chuỗi con khớp với **bắt đầu bằng a và kết thúc bằng b** trong chuỗi `abaabaaabaaaab`. Vui lòng xem kết quả đầu ra để hiểu ảnh hưởng của việc sử dụng các chiến lược tham lam và lười biếng khác nhau đối với việc khớp các chuỗi con.

### Phụ lục về Biểu thức chính quy

### Cách khớp chuỗi với biểu thức chính quy

Do nhiều ký tự đặc biệt trong biểu thức chính quy cũng là ký tự thoát trong quy tắc chuỗi Java, chúng sẽ không được hiển thị trong chuỗi Java.

Để giải quyết vấn đề này, bạn có thể sử dụng lớp công cụ `org.apache.commons.lang3.StringEscapeUtils` để xử lý đặc biệt các ký tự thoát để chúng có thể được in ra. Các phương thức tĩnh được cung cấp bởi lớp công cụ này có thể được đoán ra cách sử dụng từ tên phương thức, tôi sẽ không giải thích thêm ở đây.

Nếu bạn đã biết về maven, bạn có thể thêm phụ thuộc trực tiếp vào dự án của mình

```xml
<dependency>
  <groupId>org.apache.commons</groupId>
  <artifactId>commons-lang3</artifactId>
  <version>${commons-lang3.version}</version>
</dependency>
```

【Ví dụ】Trong bài viết này, tôi sử dụng các phương thức để hiển thị các quy tắc khớp chuỗi

```java
private boolean checkMatches(String regex, String content) {
	Pattern p = Pattern.compile(regex);
	Matcher m = p.matcher(content);
	boolean flag = m.matches();
	if (m.matches()) {
		System.out.println(StringEscapeUtils.escapeJava(content) + "\tkhớp với: " + StringEscapeUtils.escapeJava(regex));
	} else {
		System.out.println(StringEscapeUtils.escapeJava(content) + "\tkhông khớp với: " + StringEscapeUtils.escapeJava(regex));
	}
	return flag;
}

public int findAll(String regex, String content) {
	Pattern p = Pattern.compile(regex);
	Matcher m = p.matcher(content);
	System.out.println("regex = " + regex + ", content: " + content);

	int count = 0;
	while (m.find()) {
		count++;
		System.out.println("[" + count + "th] " + "bắt đầu: " + m.start() + ", kết thúc: " + m.end()
				+ ", nhóm: " + m.group());
	}
	if (0 == count) {
		System.out.println("không tìm thấy");
	}
	return count;
}
```

### Từ điển ký tự đặc biệt

Để dễ dàng tra cứu ý nghĩa của các ký tự đặc biệt trong biểu thức chính quy, trong phần này tôi sẽ liệt kê các ký tự đặc biệt của biểu thức chính quy theo chức năng của chúng.

#### Các ký tự hạn chế

| Ký tự | Mô tả                                                                                                                                                                     |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `*`    | Khớp với biểu thức con trước nó 0 hoặc nhiều lần. Ví dụ, zo* có thể khớp với "z" hoặc "zoo". * tương đương với {0,}.                                                         |
| `+`    | Khớp với biểu thức con trước nó 1 hoặc nhiều lần. Ví dụ, 'zo+' có thể khớp với "zo" hoặc "zoo", nhưng không khớp với "z". + tương đương với {1,}.                              |
| `?`    | Khớp với biểu thức con trước nó 0 hoặc 1 lần. Ví dụ, "do(es)?" có thể khớp với "do" hoặc "does" trong "do". ? tương đương với {0,1}.                                            |
| `{n}`  | n là một số nguyên không âm. Khớp chính xác n lần. Ví dụ, 'o{2}' không khớp với 'o' trong "Bob", nhưng khớp với hai o trong "food".                                           |
| `{n,}` | n là một số nguyên không âm. Khớp ít nhất n lần. Ví dụ, 'o{2,}' không khớp với 'o' trong "Bob", nhưng khớp với tất cả các o trong "foooood". 'o{1,}' tương đương với 'o+'. 'o{0,}' tương đương với 'o*'. |
| `{n,m}` | m và n đều là số nguyên không âm, trong đó n <= m. Khớp ít nhất n lần và tối đa m lần. Ví dụ, "o{1,3}" sẽ khớp với ba o đầu tiên trong "fooooood". 'o{0,1}' tương đương với 'o?'. Lưu ý không có khoảng trống giữa dấu phẩy và hai số. |

#### Ký tự vị trí

| Ký tự | Mô tả                                                                                                                                                                                                 |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `^`    | Khớp với vị trí bắt đầu của chuỗi nhập. Nếu thuộc tính Multiline của đối tượng RegExp được đặt, ^ cũng sẽ khớp với vị trí sau \n hoặc \r.                                                             |
| `$`    | Khớp với vị trí kết thúc của chuỗi nhập. Nếu thuộc tính Multiline của đối tượng RegExp được đặt, $ cũng sẽ khớp với vị trí trước \n hoặc \r.                                                            |
| `\b`   | Khớp với ranh giới từ, tức là vị trí giữa từ và khoảng trắng.                                                                                                                                        |
| `\B`   | Khớp với vị trí không phải là ranh giới từ.                                                                                                                                                           |

#### Ký tự không in

| Ký tự  | Mô tả                                                                                                                                                                                                                                                                   |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `\cx`  | Khớp với ký tự điều khiển được chỉ định bởi x. Ví dụ, \cM khớp với một Control-M hoặc ký tự CR. Giá trị của x phải là một trong các ký tự A-Z hoặc a-z. Nếu không, c sẽ được coi là một ký tự 'c' thông thường. |
| `\f`   | Khớp với ký tự xuống dòng. Tương đương với \x0c và \cL.                                                                                                                                                   |
| `\n`   | Khớp với ký tự xuống dòng. Tương đương với \x0a và \cJ.                                                                                                                                                   |
| `\r`   | Khớp với ký tự carriage return. Tương đương với \x0d và \cM.                                                                                                                                              |
| `\s`   | Khớp với bất kỳ ký tự trắng nào, bao gồm cả dấu cách, tab, xuống dòng, v.v. Tương đương với [ \f\n\r\t\v].                                                                                                 |
| `\S`   | Khớp với bất kỳ ký tự không phải trắng nào. Tương đương với [ \f\n\r\t\v].                                                                                                                               |
| `\t`   | Khớp với ký tự tab. Tương đương với \x09 và \cI.                                                                                                                                                         |
| `\v`   | Khớp với ký tự tab dọc. Tương đương với \x0b và \cK.                                                                                                                                                      |

#### Nhóm

| Biểu thức| Mô tả |
| --- | --- |
| `(exp)`            | Khớp với biểu thức con. Nội dung trong () được coi là biểu thức con.|
| `(?<name>exp)`     | Biểu thức con được đặt tên (tham chiếu ngược).|
| `(?:exp)`          | Nhóm không ghi nhớ, thường được sử dụng khi một hạn chế được áp dụng vào một nhóm, nhưng không cần ghi nhớ chuỗi con khớp.                                                                                                                 |
| `(?=exp)`          | Khớp với vị trí trước exp.|
| `(?<=exp)`         | Khớp với vị trí sau exp.|
| `(?!exp)`          | Khớp với vị trí sau không phải là exp.|
| `(?<!exp)`         | Khớp với vị trí trước không phải là exp.|

#### Ký tự đặc biệt

| Ký tự| Mô tả|
| --- | --- |
| `\` | Đánh dấu ký tự tiếp theo là ký tự đặc biệt, ký tự bình thường, tham chiếu ngược hoặc ký tự thoát bát phân. Ví dụ, 'n' khớp với ký tự 'n'. '\n' khớp với ký tự xuống dòng. Dãy '\\' khớp với "\". |
| `\|` | Chỉ định một lựa chọn giữa hai mục. |
| `[]` | Khớp với bất kỳ ký tự nào trong dấu ngoặc vuông. Ví dụ, [xyz], ,[^xyz] [a-z], [^a-z], [x,y,z]|

## Thực hành với biểu thức chính quy

Dù cho chuỗi biểu thức chính quy đã được trình bày rất chi tiết trong loạt bài này, tôi vẫn muốn khuyên bạn rằng, nếu một biểu thức chính quy chưa được kiểm tra kỹ lưỡng, hãy sử dụng nó cẩn thận.

Biểu thức chính quy là một con dao hai lưỡi, nó có thể giúp bạn tiết kiệm rất nhiều dòng mã. Tuy nhiên, do khó đọc, việc bảo trì nó có thể gây đau đầu (bạn cần phải hiểu từng ký tự một).

### Biểu thức chính quy hữu ích nhất

#### Kiểm tra mã màu Hex

Mã màu hex rất phố biến trong lĩnh vực phát triển web. Đoạn regex này có thể được sử dụng để lấy mã hex phù hợp từ chuỗi bất kỳ cho bất cứ mục đích nào.

```
\#([a-fA-F]|[0-9]){3, 6}
```

- **Khớp: `#FFFFFF`, `#FFF`, `#FAFAFA`
- **Không khớp: `#GG` `#FF`

#### Kiểm tra tên người dùng và mật khẩu hợp lệ

**Mô tả:** Độ dài từ 6-18 ký tự, cho phép nhập chữ cái, số, dấu gạch dưới, ký tự đầu tiên phải là chữ cái.

```
^[a-zA-Z]\w{5,17}$
```

- **Khớp:** he_llo@worl.d.com | hel.l-o@wor-ld.museum | h1ello@123.com
- **Không khớp:** hello@worl_d.com | he&llo@world.co1 | .hello@wor#.co.uk

#### Kiểm tra địa chỉ email

**Mô tả:** Không cho phép sử dụng địa chỉ IP làm tên miền, ví dụ: hello@154.145.68.12

Tên người dùng trước ký tự `@` và tên miền (domain) trước dấu chấm `.` phải đáp ứng các điều kiện sau:

- Chỉ chứa chữ cái, số, gạch dưới `_`, dấu chấm `.` và dấu gạch ngang `-` ;
- Ký tự đầu tiên phải là chữ cái hoặc số;
- `_`, `.`, `-` không được xuất hiện liên tiếp.

Tên miền gốc chỉ có thể là chữ cái và ít nhất hai ký tự.

```
^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$
```

- **Khớp:** he_llo@worl.d.com | hel.l-o@wor-ld.museum | h1ello@123.com
- **Không khớp:** hello@worl_d.com | he&llo@world.co1 | .hello@wor#.co.uk

#### Kiểm tra URL

**Mô tả:** Kiểm tra URL. Hỗ trợ http, https, ftp, ftps.

```
^(ht|f)(tp|tps)\://[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,3})?(/\S*)?$
```

- **Khớp:** http://google.com/help/me | http://www.google.com/help/me/ | https://www.google.com/help.asp | ftp://www.google.com | ftps://google.org
- **Không khớp:** http://un/www.google.com/index.asp

#### Kiểm tra thời gian

**Mô tả:** Kiểm tra thời gian. Giờ, phút, giây phải là số hợp lệ, nếu giá trị không phải là hai chữ số, chữ số hàng chục phải được thêm số 0.

```
^([0-1][0-9]|[2][0-3]):([0-5][0-9])$
```

- **Khớp:** 00:00:00 | 23:59:59 | 17:06:30
- **Không khớp:** 17:6:30 | 24:16:30

#### Kiểm tra ngày tháng

**Mô tả:** Kiểm tra ngày tháng. Ngày tháng phải đáp ứng các điều kiện sau:

- Định dạng yyyy-MM-dd hoặc yyyy-M-d
- Dấu gạch ngang có thể có hoặc là một trong các ký tự “-”, “/”, “.”
- Tháng 2 trong năm nhuận có thể có 29 ngày; trong khi năm không nhuận không thể.

```
^(?:(?!0000)[0-9]{4}([-/.]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|[12]\d|3[01])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-/.]?)0?2\2(?:29))$
```

- **Khớp:** 2016/1/1 | 2016/01/01 | 20160101 | 2016-01-01 | 2016.01.01 | 2000-02-29
- **Không khớp:** 2001-02-29 | 2016/12/32 | 2016/6/31 | 2016/13/1 | 2016/0/1

#### Kiểm tra địa chỉ IPv4

**Mô tả:** Địa chỉ IP là một số nhị phân 32 bit, thường được chia thành 4 nhóm "8 bit nhị phân" (tức là 4 byte). Địa chỉ IP thường được biểu diễn dưới dạng "địa chỉ thập phân chia thành các nhóm" (a.b.c.d), trong đó, a, b, c, d đều là các số nguyên thập phân từ 0 đến 255.

```
^([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])$
```

- **Khớp:** 0.0.0.0 | 255.255.255.255 | 127.0.0.1
- **Không khớp:** 10.10.10 | 10.10.10.256

#### Kiểm tra địa chỉ IPv6

**Mô tả:** Địa chỉ IPv6 có 128 bit và thường được viết dưới dạng 8 nhóm, mỗi nhóm là bốn số thập lục phân.

Địa chỉ IPv6 có thể được biểu diễn dưới các dạng sau:

- Địa chỉ IPv6
- Địa chỉ IPv6 nén không gian không (phần [2.2 của rfc5952](https://tools.ietf.org/html/rfc5952#section-2.2))
- Địa chỉ IPv6 có chỉ mục khu vực liên kết cục bộ ([phần 11 của rfc4007](https://tools.ietf.org/html/rfc4007#section-11))
- Địa chỉ IPv6 nhúng IPv4 ([phần 2 của rfc6052](https://tools.ietf.org/html/rfc6052#section-2))
- Địa chỉ IPv6 ánh xạ IPv4 ([phần 2.1 của rfc2765](https://tools.ietf.org/html/rfc2765#section-2.1))
- Địa chỉ IPv6 dịch IPv4 ([phần 2.1 của rfc2765](https://tools.ietf.org/html/rfc2765#section-2.1))

> Rõ ràng, cách biểu diễn địa chỉ IPv6 rất phức tạp. Bạn cũng có thể tham khảo:
>
> [**Câu trả lời được bình chọn cao nhất về biểu thức chính quy IPv6 trên Stack overflow**](http://stackoverflow.com/questions/53497/regular-expression-that-matches-valid-ipv6-addresses)

```
(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))
```

- **Khớp:** 1:2:3:4:5:6:7:8 | 1:: | 1::8 | 1::6:7:8 | 1::5:6:7:8 | 1::4:5:6:7:8 | 1::3:4:5:6:7:8 | ::2:3:4:5:6:7:8 | 1:2:3:4:5:6:7:: | 1:2:3:4:5:6::8 | 1:2:3:4:5::8 | 1:2:3:4::8 | 1:2:3::8 | 1:2::8 | 1::8 | ::8 | fe80::7:8%1 | ::255.255.255.255 | 2001:db8:3:4::192.0.2.33 | 64:ff9b::192.0.2.33
- **Không khớp:** 1.2.3.4.5.6.7.8 | 1::2::3

### Ký tự cụ thể

- Khớp với chuỗi có độ dài 3: `^.{3}$`.
- Khớp với chuỗi gồm 26 chữ cái tiếng Anh: `^[A-Za-z]+$`.
- Khớp với chuỗi gồm 26 chữ cái tiếng Anh in hoa: `^[A-Z]+$`.
- Khớp với chuỗi gồm 26 chữ cái tiếng Anh thường: `^[a-z]+$`.
- Khớp với chuỗi gồm chữ số và 26 chữ cái tiếng Anh: `^[A-Za-z0-9]+$`.
- Khớp với chuỗi gồm chữ số, 26 chữ cái tiếng Anh hoặc dấu gạch dưới: `^\w+$`.

### Số cụ thể

- Khớp với số nguyên dương: `^[1-9]\d*$`.
- Khớp với số nguyên âm: `^-[1-9]\d*$`.
- Khớp với số nguyên: `^(-?[1-9]\d*)|0$`.
- Khớp với số thập phân dương: `^[1-9]\d*\.\d+|0\.\d+$`.
- Khớp với số thập phân âm: `^-([1-9]\d*\.\d*|0\.\d*[1-9]\d*)$`.
- Khớp với số thập phân: `^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$`.

### Hiệu suất của biểu thức chính quy

Hiện nay, có hai cách để triển khai một công cụ động lực biểu thức chính quy: Máy tự động DFA (Deterministic Final Automata) và Máy tự động NFA (Non-deterministic Finite Automaton). So sánh hai phương pháp này, việc xây dựng máy tự động DFA tốn nhiều công sức hơn máy tự động NFA, nhưng hiệu suất thực thi của máy tự động DFA cao hơn máy tự động NFA.

Giả sử độ dài của một chuỗi là n, nếu sử dụng máy tự động DFA làm công cụ biểu thức chính quy, thì độ phức tạp thời gian của quá trình khớp là O(n); nếu sử dụng máy tự động NFA làm công cụ biểu thức chính quy, vì máy tự động NFA có nhiều nhánh và quay lui trong quá trình khớp, giả sử số trạng thái của NFA là s, thì độ phức tạp thời gian của thuật toán khớp là O(ns).

Ưu điểm của máy tự động NFA là hỗ trợ nhiều tính năng hơn. Ví dụ, bắt nhóm, nhìn xung quanh, lượng từ ưu tiên, v.v. Các tính năng này đều dựa trên việc khớp các biểu thức con độc lập, do đó các thư viện biểu thức chính quy được sử dụng trong ngôn ngữ lập trình đều được triển khai dựa trên máy tự động NFA.

### Quay lui trong máy tự động NFA

Sử dụng máy tự động NFA để triển khai biểu thức chính quy phức tạp, trong quá trình khớp thường gây ra vấn đề quay lui. Việc quay lui nhiều lần sẽ tốn thời gian CPU trong thời gian dài, gây ra tải nặng cho hệ thống.

```
text = "abbc"
regex = "ab{1,3}c"
```

Ví dụ này mục tiêu khớp là: khớp với chuỗi bắt đầu bằng a, kết thúc bằng c và có 1-3 ký tự b ở giữa. Quá trình phân tích cú pháp của máy tự động NFA như sau:

- Đọc ký tự khớp đầu tiên a trong biểu thức chính quy và ký tự đầu tiên a trong chuỗi, so sánh, khớp.
- Tiếp theo, đọc ký tự khớp thứ hai `b{1,3}` và ký tự thứ hai b trong chuỗi, so sánh, khớp. Nhưng vì `b{1,3}` đại diện cho 1-3 ký tự b, máy tự động NFA cũng có tính chất tham lam, vì vậy lúc này nó sẽ không tiếp tục đọc ký tự khớp tiếp theo của biểu thức chính quy, mà vẫn sử dụng `b{1,3}` để so sánh với ký tự thứ ba b trong chuỗi, kết quả vẫn là khớp.
- Tiếp tục so sánh `b{1,3}` với ký tự thứ tư c trong chuỗi, thấy không khớp, lúc này sẽ xảy ra quay lui, ký tự c đã được đọc sẽ được loại bỏ, con trỏ quay lại vị trí của ký tự thứ ba b.
- Vậy sau khi quay lui, quá trình khớp sẽ tiếp tục như thế nào? Chương trình sẽ đọc ký tự khớp tiếp theo c trong biểu thức chính quy, so sánh với ký tự thứ tư c trong chuỗi, kết quả khớp, kết thúc.

### Làm thế nào để tránh quay lui

#### Chế độ tham lam (Greedy)

Như tên gọi, trong việc khớp số lượng, nếu chỉ sử dụng +, ? hoặc * hoặc {min,max} làm lượng từ, biểu thức chính quy sẽ khớp với nhiều nội dung nhất có thể.

Ví dụ, ví dụ trên:

```
text = "abbc"
regex = "ab{1,3}c"
```

Trong chế độ tham lam, máy tự động NFA đã đọc phạm vi khớp lớn nhất, tức là khớp với 3 ký tự b. Khi khớp thất bại, quay lui sẽ xảy ra. Nếu kết quả khớp là "abbbc", thì sẽ khớp thành công.

```
text = "abbbc"
regex = "ab{1,3}c"
```

#### Chế độ lười biếng (Reluctant)

Trong chế độ này, biểu thức chính quy sẽ khớp với ít ký tự nhất có thể. Nếu khớp thành công, nó sẽ tiếp tục khớp với phần còn lại của chuỗi.

Ví dụ, thêm "?" sau ký tự trong ví dụ trên, chế độ lười biếng sẽ được kích hoạt.

```
text = "abc"
regex = "ab{1,3}?c"
```

Kết quả khớp là "abc", trong chế độ này, máy tự động NFA sẽ chọn phạm vi khớp nhỏ nhất, tức là khớp với 1 ký tự b, do đó tránh được vấn đề quay lui.

#### Chế độ độc quyền (Possessive)

Giống như chế độ tham lam, chế độ độc quyền cũng sẽ khớp với nhiều nội dung nhất có thể; khác biệt là, trong chế độ độc quyền, nếu khớp thất bại, quá trình khớp sẽ kết thúc, không có quay lui.

Vẫn là ví dụ trên, thêm "+" sau ký tự trong biểu thức chính quy sẽ kích hoạt chế độ độc quyền.

```
text = "abbc"
regex = "ab{1,3}+bc"
```

Kết quả là không khớp, kết thúc khớp, không có vấn đề quay lui.

> Nhìn vào đây, bạn nên rõ ràng rằng, **cách tránh quay lui là: sử dụng chế độ lười biếng và chế độ độc quyền**.

### Tối ưu hóa biểu thức chính quy

#### Hạn chế sử dụng chế độ tham lam, nên sử dụng chế độ độc quyền

Chế độ tham lam sẽ gây ra vấn đề quay lui, có thể sử dụng chế độ độc quyền để tránh quay lui.

#### Giảm số lượng lựa chọn nhánh

Loại bỏ loại biểu thức chọn nhánh `(X|Y|Z)` sẽ làm giảm hiệu suất của biểu thức chính quy, chúng ta nên cố gắng giảm sử dụng. Nếu phải sử dụng, chúng ta có thể tối ưu hóa bằng cách:

- Đầu tiên, chúng ta cần xem xét thứ tự lựa chọn, đặt các lựa chọn thường xuyên hơn ở đầu, để chúng có thể được khớp nhanh chóng;
- Tiếp theo, chúng ta có thể thử nghiệm việc trích xuất biểu thức chung, ví dụ, thay thế `(abcd|abef)` bằng `ab(cd|ef)`, biểu thức sau khớp nhanh hơn vì máy tự động NFA sẽ thử khớp ab trước, nếu không tìm thấy, nó sẽ không thử bất kỳ lựa chọn nào nữa;
- Cuối cùng, nếu đó là biểu thức chọn nhánh đơn giản, chúng ta có thể sử dụng ba lần chỉ mục thay vì `(X|Y|Z)`, nếu kiểm tra, bạn sẽ thấy hiệu suất của ba lần chỉ mục cao hơn `(X|Y|Z)` một chút.

#### Giảm số lượng nhóm bắt

- Nhóm bắt là việc lưu trữ nội dung khớp của biểu thức con trong biểu thức chính quy vào một mảng được đánh số hoặc được đặt tên rõ ràng, để dễ dàng tham chiếu sau này. Một nhóm bắt thường là một cặp (), mỗi cặp () sẽ là một nhóm bắt.
- Nhóm không bắt là việc tham gia khớp mà không đánh số nhóm, biểu thức thông thường là `(?:exp)`.

Trong biểu thức chính quy, mỗi nhóm bắt đều có một số thứ tự, số thứ tự 0 đại diện cho toàn bộ nội dung khớp. Chúng ta có thể xem ví dụ dưới đây:

```java
public static void main(String[] args) {
	String text = "<input high=\"20\" weight=\"70\">test</input>";
	String reg="(<input.*?>)(.*?)(</input>)";
	Pattern p = Pattern.compile(reg);
	Matcher m = p.matcher(text);
	while(m.find()) {
		System.out.println(m.group(0));// Toàn bộ nội dung khớp
		System.out.println(m.group(1));//(<input.*?>)
		System.out.println(m.group(2));//(.*?)
		System.out.println(m.group(3));//(</input>)
	}
}
```

Kết quả chạy:

```
<input high=\"20\" weight=\"70\">test</input>
<input high=\"20\" weight=\"70\">
test
</input>
```

Nếu bạn không cần lấy văn bản trong một nhóm cụ thể, hãy sử dụng nhóm không bắt. Ví dụ, thay `(X)` bằng `(?:X)`, hãy xem ví dụ dưới đây:

```java
public static void main(String[] args) {
	String text = "<input high=\"20\" weight=\"70\">test</input>";
	String reg="(?:<input.*?>)(.*?)(?:</input>)";
	Pattern p = Pattern.compile(reg);
	Matcher m = p.matcher(text);
	while(m.find()) {
		System.out.println(m.group(0));// Toàn bộ nội dung khớp
		System.out.println(m.group(1));//(.*?)
	}
}
```

Kết quả chạy:

```
<input high=\"20\" weight=\"70\">test</input>
test
```

Tóm lại: Giảm số lượng nhóm không cần thiết sẽ cải thiện hiệu suất của biểu thức chính quy.
