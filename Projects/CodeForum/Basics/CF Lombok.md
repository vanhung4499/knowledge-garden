---
title: CF Lombok
tags:
  - project
  - codeforum
categories: 
date created: 2024-04-17
date modified: 2024-04-17
---

# Rút gọn code với Lombok

Spring Boot đã tích hợp Lombok vào trong các starter từ phiên bản 2.1.x trở đi, và IntelliJ IDEA cũng tích hợp plugin Lombok từ phiên bản 2020.3 trở đi. Vậy tại sao cả hai lại hỗ trợ Lombok như vậy? Lombok có gì đặc biệt?

## 1. Giới thiệu về Lombok

Trên trang web chính thức, Lombok tự giới thiệu như sau:

> Dự án Lombok khiến Java trở nên phong phú hơn bằng cách thêm vào 'handlers' biết cách xây dựng và biên dịch mã Java đơn giản, không cần phải viết mã ghi chép.

Tóm tắt ý nghĩa chung là: Lombok là một thư viện tốt, có thể thêm vào mã Java một số "trình xử lý" biết cách tạo và biên dịch mã Java đơn giản, mà không cần phải viết mã lặp đi lặp lại.

Theo tôi, lợi ích lớn nhất của Lombok là làm cho mã Java trở nên đơn giản hóa thông qua việc sử dụng các annotation. Đơn giản hóa đến mức nào?

Dưới đây là một ví dụ. Dĩ nhiên, như một lập trình viên Java, bạn đã từng viết rất nhiều getter / setter. Mặc dù có thể sử dụng IDE để tự động tạo ra chúng, nhưng nếu thuộc tính của `Javabean` có rất nhiều, bạn sẽ phải viết rất nhiều getter / setter, làm cho mã nguồn trở nên không thật sự gọn gàng, giống như một chiếc khăn quàng chân cụt và dài của bà già.

```java
class Cmower {
	private int age;
	private String name;
	private BigDecimal money;

	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public BigDecimal getMoney() {
		return money;
	}
	public void setMoney(BigDecimal money) {
		this.money = money;
	}
}
```

Lombok có thể tự động tạo ra getter / setter cho các thuộc tính của `Javabean` thông qua các annotation, và điều này xảy ra trong quá trình biên dịch, tức là mã nguồn không chứa getter / setter.

```java
@Getter
@Setter
class CmowerLombok {
	private int age;
	private String name;
	private BigDecimal money;
}
```

Nhìn vào, mã nguồn trở nên gọn gàng hơn nhiều, phải không?

## 2. Tích hợp Lombok

Nếu dự án sử dụng Maven để xây dựng, việc thêm phụ thuộc vào Lombok trở nên rất dễ dàng.

```xml
<dependency>
	<groupId>org.projectlombok</groupId>
	<artifactId>lombok</artifactId>
	<version>1.18.6</version>
	<scope>provided</scope>
</dependency>
```

Ở đây, `scope=provided` cho biết rằng Lombok chỉ hoạt động trong quá trình biên dịch. Nói cách khác, Lombok sẽ tự động biên dịch các tệp nguồn chứa các annotation Lombok thành các tệp class hoàn chỉnh.

Từ phiên bản Spring Boot 2.1.x trở đi, không cần phải thêm phụ thuộc vào Lombok một cách rõ ràng nữa. Sau đó, bạn cần cài đặt plugin Lombok cho IntelliJ IDEA, nếu không, getter / setter của Javabean sẽ không được tự động biên dịch và không thể gọi. Tuy nhiên, phiên bản mới của IntelliJ IDEA đã tích hợp sẵn plugin Lombok, không cần phải cài đặt thêm.

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/1683679718114-677d212a-4085-48e1-bdc5-7e736c9d5b57.webp)

## 3. Các annotation phổ biến của Lombok

### 1) **@Getter / @Setter**

`@Getter / @Setter` được sử dụng một cách linh hoạt, ví dụ như sau:

