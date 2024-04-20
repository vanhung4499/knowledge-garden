---
title: MiniDB Field & Table
tags:
  - minidb
  - project
categories: 
date created: 2024-04-20
date modified: 2024-04-20
---

# Quản lý trường và bảng

## Lời nói đầu

Chương này cung cấp cái nhìn tổng quan về TBM, cách triển khai Table Manager. TBM thực hiện việc quản lý cấu trúc trường và cấu trúc bảng. Đồng thời, nó giới thiệu ngắn gọn cách phân tích cú pháp các câu lệnh giống SQL được MiniDB sử dụng.

## Trình phân tích cú pháp SQL

Trình phân tích cú pháp thực hiện phân tích cú pháp có cấu trúc của các câu lệnh giống SQL và đóng gói thông tin có trong các câu lệnh thành các lớp tương ứng với các câu lệnh. Các lớp này có thể được tìm thấy trong gói `com.hnv99.minidb.backend.parser.statement`.  

Cú pháp câu lệnh SQL được MiniDB triển khai như sau:

```
<begin statement>
    begin [isolation level (read committedrepeatable read)]
        begin isolation level read committed

<commit statement>
    commit

<abort statement>
    abort

<create statement>
    create table <table name>
    <field name> <field type>
    <field name> <field type>
    ...
    <field name> <field type>
    [(index <field name list>)]
        create table students
        id int32,
        name string,
        age int32,
        (index id name)

<drop statement>
    drop table <table name>
        drop table students

<select statement>
    select (*<field name list>) from <table name> [<where statement>]
        select * from student where id = 1
        select name from student where id > 1 and id < 4
        select name, age, id from student where id = 12

<insert statement>
    insert into <table name> values <value list>
        insert into student values 5 "Zhang Yuanjia" 22

<delete statement>
    delete from <table name> <where statement>
        delete from student where name = "Zhang Yuanjia"

<update statement>
    update <table name> set <field name>=<value> [<where statement>]
        update student set name = "ZYJ" where id = 5

<where statement>
    where <field name> (><=) <value> [(andor) <field name> (><=) <value>]
        where age > 10 or age < 3

<field name> <table name>
    [a-zA-Z][a-zA-Z0-9_]*

<field type>
    int32 int64 string

<value>
    .*
```

Lớp Tokenizer của gói trình phân tích cú pháp phân tích từng byte câu lệnh và cắt câu lệnh thành nhiều mã thông báo dựa trên các ký tự khoảng trắng hoặc các quy tắc từ vựng ở trên. Nó cung cấp các phương pháp bên ngoài `peek()`để `pop()`hỗ trợ việc trích xuất Token để phân tích. Việc thực hiện cắt sẽ không được mô tả chi tiết.

Lớp Parser trực tiếp cung cấp `Parse(byte[] statement)`các phương thức bên ngoài. Cốt lõi là gọi lớp Tokenizer để phân chia Token và đóng gói nó thành một lớp Statement cụ thể theo các quy tắc từ vựng và trả về nó. Quá trình phân tích cú pháp rất đơn giản, nó chỉ phân biệt các loại câu lệnh dựa trên Token đầu tiên và xử lý chúng một cách riêng biệt nên tôi sẽ không đi sâu vào chi tiết.

Mặc dù theo nguyên tắc biên dịch, việc phân tích từ vựng phải được thực hiện bằng cách viết một máy tự động nhưng không có nghĩa là không thể sử dụng nó.

## Quản lý trường và bảng

Lưu ý rằng quản lý trường và bảng ở đây không quản lý giá trị của các trường khác nhau trong mỗi mục mà quản lý dữ liệu cấu trúc của bảng và trường, chẳng hạn như tên bảng, thông tin trường bảng, chỉ mục trường, v.v.  

Vì TBM dựa trên VM nên thông tin trường riêng lẻ và thông tin bảng được lưu trữ trực tiếp trong Entry. Biểu diễn nhị phân của các trường như sau:

```
[FieldName][TypeName][IndexUid]
```

Ở đây FieldName và TypeName, cũng như các hướng dẫn sau đây, lưu trữ các chuỗi ở dạng byte. Điều này chỉ định phương thức lưu trữ của một chuỗi để làm rõ ranh giới lưu trữ của nó.

```
[StringLength][StringData]
```

TypeName là loại trường, giới hạn ở các loại int32, int64 và chuỗi. Nếu trường này có một chỉ mục thì IndexUID đó trỏ đến gốc của cây nhị phân chỉ mục, nếu không thì trường đó là 0.

Theo cấu trúc này, UID được đọc từ VM và được phân tích cú pháp như sau:

```java
public static Field loadField(Table tb, long uid) {
    byte[] raw = null;
    try {
        raw = ((TableManagerImpl)tb.tbm).vm.read(TransactionManagerImpl.SUPER_XID, uid);
    } catch (Exception e) {
        Panic.panic(e);
    }
    assert raw != null;
    return new Field(uid, tb).parseSelf(raw);
}

private Field parseSelf(byte[] raw) {
    int position = 0;
    ParseStringRes res = Parser.parseString(raw);
    fieldName = res.str;
    position += res.next;
    res = Parser.parseString(Arrays.copyOfRange(raw, position, raw.length));
    fieldType = res.str;
    position += res.next;
    this.index = Parser.parseLong(Arrays.copyOfRange(raw, position, position+8));
    if(index != 0) {
        try {
            bt = BPlusTree.load(index, ((TableManagerImpl)tb.tbm).dm);
        } catch(Exception e) {
            Panic.panic(e);
        }
    }
    return this;
}
```

