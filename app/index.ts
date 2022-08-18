import { join } from "path";
import { generateJSON } from "./modules/JSONGenerator";
import { generateTS } from "./modules/TSGenerator";
import { parseArgv } from "./modules/Utilities";

const ARGS = parseArgv();
const SRC_PATH = join(__dirname, "src");
const JSON_PATH = join(__dirname, "json");
const OUT_PATH = join(__dirname, "out");

(async function() {

    console.log("Java Generator initializing...");

    const START_TIME = Date.now();

    if (ARGS.json) await generateJSON(SRC_PATH, JSON_PATH);

    if (ARGS.ts) await generateTS(JSON_PATH, OUT_PATH);

    console.log(`Completed in ${(Date.now() - START_TIME) / 1000} seconds!`);

})();
