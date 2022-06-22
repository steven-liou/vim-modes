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
  highlightGroup,
  elementsKeys = [],
  lineKeys = [],
  selectionKeys = [],
  modifyMode = false,
}) {
  const currentColorCustomizations =
    workbenchConfig.get('colorCustomizations') || {};
  const colorCustomizations = { ...currentColorCustomizations };
  const vimModesConfig = vscode.workspace.getConfiguration('vim-modes');
  const color = vimModesConfig.get(highlightGroup);
  const elementsAlpha = vimModesConfig.get('nvimElementsAlpha') || 1;

  elementsKeys = elementsKeys.concat([
    'activityBar.activeBackground',
    'activityBarBadge.background',
    'editorCursor.foreground',
    'inputValidation.errorBorder',
    'tab.activeBorder',
    'statusBar.background',
    'statusBarItem.remoteBackground',
    'editorLineNumber.activeForeground',
  ]);

  elementsKeys.forEach(
    (key) => (colorCustomizations[key] = addAlpha(color, elementsAlpha))
  );

  lineKeys = lineKeys.concat([
    'editor.lineHighlightBackground',
    'editor.lineHighlightBorder',
  ]);

  let lineAlpha = modifyMode
    ? vimModesConfig.get('nvimModifyLineAlpha')
    : vimModesConfig.get('nvimLineAlpha');
  if (lineAlpha === undefined) {
    lineAlpha = 0.01;
  }

  lineKeys.forEach(
    (key) => (colorCustomizations[key] = addAlpha(color, lineAlpha))
  );

  if (lineAlpha > 0.2) {
    colorCustomizations['editorLineNumber.activeForeground'] = '#fff';
  }

  let selectionAlpha = vimModesConfig.get('nvimSelectionAlpha');
  if (selectionAlpha === undefined) {
    selectionAlpha = 0.01;
  }

  selectionKeys = selectionKeys.concat([
    'editor.findMatchBackground',
    'editor.selectionHighlightBackground',
  ]);

  selectionKeys.forEach(
    (key) => (colorCustomizations[key] = addAlpha(color, selectionAlpha))
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
        highlightGroup: 'nvimColorNormal',
        selectionKeys: ['editor.selectionBackground'],
      });
    }),
    vscode.commands.registerCommand('nvim-theme.current_insert', function () {
      changeColor({
        workbenchConfig,
        highlightGroup: 'nvimColorCurrentInsert',
        selectionKeys: ['editor.selectionBackground'],
        modifyMode: true,
      });
    }),
    vscode.commands.registerCommand('nvim-theme.visual', function () {
      changeColor({
        workbenchConfig,
        highlightGroup: 'nvimColorVisual',
        selectionKeys: ['editor.selectionBackground'],
        modifyMode: true,
      });
    }),
    vscode.commands.registerCommand('nvim-theme.replace', function () {
      changeColor({
        workbenchConfig,
        highlightGroup: 'nvimColorReplace',
      });
    }),
    vscode.commands.registerCommand('nvim-theme.command', function () {
      changeColor({
        workbenchConfig,
        highlightGroup: 'nvimColorCommand',
      });
    }),
    vscode.commands.registerCommand('nvim-theme.restore_insert', function () {
      const vimModesConfig = vscode.workspace.getConfiguration('vim-modes');
      const color = vimModesConfig.get('nvimColorOriginalInsert');
      vimModesConfig.update('nvimColorCurrentInsert', color, true);
    }),
    vscode.commands.registerCommand('nvim-theme.change', async function () {
      const vimModesConfig = vscode.workspace.getConfiguration('vim-modes');
      const color = vimModesConfig.get('nvimColorChange');
      vimModesConfig.update('nvimColorCurrentInsert', color, true);
    }),
    vscode.commands.registerCommand('nvim-theme.delete', function () {
      changeColor({
        workbenchConfig,
        highlightGroup: 'nvimColorDelete',
      });
    }),
    vscode.commands.registerCommand('nvim-theme.history', function () {
      changeColor({
        workbenchConfig,
        highlightGroup: 'nvimColorHistory',
      });
    }),
    vscode.commands.registerCommand('nvim-theme.pending', function () {
      changeColor({
        workbenchConfig,
        highlightGroup: 'nvimColorPending',
      });
    }),
  ];
  cmds.forEach((cmd) => context.subscriptions.push(cmd));
}

// method for changing insert mode cursor
function setInsertModeCursor({ workbenchConfig, type }) {
  // const vimModesConfig = vscode.workspace.getConfiguration('vim-modes');

  // workbenchConfig.get('editor.cursorStyle') || {};
  workbenchConfig.update('editor.cursorStyle', type, true);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
