# 教学工作区（WORKSPACE.md）

学习状态保存在工作区的若干文件中：

- `mission.md`：记录用户对该主题感兴趣的**原因**。所有教学都应以此为根基。格式见 [MISSION-FORMAT.md](./MISSION-FORMAT.md)。
- `resources.md`：可信外部资源列表。格式见 [RESOURCES-FORMAT.md](./RESOURCES-FORMAT.md)。
- `notes.md`：用户偏好或工作笔记的便签。
- `./lessons/`：课程目录。**agent 只手写 `0N-<slug>.md`**——内容本体，唯一信息源。对应的 `0N-<slug>.html`（渲染壳）由 `scripts/htmlbuilder.mjs` 生成，与 .md 同放此目录。详细写法见 [LESSON-FORMAT.md](./LESSON-FORMAT.md)。
- `./learning-records/*.md`：学习记录目录。教学版的 ADR——捕捉用户已有的领悟与先验知识，用于推断最近发展区（ZPD）。命名 `01-<slug>.md`，编号每次递增。格式见 [LEARNING-RECORD-FORMAT.md](./LEARNING-RECORD-FORMAT.md)。
- `./reference/*.md`：参考文档目录——速查表、术语表、算法表、瑜伽体式表。从课程中沉淀的压缩知识单元，专为快速查阅。同名 `.html` 由 `scripts/htmlbuilder.mjs` 生成（与 lessons 共用同一构建器）。模板预置 `reference/glossary.md` 空骨架；其他参考文档**懒创建**。

## 工作区判定与初始化

集成的工具：`scripts/spaceclone.mjs` — v0.1。单文件、零运行时依赖，用于工作区初始化/补齐。

用户调用时可能提供：主题名，以及可选的工作区路径/名称。

**启动前必须先判定工作区，不要直接新建子目录：**

1. 当前目录已是工作区（含 `mission.md` / `lessons/` / `learning-records/` 任一）→ 视为本次工作区
2. 用户提供已存在的目录作工作区 → 复用
3. 当前目录明显是父目录、且用户未指定具体工作区 → 设计一个清晰可复用的工作区名称，在父目录下创建
4. 用户已 `cd` 到具体学习目录调用 → 原地初始化/补齐，不再创建子目录

优先使用 skill 自带脚本 `{本skill目录}/scripts/spaceclone.mjs` 初始化（**spaceclone-js v0.1**，单文件、运行时零依赖，仅需 `node`）。它会复制或补齐 `{本skill目录}/assets/workspace-template/`。

已有/当前目录原地补齐：

```bash
node {本skill目录}/scripts/spaceclone.mjs \
  --template-dir {本skill目录}/assets/workspace-template \
  --here --in .
```

新建命名工作区（在父目录下生成 `./{工作区名称}`）：

```bash
node {本skill目录}/scripts/spaceclone.mjs \
  --template-dir {本skill目录}/assets/workspace-template \
  --marker mission.md --marker lessons \
  {工作区名称} --in .
```

`--marker` 用于工作区**复用**判定：当目标目录已存在且至少含一个 marker 时，走"补齐缺失文件"模式（保留用户已有内容）；否则视为冲突报错退出。

## 写课/构建流程

`htmlbuilder.mjs` 同时扫描 `lessons/` 和 `reference/`，对每份 `.md` 生成同名 `.html`。`reference/` 不存在则跳过。

```bash
# 在工作区根目录
node {本skill目录}/scripts/htmlbuilder.mjs                # 全量（lessons + reference）
node {本skill目录}/scripts/htmlbuilder.mjs 01-<slug>     # 指定 slug，自动定位所在目录
```

构建产物（`<dir>/<slug>.html`）与源文件（`<dir>/<slug>.md`）同目录。
