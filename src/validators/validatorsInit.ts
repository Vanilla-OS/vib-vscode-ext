import * as vscode from 'vscode';
import * as yaml from 'js-yaml';
import { VCheckIncludes } from './checkIncludes';
import { VCheckMetadata } from './checkMetadata';

/**
 * Registers the validators for the VIB recipe files.
 * @param context The extension context
 */
export function registerValidators(context: vscode.ExtensionContext) {
    const diagnostics = vscode.languages.createDiagnosticCollection("vibValidators");
    context.subscriptions.push(diagnostics);

    let globalActions = new Map();

    const validateDocument = (document: vscode.TextDocument) => {
        if (document.languageId !== 'yaml' || !document.getText().startsWith('# vib')) {
            diagnostics.set(document.uri, []);
            return;
        }

        let parsedYAML;
        try {
            parsedYAML = yaml.load(document.getText());
        } catch (e) {
            vscode.window.showErrorMessage(`Error parsing YAML: ${(e as Error).message}`);
            return;
        }

        let allDiagnostics: vscode.Diagnostic[] = [];

        let metadataResults = VCheckMetadata(document, parsedYAML);
        allDiagnostics = allDiagnostics.concat(metadataResults.diagnostics);
        metadataResults.actions.forEach((value, key) => globalActions.set(key, value));

        diagnostics.set(document.uri, allDiagnostics);
    };

    vscode.workspace.onDidOpenTextDocument(validateDocument);
    vscode.workspace.onDidSaveTextDocument(validateDocument);
    vscode.workspace.onDidChangeTextDocument(e => validateDocument(e.document));
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            validateDocument(editor.document);
        }
    });

    vscode.workspace.textDocuments.forEach(validateDocument);

    context.subscriptions.push(vscode.languages.registerCodeActionsProvider('yaml', {
        provideCodeActions(document, range, context, token) {
            const actions: vscode.CodeAction[] = [];

            context.diagnostics.forEach(diagnostic => {
                const actionGenerator = globalActions.get(diagnostic.code);
                if (actionGenerator) {
                    actions.push(actionGenerator(document, diagnostic));
                }
            });

            return actions;
        }
    }, {
        providedCodeActionKinds: [vscode.CodeActionKind.QuickFix]
    }));

    context.subscriptions.push(new vscode.Disposable(() => diagnostics.clear()));
}