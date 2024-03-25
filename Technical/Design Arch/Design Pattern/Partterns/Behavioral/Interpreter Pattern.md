---
title: Interpreter Pattern
tags:
  - design-pattern
categories:
  - design-pattern
date created: 2023-10-06
date modified: 2024-03-25
---

## Giới thiệu

Interpreter Pattern định nghĩa một ngôn ngữ và biểu diễn cú pháp của nó. Nó cũng định nghĩa một trình thông dịch sử dụng biểu diễn đó để giải thích các câu trong ngôn ngữ.

Interpreter Pattern là một mẫu thiết kế hành vi.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200726112138.png)

**Context**: Chứa thông tin toàn cục ngoài trình thông dịch.

```java
class Context {
    private String input;
    private String output;

    public void setInput(String input) {
        this.input = input;
    }

    public String getInput() {
        return this.input;
    }

    public void setOutput(String output) {
        this.output = output;
    }

    public String getOutput() {
        return this.output;
    }
}
```

**AbstractExpression**: Khai báo một hoạt động thông dịch trừu tượng, giao diện này được chia sẻ bởi tất cả các nút trong cây cú pháp trừu tượng.

```java
abstract class AbstractExpression {
    public abstract void Interpret(Context context);
}
```

**TerminalExpression**: Thực hiện hoạt động thông dịch liên quan đến các ký tự cuối cùng trong cú pháp. Thực hiện giao diện yêu cầu trong biểu diễn trừu tượng, chủ yếu là phương thức Interpret().

Mỗi ký tự cuối cùng trong cú pháp đều có một biểu diễn cuối cùng cụ thể tương ứng.

```java
class TerminalExpression extends AbstractExpression {
    @Override
    public void Interpret(Context context) {
        context.setOutput("Terminal " + context.getInput());
        System.out.println(context.getInput() + " được giải thích bởi trình thông dịch cuối cùng thành: " + context.getOutput());
    }
}
```

**NonterminalExpression**: Thực hiện hoạt động thông dịch liên quan đến các ký tự không cuối cùng trong cú pháp. Mỗi quy tắc R1, R2,… Rn trong cú pháp đều cần một lớp biểu diễn không cuối cùng cụ thể. Thông qua việc thực hiện phương thức Interpret() của biểu diễn trừu tượng để thực hiện hoạt động thông dịch.

```java
class NonterminalExpression extends AbstractExpression {
    @Override
    public void Interpret(Context context) {
        context.setOutput("Nonterminal " + context.getInput());
        System.out.println(context.getInput() + " được giải thích bởi trình thông dịch không cuối cùng thành: " + context.getOutput());
    }
}
```

**Khách hàng**

```java
public class InterpreterPattern {
    public static void main(String[] args) {
        Context context = new Context();
        context.setInput("ABC");

        AbstractExpression expression1 = new TerminalExpression();
        expression1.Interpret(context);

        AbstractExpression expression2 = new NonterminalExpression();
        expression2.Interpret(context);
    }
}
```

**Đầu ra**

```
ABC được giải thích bởi trình thông dịch cuối cùng thành: Terminal ABC
ABC được giải thích bởi trình thông dịch không cuối cùng thành: Nonterminal ABC
```

## Ví dụ

## Tình huống
