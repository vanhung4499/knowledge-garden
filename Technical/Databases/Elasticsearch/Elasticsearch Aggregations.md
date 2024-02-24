---
title: Elasticsearch Aggregations
tags:
  - elasticssearch
  - database
categories: 
date created: 2024-02-23
date modified: 2024-02-23
---

# Elasticsearch Aggregations

Elasticsearch là một công cụ tìm kiếm toàn văn bản phân tán, lập chỉ mục và tìm kiếm là các chức năng cơ bản của Elasticsearch. Thực tế, chức năng Aggregations của Elasticsearch cũng rất mạnh mẽ, cho phép thực hiện phân tích thống kê phức tạp trên dữ liệu. Elasticsearch cung cấp bốn loại chức năng phân tích tổng hợp chính, bao gồm **aggregations chỉ số (metrics aggregations)**, **aggregations thùng (bucket aggregations)**, **aggregations ống (pipeline aggregations)** và **aggregations ma trận (matrix aggregations)**. Aggregations ống và aggregations ma trận đang trong giai đoạn thử nghiệm theo thông báo chính thức, và sẽ được thay đổi hoàn toàn hoặc loại bỏ sau này, vì vậy chúng tôi sẽ không giải thích về aggregations ống và aggregations ma trận ở đây.

## Cấu trúc cụ thể của Aggregations

Tất cả các aggregations, bất kể loại nào, đều tuân theo các quy tắc sau.

- Chúng được định nghĩa trong cùng một yêu cầu JSON như truy vấn, và bạn đánh dấu chúng bằng cách sử dụng khóa aggregations hoặc aggs. Bạn cần đặt tên cho mỗi aggregation, chỉ định loại của nó và các tùy chọn liên quan đến loại đó.
- Chúng chạy trên kết quả của truy vấn. Các tài liệu không khớp với truy vấn sẽ không được tính, trừ khi bạn sử dụng aggregation global để bao gồm các tài liệu không khớp.
- Chúng có thể lọc thêm kết quả của truy vấn mà không ảnh hưởng đến aggregation.

Dưới đây là cấu trúc cơ bản của aggregation:

```json
"aggregations" : { <!-- Khóa aggregation ở cấp độ cao nhất, cũng có thể viết tắt là aggs -->
    "<aggregation_name>" : { <!-- Tên tùy chỉnh của aggregation -->
        "<aggregation_type>" : { <!-- Loại aggregation, liên quan đến chỉ số như max, min, avg, sum, liên quan đến thùng như terms, filter, v.v. -->
            <aggregation_body> <!-- Thân aggregation: trường nào sẽ được tổng hợp, có thể lấy giá trị của trường hoặc kết quả của script -->
        }
        [,"meta" : {  [<meta_data_body>] } ]? <!-- Meta -->
        [,"aggregations" : { [<sub_aggregation>]+ } ]? <!-- Định nghĩa sub-aggregation trong aggregation -->
    }
    [,"<aggregation_name_2>" : { ... } ]* <!-- Tên tùy chỉnh của aggregation 2 -->
}
```

- **Ở cấp độ cao nhất có một khóa aggregations, có thể viết tắt là aggs**.
- Ở cấp độ tiếp theo, bạn cần chỉ định tên cho aggregation. Bạn sẽ thấy tên này trong kết quả trả về của yêu cầu. Điều này rất hữu ích khi sử dụng nhiều aggregation trong cùng một yêu cầu, nó giúp bạn dễ dàng hiểu ý nghĩa của mỗi nhóm kết quả.
- Cuối cùng, bạn phải chỉ định loại aggregation.

> Giá trị phân tích tổng hợp có thể **lấy từ giá trị của trường** hoặc là **kết quả của script**.
>
> Tuy nhiên, khi sử dụng kết quả của script, bạn cần chú ý đến hiệu suất và an toàn của script; mặc dù hầu hết các loại aggregation đều cho phép sử dụng script, nhưng script làm chậm aggregation vì script phải chạy trên mỗi tài liệu. Để tránh chạy script, bạn có thể tính toán trong giai đoạn lập chỉ mục.
>
> Ngoài ra, script cũng có thể bị sử dụng để tấn công mã độc, hãy cố gắng sử dụng ngôn ngữ script trong sandbox.

