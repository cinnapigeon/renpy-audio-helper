# 开发文档 - Ren'Py Audio Helper

## 快速开始

### 1. 安装依赖
```bash
cd "/Users/cinnamonpigeon/Claudecode's masterpieces/renpy-audio-helper"
npm install
```

### 2. 编译项目
```bash
npm run compile
```

### 3. 调试运行
在 VSCode 中打开项目，按 **F5** 键启动调试。会打开一个新的"扩展开发主机"窗口。

在新窗口中打开你的 Ren'Py 项目，就可以看到插件效果了。

### 4. 修改代码
修改 `src/` 目录下的代码后：
- 可以运行 `npm run compile` 重新编译
- 或者运行 `npm run watch` 自动监听文件变化
- 在"扩展开发主机"窗口中按 `Ctrl+R` (Windows/Linux) 或 `Cmd+R` (macOS) 重新加载插件

## 项目结构说明

```
renpy-audio-helper/
├── src/
│   ├── extension.ts          # 主入口文件
│   │   └── activate()         # 插件激活时调用
│   │   └── deactivate()       # 插件停用时调用
│   │
│   ├── audioTreeProvider.ts  # 音频文件树视图
│   │   └── AudioTreeProvider  # 提供树形数据
│   │   └── AudioFileItem      # 树项定义
│   │
│   └── audioPlayer.ts         # 音频播放功能
│       └── AudioPlayer        # 播放器类
│
├── package.json              # 插件配置和依赖
├── tsconfig.json            # TypeScript 编译配置
└── out/                     # 编译输出目录（自动生成）
```

## 核心功能实现

### 1. 自动识别 audio 文件夹
**文件**: `audioTreeProvider.ts`
**方法**: `findAudioFolder()`

逻辑：
1. 首先尝试配置的路径（默认 `game/audio`）
2. 尝试工作区根目录下的 `game/audio`
3. 尝试工作区根目录下的 `audio`（用户可能打开了 game 文件夹）
4. 向上一级查找 `game/audio`

### 2. 树形视图
**文件**: `audioTreeProvider.ts`
**类**: `AudioTreeProvider`

实现了 VSCode 的 `TreeDataProvider` 接口：
- `getTreeItem()` - 返回树项
- `getChildren()` - 返回子项
- 自动排序：文件夹在前，文件在后

### 3. 音频播放
**文件**: `audioPlayer.ts`
**类**: `AudioPlayer`

根据不同平台使用不同命令：
- macOS: `afplay`
- Windows: PowerShell Media.SoundPlayer
- Linux: `aplay` 或 `ffplay`

播放状态显示在 VSCode 底部状态栏。

### 4. 智能插入代码
**文件**: `extension.ts`
**函数**: `insertCommandIntelligently()`

逻辑：
1. 获取光标位置和当前行内容
2. 分析当前行的缩进级别
3. 如果是空行 → 直接插入
4. 如果有内容 → 在上方新建行插入
5. 保持与当前行相同的缩进

### 5. 命令类型判断
**文件**: `extension.ts`
**函数**: `determineCommandType()`

根据路径中的关键字判断：
- 包含 `/sound/` → `play sound`
- 包含 `/music/` → `play music`
- 包含 `/voice/` → `play voice`
- 默认 → `play sound`

## 配置项说明

在 `package.json` 的 `contributes.configuration` 中定义：

```json
{
  "renpyAudioHelper.audioFolderPath": {
    "type": "string",
    "default": "game/audio",
    "description": "音频文件夹相对于工作区的路径"
  },
  "renpyAudioHelper.supportedFormats": {
    "type": "array",
    "default": [".mp3", ".ogg", ".wav", ".opus", ".flac"],
    "description": "支持的音频文件格式"
  }
}
```

## 命令注册

在 `package.json` 的 `contributes.commands` 中定义：

1. `renpyAudioHelper.refreshAudioFiles` - 刷新文件列表
2. `renpyAudioHelper.playAudio` - 播放音频
3. `renpyAudioHelper.stopAudio` - 停止播放
4. `renpyAudioHelper.insertAudioCommand` - 插入命令

## 打包发布

### 本地测试打包
```bash
# 安装打包工具
npm install -g @vscode/vsce

# 打包
vsce package
```

会生成 `renpy-audio-helper-0.1.0.vsix` 文件。

### 发布到市场
1. 注册 [Azure DevOps](https://dev.azure.com/) 账号
2. 创建 Personal Access Token
3. 创建发布者账号
4. 更新 `package.json` 中的 `publisher` 字段
5. 运行 `vsce publish`

详细步骤见：https://code.visualstudio.com/api/working-with-extensions/publishing-extension

## 调试技巧

### 查看日志
1. 在"扩展开发主机"窗口中
2. 打开"输出"面板（View → Output）
3. 选择"扩展主机"频道
4. 可以看到 `console.log()` 的输出

### 断点调试
1. 在 `src/` 目录的代码中设置断点
2. 按 F5 启动调试
3. 在"扩展开发主机"窗口中触发相应功能
4. 会在断点处暂停

### 常见问题
- **更改没有生效**: 重新编译后，在"扩展开发主机"窗口按 Cmd+R 重新加载
- **插件没有激活**: 检查 `package.json` 中的 `activationEvents`
- **树视图不显示**: 检查 `setContext` 是否正确设置

## 第二版开发计划

需要添加的功能：
1. **搜索功能** - 在树视图顶部添加搜索框
2. **最近使用** - 使用 `context.globalState` 存储
3. **收藏功能** - 同样使用 `globalState` 存储
4. **命令参考** - 添加新的 TreeView 或 Webview
5. **拖拽支持** - 实现 `TreeDragAndDropController`
6. **智能提示** - 注册 `CompletionItemProvider`

## 贡献指南

欢迎贡献代码！请遵循以下步骤：
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 技术栈
- TypeScript 5.3+
- VSCode Extension API 1.85+
- Node.js 20+

## 参考资源
- [VSCode Extension API](https://code.visualstudio.com/api)
- [Ren'Py 官方文档](https://www.renpy.org/doc/html/)
- [TreeView API](https://code.visualstudio.com/api/extension-guides/tree-view)