```java
class CmowerLombok {
	@Getter @Setter private int age;
	@Getter private String name;
	@Setter private BigDecimal money;
}
```

Sau khi mã nguồn được biên dịch, nội dung của tệp byte code sẽ là:

```java
class CmowerLombok {
	private int age;
	private String name;
	private BigDecimal money;

	public int getAge() {
		return this.age;
	}

	public void setAge(int age) {
		this.age = age;
	}

	public String getName() {
		return this.name;
	}

	public void setMoney(BigDecimal money) {
		this.money = money;
	}
}
```

### 2) **@ToString**

`@ToString` là một công cụ tuyệt vời để in log.

```java
@ToString
class CmowerLombok {
	private int age;
	private String name;
	private BigDecimal money;
}
```

Sau khi mã nguồn được biên dịch, nội dung của tệp byte code sẽ là:

```java
class CmowerLombok {
	private int age;
	private String name;
	private BigDecimal money;

	public String toString() {
		return "CmowerLombok(age=" + this.age + ", name=" + this.name + ", money=" + this.money + ")";
	}
}
```

### 3) **val**

Trong việc viết mã JavaScript, tôi luôn cảm thấy rằng việc sử dụng `var` để khai báo biến là rất tiện lợi. Lombok cũng cung cấp một cái gì đó tương tự.

```java
class CmowerLombok {
	public void test() {
		val names = new ArrayList<String>();
		names.add("HungNguyen");
		val name = names.get(0);
		System.out.println(name);
	}
}
```

Sau khi mã nguồn được biên dịch, nội dung của tệp byte code sẽ là:

```java
class CmowerLombok {
	public void test() {
		ArrayList<String> names = new ArrayList();
		names.add("HungNguyen");
		String name = (String) names.get(0);
		System.out.println(name);
	}
}
```

### 4) **@Data**

annotation `@Data` có thể tạo ra `getter / setter`, `equals`, `hashCode`, và `toString`, là một tùy chọn toàn diện.

```java
@Data
class CmowerLombok {
	private int age;
	private String name;
	private BigDecimal money;
}
```

Sau khi mã nguồn được biên dịch, nội dung của tệp byte code sẽ là:

```java
class CmowerLombok {
	private int age;
	private String name;
	private BigDecimal money;

	public int getAge() {
		return this.age;
	}

	public String getName() {
		return this.name;
	}

	public BigDecimal getMoney() {
		return this.money;
	}

	public void setAge(int age) {
		this.age = age;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setMoney(BigDecimal money) {
		this.money = money;
	}

	public boolean equals(Object o) {
		if (o == this) {
			return true;
		} else if (!(o instanceof CmowerLombok)) {
			return false;
		} else {
			CmowerLombok other = (CmowerLombok) o;
			if (!other.canEqual(this)) {
				return false;
			} else if (this.getAge() != other.getAge()) {
				return false;
			} else {
				Object this$name = this.getName();
				Object other$name = other.getName();
				if (this$name == null) {
					if (other$name != null) {
						return false;
					}
				} else if (!this$name.equals(other$name)) {
					return false;
				}

				Object this$money = this.getMoney();
				Object other$money = other.getMoney();
				if (this$money == null) {
					if (other$money != null) {
						return false;
					}
				} else if (!this$money.equals(other$money)) {
					return false;
				}

				return true;
			}
		}
	}

	protected boolean canEqual(Object other) {
		return other instanceof CmowerLombok;
	}

	public int hashCode() {
		int PRIME = true;
		int result = 1;
		result = result * 59 + this.getAge();
		Object $name = this.getName();
		result = result * 59 + ($name == null ? 43 : $name.hashCode());
		Object $money = this.getMoney();
		result = result * 59 + ($money == null ? 43 : $money.hashCode());
		return result;
	}

	public String toString() {
		return "CmowerLombok(age=" + this.getAge() + ", name=" + this.getName() + ", money=" + this.getMoney() + ")";
	}
}
```

### 5) [@Slf4j](/Slf4j)

