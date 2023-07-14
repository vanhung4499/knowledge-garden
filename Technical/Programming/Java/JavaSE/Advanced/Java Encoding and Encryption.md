---
title: Java Encoding and Encryption
tags: [java, javase]
categories: [java, javase]
date created: 2023-07-14
date modified: 2023-07-14
---

# Mã hóa và Mã hóa Java

> Keyword: `Base64`, `Băm tin nhắn`, `Chữ ký số`, `Mã hóa đối xứng`, `Mã hóa không đối xứng`, `MD5`, `SHA`, `HMAC`, `AES`, `DES`, `DESede`, `RSA`

## Mã hóa Base64

### Nguyên lý của Base64

Mã hóa Base64 là một phương pháp biểu diễn một chuỗi các byte bằng một chuỗi các ký tự ASCII đọc được, dễ dàng truyền tải qua các giao thức văn bản như HTTP và SMTP.

Base64 là một quy ước mã hóa phổ biến, được sử dụng để chuyển đổi dữ liệu nhị phân thành chuỗi ASCII đọc được bởi con người. Mặc dù đôi khi chúng ta nghe thấy việc sử dụng Base64 để mã hóa và giải mã, nhưng việc mã hóa và giải mã thực tế chỉ đề cập đến quá trình **mã hóa (encode)** và **giải mã (decode)**, quá trình chuyển đổi này rất đơn giản và chỉ giúp tránh việc nhận dạng thông tin trực tiếp.

Thuật toán Base64 chủ yếu là chuyển đổi các ký tự đã cho thành mã ký tự (như mã ASCII, mã UTF-8):

1. Chuyển đổi chuỗi đã cho thành mã ký tự tương ứng.
2. Chuyển đổi mã ký tự thành mã nhị phân.
3. Chuyển đổi mã nhị phân thành các nhóm 6 bit, mỗi nhóm 3 byte, chuyển đổi thành 4 nhóm 6 bit (khi không đủ 6 bit, thêm các bit 0 vào phần thấp). Đây là quá trình chuyển đổi nhóm, độ dài của 3 byte nhị phân và 4 byte nhị phân đều là 24 bit (3 * 8 = 4 * 6 = 24).
4. Bổ sung các bit vào mã nhị phân 4-6, thêm 2 bit 0 vào phần cao, tạo thành 4 byte nhị phân.
5. Chuyển đổi mã nhị phân 4-8 thành mã thập phân.
6. Chuyển đổi mã thập phân thành ký tự tương ứng trong bảng mã Base64.

**_Bảng mã Base64_**

| **Chỉ mục** | **Ký tự tương ứng** | **Chỉ mục** | **Ký tự tương ứng** | **Chỉ mục** | **Ký tự tương ứng** | **Chỉ mục** | **Ký tự tương ứng** |
| ----------- | ----------------- | ----------- | ----------------- | ----------- | ----------------- | ----------- | ----------------- |
| 0           | A                 | 17          | R                 | 34          | i                 | 51          | z                 |
| 1           | B                 | 18          | S                 | 35          | j                 | 52          | 0                 |
| 2           | C                 | 19          | T                 | 36          | k                 | 53          | 1                 |
| 3           | D                 | 20          | U                 | 37          | l                 | 54          | 2                 |
| 4           | E                 | 21          | V                 | 38          | m                 | 55          | 3                 |
| 5           | F                 | 22          | W                 | 39          | n                 | 56          | 4                 |
| 6           | G                 | 23          | X                 | 40          | o                 | 57          | 5                 |
| 7           | H                 | 24          | Y                 | 41          | p                 | 58          | 6                 |
| 8           | I                 | 25          | Z                 | 42          | q                 | 59          | 7                 |
| 9           | J                 | 26          | a                 | 43          | r                 | 60          | 8                 |
| 10          | K                 | 27          | b                 | 44          | s                 | 61          | 9                 |
| 11          | L                 | 28          | c                 | 45          | t                 | 62          | +                 |
| 12          | M                 | 29          | d                 | 46          | u                 | 63          | /                 |
| 13          | N                 | 30          | e                 | 47          | v                 |             |                   |
| 14          | O                 | 31          | f                 | 48          | w                 |             |                   |
| 15          | P                 | 32          | g                 | 49          | x                 |             |                   |
| 16          | Q                 | 33          | h                 | 50          | y                 |             |                   |

### Ứng dụng của Base64

Mã hóa Base64 có thể được sử dụng để truyền tải thông tin định danh dài trong môi trường HTTP. Trong các ứng dụng khác, chúng thường cần mã hóa dữ liệu nhị phân thành định dạng phù hợp để đặt trong URL (bao gồm các trường ẩn của biểu mẫu). Lúc này, việc sử dụng Base64 mã hóa có tính không đọc được, có nghĩa là dữ liệu được mã hóa không thể nhìn thấy trực tiếp, có thể coi là một hình thức mã hóa.

Tuy nhiên, **Base64 không phù hợp để trực tiếp đặt trong URL**, vì trình mã hóa URL sẽ chuyển đổi các ký tự `/` và `+` trong Base64 tiêu chuẩn thành dạng `%XX`, và các dấu `%` này cần được chuyển đổi lại khi lưu vào cơ sở dữ liệu, vì ANSI SQL đã sử dụng dấu `%` làm ký tự đại diện.

Để giải quyết vấn đề này, có thể sử dụng một phiên bản cải tiến của Base64 mã hóa cho URL, nó không chỉ thêm ký tự ` = ` vào cuối, mà còn thay thế `+` và `/` trong Base64 tiêu chuẩn bằng `-` và `_`, điều này giúp tránh việc tăng độ dài thông tin mã hóa trong quá trình mã hóa URL và lưu trữ trong cơ sở dữ liệu, đồng thời thống nhất định dạng của định danh đối tượng trong cơ sở dữ liệu, biểu mẫu, v.v.

