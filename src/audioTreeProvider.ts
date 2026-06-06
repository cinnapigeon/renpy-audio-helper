import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 音频文件树项
 */
export class AudioFileItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly resourceUri?: vscode.Uri,
        public readonly contextValue?: string
    ) {
        super(label, collapsibleState);

        if (contextValue === 'audioFile') {
            this.command = {
                command: 'renpyAudioHelper.insertAudioCommand',
                title: '插入音频命令',
                arguments: [this]
            };

            // 设置图标
            this.iconPath = new vscode.ThemeIcon('file-media');

            // 设置描述
            this.description = path.extname(label);
        } else if (contextValue === 'folder') {
            this.iconPath = new vscode.ThemeIcon('folder');
        }

        this.tooltip = this.resourceUri?.fsPath;
    }
}

/**
 * 音频树提供者
 */
export class AudioTreeProvider implements vscode.TreeDataProvider<AudioFileItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<AudioFileItem | undefined | null | void> =
        new vscode.EventEmitter<AudioFileItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<AudioFileItem | undefined | null | void> =
        this._onDidChangeTreeData.event;

    private workspaceRoot: string;
    private audioFolderPath: string | null = null;
    private supportedFormats: string[];

    constructor(workspaceRoot: string) {
        this.workspaceRoot = workspaceRoot;
        this.supportedFormats = this.getSupportedFormats();
        this.audioFolderPath = this.findAudioFolder();
    }

    /**
     * 刷新树视图
     */
    refresh(): void {
        this.audioFolderPath = this.findAudioFolder();
        this._onDidChangeTreeData.fire();
    }

    /**
     * 获取树项
     */
    getTreeItem(element: AudioFileItem): vscode.TreeItem {
        return element;
    }

    /**
     * 获取子项
     */
    getChildren(element?: AudioFileItem): Thenable<AudioFileItem[]> {
        if (!this.audioFolderPath) {
            vscode.window.showWarningMessage('未找到 audio 文件夹，请确保项目结构正确');
            return Promise.resolve([]);
        }

        if (element) {
            // 返回文件夹的子项
            return Promise.resolve(this.getAudioFilesInDirectory(element.resourceUri!.fsPath));
        } else {
            // 返回根目录的子项
            return Promise.resolve(this.getAudioFilesInDirectory(this.audioFolderPath));
        }
    }

    /**
     * 查找 audio 文件夹
     */
    private findAudioFolder(): string | null {
        const config = vscode.workspace.getConfiguration('renpyAudioHelper');
        const relativePath = config.get<string>('audioFolderPath', 'game/audio');

        // 方案 B: 尝试工作区配置路径
        let audioPath = path.join(this.workspaceRoot, relativePath);
        if (fs.existsSync(audioPath) && fs.statSync(audioPath).isDirectory()) {
            return audioPath;
        }

        // 方案 A: 向上查找
        // 尝试 game/audio
        audioPath = path.join(this.workspaceRoot, 'game', 'audio');
        if (fs.existsSync(audioPath) && fs.statSync(audioPath).isDirectory()) {
            return audioPath;
        }

        // 尝试直接的 audio 文件夹（如果用户打开的是 game 文件夹）
        audioPath = path.join(this.workspaceRoot, 'audio');
        if (fs.existsSync(audioPath) && fs.statSync(audioPath).isDirectory()) {
            return audioPath;
        }

        // 向上一级查找
        const parentPath = path.dirname(this.workspaceRoot);
        audioPath = path.join(parentPath, 'game', 'audio');
        if (fs.existsSync(audioPath) && fs.statSync(audioPath).isDirectory()) {
            return audioPath;
        }

        return null;
    }

    /**
     * 获取目录中的音频文件
     */
    private getAudioFilesInDirectory(dirPath: string): AudioFileItem[] {
        const items: AudioFileItem[] = [];

        try {
            const files = fs.readdirSync(dirPath);

            // 分离文件夹和文件
            const folders: string[] = [];
            const audioFiles: string[] = [];

            for (const file of files) {
                const filePath = path.join(dirPath, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    folders.push(file);
                } else if (this.isAudioFile(file)) {
                    audioFiles.push(file);
                }
            }

            // 先添加文件夹
            folders.sort().forEach(folder => {
                const folderPath = path.join(dirPath, folder);
                items.push(new AudioFileItem(
                    folder,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    vscode.Uri.file(folderPath),
                    'folder'
                ));
            });

            // 再添加音频文件
            audioFiles.sort().forEach(file => {
                const filePath = path.join(dirPath, file);
                items.push(new AudioFileItem(
                    file,
                    vscode.TreeItemCollapsibleState.None,
                    vscode.Uri.file(filePath),
                    'audioFile'
                ));
            });
        } catch (error) {
            console.error('读取目录失败:', error);
        }

        return items;
    }

    /**
     * 判断是否为音频文件
     */
    private isAudioFile(filename: string): boolean {
        const ext = path.extname(filename).toLowerCase();
        return this.supportedFormats.includes(ext);
    }

    /**
     * 获取支持的音频格式
     */
    private getSupportedFormats(): string[] {
        const config = vscode.workspace.getConfiguration('renpyAudioHelper');
        return config.get<string[]>('supportedFormats', ['.mp3', '.ogg', '.wav', '.opus', '.flac']);
    }

    /**
     * 获取音频文件相对于 game 文件夹的路径
     */
    public getRelativePath(absolutePath: string): string {
        if (!this.audioFolderPath) {
            return '';
        }

        // 找到 game/audio 的位置
        const audioIndex = absolutePath.indexOf('audio');
        if (audioIndex === -1) {
            return '';
        }

        // 返回从 audio 开始的相对路径
        const relativePath = absolutePath.substring(audioIndex);

        // 确保使用正斜杠（Ren'Py 标准）
        return relativePath.replace(/\\/g, '/');
    }
}
