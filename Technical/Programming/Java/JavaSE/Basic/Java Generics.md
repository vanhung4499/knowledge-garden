---
categories: [java]
title: Java Generics
date created: 2023-07-02
date modified: 2023-07-10
tags: [java]
---

## Tại sao cần Generics

> Bản chất của Generics là tham số hóa kiểu dữ liệu (cho phép kiểm soát kiểu dữ liệu cụ thể của tham số mà không cần tạo ra kiểu dữ liệu mới). Nghĩa là trong quá trình sử dụng Generics, kiểu dữ liệu được chỉ định là một tham số, tham số này có thể được sử dụng trong lớp, giao diện và phương thức, tương ứng được gọi là lớp Generics, giao diện Generics và Generics method.

Ý nghĩa của Generics là:

- **Thực thi cùng một mã cho nhiều kiểu dữ liệu** (tái sử dụng mã)

Chúng ta sẽ giải thích bằng một ví dụ, trước hết hãy xem đoạn mã sau:

```java
private static int add(int a, int b) {
    System.out.println(a + "+" + b + "=" + (a + b));
    return a + b;
}

private static float add(float a, float b) {
    System.out.println(a + "+" + b + "=" + (a + b));
    return a + b;
}

private static double add(double a, double b) {
    System.out.println(a + "+" + b + "=" + (a + b));
    return a + b;
}
```

Nếu không sử dụng Generics, để thực hiện phép cộng với các kiểu dữ liệu khác nhau, mỗi kiểu dữ liệu đều cần phải tạo ra một phương thức add riêng biệt. Thông qua Generics, chúng ta có thể tái sử dụng một phương thức duy nhất:

```java
private static <T extends Number> double add(T a, T b) {
    System.out.println(a + "+" + b + "=" + (a.doubleValue() + b.doubleValue()));
    return a.doubleValue() + b.doubleValue();
}
```

- Trong Generics, kiểu dữ liệu được chỉ định khi sử dụng, không cần chuyển đổi kiểu dữ liệu (**an toàn về kiểu dữ liệu**, trình biên dịch sẽ **kiểm tra kiểu dữ liệu**).

Hãy xem ví dụ sau:

```java
List list = new ArrayList();
list.add("xxString");
list.add(100d);
list.add(new Person());
```

Khi sử dụng danh sách trên, các phần tử trong danh sách đều là kiểu Object (không giới hạn kiểu dữ liệu), vì vậy khi lấy phần tử ra khỏi danh sách, chúng ta cần chuyển đổi kiểu dữ liệu mục tiêu một cách rõ ràng và dễ dàng gây ra ngoại lệ `java.lang.ClassCastException`.

Với Generics, nó cung cấp ràng buộc kiểu dữ liệu, cung cấp kiểm tra trước khi biên dịch:

```java
List<String> list = new ArrayList<String>();

// list chỉ chứa phần tử String, không chứa kiểu khác
```

## Chức năng cơ bản Generic

### Generics Class

- Bắt đầu với một generics class đơn giản:

```java
class Point<T>{         // Có thể viết định danh tuỳ ý，T viết tắt của type  
    private T var ;     // biến var kiểu T  
    public T getVar(){  
        return var ;  
    }  
    public void setVar(T var){
        this.var = var ;  
    }  
}  
public class GenericsDemo06{  
    public static void main(String args[]){  
        Point<String> p = new Point<String>() ;     // kiểu của var là String  
        p.setVar("it") ;                            // đặt giá trị var  
        System.out.println(p.getVar().length()) ;   // lấy độ dài chuỗi
    }  
}
```

- Generics class đa kiểu dữ liệu

```java
class Notepad<K,V>{       // Hai kiểu được dùng  
    private K key ;
    private V value ;
    public K getKey(){  
        return this.key ;  
    }  
    public V getValue(){  
        return this.value ;  
    }  
    public void setKey(K key){  
        this.key = key ;  
    }  
    public void setValue(V value){  
        this.value = value ;  
    }  
} 
public class GenericsDemo09{  
    public static void main(String args[]){  
        Notepad<String,Integer> t = null ;        // Định nghĩa  
        t = new Notepad<String,Integer>() ;       // key kiểu String，value kiểu Integer  
        t.setKey("Tom") ; 
        t.setValue(20) ;
        System.out.print("Key；" + t.getKey()) ;
        System.out.print("，Value；" + t.getValue()) ;
  
    }  
}
```

### Generics Interface

- Generic Interface đơn giản

```java
interface Info<T>{
    public T getVar() ;
}  
class InfoImpl<T> implements Info<T>{ 
    private T var ; 
    public InfoImpl(T var){
        this.setVar(var) ;    
    }  
    public void setVar(T var){  
        this.var = var ;  
    }  
    public T getVar(){  
        return this.var ;  
    }  
} 
public class GenericsDemo24{  
    public static void main(String arsg[]){  
        Info<String> i = null; 
        i = new InfoImpl<String>("Hung") ;
        System.out.println("var：" + i.getVar()) ;  
    }  
}  
```

### Generics Method

Generics Method là phương thức mà kiểu Generics được chỉ định khi gọi phương thức.

Cú pháp định nghĩa Generics method:

```java
public <T> T getObject(Class<T> c) throws InstantiationException, IllegalAccessException {
	T t = c.newInstance();
	return t;
}
```

Cú pháp gọi Generics method:

```java
Generic generic = new Generic();

Object obj = generic.getObject(Class.forName('com.vanhung4499.test.User'));
```

Khi định nghĩa Generics method, chúng ta phải thêm trước kiểu trả về để khai báo rằng đây là một Generics method, sử dụng kiểu Generics `T` làm kiểu trả về của phương thức.

`Class<T>` được sử dụng để chỉ định kiểu cụ thể của Generics, và biến `c` có kiểu `Class<T>` có thể được sử dụng để tạo đối tượng của lớp Generics.

Tại sao lại sử dụng biến `c` để tạo đối tượng? Vì đây là một **Generics Method**, điều đó có nghĩa là chúng ta không biết kiểu cụ thể là gì và cũng không biết cách tạo đối tượng, vì vậy không thể sử dụng từ khóa `new` để tạo đối tượng. Tuy nhiên, chúng ta có thể sử dụng phương thức `newInstance()` của biến `c` để tạo đối tượng bằng cách sử dụng `reflection`.

Generics method yêu cầu tham số là kiểu `Class<T>`, và giá trị trả về của phương thức `Class.forName()` cũng là kiểu `Class<T>`, vì vậy có thể sử dụng `Class.forName()` làm tham số. Trong đó, tham số của phương thức `forName()` là kiểu dữ liệu nào thì giá trị trả về của `Class<T>` cũng là kiểu dữ liệu đó. Trong ví dụ này, tham số truyền vào phương thức `forName()` là đường dẫn đầy đủ của lớp `User`, do đó giá trị trả về là đối tượng kiểu `Class<User>`, vì vậy khi gọi Generics method, kiểu của biến `c` là `Class<T>`, do đó kiểu Generics `T` trong phương thức được chỉ định là `User`, và kiểu của biến `obj` là `User`.

