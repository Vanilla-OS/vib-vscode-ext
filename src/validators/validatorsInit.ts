import * as vscode from 'vscode';
import * as yaml from 'js-yaml';
import { VCheckIncludes } from './checkIncludes';
import { VCheckMetadata } from './checkMetadata';
import { VCheckDuplicateModuleNames } from './checkDuplicateMouleNames';

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
            // console.error(e);
            return;
        }

        let allDiagnostics: vscode.Diagnostic[] = [];

        // Metadata validation
        let results = VCheckMetadata(document, parsedYAML);
        allDiagnostics = allDiagnostics.concat(results.diagnostics);
        results.actions.forEach((value, key) => globalActions.set(key, value));

        // Includes validation
        results = VCheckIncludes(document, parsedYAML);
        allDiagnostics = allDiagnostics.concat(results.diagnostics);
        results.actions.forEach((value, key) => globalActions.set(key, value));

        // Duplicate module names validation
        results = VCheckDuplicateModuleNames(document, parsedYAML);
        allDiagnostics = allDiagnostics.concat(results.diagnostics);
        results.actions.forEach((value, key) => globalActions.set(key, value));

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