Cũng có một biến thể của Base64 được sử dụng cho biểu thức chính quy, nó thay thế `+` và `/` bằng `!` và `-`, bởi vì `+`, `*` và các ký tự `[` và `]` đã được sử dụng trong biểu thức chính quy.

【Ví dụ】Mã hóa, giải mã `java.util.Base64`

`Base64.getEncoder()` và `Base64.getDecoder()` cung cấp cách mã hóa và giải mã Base64 tiêu chuẩn;

`Base64.getUrlEncoder()` và `Base64.getUrlDecoder()` cung cấp cách mã hóa và giải mã Base64 an toàn cho URL (thay thế `+` và `/` bằng `-` và `_`).

```java
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class Base64Demo {

    public static void main(String[] args) {
        String url = "https://www.google.com";
        System.out.println("url:" + url);
        // Mã hóa, giải mã Base64 tiêu chuẩn
        byte[] encoded = Base64.getEncoder().encode(url.getBytes(StandardCharsets.UTF_8));
        byte[] decoded = Base64.getDecoder().decode(encoded);
        System.out.println("Url Safe Base64 encoded:" + new String(encoded));
        System.out.println("Url Safe Base64 decoded:" + new String(decoded));
        // Mã hóa, giải mã Base64 an toàn cho URL
        byte[] encoded2 = Base64.getUrlEncoder().encode(url.getBytes(StandardCharsets.UTF_8));
        byte[] decoded2 = Base64.getUrlDecoder().decode(encoded2);
        System.out.println("Base64 encoded:" + new String(encoded2));
        System.out.println("Base64 decoded:" + new String(decoded2));
    }

}
```

Kết quả:

```
url:https://www.google.com
Url Safe Base64 encoded:aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbQ==
Url Safe Base64 decoded:https://www.google.com
Base64 encoded:aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbQ==
Base64 decoded:https://www.google.com
```

# Băm tin nhắn

### Tổng quan về băm tin nhắn

**Băm tin nhắn, thực chất là sử dụng hàm băm (Hash) để tính toán giá trị băm của dữ liệu cần băm**.

Băm tin nhắn là một giá trị có độ dài cố định duy nhất tương ứng với một tin nhắn hoặc văn bản. Nó được tạo ra bằng cách áp dụng một hàm băm một chiều lên tin nhắn. Nếu tin nhắn thay đổi trong quá trình truyền, người nhận có thể so sánh giá trị băm mới của tin nhắn với giá trị băm ban đầu để kiểm tra xem tin nhắn có bị thay đổi hay không. Do đó, băm tin nhắn đảm bảo tính toàn vẹn của tin nhắn. Băm tin nhắn sử dụng hàm băm một chiều để chuyển đổi văn bản cần băm thành một chuỗi mã hóa. Chuỗi mã hóa này còn được gọi là vân tay số (Finger Print). Nó có độ dài cố định và khác nhau cho mỗi văn bản đầu vào. Điều này giúp chuỗi mã hóa trở thành "vân tay" để xác minh tính toàn vẹn của văn bản.

### Đặc điểm của băm tin nhắn

- Độc nhất: Chỉ cần dữ liệu thay đổi một chút, giá trị băm tính toán từ đó cũng sẽ thay đổi. Mặc dù lý thuyết có thể xảy ra va chạm, nhưng xác suất rất thấp.
- Không thể đảo ngược: Không thể giải mã giá trị băm của hàm băm tin nhắn.
- Không cần khóa, có thể sử dụng trong mạng phân tán.
- Dù đầu vào có độ dài như thế nào, giá trị băm tính toán từ đó vẫn có độ dài cố định.

### Các thuật toán băm tin nhắn phổ biến

Các thuật toán băm tin nhắn bao gồm **MD (Message Digest, thuật toán băm tin nhắn)**, **SHA (Secure Hash Algorithm, thuật toán băm an toàn)**, **MAC (Message Authentication Code, thuật toán mã xác thực tin nhắn)**. Các thuật toán này thường được sử dụng để xác minh tính toàn vẹn của dữ liệu và là nhân tố quan trọng trong thuật toán chữ ký số.

**MD5** và **SHA1** là hai thuật toán đại diện cho các dòng thuật toán băm tin nhắn **MD** và **SHA**.

Hiện nay, MD5 đã được phát hiện có nhiều lỗ hổng, do đó không còn an toàn. Thuật toán SHA có độ dài mã băm lớn hơn và cũng an toàn hơn so với thuật toán MD.

### Ứng dụng của băm tin nhắn

#### Ví dụ về MD5, SHA

Cách sử dụng MD5 và SHA trong JDK cơ bản giống nhau, các bước như sau:

1. Khởi tạo đối tượng MessageDigest
2. Cập nhật nội dung cần tính toán
3. Tạo giá trị băm

```java
import java.security.MessageDigest;
import java.util.Base64;

public class MessageDigestDemo {

    public static byte[] encode(byte[] input, Type type) throws Exception {
        // Khởi tạo đối tượng băm tin nhắn dựa trên loại
        MessageDigest md5Digest = MessageDigest.getInstance(type.getName());

        // Cập nhật nội dung cần tính toán
        md5Digest.update(input);

        // Hoàn thành tính toán băm, trả về giá trị băm
        return md5Digest.digest();
    }

    public static byte[] encodeWithBase64(byte[] input, Type type) throws Exception {
        return Base64.getUrlEncoder().encode(encode(input, type));
    }

    public static String encodeWithBase64String(byte[] input, Type type) throws Exception {
        return Base64.getUrlEncoder().encodeToString(encode(input, type));
    }

    public enum Type {
        MD2("MD2"),
        MD5("MD5"),
        SHA1("SHA1"),
        SHA256("SHA-256"),
        SHA384("SHA-384"),
        SHA512("SHA-512");

        private String name;

        Type(String name) {
            this.name = name;
        }

        public String getName() {
            return this.name;
        }
    }

    public static void main(String[] args) throws Exception {
        String msg = "Hello World!";
        System.out.println("MD2: " + encodeWithBase64String(msg.getBytes(), Type.MD2));
        System.out.println("MD5: " + encodeWithBase64String(msg.getBytes(), Type.MD5));
        System.out.println("SHA1: " + encodeWithBase64String(msg.getBytes(), Type.SHA1));
        System.out.println("SHA256: " + encodeWithBase64String(msg.getBytes(), Type.SHA256));
        System.out.println("SHA384: " + encodeWithBase64String(msg.getBytes(), Type.SHA384));
        System.out.println("SHA512: " + encodeWithBase64String(msg.getBytes(), Type.SHA512));
    }

}
```

