# 编译文件目录

此目录包含编译后的 VSIX 安装包。

## 文件说明

- `renpy-audio-helper-x.x.x.vsix` - VSCode 扩展安装包

## 安装方法

1. 在 VSCode 中打开扩展面板（Cmd+Shift+X / Ctrl+Shift+X）
2. 点击右上角的 `...` 菜单
3. 选择"从 VSIX 安装..."
4. 选择对应版本的 .vsix 文件

## 注意

此目录中的文件不会被提交到 Git 仓库（已在 .gitignore 中忽略）。
发布 Release 时，请从此目录上传 .vsix 文件到 GitHub Releases。
