import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from "fs"
import { join } from "path";

/**
 * Parse process arguments
 * @param argv 
 * @returns 
 */
export function parseArgv() {
    const args = (process.argv.join(" ")).replace(/\s(?=(?:[^'"`]*(['"`]).*?\1)*[^'"`]*$)/g, '\n').split('\n');
    return {
        json: args.includes("-json"),
        ts: args.includes("-ts"),
        size: (() => {
            const index = args.indexOf("-size");
            return (index > -1) ? parseInt(args[index + 1]) : null;
        })(),
        src: (() => {
            const index = args.indexOf("-src");
            return (index > -1) ? args[index + 1].replaceAll(/[\"'`]/g, '').replaceAll('\\', '/') : null;
        })(),
        out: (() => {
            const index = args.indexOf("-out");
            return (index > -1) ? args[index + 1].replaceAll(/[\"'`]/g, '').replaceAll('\\', '/') : null;
        })()
    }
}

/**
 * Delete and create Directory
 * @param path 
 */
export function deleteAndCreateDir(path: string) {
    if (existsSync(path)) {
        console.log(`Deleting ${path} ...`);
        rmSync(path, { force: true, recursive: true });
    }
    console.log(`Create ${path} ...`);
    mkdirSync(path, { recursive: true });
}

/**
 * Pause the process for X amount of miliseconds
 * @param ms 
 * @returns 
 */
export function sleep(ms = 1) {
    return new Promise((resolve: Function) => {
        setTimeout(() => resolve(), ms);
    })
}

/**
 * Get all files recursivly filtering by extension
 * @param dirPath 
 * @param extention 
 * @param arrayOfFiles 
 * @returns 
 */
export function getAllFiles(dirPath: string, extention?: string, arrayOfFiles?: string[]) {
    const files = readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach((file: string) => {
        const fullPath = join(dirPath, "/", file);
        if (statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, extention, arrayOfFiles);
        } else if (fullPath.endsWith(extention || "")) {
            arrayOfFiles?.push(fullPath);
        }
    });

    return arrayOfFiles;
}

/**
 * Trim string function
 * @param str 
 * @returns 
 */
export function trimStr(str: string) {
    return str.trim();
}

/**
 * Get class name without package
 * @param name 
 * @returns 
 */
export function nameClassWithoutPackage(name: string) {
    const nameWithoutPackage = name.split('.');
    return nameWithoutPackage[nameWithoutPackage.length - 1];
}
