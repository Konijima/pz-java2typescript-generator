import { IConstructor } from "../interfaces/IConstructor";
import { generateType } from "./Type";

export function generateContructor(constructor: IConstructor) {
    let result: string[] = [];

    let classLine = "            constructor";
    classLine += `(${constructor.args.map((a, i) => `arg${i}: ${generateType(a)}`).join(", ")});\n`;

    result.push(classLine);

    return result.join('\n');
}
