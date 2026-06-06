# Ren'Py Audio Helper

一个帮助 Ren'Py 开发者快速插入音频命令的 VSCode 插件。

## 功能特性

### 第一版功能
- ✅ **自动识别音频文件夹** - 自动查找项目中的 `game/audio` 文件夹
- ✅ **树形文件浏览** - 以树形结构展示所有音频文件
- ✅ **音频预览播放** - 点击播放按钮预听音频文件
- ✅ **智能插入代码** - 双击音频文件自动插入 Ren'Py 命令
- ✅ **自动判断命令类型** - 根据文件夹路径自动选择 sound/music/voice

### 支持的音频格式
- `.mp3`
- `.ogg`
- `.wav`
- `.opus`
- `.flac`

## 使用方法

### 1. 打开 Ren'Py 项目
在 VSCode 中打开你的 Ren'Py 项目根目录（包含 `game` 文件夹的目录）。

### 2. 查看音频文件
在左侧资源管理器中找到 **Ren'Py Audio** 面板，所有音频文件会以树形结构显示。

### 3. 预览音频
点击音频文件旁的播放按钮 ▶️ 来预览音频。播放状态会显示在底部状态栏。

### 4. 插入代码
打开 `.rpy` 脚本文件，将光标放在需要插入音频命令的位置，然后**双击**音频文件，插件会自动插入相应的代码。

#### 示例
如果你双击 `audio/sound/click.mp3`，插件会自动插入：
```renpy
play sound "audio/sound/click.mp3"
```

### 5. 自动判断命令类型
插件会根据文件路径自动判断使用哪种命令：
- `audio/sound/xxx.mp3` → `play sound "..."`
- `audio/music/xxx.mp3` → `play music "..."`
- `audio/voice/xxx.mp3` → `play voice "..."`
- 其他路径 → `play sound "..."`（默认）

### 6. 智能插入位置
插件会智能选择插入位置：
- 如果光标所在行为空行 → 在当前行插入
- 如果光标所在行有内容 → 在上方新建一行插入
- 自动匹配当前的缩进级别

## 安装步骤

### 开发环境安装
1. 确保已安装 [Node.js](https://nodejs.org/) (v18 或更高版本)
2. 克隆或下载项目代码
3. 在项目目录中运行：
   ```bash
   npm install
   ```
4. 编译项目：
   ```bash
   npm run compile
   ```
5. 按 F5 键在 VSCode 中启动调试，会打开一个新的扩展开发窗口

### 本地安装
1. 打包插件：
   ```bash
   npm install -g @vscode/vsce
   vsce package
   ```
2. 在 VSCode 中：
   - 打开扩展面板（Ctrl+Shift+X / Cmd+Shift+X）
   - 点击右上角的 `...` 菜单
   - 选择"从 VSIX 安装..."
   - 选择生成的 `.vsix` 文件

## 配置选项

在 VSCode 设置中搜索 "Ren'Py Audio Helper"，可以配置：

- `renpyAudioHelper.audioFolderPath` - 音频文件夹路径（默认：`game/audio`）
- `renpyAudioHelper.supportedFormats` - 支持的音频格式列表

## 项目结构

```
renpy-audio-helper/
├── src/
│   ├── extension.ts          # 插件入口
│   ├── audioTreeProvider.ts  # 树形视图提供者
│   └── audioPlayer.ts         # 音频播放器
├── package.json               # 插件配置
├── tsconfig.json             # TypeScript 配置
└── README.md                 # 说明文档
```

## 开发计划

### 第二版功能（计划中）
- 🔜 简单搜索 - 按文件名过滤音频
- 🔜 最近使用列表 - 快速访问常用音频
- 🔜 收藏功能 - 标记常用音频
- 🔜 命令参考指南 - 内置 Ren'Py 音频命令文档
- 🔜 拖拽支持 - 拖拽文件到编辑器插入代码
- 🔜 右键菜单 - 手动选择命令类型
- 🔜 智能提示 - 在编辑器中提供代码补全

## 系统要求
- VSCode 1.85.0 或更高版本
- macOS / Windows / Linux

## 音频播放支持
- **macOS**: 使用系统自带的 `afplay` 命令
- **Windows**: 使用 PowerShell 的 Media.SoundPlayer
- **Linux**: 需要安装 `aplay` 或 `ffplay`

## 常见问题

### Q: 为什么看不到 Ren'Py Audio 面板？
A: 确保你打开的是包含 `game/audio` 文件夹的 Ren'Py 项目目录。

### Q: 音频无法播放？
A: 
- macOS: 应该开箱即用
- Windows: 确保文件路径不包含特殊字符
- Linux: 安装 `aplay` (通常在 alsa-utils 包中) 或 `ffplay`

### Q: 如何修改默认的命令类型？
A: 目前是自动判断，第二版会添加手动选择功能。临时方案：插入后手动修改命令。

## 贡献
欢迎提交 Issue 和 Pull Request！

## 许可证
MIT

## 作者
Your Name

---

**享受 Ren'Py 开发！** 🎮🎵
