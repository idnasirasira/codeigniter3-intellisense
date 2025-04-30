import * as vscode from 'vscode';
import { parseModels } from './parser/modelParser';

export function activate(context: vscode.ExtensionContext) {
  console.log('CI3 IntelliSense activated');

  let disposable = vscode.commands.registerCommand('ci.refreshModels', () => {
    vscode.window.showInformationMessage('Refreshing CI3 Models...');
    parseModels();
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}