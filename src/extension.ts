import * as vscode from 'vscode';
import { registerValidators } from './validators/validatorsInit';
import { registerCompletions } from './completions/registerCompletions';

export function activate(context: vscode.ExtensionContext) {
	console.log('Vib extension is now active!');
	registerValidators(context);
	registerCompletions(context);
}

export function deactivate() {
	console.log('Vib extension is now inactive!');
}