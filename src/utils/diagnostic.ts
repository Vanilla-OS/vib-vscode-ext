import * as vscode from 'vscode';

/**
 * Creates a diagnostic message.
 * @param message The diagnostic message.
 * @param document The VSCode document.
 * @param startLine The start line for the diagnostic's range.
 * @param endLine The end line for the diagnostic's range.
 * @param severity The severity of the diagnostic (default is Error).
 * @returns A vscode.Diagnostic object.
 */
export function createDiagnostic(
    message: string,
    startLine: number,
    endLine: number,
    severity: vscode.DiagnosticSeverity = vscode.DiagnosticSeverity.Error
): vscode.Diagnostic {
    const range = new vscode.Range(startLine, 0, endLine, 0);
    return new vscode.Diagnostic(range, message, severity);
}
