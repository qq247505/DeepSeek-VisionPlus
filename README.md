<p align="center">
  <img src="docs/assets/logo.svg" width="160" alt="DeepSeek VisionPlus" />
</p>

<h1 align="center">DeepSeek VisionPlus</h1>
<p align="center"><b>DeepSeek Harness 视觉插件 —— 文本走 DeepSeek 官方 API，图片自动路由到免费视觉模型池。</b></p>

<p align="center">
  <a href="https://github.com/qq247505/DeepSeek-VisionPlus/blob/main/LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
  <img alt="vision" src="https://img.shields.io/badge/vision-GLM%20%7C%20Qwen-8b5cf6.svg">
  <img alt="dsh" src="https://img.shields.io/badge/DeepSeek%20Harness-plugin-0ea5e9.svg">
</p>

## 👋 为什么

DeepSeek 官方模型是纯文本模型，本身不能看图。DeepSeek VisionPlus 给它接上免费视觉模型：消息中出现图片时自动路由到视觉池理解，结果无缝回到对话；无图请求仍由 DeepSeek 官方模型处理。选中视觉变体的会话会自动注入英文自主看图指引——模型需要看图时主动调用 read_image，全程无需人工转述。

## ✨ 特性

- 👁️ **自动视觉路由**：消息中出现图片（选图 / 粘贴 / 模型自主 read_image）时自动交给视觉池，无图请求仍走 DeepSeek，推理等级（Off/High/Max）原样保留；
- 🎨 **设置卡片**：设置 → 桥接视觉 独立栏目里的 DeepSeek VisionPlus 卡片——添加视觉模型、配置密钥、编辑模型目录（ID/名称/上下文窗口/最大输出，K/M 单位），保存实时生效；
- 🔌 **输入框图片按钮**：选中视觉变体后出现，选图 / 多选 / 拖拽即发；
- 🧪 **一键测试**：DeepSeek 与每个视觉模型都有测试按钮——先校验参数（密钥/地址/模型 ID/官方上限），再按官方对接方式真实请求，结果气泡提示 3 秒消失；
- 🛡️ **免费额度保护**：视觉池顺序轮换 + 限频（最小间隔/每分钟上限/失败冷却），单个失败自动换下一个，全失败如实抛回 DeepSeek 自行决策；
- 💬 **友好状态行**：对话里显示"正在调用 xx 处理图片… / 成功 / 失败原因"；
- ⚡ **内容哈希缓存**：同图 + 同问题 + 同模型自动复用上次结果，不重复调用视觉接口（LRU 上限 64）；
- 🧠 **视觉记忆**：每次视觉结果以带标记的对话行留存，会话压缩（compaction）后自动补回最近 4 条，长线任务不丢视觉上下文；
- 🧭 **自主看图指引**：选中视觉变体的会话自动注入英文系统提示——主动调用 read_image、一次读 1-2 张、失败单独重试、全部失败后自行处理本轮；切回 DeepSeek 原生模型即自动移除，不影响其他会话。

## 🏗️ 架构

![architecture](docs/assets/architecture.svg)

## 📥 安装

要求：已安装官方 DeepSeek Harness（桌面端或命令行运行均可）+ pnpm。

```bash
dsh plugin --profile web add github:qq247505/DeepSeek-VisionPlus
```

**零补丁插件**：不修改 Harness 源码，任何安装方式（源码运行 / 桌面端 / npm）装上即完整形态——设置卡片为独立栏目、测试为真实视觉测试、会话级模型切换不污染全局默认、内部线路不出现在模型选择器。

## 🚀 快速开始

1. 重启 Harness，打开 设置 → **桥接视觉**（独立栏目）卡片；
2. DeepSeek 块填入 `DEEPSEEK_API_KEY`（API 地址默认官方 `https://api.deepseek.com`），点"测试"验证；
3. 点 "＋ 智谱（GLM）" / "＋ Qwen（千问）" 添加视觉模型，填入对应密钥（`GLM_API_KEY` / `SILICONFLOW_API_KEY`），各点"测试"验证；
4. 保存 → 对话页模型选择器选择 **DeepSeek-V4-Pro 视觉**（或 Flash 视觉）；
5. 输入框点图片按钮发图，或让模型自主 read_image —— 视觉任务自动路由。

## 📚 预置视觉模型规格

| 视觉模型 | 模型 | 上下文 | 最大输出 |
|---|---|---|---|
| 智谱 GLM | glm-4.1v-thinking-flash | 64K | 16K |
| 智谱 GLM | glm-4.6v-flash | 128K | 32K |
| SiliconFlow | Qwen/Qwen3-VL-8B-Instruct | 64K | 16K |

> 数值来自官方文档模型概览与实测 API 限制；自定义模型按对方官方文档填写。

## 🧩 架构说明

- **设置存储**：配置保存在插件自有命名空间，通过插件自挂接口读写（`/api/visionPlus.settings`）——不借用 llm-pi-ai，内部线路不会出现在模型选择器；
- **真实视觉测试**：插件通过官方 `webServer` 服务自挂接口（`/api/visionPlus.test`），按各平台官方对接方式真实请求；
- **会话级模型切换**：运行时接管 `agentDefaultModel.saveSelection`（其唯一调用方是会话切换，已核实），切换只影响当前会话、不污染全局默认；
- **自主看图指引**：通过官方 systemPrompt.section() 通道，在选中视觉变体的会话内注册指引节（会话级，切走即注销），与其他插件（如 dsh-mnemon）同款机制；
- **零补丁**：以上全部为插件运行时能力，不修改 Harness 源码，npm / 源码两种安装方式完全一致。

## ❓ 常见问题

- **测试失败：密钥无效（401）**：检查模型密钥是否填写正确；
- **测试失败：接口或模型不存在（404）**：检查 API 地址与模型 ID；
- **视觉请求限流（429）**：免费模型频率有限，插件自带限频，稍后重试；
- **想再加视觉模型**：点 "＋ 自定义模型"，按对方官方文档填写。

## 🗑️ 卸载

```bash
dsh plugin --profile web remove dsh-visionplus
```

零补丁插件：卸载即干净，无需回退任何宿主改动。

## 🤝 参与贡献

欢迎提 Issue 和 Pull Request。发现 bug 请附上复现步骤；功能想法请先开 Discussion 讨论。

## 📄 License

[MIT](LICENSE)

<p align="center">Made with ❤️ by qq247505</p>