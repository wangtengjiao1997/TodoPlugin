import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export enum snippetType {
    TODO = "TODO 代办事项",
    BUG = "BUG",
    DONE = "DONE",
}

export enum languageType {
    PYTHON = "python",
    CPP = "cpp",
    JAVA = "java",
    JAVASCRIPT = "javascript",
    TYPESCRIPT = "typescript",
    HTML = "html",
    CSS = "css",
    JSON = "json",
    XML = "xml",
    YAML = "yaml",
    GO = "go"
}
enum PLATFORM {
    WIN32 = 'win32',
    LINUX = 'linux',
    DARWIN = 'darwin'
}


interface Snippet {
    scope: string;
    prefix: string;
    body: string[];
    description: string;
}

export function setSnippet(snippetName: snippetType) {
    if (process.env.APPDATA === undefined) {
        vscode.window.showErrorMessage('Can\'t find tor root path while processing the snippet.');
        return;
    }
    const platform = process.platform;
    let snippetsPath: string | undefined = undefined;

    if (platform === PLATFORM.WIN32) {
        snippetsPath = path.join(
            process.env.APPDATA,
            'NPC Tor',
            //'Code',
            'User',
            'snippets'
        );
    } else if (platform === PLATFORM.LINUX) {
        snippetsPath = path.join(
            process.env.HOME || '',
            '.config',
            'NPC Tor',
            //'Code',
            'User',
            'snippets'
        );
    } else if (platform === PLATFORM.DARWIN) {  // macOS
        snippetsPath = path.join(
            process.env.HOME || '',
            'Library',
            'Application Support',
            'NPC Tor',
            //'Code',
            'User',
            'snippets'
        );
    }

    if (snippetsPath == undefined){
        vscode.window.showErrorMessage('Can\'t find tor snippet path while processing the snippet.');
        return;
    }

    const languageList = Object.values(languageType);
    console.log("snippet path: ", snippetsPath);
    for (const language of languageList) {
        const snippetContent = setSnippetContent(snippetName, language);
        const snippetFilePath = path.join(snippetsPath, `${language}.code-snippets`);

        if (snippetContent === null){
            vscode.window.showInformationMessage('设置Snippet关键词错误');
            return
        }
        try {
            if (fs.existsSync(snippetFilePath)) {
                const content = fs.readFileSync(snippetFilePath, 'utf-8');
                const snippets = JSON.parse(content);
                // 检查snippet是否已经存在
                if (!snippets[snippetName]) {
                    snippets[snippetName] = snippetContent[snippetName];
                    // 保存回文件
                    fs.writeFileSync(snippetFilePath, JSON.stringify(snippets, null, 4), 'utf-8');
                } else {
                    console.log(`Snippet '${snippetName}' already exists.`);
                }
            } else {
                // 如果 snippets 文件不存在，则创建新的文件
                fs.writeFileSync(snippetFilePath, JSON.stringify(snippetContent, null, 4), 'utf-8');
                console.log(`Snippet file created and '${snippetName}' added.`);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            vscode.window.showErrorMessage('An error occurred while processing the snippet.');

        }
    }
}

function setSnippetContent(snippetTypeContent: snippetType, languageTypeContent: languageType) : { [key: string]: Snippet } | null {

    let commentMarkleft: string = "";
    let commentMarkright: string = "";
    switch (languageTypeContent) {
        case  languageType.CPP:
            commentMarkleft = "//";
            commentMarkright = "";
            break;
        case languageType.JAVA:
            commentMarkleft = "//";
            commentMarkright = "";
            break;
        case languageType.PYTHON:
            commentMarkleft = "#";
            commentMarkright = "";
            break;
        case languageType.JAVASCRIPT:
            commentMarkleft = "//";
            commentMarkright = "";
            break;
        case languageType.TYPESCRIPT:
            commentMarkleft = "//";
            commentMarkright = "";
            break;
        case languageType.HTML:
            commentMarkleft = "<!--";
            commentMarkright = "-->";
            break;
        case languageType.CSS:
            commentMarkleft = "/*";
            commentMarkright = "*/";
            break;
        case languageType.JSON:
            commentMarkleft = "//";
            commentMarkright = "";
            break;
        case languageType.GO:
            commentMarkleft = "//";
            commentMarkright = "";
            break;
        case languageType.XML:
            commentMarkleft = "<!--";
            commentMarkright = "-->";
            break;
        case languageType.YAML:
            commentMarkleft = "#";
            commentMarkright = "";
            break;
        default:
            commentMarkleft = "//";
            commentMarkright = "";

    }

    switch (snippetTypeContent) {
        case snippetType.TODO:
            return ({
                "TODO 待办事项": {
                    "scope": `${languageTypeContent}`,
                    "prefix": "TODO 待办事项",
                    "body": [
                        `${commentMarkleft}  TODO 待办事项 ${commentMarkright}`,
                        `${commentMarkleft}  未完成功能: ${  commentMarkright}`,
                        `${commentMarkleft}  详细内容: ${commentMarkright}`,
                        `${commentMarkleft}  其他: ${commentMarkright}`
                    ],
                    "description": "TODO 待办事项"
                }
            });
        case snippetType.BUG:
            return ({
                "BUG": {
                    "scope": `${languageTypeContent}`,
                    "prefix": "BUG",
                    "body": [
                        `${commentMarkleft}  BUG ${  commentMarkright}`,
                        `${commentMarkleft}  需解决的问题: ${commentMarkright}`,
                        `${commentMarkleft}  详细内容: ${commentMarkright}`,
                        `${commentMarkleft}  其他:  ${commentMarkright}`
                    ],
                    "description": "BUG 修复"
                }
            });
        case snippetType.DONE:
            return ({
                "DONE": {
                    "scope": `${languageTypeContent}`,
                    "prefix": "DONE",
                    "body": [
                        `${commentMarkleft}  DONE 开发完成 ${commentMarkright}`,
                        `${commentMarkleft}  完成功能: ${commentMarkright}`,
                        `${commentMarkleft}  详细内容: ${commentMarkright}`,
                        `${commentMarkleft}  其他: ${commentMarkright}`
                    ],
                    "description": "DONE 已完成任务"
                }
            });
        default:
            return null;
    }

}
