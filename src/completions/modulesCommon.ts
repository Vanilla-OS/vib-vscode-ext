import * as vscode from 'vscode';
import { isInsideModulesSection } from '../utils/recipe';

/**
 * Provides completion "types" for the "modules" section of a Vib recipe.
 * @param document The document to provide completions for.
 * @param position The position to provide completions at.
 * @returns An array of vscode.CompletionItem objects.
 */
export function CModulesCommon(document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem[] {
    if (!isInsideModulesSection(document, position)) {
        return [];
    }

    // Built-in module types
    const moduleTypes = [
        new vscode.CompletionItem("apt", vscode.CompletionItemKind.Module),
        new vscode.CompletionItem("dnf", vscode.CompletionItemKind.Module),
        new vscode.CompletionItem("cmake", vscode.CompletionItemKind.Module),
        new vscode.CompletionItem("dpkg-buildpackage", vscode.CompletionItemKind.Module),
        new vscode.CompletionItem("dpkg", vscode.CompletionItemKind.Module),
        new vscode.CompletionItem("go", vscode.CompletionItemKind.Module),
        new vscode.CompletionItem("make", vscode.CompletionItemKind.Module),
        new vscode.CompletionItem("meson", vscode.CompletionItemKind.Module),
        new vscode.CompletionItem("shell", vscode.CompletionItemKind.Module),
    ];

    moduleTypes.forEach(mt => {
        mt.insertText = mt.label.toString();
        mt.detail = "Built-in module type";
    });


    // Custom module types
    const pluginsFolder = vscode.workspace.rootPath + '/plugins';
    if (vscode.workspace.rootPath && pluginsFolder) {
        const fs = require('fs');
        const path = require('path');
        const files = fs.readdirSync(pluginsFolder);
        files.forEach((file: any) => {
            const ext = path.extname(file);
            if (ext === '.so') {
                const name = path.basename(file, ext);
                const ci = new vscode.CompletionItem(name, vscode.CompletionItemKind.Module);
                ci.insertText = name;
                ci.detail = "Custom module type found";
                moduleTypes.push(ci);
            }
        });
    }

    return moduleTypes;
}

