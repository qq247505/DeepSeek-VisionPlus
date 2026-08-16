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

DeepSeek 官方模型是纯文本模型，本身不能看图。DeepSeek VisionPlus 给它接上免费视觉模型：消息中出现图片时自动路由到视觉池理解，结果无缝回到对话；无图请求仍由 DeepSeek 官方模型处理。模型会在需要看图时主动调用，全程无需人工转述。

## ✨ 特性

- 👁️ **自动视觉路由**：消息中出现图片（选图 / 粘贴 / 模型自主 read_image）时自动交给视觉池，无图请求仍走 DeepSeek，推理等级（Off/High/Max）原样保留；
- 🎨 **模型页内嵌卡片**：设置 → 模型页里的 DeepSeek VisionPlus 卡片——添加视觉模型、配置密钥、编辑模型目录（ID/名称/上下文窗口/最大输出，K/M 单位），保存实时生效；
- 🔌 **输入框图片按钮**：选中视觉变体后出现，选图 / 多选 / 拖拽即发；
- 🧪 **一键测试**：DeepSeek 与每个视觉模型都有测试按钮——先校验参数（密钥/地址/模型 ID/官方上限），再按官方对接方式真实请求，结果气泡提示 3 秒消失；
- 🛡️ **免费额度保护**：视觉池顺序轮换 + 限频（最小间隔/每分钟上限/失败冷却），单个失败自动换下一个，全失败如实抛回 DeepSeek 自行决策；
- 💬 **友好状态行**：对话里显示"正在调用 xx 处理图片… / 成功 / 失败原因"。

## 🏗️ 架构

![architecture](docs/assets/architecture.svg)

## 📥 安装

要求：已安装官方 DeepSeek Harness（桌面端或源码运行均可）+ pnpm。

```bash
dsh plugin --profile web add github:qq247505/DeepSeek-VisionPlus
```

安装脚本会自动定位 Harness 源码目录（桌面端自带，或用 `DSH_HARNESS_ROOT` 指定），应用增强补丁并重建宿主；找不到仓库或关键补丁无法应用时，安装会**直接失败并输出原因**（插件只有完整形态，不做降级）。

## 🚀 快速开始

1. 重启 Harness，打开 设置 → 模型，展开 **DeepSeek VisionPlus** 卡片；
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

## 🧩 增强补丁

核心功能不需要补丁；安装时自动应用以下增强补丁（需能定位 Harness 源码目录）：

| 补丁 | 增强内容 |
|---|---|
| models-extra-slot | 设置卡片内嵌到官方"模型"页 |
| vision-test-channel | 测试按钮升级为真实视觉测试 |
| session-switch | 会话级模型切换（不污染全局默认） |
| token-clamp | 会话记账钳制（防负数崩溃） |
| hide-vision-cards | 会话模型选择器隐藏内部线路 |

手动应用：把 `patches\增强补丁.bat` 复制到 Harness 仓库根目录双击执行。

## ❓ 常见问题

- **测试失败：密钥无效（401）**：检查模型密钥是否填写正确；
- **测试失败：接口或模型不存在（404）**：检查 API 地址与模型 ID；
- **视觉请求限流（429）**：免费模型频率有限，插件自带限频，稍后重试；
- **想再加视觉模型**：点 "＋ 自定义模型"，按对方官方文档填写。

## 🤝 参与贡献

欢迎提 Issue 和 Pull Request。发现 bug 请附上复现步骤；功能想法请先开 Discussion 讨论。

## 📄 License

[MIT](LICENSE)

<p align="center">Made with ❤️ by qq247505</p>