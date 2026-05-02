# 无忧拼图 (Wuyou Puzzle)

一款基于 React 的网页滑动拼图游戏，支持数字拼图和图片拼图两种模式。

## 功能

- **数字拼图** — 3×3 / 4×4 / 5×5 经典数字滑动拼图
- **图片拼图** — 上传图片后拖拽选择 1:1 裁剪区域，自动分割为拼图块
- **难度切换** — 随时切换 3×3、4×4、5×5
- **操作方式** — 点击拼图块移动、方向键控制、虚拟方向按钮
- **提示系统** — 高亮可移动的拼图块
- **计时 & 计步** — 首次移动开始计时，实时显示用时和步数
- **音效系统** — Web Audio API 合成音效，支持开关和背景音乐
- **排行榜** — 本地存储保存完成记录
- **暂停功能** — 游戏过程中可暂停

## 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite 8
- **样式方案**: CSS Modules
- **测试**: Vitest
- **音效**: Web Audio API（无需外部音频文件）
- **图片裁剪**: Canvas API
- **状态管理**: React Hooks（无外部状态库）

## 开始使用

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 运行测试
npx vitest run

# 运行 lint
npm run lint
```

## 项目结构

```
src/
├── main.tsx                  # 入口
├── App.tsx                   # 根组件（页面路由 + 全局状态）
├── App.module.css
├── index.css                 # 全局样式
├── types/
│   └── index.ts              # 类型定义
├── utils/
│   ├── shuffle.ts            # 洗牌算法 + 可解性验证（逆序数）
│   ├── shuffle.test.ts       # 测试
│   └── sound.ts              # Web Audio API 音效合成
├── hooks/
│   ├── usePuzzleGame.ts      # 拼图核心逻辑（状态管理、移动、完成检测）
│   ├── useTimer.ts           # 计时器
│   ├── useSound.ts           # 音效控制
│   └── useLeaderboard.ts     # 排行榜（LocalStorage）
├── components/
│   ├── Tile.tsx              # 单个拼图块
│   ├── PuzzleBoard.tsx       # 拼图棋盘
│   ├── GameStats.tsx         # 计时 & 计步 & 提示
│   ├── GameControls.tsx      # 洗牌、暂停、重置
│   ├── DirectionPad.tsx      # 虚拟方向按钮
│   ├── DifficultySelector.tsx
│   ├── ImageUploader.tsx     # 图片上传 + 拖拽裁剪
│   ├── CompletionModal.tsx   # 完成弹窗
│   ├── Header.tsx            # 导航头部
│   └── SoundToggle.tsx       # 音效开关
├── pages/
│   ├── NumberPuzzlePage.tsx  # 数字拼图页面
│   ├── ImagePuzzlePage.tsx   # 图片拼图页面
│   └── LeaderboardPage.tsx   # 排行榜页面
└── index.css
```

## 核心技术

### 拼图可解性

使用 Fisher-Yates 洗牌算法生成初始状态，通过**逆序数**验证可解性：
- 奇数网格：逆序数为偶数则可解
- 偶数网格：逆序数 + 空格所在行（从下往上）为奇数则可解

### 图片处理

1. 用户拖拽 1:1 选框选择裁剪区域
2. Canvas API 裁剪为正方形
3. 通过 `backgroundPosition` 精灵图方式显示每个拼图块（无需分割存储）

### 音效

使用 Web Audio API 合成，零外部音频文件依赖，包含移动音效、完成音效和背景音乐。