[@Slf4j](/Slf4j) có thể được sử dụng để tạo ra đối tượng logger. Bạn có thể chọn loại annotation phù hợp với cách triển khai nhật ký của riêng bạn, như: @Log, @Log4j, @Log4j2, @Slf4j, vv.

```java
@Slf4j
public class Log4jDemo {
    public static void main(String[] args) {
        log.info("level:{}","info");
        log.warn("level:{}","warn");
        log.error("level:{}", "error");
    }
}
```

Sau khi mã nguồn được biên dịch, nội dung của tệp byte code sẽ là:

```java
public class Log4jDemo {
    private static final Logger log = LoggerFactory.getLogger(Log4jDemo.class);

    public Log4jDemo() {
    }

    public static void main(String[] args) {
        log.info("level:{}", "info");
        log.warn("level:{}", "warn");
        log.error("level:{}", "error");
    }
}
```

### 6) [@Builder](/Builder)

annotation [@Builder](/Builder) có thể được sử dụng để tạo ra đối tượng thông qua mẫu Builder, điều này cho phép gán giá trị cho đối tượng thông qua cuộc gọi chuỗi, rất tiện lợi.

```java
@Builder
@ToString
public class BuilderDemo {
    private Long id;
    private String name;
    private Integer age;

    public static void main(String[] args) {
        BuilderDemo demo = BuilderDemo.builder().age(18).name("沉默王二").build();
        System.out.println(demo);
    }
}
```

Sau khi mã nguồn được biên dịch, nội dung của tệp byte code sẽ là:

```java
public class BuilderDemo {
    private Long id;
    private String name;
    private Integer age;

    public static void main(String[] args) {
        BuilderDemo demo = builder().age(18).name("沉默王二").build();
        System.out.println(demo);
    }

    BuilderDemo(final Long id, final String name, final Integer age) {
        this.id = id;
        this.name = name;
        this.age = age;
    }

    public static BuilderDemo.BuilderDemoBuilder builder() {
        return new BuilderDemo.BuilderDemoBuilder();
    }

    public String toString() {
        return "BuilderDemo(id=" + this.id + ", name=" + this.name + ", age=" + this.age + ")";
    }

    public static class BuilderDemoBuilder {
        private Long id;
        private String name;
        private Integer age;

        BuilderDemoBuilder() {
        }

        public BuilderDemo.BuilderDemoBuilder id(final Long id) {
            this.id = id;
            return this;
        }

        public BuilderDemo.BuilderDemoBuilder name(final String name) {
            this.name = name;
            return this;
        }

        public BuilderDemo.BuilderDemoBuilder age(final Integer age) {
            this.age = age;
            return this;
        }

        public BuilderDemo build() {
            return new BuilderDemo(this.id, this.name, this.age);
        }

        public String toString() {
            return "BuilderDemo.BuilderDemoBuilder(id=" + this.id + ", name=" + this.name + ", age=" + this.age + ")";
        }
    }
}
```

Ngoài những annotation đã nêu ở trên, Lombok còn cung cấp các annotation khác như đồng bộ hóa [@Synchronized](/Synchronized), tự động ném ngoại lệ [@SneakyThrows](/SneakyThrows), đối tượng không thể thay đổi [@Value](/Value), tự động tạo ra hashCode và equals [@EqualsAndHashCode](/EqualsAndHashCode), vv. Bạn có thể thử nghiệm và trải nghiệm cách Lombok hoạt động bằng cách xem nội dung của tệp byte code đã được biên dịch.

## 4. Ví dụ sử dụng Lombok trong dự án

Lombok được sử dụng rộng rãi trong dự án, ví dụ như trong lớp ArticleDetailDO (Data Object, đối tượng dữ liệu) trong chi tiết bài viết:

```java
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("article_detail")
public class ArticleDetailDO extends BaseDO {

    private static final long serialVersionUID = 1L;

    /**
     * ID của bài viết
     */
    private Long articleId;

    /**
     * Số phiên bản
     */
    private Long version;

    /**
     * Nội dung của bài viết
     */
    private String content;

    private Integer deleted;
}
```