Phương pháp tạo trường cũng tương tự, chỉ cần lưu giữ thông tin liên quan thông qua VM:

```java
private void persistSelf(long xid) throws Exception {
    byte[] nameRaw = Parser.string2Byte(fieldName);
    byte[] typeRaw = Parser.string2Byte(fieldType);
    byte[] indexRaw = Parser.long2Byte(index);
    this.uid = ((TableManagerImpl)tb.tbm).vm.insert(xid, Bytes.concat(nameRaw, typeRaw, indexRaw));
}
```

Có nhiều bảng trong cơ sở dữ liệu và TBM sử dụng danh sách liên kết để sắp xếp chúng. Mỗi bảng lưu một UID trỏ đến bảng tiếp theo. Cấu trúc nhị phân của bảng như sau:

```
[TableName][NextTable]
[Field1Uid][Field2Uid]...[FieldNUid]
```

Vì dữ liệu trong mỗi Entry có một số byte nhất định nên không cần lưu số lượng trường. Quá trình đọc dữ liệu bảng từ Entry dựa trên UID cũng tương tự như quá trình đọc các trường.

Đối với các thao tác trên bảng và trường, một bước rất quan trọng là tính toán phạm vi của điều kiện Where. Hiện tại, Where của MiniDB chỉ hỗ trợ AND và OR của hai điều kiện. Ví dụ: nếu bạn thực hiện Xóa có điều kiện và tính toán Vị trí, cuối cùng bạn sẽ cần lấy tất cả các UID trong phạm vi điều kiện. MiniDB chỉ hỗ trợ các trường được lập chỉ mục làm điều kiện ở đâu. Để tính phạm vi của Where, bạn có thể xem `parseWhere()`và `calWhere()`các phương thức của Table và `calExp()`phương thức của lớp Field.

Do quản lý bảng của TBM sử dụng cấu trúc Bảng của danh sách liên kết nên cần lưu nút đầu của danh sách liên kết, tức là UID của bảng đầu tiên, để có thể nhanh chóng tìm thấy thông tin bảng khi khởi động MiniDB.

MiniDB sử dụng lớp Booter và tệp bt để quản lý thông tin khởi động của MiniDB, mặc dù hiện tại chỉ có một thông tin khởi động bắt buộc: UID của bảng tiêu đề. Lớp Booter cung cấp hai phương thức bên ngoài: tải và cập nhật, đồng thời đảm bảo tính nguyên tử của chúng. Khi cập nhật sửa đổi nội dung của tệp bt, nó không trực tiếp sửa đổi tệp bt. Thay vào đó, trước tiên nó ghi nội dung vào tệp bt_tmp, sau đó đổi tên tệp thành tệp bt. Để đảm bảo tính nguyên tử của hoạt động thông qua tính nguyên tử của việc đổi tên tệp theo hệ điều hành.

```java
public void update(byte[] data) {
    File tmp = new File(path + BOOTER_TMP_SUFFIX);
    try {
        tmp.createNewFile();
    } catch (Exception e) {
        Panic.panic(e);
    }
    if(!tmp.canRead()  !tmp.canWrite()) {
        Panic.panic(Error.FileCannotRWException);
    }
    try(FileOutputStream out = new FileOutputStream(tmp)) {
        out.write(data);
        out.flush();
    } catch(IOException e) {
        Panic.panic(e);
    }
    try {
        Files.move(tmp.toPath(), new File(path+BOOTER_SUFFIX).toPath(), StandardCopyOption.REPLACE_EXISTING);
    } catch(IOException e) {
        Panic.panic(e);
    }
    file = new File(path+BOOTER_SUFFIX);
    if(!file.canRead()  !file.canWrite()) {
        Panic.panic(Error.FileCannotRWException);
    }
}
```

## Trình quản lý bảng

Lớp TBM cung cấp các dịch vụ bên ngoài thông qua interface TableManager, như sau:

```java
public interface TableManager {
    BeginRes begin(Begin begin);
    byte[] commit(long xid) throws Exception;
    byte[] abort(long xid);

    byte[] show(long xid);
    byte[] create(long xid, Create create) throws Exception;

    byte[] insert(long xid, Insert insert) throws Exception;
    byte[] read(long xid, Select select) throws Exception;
    byte[] update(long xid, Update update) throws Exception;
    byte[] delete(long xid, Delete delete) throws Exception;
}

```

Vì TableManager đã được gọi trực tiếp bởi Máy chủ ngoài cùng (MiniDB là cấu trúc C/S), nên các phương thức này trực tiếp trả về kết quả thực thi, chẳng hạn như thông tin lỗi hoặc mảng byte thông tin kết quả (có thể đọc được).

Việc triển khai cụ thể của từng phương thức rất đơn giản và sẽ không được mô tả chi tiết mà chỉ gọi các phương thức có liên quan của VM. Điểm nhỏ duy nhất cần lưu ý là khi tạo bảng mới, nội suy head được sử dụng nên file Booter cần được cập nhật mỗi khi tạo bảng.
