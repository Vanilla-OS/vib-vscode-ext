import * as vscode from 'vscode';
import { checkWorkPathExistsWithExts } from '../utils/pathUtils';

/**
 * Validates if the paths defined in the includes module are valid
 * by checking for their existence in the workspace.
 * @param document The document to validate.
 * @param parsedYAML The parsed YAML document.
 * @returns An array of vscode.Diagnostic objects.
 */
export function VCheckIncludes(document: vscode.TextDocument, parsedYAML: any): vscode.Diagnostic[] {
    let diagnosticArray: vscode.Diagnostic[] = [];
    const text = document.getText();

    if (parsedYAML && typeof parsedYAML === 'object' && 'modules' in parsedYAML) {
        const modules = parsedYAML['modules'];
        if (Array.isArray(modules)) {
            for (const module of modules) {
                if (module.type === 'includes' && module.includes && Array.isArray(module.includes)) {
                    for (const includePath of module.includes) {
                        if (!checkWorkPathExistsWithExts(includePath, ['.yaml', '.yml'])) {
                            const index = text.indexOf(includePath);
                            const startPos = document.positionAt(index);
                            const endPos = document.positionAt(index + includePath.length);
                            const range = new vscode.Range(startPos, endPos);
                            const message = `Module path not found: ${includePath}`;
                            diagnosticArray.push(new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error));
                        }
                    }
                }
            }
        }
    }

    return diagnosticArray;
}
