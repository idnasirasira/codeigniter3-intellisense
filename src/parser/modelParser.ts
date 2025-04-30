import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function parseModels() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) return;

  const modelPath = path.join(workspaceFolders[0].uri.fsPath, 'application', 'models');
  if (!fs.existsSync(modelPath)) return;

  const modelFiles = fs.readdirSync(modelPath).filter(file => file.endsWith('.php'));
  vscode.window.showInformationMessage(`Found ${modelFiles.length} model files.`);
}