# Health Quiz Funnel

基于 Next.js App Router 实现的健康测评获客漏斗，包含 5 个核心步骤：
1. 基础信息（性别 + 目标）
2. 身体数据（公制/英制切换 + 校验）
3. 运动频率
4. 强制 3.5 秒分析页（进度条 + 轮播文案）
5. 动态报告 + 体重趋势图 + 订阅弹层

## 技术栈

- Next.js 16（App Router）+ TypeScript
- Tailwind CSS
- Framer Motion（步骤切换与分析页动效）
- Zustand + persist（刷新后状态恢复）
- Recharts（体重趋势图）

## 本地运行

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 进行预览。

## 质量检查

```bash
npm run lint
npm run build
```

## 关键能力说明

- **流程闭环**：Step1-5 严格串联，Step4 不可跳过且强制等待 3.5 秒。
- **输入健壮性**：年龄、身高、体重、目标体重有基础范围校验。
- **单位切换**：支持公制与英制，内部统一存储为公制用于计算。
- **动态结果**：根据输入计算 BMI、目标周数和预计达标日期，生成趋势图。
- **状态恢复**：刷新页面后恢复问卷进度；若数据不完整会回退到最近合法步骤。

## 部署（Vercel）

1. 将仓库推送到 GitHub
2. 在 Vercel 导入该仓库
3. 构建命令使用默认：`next build`
4. 部署完成后获取线上链接

- GitHub 仓库链接：`<请替换为你的仓库 URL>`
- 在线预览地址：`<请替换为你的 Vercel URL>`

## AI 使用说明

- **使用工具**：Cursor（AI 编码协作）
- **AI 主要产出**：
  - 问卷流程页面骨架与组件拆分
  - Zustand 状态模型与持久化逻辑
  - Step4 动效与 Step5 趋势图基础实现
- **手动优化部分**：
  - 交互节奏与视觉层级微调
  - 校验边界与步骤回退逻辑
  - 文案、样式细节与移动端观感优化

## 目录结构

```text
src/
  app/
    layout.tsx
    page.tsx
  components/
    common/
    quiz/
  lib/
    calculation.ts
    units.ts
  store/
    quiz-store.ts
  types/
    quiz.ts
```
