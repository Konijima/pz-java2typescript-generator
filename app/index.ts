import { generateJSON } from "./modules/JSONGenerator";
import { generateTS } from "./modules/TSGenerator";
import { parseArgv } from "./modules/Utilities";

const ARGS = parseArgv();
const SRC_PATH = ARGS.src || "src";
const JSON_PATH = "json";
const OUT_PATH = ARGS.out || "out";

(async function() {

    console.log("Java Generator initializing...");
    console.log("Args: ", ARGS);

    const START_TIME = Date.now();

    if (ARGS.json) await generateJSON({
        inputPath: SRC_PATH, 
        outputPath: JSON_PATH,
        size: ARGS.size || 100
    });

    if (ARGS.ts) await generateTS(JSON_PATH, OUT_PATH);

    console.log(`Completed in ${(Date.now() - START_TIME) / 1000} seconds!`);

})();