Tất nhiên, Generics method không chỉ có thể có một tham số Class, mà còn có thể thêm các tham số khác theo nhu cầu.

**Tại sao lại sử dụng Generics method?** Vì lớp Generics yêu cầu chỉ định kiểu khi khởi tạo, nếu muốn thay đổi kiểu, phải tạo một đối tượng mới, điều này có thể không linh hoạt. trong khi Generics method có thể chỉ định kiểu khi gọi, linh hoạt hơn.

### Giới hạn trên và dưới Generics

- **Trước tiên hãy nhìn vào đoạn mã sau, rõ ràng là sẽ có lỗi** (vui lòng tham khảo văn bản sau để biết lý do lỗi cụ thể).

```java
class A{}
class B extends A {}

// Hai phương thức dưới đây không gây lỗi
public static void funA(A a) {
    // ...          
}
public static void funB(B b) {
    funA(b);
    // ...             
}

// Phương thức funD dưới đây sẽ gây lỗi
public static void funC(List<A> listA) {
    // ...          
}
public static void funD(List<B> listB) {
    funC(listB); // Unresolved compilation problem: The method doPrint(List<A>) in the type test is not applicable for the arguments (List<B>)
    // ...             
}
```

Làm thế nào để giải quyết vấn đề này?

Để giải quyết vấn đề chuyển đổi ẩn trong Generics, Java Generics đã thêm cơ chế giới hạn cho tham số kiểu. `<? extends A>` chỉ định rằng tham số kiểu có thể là A (giới hạn trên) hoặc một loại con của A. Khi biên dịch, kiểu sẽ được xóa thành kiểu A, tức là sử dụng kiểu A thay thế cho tham số kiểu. Phương pháp này có thể giải quyết vấn đề ban đầu, trình biên dịch biết phạm vi của tham số kiểu, nếu loại thực thể B được truyền vào nằm trong phạm vi này, cho phép chuyển đổi. Khi đó chỉ cần một lần chuyển đổi kiểu, trong run time, đối tượng sẽ được coi là một thực thể của A.

```java
public static void funC(List<? extends A> listA) {
    // ...          
}
public static void funD(List<B> listB) {
    funC(listB); // OK
    // ...             
}
```

- **Giới thiệu các giới hạn trên và dưới Generics**

Giới hạn trên và dưới của Generics được sử dụng khi sử dụng Generics, chúng ta có thể giới hạn kiểu tham số kiểu được truyền vào, ví dụ: chỉ cho phép tham số kiểu được truyền vào là một lớp cha nào đó hoặc một lớp con của một lớp nào đó.  

Giới hạn trên:

```java
class Info<T extends Number>{    // // Chỉ cho phép kiểu Generics là kiểu số
    private T var ;        // Khai báo biến Generics
    public void setVar(T var){
        this.var = var ;
    }
    public T getVar(){
        return this.var ;
    }
    public String toString(){    // In trực tiếp
        return this.var.toString() ;
    }
}
public class demo1{
    public static void main(String args[]){
        Info<Integer> i1 = new Info<Integer>() ;        // Khai báo đối tượng Generics của Integer
    }
}
```

Giơi hạn dưới:

```java
class Info<T>{
    private T var ;        // Khai báo biến Generics
    public void setVar(T var){
        this.var = var ;
    }
    public T getVar(){
        return this.var ;
    }
    public String toString(){    // In trực tiếp
        return this.var.toString() ;
    }
}
public class GenericsDemo21{
    public static void main(String args[]){
        Info<String> i1 = new Info<String>() ;        // Khai báo đối tượng Generics của String
        Info<Object> i2 = new Info<Object>() ;        // Khai báo đối tượng Generics của Object
        i1.setVar("hello") ;
        i2.setVar(new Object()) ;
        fun(i1) ;
        fun(i2) ;
    }
    public static void fun(Info<? super String> temp){    // Chỉ cho phép nhận kiểu Generics là String hoặc Object, vì String chỉ có Object là lớp cha
        System.out.print(temp + ", ") ;
    }
}
```

**Tóm tắt**

- `<?>` là ký tự đại diện không giới hạn.
- `<? extends E>` sử dụng từ khóa `extends` để chỉ định giới hạn trên, đại diện cho kiểu tham số hóa có thể là kiểu được chỉ định hoặc một lớp con của kiểu đó.
- `<? super E>` sử dụng từ khóa `super` để chỉ định giới hạn dưới, đại diện cho kiểu tham số hóa có thể là kiểu được chỉ định hoặc một lớp cha của kiểu đó.

Nguyên tắc sử dụng:《Effictive Java》  

Để có sự linh hoạt tối đa, hãy sử dụng ký tự đại diện cho tham số đầu vào của lớp sản xuất hoặc lớp tiêu thụ.

1. Nếu tham số hóa kiểu đại diện cho lớp sản xuất, hãy sử dụng `<? extends T>`.
2. Nếu tham số hóa kiểu đại diện cho lớp tiêu thụ, hãy sử dụng `<? super T>`.
3. Nếu cần cả hai, việc sử dụng ký tự đại diện không có ý nghĩa, vì bạn cần kiểu tham số chính xác.

- Nhìn vào một ví dụ thực tế khác **để hiểu làm rõ hơn**

```java
private <E extends Comparable<? super E>> E max(List<? extends E> e1) {
    if (e1 == null){
        return null;
    }
    // Các phần tử trả về từ trình lặp thuộc loại con của E
    Iterator<? extends E> iterator = e1.iterator();
    E result = iterator.next();
    while (iterator.hasNext()){
        E next = iterator.next();
        if (next.compareTo(result) > 0){
            result = next;
        }
    }
    return result;
}
```

Phạm vi của tham số kiểu E trong đoạn mã trên là `<E extends Comparable<? super E>>`. Hãy xem từng bước:

- Để thực hiện so sánh, E cần là một lớp có thể so sánh, do đó cần `extends Comparable<…>` (lưu ý rằng đây không phải là từ khóa extends trong việc kế thừa, nó khác nhau).
- `Comparable<? super E>` đại diện cho việc so sánh E, tức là E là lớp tiêu thụ, vì vậy cần sử dụng từ khóa `super`.
- Tham số `List<? extends E>` đại diện cho danh sách các lớp con của E mà chúng ta muốn thao tác, giới hạn trên, điều này cho phép chứa đủ các hạn chế sử dụng dấu `&`.

**Nhiều hạn chế**

Sử dụng dấu `&`  

Ví dụ thực tế khác để làm rõ hơn:

```java
public class Client {
    //Giảm giá vé 8% cho hành khách đứng và có lương dưới 2500 đô la
    public static <T extends Staff & Passenger> void discount(T t){
        if(t.getSalary()<2500 && t.isStanding()){
            System.out.println("Chúc mừng! Vé của bạn được giảm giá 8%!");
        }
    }
    public static void main(String[] args) {
        discount(new Me());
    }
}
```

Trong đoạn mã trên, tham số kiểu là `<T extends Staff & Passenger>`.

### Generics Array

Đầu tiên, chúng ta xem các khai báo liên quan đến Generics array:

```java
List<String>[] list11 = new ArrayList<String>[10]; // Lỗi biên dịch, không thể tạo ra mảng không hợp lệ
List<String>[] list12 = new ArrayList<?>[10]; // Lỗi biên dịch, cần ép kiểu
List<String>[] list13 = (List<String>[]) new ArrayList<?>[10]; // OK, nhưng sẽ có cảnh báo
List<?>[] list14 = new ArrayList<String>[10]; // Lỗi biên dịch, không thể tạo ra mảng không hợp lệ
List<?>[] list15 = new ArrayList<?>[10]; // OK
List<String>[] list6 = new ArrayList[10]; // OK, nhưng sẽ có cảnh báo
```

Vậy chúng ta thường sử dụng nó như thế nào?

- Một ví dụ sử dụng thông minh

```java
public class GenericsDemo30 {
    public static void main(String args[]) {
        Integer i[] = fun1(1, 2, 3, 4, 5, 6);   // Trả về một Generics array
        fun2(i);
    }
    public static <T> T[] fun1(T... arg) {  // Nhận tham số biến đổi
        return arg;            // Trả về một Generics array
    }
    public static <T> void fun2(T param[]) {   // In ra màn hình
        System.out.print("Generics Array: ");
        for (T t : param) {
            System.out.print(t + ", ");
        }
    }
}
```

- Sử dụng một cách hợp lý:

```java
public ArrayWithTypeToken(Class<T> type, int size) {  
    array = (T[]) Array.newInstance(type, size);  
}
```

Để biết chi tiết, xin vui lòng tham khảo giải thích dưới đây.

## Hiểu sâu về Generics

> Để hiểu sâu về Generics yêu cầu chúng ta tìm hiểu về khái niệm "type erasure" (loại bỏ kiểu dữ liệu) và các vấn đề liên quan.

### Làm thế nào để hiểu rằng Generics trong Java là "pseudo-generics"?

> Type erasure trong Generics của Java là một tính năng được thêm vào từ JDK 1.5. Do đó, để tương thích với các phiên bản trước đó, cài đặt Generics của Java sử dụng một chiến lược được gọi là "**pseudo-generics**" (giả Generics). Điều này có nghĩa là Java hỗ trợ Generics trong cú pháp, nhưng trong quá trình biên dịch, sẽ thực hiện "**type erasure**" (loại bỏ kiểu dữ liệu), thay thế tất cả các biểu thức Generics (nằm trong dấu ngoặc nhọn) bằng các kiểu dữ liệu cụ thể (kiểu nguyên thủy tương ứng), giống như không sử dụng Generics hoàn toàn. Hiểu rõ về "type erasure" là rất hữu ích để sử dụng Generics một cách hiệu quả, đặc biệt là khi gặp phải các vấn đề phức tạp.

**Nguyên tắc của "type erasure" trong Generics là:**  

- Loại bỏ khai báo tham số kiểu, tức là xóa bỏ phần tử `<>` và các phần kèm theo.
- Dựa vào giới hạn trên và dưới của tham số kiểu để suy ra và thay thế tất cả các tham số kiểu bằng kiểu nguyên thủy tương ứng: nếu tham số kiểu là một wildcard không giới hạn hoặc không có giới hạn, thì thay thế bằng Object; nếu có giới hạn trên và dưới, thì thay thế bằng giới hạn trên hoặc giới hạn dưới của tham số kiểu (ví dụ: được thay thế bằng Number, được thay thế bằng Object).
- Chèn mã chuyển đổi kiểu tường minh để đảm bảo an toàn kiểu dữ liệu.
- Tự động tạo ra "**bridge method**" (phương thức cầu nối) để đảm bảo tính "**polymorphism**" (đa hình) của Generics sau khi loại bỏ kiểu dữ liệu.

**Vậy làm thế nào để thực hiện "type erasure"?**

Tham khảo từ: http://softlab.sdut.edu.cn/blog/subaochen/2017/01/generics-type-erasure/

- Loại bỏ tham số kiểu trong định nghĩa lớp - Loại bỏ kiểu không giới hạn

Khi không có bất kỳ giới hạn nào cho tham số kiểu trong định nghĩa lớp, nó được thay thế trực tiếp bằng Object, tức là các tham số kiểu như và đều được thay thế bằng Object.  

![Pasted image 20230703002117](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230703002117.png)

- Loại bỏ tham số kiểu trong định nghĩa lớp - Loại bỏ kiểu bị hạn chế

Khi có giới hạn cho tham số kiểu trong định nghĩa lớp, nó được thay thế bằng giới hạn trên hoặc dưới của tham số kiểu, ví dụ như và `<? extends Number>` được thay thế bằng `Number`, `<? super Number>` được thay thế bằng `Object`.

![Pasted image 20230703002148](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230703002148.png)

- Loại bỏ tham số kiểu trong định nghĩa phương thức

Nguyên tắc loại bỏ tham số kiểu trong định nghĩa phương thức tương tự như loại bỏ tham số kiểu trong định nghĩa lớp, ở đây chỉ trình bày ví dụ về loại bỏ tham số kiểu có giới hạn.

![Pasted image 20230703001930](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230703001930.png)

### Làm thế nào để chứng minh việc kiểu dữ liệu bị loại bỏ?

Chúng ta sẽ sử dụng hai ví dụ để chứng minh rằng các kiểu dữ liệu trong Java bị loại bỏ và các kiểu dữ liệu nguyên thủy là bình đẳng.

```java
public class Test {

    public static void main(String[] args) {

        ArrayList<String> list1 = new ArrayList<String>();
        list1.add("abc");

        ArrayList<Integer> list2 = new ArrayList<Integer>();
        list2.add(123);

        System.out.println(list1.getClass() == list2.getClass()); // true
    }
}
```

Trong ví dụ này, chúng ta định nghĩa hai mảng `ArrayList`, một là `ArrayList` với kiểu dữ liệu Generics là `String` và chỉ có thể chứa chuỗi, một là `ArrayList` với kiểu dữ liệu Generics là `Integer` và chỉ có thể chứa số nguyên. Cuối cùng, chúng ta sử dụng phương thức `getClass()` của đối tượng `list1` và `list2` để lấy thông tin về lớp của chúng, kết quả cuối cùng là `true`. Điều này cho thấy kiểu dữ liệu Generics `String` và `Integer` đã bị loại bỏ và chỉ còn lại kiểu dữ liệu nguyên thủy.

