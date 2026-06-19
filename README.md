# 八卦入门 · Bagua

> 每天15分钟，搞懂八卦

交互式《易经》学习网站。通过可视化的方式认识八卦、浏览六十四卦、起卦占卜。

## 功能

- **八卦学习** — 卡片式浏览八卦，包含自然、属性、家庭、方向等对应关系
- **六十四卦** — 全部卦辞、象辞、现代释义 + 384 条爻辞原文白话
- **金钱起卦** — 交互式抛铜钱，自动识别老阴老阳少阴少阳
- **数字起卦** — 输入三个数字快速起卦
- **变爻动画** — 动爻闪烁翻转动画，直观展示卦变过程
- **注音切换** — 生僻字一键标注拼音
- **双主题** — 暗色/古典两种主题切换

## AI 构建

> 这个项目是由 **悟空**（AI 道童）辅助构建的。

### 基建

| 组件 | 说明 |
|------|------|
| [OpenClaw](https://github.com/openclaw/openclaw) | AI agent 框架，驱动悟空的道场运行 |
| [DeepSeek V4 Flash](https://deepseek.com/) | 主力模型，负责大部分推理与代码生成 |
| [智谱 GLM 5.2](https://zhipu.ai/) | 辅助模型，蹭的免费额度 😄 |

### 构建流程

从经典释义到代码实现，AI 全程参与：

| 环节 | 说明 |
|------|------|
| **内容考据** | 卦辞爻辞原文来自《周易》，AI 逐条核对、白话释义 |
| **交互设计** | 起卦流程、学习路径、动画效果由 AI 设计并迭代 |
| **代码生成** | Next.js + TypeScript 前端代码由 AI 编写，人工审查 |
| **知识管理** | 经典解读、参考资料归档到道场知识库 |

## 技术栈

- [Next.js 16](https://nextjs.org/) — React 框架
- [Tailwind CSS v4](https://tailwindcss.com/) — 样式
- TypeScript

## 本地运行

```bash
git clone git@github.com:dao-ai/bagua.git
cd bagua
npm install
npm run dev
```

打开 http://localhost:3000

## 构建

```bash
npm run build
npm start
```

## 协议

MIT © 2026 dao-ai
