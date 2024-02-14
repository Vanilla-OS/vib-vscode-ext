import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

/**
 * Check if the path exists in the workspace
 * @param includePath The path to check
 * @returns True if the path exists, false otherwise
 */
export function checkWorkPathExists(includePath: string): boolean {
    const fullPath = path.join(vscode.workspace.rootPath || '', includePath);
    return fs.existsSync(fullPath);
}

/**
 * Check if the path exists in the workspace with the given possible extensions
 * @param includePath The path to check
 * @param extensions The extensions to check
 * @returns True if the path exists, false otherwise
 */
export function checkWorkPathExistsWithExts(includePath: string, extensions: string[]): boolean {
    const fullPath = path.join(vscode.workspace.rootPath || '', includePath);
    return fs.existsSync(fullPath) || extensions.some(ext => fs.existsSync(`${fullPath}${ext}`));
}

/**
 * Check if the path exists
 * @param fullPath The path to check
 * @returns True if the path exists, false otherwise
 */
export function checkPathExists(fullPath: string): boolean {
    return fs.existsSync(fullPath);
}