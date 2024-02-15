import * as vscode from 'vscode';
import { CModulesCommon } from './modulesCommon';

/**
 * Registers all the available completions.
 * @param context The extension context
 * @returns The disposable to unregister the completions.
 */
export function registerCompletions(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider({ language: 'yaml', scheme: 'file' }, {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
                return CModulesCommon(document, position);
            }
        }, 'type:')
    );
}
