---
title: Mediator Pattern Practice
tags:
  - design-pattern
categories: 
date created: 2024-04-01
date modified: 2024-04-01
---

# Mediator Pattern Practice: Viết tay khung ORM theo nguyên tắc Mybatis, thêm các kịch bản trung gian vào phương thức vận hành cơ sở dữ liệu JDBC

## Giới thiệu

**Khoảng cách giữa những người cùng tuổi bắt đầu mở ra từ khi nào?**

Trong cùng một trường mẫu giáo, cùng một trường tiểu học, sử dụng cùng một sách giáo khoa, ngồi trong cùng một lớp học, có những người học rất tốt, trong khi những người khác học rất kém. Khoảng cách này không chỉ tồn tại trong giai đoạn học trường, mà gần như ở mỗi lĩnh vực của cuộc sống đều có đường đua cạnh tranh. Khi súng khởi động, khoảng cách trong cuộc sống cũng mở ra. Con đường phát triển lập trình cũng là một con đường dài và rộng, có người chạy nhanh và có người chạy chậm. Vậy bạn có từng nghĩ, khoảng cách nhỏ này đã biến thành một khoảng cách xa xôi không?

**Bạn chỉ có thể viết một đống ifelse nếu tư duy về sản phẩm không tốt.**

Khi bạn nhận một yêu cầu, như: Giao dịch, Đơn hàng, Tiếp thị, Bảo hiểm và các loại tương tự. Nếu bạn không quen với mô hình kinh doanh trong tình huống này và hướng mở rộng trong tương lai, thì rất khó để thiết kế một hệ thống có thể mở rộng được. Hơn nữa, khi chức năng sản phẩm mới chỉ mới bắt đầu, sếp bảo bạn cần phải làm ngay, hãy nhanh chóng đưa lên sóng. Với vai trò là một lập trình viên, bạn càng không có thời gian để suy nghĩ, chỉ cần thấy yêu cầu hiện tại không khó, bạn đã bắt đầu thực hiện (một phương pháp với hai câu lệnh 'if'). Điều này thực sự làm đáp ứng được yêu cầu hiện tại. Nhưng ý đồ của sếp thường biến đổi nhanh chóng, sản phẩm cũng thay đổi theo. Khi đó bạn phải sửa lại, thêm vào và làm thêm. Dĩ nhiên bạn cũng không ngần ngại, và cuối cùng chỉ là cắm đầy 1024 câu lệnh 'if'!

**Việc tích lũy tích lũy kiến thức theo thời gian là để tích lũy thêm kiến ​​thức và tiến bộ hơn nữa.**

Tôi đã ước lượng sơ bộ rằng, nếu bắt đầu từ khi học đại học mỗi ngày viết 200 dòng code, một tháng sẽ là 6000 dòng, một năm tính 10 tháng, đó sẽ là 60 nghìn dòng code, năm thứ ba khi đi thực tập sẽ có 200 nghìn dòng code. Nếu bạn có thể làm được điều này, thì việc tìm việc là một điều khó khăn? Đôi khi những điều mà bạn tích luỹ được chỉ thông qua thời gian, không có cách nào là nhanh chóng hơn. Trình độ kỹ thuật của bạn, khả năng kinh doanh của bạn, và cảm xúc trong bạn, đều là kết quả của việc tích lũy từng chút một. Đừng lãng phí thời gian có vẻ như rất ngắn ngủi, hãy kiên trì qua từng năm, để lại dấu ấn của tuổi trẻ, và trang bị thêm một số kỹ năng cho bản thân.

## Môi trường phát triển

1. JDK 1.8
2. IDEA + Maven
3. mysql 5.1.20
4. Code: [vanhung4499/practical-java-design](https://github.com/vanhung4499/practical-java-design)  

| Dự án                     | Mô tả                                     |
| ------------------------- | ----------------------------------------- |
| codedemo-design-16-01 | Kết nối cơ sở dữ liệu bằng JDBC           |
| codedemo-design-16-02 | Thao tác cơ sở dữ liệu bằng ORM hand-made |

## Giới thiệu về Mediator Pattern

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240401115707.png)