【Kết quả】

```
MD2: MV98ZyI_Aft8q0uVEA6HLg==
MD5: 7Qdih1MuhjZehB6Sv8UNjA==
SHA1: Lve95gjOVATpfV8EL5X4nxwjKHE=
SHA256: f4OxZX_x_FO5LcGBSKHWXfwtSx-j1ncoSt3SABJtkGk=
SHA384: v9dsDrvQBv7lg0EFR8GIewKSvnbVgtlsJC0qeScj4_1v0GH51c_RO4-WE1jmrbpK
SHA512: hhhE1nBOhXP-w02WfiC8_vPUJM9IvgTm3AjyvVjHKXQzcQFerYkcw88cnTS0kmS1EHUbH_nlN5N7xGtdb_TsyA==
```

#### Ví dụ về HMAC

```java

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class HmacMessageDigest {

    public static void main(String[] args) throws Exception {
        String msg = "Hello World!";
        byte[] salt = "My Salt".getBytes(StandardCharsets.UTF_8);
        System.out.println("Plaintext: " + msg);
        System.out.println("HmacMD5: " + encodeWithBase64String(msg.getBytes(), salt, HmacTypeEn.HmacMD5));
        System.out.println("HmacSHA1: " + encodeWithBase64String(msg.getBytes(), salt, HmacTypeEn.HmacSHA1));
        System.out.println("HmacSHA256: " + encodeWithBase64String(msg.getBytes(), salt, HmacTypeEn.HmacSHA256));
        System.out.println("HmacSHA384: " + encodeWithBase64String(msg.getBytes(), salt, HmacTypeEn.HmacSHA384));
        System.out.println("HmacSHA512: " + encodeWithBase64String(msg.getBytes(), salt, HmacTypeEn.HmacSHA512));
    }

    public static byte[] encode(byte[] plaintext, byte[] salt, HmacTypeEn type) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(salt, type.name());
        Mac mac = Mac.getInstance(keySpec.getAlgorithm());
        mac.init(keySpec);
        return mac.doFinal(plaintext);
    }

    public static byte[] encodeWithBase64(byte[] plaintext, byte[] salt, HmacTypeEn type) throws Exception {
        return Base64.getUrlEncoder().encode(encode(plaintext, salt, type));
    }

    public static String encodeWithBase64String(byte[] plaintext, byte[] salt, HmacTypeEn type) throws Exception {
        return Base64.getUrlEncoder().encodeToString(encode(plaintext, salt, type));
    }

    /**
     * JDK hỗ trợ HmacMD5, HmacSHA1, HmacSHA256, HmacSHA384, HmacSHA512
     */
    public enum HmacTypeEn {

        HmacMD5, HmacSHA1, HmacSHA256, HmacSHA384, HmacSHA512;
    }

}
```

**Kết quả**

```
Plaintext: Hello World!
HmacMD5: re6BLRsB1Q26SfJTwXZUSQ==
HmacSHA1: CFu8a9H6CbY9C5fo0OmJ2bnuILM=
HmacSHA256: Z1czUqDWWfYYl7qEDJ2sUH6iieHVI7o83dXMl0JYER0=
HmacSHA384: 34mKtRQBOYnwwznmQubjrDk_MsLDGqM2PmgcplZUpLsKNrG_cwfz4bLPJCbBW88b
HmacSHA512: 6n77htTZ_atc04-SsmxhSK3wzh1sAmdudCl0Cb_RZp4DpienG4LZkhXMbq8lcK7XSnz6my_wIpnStDp6PC_-5w==
```

## Chữ ký số

### Tổng quan về chữ ký số

Thuật toán chữ ký số có thể được coi là một thuật toán băm tin nhắn với khóa bí mật và khóa công khai. Nói cách khác, **chữ ký số là sự kết hợp của thuật toán mã hóa không đối xứng và thuật toán băm tin nhắn**.

Thuật toán chữ ký số yêu cầu có khả năng xác minh tính toàn vẹn dữ liệu, xác thực nguồn gốc dữ liệu và có khả năng chống phủ nhận.

Thuật toán chữ ký số bao gồm hai hoạt động: ký và xác minh.

Khi ký, chúng ta sử dụng khóa bí mật và dữ liệu cần ký, trong khi khi xác minh, chúng ta cần sử dụng khóa công khai, giá trị chữ ký và dữ liệu cần xác minh. Thuật toán chính của nó chủ yếu là thuật toán băm tin nhắn.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230714130724.png)

Các thuật toán chữ ký số phổ biến: **RSA**, **DSA**, **ECDSA**

### Ứng dụng của thuật toán chữ ký số

#### Ví dụ về DSA

Chữ ký số có hai quy trình: ký và xác minh.

Điều kiện tiên quyết cho cả hai là có một cặp khóa công khai, khóa bí mật.

Chữ ký số sử dụng khóa bí mật để tính toán chữ ký cho tin nhắn.

【Ví dụ】Xác minh tóm tắt bằng khóa công khai

