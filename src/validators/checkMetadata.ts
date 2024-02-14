import * as vscode from 'vscode';
import { createDiagnostic } from '../utils/diagnostic';

/**
 * Validates the presence of 'base' and 'name' keys in the recipe metadata
 * and provides a hint if the 'id' key is missing since it's optional but recommended.
 * @param document The document to validate.
 * @param parsedYAML The parsed YAML document.
 * @returns An array of vscode.Diagnostic objects.
 */
export function VCheckMetadata(document: vscode.TextDocument, parsedYAML: any): vscode.Diagnostic[] {
    let diagnosticArray: vscode.Diagnostic[] = [];

    if (typeof parsedYAML !== 'object' || parsedYAML === null) {
        return diagnosticArray;
    }

    if (!parsedYAML.hasOwnProperty('base')) {
        const message = "Key 'base' is required in the recipe metadata.";
        diagnosticArray.push(createDiagnostic(message, 0, 5));
    }

    if (!parsedYAML.hasOwnProperty('name')) {
        const message = "Key 'name' is required in the recipe metadata.";
        diagnosticArray.push(createDiagnostic(message, 0, 5));
    }

    if (!parsedYAML.hasOwnProperty('id')) {
        const message = "Key 'id' is optional but recommended in the recipe metadata.";
        diagnosticArray.push(createDiagnostic(message, 0, 5, vscode.DiagnosticSeverity.Information));
    }

    return diagnosticArray;
}
