import * as vscode from 'vscode';

/**
 * Validates if there are modules with duplicate names in the recipe.
 * @param document The document to validate.
 * @param parsedYAML The parsed YAML document.
 * @returns An object containing an array of vscode.Diagnostic objects and a map for actions.
 */
export function VCheckDuplicateModuleNames(document: vscode.TextDocument, parsedYAML: any): { diagnostics: vscode.Diagnostic[], actions: Map<string, (document: vscode.TextDocument, diagnostic: vscode.Diagnostic) => vscode.CodeAction> } {
    let diagnosticArray: vscode.Diagnostic[] = [];
    let actions = new Map<string, (document: vscode.TextDocument, diagnostic: vscode.Diagnostic) => vscode.CodeAction>();

    if (parsedYAML && typeof parsedYAML === 'object' && 'modules' in parsedYAML) {
        let moduleNames = new Map<string, number>();

        parsedYAML.modules.forEach((module: any, index: number) => {
            if (module && typeof module === 'object' && 'name' in module) {
                let moduleName = module.name;

                let occurrences = moduleNames.get(moduleName) || 0;
                moduleNames.set(moduleName, occurrences + 1);

                if (occurrences === 0) {
                    return;
                }

                for (let i = 0; i < document.lineCount; i++) {
                    let lineText = document.lineAt(i).text;
                    if (lineText.includes(`name: ${moduleName}`)) {
                        let start = new vscode.Position(i, lineText.indexOf(`name: ${moduleName}`));
                        let end = new vscode.Position(i, lineText.indexOf(`name: ${moduleName}`) + `name: ${moduleName}`.length);

                        let diagnostic = new vscode.Diagnostic(
                            new vscode.Range(start, end),
                            `Duplicate module name: ${moduleName}`,
                            vscode.DiagnosticSeverity.Error
                        );

                        diagnosticArray.push(diagnostic);
                        break;
                    }
                }
            }
        });
    }

    return { diagnostics: diagnosticArray, actions: actions };
}
