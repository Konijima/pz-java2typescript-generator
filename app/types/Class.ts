import { IClass } from "../interfaces/IClass";
import { generateContructor } from "./Constructor";
import { generateField } from "./Field";
import { generateMethod } from "./Method";
import { generateType } from "./Type";

export function generateClass(clazz: IClass) {
    const _static = clazz.describe.includes("static");
    const _abstract = clazz.describe.includes("abstract");
    const _enum = clazz.extends.some(e => e.startsWith('java.lang.Enum'));
    const _extends = clazz.extends.map(e => generateType(e)).filter(i => i != undefined);
    const _implements = clazz.implements.map(i => generateType(i)).filter(i => i != undefined);
    const _constructors = clazz.constructors.map(c => generateContructor(c));
    const _fields = clazz.fields.map(f => generateField(f));
    const _methods = clazz.methods.map(m => generateMethod(m));

    if (clazz.name == "Metabolics") console.log(clazz);

    let result: string[] = [];

    if (!_static && !_abstract && !_enum) {
        result.push(`        /** @customConstructor ${clazz.name}.new */`)
    }
    else if (_enum) {
        result.push(`        /** [ENUM] */`)
    }

    let classLine = "        export ";
    classLine += (_static) ? `static ` : '';
    classLine += (_abstract) ? `abstract ` : '';
    classLine += `${clazz.type} `;
    classLine += (clazz.name) ? `${clazz.name}` : '';
    classLine += (!_enum && _extends.length > 0) ? ' extends ' + _extends.join(', ') : '';
    classLine += (!_enum && _implements.length > 0) ? ' implements ' + _implements.join(', ') : '';
    classLine += ' {';
    result.push(classLine);

    if (_enum) result.push('            protected constructor();\n');
    else result = result.concat(_constructors);

    if (_enum) result = result.concat(_fields);
    result = result.concat(_methods);

    result.push(`        }`);
    
    return result;
};