Mediator Pattern giải quyết vấn đề là sự gọi lại lặp đi lặp lại giữa các ứng dụng chức năng phức tạp, thêm một lớp môi trường trung gian giữa để đóng gói dịch vụ, cung cấp dịch vụ đơn giản, phổ quát và dễ mở rộng ra bên ngoài.

Mô hình thiết kế như vậy gần như xuất hiện hàng ngày trong cuộc sống hàng ngày và phát triển kinh doanh thực tế của chúng ta. Ví dụ: Khi máy bay hạ cánh, có một cô gái ở tháp kiểm soát kêu gọi, mọi người đợi xe từ bất kỳ hướng nào cũng phải xuống từ sân ga, hệ thống của công ty có một trung tâm đặc biệt dành riêng cho bạn đóng gói tất cả các giao diện và cung cấp dịch vụ thống nhất, v.v. Ngoài ra, một số middleware mà bạn sử dụng, chúng đóng gói sự khác biệt giữa nhiều cơ sở dữ liệu cơ bản và cung cấp cách sử dụng rất đơn giản.

## Mô phỏng Tình huống

**Trong tình huống này, chúng ta sẽ mô phỏng việc tự viết khung ORM của Mybatis, qua đó học cách sử dụng mediator**

Ngoài các trường hợp sử dụng lớp trung gian như vậy, đối với một số giao diện bên ngoài, chẳng hạn như dịch vụ phần thưởng của N loại, có thể được hệ thống trung tâm gói gọn để cung cấp khả năng phục vụ thống nhất ra bên ngoài. Đó cũng là một trong những biểu hiện của mediator patter.

Trong tình huống này, chúng ta sẽ đóng gói lớp jdbc, cho phép người dùng sử dụng dịch vụ cơ sở dữ liệu một cách dễ dàng và thuận tiện như sử dụng mybatis. Qua cách thức này, chúng ta học được mediator patter thông qua mã nguồn, cũng như thuận tiện cho việc mở rộng kiến thức về mã nguồn và tăng cường kiến thức của mình.

## Triển khai code trực tiếp

`Đây là một phương thức cơ bản nhất để thực hiện các thao tác cơ sở dữ liệu`

Hầu hết mọi người học phát triển đều đã học cách kết nối cơ sở dữ liệu trực tiếp bằng cách sử dụng jdbc, và thực hiện các thao tác CRUD. Ví dụ dưới đây có thể được coi là một kỷ niệm.

### Cấu trúc dự án

```java
design-demo-16-01
├── pom.xml
└── src
    └── main
        └── java
            └── com
                └── hnv99
                    └── design
                        └── JDBCUtil.java
```

- Lớp ở đây khá đơn giản chỉ bao gồm một lớp thực hiện các thao tác cơ sở dữ liệu.

### Triển khai code

```java
public class JDBCUtil {

    private static Logger logger = LoggerFactory.getLogger(JDBCUtil.class);

    public static final String URL = "jdbc:mysql://127.0.0.1:3306/design-demo";
    public static final String USER = "root";
    public static final String PASSWORD = "123456";

    public static void main(String[] args) throws Exception {
        //1. Load driver
        Class.forName("com.mysql.jdbc.Driver");
        //2. Get database connection
        Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
        //3. Operate database
        Statement stmt = conn.createStatement();
        ResultSet resultSet = stmt.executeQuery("SELECT id, name, age, createTime, updateTime FROM user");
        //4. If there is data, resultSet.next() returns true
        while (resultSet.next()) {
            logger.info("Test result Name: {} Age: {}", resultSet.getString("name"),resultSet.getInt("age"));
        }
    }

}
```

- Trên đây là cách sử dụng JDBC để trực tiếp thao tác với cơ sở dữ liệu, hầu hết mọi người đều đã sử dụng cách này.

## Khung ORM theo Mediator Pattern

`Tiếp theo, chúng tôi sẽ sử dụng ý tưởng về mô hình trung gian để hoàn thành việc phát triển khung ORM bắt chước Mybatis`

### Cấu trúc dự án

