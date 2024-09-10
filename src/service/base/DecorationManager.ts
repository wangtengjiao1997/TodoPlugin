import * as vscode from 'vscode';

export class DecorationManager {
    private decorationType: vscode.TextEditorDecorationType;
    private context: vscode.ExtensionContext;
    private KeywordList: string[] = ['TODO 待办事项', 'BUG', 'DONE'];

    constructor(context: vscode.ExtensionContext) {
        this.context = context;

        // 初始化装饰器样式
        this.decorationType = vscode.window.createTextEditorDecorationType({
            after: {
                margin: '0 0 0 1rem',
                color: 'gray',
                fontStyle: 'italic'
            }
        });
    }

    // 生成唯一标识符，用于记录每个 TODO 的时间
    private generateTodoKey(lineText: string, lineNumber: number, documentUri: vscode.Uri): string {
        return `${documentUri.toString()}-TODO-${lineNumber}-${lineText}`;
    }

    // 更新装饰器
    public updateDecorations() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const document = editor.document;
        const text = document.getText();
        const lines = text.split(/\r?\n/);

        const decorations: vscode.DecorationOptions[] = [];

        lines.forEach((lineText, lineNumber) => {
            if (this.KeywordList.some(keyword => lineText.includes(keyword))) {
                const range = new vscode.Range(lineNumber, lineText.length, lineNumber, lineText.length);

                // 为每个 TODO 生成唯一标识符
                const todoKey = this.generateTodoKey(lineText, lineNumber, document.uri);

                // 尝试从存储中获取已记录的时间
                let savedTime = this.context.workspaceState.get<string>(todoKey);
                if (!savedTime) {
                    // 如果没有记录，生成当前时间并存储
                    const currentTime = new Date();
                    savedTime = `${currentTime.getFullYear()}/${(currentTime.getMonth() + 1).toString().padStart(2, '0')}/${currentTime.getDate().toString().padStart(2, '0')} ${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
                    this.context.workspaceState.update(todoKey, savedTime);
                }

                // 创建装饰器，显示保存的时间
                const decoration = { range, renderOptions: { after: { contentText: ` // Last modified: ${savedTime} Author: ${vscode.env.npcusername}` } } };
                decorations.push(decoration);
            }
        });

        // 应用装饰器
        editor.setDecorations(this.decorationType, decorations);
    }

    // 当文档内容改变时更新 TODO 时间
    public onDocumentChanged(event: vscode.TextDocumentChangeEvent) {
        const document = event.document;
        event.contentChanges.forEach(change => {
            const startLine = change.range.start.line;
            const lineText = document.lineAt(startLine).text;

            if (this.KeywordList.some(keyword => lineText.includes(keyword))) {
                const todoKey = this.generateTodoKey(lineText, startLine, document.uri);

                // 更新当前时间
                const currentTime = new Date();
                const formattedTime = `${currentTime.getFullYear()}/${(currentTime.getMonth() + 1).toString().padStart(2, '0')}/${currentTime.getDate().toString().padStart(2, '0')} ${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
                this.context.workspaceState.update(todoKey, formattedTime);
            }
        });
    }

    // 销毁装饰器
    public dispose() {
        this.decorationType.dispose();
    }
}
