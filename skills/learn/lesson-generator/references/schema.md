# COURSE 数据 Schema

当前 schema 版本：`1.0.0`

每个字段均为必填。

```ts
{
  schemaVersion: string,   // "1.0.0"，用于模板兼容性检查
  style: string,           // "default-style"（默认）| "apple-style" | "bluetech-style"
  title: string,
  badge: string,           // 侧栏上下文标签
  description: string,     // 2-3 句课程描述
  duration: string,        // 预估学习时长（如 "25"）
  lessons: Lesson[]
}

interface Lesson {
  id: number,              // 从 1 开始，顺序递增
  title: string,
  goal: string,            // 一句话
  concepts: string[],      // 2-3 项；总复习为 []
  objectives: string[],    // 2-4 项
  body: ContentBlock[],
  flashcards: {            // 每节 2-3 张；总复习为 []
    front: string,
    back: string
  }[],
  quiz: {                  // 每节 1-2 题；总复习 4 题以上
    question: string,
    options: {
      text: string,
      correct: boolean,
      feedback: string
    }[]
  }[],
  sources: {               // 无来源则为 []
    label: string,
    url: string
  }[]
}
```

顶层字段（`title` / `badge` / `description` / `duration`）由 script.js 初始化时自动填充到 index.html 的对应位置，无需手动编辑 HTML。


## 内容块类型

严格使用以下格式：

| 类型 | 结构 | 用途 |
|------|------|------|
| 段落 | `{ type: "p", text: "..." }` | 正文 |
| AI 对话 | `{ type: "ai-dialog", label: "演示", messages: [{role: "user"\|"ai", text: "..."}] }` | AI 对话示例框 |
| 代码示例 | `{ type: "code-example", label: "示例代码", lang: "javascript", code: "..." }` | 带语言标签的代码块 |
| 案例分析 | `{ type: "case-example", label: "案例分析", scenario: "...", analysis: "..." }` | 场景+分析的结构化案例 |
| 洞察 | `{ type: "insight", text: "..." }` | 高亮关键洞察 |

## 测验规则

- 每题有且仅有一个正确选项
- 选项自动带 A. B. C. D. 字母前缀（运行时内置）
- 每个选项必须包含 `feedback`（选择后显示的反馈文字）
- 内容节每节 1-2 题，总复习（最后一节）4 题以上
- 最后一节（最大 id）自动识别为总复习，使用累积评分