```java
public class Test {

    public static void main(String[] args) throws Exception {

        ArrayList<Integer> list = new ArrayList<Integer>();

        list.add(1);  // Gọi phương thức add chỉ có thể lưu trữ số nguyên vì kiểu dữ liệu Generics là Integer

        list.getClass().getMethod("add", Object.class).invoke(list, "asd");

        for (int i = 0; i < list.size(); i++) {
            System.out.println(list.get(i));
        }
    }
}
```

Trong chương trình này, chúng ta định nghĩa một đối tượng `ArrayList` với kiểu dữ liệu Generics là `Integer`. Nếu gọi phương thức `add()` trực tiếp, nó chỉ có thể lưu trữ dữ liệu số nguyên. Tuy nhiên, khi chúng ta sử dụng `reflection` để gọi phương thức `add()`, chúng ta có thể lưu trữ một chuỗi. Điều này cho thấy rằng kiểu dữ liệu Generics `Integer` đã bị loại bỏ và chỉ còn lại kiểu dữ liệu nguyên thủy.

### Làm thế nào để hiểu về loại bỏ thông tin generic sau khi loại bỏ?

> Trong đó, đã đề cập đến kiểu nguyên thủy hai lần, kiểu nguyên thủy là gì?

Kiểu nguyên thủy là kiểu biến thực sự của biến trong `bytecode` sau khi thông tin generic đã bị loại bỏ, bất kể khi nào định nghĩa một generic, kiểu nguyên thuỷ tương ứng sẽ được tự động cung cấp, kiểu biến sẽ bị loại bỏ và được thay thế bằng kiểu giới hạn của nó (biến không giới hạn được thay thế bằng `Object`).

- Kiểu nguyên thuỷ của T là Object

```java
class Pair<T> {  
    private T value;  
    public T getValue() {  
        return value;  
    }  
    public void setValue(T  value) {  
        this.value = value;  
    }  
} 
```

Kiểu nguyên thủy của Pair là:

```java
class Pair {  
    private Object value;  
    public Object getValue() {  
        return value;  
    }  
    public void setValue(Object  value) {  
        this.value = value;  
    }  
}
```

Vì trong `Pair<T>`, `T` là một biến kiểu không giới hạn, nên nó được thay thế bằng `Object`, kết quả là một lớp thông thường, giống như trước khi generic được thêm vào ngôn ngữ Java. Trong chương trình, có thể chứa các cặp khác nhau, như `Pair<String>` hoặc `Pair<Integer>`, nhưng sau khi loại bỏ thông tin kiểu, chúng trở thành kiểu nguyên thuỷ của Pair, và kiểu nguyên thuỷ đều là `Object`.

Từ phần trên, chúng ta cũng có thể hiểu rằng sau khi loại bỏ thông tin kiểu của ArrayList, kiểu nguyên thuỷ cũng trở thành `Object`, vì vậy chúng ta có thể lưu trữ chuỗi bằng `reflection`.

Nếu biến kiểu có giới hạn, thì kiểu nguyên thuỷ sẽ được thay thế bằng lớp biến kiểu đầu tiên của giới hạn.

Ví dụ: Nếu khai báo Pair như sau:

```java
public class Pair<T extends Comparable> {}
```

Thì kiểu nguyên thủy là `Comparable`.

Cần phân biệt giữa kiểu nguyên thủy và kiểu biến generic. Khi gọi phương thức generic, có thể chỉ định generic hoặc không chỉ định generic:

- Khi không chỉ định generic, kiểu biến generic sẽ là kiểu cha chung nhất của các kiểu trong phương thức, cho đến Object.
- Khi chỉ định generic, các kiểu trong phương thức phải là loại cụ thể của generic đó hoặc là lớp con của nó.

```java
public class Test {  
    public static void main(String[] args) {  

	    /** Khi không chỉ định generic */
	    int i = Test.add(1, 2); // Cả hai tham số đều là Integer, vì vậy T là Integer
	    Number f = Test.add(1, 1.2); // Một tham số là Integer, một tham số là Float, vì vậy lấy loại cha chung nhất, là Number
	    Object o = Test.add(1, "asd"); // Một tham số là Integer, một tham số là String, vì vậy lấy loại cha chung nhất, là Object

	    /** Khi chỉ định generic */
	    int a = Test.<Integer>add(1, 2); // Chỉ định là Integer, vì vậy chỉ có thể là Integer hoặc lớp con của nó
	    int b = Test.<Integer>add(1, 2.2); // Lỗi biên dịch, chỉ định là Integer, không thể là Float
	    Number c = Test.<Number>add(1, 2.2); // Chỉ định là Number, vì vậy có thể là Integer hoặc Float
	}

	// Đây là một phương thức generic đơn giản
	public static <T> T add(T x, T y) {
	    return y;
	}
}
```

Thực tế trong lớp generic, khi không chỉ định kiểu generic thì nó cũng tương tự, chỉ khác là lúc đó kiểu generic là Object. Ví dụ trong `ArrayList`, nếu không chỉ định kiểu generic, thì ArrayList đó có thể chứa bất kỳ đối tượng nào.

- Kiểu generic là Object:

```java
public static void main(String[] args) {  
    ArrayList list = new ArrayList();  
    list.add(1);  
    list.add("121");  
    list.add(new Date());  
}
```

### Làm thế nào để hiểu về kiểm tra tại thời điểm biên dịch của generic?

> Nếu thông tin về biến loại bị loại bỏ trong quá trình biên dịch, tại sao khi chúng ta thêm một số nguyên vào đối tượng được tạo trong ArrayList lại bị lỗi? Không phải kiểu biến generic String đã được biến thành loại Object trong quá trình biên dịch sao? Tại sao không thể lưu trữ các loại khác? Với việc loại bỏ thông tin loại, làm thế nào để đảm bảo rằng chúng ta chỉ có thể sử dụng các kiểu được giới hạn bởi biến generic?

Trình biên dịch Java kiểm tra kiểu của generic trước khi loại bỏ thông tin loại và biên dịch. Ví dụ:

```java
public static  void main(String[] args) {  

    ArrayList<String> list = new ArrayList<String>();
	list.add("123");
	list.add(123); // Lỗi biên dịch
}
```

Trong chương trình trên, khi chúng ta thêm một số nguyên bằng phương thức `add`, IDE sẽ báo lỗi ngay lập tức. Điều này chứng tỏ đây là kiểm tra trước khi biên dịch, vì nếu kiểm tra sau khi loại bỏ thông tin kiểu, kiểu nguyên thủy sẽ là Object và sẽ cho phép thêm bất kỳ kiểu tham chiếu nào. Tuy nhiên, thực tế lại không như vậy, điều này chứng tỏ việc sử dụng biến generic được kiểm tra trước khi biên dịch.

