import * as vscode from 'vscode';
import { parseModels } from './parser/modelParser';

export function activate(context: vscode.ExtensionContext) {
  console.log('CI3 IntelliSense activated');

  // Completion Provider
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('php', {
      provideCompletionItems(document, position) {
        const line = document.lineAt(position).text;
        const items: vscode.CompletionItem[] = [];

        if (line.includes('$this->')) {
          items.push(new vscode.CompletionItem('db', vscode.CompletionItemKind.Property));
          items.push(new vscode.CompletionItem('input', vscode.CompletionItemKind.Property));
          items.push(new vscode.CompletionItem('load', vscode.CompletionItemKind.Property));
          items.push(new vscode.CompletionItem('mymodel', vscode.CompletionItemKind.Property));
        }

        return items;
      }
    }, '>', '-')
  );

  // Hover Provider
  context.subscriptions.push(
    vscode.languages.registerHoverProvider('php', {
      provideHover(document, position) {
        const word = document.getText(document.getWordRangeAtPosition(position));
        if (word === 'db') {
          return new vscode.Hover('CI Database class instance');
        }
        if (word === 'input') {
          return new vscode.Hover('CI Input class instance');
        }
        if (word === 'load') {
          return new vscode.Hover('CI Loader class instance');
        }
        return undefined;
      }
    })
  );

  // Definition Provider (dummy - just jump to first line as placeholder)
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider('php', {
      provideDefinition(document, position) {
        const word = document.getText(document.getWordRangeAtPosition(position));
        if (word === 'mymodel') {
          return new vscode.Location(document.uri, new vscode.Position(0, 0));
        }
        return undefined;
      }
    })
  );

  // Document Symbol Provider
  context.subscriptions.push(
    vscode.languages.registerDocumentSymbolProvider('php', {
      provideDocumentSymbols(document) {
        const symbols: vscode.DocumentSymbol[] = [];
        const text = document.getText();
        const regex = /function\s+([a-zA-Z0-9_]+)\s*\(/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
          const methodName = match[1];
          const line = document.positionAt(match.index).line;
          const symbol = new vscode.DocumentSymbol(
            methodName,
            'Method',
            vscode.SymbolKind.Method,
            new vscode.Range(line, 0, line, 0),
            new vscode.Range(line, 0, line, 0)
          );
          symbols.push(symbol);
        }
        return symbols;
      }
    })
  );

  // Refresh Model Command
  let disposable = vscode.commands.registerCommand('ci.refreshModels', () => {
    vscode.window.showInformationMessage('Refreshing CI3 Models...');
    parseModels();
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}