```java
public class DsaCoder {

    public static final String KEY_ALGORITHM = "DSA";

    public static final String SIGN_ALGORITHM = "SHA1withDSA";

    /**
     * Độ dài khóa DSA mặc định là 1024 bit. Độ dài khóa phải là bội số của 64 và nằm trong khoảng từ 512 đến 1024
     */
    private static final int KEY_SIZE = 1024;

    private KeyPair keyPair;

    public DsaCoder() throws Exception {
        this.keyPair = initKey();
    }

    private KeyPair initKey() throws Exception {
        // Khởi tạo bộ tạo cặp khóa
        KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance(DsaCoder.KEY_ALGORITHM);
        // Khởi tạo bộ tạo cặp khóa
        keyPairGen.initialize(KEY_SIZE);
        // Khởi tạo cặp khóa
        return keyPairGen.genKeyPair();
    }

    public byte[] signature(byte[] data, byte[] privateKey) throws Exception {
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(privateKey);
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
        PrivateKey key = keyFactory.generatePrivate(keySpec);

        Signature signature = Signature.getInstance(SIGN_ALGORITHM);
        signature.initSign(key);
        signature.update(data);
        return signature.sign();
    }

    public byte[] getPrivateKey() {
        return keyPair.getPrivate().getEncoded();
    }

    public boolean verify(byte[] data, byte[] publicKey, byte[] sign) throws Exception {
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(publicKey);
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
        PublicKey key = keyFactory.generatePublic(keySpec);

        Signature signature = Signature.getInstance(SIGN_ALGORITHM);
        signature.initVerify(key);
        signature.update(data);
        return signature.verify(sign);
    }

    public byte[] getPublicKey() {
        return keyPair.getPublic().getEncoded();
    }

    public static void main(String[] args) throws Exception {
        String msg = "Xin chào thế giới";
        DsaCoder dsa = new DsaCoder();
        byte[] sign = dsa.signature(msg.getBytes(), dsa.getPrivateKey());
        boolean flag = dsa.verify(msg.getBytes(), dsa.getPublicKey(), sign);
        String result = flag ? "Chữ ký số khớp" : "Chữ ký số không khớp";
        System.out.println("Chữ ký số: " + Base64.getUrlEncoder().encodeToString(sign));
        System.out.println("Kết quả xác minh: " + result);
    }

}
```

【Đầu ra】

```
Chữ ký số: MCwCFCfzETyEfIjvhwPd6ycqQnQxfVZBAhR5rx4KnGXaOytSZkFzLtRI_LZleg==
Kết quả xác minh: Chữ ký số khớp
```

## Mã hóa đối xứng (Symmetric Encryption)

### Tổng quan về mã hóa đối xứng

Các thuật toán mã hóa đối xứng chính bao gồm DES, 3DES (TripleDES), AES, IDEA, RC2, RC4, RC5, Blowfish, v.v

Mã hóa đối xứng là một thuật toán mã hóa được áp dụng từ lâu, kỹ thuật đã được trưởng thành. Trong thuật toán mã hóa đối xứng, bên gửi dữ liệu sẽ sử dụng thuật toán mã hóa đặc biệt để xử lý văn bản rõ (dữ liệu gốc) cùng với khóa mã hóa (mật khẩu), biến chúng thành văn bản mã hóa phức tạp và gửi đi. Bên nhận nhận được văn bản mã hóa, nếu muốn đọc văn bản gốc, phải sử dụng khóa mã hóa đã sử dụng và thuật toán nghịch đảo của cùng một thuật toán để giải mã văn bản mã hóa, trả về văn bản rõ có thể đọc được. Trong thuật toán mã hóa đối xứng, chỉ sử dụng một khóa, cả hai bên gửi và nhận đều sử dụng khóa này để mã hóa và giải mã dữ liệu, điều này yêu cầu bên giải mã phải biết trước khóa mã hóa.

Đặc điểm của mã hóa đối xứng:

- Ưu điểm: Tính toán nhỏ, tốc độ mã hóa nhanh, hiệu suất mã hóa cao.
- Nhược điểm: Thuật toán là công khai, không đảm bảo tính bảo mật.

Mỗi khi hai bên truyền thông sử dụng thuật toán mã hóa đối xứng, họ cần sử dụng một khóa duy nhất mà người khác không biết, điều này làm cho số lượng khóa mà hai bên truyền thông sở hữu tăng lên theo cấp số học, quản lý khóa trở thành gánh nặng cho người dùng. Thuật toán mã hóa đối xứng khó sử dụng trên hệ thống mạng phân tán, chủ yếu là do quản lý khóa khó khăn, chi phí sử dụng cao.

So với mã hóa công khai và khóa bí mật, thuật toán mã hóa đối xứng có thể cung cấp chức năng mã hóa và xác thực nhưng thiếu chức năng chữ ký số, làm hạn chế phạm vi sử dụng.

#### Nguyên lý mã hóa đối xứng

Mã hóa đối xứng yêu cầu mã hóa và giải mã sử dụng cùng một khóa, giải mã là phép tính nghịch đảo của mã hóa. Vì mã hóa và giải mã sử dụng cùng một khóa, điều này yêu cầu cả hai bên truyền thông phải thỏa thuận trước khóa này và lưu trữ khóa một cách an toàn.

Hệ thống mã hóa đối xứng được chia thành hai loại:

Một loại là thực hiện phép toán trên từng bit đơn lẻ của văn bản rõ (hoặc byte), được gọi là mã hóa dòng (stream cipher) hoặc mã hóa chuỗi (mã hóa tuần tự);

Một loại là chia thông tin văn bản rõ thành các nhóm (hoặc khối) khác nhau, mã hóa và giải mã từng nhóm riêng lẻ, được gọi là mã hóa khối (block cipher).

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230714132556.png)

#### Các chế độ làm việc của mã hóa đối xứng

