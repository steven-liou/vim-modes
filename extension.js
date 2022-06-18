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

function addAlpha(color, opacity) {
  // coerce values so ti is between 0 and 1.
  let alpha = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  let alphaString = alpha.toString(16).toUpperCase();
  alphaString = alpha < 16 ? '0' + alphaString : alphaString;
  return color + alphaString;
}

function changeColor({
  workbenchConfig,
  color,
  elementsKeys = [],
  lineKeys = [],
}) {
  const currentColorCustomizations =
    workbenchConfig.get('colorCustomizations') || {};
  const colorCustomizations = { ...currentColorCustomizations };
  const elementsAlpha =
    getConfiguration('workbench').get('nvimElementsAlpha') || 1;

  elementsKeys = elementsKeys.concat([
    'activityBar.activeBackground',
    'activityBarBadge.background',
    'editorCursor.foreground',
    'inputValidation.errorBorder',
    'tab.activeBorder',
    'statusBar.background',
    'statusBarItem.remoteBackground',
  ]);

  elementsKeys.forEach(
    (key) => (colorCustomizations[key] = addAlpha(color, elementsAlpha))
  );

  lineKeys = ['editor.lineHighlightBackground', 'editor.lineHighlightBorder'];

  const lineAlpha = getConfiguration('workbench').get('nvimLineAlpha') || 0.2;

  lineKeys.forEach(
    (key) => (colorCustomizations[key] = addAlpha(color, lineAlpha))
  );

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
      changeColor({
        workbenchConfig,
        color: workbenchConfig.get('nvimColorNormal'),
      });
    }),
    vscode.commands.registerCommand('nvim-theme.insert', function () {
      changeColor({
        workbenchConfig,
        color: workbenchConfig.get('nvimColorInsert'),
      });
    }),
    vscode.commands.registerCommand('nvim-theme.visual', function () {
      changeColor({
        workbenchConfig,
        color: workbenchConfig.get('nvimColorVisual'),
        lineKeys: ['editor.selectionBackground'],
      });
    }),
    vscode.commands.registerCommand('nvim-theme.replace', function () {
      changeColor({
        workbenchConfig,
        color: workbenchConfig.get('nvimColorReplace'),
      });
    }),
    vscode.commands.registerCommand('nvim-theme.change', function () {
      changeColor({
        workbenchConfig,
        color: workbenchConfig.get('nvimColorChange'),
      });
    }),
    vscode.commands.registerCommand('nvim-theme.command', function () {
      changeColor({
        workbenchConfig,
        color: workbenchConfig.get('nvimColorCommand'),
      });
    }),
    vscode.commands.registerCommand('nvim-theme.delete', function () {
      changeColor({
        workbenchConfig,
        color: workbenchConfig.get('nvimColorDelete'),
      });
    }),
    vscode.commands.registerCommand('nvim-theme.copy', function () {
      changeColor({
        workbenchConfig,
        color: workbenchConfig.get('nvimColorCopy'),
      });
    }),
    vscode.commands.registerCommand('nvim-theme.history', function () {
      changeColor({
        workbenchConfig,
        color: workbenchConfig.get('nvimColorHistory'),
      });
    }),
    vscode.commands.registerCommand('nvim-theme.pending', function () {
      changeColor({
        workbenchConfig,
        color: workbenchConfig.get('nvimColorPending'),
      });
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