- **@Data**: Từ Lombok, được sử dụng để tự động tạo ra các phương thức getter, setter, equals, hashCode và toString.
- **@EqualsAndHashCode(callSuper = true)**: Từ Lombok, được sử dụng để chỉ định rằng trong quá trình tạo ra các phương thức equals và hashCode, cần bao gồm các thuộc tính của lớp cha. Lớp cha là BaseDO, có ba thuộc tính.

```java
@Data
public class BaseDO implements Serializable {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Date createTime;

    private Date updateTime;
}
```

Được rồi, chúng ta hãy xem tệp bytecode đã biên dịch.

```java
@TableName("article_detail")
public class ArticleDetailDO extends BaseDO {
    private static final long serialVersionUID = 1L;
    private Long articleId;
    private Long version;
    private String content;
    private Integer deleted;

    public ArticleDetailDO() {
    }

    public Long getArticleId() {
        return this.articleId;
    }

    public Long getVersion() {
        return this.version;
    }

    public String getContent() {
        return this.content;
    }

    public Integer getDeleted() {
        return this.deleted;
    }

    public void setArticleId(final Long articleId) {
        this.articleId = articleId;
    }

    public void setVersion(final Long version) {
        this.version = version;
    }

    public void setContent(final String content) {
        this.content = content;
    }

    public void setDeleted(final Integer deleted) {
        this.deleted = deleted;
    }

    public String toString() {
        return "ArticleDetailDO(articleId=" + this.getArticleId() + ", version=" + this.getVersion() + ", content=" + this.getContent() + ", deleted=" + this.getDeleted() + ")";
    }

    public boolean equals(final Object o) {
        if (o == this) {
            return true;
        } else if (!(o instanceof ArticleDetailDO)) {
            return false;
        } else {
            ArticleDetailDO other = (ArticleDetailDO)o;
            if (!other.canEqual(this)) {
                return false;
            } else if (!super.equals(o)) {
                return false;
            } else {
                label61: {
                    Object this$articleId = this.getArticleId();
                    Object other$articleId = other.getArticleId();
                    if (this$articleId == null) {
                        if (other$articleId == null) {
                            break label61;
                        }
                    } else if (this$articleId.equals(other$articleId)) {
                        break label61;
                    }

                    return false;
                }

                label54: {
                    Object this$version = this.getVersion();
                    Object other$version = other.getVersion();
                    if (this$version == null) {
                        if (other$version == null) {
                            break label54;
                        }
                    } else if (this$version.equals(other$version)) {
                        break label54;
                    }

                    return false;
                }

                Object this$deleted = this.getDeleted();
                Object other$deleted = other.getDeleted();
                if (this$deleted == null) {
                    if (other$deleted != null) {
                        return false;
                    }
                } else if (!this$deleted.equals(other$deleted)) {
                    return false;
                }

                Object this$content = this.getContent();
                Object other$content = other.getContent();
                if (this$content == null) {
                    if (other$content != null) {
                        return false;
                    }
                } else if (!this$content.equals(other$content)) {
                    return false;
                }

                return true;
            }
        }
    }

    protected boolean canEqual(final Object other) {
        return other instanceof ArticleDetailDO;
    }

    public int hashCode() {
        int PRIME = true;
        int result = super.hashCode();
        Object $articleId = this.getArticleId();
        result = result * 59 + ($articleId == null ? 43 : $articleId.hashCode());
        Object $version = this.getVersion();
        result = result * 59 + ($version == null ? 43 : $version.hashCode());
        Object $deleted = this.getDeleted();
        result = result * 59 + ($deleted == null ? 43 : $deleted.hashCode());
        Object $content = this.getContent();
        result = result * 59 + ($content == null ? 43 : $content.hashCode());
        return result;
    }
}
```

