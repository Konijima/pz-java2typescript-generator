import { IClass } from "../interfaces/IClass";
import { generateMethod } from "./Method";
import { generateType } from "./Type";

export function generateClass(clazz: IClass) {
    const _static = clazz.describe.includes("static");
    const _abstract = clazz.describe.includes("abstract");
    const _extends = clazz.extends.map(e => generateType(e)).filter(i => i != undefined);
    const _implements = clazz.implements.map(i => generateType(i)).filter(i => i != undefined);
    const _methods = clazz.methods.map(m => generateMethod(m));

    let result: string[] = [];

    if (!_static && !_abstract) {
        result.push(`        /** @customConstructor ${clazz.name}.new */`)
    }

    let classLine = "        export ";
    classLine += (_static) ? `static ` : '';
    classLine += (_abstract) ? `abstract ` : '';
    classLine += `${clazz.type} `;
    classLine += (clazz.name) ? `${clazz.name}` : '';
    classLine += (_extends.length > 0) ? ' extends ' + _extends.join(', ') : '';
    classLine += (_implements.length > 0) ? ' implements ' + _implements.join(', ') : '';
    classLine += ' {';
    result.push(classLine);

    result = result.concat(_methods);

    result.push(`        }`);
    
    return result;
};