Vậy kiểm tra kiểu này áp dụng cho ai? Hãy xem sự tương thích giữa loại tham số hóa và nguyên thủy.

Ví dụ với `ArrayList`, cách viết trước đây là:

```java
ArrayList list = new ArrayList();  
```

Cách viết hiện tại:

```java
ArrayList<String> list = new ArrayList<String>();
```

Nếu nó tương thích với mã cũ, sẽ có các trường hợp sau đây:

```java
ArrayList<String> list1 = new ArrayList(); // Trường hợp 1
ArrayList list2 = new ArrayList<String>(); // Trường hợp 2
```

Điều này không gây lỗi, nhưng sẽ có cảnh báo biên dịch.

Tuy nhiên, trong trường hợp thứ nhất, chúng ta có thể đạt được hiệu quả tương tự như việc sử dụng tham số hóa đầy đủ, trong khi trường hợp thứ hai thì không có tác dụng.

Vì kiểm tra kiểu được thực hiện trong quá trình biên dịch, việc tạo ra `ArrayList` mà không chỉ định generic chỉ là việc cấp phát một không gian lưu trữ trong bộ nhớ, có thể chứa bất kỳ loại nào. Quan trọng là việc sử dụng tham chiếu đó, vì chúng ta sử dụng tham chiếu `list1` để gọi các phương thức của nó, ví dụ như gọi phương thức `add`, vì vậy tham chiếu `list1` có thể kiểm tra kiểu generic. Trong khi tham chiếu `list2` không sử dụng generic, vì vậy không thể kiểm tra kiểu.

Ví dụ:

```java
public static void main(String[] args) {

    ArrayList<String> list1 = new ArrayList();
    list1.add("1"); // Biên dịch thành công
    list1.add(1); // Lỗi biên dịch
    String str1 = list1.get(0); // Kiểu trả về là String

    ArrayList list2 = new ArrayList<String>();
    list2.add("1"); // Biên dịch thành công
    list2.add(1); // Biên dịch thành công
    Object object = list2.get(0); // Kiểu trả về là Object

    new ArrayList<String>().add("11"); // Biên dịch thành công
    new ArrayList<String>().add(22); // Lỗi biên dịch

    String str2 = new ArrayList<String>().get(0); // Kiểu trả về là String
}
```

Từ ví dụ trên, chúng ta có thể hiểu rằng **kiểm tra kiểu chỉ áp dụng cho tham chiếu. Tham chiếu là gì? Đó là khi chúng ta sử dụng tham chiếu để gọi phương thức generic, nó sẽ kiểm tra kiểu của tham chiếu đó, không quan tâm đến đối tượng thực sự mà tham chiếu đó đang tham chiếu đến**.

**Tại sao không xem xét mối quan hệ kế thừa trong tham số hóa kiểu?**

Trong Java, việc truyền tham số hóa kiểu như sau không được phép:

```java
ArrayList<String> list1 = new ArrayList<Object>(); // Lỗi biên dịch
ArrayList<Object> list2 = new ArrayList<String>(); // Lỗi biên dịch
```

- Trước tiên, hãy giả sử trường hợp thứ nhất được mở rộng thành:

```java
ArrayList<Object> list1 = new ArrayList<Object>();  
list1.add(new Object());  
list1.add(new Object());  
ArrayList<String> list2 = list1; // Lỗi biên dịch
```

Thực tế là ở dòng mã thứ 4, sẽ có lỗi biên dịch. Nếu nó không có lỗi, khi chúng ta sử dụng tham chiếu `list2` để lấy giá trị, nó sẽ trả về các đối tượng kiểu `String` (như đã đề cập, kiểm tra kiểu dựa trên tham chiếu), nhưng thực tế đã lưu các đối tượng kiểu `Object`. Điều này sẽ gây ra lỗi `ClassCastException`. Vì vậy, để tránh lỗi phổ biến này, Java không cho phép việc truyền tham số hóa kiểu như vậy. (Đây cũng là lý do tại sao generic được tạo ra, để giải quyết vấn đề chuyển đổi kiểu, chúng ta không thể vi phạm mục đích ban đầu của nó).

- Trong trường hợp thứ hai, mở rộng trường hợp đó thành:

```java
ArrayList<String> list1 = new ArrayList<String>();  
list1.add(new String());  
list1.add(new String());

ArrayList<Object> list2 = list1; // Lỗi biên dịch
```

Đúng vậy, trong trường hợp này tốt hơn so với trường hợp thứ nhất, ít nhất khi chúng ta lấy giá trị từ `list2`, không xảy ra lỗi `ClassCastException` vì chúng ta chuyển đổi từ `String` sang `Object`. Tuy nhiên, việc làm này có ý nghĩa gì? Lý do generic xuất hiện là để giải quyết vấn đề chuyển đổi kiểu.  

Chúng ta đã sử dụng generic, nhưng cuối cùng lại phải tự ép kiểu, vi phạm mục đích thiết kế generic ban đầu. Vì vậy, Java không cho phép làm như vậy. Hơn nữa, nếu chúng ta sử dụng `list2` để thêm đối tượng mới vào, khi lấy giá trị, làm sao chúng ta biết rằng chúng ta đang lấy ra kiểu `String` hay kiểu `Object`?

Vì vậy, hãy chú ý đặc biệt đến vấn đề truyền tham chiếu trong generic.

### Làm thế nào để hiểu về đa hình trong generic? Bridge Method

> Việc xóa thông tin kiểu của generic gây ra xung đột đa hình, và cách giải quyết của JVM là sử dụng **phương thức cầu nối (bridge method)**.

Giả sử chúng ta có một lớp generic như sau:

```java
class Pair<T> {

	private T value;
	
    public T getValue() {
        return value;
    }
    
    public void setValue(T value) {
        this.value = value;
    }
}
```

Sau đó, chúng ta muốn một lớp con kế thừa nó:

```java
class DateInter extends Pair<Date> {

    @Override
    public void setValue(Date value) {
        super.setValue(value);
    }

    @Override
    public Date getValue() {
        return super.getValue();
    }

}
```

Trong lớp con này, chúng ta đặt giới hạn kiểu generic của lớp cha là `Pair<Date>`. Trong lớp con, chúng ta ghi đè hai phương thức của lớp cha. Ý định ban đầu của chúng ta là giới hạn kiểu generic của lớp cha là `Date`, vì vậy cả hai tham số của phương thức trong lớp cha đều là kiểu `Date`.

```java
public Date getValue() {  
    return value;  
}

public void setValue(Date value) {  
    this.value = value;  
}
```

Vì vậy, chúng ta không gặp vấn đề khi ghi đè hai phương thức này trong lớp con, và thậm chí chú thích `@Override` của chúng ta cũng có thể thấy rằng không có vấn đề nào.