```java
itstack-demo-design-16-02
└── src
    ├── main
    │   ├── java
    │   │   └── com.hnv99.design
    │   │       ├── dao
    │   │       │   ├── ISchool.java
    │   │       │   └── IUserDao.java
    │   │       ├── mediator
    │   │       │   ├── Configuration.java
    │   │       │   ├── DefaultSqlSession.java
    │   │       │   ├── DefaultSqlSessionFactory.java
    │   │       │   ├── Resources.java
    │   │       │   ├── SqlSession.java
    │   │       │   ├── SqlSessionFactory.java
    │   │       │   ├── SqlSessionFactoryBuilder.java
    │   │       │   └── XNode.java
    │   │       └── po
    │   │           ├── School.java
    │   │           └── User.java
    │   └── resources
    │       ├── mapper
    │       │   ├── School_Mapper.xml
    │       │   └── User_Mapper.xml
    │       └── mybatis-config-datasource.xml
    └── test
         └── java
             └── com.hnv99.design.test
                 └── ApiTest.java
```

**Cấu trúc mô hình Mediator**

![Cấu trúc mô hình Mediator](https://raw.githubusercontent.com/vanhung4499/images/master/snap/itstack-demo-design-16-03.png)

- Trên đây là các lớp cốt lõi của việc triển khai ORM framework, bao gồm: tải tệp cấu hình, phân tích XML, nhận session cơ sở dữ liệu, thao tác cơ sở dữ liệu và trả kết quả.
- Phía trên bên trái là định nghĩa và xử lý cơ sở dữ liệu, cơ bản bao gồm các phương thức thông thường mà chúng ta sử dụng; `<T> T selectOne`, `<T> List<T> selectList`, v.v.
- Phía bên phải là lớp xử lý nhà máy sessionFactory mở của cấu hình cơ sở dữ liệu, nhà máy này sẽ điều hành `DefaultSqlSession`.
- Tiếp theo là phần màu đỏ của `SqlSessionFactoryBuilder`, lớp này là lớp trung tâm của việc thao tác cơ sở dữ liệu; xử lý nhà máy, phân tích tệp, nhận session, v.v.

Tiếp theo, chúng ta sẽ giới thiệu qua từng lớp để hiểu rõ hơn về chức năng thực hiện.

### Triển khai code

#### Định nghĩa SqlSession interface

```java
public interface SqlSession {

    <T> T selectOne(String statement);

    <T> T selectOne(String statement, Object parameter);

    <T> List<T> selectList(String statement);

    <T> List<T> selectList(String statement, Object parameter);

    void close();
}
```

- Ở đây, chúng ta định nghĩa các phương thức truy vấn cơ sở dữ liệu trong giao diện này, bao gồm truy vấn một kết quả và truy vấn nhiều kết quả, đồng thời bao gồm các phương thức có tham số và không có tham số.

#### Lớp triển khai của SqlSession

```java
public class DefaultSqlSession implements SqlSession {

    private Connection connection;
    private Map<String, XNode> mapperElement;

    public DefaultSqlSession(Connection connection, Map<String, XNode> mapperElement) {
        this.connection = connection;
        this.mapperElement = mapperElement;
    }

    @Override
    public <T> T selectOne(String statement) {
        try {
            XNode xNode = mapperElement.get(statement);
            PreparedStatement preparedStatement = connection.prepareStatement(xNode.getSql());
            ResultSet resultSet = preparedStatement.executeQuery();
            List<T> objects = resultSet2Obj(resultSet, Class.forName(xNode.getResultType()));
            return objects.get(0);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public <T> List<T> selectList(String statement) {
        XNode xNode = mapperElement.get(statement);
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(xNode.getSql());
            ResultSet resultSet = preparedStatement.executeQuery();
            return resultSet2Obj(resultSet, Class.forName(xNode.getResultType()));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    // ...

    private <T> List<T> resultSet2Obj(ResultSet resultSet, Class<?> clazz) {
        List<T> list = new ArrayList<>();
        try {
            ResultSetMetaData metaData = resultSet.getMetaData();
            int columnCount = metaData.getColumnCount();
            // Mỗi lần lặp qua giá trị hàng
            while (resultSet.next()) {
                T obj = (T) clazz.newInstance();
                for (int i = 1; i <= columnCount; i++) {
                    Object value = resultSet.getObject(i);
                    String columnName = metaData.getColumnName(i);
                    String setMethod = "set" + columnName.substring(0, 1).toUpperCase() + columnName.substring(1);
                    Method method;
                    if (value instanceof Timestamp) {
                        method = clazz.getMethod(setMethod, Date.class);
                    } else {
                        method = clazz.getMethod(setMethod, value.getClass());
                    }
                    method.invoke(obj, value);
                }
                list.add(obj);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public void close() {
        if (null == connection) return;
        try {
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```    

- Đây bao gồm các phương thức triển khai được định nghĩa trong giao diện, tức là đóng gói lớp jdbc.
- Bằng cách đó, các thao tác jdbc đến cơ sở dữ liệu có thể được ẩn đi, người dùng ngoài

#### Định nghĩa SqlSessionFactory interface

```java
public interface SqlSessionFactory {

    SqlSession openSession();

}
```    

- Mở một `SqlSession`, hầu như đây là điều mà mọi người thường thực hiện trong quá trình sử dụng hàng ngày. Mặc dù bạn không thấy, nhưng khi bạn có thao tác cơ sở dữ liệu, bạn sẽ nhận được mỗi lần thực hiện `SqlSession`.

#### Lớp triển khai của SqlSessionFactory

```java
public class DefaultSqlSessionFactory implements SqlSessionFactory {

    private final Configuration configuration;

    public DefaultSqlSessionFactory(Configuration configuration) {
        this.configuration = configuration;
    }

    @Override
    public SqlSession openSession() {
        return new DefaultSqlSession(configuration.connection, configuration.mapperElement);
    }

}
```   

- `DefaultSqlSessionFactory`, là một trong những lớp phổ biến nhất được sử dụng trong Mybatis, ở đây chúng ta đã triển khai một phiên bản đơn giản.
- Mặc dù đây là một phiên bản đơn giản, nhưng bao gồm các ý tưởng cốt lõi cơ bản nhất. Khi mở `SqlSession`, một `DefaultSqlSession` sẽ được trả về.
- Trong hàm tạo này, `Configuration` được chuyển xuống, trong đó bao gồm; `Connection connection`, `Map<String, String> dataSource`, `Map<String, XNode> mapperElement`. Nếu bạn đã đọc mã nguồn của Mybatis, điều này sẽ không xa lạ.

#### SqlSessionFactoryBuilder

```java
public class SqlSessionFactoryBuilder {

    public DefaultSqlSessionFactory build(Reader reader) {
        SAXReader saxReader = new SAXReader();
        try {
            saxReader.setEntityResolver(new XMLMapperEntityResolver());
            Document document = saxReader.read(new InputSource(reader));
            Configuration configuration = parseConfiguration(document.getRootElement());
            return new DefaultSqlSessionFactory(configuration);
        } catch (DocumentException e) {
            e.printStackTrace();
        }
        return null;
    }

    private Configuration parseConfiguration(Element root) {
        Configuration configuration = new Configuration();
        configuration.setDataSource(dataSource(root.selectNodes("//dataSource")));
        configuration.setConnection(connection(configuration.dataSource));
        configuration.setMapperElement(mapperElement(root.selectNodes("mappers")));
        return configuration;
    }

    // Lấy thông tin cấu hình nguồn dữ liệu
    private Map<String, String> dataSource(List<Element> list) {
        Map<String, String> dataSource = new HashMap<>(4);
        Element element = list.get(0);
        List content = element.content();
        for (Object o : content) {
            Element e = (Element) o;
            String name = e.attributeValue("name");
            String value = e.attributeValue("value");
            dataSource.put(name, value);
        }
        return dataSource;
    }

    private Connection connection(Map<String, String> dataSource) {
        try {
            Class.forName(dataSource.get("driver"));
            return DriverManager.getConnection(dataSource.get("url"), dataSource.get("username"), dataSource.get("password"));
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    // Lấy thông tin câu lệnh SQL
    private Map<String, XNode> mapperElement(List<Element> list) {
        Map<String, XNode> map = new HashMap<>();

        Element element = list.get(0);
        List content = element.content();
        for (Object o : content) {
            Element e = (Element) o;
            String resource = e.attributeValue("resource");

            try {
                Reader reader = Resources.getResourceAsReader(resource);
                SAXReader saxReader = new SAXReader();
                Document document = saxReader.read(new InputSource(reader));
                Element root = document.getRootElement();
                //Namespace
                String namespace = root.attributeValue("namespace");

                // SELECT
                List<Element> selectNodes = root.selectNodes("select");
                for (Element node : selectNodes) {
                    String id = node.attributeValue("id");
                    String parameterType = node.attributeValue("parameterType");
                    String resultType = node.attributeValue("resultType");
                    String sql = node.getText();

                    // ? Correspondence
                    Map<Integer, String> parameter = new HashMap<>();
                    Pattern pattern = Pattern.compile("(#\\{(.*?)})");
                    Matcher matcher = pattern.matcher(sql);
                    for (int i = 1; matcher.find(); i++) {
                        String g1 = matcher.group(1);
                        String g2 = matcher.group(2);
                        parameter.put(i, g2);
                        sql = sql.replace(g1, "?");
                    }

                    XNode xNode = new XNode();
                    xNode.setNamespace(namespace);
                    xNode.setId(id);
                    xNode.setParameterType(parameterType);
                    xNode.setResultType(resultType);
                    xNode.setSql(sql);
                    xNode.setParameter(parameter);

                    map.put(namespace + "." + id, xNode);
                }
            } catch (Exception ex) {
                ex.printStackTrace();
            }

        }
        return map;
    }

}
``` 

- Trong lớp này bao gồm các phương thức cốt lõi như; `build(định nghĩa phần tử)`、`parseConfiguration(đọc cấu hình)`、`dataSource(lấy cấu hình cơ sở dữ liệu)`、`connection(Map<String, String> dataSource) (kết nối cơ sở dữ liệu)`、`mapperElement (đọc các câu lệnh SQL)`
- Tiếp theo chúng ta sẽ giải thích các phương thức cốt lõi này.

**build(định nghĩa phần tử)**

Lớp này chủ yếu được sử dụng để tạo ra các lớp để phân tích các tập tin xml, và khởi tạo lớp SqlSession Factory `DefaultSqlSessionFactory`. Đoạn code này `saxReader.setEntityResolver(new XMLMapperEntityResolver());` được sử dụng để đảm bảo rằng bạn có thể phân tích xml ngay cả khi bạn không kết nối với internet, nếu không sẽ cần phải lấy dtd từ internet.

**parseConfiguration(đọc cấu hình)**

Là để lấy các phần tử trong xml, ở đây chủ yếu lấy được; `dataSource` và `mappers`, trong đó một cái là thông tin liên kết cơ sở dữ liệu của chúng ta, một cái là phân tích các câu lệnh hoạt động của chúng ta.

**connection(Map<String, String> dataSource) (kết nối cơ sở dữ liệu)**

Chỗ này giống như cách chúng ta thường thấy khi kết nối cơ sở dữ liệu; `Class.forName(dataSource.get("driver"));`, nhưng sau khi bao gói như vậy bên ngoài không cần biết thao tác cụ thể. Đồng thời khi chúng ta cần kết nối nhiều cơ sở dữ liệu, cũng có thể mở rộng ở đây.

**mapperElement (đọc các câu lệnh SQL)**

Phần này nội dung code tương đối dài, nhưng điểm cốt lõi là để phân tích cấu trúc câu lệnh SQL trong xml. Trong sử dụng hàng ngày của chúng ta, cơ bản sẽ cấu hình một số câu lệnh SQL, cũng có một số định dạng tham số. Ở đây chúng ta sử dụng biểu thức chính quy để phân tích.

Sau khi phân tích xong câu lệnh SQL, chúng ta có một bản đồ cho việc phân biệt giữa tên và sql của câu lệnh, khi chúng ta thực hiện thao tác cơ sở dữ liệu.

### Kiểm thử

Trước khi kiểm tra, bạn cần nhập câu lệnh sql vào cơ sở dữ liệu:

- Tên database:`design-demo`
- Tên bảng: `user`,`school`

```sql
CREATE TABLE school ( id bigint NOT NULL AUTO_INCREMENT, name varchar(64), address varchar(256), createTime datetime, updateTime datetime, PRIMARY KEY (id) ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
insert into school (id, name, address, createTime, updateTime) values (1, 'Đại học Bắc Kinh', 'Bắc Kinh, Trung Quốc, Đường Y Hòa, số 5', '2019-10-18 13:35:57', '2019-10-18 13:35:57');
insert into school (id, name, address, createTime, updateTime) values (2, 'Đại học Nam Kinh', 'Nam Kinh, Trung Quốc, Số 94 đường Vệ Tần, Quận Nam Kinh', '2019-10-18 13:35:57', '2019-10-18 13:35:57');
insert into school (id, name, address, createTime, updateTime) values (3, 'Đại học Đồng Kinh', 'Thượng Hải, Trung Quốc, Số 1 đường Trương Võ, Tòa nhà Đồng Kinh, Tầng 7, Khu 7', '2019-10-18 13:35:57', '2019-10-18 13:35:57');

CREATE TABLE user ( id bigint(11) NOT NULL AUTO_INCREMENT, name varchar(32), age int(4), address varchar(128), entryTime datetime, remark varchar(64), createTime datetime, updateTime datetime, status int(4) DEFAULT '0', dateTime varchar(64), PRIMARY KEY (id), INDEX idx_name (name) ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
insert into user (id, name, age, address, entryTime, remark, createTime, updateTime, status, dateTime) values (1, 'Shuishui', 18, 'Lâm Sơn, Thị trấn Hắc Lâm, Huyện Đổng Khê, Tỉnh Kỳ Sơn, Trung Quốc', '2019-12-22 00:00:00', 'Không', '2019-12-22 00:00:00', '2019-12-22 00:00:00', 0, '20200309');
insert into user (id, name, age, address, entryTime, remark, createTime, updateTime, status, dateTime) values (2, 'Đậu đậu', 18, 'Liaoning, Đại Liên, Quận Hồng Hà, Đường Sĩ Mạch, Số 407', '2019-12-22 00:00:00', 'Không', '2019-12-22 00:00:00', '2019-12-22 00:00:00', 1, null);
insert into user (id, name, age, address, entryTime, remark, createTime, updateTime, status, dateTime) values (3, 'Hoa hoa', 19, 'Liaoning, Đại Liên, Quận Hồng Hà, Đường Sĩ Mạch, Số 407', '2019-12-22 00:00:00', 'Không', '2019-12-22 00:00:00', '2019-12-22 00:00:00', 0, '20200310');

```

#### Tạo lớp đối tượng của cơ sở dữ liệu

**Lớp Người dùng**

```java
public class User {

    private Long id;
    private String name;
    private Integer age;
    private Date createTime;
    private Date updateTime;
    
    // ... getter/setter
}
```      

**Lớp Trường học**

```java
public class School {

    private Long id;
    private String name;
    private String address;
    private Date createTime;
    private Date updateTime;  
  
    // ... getter/setter
}
```

- Hai lớp này đều rất đơn giản, chỉ chứa thông tin cơ bản của cơ sở dữ liệu.

#### Tạo gói DAO

**DAO của Người dùng**

```java
public interface IUserDao {

     User queryUserInfoById(Long id);

}
```

**DAO của Trường học**

```java
public interface ISchoolDao {

    School querySchoolInfoById(Long treeId);

}
```

#### Tệp cấu hình ORM

**Cấu hình kết nối**

```xml 
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN"  
        "http://mybatis.org/dtd/mybatis-3-config.dtd">  
  
<configuration>  
    <environments default="development">  
        <environment id="development">  
            <transactionManager type="JDBC"/>  
            <dataSource type="POOLED">  
                <property name="driver" value="com.mysql.jdbc.Driver"/>  
                <property name="url" value="jdbc:mysql://127.0.0.1:3306/design-demo?useUnicode=true"/>  
                <property name="username" value="root"/>  
                <property name="password" value="123456"/>  
            </dataSource>  
        </environment>  
    </environments>  
  
    <mappers>  
        <mapper resource="mapper/User_Mapper.xml"/>  
        <mapper resource="mapper/School_Mapper.xml"/>  
    </mappers>  
  
</configuration>
``` 

- Cấu hình này tương tự như việc sử dụng MyBatis thông thường, bao gồm thông tin về cơ sở dữ liệu và các tệp ánh xạ mapper cần được đưa vào.

**Cấu hình thao tác (Người dùng)**

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">  
<mapper namespace="com.hnv99.design.dao.IUserDao">  
  
    <select id="queryUserInfoById" parameterType="java.lang.Long" resultType="com.hnv99.design.po.User">  
        SELECT id, name, age, createTime, updateTime  
        FROM user  
        where id = #{id}  
    </select>  
  
    <select id="queryUserList" parameterType="com.hnv99.design.po.User" resultType="com.hnv99.design.po.User">  
        SELECT id, name, age, createTime, updateTime  
        FROM user  
        where age = #{age}  
    </select>  
  
</mapper>
```

**Cấu hình thao tác (Trường học)**

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">  
<mapper namespace="com.hnv99.design.dao.ISchoolDao">  
  
    <select id="querySchoolInfoById" resultType="com.hnv99.design.po.School">  
        SELECT id, name, address, createTime, updateTime  
        FROM school  
        where id = #{id}  
    </select>  
  
</mapper>
```

#### Kiểm tra truy vấn kết quả duy nhất

```java 
@Test
public void test_queryUserInfoById() {
    String resource = "mybatis-config-datasource.xml";
    Reader reader;
    try {
        reader = Resources.getResourceAsReader(resource);
        SqlSessionFactory sqlMapper = new SqlSessionFactoryBuilder().build(reader);
        SqlSession session = sqlMapper.openSession();
        try {
            User user = session.selectOne("com.hnv99.design.dao.IUserDao.queryUserInfoById", 1L);
            logger.info("Kết quả kiểm tra: {}", JSON.toJSONString(user));
        } finally {
            session.close();
            reader.close();
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

- Cách sử dụng ở đây tương tự như với `Mybatis`, bao gồm cả việc tải và phân tích tài nguyên, xây dựng `SqlSession` factory, mở `SqlSession`, và cuối cùng thực hiện truy vấn `selectOne`.

**Kết quả kiểm tra**

```java
16:56:51.831 [main] INFO  com.hnv99.design.ApiTest - Kết quả kiểm tra: {"age":18,"createTime":1576944000000,"id":1,"name":"Shuishui","updateTime":1576944000000}

Process finished with exit code 0
```

- Từ kết quả trên, chúng ta đã đáp ứng được yêu cầu truy vấn của mình.

## Tổng kết

- Trên đây, thông qua ý tưởng thiết kế của Mediator Pattern, chúng ta đã viết thủ công một framework ORM, giấu đi sự phức tạp của các hoạt động truy vấn cơ sở dữ liệu, cho phép bên gọi có thể thực hiện các hoạt động cơ sở dữ liệu một cách rất đơn giản. Điều này cũng là nguyên mẫu của `MyBatis`, một framework chúng ta thường xuyên sử dụng trong phát triển hàng ngày. Trong quá trình phát triển và sử dụng hàng ngày, chúng ta chỉ cần tuân theo cấu hình là có thể thực hiện các hoạt động cơ sở dữ liệu một cách đơn giản.
- Ngoài ra, ngoài việc phát triển thành phần như trên, việc đóng gói các giao diện dịch vụ cũng có thể sử dụng Mediator Pattern để triển khai. Ví dụ, công ty của bạn có nhiều giao diện dịch vụ phần thưởng cần tích hợp trong các hoạt động tiếp thị, bạn có thể đưa ra một trung tâm phần thưởng, cung cấp dịch vụ ngoài ra. Điều này giúp bạn không cần phải tìm từng nhà cung cấp cụ thể cho mỗi giao diện cần tích hợp phần thưởng, mà chỉ cần tìm dịch vụ trung tâm.
- Trong việc triển khai và thử nghiệm như trên, chúng ta có thể thấy rằng thiết kế này đáp ứng được nguyên tắc `công việc duy nhất` và `nguyên tắc mở đóng`. Điều này cũng tuân theo `nguyên tắc Law of Demeter`, tức là ít người biết càng tốt. Bên ngoài chỉ cần gọi theo yêu cầu, không cần biết cụ thể cách triển khai, mà mặt phức tạp đã được xử lý bởi nền tảng dịch vụ và các thành phần hợp tác.