Lấy ví dụ về chế độ làm việc của thuật toán DES, thuật toán DES dựa trên kích thước của các nhóm văn bản rõ (56 bit), chia dữ liệu thành các khối mã hóa 56 bit và mã hóa từng khối riêng lẻ. Nếu còn lại ít hơn một khối, gọi là **khối ngắn**. Có các phương pháp xử lý khối ngắn như phương pháp điền, phương pháp mã hóa dòng, kỹ thuật sử dụng văn bản mã hóa.

Dựa trên cách mà các khối mã hóa liên quan đến dữ liệu được mã hóa, chúng có thể được phân thành các chế độ làm việc sau:

**(1) Chế độ sách điện tử (Electronic Code Book, ECB)**

Sử dụng: Phù hợp để mã hóa khóa, số ngẫu nhiên và dữ liệu ngắn. Ví dụ, để truyền khóa DES an toàn, ECB là chế độ phù hợp nhất.

**(2) Chế độ mã hóa liên kết (Cipher Booki Chaining, CBC)**

Sử dụng: Có thể mã hóa dữ liệu có độ dài bất kỳ, phù hợp để tính toán xác thực dữ liệu bằng cách tạo mã xác thực MAC.

**(3) Chế độ phản hồi mã hóa (Cipher Feed Back, CFB)**

Sử dụng: Vì lỗi truyền thông không có giới hạn, nên có thể được sử dụng để phát hiện sự thay đổi văn bản rõ và văn bản mã hóa.

**(4) Chế độ phản hồi đầu ra (Output Feed Back, OFB)**

Sử dụng: Sử dụng cho dữ liệu có tính chất dư thừa lớn, chẳng hạn như dữ liệu giọng nói và hình ảnh.

Ngoài 4 chế độ trên, thuật toán AES còn có một chế độ làm việc mới:

**(5) Chế độ bộ đếm (Counter, CTR)**

Sử dụng: Phù hợp cho các ứng dụng mã hóa khác nhau.

Bài viết này sẽ giới thiệu về nguyên lý của các chế độ làm việc trên. Cá nhân tôi nghĩ, như một ứng dụng kỹ thuật, chỉ cần hiểu về mục đích sử dụng là đủ.

#### Phương pháp điền cho mã hóa đối xứng

Trong Java, mã hóa đối xứng thường sử dụng phương pháp điền.

Các phương pháp thông dụng là: NoPadding (không điền), Zeros Padding (điền 0), PKCS5Padding (điền PKCS5).

**ZerosPadding**

Phương pháp: Tất cả các byte được điền bằng 0.

Kết quả như sau:

F1 F2 F3 F4 F5 F6 F7 F8 // khối 1

F9 00 00 00 00 00 00 00 // khối 2

**PKCS5Padding**

Phương pháp: Mỗi byte điền đều ghi lại tổng số byte đã điền.

Kết quả như sau:

F1 F2 F3 F4 F5 F6 F7 F8 // khối 1

F9 07 07 07 07 07 07 07 // khối 2

### Ứng dụng mã hóa đối xứng

#### Quy trình mã hóa dựa trên khóa (DES, DESede, AES và IDEA)

Các thuật toán DES, DESede, AES và IDEA đều là các thuật toán mã hóa đối xứng dựa trên khóa, và quy trình thực hiện của chúng cũng tương tự nhau. Các bước như sau:

(1) Tạo khóa

```java
KeyGenerator kg = KeyGenerator.getInstance("DES");
SecureRandom random = new SecureRandom();
kg.init(random);
SecretKey secretKey = kg.generateKey();
```

Khuyến nghị sử dụng số ngẫu nhiên để khởi tạo quá trình tạo khóa.

(2) Khởi tạo đối tượng Cipher

```java
Cipher cipher = Cipher.getInstance("DES/ECB/PKCS5Padding");
cipher.init(Cipher.ENCRYPT_MODE, secretKey);
```

`ENCRYPT_MODE`: Chế độ mã hóa

`DECRYPT_MODE`: Chế độ giải mã

(3) Thực hiện

```java
String plaintext = "Hello World";
byte[] ciphertext = cipher.doFinal(plaintext.getBytes());
```

Một ví dụ hoàn chỉnh về mã hóa và giải mã DES:

```java
import javax.crypto.*;
import java.security.*;
import java.util.Base64;

public class DESCoder {

    public static final String KEY_ALGORITHM_DES = "DES";
    public static final String CIPHER_DES_DEFAULT = "DES";
    public static final String CIPHER_DES_ECB_PKCS5PADDING = "DES/ECB/PKCS5Padding";

    private Key key;
    private Cipher cipher;
    private String transformation;

    public DESCoder() throws NoSuchAlgorithmException, NoSuchPaddingException {
        this.key = initKey();
        this.cipher = Cipher.getInstance(CIPHER_DES_DEFAULT);
        this.transformation = CIPHER_DES_DEFAULT;
    }

    private Key initKey() throws NoSuchAlgorithmException {
        SecureRandom secureRandom = null;
        secureRandom = new SecureRandom();

        KeyGenerator keyGen = KeyGenerator.getInstance(KEY_ALGORITHM_DES);
        keyGen.init(secureRandom);
        return keyGen.generateKey();
    }

    public DESCoder(String transformation) throws NoSuchAlgorithmException, NoSuchPaddingException {
        this.key = initKey();
        this.cipher = Cipher.getInstance(transformation);
        this.transformation = transformation;
    }

    public byte[] encrypt(byte[] input) throws InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
        cipher.init(Cipher.ENCRYPT_MODE, key);
        return cipher.doFinal(input);
    }

    public byte[] decrypt(byte[] input) throws InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
        cipher.init(Cipher.DECRYPT_MODE, key);
        return cipher.doFinal(input);
    }

    public static void main(String[] args) throws Exception {
        DESCoder des = new DESCoder(CIPHER_DES_ECB_PKCS5PADDING);

        String message = "Hello World!";
        System.out.println("Plaintext: " + message);
        byte[] encoded = des.encrypt(message.getBytes());
        String encodedBase64 = Base64.getUrlEncoder().encodeToString(encoded);
        System.out.println("Ciphertext: " + encodedBase64);

        byte[] decodedBase64 = Base64.getUrlDecoder().decode(encodedBase64);
        byte[] decoded = des.decrypt(decodedBase64);
        System.out.println("Decrypted: " + new String(decoded));
    }

}
```

