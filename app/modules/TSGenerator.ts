import path from "path";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { deleteAndCreateDir, getAllFiles } from "./Utilities";

export async function generateTS(inputPath: string, outputPath: string) {
    console.log("Generating TS task...");

    let completed = 0;

    deleteAndCreateDir(outputPath);
    const files = getAllFiles(inputPath, ".json");

    for (const file of files) {
        const content = readFileSync(file, "utf-8");
        const json = JSON.parse(content);
        const nameSplit = path.basename(file).replace(".json", "").split(".");
        const name = nameSplit[nameSplit.length - 1];
        const packagePath = json.package.replaceAll(".", "/");

        let result = "";

        // Prepare package directory
        mkdirSync(path.join(outputPath, packagePath), {
            recursive: true
        });

        let describe = json.describe.join(" ").replace("final", "");

        result += `declare module Zomboid {\n`;
        result += `\texport namespace ${json.package} {\n`;
        result += (json.type === "class" && !describe.includes("abstract")) ? `\t\t/** @customConstructor ${name}.new */\n` : "";
        result += `\t\texport${(describe) ? " " + describe : ""} ${json.type} ${name}${(json.extends.length) ? " extends " + json.extends.join(", ") : ""}${(json.implements.length) ? " implements " + json.implements.join(", ") : ""} {\n`;
        
        result += `\t\t\t\n`; // temp

        result += `\t\t}\n`;
        result += `\t}\n`;
        result += `}\n`;

        // Write type definition file
        writeFileSync(path.join(outputPath, packagePath, name + ".d.ts"), result, { encoding: "utf-8" });
        completed++;

        // Progress Print
        const newPrint = `Progress: ${Math.round(completed / files.length * 100)}%`;
        console.log(newPrint, `(${completed}/${files.length})`);
    }
}
