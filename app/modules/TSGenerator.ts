import path, { basename, dirname, join } from "path";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { deleteAndCreateDir, getAllFiles } from "./Utilities";
import { IClass } from "../interfaces/IClass";
import { generateClass } from "../types/Class";

export async function generateTS(inputPath: string, outputPath: string) {
    console.log("Generating TS task...");

    let completed = 0;

    deleteAndCreateDir(outputPath);
    const files = getAllFiles(inputPath, ".json");

    const packages: string[] = [];
    for (const file of files) {
        const pack = dirname(basename(file.replaceAll('\\', '/')).replace('.json', '').replaceAll('.', '/')).replaceAll('/', '.');
        if (!packages.includes(pack)) {
            packages.push(pack);

            let result: string[] = [];
            result.push(`declare module Zomboid {`);
            result.push(`    export namespace ${pack} {`);
            result.push(`[CLASSES]`);
            result.push(`    }`);
            result.push(`}`);
            
            writeFileSync(join(outputPath, pack + '.d.ts'), result.join('\n'), { encoding: 'utf-8' });
        }
    }

    for (const pack of packages) {
        const packClasses: string[] = [];

        for (const file of files) {
            const _pack = dirname(basename(file.replaceAll('\\', '/')).replace('.json', '').replaceAll('.', '/')).replaceAll('/', '.');
            if (pack != _pack) continue;

            const content = readFileSync(file, "utf-8");
            const clazz = JSON.parse(content) as IClass;
    
            let result: string[] = [];
            result = result.concat(generateClass(clazz));
            
            packClasses.push(result.join("\n"));
        }

        const content = readFileSync(join(outputPath, pack + '.d.ts'), "utf-8");
        writeFileSync(join(outputPath, pack + '.d.ts'), content.replace('[CLASSES]', packClasses.join('\n\n')), { encoding: 'utf-8' });
        packClasses.splice(0, packClasses.length);
        completed++;

        // Progress Print
        const newPrint = `Progress: ${Math.round(completed / packages.length * 100)}%`;
        console.log(newPrint, `(${completed}/${packages.length})`);
    }
}