Ví dụ: Truy vấn tuổi trung bình của tất cả các cầu thủ là bao nhiêu, và cộng 188 vào mức lương trung bình của cầu thủ (cũng có thể hiểu là mức lương trung bình sau khi cộng thêm 188 cho mỗi cầu thủ).

```bash
POST /player/_search?size=0
{
  "aggs": {
    "avg_age": {
      "avg": {
        "field": "age"
      }
    },
    "avg_salary_188": {
      "avg": {
        "script": {
          "source": "doc.salary.value + 188"
        }
      }
    }
  }
}
```

## Aggregations chỉ số

Aggregations chỉ số (còn được gọi là aggregations đo lường) chủ yếu rút ra dữ liệu thống kê từ các nhóm tài liệu khác nhau, hoặc từ các thùng tài liệu từ các aggregations khác.

Những dữ liệu thống kê này thường đến từ các trường số, như giá trị nhỏ nhất hoặc trung bình. Người dùng có thể lấy từng dữ liệu thống kê riêng lẻ, hoặc cũng có thể sử dụng aggregations stats để lấy chúng cùng một lúc. Dữ liệu thống kê nâng cao hơn, như tổng bình phương hoặc độ lệch chuẩn, có thể được lấy thông qua aggregations extended stats.

### Max Aggregation

Max Aggregation được sử dụng để thống kê giá trị lớn nhất. Ví dụ, để thống kê cuốn sách có giá cao nhất trong chỉ mục sales, và tính giá trị gấp đôi của giá đó, câu truy vấn như sau:

```
GET /sales/_search?size=0
{
  "aggs" : {
    "max_price" : {
      "max" : {
        "field" : "price"
      }
    },
    "max_price_2" : {
      "max" : {
        "field" : "price",
        "script": {
          "source": "_value * 2.0"
        }
      }
    }
  }
}
```

**Trường được chỉ định, trong script có thể lấy giá trị của trường bằng \_value**.

Kết quả aggregation như sau:

```
{
  ...
  "aggregations": {
    "max_price": {
      "value": 188.0
    },
    "max_price_2": {
      "value": 376.0
    }
  }
}
```

### Min Aggregation

Min Aggregation được sử dụng để thống kê giá trị nhỏ nhất. Ví dụ, để thống kê cuốn sách có giá thấp nhất trong chỉ mục sales, câu truy vấn như sau:

```
GET /sales/_search?size=0
{
  "aggs" : {
    "min_price" : {
      "min" : {
        "field" : "price"
      }
    }
  }
}
```

Kết quả aggregation như sau:

```
{
  ...
  "aggregations": {
    "min_price": {
      "value": 18.0
    }
  }
}
```

### Avg Aggregation

Avg Aggregation được sử dụng để tính giá trị trung bình. Ví dụ, để thống kê điểm trung bình của kỳ thi trong chỉ mục exams, nếu không có điểm số, mặc định là 60 điểm, câu truy vấn như sau:

```
GET /exams/_search?size=0
{
  "aggs" : {
    "avg_grade" : {
      "avg" : {
        "field" : "grade",
        "missing": 60
      }
    }
  }
}
```

**Nếu trường chỉ định không có giá trị, bạn có thể chỉ định giá trị mặc định bằng missing; nếu không chỉ định giá trị mặc định, tài liệu thiếu giá trị trường này sẽ bị bỏ qua (tính toán)**.

Kết quả aggregation như sau:

```
{
  ...
  "aggregations": {
    "avg_grade": {
      "value": 78.0
    }
  }
}
```