**Kết quả**

```
Plaintext: Hello World!
Ciphertext: jhgAv0zVYPH9qxmU8bjSng==
Decrypted: Hello World!
```

#### Quy trình mã hóa dựa trên mật khẩu (PBE)

DES, DESede, AES và IDEA là những thuật toán mã hóa đối xứng phổ biến, tuy nhiên không phải tất cả các thuật toán mã hóa đối xứng đều hoạt động theo cùng một cách.

Mã hóa dựa trên mật khẩu (Password Based Encryption, PBE) là một thuật toán mã hóa đối xứng dựa trên mật khẩu. Đặc điểm của nó là người dùng tự quản lý mật khẩu và sử dụng các phương pháp như số ngẫu nhiên (gọi là muối) và mã hóa đa lớp để đảm bảo tính bảo mật của dữ liệu.

PBE không có khái niệm về khóa, trong các thuật toán mã hóa đối xứng khác, khóa được tính toán ra từ các phép tính, trong khi PBE sử dụng mật khẩu thay thế cho khóa.

Quy trình như sau:

**1. Tạo muối**

```java
SecureRandom secureRandom = new SecureRandom();
byte[] salt = secureRandom.generateSeed(8); // Độ dài salt phải là 8 byte
```

**2. Tạo khóa dựa trên mật khẩu**

```java
String password = "123456";
PBEKeySpec keySpec = new PBEKeySpec(password.toCharArray());
SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(KEY_ALGORITHM);
SecretKey secretKey = keyFactory.generateSecret(keySpec);
```

**3. Khởi tạo đối tượng mã hóa hoặc giải mã**

```java
PBEParameterSpec paramSpec = new PBEParameterSpec(salt, ITERATION_COUNT);
Cipher cipher = Cipher.getInstance(KEY_ALGORITHM);
cipher.init(Cipher.ENCRYPT_MODE, secretKey, paramSpec);
```

**4. Thực hiện**

```java
byte[] plaintext = "Hello World".getBytes();
byte[] ciphertext = cipher.doFinal(plaintext);
```

**5. Ví dụ PBE đầy đủ**

```java
import javax.crypto.*;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.PBEParameterSpec;
import java.security.*;
import java.util.Base64;

public class PBECoder {

    public static final String KEY_ALGORITHM = "PBEWITHMD5andDES";
    public static final int ITERATION_COUNT = 100;

    private Key key;
    private byte[] salt;

    public PBECoder(String password) throws Exception {
        this.salt = initSalt();
        this.key = initKey(password);
    }

    private byte[] initSalt() {
        SecureRandom secureRandom = new SecureRandom();
        return secureRandom.generateSeed(8); // Độ dài salt phải là 8 byte
    }

    private Key initKey(String password) throws Exception {
        PBEKeySpec keySpec = new PBEKeySpec(password.toCharArray());
        SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(KEY_ALGORITHM);
        return keyFactory.generateSecret(keySpec);
    }

    public byte[] encrypt(byte[] plaintext) throws Exception {
        PBEParameterSpec paramSpec = new PBEParameterSpec(salt, ITERATION_COUNT);
        Cipher cipher = Cipher.getInstance(KEY_ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, key, paramSpec);
        return cipher.doFinal(plaintext);
    }

    public byte[] decrypt(byte[] ciphertext) throws Exception {
        PBEParameterSpec paramSpec = new PBEParameterSpec(salt, ITERATION_COUNT);
        Cipher cipher = Cipher.getInstance(KEY_ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, key, paramSpec);
        return cipher.doFinal(ciphertext);
    }

    public static void main(String[] args) throws Exception {
        PBECoder pbe = new PBECoder("123456");

        String message = "Hello World!";
        byte[] ciphertext = pbe.encrypt(message.getBytes());
        byte[] plaintext = pbe.decrypt(ciphertext);

        System.out.println("Plaintext: " + message);
        System.out.println("Ciphertext: " + Base64.getUrlEncoder().encodeToString(ciphertext));
        System.out.println("Decrypted: " + new String(plaintext));
    }

}
```

**Kết quả**

```
Plaintext: Hello World!
Ciphertext: lJf2E92X-hVq-X_3gUMkPQ==
Decrypted: Hello World!
```

## Mã hóa không đối xứng

### Tổng quan về mã hóa không đối xứng

Các thuật toán mã hóa không đối xứng phổ biến bao gồm DH (Diffie-Hellman, thuật toán trao đổi khóa) và RSA.

Mã hóa không đối xứng và mã hóa đối xứng khác nhau chủ yếu ở chỗ mã hóa và giải mã sử dụng các khóa khác nhau. Một khóa được công khai, gọi là khóa công khai (public key); một khóa được bảo mật, gọi là khóa riêng tư (private key). Do đó, mã hóa không đối xứng còn được gọi là mã hóa hai khóa hoặc mã hóa công khai.

Đặc điểm của mã hóa không đối xứng:

- Ưu điểm: Thuật toán mã hóa không đối xứng giải quyết vấn đề phân phối khóa của thuật toán mã hóa đối xứng và cải thiện đáng kể tính bảo mật của thuật toán.
- Nhược điểm: Thuật toán phức tạp hơn thuật toán đối xứng, do đó tốc độ mã hóa và giải mã chậm hơn nhiều.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230714143154.png)

