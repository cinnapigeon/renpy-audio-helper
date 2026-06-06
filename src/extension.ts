import * as vscode from 'vscode';
import { AudioTreeProvider } from './audioTreeProvider';
import { AudioPlayer } from './audioPlayer';

export function activate(context: vscode.ExtensionContext) {
    console.log('Ren\'Py Audio Helper 已激活');

    // 检查是否是 Ren'Py 项目
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return;
    }

    // 创建音频树视图提供者
    const audioTreeProvider = new AudioTreeProvider(workspaceFolders[0].uri.fsPath);
    const treeView = vscode.window.createTreeView('renpyAudioExplorer', {
        treeDataProvider: audioTreeProvider,
        showCollapseAll: true
    });

    // 创建音频播放器
    const audioPlayer = new AudioPlayer();

    // 设置上下文：表示这是一个 Ren'Py 项目
    vscode.commands.executeCommand('setContext', 'workspaceHasRenpyProject', true);

    // 注册命令：刷新音频文件
    const refreshCommand = vscode.commands.registerCommand(
        'renpyAudioHelper.refreshAudioFiles',
        () => {
            audioTreeProvider.refresh();
            vscode.window.showInformationMessage('音频文件列表已刷新');
        }
    );

    // 注册命令：播放音频
    const playCommand = vscode.commands.registerCommand(
        'renpyAudioHelper.playAudio',
        async (item) => {
            if (item && item.resourceUri) {
                await audioPlayer.play(item.resourceUri.fsPath);
            }
        }
    );

    // 注册命令：停止播放
    const stopCommand = vscode.commands.registerCommand(
        'renpyAudioHelper.stopAudio',
        () => {
            audioPlayer.stop();
        }
    );

    // 注册命令：插入音频命令
    const insertCommand = vscode.commands.registerCommand(
        'renpyAudioHelper.insertAudioCommand',
        async (item) => {
            if (!item || !item.resourceUri) {
                return;
            }

            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('请先打开一个 .rpy 文件');
                return;
            }

            // 获取相对路径
            const audioPath = audioTreeProvider.getRelativePath(item.resourceUri.fsPath);

            // 判断命令类型
            const commandType = determineCommandType(audioPath);

            // 生成命令
            const command = `play ${commandType} "${audioPath}"`;

            // 智能插入
            await insertCommandIntelligently(editor, command);
        }
    );

    // 双击事件：插入命令
    treeView.onDidChangeSelection(async (e) => {
        if (e.selection.length > 0) {
            const item = e.selection[0];
            if (item.contextValue === 'audioFile') {
                await vscode.commands.executeCommand('renpyAudioHelper.insertAudioCommand', item);
            }
        }
    });

    context.subscriptions.push(
        refreshCommand,
        playCommand,
        stopCommand,
        insertCommand,
        treeView,
        audioPlayer
    );
}

/**
 * 根据路径判断命令类型
 */
function determineCommandType(audioPath: string): string {
    const lowerPath = audioPath.toLowerCase();

    if (lowerPath.includes('/sound/') || lowerPath.includes('\\sound\\')) {
        return 'sound';
    } else if (lowerPath.includes('/music/') || lowerPath.includes('\\music\\')) {
        return 'music';
    } else if (lowerPath.includes('/voice/') || lowerPath.includes('\\voice\\')) {
        return 'voice';
    }

    // 默认使用 sound
    return 'sound';
}

/**
 * 智能插入命令
 */
async function insertCommandIntelligently(editor: vscode.TextEditor, command: string) {
    const position = editor.selection.active;
    const line = editor.document.lineAt(position.line);

    // 获取当前行的缩进
    const indent = line.text.match(/^\s*/)?.[0] || '';

    let insertPosition: vscode.Position;
    let textToInsert: string;

    if (line.text.trim() === '') {
        // 空行：直接在当前行插入
        insertPosition = new vscode.Position(position.line, 0);
        textToInsert = indent + command + '\n';
    } else {
        // 有内容：在上方新建一行
        insertPosition = new vscode.Position(position.line, 0);
        textToInsert = indent + command + '\n';
    }

    await editor.edit(editBuilder => {
        editBuilder.insert(insertPosition, textToInsert);
    });

    // 将光标移动到插入的命令行末尾
    const newPosition = new vscode.Position(insertPosition.line, indent.length + command.length);
    editor.selection = new vscode.Selection(newPosition, newPosition);
}

export function deactivate() {
    console.log('Ren\'Py Audio Helper 已停用');
}
