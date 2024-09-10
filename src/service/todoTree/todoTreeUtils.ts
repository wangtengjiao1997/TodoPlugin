import * as vscode from 'vscode';

export function addTag( tag: string ) {
    const config = vscode.workspace.getConfiguration('todo-tree.general');
    let tags: string[] | undefined = config.get('tags'); // 获取当前的 tags 列表

    // 如果tags存在且不包含该tag，则将新tag加入列表
    if (tags && !tags.includes(tag)) {
        tags.push(tag); // 添加新tag
        config.update('tags', tags, true); // 更新配置
        vscode.window.showInformationMessage(`Tag "${tag}" has been added.`);
    }
}


export function removeTag(tag: string) {
    const config = vscode.workspace.getConfiguration('todo-tree.general');
    let tags: string[] | undefined = config.get('tags'); // 获取当前的 tags 列表

    // 如果 tags 存在并且包含该 tag，则移除它
    if (tags && tags.includes(tag)) {
        tags = tags.filter(existingTag => existingTag !== tag); // 移除指定的 tag
        config.update('tags', tags, true); // 更新配置
        vscode.window.showInformationMessage(`Tag "${tag}" has been removed.`);
    }
}