Nhưng thực tế là như thế nào?  

Phân tích: Sau khi xóa thông tin kiểu, kiểu generic của lớp cha trở thành kiểu nguyên thủy `Object`, vì vậy lớp cha sau khi biên dịch trở thành:

```java
class Pair {  
    private Object value;

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

}
```

Tiếp theo, xem xét kiểu của hai phương thức trong lớp con:

```java
@Override  
public void setValue(Date value) {  
    super.setValue(value);  
}

@Override  
public Date getValue() {  
    return super.getValue();  
}
```

Hãy phân tích phương thức `setValue` trước, kiểu của lớp cha là `Object`, trong khi kiểu của lớp con là `Date`, kiểu tham số không giống nhau, nếu đây là một quan hệ kế thừa thông thường, thì đây không phải là việc ghi đè (override) mà là việc nạp chồng (overload). Hãy kiểm tra bằng cách sử dụng một phương thức `main`:

```java
public static void main(String[] args) throws ClassNotFoundException {  
    DateInter dateInter = new DateInter();  
    dateInter.setValue(new Date());  
    dateInter.setValue(new Object()); // Lỗi biên dịch  
}
```

Nếu đây là việc nạp chồng, thì trong lớp con có hai phương thức `setValue`, một với tham số kiểu `Object` và một với tham số kiểu `Date`, nhưng chúng ta thấy rằng không có phương thức với tham số kiểu `Object` trong lớp con. Vì vậy, đây là việc ghi đè, không phải việc nạp chồng.

**Vì sao lại như vậy?**  

Lý do là, chúng ta truyền vào kiểu generic của lớp cha là `Date`, `Pair<Date>`, ý định ban đầu của chúng ta là biến lớp generic thành:

```java
class Pair {  
    private Date value;

    public Date getValue() {
        return value;
    }

    public void setValue(Date value) {
        this.value = value;
    }

}
```

Sau đó, chúng ta ghi đè hai phương thức với tham số kiểu `Date` trong lớp con, để thực hiện đa hình trong kế thừa.

Nhưng vì một số lý do, máy ảo không thể biến kiểu generic thành `Date`, chỉ có thể xóa thông tin loại, trở thành loại nguyên thủy `Object`. Vì vậy, ý định ban đầu của chúng ta là thực hiện ghi đè, để thực hiện đa hình, nhưng sau khi xóa thông tin loại, chỉ có thể thực hiện nạp chồng. Điều này tạo ra một xung đột giữa xóa thông tin kiểu và đa hình. JVM có hiểu ý định của bạn không? Có! Nhưng nó không thể thực hiện trực tiếp, Không!!!! Nếu không, chúng ta sẽ làm thế nào để ghi đè phương thức với tham số kiểu `Date` mà chúng ta muốn.

> JVM sử dụng một phương thức đặc biệt để hoàn thành chức năng này, đó là phương thức cầu nối (bridge method).

Đầu tiên, chúng ta sẽ sử dụng lệnh `javap -c className` để giải mã lại mã byte của lớp con `DateInter`, kết quả như sau:

```java
class com.tao.test.DateInter extends com.tao.test.Pair<java.util.Date> {  
  com.tao.test.DateInter();  
    Code:  
       0: aload_0  
       1: invokespecial #8 // Method com/tao/test/Pair."<init>":()V  
       4: return  

  public void setValue(java.util.Date); // Phương thức setValue mà chúng ta ghi đè  
    Code:  
       0: aload_0  
       1: aload_1  
       2: invokespecial #16 // Method com/tao/test/Pair.setValue:(Ljava/lang/Object;)V  
       5: return  

  public java.util.Date getValue(); // Phương thức getValue mà chúng ta ghi đè  
    Code:  
       0: aload_0  
       1: invokespecial #23 // Method com/tao/test/Pair.getValue:()Ljava/lang/Object;  
       4: checkcast #26 // class java/util/Date  
       7: areturn  

  public java.lang.Object getValue(); // Phương thức cầu nối được tạo bởi trình biên dịch  
    Code:  
       0: aload_0  
       1: invokevirtual #28 // Method getValue:()Ljava/util/Date; để gọi phương thức getValue mà chúng ta ghi đè  
       4: areturn  

  public void setValue(java.lang.Object); // Phương thức cầu nối được tạo bởi trình biên dịch  
    Code:  
       0: aload_0  
       1: aload_1  
       2: checkcast #26 // class java/util/Date  
       5: invokevirtual #30 // Method setValue:(Ljava/util/Date;) để gọi phương thức setValue mà chúng ta ghi đè  
       8: return  
}
```

Từ kết quả biên dịch, chúng ta có thể thấy rằng lớp con mà chúng ta ghi đè `setValue` và `getValue` thực sự có 4 phương thức. Thực tế, hai phương thức cuối cùng là các phương thức cầu nối được tạo bởi trình biên dịch. Có thể thấy rằng tham số của các phương thức cầu nối đều là `Object`, tức là kiểu của lớp con thực sự ghi đè hai phương thức của lớp cha. Nhưng chú thích `@Override` được đặt trên phương thức `setValue` và `getValue` mà chúng ta tự định nghĩa chỉ là ảo tưởng. Các phương thức cầu nối thực chất chỉ gọi phương thức mà chúng ta ghi đè.

Vì vậy, JVM thông minh sử dụng phương pháp cầu nối để giải quyết xung đột giữa việc xóa thông tin kiểu và đa hình.

Tuy nhiên, cần lưu ý rằng ý nghĩa của hai phương thức `setValue` và `getValue` này khác nhau.

Phương thức `setValue` được tạo ra để giải quyết xung đột giữa xóa thông tin kiểu và đa hình.

Trong khi đó, phương thức `getValue` có ý nghĩa phổ quát, nếu đây là một mối quan hệ thừa kế bình thường:

Khi đó phương thức `getValue` của lớp cha như sau:

```java
public Object getValue() {  
    return super.getValue();  
}
```

Và phương thức được ghi đè bởi lớp con là:

```java
public Date getValue() {  
    return super.getValue();  
}
```

Thực tế, việc này cũng tồn tại trong việc kế thừa thông thường, đó là sự chuyển đổi kiểu (covariant).

Một điều thú vị là trong trường hợp này, phương thức cầu nối `Object getValue()` và `Date getValue()` tồn tại đồng thời. Tuy nhiên, nếu đây là hai phương thức thông thường, cùng có chữ ký phương thức, JVM sẽ không thể phân biệt hai phương thức này. Nếu chúng ta tự viết mã Java, mã như vậy sẽ không vượt qua kiểm tra của trình biên dịch, nhưng máy ảo lại cho phép điều này xảy ra, vì máy ảo xác định một phương thức dựa trên kiểu tham số và kiểu trả về, vì vậy trình biên dịch cho phép thực hiện việc "không hợp lệ" này và để máy ảo phân biệt.