Quy trình cơ bản để thực hiện trao đổi thông tin bảo mật bằng mã hóa không đối xứng là: Bên A tạo một cặp khóa và công khai một trong hai khóa làm khóa công khai; Bên B sử dụng khóa công khai để mã hóa thông tin và gửi cho Bên A; Bên A sử dụng khóa riêng tư của mình để giải mã thông tin.

Một khía cạnh khác, Bên A có thể sử dụng khóa công khai của Bên B để ký số liệu trước khi gửi cho Bên B; Bên B sử dụng khóa riêng tư của mình để xác minh dữ liệu.

Bên A chỉ có thể giải mã bằng khóa riêng tư của mình thông qua khóa công khai của Bên B. Từ đó, thuật toán mã hóa không đối xứng đảm bảo tính bảo mật của việc trao đổi khóa cuối cùng giữa người dùng.

### Ứng dụng của thuật toán mã hóa không đối xứng

```java
package com.hnv99.javacore.crypto;

import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import javax.crypto.Cipher;

/**
 * RSA Security Code: Thuật toán mã hóa không đối xứng. Nó được sử dụng để mã hóa, giải mã và ký số.
 */
public class RSACoder {

    public final static String KEY_ALGORITHM = "RSA";

    public final static String SIGN_ALGORITHM = "MD5WithRSA";

    private KeyPair keyPair;

    public RSACoder() throws Exception {
        this.keyPair = initKeyPair();
    }

    private KeyPair initKeyPair() throws Exception {
        // Lớp KeyPairGenerator được sử dụng để tạo cặp khóa công khai và khóa riêng, dựa trên thuật toán RSA
        KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance(KEY_ALGORITHM);
        // Khởi tạo bộ tạo cặp khóa, kích thước khóa là 1024 bit
        keyPairGen.initialize(1024);
        // Tạo một cặp khóa
        return keyPairGen.genKeyPair();
    }

    public byte[] encryptByPrivateKey(byte[] plaintext, byte[] key) throws Exception {
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(key);
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
        PrivateKey privateKey = keyFactory.generatePrivate(keySpec);
        Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
        cipher.init(Cipher.ENCRYPT_MODE, privateKey);
        return cipher.doFinal(plaintext);
    }

    public byte[] decryptByPublicKey(byte[] ciphertext, byte[] key) throws Exception {
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(key);
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
        PublicKey publicKey = keyFactory.generatePublic(keySpec);
        Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
        cipher.init(Cipher.DECRYPT_MODE, publicKey);
        return cipher.doFinal(ciphertext);
    }

    public byte[] encryptByPublicKey(byte[] plaintext, byte[] key) throws Exception {
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(key);
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
        PublicKey publicKey = keyFactory.generatePublic(keySpec);
        Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        return cipher.doFinal(plaintext);
    }

    public byte[] decryptByPrivateKey(byte[] ciphertext, byte[] key) throws Exception {
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(key);
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
        PrivateKey privateKey = keyFactory.generatePrivate(keySpec);
        Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        return cipher.doFinal(ciphertext);
    }

    public byte[] signature(byte[] data, byte[] privateKey, RsaSignTypeEn type) throws Exception {
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(privateKey);
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
        PrivateKey key = keyFactory.generatePrivate(keySpec);

        Signature signature = Signature.getInstance(type.name());
        signature.initSign(key);
        signature.update(data);
        return signature.sign();
    }

    public byte[] getPrivateKey() {
        return keyPair.getPrivate().getEncoded();
    }

    public boolean verify(byte[] data, byte[] publicKey, byte[] sign, RsaSignTypeEn type) throws Exception {
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(publicKey);
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
        PublicKey key = keyFactory.generatePublic(keySpec);

        Signature signature = Signature.getInstance(type.name());
        signature.initVerify(key);
        signature.update(data);
        return signature.verify(sign);
    }

    public byte[] getPublicKey() {
        return keyPair.getPublic().getEncoded();
    }

    public enum RsaSignTypeEn {

        MD2WithRSA,
        MD5WithRSA,
        SHA1WithRSA
    }

    public static void main(String[] args) throws Exception {
        String msg = "Em ăn cơm chưa";
        RSACoder coder = new RSACoder();
        // Mã hóa bằng khóa riêng, giải mã bằng khóa công khai
        byte[] ciphertext = coder.encryptByPrivateKey(msg.getBytes(StandardCharsets.UTF_8), coder.keyPair.getPrivate().getEncoded());
        byte[] plaintext = coder.decryptByPublicKey(ciphertext, coder.keyPair.getPublic().getEncoded());

        // Mã hóa bằng khóa công khai, giải mã bằng khóa riêng
        byte[] ciphertext2 = coder.encryptByPublicKey(msg.getBytes(), coder.keyPair.getPublic().getEncoded());
        byte[] plaintext2 = coder.decryptByPrivateKey(ciphertext2, coder.keyPair.getPrivate().getEncoded());

        byte[] sign = coder.signature(msg.getBytes(), coder.getPrivateKey(), RsaSignTypeEn.SHA1WithRSA);
        boolean flag = coder.verify(msg.getBytes(), coder.getPublicKey(), sign, RsaSignTypeEn.SHA1WithRSA);
        String result = flag ? "Khớp chữ ký số" : "Không khớp chữ ký số";

        System.out.println("Văn bản gốc: " + msg);
        System.out.println("Khóa công khai: " + Base64.getUrlEncoder().encodeToString(coder.keyPair.getPublic().getEncoded()));
        System.out.println("Khóa riêng: " + Base64.getUrlEncoder().encodeToString(coder.keyPair.getPrivate().getEncoded()));

        System.out.println("============== Mã hóa bằng khóa riêng, giải mã bằng khóa công khai ==============");
        System.out.println("Văn bản mã hóa: " + Base64.getUrlEncoder().encodeToString(ciphertext));
        System.out.println("Văn bản gốc: " + new String(plaintext));

        System.out.println("============== Mã hóa bằng khóa công khai, giải mã bằng khóa riêng ==============");
        System.out.println("Văn bản mã hóa: " + Base64.getUrlEncoder().encodeToString(ciphertext2));
        System.out.println("Văn bản gốc: " + new String(plaintext2));

        System.out.println("============== Chữ ký số ==============");
        System.out.println("Chữ ký số: " + Base64.getUrlEncoder().encodeToString(sign));
        System.out.println("Kết quả xác minh: " + result);
    }

}
```

