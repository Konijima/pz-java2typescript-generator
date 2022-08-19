import path from "path";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { deleteAndCreateDir, getAllFiles } from "./Utilities";
import { IClass } from "../interfaces/IClass";
import { generateClass } from "../types/Class";

export async function generateTS(inputPath: string, outputPath: string) {
    console.log("Generating TS task...");

    let completed = 0;

    deleteAndCreateDir(outputPath);
    const files = getAllFiles(inputPath, ".json");

    for (const file of files) {
        const content = readFileSync(file, "utf-8");
        const clazz = JSON.parse(content) as IClass;
        const nameSplit = path.basename(file).replace(".json", "").split(".");
        const name = nameSplit[nameSplit.length - 1];
        const packagePath = clazz.package.replaceAll(".", "/");

        let result: string[] = [];

        result.push(`declare module Zomboid {`);
        result.push(`    export namespace ${clazz.package} {`);

        result = result.concat(generateClass(clazz));

        result.push(`    }`);
        result.push(`}`);

        // Prepare package directory
        mkdirSync(path.join(outputPath, packagePath), { recursive: true });

        // Write type definition file
        writeFileSync(path.join(outputPath, packagePath, name + ".d.ts"), result.join("\n"), { encoding: "utf-8" });
        completed++;

        // Progress Print
        const newPrint = `Progress: ${Math.round(completed / files.length * 100)}%`;
        console.log(newPrint, `(${completed}/${files.length})`);
    }
}
