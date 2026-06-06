# 快速开始指南

## 🚀 5 分钟上手

### 第一步：安装依赖

打开终端，进入项目目录：

```bash
cd "/Users/cinnamonpigeon/Claudecode's masterpieces/renpy-audio-helper"
npm install
```

### 第二步：编译项目

```bash
npm run compile
```

### 第三步：测试插件

1. 在 VSCode 中打开这个项目文件夹
2. 按 **F5** 键（或者点击"运行" → "启动调试"）
3. 会打开一个新的 VSCode 窗口（扩展开发主机）
4. 在新窗口中打开你的 Ren'Py 项目（包含 `game/audio` 文件夹）
5. 查看左侧资源管理器，应该能看到 **Ren'Py Audio** 面板

### 第四步：试用功能

1. 打开一个 `.rpy` 脚本文件
2. 在 Ren'Py Audio 面板中找到一个音频文件
3. 点击播放按钮 ▶️ 预览音频
4. 双击音频文件，自动插入代码！

## 📦 使用 GitHub Desktop 上传

### 方法一：通过 GitHub Desktop

1. 打开 GitHub Desktop
2. 点击 "File" → "Add Local Repository"
3. 选择项目目录：`/Users/cinnamonpigeon/Claudecode's masterpieces/renpy-audio-helper`
4. 如果提示"This directory does not appear to be a Git repository"，点击 "create a repository"
5. 填写仓库信息：
   - Name: `renpy-audio-helper`
   - Description: `快速插入 Ren'Py 音频命令的 VSCode 插件`
   - 勾选 "Initialize this repository with a README"（如果需要）
6. 点击 "Create Repository"
7. 在左侧会看到所有文件，输入 commit 信息：`Initial commit: v0.1.0 - 基础功能完成`
8. 点击 "Commit to main"
9. 点击 "Publish repository" 发布到 GitHub

### 方法二：通过命令行（如果权限问题解决）

```bash
cd "/Users/cinnamonpigeon/Claudecode's masterpieces/renpy-audio-helper"
git init
git add .
git commit -m "Initial commit: v0.1.0 - 基础功能完成"
git branch -M main
git remote add origin https://github.com/你的用户名/renpy-audio-helper.git
git push -u origin main
```

## 🎯 测试项目

用你的 Ren'Py 项目测试：
```
/Users/renpy-8.3.7-sdk/crychic-renpy-game/
```

在扩展开发窗口中打开这个目录，应该能看到 `game/audio` 下的所有音频文件。

## ⚙️ 开发模式

如果你要修改代码：

1. 运行监听模式（自动编译）：
   ```bash
   npm run watch
   ```

2. 修改 `src/` 目录下的代码

3. 在扩展开发窗口按 `Cmd+R` (Mac) 或 `Ctrl+R` (Windows/Linux) 重新加载

## 📋 项目文件清单

```
✅ package.json          # 插件配置
✅ tsconfig.json         # TypeScript 配置
✅ .gitignore           # Git 忽略文件
✅ .vscodeignore        # 打包时忽略的文件
✅ LICENSE              # MIT 许可证
✅ README.md            # 项目说明
✅ DEVELOPMENT.md       # 开发文档
✅ CHANGELOG.md         # 更新日志
✅ src/extension.ts     # 主入口
✅ src/audioTreeProvider.ts  # 树形视图
✅ src/audioPlayer.ts   # 音频播放器
```

## 🐛 遇到问题？

### 插件没有激活
- 确保打开的是 Ren'Py 项目（包含 .rpy 文件）
- 检查是否有 `game/audio` 文件夹

### 编译失败
- 确保 Node.js 版本 >= 18
- 删除 `node_modules` 文件夹，重新运行 `npm install`

### 音频无法播放
- macOS: 应该开箱即用
- Windows: 检查文件路径是否包含特殊字符
- Linux: 安装 `aplay` 或 `ffplay`

## 📚 更多信息

- 详细使用说明：[README.md](README.md)
- 开发文档：[DEVELOPMENT.md](DEVELOPMENT.md)
- 更新日志：[CHANGELOG.md](CHANGELOG.md)

---

**祝你开发愉快！** 🎉
