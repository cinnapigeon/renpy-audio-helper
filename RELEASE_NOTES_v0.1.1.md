# Release v0.1.1

## 🎉 改进内容

### ✨ 独立的侧边栏图标

不再将面板固定在资源管理器（EXPLORER）底部！现在 Ren'Py Audio Helper 有自己的侧边栏图标了。

**新特性：**
- 🎵 左侧活动栏有独立的音符图标
- 📌 可以拖拽到任意位置（左侧、右侧、底部）
- 🔄 可以独立打开/关闭
- 💡 不会被其他文件列表挤到下面

### 使用方法

1. 打开你的 Ren'Py 项目
2. 点击左侧活动栏的 **🎵 音符图标**
3. 音频文件面板就会打开
4. 可以拖拽到你喜欢的位置

---

## 📦 安装方式

### 方法一：下载 VSIX 文件安装

1. 下载 `renpy-audio-helper-0.1.1.vsix`
2. 在 VSCode 中打开扩展面板（Cmd+Shift+X / Ctrl+Shift+X）
3. 点击右上角的 `...` 菜单
4. 选择"从 VSIX 安装..."
5. 选择下载的文件

### 方法二：从源码编译

```bash
git clone https://github.com/你的用户名/renpy-audio-helper.git
cd renpy-audio-helper
npm install
npm run compile
```

按 F5 在 VSCode 中调试运行。

---

## 🎯 核心功能

- ✅ 自动识别 `game/audio` 文件夹
- ✅ 树形结构展示所有音频文件
- ✅ 音频预览播放
- ✅ 双击自动插入 Ren'Py 命令
- ✅ 智能判断命令类型（sound/music/voice）
- ✅ 支持多种音频格式（mp3, ogg, wav, opus, flac）

---

## 📋 完整更新日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解详细更新内容。

---

**感谢使用 Ren'Py Audio Helper！** 🎮🎵
