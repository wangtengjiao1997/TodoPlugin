// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {snippetType, setSnippet} from './service/base/SetSnippet';
import { DecorationManager } from './service/base/DecorationManager';
import { addTag, removeTag } from './service/todoTree/todoTreeUtils';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const dependencyPluginId = 'Gruntfuggly.todo-tree';
	const dependencyExtension = vscode.extensions.getExtension(dependencyPluginId);
	if (!dependencyExtension) {
		vscode.window.showErrorMessage(`todo tree 插件 ${dependencyPluginId} 未安装.`);
		return;
	}

	// 激活依赖插件
	if (!dependencyExtension.isActive) {
		// 使用 Promise.resolve() 包装
		Promise.resolve(dependencyExtension.activate()).then(() => {
		  vscode.window.showInformationMessage(`todo tree 插件 ${dependencyPluginId} 已启动.`);
		}).catch(err => {
		  vscode.window.showErrorMessage(`启动todo tree 插件失败, 请重新启动插件 ${dependencyPluginId}: ${err}`);
		  return;
		});
	} else {
		console.log(`todo tree 插件 ${dependencyPluginId} 已启动.`);
	}

	// 创建 DecorationManager 实例
    const decorationManager = new DecorationManager(context);
	vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            decorationManager.updateDecorations();
        }
    }, null, context.subscriptions);
	// 当打开文本编辑器时更新装饰器
	vscode.workspace.onDidChangeTextDocument(event => {
        decorationManager.updateDecorations();
    }, null, context.subscriptions);

	context.subscriptions.push({
        dispose: () => decorationManager.dispose()
    });
	addTag('DONE');
	removeTag('TODO');
	addTag('TODO 待办事项');
	setSnippet(snippetType.TODO);
	setSnippet(snippetType.BUG);
	setSnippet(snippetType.DONE);
	vscode.window.showInformationMessage('TODO快捷键已启动');
}

// This method is called when your extension is deactivated
export function deactivate() {}
