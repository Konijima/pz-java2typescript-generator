import { writeFileSync } from "fs";
import { join } from "path";
import { IJSONGeneratorOptions } from "../interfaces/IJSONGeneratorOptions";
import { javapGroup } from "./ClassProcessor";
import { deleteAndCreateDir, getAllFiles } from "./Utilities";

export async function generateJSON(options: IJSONGeneratorOptions) {
    console.log("Generating JSON task...");

    const files = getAllFiles(options.inputPath, ".class");
    deleteAndCreateDir(options.outputPath);

    const packs: string[][] = [];
    files.forEach((file: string) => {
        let lastPack = packs[packs.length - 1];
        if (!lastPack || lastPack.length >= options.size) {
            packs.push([]);
            lastPack = packs[packs.length - 1];
        }
        lastPack.push(file);
    });

    for (const pack of packs) {
        const fileClasses = await javapGroup(pack);
        for (const filePath of Object.keys(fileClasses)) {
            const fileName = filePath.replaceAll('\\', '/').replace(options.inputPath + '/', "").replace(".class", ".json").replaceAll("/", ".");
            const savePath = join(options.outputPath, fileName);
            const data = fileClasses[filePath];
            if (data) {
                console.log(`File ${fileName} has been generated!`);
                writeFileSync(savePath, JSON.stringify(data, null, 2), { encoding: 'utf-8' });
            }
            else console.warn(`File ${fileName} could not be generated!`);
        }
    }
}