Ngoài tính toán aggregation trung bình thông thường, elasticsearch cũng cung cấp tính toán aggregation trung bình có trọng số, chi tiết xem tại [Elasticsearch Aggregations chỉ số - Weighted Avg Aggregation](https://www.knowledgedict.com/tutorial/elasticsearch-aggregations-metrics-weighted-avg-aggregation.html).

### Sum Aggregation

Sum Aggregation được sử dụng để tính tổng. Ví dụ, để thống kê tổng giá của các mặt hàng có loại là "hat" trong chỉ mục sales, câu truy vấn như sau:

```
GET /sales/_search?size=0
{
  "query" : {
    "constant_score" : {
      "filter" : {
        "match" : { "type" : "hat" }
      }
    }
  },
  "aggs" : {
    "hat_prices" : {
      "sum" : { "field" : "price" }
    }
  }
}
```

Kết quả aggregation như sau:

```
{
  ...
  "aggregations": {
    "hat_prices": {
      "value": 567.0
    }
  }
}
```

### Value Count Aggregation

Value Count Aggregation có thể được sử dụng để đếm số lượng tài liệu theo trường. Ví dụ, để đếm số lượng tài liệu có trường author trong chỉ mục books, câu truy vấn như sau:

```
GET /books/_search?size=0
{
  "aggs" : {
    "doc_count" : {
      "value_count" : { "field" : "author" }
    }
  }
}
```

Kết quả aggregation như sau:

```
{
  ...
  "aggregations": {
    "doc_count": {
      "value": 5
    }
  }
}
```

### Cardinality Aggregation

Cardinality Aggregation được sử dụng cho thống kê cơ sở, nhiệm vụ của nó là thực hiện các hoạt động tương tự như distinct trong SQL, loại bỏ các mục trùng lặp trong tập hợp, sau đó đếm độ dài của tập hợp sau khi loại bỏ trùng lặp. Ví dụ, thực hiện hoạt động cardinality trên trường language trong chỉ mục books có thể đếm số lượng ngôn ngữ lập trình, câu truy vấn như sau:

```
GET /books/_search?size=0
{
  "aggs" : {
    "all_lan" : {
      "cardinality" : { "field" : "language" }
    },
    "title_cnt" : {
      "cardinality" : { "field" : "title.keyword" }
    }
  }
}
```

**Giả sử trường title là kiểu văn bản (text), khi loại bỏ trùng lặp, bạn cần chỉ định keyword, có nghĩa là xem title như một thể thống nhất, tức là không phân tách từ để đếm**.

Kết quả aggregation như sau:

```
{
  ...
  "aggregations": {
    "all_lan": {
      "value": 8
    },
    "title_cnt": {
      "value": 18
    }
  }
}
```

### Stats Aggregation

Stats Aggregation được sử dụng để thống kê cơ bản, sẽ trả về 5 chỉ số count, max, min, avg và sum cùng một lúc. Ví dụ, để thống kê cơ bản liên quan đến điểm số trên trường grade trong chỉ mục exams, câu truy vấn như sau:

```
GET /exams/_search?size=0
{
  "aggs" : {
    "grades_stats" : {
      "stats" : { "field" : "grade" }
    }
  }
}
```

Kết quả aggregation như sau:

```
{
  ...
  "aggregations": {
    "grades_stats": {
      "count": 2,
      "min": 50.0,
      "max": 100.0,
      "avg": 75.0,
      "sum": 150.0
    }
  }
}
```

### Extended Stats Aggregation

Extended Stats Aggregation được sử dụng cho thống kê nâng cao, tương tự như thống kê cơ bản, nhưng sẽ có thêm một số kết quả thống kê sau, sum_of_squares (tổng bình phương), variance (phương sai), std_deviation (độ lệch chuẩn), std_deviation_bounds (khoảng giữa giá trị trung bình cộng/trừ hai độ lệch chuẩn). Để thống kê nâng cao liên quan đến điểm số trên trường grade trong chỉ mục exams, câu truy vấn như sau:

```
GET /exams/_search?size=0
{
  "aggs" : {
    "grades_stats" : {
      "extended_stats" : { "field" : "grade" }
    }
  }
}
```

Kết quả aggregation như sau:

```
{
  ...
  "aggregations": {
    "grades_stats": {
      "count": 2,
      "min": 50.0,
      "max": 100.0,
      "avg": 75.0,
      "sum": 150.0,
      "sum_of_squares": 12500.0,
      "variance": 625.0,
      "std_deviation": 25.0,
      "std_deviation_bounds": {
        "upper": 125.0,
        "lower": 25.0
      }
    }
  }
}
```

### Percentiles Aggregation

Percentiles Aggregation được sử dụng cho thống kê phân vị. Phân vị là một thuật ngữ thống kê, nếu ta sắp xếp một tập dữ liệu từ lớn đến nhỏ và tính toán phần trăm lũy kế tương ứng, giá trị của dữ liệu tương ứng với phân vị đó được gọi là phân vị của phân vị đó. Theo mặc định, các phân vị lũy kế là [ 1, 5, 25, 50, 75, 95, 99 ]. Ví dụ sau đây cho thấy cách thống kê phân vị thời gian tải trên trường load_time trong chỉ mục latency, câu truy vấn như sau:

```
GET latency/_search
{
  "size": 0,
  "aggs" : {
    "load_time_outlier" : {
      "percentiles" : {
        "field" : "load_time"
      }
    }
  }
}
```

**Cần lưu ý rằng, trường `load_time` như trên phải là loại số**.

Kết quả tổng hợp như sau:

```
{
  ...
  "aggregations": {
    "load_time_outlier": {
      "values" : {
        "1.0": 5.0,
        "5.0": 25.0,
        "25.0": 165.0,
        "50.0": 445.0,
        "75.0": 725.0,
        "95.0": 945.0,
        "99.0": 985.0
      }
    }
  }
}
```

Thống kê phân vị cũng có thể chỉ định tham số percents để chỉ định phân vị, như sau:

```
GET latency/_search
{
  "size": 0,
  "aggs" : {
    "load_time_outlier" : {
      "percentiles" : {
        "field" : "load_time",
        "percents": [60, 80, 95]
      }
    }
  }
}
```

### Percentiles Ranks Aggregation

Percentiles Ranks Aggregation có ý nghĩa ngược lại với Percentiles Aggregation, đó là muốn xem giá trị hiện tại nằm trong phạm vi nào (phân vị). Giả sử bạn kiểm tra xem giá trị hiện tại 500 và 600 nằm ở phân vị nào, phát hiện ra là 90.01 và 100, điều đó có nghĩa là 90.01% của các giá trị đều nằm trong phạm vi 500, và 100% của các giá trị nằm trong phạm vi 600.

```
GET latency/_search
{
  "size": 0,
    "aggs" : {
      "load_time_ranks" : {
        "percentile_ranks" : {
          "field" : "load_time",
          "values" : [500, 600]
        }
      }
  }
}
```

**Trường `load_time` cũng phải là loại số**.

Kết quả trả về sẽ tương tự như sau:

```
{
  ...
  "aggregations": {
    "load_time_ranks": {
      "values" : {
        "500.0": 90.01,
        "600.0": 100.0
      }
    }
  }
}
```

Bạn có thể đặt tham số `keyed` là `true` để trả về các giá trị tương ứng như là key của các bucket, mặc định là `false`.

```
GET latency/_search
{
  "size": 0,
  "aggs": {
    "load_time_ranks": {
      "percentile_ranks": {
        "field": "load_time",
        "values": [500, 600],
        "keyed": true
      }
    }
  }
}
```

Kết quả trả về như sau:

```
{
  ...
  "aggregations": {
    "load_time_ranks": {
      "values": [
        {
          "key": 500.0,
          "value": 90.01
        },
        {
          "key": 600.0,
          "value": 100.0
        }
      ]
    }
  }
}
```

## Bucket Aggregation

Bucket có thể được hiểu như một cái thùng, nó sẽ duyệt qua nội dung của tài liệu, những gì phù hợp với một yêu cầu nhất định sẽ được đặt vào một thùng, phân thùng tương đương với group by trong SQL. Từ một góc độ khác, bạn có thể xem metric aggregation như là bucket aggregation đơn, tức là đặt tất cả tài liệu vào một thùng, trong khi bucket aggregation là multi-bucket aggregation, nó phân nhóm theo các điều kiện tương ứng.

| Loại                          | Mô tả/Trường hợp sử dụng                                                                                                                                                                                |
| :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Terms Aggregation             | Được sử dụng cho aggregation nhóm, cho phép người dùng biết tần số của mỗi term trong tài liệu, nó trả về số lần xuất hiện của mỗi term.                                                                |
| Significant Terms Aggregation | Nó sẽ trả về sự khác biệt về tần số term trong toàn bộ chỉ mục và trong kết quả truy vấn, điều này giúp chúng ta tìm ra những từ có ý nghĩa trong cảnh quan tìm kiếm.                                   |
| Filter Aggregation            | Chuyển tất cả các tài liệu khớp với bộ lọc đã chỉ định vào một bucket duy nhất, thường thì điều này sẽ được sử dụng để thu hẹp ngữ cảnh aggregation hiện tại xuống một tập hợp cụ thể của các tài liệu. |
| Filters Aggregation           | Chuyển tất cả các tài liệu khớp với nhiều bộ lọc đã chỉ định vào nhiều bucket.                                                                                                                          |
| Range Aggregation             | Range aggregation, được sử dụng để phản ánh tình hình phân phối dữ liệu.                                                                                                                                |
| Date Range Aggregation        | Được sử dụng đặc biệt cho aggregation phạm vi ngày.                                                                                                                                                     |
| IP Range Aggregation          | Được sử dụng để aggregate phạm vi dữ liệu loại IP.                                                                                                                                                      |
| Histogram Aggregation         | Có thể là số hoặc loại ngày, tương tự như range aggregation.                                                                                                                                            |
| Date Histogram Aggregation    | Date histogram aggregation, thường được sử dụng để thống kê tài liệu theo ngày và vẽ biểu đồ cột.                                                                                                       |
| Missing Aggregation           | Missing aggregation, có thể chia tất cả các tài liệu thiếu trường trong tập hợp tài liệu vào một bucket.                                                                                                |
| Geo Distance Aggregation      | Được sử dụng để thống kê phạm vi cho các điểm địa lý (geo point).                                                                                                                                       |

### Terms Aggregation

Terms Aggregation được sử dụng để tổng hợp nhóm từ khóa. Ví dụ điển hình nhất là lấy các mục phổ biến nhất (top frequent) trong X, trong đó X là một trường nào đó trong tài liệu, chẳng hạn như tên người dùng, nhãn hoặc phân loại. Vì terms aggregation thống kê mỗi term, không phải toàn bộ giá trị trường, nên thường cần chạy loại tổng hợp này trên một trường không phân tích. Lý do là bạn mong đợi "big data" được thống kê như một cụm từ, chứ không phải "big" được thống kê riêng lẻ một lần, "data" lại được thống kê riêng lẻ một lần nữa.

Người dùng có thể sử dụng terms aggregation để trích xuất các term phổ biến nhất từ các trường phân tích (như nội dung). Thông tin này cũng có thể được sử dụng để tạo một word cloud.

```
{
  "aggs": {
    "profit_terms": {
      "terms": { // từ khóa terms aggregation
        "field": "profit",
        ......
      }
    }
  }
}
```

Dựa trên terms bucket, bạn cũng có thể thống kê các chỉ số cho mỗi bucket, hoặc sắp xếp dựa trên một số chỉ số hoặc giá trị trường. Ví dụ như sau:

```
{
  "aggs": {
    "item_terms": {
      "terms": {
        "field": "item_id",
        "size": 1000,
        "order":[{
          "gmv_stat": "desc"
        },{
          "gmv_180d": "desc"
        }]
      },
      "aggs": {
        "gmv_stat": {
          "sum": {
            "field": "gmv"
          }
        },
        "gmv_180d": {
          "sum": {
            "script": "doc['gmv_90d'].value*2"
          }
        }
      }
    }
  }
}
```

Kết quả trả về như sau:

```
{
  ...
  "aggregations": {
    "hospital_id_agg": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 260,
      "buckets": [
        {
          "key": 23388,
          "doc_count": 18,
          "gmv_stat": {
            "value": 176220
          },
          "gmv_180d": {
            "value": 89732
          }
        },
        {
          "key": 96117,
          "doc_count": 16,
          "gmv_stat": {
            "value": 129306
          },
          "gmv_180d": {
            "value": 56988
          }
        },
        ...
      ]
    }
  }
}
```

Mặc định, nó trả về 10 nhóm đầu tiên theo số lượng tài liệu từ cao đến thấp, bạn có thể chỉ định số lượng nhóm trả về thông qua tham số size.

### Filter Aggregation

Filter Aggregation là loại tổng hợp bộ lọc, có thể chia tất cả các tài liệu phù hợp với điều kiện trong bộ lọc vào một bucket, tức là tổng hợp nhóm đơn.

```
{
  "aggs": {
    "age_terms": {
      "filter": {"match":{"gender":"F"}},
      "aggs": {
        "avg_age": {
          "avg": {
            "field": "age"
          }
        }
      }
    }
  }
}
```

Trong ví dụ trên, chúng tôi tạo ra một bucket chứa tất cả các tài liệu mà trường "gender" khớp với giá trị "F". Sau đó, chúng tôi tính toán giá trị trung bình của trường "age" cho tất cả các tài liệu trong bucket này.

### Filters Aggregation

Filters Aggregation là tổng hợp nhiều bộ lọc, có thể chia các tài liệu phù hợp với nhiều điều kiện bộ lọc khác nhau vào các bucket khác nhau, tức là mỗi nhóm liên kết với một điều kiện bộ lọc và thu thập tất cả các tài liệu phù hợp với điều kiện bộ lọc của chính nó.

```
{
  "size": 0,
  "aggs": {
    "messages": {
      "filters": {
        "filters": {
          "errors": { "match": { "body": "error" } },
          "warnings": { "match": { "body": "warning" } }
        }
      }
    }
  }
}
```

Trong ví dụ này, chúng tôi phân tích thông tin nhật ký. Tổng hợp sẽ tạo ra hai nhóm về dữ liệu nhật ký, một nhóm thu thập các tài liệu chứa thông tin lỗi, nhóm khác thu thập các tài liệu chứa thông tin cảnh báo. Và mỗi nhóm sẽ được chia theo tháng.

```
{
  ...
  "aggregations": {
    "messages": {
      "buckets": {
        "errors": {
          "doc_count": 1
        },
        "warnings": {
          "doc_count": 2
        }
      }
    }
  }
}
```

Trong kết quả trả về, bạn có thể thấy số lượng tài liệu trong mỗi nhóm: có 1 tài liệu chứa thông tin lỗi và 2 tài liệu chứa thông tin cảnh báo.

### Range Aggregation

Range Aggregation, hay tổng hợp phạm vi, là một tổng hợp dựa trên nhiều nguồn giá trị, cho phép người dùng định rõ một loạt các phạm vi, mỗi phạm vi đại diện cho một nhóm. Trong quá trình thực hiện tổng hợp, giá trị được rút ra từ mỗi tài liệu sẽ được kiểm tra phạm vi của mỗi nhóm, và tài liệu liên quan sẽ rơi vào nhóm tương ứng. Lưu ý, mỗi phạm vi của tổng hợp phạm vi bao gồm giá trị từ nhưng loại trừ giá trị đến.

```
{
  "aggs": {
    "age_range": {
      "range": {
        "field": "age",
          "ranges": [{
            "to": 25
          },
          {
            "from": 25,
            "to": 35
          },
          {
            "from": 35
          }]
        },
        "aggs": {
          "bmax": {
            "max": {
              "field": "balance"
            }
          }
        }
      }
    }
  }
}
```

Kết quả trả về như sau:

```
{
  ...
  "aggregations": {
    "age_range": {
      "buckets": [{
        "key": "*-25.0",
        "to": 25,
        "doc_count": 225,
        "bmax": {
          "value": 49587
        }
      },
      {
        "key": "25.0-35.0",
        "from": 25,
        "to": 35,
        "doc_count": 485,
        "bmax": {
          "value": 49795
        }
      },
      {
        "key": "35.0-*",
        "from": 35,
        "doc_count": 290,
        "bmax": {
          "value": 49989
        }
      }]
    }
  }
}
```

## Tài liệu tham khảo

- [Elasticsearch Hướng dẫn](https://www.knowledgedict.com/tutorial/elasticsearch-intro.html)
