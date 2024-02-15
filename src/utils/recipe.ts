import * as vscode from 'vscode';

/**
 * Checks if the cursor is inside the modules section.
 * @param document The VSCode document.
 * @param position The cursor position.
 * @returns True if the cursor is inside the modules section, false otherwise.
 */
export function isInsideModulesSection(document: vscode.TextDocument, position: vscode.Position): boolean {
    let text = '';
    for (let i = position.line; i >= 0; i--) {
        text = document.lineAt(i).text + text;
        if (text.includes('modules:')) { return true; }
        if (text.trim().length === 0) { break; }
    }
    return false;
}