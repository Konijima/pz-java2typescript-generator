import path from "path";
import { mkdir, writeFile } from "fs";
import { javap } from "./ClassProcessor";
import { deleteAndCreateDir, getAllFiles, sleep } from "./Utilities";

export async function generateJSON(inputPath: string, outputPath: string) {
    console.log("Generating JSON task...");

    let processCount = 0;
    let completed = 0;
    let lastPrint = "";

    const files = getAllFiles(inputPath, ".class");
    deleteAndCreateDir(outputPath);

    for (const file of files) {
        const savePath = path.join(outputPath, file.replace(inputPath + "\\", "").replace(".class", ".json").replaceAll("\\", "."));
        processCount++;
        javap(file)
            .then(data => {
                if (data) {
                    mkdir(path.dirname(savePath), {
                        recursive: true
                    }, 
                    () => writeFile(savePath, JSON.stringify(data, null, 2), {
                        encoding: "utf-8"
                    }, 
                    () => {

                    }));
                }
                completed++;
                processCount--;
            })
            .catch(error => {
                completed++;
                processCount--;
                console.error(error);
            })
        
        // Wait
        let wait = processCount > 10;
        while (wait) {
            await sleep(100);
            wait = processCount > 0;
        }

        // Progress Print
        const newPrint = `Progress: ${Math.round(completed / files.length * 100)}%`;
        if (lastPrint !== newPrint) {
            lastPrint = newPrint;
            console.log(newPrint, `(${completed}/${files.length})`);
        }
    }
}