1. Có phương thức getter và setter: được sử dụng để lấy và đặt giá trị của mỗi thuộc tính.
2. Có phương thức **toString()**: trả về một chuỗi chứa các giá trị thuộc tính của đối tượng.
3. Có phương thức **equals(Object o)**: so sánh đối tượng cung cấp với đối tượng hiện tại xem chúng có bằng nhau không, trước tiên so sánh loại của hai đối tượng, sau đó so sánh các giá trị thuộc tính của chúng.
4. Có phương thức **canEqual(Object other)**: kiểm tra xem đối tượng cung cấp có phải là một ví dụ của **ArticleDetailDO** hay không, để đảm bảo phương thức **equals** có thể so sánh đúng hai đối tượng.
5. Có phương thức **hashCode()**: sinh mã băm của đối tượng.

Ví dụ khác như DTO (Data Transfer Object, đối tượng truyền dữ liệu) **CategoryDTO**.

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO implements Serializable {
    public static final String DEFAULT_TOTAL_CATEGORY = "All";
    public static final CategoryDTO DEFAULT_CATEGORY = new CategoryDTO(0L, "All");

    private static final long serialVersionUID = 8272116638231812207L;
    public static CategoryDTO EMPTY = new CategoryDTO(-1L, "illegal");

    private Long categoryId;

    private String category;

    private Integer rank;

    private Integer status;

    private Boolean selected;

    public CategoryDTO(Long categoryId, String category) {
        this(categoryId, category, 0);
    }

    public CategoryDTO(Long categoryId, String category, Integer rank) {
        this.categoryId = categoryId;
        this.category = category;
        this.status = PushStatusEnum.ONLINE.getCode();
        this.rank = rank;
        this.selected = false;
    }
}

```

1. **@Data**: Đến từ Lombok, được sử dụng để tự động tạo ra các phương thức getter, setter, equals, hashCode và toString.
2. **@NoArgsConstructor**: Đến từ Lombok, được sử dụng để tự động tạo ra một constructor không có tham số.
3. **@AllArgsConstructor**: Đến từ Lombok, được sử dụng để tự động tạo ra một constructor chứa tất cả các thuộc tính.

Sau khi biên dịch, mọi người cũng có thể xem mã nguồn để thấy rằng nó thực sự tiết kiệm rất nhiều mã.

```java
public class CategoryDTO implements Serializable {
    public static final String DEFAULT_TOTAL_CATEGORY = "ALL";
    public static final CategoryDTO DEFAULT_CATEGORY = new CategoryDTO(0L, "ALL");
    private static final long serialVersionUID = 8272116638231812207L;
    public static CategoryDTO EMPTY = new CategoryDTO(-1L, "illegal");
    private Long categoryId;
    private String category;
    private Integer rank;
    private Integer status;
    private Boolean selected;

    public CategoryDTO(Long categoryId, String category) {
        this(categoryId, category, 0);
    }

    public CategoryDTO(Long categoryId, String category, Integer rank) {
        this.categoryId = categoryId;
        this.category = category;
        this.status = PushStatusEnum.ONLINE.getCode();
        this.rank = rank;
        this.selected = false;
    }

    public Long getCategoryId() {
        return this.categoryId;
    }

    public String getCategory() {
        return this.category;
    }

    public Integer getRank() {
        return this.rank;
    }

    public Integer getStatus() {
        return this.status;
    }

    public Boolean getSelected() {
        return this.selected;
    }

    public void setCategoryId(final Long categoryId) {
        this.categoryId = categoryId;
    }

    public void setCategory(final String category) {
        this.category = category;
    }

    public void setRank(final Integer rank) {
        this.rank = rank;
    }

    public void setStatus(final Integer status) {
        this.status = status;
    }

    public void setSelected(final Boolean selected) {
        this.selected = selected;
    }

