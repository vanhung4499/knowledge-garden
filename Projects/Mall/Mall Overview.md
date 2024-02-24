---
title: Mall Overview
tags:
  - project
categories: 
date created: 2024-02-05
date modified: 2024-02-09
---

# Mall Project Overview

## Mở đầu

`mall` là một dự án thương mại điện tử hoàn chỉnh, được triển khai bằng các công nghệ thông dụng hiện nay!

## Giới thiệu

Dự án `mall` là một hệ thống thương mại điện tử, bao gồm hệ thống mua sắm trực tuyến (frontend) và hệ thống quản lý hậu cần (backend), được triển khai dựa trên **SpringBoot + MyBatis** và sử dụng Docker để triển khai dưới dạng container.

Hệ thống mua sắm trực tuyến bao gồm các module như trang chủ, đề xuất sản phẩm, tìm kiếm sản phẩm, hiển thị sản phẩm, giỏ hàng, quy trình đặt hàng, trung tâm thành viên, dịch vụ khách hàng, trung tâm trợ giúp, v.v.

Hệ thống quản lý hậu cần bao gồm các module như quản lý sản phẩm, quản lý đơn hàng, quản lý thành viên, quản lý khuyến mãi, quản lý hoạt động, quản lý nội dung, báo cáo thống kê, quản lý tài chính, quản lý quyền, cài đặt, v.v.

## Cấu trúc dự án

Phần backend của dự án `mall` bao gồm các module chính sau

```
mall
├── mall-common -- common utilities and classes
├── mall-mbg    -- MyBatisGenerator code for database
├── mall-security -- SpringSecurity components
├── mall-admin -- Interface for backend system
├── mall-search -- Product search base on Elasticsearch
├── mall-portal -- Interface for frontend system
└── mall-demo -- Test code used during framework setup.
```

## Tech Stack

### Backend

| Technology          | Description                                | Official Website                                       |
| ------------------- | ------------------------------------------ | ------------------------------------------------------ |
| SpringBoot          | Application framework                      | [Link](https://spring.io/projects/spring-boot)         |
| SpringSecurity      | Authentication and authorization framework | [Link](https://spring.io/projects/spring-security)     |
| MyBatis             | ORM framework                              | [Link](https://mybatis.org/mybatis-3/) |
| MyBatisGenerator    | Code generator for data access classes     | [Link](http://www.mybatis.org/generator/index.html)    |
| Elasticsearch       | Search tool                                | [Link](https://github.com/elastic/elasticsearch)       |
| RabbitMQ            | Message queue                              | [Link](https://www.rabbitmq.com/)                      |
| Redis               | In-memory data storage, Caching                     | [Link](https://redis.io/)                              |
| MongoDB             | NoSql database                             | [Link](https://www.mongodb.com)                        |
| LogStash            | Log collection tool                        | [Link](https://github.com/elastic/logstash)            |
| Kibana              | Visualization tool for logs                | [Link](https://github.com/elastic/kibana)              |
| Nginx               | Static resource server                     | [Link](https://www.nginx.com/)                         |
| Docker              | Application packaging tool                 | [Link](https://www.docker.com)                         |
| Jenkins             | Automated deployment tool                  | [Link](https://github.com/jenkinsci/jenkins)           |
| Druid               | Database connection pool                   | [Link](https://github.com/alibaba/druid)               |
| OSS                 | Object storage                             | [Link](https://github.com/aliyun/aliyun-oss-java-sdk)  |
| MinIO               | Object storage                             | [Link](https://github.com/minio/minio)                 |
| JWT                 | JWT login support                          | [Link](https://github.com/jwtk/jjwt)                   |
| Lombok              | Java language extension library            | [Link](https://github.com/rzwitserloot/lombok)         |
| Hutool              | Java utility library                       | [Link](https://github.com/looly/hutool)                |
| PageHelper          | Physical pagination plugin for MyBatis     | [Link](http://git.oschina.net/free/Mybatis_PageHelper) |
| Swagger-UI          | API documentation tool                     | [Link](https://github.com/swagger-api/swagger-ui)      |
| Hibernate-Validator | Validation framework                       | [Link](http://hibernate.org/validator)                 |

### Frontend

| Technology | Description                | Official Website                           |
| ---------- | -------------------------- | ------------------------------------------ |
| Vue        | Front-end framework        | [Link](https://vuejs.org/)                 |
| Vue-router | Routing framework          | [Link](https://router.vuejs.org/)          |
| Vuex       | Global state management    | [Link](https://vuex.vuejs.org/)            |
| Element    | Front-end UI framework     | [Link](https://element.eleme.io)           |
| Axios      | Front-end HTTP framework   | [Link](https://github.com/axios/axios)     |
| v-charts   | Chart framework based on Echarts | [Link](https://v-charts.js.org/)       |
| Js-cookie  | Cookie management tool     | [Link](https://github.com/js-cookie/js-cookie) |
| nprogress  | Progress bar control       | [Link](https://github.com/rstacruz/nprogress)  |

## Architechture

### System Architechture

Upcomming

### Business Archiiitechture

Upcomming

## Features

- **Product Module**
	- Product Management
	- Product Category Management
	- Product Type Management
	- Brand Management
- **Order Module**
	- Order Management
	- Order Settings
	- Return Application Processing
	- Return Reason Setting
- **Sale Module**
	- Flash Sale Management
	- Discount Price Management
	- Brand Recommendation Management
	- New Product Recommendation Management
	- Popular Recommendation Management
	- Special Topic Recommendation Management
	- Home Page Advertisement Management

## Database Design

> Dự án `mall` hiện có 71 bảng dữ liệu và logic nghiệp vụ có độ phức tạp nhất định, đủ để tham khảo.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240205171304.png)

**Ý nghĩa tiền tố các bảng dữ liệu:**

- `cms_*`: Tables related to the Content Management module  
- `oms_*`: Tables related to the Order Management module  
- `pms_*`: Tables related to the Product module  
- `sms_*`: Tables related to the Sale module  
- `ums_*`: Tables related to the Member module

## Cài đặt môi trường

### Tools

- IDEA IDE
- Postman
- Docker
- TablePlus
- MindNode
- Obsidian

### Environment

| Tool          | Version | Download Link                                                         |
| ------------- | ------- | ------------------------------------------------------------ |
| JDK           | 1.8    | https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html |
| MySQL         | 5.7    | https://www.mysql.com/                                       |
| Redis         | 7.0    | https://redis.io/download                                    |
| MongoDB       | 5.0    | https://www.mongodb.com/download-center                      |
| RabbitMQ      | 3.10.5 | http://www.rabbitmq.com/download.html                        |
| Nginx         | 1.22   | http://nginx.org/en/download.html                            |
| Elasticsearch | 7.17.3 | https://www.elastic.co/downloads/elasticsearch               |
| Logstash      | 7.17.3 | https://www.elastic.co/downloads/logstash                 |
| Kibana        | 7.17.3 | https://www.elastic.co/downloads/kibana                   |
