# 课程格式（LESSON-FORMAT.md）

只管文件机制：怎么命名、怎么构建、怎么打开、跨链语法。**怎么写好课程内容**见 [LESSON-CONTENT.md](./LESSON-CONTENT.md)。

## 工作区文件分布

```
./lessons/01-<slug>.md    ← agent 手写的唯一文件
./lessons/01-<slug>.html  ← htmlbuilder.mjs 生成
```

`.md` 与生成的 `.html` 同名（不含扩展名），同放在 `./lessons/`。

每节课只手写一份 `.md`；对应的 `.html` 由 skill 自带的脚本生成。**skill 自带构建器（markdown->html）：** `./scripts/{template.html, htmlbuilder.mjs}`

## 编号

扫描 `./lessons/` 取现有最大编号 +1。两位补零。

## 跨链语法

- 课程间：`[见 03 课](03-xxx.html#anchor)`
- 参考文档：`[术语](../reference/glossary.html#term)`（由 `reference/glossary.md` 生成 `.html`）

## 渲染策略

`scripts/template.html` 里实现：

- 路线 A：用户装了浏览器插件 [markdown-viewer 扩展](https://chromewebstore.google.com/detail/markdown-viewer/jekhhoflgcfoikceikgeenibinpojaoi) → 由扩展接管渲染
- 路线 B：500ms 内等不到扩展 → 用 jsDelivr 上的 marked + 模板内联样式自渲染

实际代码以 `scripts/` 下文件为准；本文件不重复。

## Agent 写课流程

1. 扫 `./lessons/` 确定下一个编号 N
2. 写 `./lessons/0N-<slug>.md`（**内容怎么写见 [LESSON-CONTENT.md](./LESSON-CONTENT.md)**）
3. 在工作区根目录跑：
   - `node {本skill目录}/scripts/htmlbuilder.mjs 0N-<slug>` 单个构建
   - `node {本skill目录}/scripts/htmlbuilder.mjs` 全量
4. **直接打开**生成的 `.html`（不要把命令贴给用户让他自己跑）：
   - macOS：`open ./lessons/0N-<slug>.html`
   - Linux：`xdg-open ./lessons/0N-<slug>.html`
   - Windows：`start "" .\lessons\0N-<slug>.html`