    public boolean equals(final Object o) {
        if (o == this) {
            return true;
        } else if (!(o instanceof CategoryDTO)) {
            return false;
        } else {
            CategoryDTO other = (CategoryDTO)o;
            if (!other.canEqual(this)) {
                return false;
            } else {
                label71: {
                    Object this$categoryId = this.getCategoryId();
                    Object other$categoryId = other.getCategoryId();
                    if (this$categoryId == null) {
                        if (other$categoryId == null) {
                            break label71;
                        }
                    } else if (this$categoryId.equals(other$categoryId)) {
                        break label71;
                    }

                    return false;
                }

                Object this$rank = this.getRank();
                Object other$rank = other.getRank();
                if (this$rank == null) {
                    if (other$rank != null) {
                        return false;
                    }
                } else if (!this$rank.equals(other$rank)) {
                    return false;
                }

                label57: {
                    Object this$status = this.getStatus();
                    Object other$status = other.getStatus();
                    if (this$status == null) {
                        if (other$status == null) {
                            break label57;
                        }
                    } else if (this$status.equals(other$status)) {
                        break label57;
                    }

                    return false;
                }

                Object this$selected = this.getSelected();
                Object other$selected = other.getSelected();
                if (this$selected == null) {
                    if (other$selected != null) {
                        return false;
                    }
                } else if (!this$selected.equals(other$selected)) {
                    return false;
                }

                Object this$category = this.getCategory();
                Object other$category = other.getCategory();
                if (this$category == null) {
                    if (other$category == null) {
                        return true;
                    }
                } else if (this$category.equals(other$category)) {
                    return true;
                }

                return false;
            }
        }
    }

    protected boolean canEqual(final Object other) {
        return other instanceof CategoryDTO;
    }

    public int hashCode() {
        int PRIME = true;
        int result = 1;
        Object $categoryId = this.getCategoryId();
        int result = result * 59 + ($categoryId == null ? 43 : $categoryId.hashCode());
        Object $rank = this.getRank();
        result = result * 59 + ($rank == null ? 43 : $rank.hashCode());
        Object $status = this.getStatus();
        result = result * 59 + ($status == null ? 43 : $status.hashCode());
        Object $selected = this.getSelected();
        result = result * 59 + ($selected == null ? 43 : $selected.hashCode());
        Object $category = this.getCategory();
        result = result * 59 + ($category == null ? 43 : $category.hashCode());
        return result;
    }

    public String toString() {
        return "CategoryDTO(categoryId=" + this.getCategoryId() + ", category=" + this.getCategory() + ", rank=" + this.getRank() + ", status=" + this.getStatus() + ", selected=" + this.getSelected() + ")";
    }

    public CategoryDTO() {
    }

    public CategoryDTO(final Long categoryId, final String category, final Integer rank, final Integer status, final Boolean selected) {
        this.categoryId = categoryId;
        this.category = category;
        this.rank = rank;
        this.status = status;
        this.selected = selected;
    }
}
```

## 5. Quy trình xử lý lombok

Hình minh họa:

![lombok flow](https://cdn.nlark.com/yuque/0/2023/webp/12564477/1683679717961-d77387e4-6959-4df1-8841-f8f66a8b74bc.webp)

- `javac` phân tích mã nguồn để tạo ra một cây cú pháp trừu tượng (AST).
- Trong quá trình biên dịch, `javac` gọi Lombok, một chương trình đã thực hiện JSR 269.
- Lombok xử lý AST, tìm các nút cây tương ứng với các annotation Lombok trong lớp, sau đó sửa đổi cây cú pháp bằng cách thêm các nút cây tương ứng với annotation Lombok (còn gọi là mã).
- `javac` sử dụng cây cú pháp trừu tượng đã sửa đổi để tạo ra các tệp bytecode.

Dù Lombok dễ sử dụng nhưng cần có sự đồng thuận trong nhóm. Nếu chỉ một số người trong nhóm sử dụng Lombok, sẽ gây ra sự mất ổn định và ảnh hưởng đến phong cách mã nguồn. Hơn nữa, nếu có thành viên trong nhóm vẫn sử dụng Eclipse, họ cũng phải cài đặt plugin Lombok, nếu không, mở một dự án sử dụng annotation Lombok sẽ không thể biên dịch được.