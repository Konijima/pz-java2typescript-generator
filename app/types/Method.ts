import { IMethod } from "../interfaces/IMethod";
import { generateType } from "./Type";

export function generateMethod(method: IMethod): string {
    const _static = method.describe.includes("static");
    
    let result: string[] = [];

    if (_static) result.push(`            /** @noSelf */`);

    let methodLine = "            ";
    methodLine += (method.scope) ? `${method.scope} ` : '';
    methodLine += (_static) ? `static ` : '';
    methodLine += method.name;
    methodLine += `(${method.args.map((a, i) => `arg${i}: ${generateType(a)}`).join(", ")})`;
    methodLine += `: ${generateType(method.returnType)};\n`;

    result.push(methodLine);

    return result.join('\n');
};
