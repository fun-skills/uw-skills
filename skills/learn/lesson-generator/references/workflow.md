# Workflow

## 第 1 步——用 spaceclone 初始化工作区

运行 spaceclone 将冻结的 HTML/CSS/JS 模板复制到工作目录。SKILL_DIR 即 SKILL.md 所在目录。

```bash
node {SKILL_DIR}/scripts/spaceclone.mjs \
  --template-dir {SKILL_DIR}/assets/workspace-template \
  --here --in .
```

此命令将 `index.html`、`styles.css`、`script.js` 和 `data.js` 复制到当前目录。如果文件已存在，仅填充缺失的文件。已有的 `index.html`、`styles.css`、`script.js` 绝不会被 spaceclone 覆盖。

## 第 2 步——规划课程

在触碰任何文件之前先规划：

- 课程标题
- 2-3 句课程描述
- 6-8 节有序课程（最后一节始终为累积总复习）
- 每节：目标、2-3 个关键概念、2-4 个学习目标、正文内容（段落、AI 对话、代码示例、案例分析、洞察）、2-3 张闪卡、1-2 道测验题、来源链接

## 第 3 步——编写 data.js（仅 COURSE 数据）

`data.js` 是你唯一需要为课程内容编写的文件。它声明一个全局 `var COURSE = {...}` 对象。每次课程从零编写——spaceclone 仅提供一个占位模板。

完整 schema 和内容块类型见 [[schema]]。

**注意：不要碰 styles.css 和 script.js**

`styles.css` 和 `script.js` 完全冻结。绝不要打开或编辑它们。
