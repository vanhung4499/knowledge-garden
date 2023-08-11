---
title: Spring Access ElasticSearch
tags: [spring, java, db, backend]
categories: [spring, java, db, backend]
date created: 2023-08-11
date modified: 2023-08-11
---

# Spring Accessing Elasticsearch

## Giới thiệu

[Elasticsearch](https://www.elastic.co/products/elasticsearch) là một công cụ tìm kiếm và phân tích phân tán mã nguồn mở.

### Kết nối Elasticsearch thông qua REST Client

Nếu có tệp JAR `org.elasticsearch.client:elasticsearch-rest-client` trong classpath, Spring Boot sẽ tự động cấu hình và đăng ký một Bean `RestClient`, mặc định là `localhost:9200`.

Bạn có thể tùy chỉnh như sau:

```properties
spring.elasticsearch.rest.uris=http://search.example.com:9200
spring.elasticsearch.rest.username=user
spring.elasticsearch.rest.password=secret
```

Bạn cũng có thể đăng ký các `RestClientBuilderCustomizer` bean để tùy chỉnh cao cấp hơn. Để hoàn toàn kiểm soát việc đăng ký, hãy định nghĩa một Bean `RestClient`.

Nếu có tệp JAR `org.elasticsearch.client:elasticsearch-rest-high-level-client` trong classpath, Spring Boot sẽ tự động cấu hình một `RestHighLevelClient`, nó bao gồm bất kỳ `RestClient` bean nào hiện có và tái sử dụng cấu hình HTTP của nó.

### Kết nối Elasticsearch thông qua Jest

Nếu có Jest trong classpath, bạn có thể tiêm vào một `JestClient` được tự động cấu hình, mặc định là `localhost:9200`. Bạn có thể tinh chỉnh cấu hình của client như ví dụ dưới đây:

```properties
spring.elasticsearch.jest.uris=http://search.example.com:9200
spring.elasticsearch.jest.read-timeout=10000
spring.elasticsearch.jest.username=user
spring.elasticsearch.jest.password=secret
```

Bạn cũng có thể đăng ký các `HttpClientConfigBuilderCustomizer` bean để tùy chỉnh cao cấp hơn. Ví dụ dưới đây điều chỉnh các thiết lập HTTP khác:

```java
static class HttpSettingsCustomizer implements HttpClientConfigBuilderCustomizer {

	@Override
	public void customize(HttpClientConfig.Builder builder) {
		builder.maxTotalConnection(100).defaultMaxTotalConnectionPerRoute(5);
	}

}
```

Để hoàn toàn kiểm soát việc đăng ký, hãy định nghĩa một Bean `JestClient`.

### Truy cập Elasticsearch thông qua Spring Data

Để kết nối với Elasticsearch, bạn phải cung cấp địa chỉ của một hoặc nhiều nút cụm. Bạn có thể chỉ định địa chỉ bằng cách đặt thuộc tính `spring.data.elasticsearch.cluster-nodes` thành một danh sách `host:port` phân tách bằng dấu phẩy. Với cấu hình này, bạn có thể tiêm vào `ElasticsearchTemplate` hoặc `TransportClient` như bất kỳ bean Spring nào khác, như ví dụ dưới đây:

```java
spring.data.elasticsearch.cluster-nodes=localhost:9300
@Component
public class MyBean {

	private final ElasticsearchTemplate template;

	public MyBean(ElasticsearchTemplate template) {
		this.template = template;
	}

	// ...

}
```

Nếu bạn thêm một `@Bean` `ElasticsearchTemplate` hoặc `TransportClient` tùy chỉnh, nó sẽ thay thế cấu hình mặc định.

### Elasticsearch Repositories

Spring Data cung cấp hỗ trợ repository cho Elasticsearch. Nguyên tắc cơ bản là xây dựng truy vấn tự động dựa trên tên phương thức.

Thực tế, Spring Data JPA và Spring Data Elasticsearch chia sẻ cơ sở hạ tầng chung.

## Mã nguồn

Ví dụ đầy đủ: [Mã nguồn](https://github.com/dunwu/spring-boot-tutorial/tree/master/codes/spring-boot-data-elasticsearch)

Cách sử dụng:

```bash
mvn clean package
cd target
java -jar spring-boot-data-elasticsearch.jar
```

## Phiên bản

Spring và Elasticsearch tương ứng với phiên bản như sau:

|                                        Spring Data Elasticsearch                                         | Elasticsearch | Spring Framework | Spring Boot |
|:--------------------------------------------------------------------------------------------------------:|:-------------:|:----------------:|:-----------:|
|                                                  5.0.x                                                   |     8.5.3     |      6.0.x       |    3.0.x    |
|                                                  4.4.x                                                   |    7.17.3     |      5.3.x       |    2.7.x    |
|                                                  4.3.x                                                   |    7.15.2     |      5.3.x       |    2.6.x    |
| 4.2.x[[1](https://docs.spring.io/spring-data/elasticsearch/docs/current/reference/html/#_footnotedef_1)] |    7.12.0     |      5.3.x       |    2.5.x    |
| 4.1.x[[1](https://docs.spring.io/spring-data/elasticsearch/docs/current/reference/html/#_footnotedef_1)] |     7.9.3     |      5.3.2       |    2.4.x    |
| 4.0.x[[1](https://docs.spring.io/spring-data/elasticsearch/docs/current/reference/html/#_footnotedef_1)] |     7.6.2     |      5.2.12      |    2.3.x    |
| 3.2.x[[1](https://docs.spring.io/spring-data/elasticsearch/docs/current/reference/html/#_footnotedef_1)] |    6.8.12     |      5.2.12      |    2.2.x    |
| 3.1.x[[1](https://docs.spring.io/spring-data/elasticsearch/docs/current/reference/html/#_footnotedef_1)] |     6.2.2     |      5.1.19      |    2.1.x    |
| 3.0.x[[1](https://docs.spring.io/spring-data/elasticsearch/docs/current/reference/html/#_footnotedef_1)] |     5.5.0     |      5.0.13      |    2.0.x    |
| 2.1.x[[1](https://docs.spring.io/spring-data/elasticsearch/docs/current/reference/html/#_footnotedef_1)] |     2.4.0     |      4.3.25      |    1.5.x    |

## Tài liệu tham khảo

- **Chính thức**
  - [Trang chủ Elasticsearch](https://www.elastic.co/cn/products/elasticsearch)
  - [Elasticsearch Github](https://github.com/elastic/elasticsearch)
  - [Tài liệu chính thức Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
  - [Elasticsearch: The Definitive Guide](https://www.elastic.co/guide/en/elasticsearch/guide/master/index.html) - Tài liệu học tập chính thức của Elasticsearch
- [Tài liệu Spring Boot về boot-features-elasticsearch](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#boot-features-elasticsearch)
- [Spring Data Elasticsearch trên Github](https://github.com/spring-projects/spring-data-elasticsearch)
- [Tài liệu chính thức Spring Data Elasticsearch](https://docs.spring.io/spring-data/elasticsearch/docs/current/reference/html/)