### Làm thế nào để hiểu rằng kiểu cơ bản không thể được sử dụng làm kiểu Generics?

> Ví dụ, chúng ta không có `ArrayList<int>`, chỉ có `ArrayList<Integer>`, tại sao?

Điều này là do sau khi loại bỏ kiểu, kiểu gốc của `ArrayList` trở thành `Object`, nhưng kiểu `Object` không thể lưu trữ giá trị `int`, chỉ có thể tham chiếu đến giá trị `Integer`. Ngoài ra, chúng ta cũng cần lưu ý rằng chúng ta có thể sử dụng `list.add(1)` là do sự tự động đóng gói (autoboxing) và mở gói (unboxing) kiểu dữ liệu cơ bản trong Java.

### Làm thế nào để hiểu rằng kiểu Generic không thể được khởi tạo?

> Không thể khởi tạo kiểu generic, điều này căn bản là do quyết định của việc loại bỏ kiểu:

Chúng ta có thể thấy mã sau sẽ báo lỗi trong trình biên dịch Java:

```java
T test = new T(); // LỖI. 
```

Vì trong quá trình biên dịch Java không thể xác định được kiểu tham số hóa của kiểu thông thường, cũng không thể tìm thấy tệp mã `bytecode` của lớp tương ứng, vì vậy tự nhiên không thể khởi tạo. Ngoài ra, vì `T` bị loại bỏ thành `Object`, nếu có thể `new T()` thì nó sẽ trở thành `new Object()`, mất đi ý nghĩa ban đầu. Nếu chúng ta thực sự cần khởi tạo một kiểu generic, chúng ta có thể sử dụng `reflection` để thực hiện:

```java
static <T> T newTclass (Class < T > clazz) throws InstantiationException, IllegalAccessException {  
    T obj = clazz.newInstance();  
    return obj;  
}
```

### Mảng Generic: Có thể sử dụng kiểu cụ của kiểu generic thể để khởi tạo không?

Hãy xem ví dụ được cung cấp bởi Oracle:

```java
List<String>[] lsa = new List<String>[10]; // Not really allowed.
Object o = lsa;
Object[] oa = (Object[]) o;
List<Integer> li = new ArrayList<Integer>();
li.add(new Integer(3));
oa[1] = li; // Unsound, but passes run time store check
String s = lsa[1].get(0); // Run-time error ClassCastException.
```

Do cơ chế loại bỏ kiểu của JVM, vì vậy mã trên có thể gán giá trị cho `oa[1]` là `ArrayList` mà không gây ra ngoại lệ, nhưng khi lấy dữ liệu ra thì phải thực hiện một lần chuyển đổi kiểu, vì vậy sẽ xảy ra `ClassCastException`. Nếu khai báo mảng chung `new List[10]` bỏ `<String>`, thì tình huống trên sẽ không có bất kỳ cảnh báo hoặc lỗi nào trong quá trình biên dịch, chỉ có lỗi xảy ra trong runtime, nhưng mục đích của việc sử dụng kiểu generic là để loại bỏ `ClassCastException` tức là **Type-Safe**, vì vậy nếu Java hỗ trợ khởi tạo mảng qua kiểu generic thì chính là tự bắn vào chân mình.

Đối với đoạn mã dưới đây thì nó là hợp lệ:

```java
List<?>[] lsa = new List<?>[10]; // OK, array of unbounded wildcard type.
Object o = lsa;
Object[] oa = (Object[]) o;
List<Integer> li = new ArrayList<Integer>();
li.add(new Integer(3));
oa[1] = li; // Correct.
Integer i = (Integer) lsa[1].get(0); // OK
```

Vì vậy, việc khởi tạo mảng generic qua cách sử dụng ký tự đại diện là được cho phép, vì khi lấy dữ liệu ra, chúng ta phải thực hiện chuyển đổi kiểu rõ ràng, phù hợp với logic dự kiến. Tóm lại, khởi tạo mảng generic trong Java không thể là kiểu cụ thể của kiểu genertic, chỉ có thể là dạng ký tự đại diện, vì kiểu cụ thể sẽ cho phép lưu trữ bất kỳ đối tượng nào, và khi lấy ra sẽ xảy ra ngoại lệ chuyển đổi kiểu, xung đột với thiết kế của kiểu generic, trong khi dạng ký tự đại diện ban đầu đã cần phải tự chuyển đổi kiểu, phù hợp với logic dự kiến.

Tài liệu chính thức của Oracle: https://docs.oracle.com/javase/tutorial/extra/generics/fineprint.html

Để hiểu sâu hơn, chúng ta hãy xem đoạn mã sau:

```java
List<String>[] list11 = new ArrayList<String>[10]; // Lỗi biên dịch, tạo không hợp lệ  
List<String>[] list12 = new ArrayList<?>[10]; // Lỗi biên dịch, cần chuyển đổi kiểu rõ ràng  
List<String>[] list13 = (List<String>[]) new ArrayList<?>[10]; // OK, nhưng sẽ có cảnh báo  
List<?>[] list14 = new ArrayList<String>[10]; // Lỗi biên dịch, tạo không hợp lệ  
List<?>[] list15 = new ArrayList<?>[10]; // OK  
List<String>[] list6 = new ArrayList[10]; // OK, nhưng sẽ có cảnh báo
```

Vì trong Java không thể tạo một mảng của một kiểu cụ thể của kiểu generic, trừ khi sử dụng ký tự đại diện và thực hiện chuyển đổi kiểu rõ ràng.

### Mảng Generic: Làm thế nào để khởi tạo một phiên bản mảng generic một cách chính xác?

> Dù chúng ta khởi tạo một phiên bản mảng generic bằng cách sử dụng `new ArrayList[10]` hoặc bằng cách sử dụng ký tự đại diện của kiểu generic, cả hai đều gây ra cảnh báo, điều đó có nghĩa là chúng chỉ đạt được cú pháp hợp lệ, nhưng chúng ta phải tự chịu rủi ro tiềm ẩn khi chạy. Do đó, cách khởi tạo mảng kiểu thông thường đó không phải là cách tối ưu và tinh tế nhất.

Trong các tình huống sử dụng mảng generic, chúng ta nên cố gắng sử dụng danh sách `List` để thay cho `Array`. Ngoài ra, chúng ta cũng có thể sử dụng phương thức `Array.newInstance(Class<T> componentType, int length)` trong `java.lang.reflect.Array` để tạo một mảng có kiểu và kích thước được chỉ định, như sau:

