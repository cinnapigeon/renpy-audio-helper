import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

/**
 * 音频播放器
 */
export class AudioPlayer implements vscode.Disposable {
    private currentProcess: any = null;
    private currentFile: string | null = null;
    private statusBarItem: vscode.StatusBarItem;

    constructor() {
        // 创建状态栏项
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        this.statusBarItem.command = 'renpyAudioHelper.stopAudio';
    }

    /**
     * 播放音频
     */
    async play(filePath: string): Promise<void> {
        // 如果正在播放，先停止
        if (this.currentProcess) {
            this.stop();
        }

        this.currentFile = filePath;
        const fileName = path.basename(filePath);

        try {
            // 根据平台使用不同的播放命令
            let command: string;

            if (process.platform === 'darwin') {
                // macOS: 使用 afplay
                command = `afplay "${filePath}"`;
            } else if (process.platform === 'win32') {
                // Windows: 使用 PowerShell
                command = `powershell -c "(New-Object Media.SoundPlayer '${filePath}').PlaySync()"`;
            } else {
                // Linux: 尝试使用 aplay 或 ffplay
                command = `aplay "${filePath}" || ffplay -nodisp -autoexit "${filePath}"`;
            }

            // 更新状态栏
            this.statusBarItem.text = `$(debug-stop) 正在播放: ${fileName}`;
            this.statusBarItem.show();

            // 执行播放命令
            this.currentProcess = exec(command, (error) => {
                if (error && !error.killed) {
                    console.error('播放失败:', error);
                    vscode.window.showErrorMessage(`播放音频失败: ${error.message}`);
                }
                this.onPlaybackEnded();
            });

        } catch (error) {
            console.error('播放音频时出错:', error);
            vscode.window.showErrorMessage('播放音频失败');
            this.onPlaybackEnded();
        }
    }

    /**
     * 停止播放
     */
    stop(): void {
        if (this.currentProcess) {
            try {
                // 终止进程
                if (process.platform === 'win32') {
                    exec(`taskkill /pid ${this.currentProcess.pid} /T /F`);
                } else {
                    this.currentProcess.kill();
                }
            } catch (error) {
                console.error('停止播放时出错:', error);
            }

            this.currentProcess = null;
        }

        this.onPlaybackEnded();
    }

    /**
     * 播放结束时的处理
     */
    private onPlaybackEnded(): void {
        this.currentFile = null;
        this.currentProcess = null;
        this.statusBarItem.hide();
    }

    /**
     * 清理资源
     */
    dispose(): void {
        this.stop();
        this.statusBarItem.dispose();
    }
}