**Kết quả**

```
Văn bản gốc: Em ăn cơm chưa
Khóa công khai: MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCeBoLBu2n8iSO517VkBgU9FmosSoD2R1e46YHpLHZKpNCvUJFs8hmtlsPGJz2gllito-YbzkEzamKAeu0kq7MDMxosZcG7BzpBTJR59LJ6kqFEcTxjUTaIx9x7ocNad2M9LGwSuE5o-P8DLHiDxmgejk3PIsoyTUQcgO9z8rmf9QIDAQAB
Khóa riêng: MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAJ4GgsG7afyJI7nXtWQGBT0WaixKgPZHV7jpgeksdkqk0K9QkWzyGa2Ww8YnPaCWWK2j5hvOQTNqYoB67SSrswMzGixlwbsHOkFMlHn0snqSoURxPGNRNojH3Huhw1p3Yz0sbBK4Tmj4_wMseIPGaB6OTc8iyjJNRByA73PyuZ_1AgMBAAECgYAOFsCDq0ToygVQZWX7s_m1l5EBv-a9jmDI0LDPbDJjt0wPxVwh3XfinSV5PjhlX-IqIQm8AuiXP-3mTI9mDJTaGUKxGUfdoBNDzXNMPsOT3WaUWMjrq4In0oME8dfZWqgLqEU8-C0B3QnuXB1CoG4qluF1mVua2Zk6yE8szAEKJQJBANQyk_NRp7WNiZlcw27sEH8LI-CWZdjmclQHzJ0EifQOi6ub9BSkrbnGDcJ741DvNkS4A_e2SnmX3R_4n3bA_yMCQQC-pT8oOE402bgQJA3iGNfUTQOh5igJmtGBVQk8Wm4WLMQQ6zq_ysPJ2y5eewn5ckptPzKpsE8sTaNsns4JMCIHAkA4MHRw9-xa7PHExIWTt7reiUqky-6IMu2PRsltwqftEnT1qkRFux2tlb5LA5c79Tv_kmKqk4DBFe-d6a4AOjbVAkEAuArIfKhWf1jLAvH7YRCAktfCMPICJruJkuQnpVbbPZb7tCWRsoMpHV31VopK5794sBw5aWzmEavlnz9zQZVw0wJBAMfNxnbjjaLfvS_Btnay_U6gkhD5-7eREXaqR3JRH3e-Al5LbGPFmnIGd-1IFid9hsPTL_CEI6QrJ5ueTXVoCj8=
============== Mã hóa bằng khóa riêng, giải mã bằng khóa công khai ==============
Văn bản mã hóa: bziu2I65vBoVyeQsLM2HJubm5TLoYJcaZQ4y4WiGQJTy3Br3B-qR51DI6kPNozk69eYSA9HYjnU9ggvaHP-6guFnuFUqY4nWmPaDxhLrSw7HSoLrt55VARskrHGks13eGEXgyEMF18so686uEDt5GyfvWZBXhy_AVEiBzXLJGuc=
Văn bản gốc: Em ăn cơm chưa
============== Mã hóa bằng khóa công khai, giải mã bằng khóa riêng ==============
Văn bản mã hóa: QEdUcRvdouZDYdoLyxI3bZKrK-bL_5UIf2Lse2CUhaui8wN3DQUcyqRvJbsziJNwZmnWhPICmNa84LHEWirbqVZtP-bIz2yiAmBDEGaDcKRrvTbKNALHC3Cz-6z-epOzYIQx_MgUfUKQsptjuTuf9B_EahK-ncR-UCtKF14X47Y=
Văn bản gốc: Em ăn cơm chưa
============== Chữ ký số ==============
Chữ ký số: RcAB9vxOSHRlVkn3TGNDOVoXfYomTaIBt67cuvGW5CBhvhmZi_nkPr-M9kaEDTAEYKp3Tqm4nCz7z8F22unQqBtYvk7FN84I83E0Nv3VTbjY2ArJzt9u7gBmNSB1-XFJpEmq_LwPElM3PbMGfwWNjtj8XKIPf1W6ygk0Rp_wO7c=
Kết quả xác minh: Khớp chữ ký số

```

## Thuật ngữ

- **Văn bản gốc (Plaintext)**: Đề cập đến thông tin cần được mã hóa. Chữ gốc có thể là văn bản, hình ảnh, dữ liệu nhị phân, v.v.
- **Văn bản mã hóa (Ciphertext)**: Đề cập đến chữ gốc sau khi đã được mã hóa. Chữ mã hóa thường có dạng văn bản, nhị phân, v.v.
- **Mã hóa (Encryption)**: Đề cập đến quá trình chuyển đổi chữ gốc thành chữ mã hóa.
- **Giải mã (Decryption)**: Đề cập đến quá trình chuyển đổi chữ mã hóa thành chữ gốc.
- **Khóa mã hóa (Encryption Key)**: Đề cập đến khóa được sử dụng để thực hiện quá trình mã hóa.
- **Khóa giải mã (Decryption Key)**: Đề cập đến khóa được sử dụng để thực hiện quá trình giải mã.
- **Kênh (Channel)**: Đường truyền thông tin, là phương tiện truyền tải tín hiệu.