```java
public class ArrayWithTypeToken<T> {  
    private T[] array;

    public ArrayWithTypeToken(Class<T> type, int size) {
        array = (T[]) Array.newInstance(type, size);
    }

    public void put(int index, T item) {
        array[index] = item;
    }

    public T get(int index) {
        return array[index];
    }

    public T[] create() {
        return array;
    }

}

//…

ArrayWithTypeToken<Integer> arrayToken = new ArrayWithTypeToken<Integer>(Integer.class, 100);  
Integer[] array = arrayToken.create();
```

Vì vậy, sử dụng `reflection` để khởi tạo một mảng generic được coi là một cách triển khai tinh tế, vì kiểu generic `T` chỉ được xác định vào thời điểm chạy, và chúng ta chỉ có thể tạo một mảng generic trong runtime bằng cách sử dụng kỹ thuật `reflection`.

### Làm thế nào để hiểu về phương thức tĩnh và biến tĩnh trong lớp generic?

> Phương thức tĩnh và biến tĩnh trong lớp generic không thể sử dụng các tham số kiểu thông thường được khai báo trong lớp chứa.

Ví dụ minh họa:

```java
public class Test2<T> {  
    public static T one; // Lỗi biên dịch  
    public static T show(T one) { // Lỗi biên dịch  
        return null;  
    }  
}
```

Vì việc khởi tạo các tham số kiểu generic trong lớp chứa xảy ra khi đối tượng được khai báo, trong khi biến tĩnh và phương thức tĩnh không cần sử dụng đối tượng để gọi. Vì chưa có đối tượng nào được tạo ra, làm thế nào để xác định kiểu tham số kiểu thông thường này? Vì vậy, tất nhiên là sai.

Tuy nhiên, hãy lưu ý sự khác biệt sau đây:

```java
public class Test2<T> {

    public static <T> T show(T one) { // Đúng
        return null;
    }
}
```

Vì đây là một phương thức generic, trong phương thức generic này, `T` được định nghĩa trong phương thức chính nó, không phải là `T` trong lớp generic.

### Làm thế nào để hiểu về việc sử dụng kiểu generic trong các ngoại lệ?

- **Không thể ném hoặc bắt các đối tượng của lớp generic**. Thực tế là mở rộng lớp `Throwable` trong kiểu generic là không hợp lệ. Ví dụ: Định nghĩa dưới đây sẽ không được biên dịch:

```java
public class Problem<T> extends Exception {

}
```

Tại sao không thể mở rộng `Throwable`? Vì các ngoại lệ được ném và bắt trong runtime, trong khi thông tin kiểu generic sẽ bị xóa đi trong quá trình biên dịch. Vì vậy, giả sử việc biên dịch trên là hợp lệ, hãy xem định nghĩa dưới đây:

```java
try {

} catch (Problem<Integer> e1) {

} catch (Problem<Number> e2) {

}
```

Sau khi thông tin kiểu bị xóa, cả hai khối catch đều trở thành kiểu nguyên thủy `Object`, điều đó có nghĩa là cả hai khối catch trở nên giống nhau, tương đương với:

```java
try {

} catch (Problem<Object> e1) {

} catch (Problem<Object> e2) {

}  
```

Điều này tất nhiên là không thể.

- **Không thể sử dụng biến kiểu generic trong khối catch**:

```java
public static <T extends Throwable> void doWork(Class<T> t) {  
    try {  
        …  
    } catch (T e) { // Lỗi biên dịch  
        …  
    }  
}
```

Vì thông tin kiểu đã trở thành kiểu nguyên thủy trong quá trình biên dịch, điều đó có nghĩa là `T` ở trên sẽ trở thành `Throwable` nguyên thủy. Vậy nếu có thể sử dụng biến kiểu thông thường trong khối catch, thì định nghĩa dưới đây sẽ như thế nào:

```java
public static <T extends Throwable> void doWork(Class<T> t){  
    try {

    } catch (T e) { // Lỗi biên dịch

    } catch (IndexOutOfBounds e) {

    }                         

}
```

Theo nguyên tắc bắt ngoại lệ, lớp con phải đứng trước, lớp cha đứng sau, vì vậy định nghĩa trên vi phạm nguyên tắc bắt ngoại lệ. Ngay cả khi bạn sử dụng `T` là `ArrayIndexOutofBounds` khi sử dụng phương thức tĩnh này, sau khi biên dịch, nó vẫn trở thành `Throwable`, trong khi `ArrayIndexOutofBounds` là lớp con của `IndexOutofBounds`, vi phạm nguyên tắc bắt ngoại lệ. Vì vậy, để tránh tình huống như vậy, Java cấm sử dụng biến kiểu generic trong khối catch.

- **Tuy nhiên, bạn có thể sử dụng biến kiểu generic trong khai báo ngoại lệ. Phương thức dưới đây là hợp lệ**:

```java
public static<T extends Throwable> void doWork(T t) throws T {  
    try{  
        …  
    } catch(Throwable realCause) {  
        t.initCause(realCause);  
        throw t;  
    }  
}
```

Việc sử dụng như trên là hợp lệ.

### Làm thế nào để lấy được kiểu tham số của kiểu generic?

> Vì kiểu generic đã bị xóa, vậy làm thế nào để lấy được kiểu tham số của kiểu generic? Chúng ta có thể sử dụng phản chiếu (`java.lang.reflect.Type`) để lấy kiểu tham số.

`java.lang.reflect.Type` là một giao diện cao cấp chung cho tất cả các kiểu trong Java, đại diện cho tất cả các kiểu trong Java. Các kiểu trong hệ thống `Type` bao gồm: `GenericArrayType` (kiểu mảng chung), `ParameterizedType` (kiểu tham số hóa), `TypeVariable` (biến kiểu), `WildcardType` (kiểu đại diện), `Class` (kiểu nguyên thủy), `Class` (kiểu cơ bản), tất cả các loại này đều triển khai giao diện `Type`.

```java
public class GenericType<T> {  
    private T data;

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public static void main(String[] args) {
        GenericType<String> genericType = new GenericType<String>() {};
        Type superclass = genericType.getClass().getGenericSuperclass();
        // getActualTypeArguments trả về các tham số kiểu chính xác, ví dụ như Map<String, Integer> trả về [String, Integer]
        Type type = ((ParameterizedType) superclass).getActualTypeArguments()[0]; 
        System.out.println(type); // class java.lang.String
    }
}
```

Trong đó, `ParameterizedType` là một giao diện được định nghĩa như sau:

```java
public interface ParameterizedType extends Type {  
    // Trả về các tham số kiểu chính xác, ví dụ như Map<String, Integer> trả về [String, Integer]  
    Type[] getActualTypeArguments();

    // Trả về kiểu được khai báo hiện tại của lớp hoặc giao diện, ví dụ như List<?> trả về List
    Type getRawType();
    
    // Trả về kiểu chủ sở hữu. Ví dụ, nếu kiểu hiện tại là O<T>.I<S>, thì trả về O<T>. Kiểu cấp cao nhất sẽ trả về null
    Type getOwnerType();

}
```
