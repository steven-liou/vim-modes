// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

function getConfiguration(section = '') {
  const activeTextEditor = vscode.window.activeTextEditor;
  const resource = activeTextEditor ? activeTextEditor.document.uri : null;
  return vscode.workspace.getConfiguration(section, resource);
}

function changeColor(workbenchConfig, color) {
  const currentColorCustomizations =
    workbenchConfig.get('colorCustomizations') || {};
  const colorCustomizations = { ...currentColorCustomizations };

  const keys = [
    'activityBar.activeBackground',
    'activityBarBadge.background',
    'editorCursor.foreground',
    'inputValidation.errorBorder',
    'tab.activeBorder',
    'statusBar.background',
    'statusBarItem.remoteBackground',
  ];

  keys.forEach((key) => (colorCustomizations[key] = color));

  if (currentColorCustomizations !== colorCustomizations) {
    workbenchConfig.update('colorCustomizations', colorCustomizations, true);
  }
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const workbenchConfig = getConfiguration('workbench');

  // const operationMode = workbenchConfig.get('nvimUiMode')

  const cmds = [
    vscode.commands.registerCommand('nvim-theme.normal', function () {
      changeColor(workbenchConfig, workbenchConfig.get('nvimColorNormal'));
    }),
    vscode.commands.registerCommand('nvim-theme.insert', function () {
      changeColor(workbenchConfig, workbenchConfig.get('nvimColorInsert'));
    }),
    vscode.commands.registerCommand('nvim-theme.visual', function () {
      changeColor(workbenchConfig, workbenchConfig.get('nvimColorVisual'));
    }),
    vscode.commands.registerCommand('nvim-theme.replace', function () {
      changeColor(workbenchConfig, workbenchConfig.get('nvimColorReplace'));
    }),
    vscode.commands.registerCommand('nvim-theme.change', function () {
      changeColor(workbenchConfig, workbenchConfig.get('nvimColorChange'));
    }),
    vscode.commands.registerCommand('nvim-theme.command', function () {
      changeColor(workbenchConfig, workbenchConfig.get('nvimColorCommand'));
    }),
    vscode.commands.registerCommand('nvim-theme.delete', function () {
      changeColor(workbenchConfig, workbenchConfig.get('nvimColorDelete'));
    }),
  ];
  cmds.forEach((cmd) => context.subscriptions.push(cmd));
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
