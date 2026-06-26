# uw

一个名叫 **uw** 的 skills kit，供 Claude Code / Codex 作为 plugin 安装使用。

## 它是什么

- **skills kit**：一组 Markdown 形式的 skill 描述 + 配套脚本/模板。
- **plugin 化分发**：通过 `.claude-plugin/plugin.json` 暴露 skills 列表，可直接作为 Claude Code plugin 或 Codex plugin 安装。
- **可单点调用**：用户通过 `/skill-name` 或自然语言触发其中任意一个 skill，互不依赖。

## 安装

(暂略)

## 结构

```
uw/
├── .claude-plugin/
│   └── plugin.json        # 暴露 skills 列表
├── skills/
│   └── <skill-name>/
│       ├── SKILL.md       # skill 定义（触发条件 + 说明）
│       └── ...            # 脚本、模板、参考资料
└── README.md
```

`plugin.json` 中列出本 kit 内启用的 skills，安装方在加载时会逐个注册。

## 使用

安装后，在 Claude Code / Codex 会话中：

- 直接 `/skill-name` 调用某个 skill；
- 或用自然语言描述任务，由模型根据 skill 的 `description` 自行匹配触发。

## License

MIT
