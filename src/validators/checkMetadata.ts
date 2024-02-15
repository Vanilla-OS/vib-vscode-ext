import * as vscode from 'vscode';
import { createDiagnostic, createAddKeyAction } from '../utils/diagnostic';

/**
 * Validates the presence of 'base' and 'name' keys in the recipe metadata
 * and provides a hint if the 'id' key is missing since it's optional but recommended.
 * @param document The document to validate.
 * @param parsedYAML The parsed YAML document.
 * @returns An array of vscode.Diagnostic objects and a map of vscode.CodeAction objects.
 */
export function VCheckMetadata(document: vscode.TextDocument, parsedYAML: any): { diagnostics: vscode.Diagnostic[], actions: Map<string, (document: vscode.TextDocument, diagnostic: vscode.Diagnostic) => vscode.CodeAction> } {
    let diagnosticArray: vscode.Diagnostic[] = [];
    let actions = new Map<string, (document: vscode.TextDocument, diagnostic: vscode.Diagnostic) => vscode.CodeAction>();

    if (typeof parsedYAML !== 'object' || parsedYAML === null) {
        return { diagnostics: [], actions };
    }

    const requiredKeys: { [key: string]: { required: boolean, fixValue: string } } = {
        base: { required: true, fixValue: "ghcr.io/vanilla-os/pico:main" },
        name: { required: true, fixValue: "My Image Name" },
        id: { required: false, fixValue: "my-image-id" },
    };

    for (const key in requiredKeys) {
        if (requiredKeys.hasOwnProperty(key)) {

            const item = requiredKeys[key];
            if (!parsedYAML.hasOwnProperty(key)) {

                let message = `The '${key}' key is required in a Vib recipe.`;
                let severity = vscode.DiagnosticSeverity.Error;
                if (!item.required) {
                    message = `It is recommended to include the '${key}' key in a Vib recipe.`;
                    severity = vscode.DiagnosticSeverity.Hint;
                }

                const diagnosticItem = createDiagnostic(message, 1, 2, severity);
                diagnosticItem.code = `${key}-missing`;
                diagnosticArray.push(diagnosticItem);

                actions.set(`${key}-missing`, (doc, diag) => createAddKeyAction(doc, key, item.fixValue));
            }
        }
    }

    return { diagnostics: diagnosticArray, actions };
}
