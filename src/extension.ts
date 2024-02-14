import * as vscode from 'vscode';
import { registerValidators } from './validators/validatorsInit';

export function activate(context: vscode.ExtensionContext) {
	console.log('Vib extension is now active!');
	registerValidators(context);
}

export function deactivate() {
	console.log('Vib extension is now inactive!');
}