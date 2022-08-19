import { IMethod } from "../interfaces/IMethod";
import { generateType } from "./Type";

export function generateMethod(method: IMethod): string {
    const _static = method.describe.includes("static");
    
    let result: string[] = [];

    if (_static) result.push(`            /** @noSelf */`);

    let classLine = "            ";
    classLine += (method.scope) ? `${method.scope} ` : '';
    classLine += (_static) ? `static ` : '';
    classLine += method.name;
    classLine += `(${method.args.map((a, i) => `arg${i}: ${generateType(a)}`).join(", ")})`;
    classLine += `: ${generateType(method.returnType)};\n`;

    result.push(classLine);

    return result.join('\n');
};
