import { generateJSON } from "./modules/JSONGenerator";
import { generateTS } from "./modules/TSGenerator";
import { parseArgv } from "./modules/Utilities";

const ARGS = parseArgv();
const SRC_PATH = ARGS.src || "src/";
const JSON_PATH = "json/";
const OUT_PATH = ARGS.out || "out/";
const SIZE = ARGS.size || 100;

(async function() {

    console.log("==========================================");
    console.log("PZ Java 2 Typescript Generator by Konijima");
    console.log("==========================================");
    console.log("SRC path  :", SRC_PATH);
    console.log("JSON path :", JSON_PATH);
    console.log("OUT path  :", OUT_PATH);
    console.log("Size      :", SIZE);
    console.log("==========================================");

    const START_TIME = Date.now();

    if (ARGS.json) await generateJSON({
        inputPath: SRC_PATH, 
        outputPath: JSON_PATH,
        size: SIZE
    });

    if (ARGS.ts) await generateTS(JSON_PATH, OUT_PATH);

    console.log(`Completed in ${(Date.now() - START_TIME) / 1000} seconds!`);

})();
